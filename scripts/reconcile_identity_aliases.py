#!/usr/bin/env python3
import json, pathlib, datetime
ROOT=pathlib.Path(__file__).resolve().parents[1]
ITEMS=ROOT/'data/items'; BATCHES=ROOT/'data/staging/batches'

def keys(d):
    if not isinstance(d,dict): return set()
    out=set(); loc=d.get('locator') or {}; prov=d.get('provenance') or {}
    aid=d.get('aid') or (loc.get('aid') if isinstance(loc,dict) else None)
    url=d.get('source_url') or (prov.get('source_url') if isinstance(prov,dict) else None)
    if aid: out.add('aid:'+str(aid))
    if url: out.add('url:'+str(url))
    if d.get('staging_stable_key'): out.add(str(d['staging_stable_key']))
    if d.get('id'): out.add('id:'+str(d['id']))
    return out

def walk(x):
    if isinstance(x,dict):
        yield x
        for v in x.values(): yield from walk(v)
    elif isinstance(x,list):
        for v in x: yield from walk(v)

canonical=set()
for fp in ITEMS.glob('*.json'):
    try: obj=json.loads(fp.read_text(encoding='utf-8'))
    except Exception: continue
    for x in walk(obj): canonical |= keys(x)

physical=already=ready=0; batches=[]
for fp in sorted(BATCHES.glob('*.json')):
    try: obj=json.loads(fp.read_text(encoding='utf-8'))
    except Exception: continue
    recs=obj.get('records') if isinstance(obj,dict) else None
    if not isinstance(recs,list): continue
    actionable=[]
    for r in recs:
        if not isinstance(r,dict) or r.get('promotion_queue') is not True: continue
        physical += 1; ks=keys(r)
        if ks & canonical:
            already += 1; continue
        ready += 1
        actionable.append({'staging_id':r.get('staging_id') or r.get('id'),'keys':sorted(ks),'source_url':r.get('source_url'),'verification_status':r.get('verification_status'),'context_status':r.get('context_status')})
    if actionable: batches.append({'batch':str(fp.relative_to(ROOT)),'count':len(actionable),'records':actionable})

today=datetime.date.today().isoformat()
pr={'generated':today,'identity_policy':'match any stable AID, source URL, staging stable key, or ID','actionable_count':ready,'already_canonical_queued':already,'batches':sorted(batches,key=lambda x:(-x['count'],x['batch']))}
(ROOT/'data/promotion-ready-reconciled.json').write_text(json.dumps(pr,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
for name in ['data/public-metrics.json','data/project-state.json']:
    p=ROOT/name; obj=json.loads(p.read_text(encoding='utf-8'))
    target=obj.get('current_counts') if name.endswith('project-state.json') else obj
    target['promotion_queue_physical_records']=physical
    target['promotion_queue_already_canonical']=already
    target['promotion_ready_records']=ready
    if name.endswith('project-state.json') and isinstance(obj.get('verification_surge'),dict): obj['verification_surge']['current_promotion_ready_backlog']=ready
    p.write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'promotion_queue_physical_records':physical,'already_canonical':already,'promotion_ready':ready},ensure_ascii=False))
