#!/usr/bin/env python3
import json, pathlib, re, datetime
from content_readiness import answer_eligible, summarize
ROOT=pathlib.Path(__file__).resolve().parents[1]
items=sorted((ROOT/"data/items").glob("*.json"))
batches=sorted((ROOT/"data/staging/batches").glob("*.json"))
manifests=sorted((ROOT/"data/staging/manifests").glob("*.json"))
# Ordered highest-to-lowest so reconciliation and serialized metrics are
# deterministic across Python processes (a set's iteration order is randomized).
PIPE=("Verified","Linked","Parsed","Indexed","Discovered")
def identity_keys(d):
    if not isinstance(d,dict): return []
    out=[]
    loc=d.get("locator") or {}
    prov=d.get("provenance") or {}
    url=d.get("source_url") or (prov.get("source_url") if isinstance(prov,dict) else None)
    aid=d.get("aid") or (loc.get("aid") if isinstance(loc,dict) else None)
    if not aid and url:
        match=re.search(r"/aid/(\d+)(?:/|$)",str(url))
        if match: aid=match.group(1)
    if aid: out.append("aid:"+str(aid))
    if url: out.append("url:"+str(url))
    if d.get("staging_stable_key"): out.append(str(d["staging_stable_key"]))
    if d.get("id"): out.append("id:"+str(d["id"]))
    return list(dict.fromkeys(out))

def is_source_record(d):
    # Nested provenance/access/taxonomy dictionaries are metadata, not separate source identities.
    # Count only item-shaped records with a stable item marker.
    if not isinstance(d,dict): return False
    markers=("id","aid","title","summary_researcher","pipeline_status","source_class","evidence_family_id","response_propositions")
    return any(d.get(k) not in (None,"",[]) for k in markers) or isinstance(d.get("locator"),dict)

def stable_key(d):
    ks=identity_keys(d)
    return ks[0] if ks else None
def status_of(d):
    vals=[d.get("pipeline_status"),d.get("verification_status")]
    p=d.get("provenance")
    if isinstance(p,dict): vals.append(p.get("verification_status"))
    s=" ".join(str(v) for v in vals if v)
    if re.search(r"\bunverified\b",s,re.I): return None
    if re.search(r"\bverified\b",s,re.I): return "Verified"
    for x in PIPE:
        if x in s: return x
    return d.get("pipeline_status") if d.get("pipeline_status") in PIPE else None
seen={}; evidence_files=0
for fp in items:
    try: obj=json.loads(fp.read_text(encoding="utf-8"))
    except Exception: continue
    if "evidence-family" in fp.name or (isinstance(obj,dict) and str(obj.get("type","")).lower()=="evidencefamily"):
        evidence_files+=1; continue
    stack=[obj]
    while stack:
        x=stack.pop()
        if isinstance(x,dict):
            if is_source_record(x):
                st=status_of(x); key=stable_key(x)
                if key and (st or x.get("source_url") or x.get("aid") or isinstance(x.get("locator"),dict)):
                    old=seen.get(key); rank={"Discovered":1,"Indexed":2,"Parsed":3,"Linked":4,"Verified":5,None:0}
                    if old is None or rank.get(st,0)>rank.get(old,0): seen[key]=st
            for v in x.values():
                if isinstance(v,(dict,list)): stack.append(v)
        elif isinstance(x,list): stack.extend(x)
canonical_identity_keys=set()
for fp in items:
    try: obj=json.loads(fp.read_text(encoding="utf-8"))
    except Exception: continue
    stack=[obj]
    while stack:
        x=stack.pop()
        if isinstance(x,dict):
            if is_source_record(x):
                canonical_identity_keys.update(identity_keys(x))
            for v in x.values():
                if isinstance(v,(dict,list)): stack.append(v)
        elif isinstance(x,list): stack.extend(x)

status_counts={k:0 for k in PIPE}
for st in seen.values():
    if st in status_counts: status_counts[st]+=1

# Reconcile staging against canonical by stable item identity. A stale promotion_queue=true
# must never inflate the actionable backlog after that item has already been promoted.
staging_records=0; promotion_ready=0; promotion_queue_physical=0; already_canonical_queued=0
promotion_ready_by_batch=[]
for fp in batches:
    try: obj=json.loads(fp.read_text(encoding="utf-8"))
    except Exception: continue
    recs=obj.get("records") if isinstance(obj,dict) else None
    if isinstance(recs,list):
        staging_records+=len(recs)
        actionable=[]
        for r in recs:
            if not isinstance(r,dict) or r.get("promotion_queue") is not True: continue
            promotion_queue_physical+=1
            keys=identity_keys(r)
            key=keys[0] if keys else None
            if any(k in canonical_identity_keys for k in keys):
                already_canonical_queued+=1
                continue
            promotion_ready+=1
            actionable.append({"staging_id":r.get("staging_id") or r.get("id"),"key":key,"source_url":r.get("source_url"),"verification_status":r.get("verification_status"),"context_status":r.get("context_status")})
        if actionable:
            promotion_ready_by_batch.append({"batch":str(fp.relative_to(ROOT)),"count":len(actionable),"records":actionable})
    elif isinstance(obj,dict):
        m=obj.get("manifest") or {}
        if isinstance(m,dict) and isinstance(m.get("record_count"),int): staging_records+=m["record_count"]
state_path=ROOT/"data/project-state.json"; state=json.loads(state_path.read_text(encoding="utf-8")); counts=state.get("current_counts") or {}
external=counts.get("external_inventory_mapped_minimum") or counts.get("external_discovery_records_reported_nonoverlap_minimum")
today=datetime.date.today().isoformat()
out={"generated":today,"external_inventory_mapped_minimum":external,"staging_batch_files":len(batches),"staging_manifest_files":len(manifests),"staging_records_physical_sum":staging_records,"promotion_queue_physical_records":promotion_queue_physical,"promotion_queue_already_canonical":already_canonical_queued,"promotion_ready_records":promotion_ready,"canonical_json_files":len(items),"canonical_unique_item_keys":len(seen),"evidence_family_files":evidence_files,"status_counts_unique_keys":status_counts,"verified_unique_item_keys":status_counts["Verified"],"counting_note":"Automated filesystem reconciliation. Unique item counts deduplicate by AID, then source URL, then ID. promotion_ready_records excludes stale staging queue flags whose stable item key already exists in canonical. Evidence-family files are counted separately."}
(ROOT/"data/public-metrics.json").write_text(json.dumps(out,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
(ROOT/"data/promotion-ready-reconciled.json").write_text(json.dumps({"generated":today,"identity_policy":"match any stable AID, source URL, staging stable key, or ID","actionable_count":promotion_ready,"already_canonical_queued":already_canonical_queued,"batches":sorted(promotion_ready_by_batch,key=lambda x:(-x["count"],x["batch"]))},ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
state["current_counts"]={"external_inventory_mapped_minimum":external,"staging_batch_files":out["staging_batch_files"],"staging_manifest_files":out["staging_manifest_files"],"staging_records_physical_sum":out["staging_records_physical_sum"],"promotion_queue_physical_records":promotion_queue_physical,"promotion_queue_already_canonical":already_canonical_queued,"promotion_ready_records":out["promotion_ready_records"],"canonical_json_files":out["canonical_json_files"],"canonical_unique_item_keys":out["canonical_unique_item_keys"],"evidence_family_files":out["evidence_family_files"],"verified_unique_item_keys":out["verified_unique_item_keys"],"status_counts_unique_keys":out["status_counts_unique_keys"]}
if isinstance(state.get("verification_surge"),dict): state["verification_surge"]["current_promotion_ready_backlog"]=promotion_ready
state["last_updated"]=today
state_path.write_text(json.dumps(state,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print(json.dumps(out,ensure_ascii=False))

search_entries={}
def flatten_terms(v):
    if v is None:return []
    if isinstance(v,str):return [v]
    if isinstance(v,(int,float)):return [str(v)]
    if isinstance(v,list):
        z=[]
        for x in v:z.extend(flatten_terms(x))
        return z
    if isinstance(v,dict):
        z=[]
        for x in v.values():z.extend(flatten_terms(x))
        return z
    return []
def candidate_dicts(obj):
    out=[]; stack=[obj]
    while stack:
        x=stack.pop()
        if isinstance(x,dict):
            if is_source_record(x) and stable_key(x) and (x.get("title") or x.get("summary_researcher") or x.get("source_url") or isinstance(x.get("provenance"),dict)):out.append(x)
            for v in x.values():
                if isinstance(v,(dict,list)):stack.append(v)
        elif isinstance(x,list):stack.extend(x)
    return out
rank={"Discovered":1,"Indexed":2,"Parsed":3,"Linked":4,"Verified":5,None:0}
for fp in items:
    try:obj=json.loads(fp.read_text(encoding="utf-8"))
    except Exception:continue
    if "evidence-family" in fp.name or (isinstance(obj,dict) and str(obj.get("type","")).lower()=="evidencefamily"):continue
    for x in candidate_dicts(obj):
        key=stable_key(x)
        if not key:continue
        st=status_of(x); prov=x.get("provenance") if isinstance(x.get("provenance"),dict) else {}; access=x.get("access") if isinstance(x.get("access"),dict) else {}; tax=x.get("taxonomy") if isinstance(x.get("taxonomy"),dict) else {}; loc=x.get("locator") if isinstance(x.get("locator"),dict) else {}; prop=x.get("propositions") if isinstance(x.get("propositions"),dict) else {}
        summary=x.get("summary_researcher") or x.get("summary") or x.get("description") or ""
        raw_context=x.get("context_status") or "unknown"
        context_status={"complete":"complete","partial":"partial","unknown":"unknown","substantial":"partial"}.get(str(raw_context).lower(),"unknown")
        verification_scope=x.get("verification_scope") or prov.get("verification_scope") or prov.get("textual_status") or prov.get("editorial_scope")
        witness_provenance=x.get("witness_provenance") or x.get("source_witness") or prov.get("source_witness") or x.get("witness_type")
        explicit_props=x.get("response_propositions") or prop.get("response_propositions") or []
        explicit_content_flag=x.get("has_content_evidence") if "has_content_evidence" in x else prop.get("has_content_evidence")
        # summary_researcher/summary may be used only as an explicitly DERIVED
        # editorial proposition when the item has both scope and witness provenance.
        # It is never represented as a verbatim quotation or independent witness.
        if explicit_content_flag is False:
            response_props=[]
            proposition_origin=x.get("proposition_origin") or prop.get("proposition_origin")
            proposition_verbatim=x.get("proposition_verbatim") if "proposition_verbatim" in x else prop.get("proposition_verbatim")
        elif explicit_props:
            response_props=explicit_props
            proposition_origin=x.get("proposition_origin") or prop.get("proposition_origin") or "explicit_proposition_field"
            proposition_verbatim=x.get("proposition_verbatim") if "proposition_verbatim" in x else prop.get("proposition_verbatim")
        elif summary and verification_scope and witness_provenance:
            response_props=[summary]
            proposition_origin="editorial_summary_derived"
            proposition_verbatim=False
        else:
            response_props=[]
            proposition_origin=None
            proposition_verbatim=None
        source_url=x.get("source_url") or prov.get("source_url")
        aid_value=x.get("aid") or loc.get("aid")
        if not aid_value and source_url:
            match=re.search(r"/aid/(\d+)(?:/|$)",str(source_url))
            if match: aid_value=int(match.group(1))
        search_status=st or x.get("pipeline_status") or x.get("verification_status") or "unknown"
        integrity_issues=[]
        # Canonical pipeline status and search-answer eligibility are separate.
        # A bibliographically Verified item lacking explicit scope/provenance must
        # not receive a content-level Verified boost in the answer engine.
        if response_props and search_status=="Verified":
            if not verification_scope: integrity_issues.append("verified_content_missing_scope")
            if not witness_provenance: integrity_issues.append("verified_content_missing_witness_provenance")
            if integrity_issues: search_status="Linked"
        entry={"key":key,"id":x.get("id"),"title":x.get("title") or x.get("id") or key,"summary":summary,"source_class":x.get("source_class") or x.get("collection") or x.get("type"),"type":x.get("type") or prop.get("type"),"collection":x.get("collection") or prop.get("collection"),"original_language":x.get("original_language") or prop.get("original_language"),"translation_status":x.get("translation_status") or prop.get("translation_status"),"independent_witness":x.get("independent_witness") if "independent_witness" in x else prop.get("independent_witness"),"parent_evidence_family_id":x.get("parent_evidence_family_id") or prop.get("parent_evidence_family_id"),"translation_of_evidence_family_id":x.get("translation_of_evidence_family_id") or prop.get("translation_of_evidence_family_id"),"witness_type":x.get("witness_type") or prop.get("witness_type"),"status":search_status,"canonical_status":st or x.get("pipeline_status") or x.get("verification_status") or "unknown","context_status":context_status,"context_status_raw":raw_context if str(raw_context).lower()!=context_status else None,"date":x.get("date_original") or x.get("event_date") or x.get("event_date_hebrew"),"language":x.get("language") or "unknown","source_url":source_url,"aid":aid_value,"locator":loc or x.get("locator"),"rights_status":x.get("rights_status") or access.get("rights_status"),"publisher_terms":tax.get("publisher_index_terms") or [],"research_terms":tax.get("research_terms") or [],"relations":x.get("relations") if isinstance(x.get("relations"),list) else [],"canonical_file":str(fp.relative_to(ROOT)),"documented_circumstances":x.get("documented_circumstances") or prop.get("documented_circumstances"),"question_or_problem":x.get("question_or_problem") or prop.get("question_or_problem"),"response_propositions":response_props,"response_proposition_locators":x.get("response_proposition_locators") or prop.get("response_proposition_locators") or [],"conditions_or_qualifications":x.get("conditions_or_qualifications") or prop.get("conditions_or_qualifications") or [],"audience":x.get("audience") or prop.get("audience"),"verification_scope":verification_scope,"witness_provenance":witness_provenance,"evidence_family_id":x.get("evidence_family_id") or prop.get("evidence_family_id"),"primary_secondary_status":x.get("primary_secondary_status") or prop.get("primary_secondary_status"),"has_content_evidence":bool(response_props) and explicit_content_flag is not False,"proposition_origin":proposition_origin,"proposition_verbatim":proposition_verbatim,"evidence_integrity_issues":integrity_issues}
        if response_props and proposition_origin != "editorial_summary_derived":
            entry["proposition_verification"]=x.get("proposition_verification") or prop.get("proposition_verification")
            entry["proposition_source_locator"]=x.get("proposition_source_locator") or prop.get("proposition_source_locator")
        entry["search_text"]=" ".join(flatten_terms([entry["title"],entry["summary"],entry["source_class"],entry["date"],entry["language"],entry["publisher_terms"],entry["research_terms"],entry["question_or_problem"],entry["response_propositions"],entry["conditions_or_qualifications"],entry["audience"],entry["aid"],entry["locator"]]))
        old=search_entries.get(key)
        # Prefer inspected answer evidence over a duplicate catalog-only record.
        # Keep the entire witness together; never mix propositions/context fields.
        priority=lambda e:(bool(answer_eligible(e)),rank.get(e.get("status"),0))
        if old is None or priority(entry)>priority(old):search_entries[key]=entry
search_index={"generated":today,"count":len(search_entries),"entries":sorted(search_entries.values(),key=lambda e:(0 if e.get("status")=="Verified" else 1,str(e.get("date") or ""),str(e.get("title") or "")))}
# This generated index is shipped to browsers; compact JSON cuts repository and
# deployment transfer size without changing any record or field.
(ROOT/"data/public-search-index.json").write_text(json.dumps(search_index,ensure_ascii=False,separators=(",",":"))+"\n",encoding="utf-8")

# Preserve an item-level reconciliation audit for the latest manual content batch.
# The selected batch is discovered dynamically so new manual reviews do not leave
# the audit pinned to a historical filename.
manual_batch_paths=sorted(fp for fp in items if re.fullmatch(r"content-research-batch-\d{3}-\d{4}-\d{2}-\d{2}\.json",fp.name))
batch_path=manual_batch_paths[-1] if manual_batch_paths else None
batch_data=None
if batch_path:
    batch_label=re.search(r"content-research-batch-(\d+)-",batch_path.name).group(1)
    try:
        batch_data=json.loads(batch_path.read_text(encoding="utf-8"))
        target_aids=[str(r.get("aid")) for r in batch_data.get("records",[]) if isinstance(r,dict) and r.get("aid")]
        for update in batch_data.get("existing_identity_updates",[]):
            identity=str(update.get("identity") or update.get("id") or "")
            match=re.search(r"(\d+)$",identity)
            if match: target_aids.append(match.group(1))
        target_aids=list(dict.fromkeys(target_aids))
        audit=[]
        by_aid={aid:[] for aid in target_aids}
        for fp in items:
            try: obj=json.loads(fp.read_text(encoding="utf-8"))
            except Exception: continue
            if "evidence-family" in fp.name or (isinstance(obj,dict) and str(obj.get("type","")).lower()=="evidencefamily"): continue
            for x in candidate_dicts(obj):
                if not isinstance(x,dict) or not (x.get("id") or x.get("evidence_family_id")): continue
                loc=x.get("locator") if isinstance(x.get("locator"),dict) else {}
                aid=str(x.get("aid") or loc.get("aid") or "")
                if aid in by_aid:
                    by_aid[aid].append({
                        "file":str(fp.relative_to(ROOT)),
                        "id":x.get("id"),
                        "evidence_family_id":x.get("evidence_family_id"),
                        "status":status_of(x),
                        "has_content_evidence":bool(x.get("has_content_evidence")),
                        "proposition_count":len(x.get("response_propositions") or []),
                        "proposition_origin":x.get("proposition_origin"),
                        "proposition_verification":x.get("proposition_verification"),
                        "proposition_source_locator":x.get("proposition_source_locator"),
                        "verification_scope":x.get("verification_scope") or ((x.get("provenance") or {}).get("verification_scope") if isinstance(x.get("provenance"),dict) else None),
                        "context_status":x.get("context_status")
                    })
        for aid in target_aids:
            selected=search_entries.get("aid:"+aid)
            audit.append({
                "aid":int(aid),
                "canonical_records_found":len(by_aid[aid]),
                "records":by_aid[aid],
                "selected_index_entry":{
                    "present":bool(selected),
                    "answer_eligible":bool(selected and answer_eligible(selected)),
                    "status":selected.get("status") if selected else None,
                    "evidence_family_id":selected.get("evidence_family_id") if selected else None,
                    "canonical_file":selected.get("canonical_file") if selected else None,
                    "proposition_count":len(selected.get("response_propositions") or []) if selected else 0,
                    "proposition_source_locator":selected.get("proposition_source_locator") if selected else None,
                    "independent_witness":selected.get("independent_witness") if selected else None
                } if selected else {"present":False}
            })
        batch_before=batch_data.get("metrics_before")
        batch_expected=batch_data.get("metrics_expected_after")
        readiness_state=state.setdefault("metrics_integrity",{}).setdefault("answer_readiness",{})
        if isinstance(batch_before,dict):
            readiness_state["before"]={k:batch_before[k] for k in ("answer_eligible_unique_sources","content_verified_unique_sources","answer_eligible_propositions") if k in batch_before}
        if isinstance(batch_expected,dict):
            readiness_state["expected_after"]={k:batch_expected[k] for k in ("answer_eligible_unique_sources","content_verified_unique_sources","answer_eligible_propositions") if k in batch_expected}
        state.setdefault("development_recovery",{})["last_reconciliation"]={
            "batch_id":batch_data.get("batch_id") or batch_label,
            "batch_file":str(batch_path.relative_to(ROOT)),
            "generated":today,
            "batch_record_count":len(target_aids),
            "new_source_identity_count":batch_data.get("new_source_identities"),
            "existing_identities_enriched":batch_data.get("existing_identities_enriched"),
            "source_bodies_inspected":batch_data.get("source_bodies_inspected"),
            "answer_eligible_selected_count":sum(1 for x in audit if x["selected_index_entry"].get("answer_eligible")),
            "selected_unique_evidence_families":len({x["selected_index_entry"].get("evidence_family_id") for x in audit if x["selected_index_entry"].get("answer_eligible") and x["selected_index_entry"].get("evidence_family_id")}),
            "non_independent_selected_count":sum(1 for x in audit if x["selected_index_entry"].get("answer_eligible") and x["selected_index_entry"].get("independent_witness") is False),
            "items":audit
        }
    except Exception as exc:
        state.setdefault("development_recovery",{})["last_reconciliation"]={"batch_id":batch_label,"batch_file":str(batch_path.relative_to(ROOT)),"generated":today,"error":str(exc)}

print("search_index_count",len(search_entries))

# Measure the evidence that can actually answer questions, not index summaries.
out.update(summarize(search_index["entries"]))
state["current_counts"].update({k:out[k] for k in
                              ("answer_eligible_unique_sources","content_verified_unique_sources",
                               "answer_eligible_propositions")})
if isinstance(state.get("metrics_integrity"),dict):
    integrity=state["metrics_integrity"]
    readiness=integrity.setdefault("answer_readiness",{})
    before=readiness.get("before") or {}
    actual={k:out[k] for k in ("answer_eligible_unique_sources","content_verified_unique_sources","answer_eligible_propositions")}
    readiness["actual_after"]=actual
    readiness["actual_delta"]={k:actual[k]-int(before.get(k,actual[k])) for k in actual}
    expected=readiness.get("expected_after") or {}
    readiness["reconciliation_variance"]={k:actual[k]-int(expected.get(k,actual[k])) for k in actual}
    integrity["status"]="reconciled_pending_commit"
    integrity["last_reconciled_at"]=today

actual_metrics={k:out[k] for k in ("answer_eligible_unique_sources","content_verified_unique_sources","answer_eligible_propositions")}
if batch_path and isinstance(batch_data,dict):
    expected=batch_data.get("metrics_expected_after") or {}
    variance={k:actual_metrics[k]-int(expected.get(k,actual_metrics[k])) for k in actual_metrics}
    batch_data["metrics_actual_after"]=actual_metrics
    batch_data["reconciliation_variance"]=variance
    batch_data["reconciliation_status"]="reconciled" if all(v==0 for v in variance.values()) else "reconciled_with_variance"
    batch_data["reconciled_at"]=datetime.datetime.now(datetime.timezone.utc).isoformat()
    batch_path.write_text(json.dumps(batch_data,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    dev=state.setdefault("development_recovery",{})
    summary=dev.get("last_batch_summary")
    if isinstance(summary,dict) and summary.get("batch_id")==batch_data.get("batch_id"):
        summary["metrics_after_actual"]=actual_metrics
        b=summary.get("metrics_before") or {}
        summary["metrics_delta_actual"]={k:actual_metrics[k]-int(b.get(k,actual_metrics[k])) for k in actual_metrics}
        summary["status"]=batch_data["reconciliation_status"]
    last=dev.get("last_reconciliation")
    if isinstance(last,dict) and last.get("batch_id")==batch_data.get("batch_id"):
        last["metrics_actual_after"]=actual_metrics
        last["reconciliation_variance"]=variance
        last["reconciliation_status"]=batch_data["reconciliation_status"]
    acquisition_path=ROOT/"data/acquisition/latest.json"
    if acquisition_path.exists():
        acquisition=json.loads(acquisition_path.read_text(encoding="utf-8"))
        review=acquisition.get("manual_web_review") or {}
        if str(review.get("batch_id"))==str(batch_label):
            review["metrics_actual_after"]=actual_metrics
            review["reconciliation_variance"]=variance
            review["reconciliation_status"]=batch_data["reconciliation_status"]
            acquisition["manual_web_review_current_metrics"]=actual_metrics
            acquisition["last_manual_review_at"]=review.get("reviewed_at") or acquisition.get("last_manual_review_at")
            acquisition_path.write_text(json.dumps(acquisition,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")

ready_keys={e["key"] for e in search_index["entries"] if answer_eligible(e)}
review_candidates=[e for e in search_index["entries"]
                   if e.get("id") and e.get("source_url") and e["key"] not in ready_keys]
queue={"schema":"content-review-queue-v1","generated":today,
       "pending_online_items":len(review_candidates),
       "policy":"Navigation only. Open and inspect the authorized item text before adding "
                "propositions; never infer content from a title or scan index. "
                "A blocked source must be recorded and another candidate tried.",
       "records":[{k:e.get(k) for k in
                   ("key","id","title","source_url","aid","language","canonical_file",
                    "evidence_family_id","verification_scope")}
                  for e in sorted(review_candidates,key=lambda e:(
                      0 if str(e.get("language","")).lower() in {"hebrew","he"} else 1,
                      str(e.get("canonical_file")),str(e["key"])))]}
(ROOT/"data/content-review-queue.json").write_text(json.dumps(queue,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
(ROOT/"data/public-metrics.json").write_text(json.dumps(out,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
state_path.write_text(json.dumps(state,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print("answer_eligible_unique_sources",out["answer_eligible_unique_sources"])
