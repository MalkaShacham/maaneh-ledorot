#!/usr/bin/env python3
"""Bulk-ingest Sichos Kodesh Audio metadata into staging.

Purpose: move the already mapped 4,700+ authorized Chabad.org/JEM audio corpus
from corpus-level discovery to bounded item-level staging without copying audio
or protected transcripts. Records are Indexed metadata only, never Verified.

Usage:
  python scripts/bulk_ingest_sichos_kodesh_audio.py --limit 250

The crawler starts from the official Chabad.org Sichos Kodesh index, follows
annual/event pages on the same authorized host, extracts stable item links and
writes a deterministic batch + manifest. Existing staging/canonical source URLs
and AIDs are excluded before writing.
"""
from __future__ import annotations
import argparse, hashlib, json, re, urllib.parse, urllib.request
from datetime import date
from pathlib import Path
from html.parser import HTMLParser

ROOT=Path(__file__).resolve().parents[1]
STAGING=ROOT/'data'/'staging'
BATCHES=STAGING/'batches'; MANIFESTS=STAGING/'manifests'; ITEMS=ROOT/'data'/'items'
START='https://www.chabad.org/therebbe/sichoskodesh_cdo/index/true'
UA='MaanehLedorot/1.0 metadata-indexer (noncommercial research; contact via repository)'
AID_RE=re.compile(r'/aid/(\d+)/')
YEAR_RE=re.compile(r'/aid/\d+/jewish/57\d\d-')

class Links(HTMLParser):
    def __init__(self): super().__init__(); self.links=[]
    def handle_starttag(self,tag,attrs):
        if tag!='a': return
        d=dict(attrs); href=d.get('href');
        if href: self.links.append(href)

def get(url):
    req=urllib.request.Request(url,headers={'User-Agent':UA})
    with urllib.request.urlopen(req,timeout=30) as r: return r.read().decode('utf-8','replace')

def links(url):
    p=Links(); p.feed(get(url)); out=[]
    for h in p.links:
        u=urllib.parse.urljoin(url,h).split('#')[0]
        if urllib.parse.urlparse(u).netloc.endswith('chabad.org'): out.append(u)
    return list(dict.fromkeys(out))

def stable(url):
    m=AID_RE.search(url); return ('aid:'+m.group(1)) if m else ('url:'+url.rstrip('/'))

def existing_keys():
    keys=set()
    for base in (ITEMS,BATCHES):
        if not base.exists(): continue
        for p in base.glob('*.json'):
            try: x=json.loads(p.read_text(encoding='utf-8'))
            except Exception: continue
            recs=x.get('records',[]) if isinstance(x,dict) else []
            if isinstance(x,dict) and x.get('source_url'): recs=[x]
            for r in recs:
                if not isinstance(r,dict): continue
                for u in (r.get('source_url'),r.get('url')):
                    if u: keys.add(stable(u))
                aid=r.get('aid')
                if aid: keys.add('aid:'+str(aid))
    return keys

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--limit',type=int,default=250); a=ap.parse_args()
    limit=max(1,min(a.limit,250)); seen=existing_keys(); candidates=[]
    year_pages=[u for u in links(START) if YEAR_RE.search(u)]
    for yp in year_pages:
        for event in links(yp):
            if '/therebbe/article_cdo/aid/' not in event: continue
            # Event pages and leaf audio pages are both useful stable publisher locators.
            try: child=links(event)
            except Exception: child=[]
            leaves=[u for u in child if '/therebbe/article_cdo/aid/' in u]
            pool=leaves or [event]
            for u in pool:
                k=stable(u)
                if k in seen: continue
                seen.add(k); m=AID_RE.search(u); aid=m.group(1) if m else None
                slug=urllib.parse.unquote(urllib.parse.urlparse(u).path.rsplit('/',1)[-1]).replace('.htm','').replace('-',' ')
                candidates.append({
                  'id':'sichos-kodesh-audio-'+(aid or hashlib.sha1(u.encode()).hexdigest()[:12]),
                  'aid':aid,'title':slug,'corpus':'sichos-kodesh-audio','source_type':'audio-publisher-item',
                  'source_url':u,'publisher':'Jewish Educational Media / Chabad.org','language':'Yiddish/Hebrew (audio; metadata may be English)',
                  'status':'Indexed','verification_status':'metadata_checked_only','context_status':'unknown',
                  'rights_status':'copyrighted-media-not-copied','accessed':str(date.today()),
                  'source_witness':'authorized publisher item/page locator','content_inspection':'not_performed',
                  'notes':'Metadata/locator ingestion only. Audio/transcript content not copied; item is not Verified.'
                })
                if len(candidates)>=limit: break
            if len(candidates)>=limit: break
        if len(candidates)>=limit: break
    if not candidates:
        print('No new records discovered'); return
    today=str(date.today()); token=hashlib.sha1((''.join(r['id'] for r in candidates)).encode()).hexdigest()[:10]
    name=f'{today}-sichos-kodesh-audio-bulk-{len(candidates)}-{token}'
    BATCHES.mkdir(parents=True,exist_ok=True); MANIFESTS.mkdir(parents=True,exist_ok=True)
    batch={'batch_id':name,'corpus':'sichos-kodesh-audio','record_count':len(candidates),'status':'Indexed','records':candidates}
    manifest={'batch_id':name,'source':START,'publisher':'Jewish Educational Media / Chabad.org','record_count':len(candidates),'pipeline_status':'Indexed','verification_scope':'authorized publisher metadata and stable locators only; audio content not independently inspected','rights':'No audio or protected transcript copied. Metadata and locators only.','dedup':'AID, then source URL against canonical and staging','generated':today}
    (BATCHES/f'{name}.json').write_text(json.dumps(batch,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    (MANIFESTS/f'{name}-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'batch':name,'records':len(candidates)},ensure_ascii=False))
if __name__=='__main__': main()
