// Check corpus counts against the same normalization used by the live answers.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {normalizeEvidenceIntegrity,buildAnswerModel} from '../src/answer-engine-validated.js';
const root=new URL('../',import.meta.url);
const idx=JSON.parse(await readFile(new URL('data/public-search-index.json',root)));
const metrics=JSON.parse(await readFile(new URL('data/public-metrics.json',root)));
const eligible=normalizeEvidenceIntegrity(idx.entries).filter(e=>e.has_content_evidence&&e.response_propositions?.length);
const unique=new Map(eligible.map(e=>[String(e.evidence_family_id||e.aid||e.source_url||e.key),e]));
assert.equal(metrics.answer_eligible_unique_sources,unique.size,'dashboard must agree with browser evidence eligibility');
assert.equal(metrics.content_verified_unique_sources,[...unique.values()].filter(e=>(e.canonical_status||e.status)==='Verified').length,'content-verified metric must require both usable inspected content and canonical Verified status');
assert(metrics.content_verified_unique_sources<=metrics.answer_eligible_unique_sources,'content-verified sources are a subset of answer-eligible sources');
assert.equal(metrics.answer_eligible_propositions,[...unique.values()].reduce((n,e)=>n+e.response_propositions.length,0));
const queue=JSON.parse(await readFile(new URL('data/content-review-queue.json',root)));
assert.equal(new Set(queue.records.map(e=>e.key)).size,queue.records.length);
const ready=new Set(eligible.map(e=>e.key));
// These letters also occur in metadata-only promotion batches. Reconciliation
// must retain the inspected witness, including its context and source locator.
for(const aid of [4666202,4666207,4666210]){
  const e=idx.entries.find(e=>e.key===`aid:${aid}`);
  assert(e && ready.has(e.key),`duplicate metadata must not hide inspected letter ${aid}`);
  assert.equal(e.canonical_file,`data/items/chabad-letter-${aid}.json`);
  assert(e.proposition_source_locator && e.documented_circumstances);
}
assert(queue.records.every(e=>e.source_url&&!ready.has(e.key)),'review queue must exclude inspected content');
for(const q of ['מה הרבי אמר על חינוך ילדים?','מה הרבי אמר על דאגה?','מה הרבי אמר על בטחון?']){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,q,{mode});
    assert(m.answerable,`${mode}: real source evidence must answer ${q}`);
    assert(m.sources.length>=2,`${q}: require multiple independently located witnesses`);
    assert(m.claims.every(c=>c.source_numbers.length),'each real content claim needs a citation');
  }
}
const draft=eligible.find(e=>String(e.aid)==='4422914');
assert(draft && /draft/.test(draft.primary_secondary_status),'publisher draft limitation must be preserved');
console.log(`Content readiness: ${unique.size} usable sources; six real-corpus answer checks passed`);
