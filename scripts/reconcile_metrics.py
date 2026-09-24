#!/usr/bin/env python3
import json, pathlib, re, datetime
ROOT=pathlib.Path(__file__).resolve().parents[1]
items=list((ROOT/"data/items").glob("*.json"))
batches=list((ROOT/"data/staging/batches").glob("*.json"))
manifests=list((ROOT/"data/staging/manifests").glob("*.json"))
PIPE={"Discovered","Indexed","Parsed","Linked","Verified"}
def stable_key(d):
    if not isinstance(d,dict): return None
    loc=d.get("locator") or {}
    aid=d.get("aid") or (loc.get("aid") if isinstance(loc,dict) else None)
    if aid: return "aid:"+str(aid)
    prov=d.get("provenance") or {}
    url=d.get("source_url") or (prov.get("source_url") if isinstance(prov,dict) else None)
    if url: return "url:"+url
    i=d.get("id")
    if i: return "id:"+str(i)
    return None
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
            st=status_of(x); key=stable_key(x)
            if key and (st or x.get("source_url") or x.get("aid") or isinstance(x.get("locator"),dict)):
                old=seen.get(key); rank={"Discovered":1,"Indexed":2,"Parsed":3,"Linked":4,"Verified":5,None:0}
                if old is None or rank.get(st,0)>rank.get(old,0): seen[key]=st
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
            key=stable_key(r)
            if key and key in seen:
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
(ROOT/"data/promotion-ready-reconciled.json").write_text(json.dumps({"generated":today,"actionable_count":promotion_ready,"already_canonical_queued":already_canonical_queued,"batches":sorted(promotion_ready_by_batch,key=lambda x:(-x["count"],x["batch"]))},ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
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
            if stable_key(x) and (x.get("title") or x.get("summary_researcher") or x.get("source_url") or isinstance(x.get("provenance"),dict)):out.append(x)
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
        response_props=x.get("response_propositions") or prop.get("response_propositions") or ([] if not summary else [summary])
        entry={"key":key,"id":x.get("id"),"title":x.get("title") or x.get("id") or key,"summary":summary,"source_class":x.get("source_class") or x.get("collection") or x.get("type"),"status":st or x.get("pipeline_status") or x.get("verification_status") or "unknown","context_status":x.get("context_status") or "unknown","date":x.get("date_original") or x.get("event_date") or x.get("event_date_hebrew"),"language":x.get("language") or "unknown","source_url":x.get("source_url") or prov.get("source_url"),"aid":x.get("aid") or loc.get("aid"),"locator":loc or x.get("locator"),"rights_status":x.get("rights_status") or access.get("rights_status"),"publisher_terms":tax.get("publisher_index_terms") or [],"research_terms":tax.get("research_terms") or [],"relations":x.get("relations") if isinstance(x.get("relations"),list) else [],"canonical_file":str(fp.relative_to(ROOT)),"documented_circumstances":x.get("documented_circumstances") or prop.get("documented_circumstances"),"question_or_problem":x.get("question_or_problem") or prop.get("question_or_problem"),"response_propositions":response_props,"conditions_or_qualifications":x.get("conditions_or_qualifications") or prop.get("conditions_or_qualifications") or [],"audience":x.get("audience") or prop.get("audience"),"verification_scope":x.get("verification_scope") or prov.get("textual_status") or prov.get("editorial_scope"),"witness_provenance":prov.get("source_witness"),"evidence_family_id":x.get("evidence_family_id") or prop.get("evidence_family_id"),"primary_secondary_status":x.get("primary_secondary_status") or prop.get("primary_secondary_status"),"has_content_evidence":bool(response_props)}
        entry["search_text"]=" ".join(flatten_terms([entry["title"],entry["summary"],entry["source_class"],entry["date"],entry["language"],entry["publisher_terms"],entry["research_terms"],entry["question_or_problem"],entry["response_propositions"],entry["conditions_or_qualifications"],entry["audience"],entry["aid"],entry["locator"]]))
        old=search_entries.get(key)
        if old is None or rank.get(entry["status"],0)>=rank.get(old.get("status"),0):search_entries[key]=entry
search_index={"generated":today,"count":len(search_entries),"entries":sorted(search_entries.values(),key=lambda e:(0 if e.get("status")=="Verified" else 1,str(e.get("date") or ""),str(e.get("title") or "")))}
(ROOT/"data/public-search-index.json").write_text(json.dumps(search_index,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print("search_index_count",len(search_entries))
