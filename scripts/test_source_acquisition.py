"""Acquisition must fail closed for challenges, mismatched identities and media."""
import copy
import unittest
import tempfile
import json
from pathlib import Path
from unittest.mock import patch
import acquire_source_content as worker
from acquire_source_content import allowed, inspect, enrich

URL='https://www.chabad.org/therebbe/article_cdo/aid/123/jewish/page.htm'
SENTENCE='This complete source sentence is deliberately long enough to test a bounded and exact quotation.'
HTML=f'<link rel="canonical" href="{URL}"><h1>Letter</h1><nav>irrelevant navigation sentence.</nav><div class="co_body"><p>{SENTENCE}</p><p>{"Background material without sentence punctuation "*8}</p><div class="footnotes">Do not copy this footnote.</div></div>'
ENTRY={'pipeline_status':'Verified','source_class':'Igrot Kodesh','language':'English', 'provenance':{'source_witness':'authorized item witness'}}
class AcquisitionTests(unittest.TestCase):
 def test_exact_bounded_body(self):
  page,body,quote=inspect(URL,HTML)
  self.assertEqual(quote,SENTENCE);self.assertNotIn('navigation',body);self.assertNotIn('footnote',body)
  result=enrich(copy.deepcopy(ENTRY),URL,body,quote,'2026-10-15T00:00Z')
  self.assertTrue(result['proposition_verbatim']);self.assertEqual(result['context_status'],'partial')
  self.assertEqual(result['content_acquisition']['semantic_review'],'not_performed')
  self.assertLessEqual(result['content_acquisition']['excerpt_words'],25)
 def test_no_body_or_identity(self):
  for html in [HTML.replace('co_body','navigation'),HTML.replace('/aid/123/','/aid/456/'),HTML.replace('canonical','other')]:
   with self.assertRaises(ValueError):inspect(URL,html)
 def test_no_truncated_quote(self):
  with self.assertRaises(ValueError):inspect(URL,HTML.replace(SENTENCE,'word '*40+'.'))
 def test_media_and_unverified_never_promoted(self):
  for patch in [{'pipeline_status':'Indexed'},{'source_class':'Audio'},{'language':'English translation'},{'response_propositions':['already inspected']}]:
   with self.assertRaises(ValueError):enrich(dict(copy.deepcopy(ENTRY),**patch),URL,SENTENCE,SENTENCE,'now')
 def test_source_boundary(self):
  for url in ['http://www.chabad.org/aid/123/','https://chabad.org.evil.test/aid/123/','https://www.chabad.org@evil.test/aid/123/','https://www.chabad.org/']:
   self.assertFalse(allowed(url))
 def test_challenge_is_not_content(self):
  with self.assertRaises(ValueError):inspect(URL,HTML.replace(SENTENCE,'Verify you are human. '+SENTENCE))

 def test_pipeline_persists_content_discovery_and_is_idempotent(self):
  with tempfile.TemporaryDirectory() as temp:
   root=Path(temp); (root/'data/items').mkdir(parents=True)
   entry=copy.deepcopy(ENTRY);entry['provenance']['source_url']=URL
   worker.write(root/'data/items/test.json',entry)
   worker.write(root/'data/content-review-queue.json',{'records':[{'source_url':URL,'canonical_file':'data/items/test.json'}]})
   worker.write(root/'data/public-search-index.json',{'entries':[{'source_url':URL}]})
   html=HTML.replace('</div>','<a href="/therebbe/article_cdo/aid/456/jewish/page.htm">Next letter</a></div>',1)
   with patch.object(worker,'ROOT',root),patch.object(worker,'fetch',return_value=html) as fetch,patch('sys.argv',['acquire','--limit','1']),patch('builtins.print'):
    worker.main();worker.main();self.assertEqual(fetch.call_count,1)
   enriched=json.loads((root/'data/items/test.json').read_text())
   self.assertEqual(enriched['response_propositions'],[SENTENCE])
   batch=json.loads(next((root/'data/staging/batches').glob('*.json')).read_text())
   self.assertEqual(batch['records'][0]['status'],'Indexed')
   self.assertNotIn('response_propositions',batch['records'][0])

if __name__=='__main__':unittest.main()
