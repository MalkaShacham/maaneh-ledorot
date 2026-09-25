#!/usr/bin/env python3
import json, pathlib, datetime, re
ROOT=pathlib.Path(__file__).resolve().parents[1]
ITEMS=ROOT/'data/items'; BATCHES=ROOT/'data/staging/batches'
LIMIT=250

def identity_keys(d):
    if not isinstance(d,dict): return []
    keys=[]
    loc=d.get('locator') or {}
    aid=d.get('aid') or (loc.get('aid') if isinstance(loc,dict) else None)
    if aid: keys.append('aid:'+str(aid))
    url=d.get('source_url')
    if not url and isinstance(d.get('provenance'),dict): url=d['provenance'].get('source_url')
    if url: keys.append('url:'+url)
    if d.get('staging_stable_key'): keys.append(str(d['staging_stable_key']))
    if d.get('id'): keys.append('id:'+str(d['id']))
    return list(dict.fromkeys(keys))

def stable_key(d):
    ks=identity_keys(d)
    return ks[0] if ks else None

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
    for x in walk(obj): canonical.update(identity_keys(x))

candidates=[]
for fp in sorted(BATCHES.glob('*.json')):
    try: obj=json.loads(fp.read_text(encoding='utf-8'))
    except Exception: continue
    recs=obj.get('records') if isinstance(obj,dict) else None
    if not isinstance(recs,list): continue
    manifest=obj.get('manifest') if isinstance(obj.get('manifest'),dict) else {}
    for r in recs:
        if not isinstance(r,dict): continue
        promotion_eligible = (r.get('promotion_queue') is True) or (str(r.get('verification_status') or '').strip().lower() == 'indexed') or (str(r.get('collection_status') or '').strip().lower() == 'indexed')
        if not promotion_eligible: continue
        keys=identity_keys(r); k=keys[0] if keys else None
        if not k or any(x in canonical for x in keys): continue
        candidates.append((fp,r,manifest,k,keys))

selected=candidates[:LIMIT]
if not selected:
    print(json.dumps({'processed':0,'reason':'no_actionable_records'})); raise SystemExit(0)

today=datetime.date.today().isoformat()
existing=sorted(ITEMS.glob(f'bulk-indexed-{today}-*.json'))
seq=len(existing)+1
outpath=ITEMS/f'bulk-indexed-{today}-{seq:03d}.json'
out=[]
for fp,r,m,k,keys in selected:
    loc=r.get('locator') if isinstance(r.get('locator'),dict) else {}
    aid=r.get('aid') or loc.get('aid')
    sid=r.get('staging_id') or r.get('id') or (str(aid) if aid else re.sub(r'\W+','-',k)[:60])
    source_class=r.get('source_class') or m.get('source_class') or 'Unknown'
    item={
      'id':'canonical-'+str(sid),
      'staging_stable_key':k,
      'title':r.get('title') or str(sid),
      'source_class':source_class,
      'pipeline_status':'Indexed',
      'event_date':r.get('event_date'),
      'language':r.get('language') or 'unknown',
      'context_status':r.get('context_status') or 'unknown',
      'source_url':r.get('source_url'),
      'locator':loc,
      'provenance':{
        'source_witness':m.get('discovery_source') or 'staging source metadata',
        'transmission_type':'publisher/item metadata only',
        'textual_status':'content_not_inspected',
        'editorial_scope':'metadata-level canonical indexing',
        'verification_status':'metadata_checked_only',
        'source_url':r.get('source_url'),
        'accessed':today
      },
      'access':{
        'rights_status':r.get('rights_status') or m.get('rights_status') or 'unknown',
        'reuse_notes':'Metadata/link only; no protected full text copied.'
      },
      'relations':[{'type':'staging_origin','target':str(fp.relative_to(ROOT))}],
      'notes':'Bulk canonical indexing from reconciled staging. Indexed is not content verification; promotion to Linked/Verified requires the corresponding evidence threshold.'
    }
    if aid is not None: item['aid']=aid
    out.append(item)
    canonical.update(keys)

payload={'type':'bulk-canonical-index','generated':today,'promotion_policy':'metadata-safe bulk promotion to Indexed only','record_count':len(out),'items':out}
outpath.write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'processed':len(out),'remaining_before_run':len(candidates),'output':str(outpath.relative_to(ROOT))},ensure_ascii=False))
