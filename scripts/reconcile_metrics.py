#!/usr/bin/env python3
import json, pathlib, re
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
seen={}
evidence_files=0
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
                old=seen.get(key)
                rank={"Discovered":1,"Indexed":2,"Parsed":3,"Linked":4,"Verified":5,None:0}
                if old is None or rank.get(st,0)>rank.get(old,0): seen[key]=st
            for v in x.values():
                if isinstance(v,(dict,list)): stack.append(v)
        elif isinstance(x,list): stack.extend(x)
status_counts={k:0 for k in PIPE}
for st in seen.values():
    if st in status_counts: status_counts[st]+=1
staging_records=0; promotion_ready=0
for fp in batches:
    try: obj=json.loads(fp.read_text(encoding="utf-8"))
    except Exception: continue
    recs=obj.get("records") if isinstance(obj,dict) else None
    if isinstance(recs,list):
        staging_records+=len(recs)
        for r in recs:
            if isinstance(r,dict) and r.get("promotion_queue") is True: promotion_ready+=1
    elif isinstance(obj,dict):
        m=obj.get("manifest") or {}
        if isinstance(m,dict) and isinstance(m.get("record_count"),int): staging_records+=m["record_count"]
state_path=ROOT/"data/project-state.json"
state=json.loads(state_path.read_text(encoding="utf-8"))
counts=state.get("current_counts") or {}
external=counts.get("external_inventory_mapped_minimum")
if external is None:
    external=counts.get("external_discovery_records_reported_nonoverlap_minimum")
out={
 "generated":"2026-09-22",
 "external_inventory_mapped_minimum":external,
 "staging_batch_files":len(batches),
 "staging_manifest_files":len(manifests),
 "staging_records_physical_sum":staging_records,
 "promotion_ready_records":promotion_ready,
 "canonical_json_files":len(items),
 "canonical_unique_item_keys":len(seen),
 "evidence_family_files":evidence_files,
 "status_counts_unique_keys":status_counts,
 "verified_unique_item_keys":status_counts["Verified"],
 "counting_note":"Automated filesystem reconciliation. Unique item counts deduplicate by AID, then source URL, then ID. Evidence-family files are counted separately."
}
(ROOT/"data/public-metrics.json").write_text(json.dumps(out,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
# Keep the canonical project-state snapshot synchronized with the same physical count.
state["current_counts"]={
 "external_inventory_mapped_minimum":external,
 "staging_batch_files":out["staging_batch_files"],
 "staging_manifest_files":out["staging_manifest_files"],
 "staging_records_physical_sum":out["staging_records_physical_sum"],
 "promotion_ready_records":out["promotion_ready_records"],
 "canonical_json_files":out["canonical_json_files"],
 "canonical_unique_item_keys":out["canonical_unique_item_keys"],
 "evidence_family_files":out["evidence_family_files"],
 "verified_unique_item_keys":out["verified_unique_item_keys"],
 "status_counts_unique_keys":out["status_counts_unique_keys"]
}
if isinstance(state.get("verification_surge"),dict):
    state["verification_surge"]["current_promotion_ready_backlog"]=promotion_ready
state_path.write_text(json.dumps(state,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print(json.dumps(out,ensure_ascii=False))
