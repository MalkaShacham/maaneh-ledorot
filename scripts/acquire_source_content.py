#!/usr/bin/env python3
"""Bounded publisher acquisition. No semantic inference or full-text persistence.

A previously Verified textual witness may gain ONE complete, short source
sentence. Navigation, audio metadata, translations of unknown parentage and
unverified identities never become answer evidence here. New links stay Indexed.
"""
import argparse
import datetime as dt
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import time
import urllib.error
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
HOSTS = {'www.chabad.org', 'he.chabad.org'}
MAX_BYTES = 1500000
UA = 'MaanehLedorot/1.1 (bounded noncommercial source verification)'

def aid(url):
    m = re.search(r'/aid/(\d+)(?:/|$)', urllib.parse.urlsplit(url).path)
    return m.group(1) if m else None

def allowed(url):
    u = urllib.parse.urlsplit(url)
    return (u.scheme == 'https' and u.hostname in HOSTS and not u.username
            and not u.password and u.port in (None, 443) and bool(aid(url)))

class PublisherPage(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.parts = []
        self.links = []
        self.title = []
        self.canonical = None
        self.bodies = 0

    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        classes = set(d.get('class', '').split())
        body = bool(classes & {'co_body', 'article-body', 'article_body'})
        excluded = tag in {'script', 'style', 'nav', 'footer', 'form', 'aside'} or bool(classes & {'footnotes', 'footnote', 'article-footer', 'related-articles'})
        self.stack.append((tag, body, excluded))
        if body: self.bodies += 1
        if tag == 'link' and d.get('rel') == 'canonical': self.canonical = d.get('href')
        if tag == 'a' and d.get('href'): self.links.append(d['href'])
        if tag in {'p', 'br', 'div'} and self.in_body(): self.parts.append('\n')
        if tag in {'br','hr','img','meta','link','input','source','wbr','area','base','embed','param','col'}:
            self.stack.pop()

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if self.stack and self.stack[-1][0] == tag: self.stack.pop()

    def handle_endtag(self, tag):
        if tag in {'p', 'div'} and self.in_body(): self.parts.append('\n')
        for i in range(len(self.stack)-1, -1, -1):
            if self.stack[i][0] == tag:
                del self.stack[i:]
                break

    def in_body(self):
        return any(x[1] for x in self.stack) and not any(x[2] for x in self.stack)

    def handle_data(self, data):
        if any(x[0] == 'h1' for x in self.stack): self.title.append(data)
        if self.in_body(): self.parts.append(data)

    def text(self):
        return '\n'.join(' '.join(p.split()) for p in ''.join(self.parts).splitlines() if p.strip())

class SafeRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        if not allowed(newurl): raise ValueError('unapproved_redirect')
        return super().redirect_request(req, fp, code, msg, headers, newurl)

def fetch(url):
    if not allowed(url): raise ValueError('unapproved_source_url')
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.build_opener(SafeRedirect()).open(req, timeout=12) as response:
        if not allowed(response.url) or aid(response.url) != aid(url):
            raise ValueError('source_identity_redirect_mismatch')
        if 'text/html' not in response.headers.get('Content-Type', ''):
            raise ValueError('not_html')
        raw = response.read(MAX_BYTES+1)
        if len(raw) > MAX_BYTES: raise ValueError('page_too_large')
        return raw.decode('utf-8', 'strict')

def inspect(url, html):
    page = PublisherPage(); page.feed(html)
    if not page.canonical or not allowed(page.canonical) or aid(page.canonical) != aid(url):
        raise ValueError('publisher_canonical_identity_missing_or_mismatched')
    text = page.text()
    if page.bodies != 1 or len(text) < 150 or not page.title:
        raise ValueError('no_unambiguous_publisher_article_body')
    if re.search(r'access denied|captcha|verify you are human|cloudflare', text, re.I):
        raise ValueError('access_challenge')
    # Only complete sentences, never cut a clause to fit the rights budget.
    sentences = re.split(r'(?<=[.!?׃])\s+', text)
    candidates = [s.strip() for s in sentences if 10 <= len(s.split()) <= 25
                  and s.strip().endswith(('.', '!', '?', '׃'))
                  and not re.search(r'https?://|copyright|subscribe|click here|הערות שוליים', s, re.I)]
    if not candidates: raise ValueError('no_complete_sentence_within_excerpt_budget')
    quote = candidates[0]
    assert quote in text
    return page, text, quote

def write(path, obj):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2)+'\n')

def enrich(entry, url, text, quote, now):
    # Caller must establish identity verification; extraction is not authorship proof.
    if quote not in text or not 10 <= len(quote.split()) <= 25:
        raise ValueError('excerpt_not_exact_or_outside_budget')
    if entry.get('pipeline_status') != 'Verified' or entry.get('response_propositions'):
        raise ValueError('not_a_verified_unenriched_witness')
    if re.search(r'translat|תרגום|audio|video', ' '.join(str(entry.get(k,'')) for k in ('language','source_class','primary_secondary_status')), re.I):
        raise ValueError('unsupported_witness_kind')
    if entry.get('source_class') not in {'Igrot Kodesh','Torat Menachem','Written responses'}:
        raise ValueError('unsupported_text_collection')
    if not (entry.get('provenance') or {}).get('source_witness'):
        raise ValueError('missing_existing_witness_provenance')
    entry.update(response_propositions=[quote], proposition_origin='explicit_proposition_field',
                 proposition_verbatim=True, proposition_verification='exact_publisher_text_match',
                 proposition_source_locator=f"{url}; article-body character offset {text.index(quote)}; one complete sentence",
                 evidence_family_id=entry.get('evidence_family_id') or 'publisher-item-aid-'+aid(url),
                 context_status='partial', primary_secondary_status='previously verified publisher witness; automatically matched partial excerpt',
                 verification_scope='Automated exact-match check of one bounded sentence in the authorized publisher article. Identity provenance inherited from existing Verified item. No semantic or whole-document verification.',
                 conditions_or_qualifications=['קטע חלקי שנבדק אוטומטית מול גוף הפרסום; נדרש לעיין בהקשר המלא במקור.'],
                 content_acquisition={'method':'publisher_body_exact_sentence_v1','checked_at':now,
                                      'body_sha256':hashlib.sha256(text.encode()).hexdigest(),
                                      'excerpt_sha256':hashlib.sha256(quote.encode()).hexdigest(),
                                      'excerpt_words':len(quote.split()),'semantic_review':'not_performed'},
                 rights_status='one complete source sentence, at most 25 whitespace-delimited words; full text not retained')
    return entry

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--limit',type=int,default=12);args=ap.parse_args()
    now=dt.datetime.now(dt.timezone.utc); stamp=now.isoformat()
    queue=json.loads((ROOT/'data/content-review-queue.json').read_text())['records']
    statepath=ROOT/'data/acquisition/state.json'
    state=json.loads(statepath.read_text()) if statepath.exists() else {'sources':{}}
    state.setdefault('hosts', {})
    report={'started_at':stamp,'attempted':0,'enriched':0,'discovered':0,'blocked':[], 'skipped':0}
    seen=set(); discoveries=[]
    index=json.loads((ROOT/'data/public-search-index.json').read_text())['entries']
    known={aid(e.get('source_url') or '') for e in index}
    for r in queue:
        url=r.get('source_url') or ''; key=aid(url)
        if not allowed(url) or key in seen: continue
        host=urllib.parse.urlsplit(url).hostname
        if state['hosts'].get(host,{}).get('retry_after','') > stamp: continue
        seen.add(key)
        previous=state['sources'].get(key,{})
        if previous.get('outcome') == 'exact_excerpt_verified' or previous.get('retry_after','') > stamp: continue
        p=(ROOT/r['canonical_file']).resolve()
        if not p.is_relative_to((ROOT/'data/items').resolve()): continue
        entry=json.loads(p.read_text())
        # Batch containers and media require a separate adapter; do not rewrite them.
        if entry.get('pipeline_status') != 'Verified' or entry.get('response_propositions') or aid((entry.get('provenance') or {}).get('source_url','')) != key:
            report['skipped']+=1;continue
        if re.search(r'audio|video|translat|תרגום', ' '.join(str(entry.get(k,'')) for k in ('language','source_class')),re.I): continue
        report['attempted']+=1
        try:
            page,text,quote=inspect(url,fetch(url))
            enriched=enrich(entry,url,text,quote,stamp)
            write(p,enriched);report['enriched']+=1
            for href in page.links:
                if len(discoveries)>=24: break
                target=urllib.parse.urljoin(url,href).split('#')[0]; targetaid=aid(target)
                if (allowed(target) and targetaid not in known
                    and re.search(r'/(therebbe/(?:article|letters)|library/article)_?cdo/',target)):
                    known.add(targetaid)
                    discoveries.append({'id':'auto-discovered-'+targetaid,'aid':targetaid,
                        'source_url':target,'title':'Publisher-linked item '+targetaid,
                        'status':'Indexed','verification_status':'metadata_only_not_verified',
                        'source_witness':'link on '+url,'promotion_queue':True,
                        'context_status':'unknown','rights_status':'metadata_and_link_only'})
                    if len(discoveries)>=24:break
            state['sources'][key]={'outcome':'exact_excerpt_verified','checked_at':stamp}
        except (ValueError,urllib.error.URLError,TimeoutError,UnicodeError,OSError) as exc:
            reason=str(exc)[:240]
            if isinstance(exc,urllib.error.HTTPError) and exc.code in (403,429):
                state['hosts'][host]={'reason':reason,'retry_after':(now+dt.timedelta(hours=24)).isoformat()}
            report['blocked'].append({'aid':key,'url':url,'reason':reason})
            state['sources'][key]={'outcome':'blocked','reason':reason,'checked_at':stamp,
                'retry_after':(now+dt.timedelta(hours=24)).isoformat()}
        if report['attempted']>=max(1,min(args.limit,24)):break
        time.sleep(1)
    if discoveries:
        token=hashlib.sha256(json.dumps(discoveries,sort_keys=True).encode()).hexdigest()[:12]
        write(ROOT/f'data/staging/batches/auto-links-{token}.json',{'records':discoveries})
    report['discovered']=len(discoveries)
    report['status']='progress' if report['enriched'] or discoveries else ('blocked' if report['blocked'] else 'no_candidates')
    write(statepath,state);write(ROOT/'data/acquisition/latest.json',report)
    print(json.dumps(report,ensure_ascii=False))

if __name__=='__main__':main()
