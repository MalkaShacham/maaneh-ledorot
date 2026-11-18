#!/usr/bin/env python3
import json, pathlib, re, datetime
from content_readiness import answer_eligible, summarize
from status_normalization import status_of
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
    # Nested provenance/access/taxonomy dictionaries and review/audit rows are not
    # canonical source identities. In particular, source_body_review entries can
    # repeat an AID and URL for an existing item; indexing them as a second record
    # creates false canonical_identity_collisions and duplicate search candidates.
    if not isinstance(d,dict): return False
    audit_row = (
        str(d.get("action") or "").startswith("enriched_existing_identity") or str(d.get("action") or "").startswith("duplicate_alias_")
        or d.get("existing_identity") is True
        or d.get("body_text_inspected") is True
        or d.get("inspected_original_language_body") is True
        or ("reason" in d and "handling" in d and "aid" in d)
        or ("canonical_file" in d and "propositions_added" in d and ("total_propositions_after" in d or "aid" in d))
        or ("identity_key" in d and "canonical_records_found" in d)
    )
    if audit_row: return False
    markers=("id","aid","title","summary_researcher","pipeline_status","source_class","evidence_family_id","response_propositions")
    return any(d.get(k) not in (None,"",[]) for k in markers) or isinstance(d.get("locator"),dict)

def stable_key(d):
    ks=identity_keys(d)
    return ks[0] if ks else None
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
all_search_entries=[]
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
            # Existing-identity update descriptors carry AID, item id and Evidence Family
            # for auditability, but they are not additional canonical source records.
            # Counting them here created false collisions (for example AID 2989153)
            # and could let an audit descriptor shadow the actual inspected item.
            audit_descriptor = (
                str(x.get("action") or "").startswith("enriched_existing_identity") or str(x.get("action") or "").startswith("duplicate_alias_")
                or x.get("existing_identity") is True
                or x.get("body_text_inspected") is True
                or x.get("inspected_original_language_body") is True
                or ("reason" in x and "handling" in x and "aid" in x)
                or ("canonical_file" in x and "propositions_added" in x and ("total_propositions_after" in x or "aid" in x))
                or ("identity_key" in x and "canonical_records_found" in x)
            )
            if not audit_descriptor and is_source_record(x) and stable_key(x) and (x.get("title") or x.get("summary_researcher") or x.get("source_url") or isinstance(x.get("provenance"),dict)):out.append(x)
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
        entry={"key":key,"id":x.get("id"),"title":x.get("title") or x.get("id") or key,"summary":summary,"source_class":x.get("source_class") or x.get("collection") or x.get("type"),"type":x.get("type") or prop.get("type"),"collection":x.get("collection") or prop.get("collection"),"original_language":x.get("original_language") or prop.get("original_language"),"translation_status":x.get("translation_status") or prop.get("translation_status"),"independent_witness":x.get("independent_witness") if "independent_witness" in x else prop.get("independent_witness"),"parent_evidence_family_id":x.get("parent_evidence_family_id") or prop.get("parent_evidence_family_id"),"translation_of_evidence_family_id":x.get("translation_of_evidence_family_id") or prop.get("translation_of_evidence_family_id"),"witness_type":x.get("witness_type") or prop.get("witness_type"),"status":search_status,"canonical_status":st or x.get("pipeline_status") or x.get("verification_status") or "unknown","context_status":context_status,"context_status_raw":raw_context if str(raw_context).lower()!=context_status else None,"date":x.get("date_original") or x.get("event_date") or x.get("event_date_hebrew"),"date_precision":x.get("date_precision") or prop.get("date_precision"),"language":x.get("language") or "unknown","proposition_language":x.get("proposition_language") or prop.get("proposition_language"),"source_url":source_url,"aid":aid_value,"locator":loc or x.get("locator"),"rights_status":x.get("rights_status") or access.get("rights_status"),"publisher_terms":tax.get("publisher_index_terms") or [],"research_terms":tax.get("research_terms") or [],"relations":x.get("relations") if isinstance(x.get("relations"),list) else [],"canonical_file":str(fp.relative_to(ROOT)),"documented_circumstances":x.get("documented_circumstances") or prop.get("documented_circumstances"),"question_or_problem":x.get("question_or_problem") or prop.get("question_or_problem"),"response_propositions":response_props,"response_proposition_locators":x.get("response_proposition_locators") or prop.get("response_proposition_locators") or [],"conditions_or_qualifications":x.get("conditions_or_qualifications") or prop.get("conditions_or_qualifications") or [],"audience":x.get("audience") or prop.get("audience"),"verification_scope":verification_scope,"witness_provenance":witness_provenance,"provenance":prov or None,"evidence_family_id":x.get("evidence_family_id") or prop.get("evidence_family_id"),"primary_secondary_status":x.get("primary_secondary_status") or prop.get("primary_secondary_status"),"author_role":x.get("author_role") or prop.get("author_role"),"author_name":x.get("author_name") or prop.get("author_name"),"signatory":x.get("signatory") or prop.get("signatory"),"signatory_role":x.get("signatory_role") or prop.get("signatory_role"),"authorship_status":x.get("authorship_status") or prov.get("authorship_status"),"has_content_evidence":bool(response_props) and explicit_content_flag is not False,"proposition_origin":proposition_origin,"proposition_verbatim":proposition_verbatim,"evidence_integrity_issues":integrity_issues}
        if response_props and proposition_origin != "editorial_summary_derived":
            entry["proposition_verification"]=x.get("proposition_verification") or prop.get("proposition_verification")
            entry["proposition_source_locator"]=x.get("proposition_source_locator") or prop.get("proposition_source_locator")
        # Persist the same content-readiness decision used by reconciliation and answer ranking.
        # Consumers must not infer eligibility from a title, synopsis, or pipeline status.
        entry["answer_eligible"]=bool(answer_eligible(entry))
        entry["search_text"]=" ".join(flatten_terms([entry["title"],entry["summary"],entry["source_class"],entry["author_role"],entry["author_name"],entry["signatory"],entry["signatory_role"],entry["authorship_status"],entry["date"],entry["language"],entry["original_language"],entry["proposition_language"],entry["publisher_terms"],entry["research_terms"],entry["question_or_problem"],entry["response_propositions"],entry["conditions_or_qualifications"],entry["audience"],entry["aid"],entry["locator"]]))
        all_search_entries.append(entry)
        old=search_entries.get(key)
        # Prefer inspected answer evidence over a duplicate catalog-only record.
        # Keep the entire witness together; never mix propositions/context fields.
        priority=lambda e:(bool(answer_eligible(e)),rank.get(e.get("status"),0))
        if old is None or priority(entry)>priority(old):search_entries[key]=entry
search_index={"generated":today,"count":len(search_entries),"entries":sorted(search_entries.values(),key=lambda e:(0 if e.get("status")=="Verified" else 1,str(e.get("date") or ""),str(e.get("title") or "")))}
# This generated index is shipped to browsers; compact JSON cuts repository and
# deployment transfer size without changing any record or field.
(ROOT/"data/public-search-index.json").write_text(json.dumps(search_index,ensure_ascii=False,separators=(",",":"))+"\n",encoding="utf-8")

# Reconcile the contiguous pending manual-batch chain ending at the newest batch.
# This prevents a later manual review from leaving the immediately preceding batch pending.
manual_batch_paths=sorted(fp for fp in items if re.fullmatch(r"content-research-batch-\d{3}-\d{4}-\d{2}-\d{2}\.json",fp.name))
manual_batches=[]
for fp in manual_batch_paths:
    try: data=json.loads(fp.read_text(encoding="utf-8"))
    except Exception: continue
    if isinstance(data,dict): manual_batches.append({"path":fp,"data":data})

def is_pending_batch(data):
    return (data.get("reconciliation_status") in ("pending","pending_reconciliation")
            or data.get("status") in ("pending","pending_reconciliation"))

# Reconcile every pending manual batch, not only the contiguous chain ending
# at the newest batch. Older pending batches can otherwise remain un-audited
# forever (and readiness tests correctly reject their missing full-index audit).
selected_batches=[entry for entry in manual_batches if is_pending_batch(entry["data"])]

# Build the all-file identity audit index once. Re-reading and parsing every
# corpus file for every target identity makes a 50-batch reconciliation
# quadratic in file I/O and can stall the Actions runner.
identity_record_index={}
for fp in items:
    try: obj=json.loads(fp.read_text(encoding="utf-8"))
    except Exception: continue
    if "evidence-family" in fp.name or (isinstance(obj,dict) and str(obj.get("type","")).lower()=="evidencefamily"): continue
    for x in candidate_dicts(obj):
        if not isinstance(x,dict) or not (x.get("id") or x.get("evidence_family_id")): continue
        record_summary={"file":str(fp.relative_to(ROOT)),"id":x.get("id"),"evidence_family_id":x.get("evidence_family_id"),"independent_witness":x.get("independent_witness"),"status":status_of(x),"has_content_evidence":bool(x.get("has_content_evidence")),"proposition_count":len(x.get("response_propositions") or []),"proposition_origin":x.get("proposition_origin"),"proposition_verification":x.get("proposition_verification"),"proposition_source_locator":x.get("proposition_source_locator"),"verification_scope":x.get("verification_scope") or ((x.get("provenance") or {}).get("verification_scope") if isinstance(x.get("provenance"),dict) else None),"context_status":x.get("context_status")}
        for record_key in set(identity_keys(x)):
            identity_record_index.setdefault(record_key,[]).append(record_summary)

reconciliation_audit_history=[]
previous_snapshot_metrics=None
previous_expected_after=None
for selected_index, batch_info in enumerate(selected_batches):
    batch_path=batch_info["path"]; batch_data=batch_info["data"]
    batch_label=re.search(r"content-research-batch-(\d+)-",batch_path.name).group(1)
    target_identities=[]
    def add_target(identity_key, aid=None, item_id=None):
        if identity_key and not any(t["key"]==identity_key for t in target_identities):
            target_identities.append({"key":identity_key,"aid":aid,"id":item_id})
    for record in batch_data.get("records",[]):
        if not isinstance(record,dict): continue
        keys=identity_keys(record); stable=keys[0] if keys else None
        if stable:
            aid=str(record.get("aid") or "")
            add_target(stable,aid if aid else None,record.get("id"))
    for update in batch_data.get("existing_identity_updates",[]):
        aid=str(update.get("aid") or "")
        if aid.isdigit():
            add_target("aid:"+aid,aid,update.get("id"))
        else:
            identity=str(update.get("identity") or update.get("id") or "")
            match=re.search(r"(\d+)$",identity)
            if match: add_target("aid:"+match.group(1),match.group(1),update.get("id"))
            else:
                item_id=str(update.get("id") or identity)
                add_target("id:"+item_id,None,item_id)
    for alias in batch_data.get("identity_alias_audit_targets",[]):
        alias_aid=str(alias.get("alias_aid") or ""); canonical_aid=str(alias.get("canonical_aid") or "")
        if alias_aid.isdigit(): add_target("aid:"+alias_aid,alias_aid,None)
        if canonical_aid.isdigit(): add_target("aid:"+canonical_aid,canonical_aid,None)
    for recheck in batch_data.get("existing_identity_rechecks",[]):
        recheck_aid=str(recheck.get("aid") or "")
        if recheck_aid.isdigit(): add_target("aid:"+recheck_aid,recheck_aid,recheck.get("id"))

    # Exclude later manual batches to calculate the actual corpus snapshot immediately
    # after this batch. Use all entries, not only the final deduplicated index.
    # Exclude every later manual batch file, whether it is pending or was
    # reconciled previously. Historical snapshots must not include later items.
    later_manual_infos=[x for x in manual_batches if x["path"]>batch_path]
    later_paths={str(x["path"].relative_to(ROOT)) for x in later_manual_infos}
    # Later manual batches may append propositions to an earlier canonical
    # item file. Exclude those later additions even when the later batch was
    # already reconciled; otherwise an in-place enrichment leaks backward.
    later_in_place_exclusions={}
    later_batches_with_in_place_updates=[]
    for later_info in later_manual_infos:
        later_data=later_info["data"]
        later_batch_id=str(later_data.get("batch_id") or "")
        for update in later_data.get("existing_identity_updates",[]):
            canonical_file=str(update.get("canonical_file") or "")
            aid=str(update.get("aid") or "")
            if not canonical_file or canonical_file in later_paths or not aid: continue
            before=update.get("existing_propositions_before")
            after=update.get("total_propositions_after")
            excluded=set()
            if isinstance(before,int) and isinstance(after,int) and after>before:
                excluded.update(range(before,after))
            else:
                locators=update.get("locators") or ([update.get("locator")] if update.get("locator") else [])
                for entry in all_search_entries:
                    if entry.get("canonical_file")!=canonical_file or str(entry.get("aid") or "")!=aid: continue
                    entry_locators=entry.get("response_proposition_locators") or []
                    for locator in locators:
                        for prop_index,entry_locator in enumerate(entry_locators):
                            if prop_index not in excluded and str(entry_locator)==str(locator):
                                excluded.add(prop_index);break
            if excluded:
                later_in_place_exclusions.setdefault((canonical_file,aid),set()).update(excluded)
                later_batches_with_in_place_updates.append(later_batch_id)
    snapshot_by_key={}
    for entry in all_search_entries:
        if entry.get("canonical_file") in later_paths: continue
        adjusted=entry
        excluded=later_in_place_exclusions.get((str(entry.get("canonical_file") or ""),str(entry.get("aid") or "")),set())
        if excluded:
            adjusted=dict(entry)
            props=entry.get("response_propositions") or []
            locators=entry.get("response_proposition_locators") or []
            keep=[i for i in range(len(props)) if i not in excluded]
            adjusted["response_propositions"]=[props[i] for i in keep]
            adjusted["response_proposition_locators"]=[locators[i] for i in keep if i<len(locators)]
            if not adjusted["response_propositions"]: adjusted["has_content_evidence"]=False
        key=adjusted.get("key")
        if not key: continue
        old=snapshot_by_key.get(key)
        priority=lambda e:(bool(answer_eligible(e)),rank.get(e.get("status"),0))
        if old is None or priority(adjusted)>priority(old): snapshot_by_key[key]=adjusted
    snapshot_metrics=summarize(list(snapshot_by_key.values()))
    expected_before=batch_data.get("metrics_before") or {}
    # Carry forward the prior actual snapshot only when the expected batch
    # boundaries are contiguous. Across a historical gap, reset to this
    # batch's recorded baseline rather than inventing continuity.
    if previous_snapshot_metrics is not None and previous_expected_after==expected_before:
        actual_before=previous_snapshot_metrics
    else:
        actual_before=expected_before or snapshot_metrics
    readiness_keys=("answer_eligible_unique_sources","content_verified_unique_sources","answer_eligible_propositions")
    batch_data["metrics_actual_before"]={k:int(actual_before.get(k,snapshot_metrics[k])) for k in readiness_keys}
    batch_data["metrics_actual_after"]=snapshot_metrics
    batch_data["metrics_delta_actual"]={k:snapshot_metrics[k]-batch_data["metrics_actual_before"][k] for k in readiness_keys}
    previous_snapshot_metrics=snapshot_metrics
    previous_expected_after=batch_data.get("metrics_expected_after") or {}
    batch_data["reconciliation_snapshot_adjustment"]={
        "excluded_later_in_place_proposition_count":sum(len(v) for v in later_in_place_exclusions.values()),
        "affected_canonical_identity_count":len(later_in_place_exclusions),
        "later_batches_with_in_place_updates":sorted(set(later_batches_with_in_place_updates)),
        "policy":"Historical batch snapshots exclude proposition indices documented by later existing_identity_updates when those updates were written into an earlier canonical file. New later batch files remain excluded by later_paths."
    }

    audit=[]
    for target in target_identities:
        selected=snapshot_by_key.get(target["key"]); matches=identity_record_index.get(target["key"],[])
        family_ids=sorted({r.get("evidence_family_id") for r in matches if r.get("evidence_family_id")})
        same_family_duplicate=len(matches)>1 and len(family_ids)==1 and all(r.get("independent_witness") is False for r in matches)
        identity_collision=len(matches)>1 and not same_family_duplicate
        audit.append({"identity_key":target["key"],"aid":int(target["aid"]) if target.get("aid") and str(target["aid"]).isdigit() else None,"id":target.get("id"),"canonical_records_found":len(matches),"matching_evidence_family_ids":family_ids,"same_family_duplicate":same_family_duplicate,"canonical_identity_collision":identity_collision,"records":matches,"selected_index_entry":{"present":bool(selected),"answer_eligible":bool(selected and answer_eligible(selected)),"status":selected.get("status") if selected else None,"evidence_family_id":selected.get("evidence_family_id") if selected else None,"canonical_file":selected.get("canonical_file") if selected else None,"proposition_count":len(selected.get("response_propositions") or []) if selected else 0,"proposition_source_locator":selected.get("proposition_source_locator") if selected else None,"independent_witness":selected.get("independent_witness") if selected else None} if selected else {"present":False},"current_index_entry":{"present":bool(search_entries.get(target["key"])),"answer_eligible":bool(search_entries.get(target["key"]) and search_entries.get(target["key"]).get("answer_eligible"))}})
    expected=batch_data.get("metrics_expected_after") or {}
    variance={k:snapshot_metrics[k]-int(expected.get(k,snapshot_metrics[k])) for k in ("answer_eligible_unique_sources","content_verified_unique_sources","answer_eligible_propositions")}
    batch_data["reconciliation_variance"]=variance
    batch_data["reconciliation_status"]="reconciled" if all(v==0 for v in variance.values()) else "reconciled_with_variance"
    batch_data["status"]=batch_data["reconciliation_status"]
    batch_data["reconciled_at"]=datetime.datetime.now(datetime.timezone.utc).isoformat()
    dedup=batch_data.get("deduplication_check")
    if isinstance(dedup,dict):
        collisions=[x.get("aid") for x in audit if x.get("canonical_identity_collision")]
        same_family=[{"aid":x.get("aid"),"evidence_family_id":(x.get("matching_evidence_family_ids") or [None])[0],"files":sorted({r.get("file") for r in x.get("records",[]) if r.get("file")})} for x in audit if x.get("same_family_duplicate")]
        missing=[x.get("aid") for x in audit if not x.get("current_index_entry",{}).get("present")]
        historical_missing=[x.get("aid") for x in audit if not x.get("selected_index_entry",{}).get("present")]
        dedup["same_family_duplicate_presentations"]=same_family
        dedup["full_index_scan_available"]=True
        dedup["full_index_scan_pending_reconciliation"]=False
        dedup["full_index_scan_completed_at"]=today
        dedup["reconciled_identity_count"]=len(audit)
        dedup["canonical_identity_collisions"]=collisions
        dedup["missing_canonical_identities"]=missing
        # Canonical presence/eligibility is measured against the current full corpus.
        # Historical snapshots may legitimately omit a later-created canonical item
        # that a prior audit action now points to (for example AID 2989411).
        dedup["missing_at_historical_batch_boundary"]=historical_missing
        dedup["all_target_identities_answer_eligible"]=bool(audit) and all(x.get("current_index_entry",{}).get("answer_eligible") for x in audit)
    state.setdefault("development_recovery",{})["last_reconciliation"]={
        "batch_id":batch_data.get("batch_id") or batch_label,"batch_file":str(batch_path.relative_to(ROOT)),"generated":today,
        "batch_record_count":len(target_identities),"new_source_identity_count":batch_data.get("new_source_identities"),
        "existing_identities_enriched":batch_data.get("existing_identities_enriched"),"source_bodies_inspected":batch_data.get("source_bodies_inspected"),
        "answer_eligible_selected_count":sum(1 for x in audit if x["selected_index_entry"].get("answer_eligible")),
        "selected_unique_evidence_families":len({x["selected_index_entry"].get("evidence_family_id") for x in audit if x["selected_index_entry"].get("answer_eligible") and x["selected_index_entry"].get("evidence_family_id")}),
        "non_independent_selected_count":sum(1 for x in audit if x["selected_index_entry"].get("answer_eligible") and x["selected_index_entry"].get("independent_witness") is False),
        "same_family_duplicate_count":sum(1 for x in audit if x.get("same_family_duplicate")),
        "canonical_identity_collision_count":sum(1 for x in audit if x.get("canonical_identity_collision")),
        "metrics_actual_before":batch_data["metrics_actual_before"],"metrics_actual_after":snapshot_metrics,"metrics_delta_actual":batch_data["metrics_delta_actual"],"reconciliation_variance":variance,"reconciliation_status":batch_data["reconciliation_status"],"items":audit}
    reconciliation_audit_history.append({"batch_id":batch_data.get("batch_id") or batch_label,"batch_file":str(batch_path.relative_to(ROOT)),"metrics_actual_before":batch_data["metrics_actual_before"],"metrics_actual_after":snapshot_metrics,"metrics_delta_actual":batch_data["metrics_delta_actual"],"reconciliation_variance":variance,"reconciliation_status":batch_data["reconciliation_status"],"identity_count":len(audit),"batch_record_count":len(target_identities),"new_source_identity_count":batch_data.get("new_source_identities"),"existing_identities_enriched":batch_data.get("existing_identities_enriched"),"source_bodies_inspected":batch_data.get("source_bodies_inspected"),"answer_eligible_selected_count":sum(1 for x in audit if x["selected_index_entry"].get("answer_eligible")),"selected_unique_evidence_families":len({x["selected_index_entry"].get("evidence_family_id") for x in audit if x["selected_index_entry"].get("answer_eligible") and x["selected_index_entry"].get("evidence_family_id")} ),"non_independent_selected_count":sum(1 for x in audit if x["selected_index_entry"].get("answer_eligible") and x["selected_index_entry"].get("independent_witness") is False),"same_family_duplicate_count":sum(1 for x in audit if x.get("same_family_duplicate")),"canonical_identity_collision_count":sum(1 for x in audit if x.get("canonical_identity_collision")),"items":audit})
    summary=state.setdefault("development_recovery",{}).get("last_batch_summary")
    if isinstance(summary,dict) and str(summary.get("batch_id"))==str(batch_data.get("batch_id")):
        readiness_keys=("answer_eligible_unique_sources","content_verified_unique_sources","answer_eligible_propositions")
        summary["metrics_actual_before"]=batch_data["metrics_actual_before"]
        summary["metrics_after_actual"]={k:snapshot_metrics[k] for k in readiness_keys}
        summary["metrics_delta_actual"]=batch_data["metrics_delta_actual"]
        summary["status"]=batch_data["reconciliation_status"]
    batch_path.write_text(json.dumps(batch_data,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")

if selected_batches:
    readiness_state=state.setdefault("metrics_integrity",{}).setdefault("answer_readiness",{})
    first_data=selected_batches[0]["data"]; last_data=selected_batches[-1]["data"]
    if isinstance(first_data.get("metrics_before"),dict):
        readiness_state["before"]={k:first_data["metrics_before"][k] for k in ("answer_eligible_unique_sources","content_verified_unique_sources","answer_eligible_propositions") if k in first_data["metrics_before"]}
    if isinstance(first_data.get("metrics_actual_before"),dict):
        readiness_state["actual_before"]=first_data["metrics_actual_before"]
    if isinstance(last_data.get("metrics_expected_after"),dict):
        readiness_state["expected_after"]={k:last_data["metrics_expected_after"][k] for k in ("answer_eligible_unique_sources","content_verified_unique_sources","answer_eligible_propositions") if k in last_data["metrics_expected_after"]}
    state.setdefault("development_recovery",{})["reconciliation_chain"]=reconciliation_audit_history
    reconciled_ids={str(x["data"].get("batch_id")) for x in selected_batches}
    readiness_state["pending_batches"]=[str(x) for x in readiness_state.get("pending_batches",[]) if str(x) not in reconciled_ids]
    dev_pending=state.setdefault("development_recovery",{}).get("pending_reconciliation_batches",[])
    state["development_recovery"]["pending_reconciliation_batches"]=[str(x) for x in dev_pending if str(x) not in reconciled_ids]
    state["development_recovery"]["last_reconciliation_pending"]=bool(state["development_recovery"]["pending_reconciliation_batches"] or readiness_state.get("pending_batches"))

print("search_index_count",len(search_entries))
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
    actual_before=readiness.get("actual_before") or before
    readiness["actual_delta"]={k:actual[k]-int(actual_before.get(k,actual[k])) for k in actual}
    expected=readiness.get("expected_after") or {}
    readiness["reconciliation_variance"]={k:actual[k]-int(expected.get(k,actual[k])) for k in actual}
    if selected_batches:
        readiness["reconciliation_status"]="reconciled" if all(v==0 for v in readiness["reconciliation_variance"].values()) else "reconciled_with_variance"
        integrity["status"]="reconciled_pending_commit" if readiness["reconciliation_status"]=="reconciled" else "reconciled_with_variance_pending_commit"
        integrity["last_reconciled_at"]=today

actual_metrics={k:out[k] for k in ("answer_eligible_unique_sources","content_verified_unique_sources","answer_eligible_propositions")}
if selected_batches:
    acquisition_path=ROOT/"data/acquisition/latest.json"
    if acquisition_path.exists():
        acquisition=json.loads(acquisition_path.read_text(encoding="utf-8"))
        def update_review(review, batch_info):
            if not isinstance(review,dict) or str(review.get("batch_id"))!=str(batch_info["data"].get("batch_id")): return
            batch_data=batch_info["data"]
            review["metrics_actual_before"]=batch_data.get("metrics_actual_before")
            review["metrics_actual_after"]=batch_data.get("metrics_actual_after")
            review["metrics_delta_actual"]=batch_data.get("metrics_delta_actual")
            review["reconciliation_variance"]=batch_data.get("reconciliation_variance")
            review["reconciliation_status"]=batch_data.get("reconciliation_status")
            review["status"]=batch_data.get("status")
            review["reconciled_at"]=batch_data.get("reconciled_at")
        for batch_info in selected_batches:
            update_review(acquisition.get("manual_web_review"),batch_info)
            update_review(acquisition.get("previous_manual_web_review"),batch_info)
            update_review(acquisition.get("last_manual_web_review"),batch_info)
            for review in acquisition.get("manual_web_review_history",[]):
                update_review(review,batch_info)
        acquisition["manual_web_review_current_metrics"]=actual_metrics
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
print("answer_readiness_metrics",json.dumps({k:out.get(k) for k in ("answer_eligible_unique_sources","content_verified_unique_sources","answer_eligible_propositions")},ensure_ascii=False))
audit_state=state.get("development_recovery",{}).get("last_reconciliation",{})
print("batch_reconciliation_audit",json.dumps({
    "batch_id":audit_state.get("batch_id"),
    "answer_eligible_selected_count":audit_state.get("answer_eligible_selected_count"),
    "selected_unique_evidence_families":audit_state.get("selected_unique_evidence_families"),
    "items":[{"aid":x.get("aid"),"canonical_records_found":x.get("canonical_records_found"),
              "selected_index_entry":{k:x.get("selected_index_entry",{}).get(k) for k in ("present","answer_eligible","evidence_family_id","canonical_file","canonical_status")}}
             for x in audit_state.get("items",[])]
},ensure_ascii=False))

collision_details=[{"batch_id":x.get("batch_id"),"batch_file":x.get("batch_file"),"identity_key":i.get("identity_key"),"aid":i.get("aid"),"records":i.get("records",[])} for x in reconciliation_audit_history for i in x.get("items",[]) if i.get("canonical_identity_collision")]
print("canonical_identity_collision_details",json.dumps(collision_details,ensure_ascii=False))
