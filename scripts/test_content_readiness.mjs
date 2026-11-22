// Check corpus counts against the same normalization used by the live answers.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {normalizeEvidenceIntegrity,buildAnswerModel,citationEntailment} from '../src/answer-engine-validated.js';
import {understandQuestion} from '../src/answer-engine.js';
const root=new URL('../',import.meta.url);
const sourceAID=e=>{
  if(e?.aid!==undefined&&e?.aid!==null&&String(e.aid).trim())return String(e.aid);
  const match=String(e?.source_url||'').match(/\/aid\/(\d+)(?:\/|$)/);
  return match?match[1]:null;
};
const readinessMetrics=v=>Object.fromEntries(['answer_eligible_unique_sources','content_verified_unique_sources','answer_eligible_propositions'].map(k=>[k,v?.[k]]));
const idx=JSON.parse(await readFile(new URL('data/public-search-index.json',root)));
assert(idx.entries.every(e=>typeof e.answer_eligible==='boolean'),'public search index must expose an explicit boolean answer_eligible decision for every entry');
const metrics=JSON.parse(await readFile(new URL('data/public-metrics.json',root)));
const eligible=normalizeEvidenceIntegrity(idx.entries).filter(e=>e.has_content_evidence&&e.response_propositions?.length);
const families=new Map();
for(const e of eligible){const key=String(e.evidence_family_id||e.aid||e.source_url||e.key);if(!families.has(key))families.set(key,[]);families.get(key).push(e);}
assert.equal(metrics.answer_eligible_unique_sources,families.size,'dashboard must count unique Evidence Families');
assert.equal(metrics.content_verified_unique_sources,[...families.values()].filter(group=>group.some(e=>(e.canonical_status||e.status)==='Verified')).length,'content-verified metric must require at least one usable inspected Verified member per family');
assert(metrics.content_verified_unique_sources<=metrics.answer_eligible_unique_sources,'content-verified families are a subset of answer-eligible families');
const propositionKey=(e,p)=>[String(p).normalize('NFC').trim().replace(/\\s+/g,' ').toLocaleLowerCase(),String(e.documented_circumstances||'').normalize('NFC').trim(),String(e.conditions_or_qualifications||'').normalize('NFC').trim(),String(e.audience||'').normalize('NFC').trim()].join('|');
const propositionCount=[...families.values()].reduce((n,group)=>n+new Set(group.flatMap(e=>(e.response_propositions||[]).map(p=>propositionKey(e,p)))).size,0);
assert.equal(metrics.answer_eligible_propositions,propositionCount,'all distinct propositions across family members must be counted without counting aliases as independent families');
const queue=JSON.parse(await readFile(new URL('data/content-review-queue.json',root)));
const acquisitionState=JSON.parse(await readFile(new URL('data/acquisition/latest.json',root),'utf8'));
const currentReviewBatchId=String(acquisitionState.manual_web_review.batch_id);
const previousReviewBatchId=String(acquisitionState.previous_manual_web_review.batch_id);
const projectState=JSON.parse(await readFile(new URL('data/project-state.json',root),'utf8'));
const batch073Data=JSON.parse(await readFile(new URL('data/items/content-research-batch-073-2026-11-13.json',root)));
const batch078Data=JSON.parse(await readFile(new URL('data/items/content-research-batch-078-2026-11-13.json',root)));
const batch082Data=JSON.parse(await readFile(new URL('data/items/content-research-batch-082-2026-11-14.json',root)));
const batch084Data=JSON.parse(await readFile(new URL('data/items/content-research-batch-084-2026-11-14.json',root)));
const batch085Data=JSON.parse(await readFile(new URL('data/items/content-research-batch-085-2026-11-14.json',root)));
const batch086Data=JSON.parse(await readFile(new URL('data/items/content-research-batch-086-2026-11-14.json',root)));
const batch087Path='data/items/content-research-batch-087-2026-11-15.json';
const batch087Data=JSON.parse(await readFile(new URL(batch087Path,root)));
const batch089Path='data/items/content-research-batch-089-2026-11-15.json';
const batch089Data=JSON.parse(await readFile(new URL(batch089Path,root)));
const batch090Path='data/items/content-research-batch-090-2026-11-15.json';
const batch090Data=JSON.parse(await readFile(new URL(batch090Path,root)));
const batch091Path='data/items/content-research-batch-091-2026-11-15.json';
const batch091Data=JSON.parse(await readFile(new URL(batch091Path,root)));
const batch092Path='data/items/content-research-batch-092-2026-11-15.json';
const batch092Data=JSON.parse(await readFile(new URL(batch092Path,root)));
const batch093Path='data/items/content-research-batch-093-2026-11-15.json';
const batch093Data=JSON.parse(await readFile(new URL(batch093Path,root)));
const batch094Path='data/items/content-research-batch-094-2026-11-15.json';
const batch094Data=JSON.parse(await readFile(new URL(batch094Path,root)));
const batch134Path='data/items/content-research-batch-134-2026-11-17.json';
const batch134Data=JSON.parse(await readFile(new URL(batch134Path,root),'utf8'));
const batch135Path='data/items/content-research-batch-135-2026-11-17.json';
const batch135Data=JSON.parse(await readFile(new URL(batch135Path,root),'utf8'));
const batch136Path='data/items/content-research-batch-136-2026-11-17.json';
const batch136Data=JSON.parse(await readFile(new URL(batch136Path,root),'utf8'));
const batch161Path='data/items/content-research-batch-161-2026-11-21.json';
const batch161Data=JSON.parse(await readFile(new URL(batch161Path,root),'utf8'));
const batch162Path='data/items/content-research-batch-162-2026-11-21.json';
const batch162Data=JSON.parse(await readFile(new URL(batch162Path,root),'utf8'));
const batch163Path='data/items/content-research-batch-163-2026-11-21.json';
const batch163Data=JSON.parse(await readFile(new URL(batch163Path,root),'utf8'));
assert.equal(new Set(queue.records.map(e=>e.key)).size,queue.records.length);
assert(!queue.records.some(e=>String(e.source_url||'').includes('/aid/4666210/')),'metadata-only AID 4666210 alias must not remain pending after the content-bearing identity is verified');
const ready=new Set(eligible.map(e=>e.key));
const batch084Path='data/items/content-research-batch-084-2026-11-14.json';
const batch084Aids=batch084Data.records.map(r=>String(r.aid));
assert.equal(batch084Data.records.length,7);
assert.equal(new Set(batch084Aids).size,7);
assert.equal(new Set(batch084Data.records.map(r=>r.evidence_family_id)).size,7);
assert.equal(batch084Data.new_response_propositions,15);
assert.equal(batch084Data.existing_response_propositions_added,1);
assert.equal(batch084Data.existing_identity_updates.length,1);
assert.equal(batch084Data.existing_identity_rechecks.length,1);
assert.equal(batch084Data.reconciliation_status,'superseded_by_batch_085');
assert.equal(batch084Data.superseded_by_batch,'085');
assert(!batch084Aids.includes('5071052'),'AID 5071052 must remain in its existing batch-071 identity, not be duplicated');
for(const aid of batch084Aids){
 const matches=idx.entries.filter(e=>sourceAID(e)===aid);
 assert.equal(matches.length,1,'batch-084 AID '+aid+' must have exactly one indexed identity');
 const e=matches[0];
 assert(e.has_content_evidence,'batch-084 AID '+aid+' must be answer eligible');
 assert.equal(e.canonical_file,batch084Path);
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope);
 assert.equal(e.response_proposition_locators.length,e.response_propositions.length);
 assert(e.evidence_family_id&&e.independent_witness!==false);
}
const rechecked5071052=idx.entries.find(e=>sourceAID(e)==='5071052');
assert(rechecked5071052&&rechecked5071052.canonical_file==='data/items/content-research-batch-071-2026-11-13.json');
const enriched5071116=idx.entries.find(e=>sourceAID(e)==='5071116');
assert(enriched5071116&&enriched5071116.response_propositions.some(p=>p.includes('חינוכם ולעתידם של ילדים וילדות יהודים רבים')));
assert.equal(enriched5071116.response_propositions.length,4,'AID 5071116 must be enriched in place without changing its Evidence Family');
assert(enriched5071116.response_proposition_locators.some(l=>String(l).includes('שורה 248')));
const enriched4645984=idx.entries.find(e=>sourceAID(e)==='4645984');
assert(enriched4645984&&enriched4645984.language==='Yiddish'&&enriched4645984.response_propositions.length===3,'the Yiddish circular must be enriched in place, not duplicated or translated into a new witness');
assert.equal(enriched4645984.evidence_family_id,'machne-israel-yiddish-public-circular-late-5702-letter-23-aid4645984');
assert(enriched4645984.response_proposition_locators.some(l=>String(l).includes('261–263')));
const batch085Path='data/items/content-research-batch-085-2026-11-14.json';
const batch085Aids=batch085Data.records.map(r=>String(r.aid));
assert.equal(batch085Data.records.length,11);
assert.equal(batch085Data.reviewed_item_count,19);
assert.equal(batch085Data.source_bodies_inspected,14);
assert.equal(batch085Data.new_source_identities,11);
assert.equal(batch085Data.existing_identities_enriched,2);
assert.equal(batch085Data.new_response_propositions,28);
assert.equal(batch085Data.existing_response_propositions_added,2);
assert.equal(batch085Data.answer_eligible_source_families_added,11);
assert.equal(batch085Data.blocked_candidate_count,5);
assert.equal(batch085Data.not_promoted_after_inspection[0].aid,5357088);
assert.equal(new Set(batch085Aids).size,11);
assert.equal(new Set(batch085Data.records.map(r=>r.evidence_family_id)).size,11);
assert.equal(new Set(batch085Data.records.map(r=>r.source_url)).size,11);
assert.equal(batch085Data.metrics_before.answer_eligible_unique_sources,837);
assert.equal(batch085Data.metrics_before.content_verified_unique_sources,834);
assert.equal(batch085Data.metrics_before.answer_eligible_propositions,2721);
assert.deepEqual(batch085Data.metrics_expected_after,{answer_eligible_unique_sources:855,content_verified_unique_sources:852,answer_eligible_propositions:2767});
assert(['pending','reconciled'].includes(batch085Data.reconciliation_status));
if(batch085Data.reconciliation_status==='reconciled'){
 assert.deepEqual(batch085Data.metrics_actual_after,batch085Data.metrics_expected_after,'batch 085 reconciliation must be checked against its own snapshot, not the later batch 086 metrics');
 assert.deepEqual(batch085Data.reconciliation_variance,{answer_eligible_unique_sources:0,content_verified_unique_sources:0,answer_eligible_propositions:0});
}
for(const aid of batch085Aids){
 const matches=idx.entries.filter(e=>sourceAID(e)===aid);
 assert.equal(matches.length,1,'batch-085 AID '+aid+' must have exactly one canonical identity');
 const e=matches[0];
 assert(e.has_content_evidence,'batch-085 AID '+aid+' must be answer eligible');
 assert.equal(e.canonical_file,batch085Path);
 assert.equal(e.status,'Verified');
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope&&e.witness_provenance);
 assert.equal(e.response_proposition_locators.length,e.response_propositions.length);
 assert(e.response_proposition_locators.every(Boolean));
 assert.equal(e.context_status,'partial');
 assert.equal(e.independent_witness,aid==='2989411'?false:true);
 assert.equal(e.translation_of_evidence_family_id,null);
}
assert.equal(batch085Data.records.find(r=>String(r.aid)==='5100749').witness.complete_partial,'partial');
assert.equal(batch085Data.records.find(r=>String(r.aid)==='5100697').witness.complete_partial,'partial');
assert.equal(batch085Data.records.find(r=>String(r.aid)==='4783830').witness_type,'published_hebrew_letter_text_completed_from_secretariat_copy');
assert.equal(batch085Data.records.find(r=>String(r.aid)==='4730988').witness_type,'published_hebrew_letter_text_completed_from_secretariat_copy');
const educationAndYouthQuestion='מה נכתב באיגרות על לימוד עם תלמידים לפני בר מצווה, שיחה מקרבת עם בחור ושיעורים ברבים?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,educationAndYouthQuestion,{mode});
 assert(m.answerable,mode+': inspected education and youth correspondence must support a bounded multi-source answer');
 for(const aid of ['4783830','5357009','4730988'])assert(m.sources.some(e=>sourceAID(e)===aid),mode+': multi-source education answer must retain AID '+aid);
 assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=3,mode+': education synthesis must retain distinct Evidence Families');
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length),mode+': each synthesized claim needs claim-level source citations');
 assert(m.synthesis&&m.synthesis.topic==='education_youth_guidance'&&m.synthesis.attribution==='system_synthesis_not_rebbe_quote',mode+': cross-source synthesis must be explicitly system-authored, not attributed to the Rebbe');
 assert.equal(m.synthesis.claims.length,3,mode+': each educational case must have a separate cited synthesis claim');
 assert.equal(m.synthesis.basis.length,3,mode+': synthesis basis must retain three distinct source witnesses');
 assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid),mode+': citations and context boundaries must validate');
 if(mode==='researcher'){
  assert(m.research&&m.research.evidence_families>=3);
  assert(m.research.pattern_synthesis_integrity?.valid===true,'researcher mode must pass cross-family synthesis integrity');
  assert(m.research.witnesses.length===m.sources.length);
  assert(m.research.evidence_map.length>0&&m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));
  assert(m.research.citation_entailment.every(x=>x.valid)&&m.research.context_boundary.every(x=>x.valid));
 }else assert.equal(m.research,undefined);
}
const batch078Path='data/items/content-research-batch-078-2026-11-13.json';
const batch078Aids=batch078Data.records.map(r=>String(r.aid));
assert.equal(batch078Data.records.length,12);
assert.equal(new Set(batch078Aids).size,12);
assert.equal(new Set(batch078Data.records.map(r=>r.evidence_family_id)).size,12);
assert.equal(new Set(batch078Data.records.map(r=>r.source_url)).size,12);
assert.equal(batch078Data.records.filter(r=>r.language==='Hebrew').length,7);
assert.equal(batch078Data.records.filter(r=>r.language==='Yiddish').length,4);
assert.equal(batch078Data.records.filter(r=>r.language==='English').length,1);
assert.equal(batch078Data.new_response_propositions,23);
assert.equal(batch078Data.existing_response_propositions_added,1);
assert.equal(batch078Data.existing_identity_updates.length,1);
assert.equal(batch078Data.existing_identity_rechecks.length,2);
for(const aid of batch078Aids){
 const e=idx.entries.find(x=>sourceAID(x)===aid);
 assert(e&&e.has_content_evidence,'batch-078 AID '+aid+' must have content evidence');
 assert.equal(e.canonical_file,batch078Path);
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope);
 assert.equal(e.response_proposition_locators.length,e.response_propositions.length);
 assert(e.response_proposition_locators.every(Boolean));
 assert(e.evidence_family_id&&e.independent_witness!==false);
}
const batch082Path='data/items/content-research-batch-082-2026-11-14.json';
const batch082Aids=batch082Data.records.map(r=>String(r.aid));
assert.equal(batch082Data.records.length,11);
assert.equal(new Set(batch082Aids).size,11);
assert.equal(new Set(batch082Data.records.map(r=>r.evidence_family_id)).size,11);
assert.equal(new Set(batch082Data.records.map(r=>r.source_url)).size,11);
assert.equal(batch082Data.new_response_propositions,24);
assert.equal(batch082Data.existing_response_propositions_added,1);
assert.equal(batch082Data.existing_identity_updates.length,1);
assert.equal(batch082Data.records.filter(r=>r.language==='English').length,11);
assert.equal(batch082Data.records.filter(r=>r.independent_witness===false).length,7);
assert.equal(batch082Data.records.filter(r=>r.translation_of_evidence_family_id).length,7);
for(const aid of batch082Aids){
 const r=batch082Data.records.find(x=>String(x.aid)===aid);
 const e=eligible.find(x=>sourceAID(x)===aid);
 assert(e&&e.has_content_evidence,'batch-082 AID '+aid+' must have inspected content evidence');
 assert.equal(e.canonical_file,batch082Path);
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope);
 assert.equal(e.response_proposition_locators.length,e.response_propositions.length);
 assert(e.response_proposition_locators.every(Boolean));
 assert.equal(e.evidence_family_id,r.evidence_family_id);
 if(r.independent_witness===false){
  assert.equal(r.translation_of_evidence_family_id,r.evidence_family_id);
  assert.equal(e._independent_witness,false,'translations must remain derived, non-independent witnesses');
 }
}
const enriched1858362=eligible.find(e=>sourceAID(e)==='1858362');
assert(enriched1858362&&enriched1858362.response_propositions.length>=3);
assert.equal(enriched1858362.canonical_file,'data/items/content-research-batch-070-2026-11-13.json');
assert(enriched1858362.response_proposition_locators.some(x=>String(x).includes('290–295')));
const charity749=eligible.find(e=>sourceAID(e)==='2276666');
const charity751=eligible.find(e=>sourceAID(e)==='2276672');
assert(charity749&&charity751&&charity749.evidence_family_id!==charity751.evidence_family_id,
 'Letter Nos. 749 and 751 are distinct letters, not duplicate translations of one letter');
assert.equal(charity749._independent_witness,false);
assert.equal(charity751._independent_witness,false);
assert(!queue.records.some(e=>batch082Aids.includes(String(e.aid))),'reviewed batch-082 AIDs must not remain in the content-review queue');
const educationResponsibilityQuestion='מה כתב הרבי על אחריות תלמידי ישיבות לחינוך ילדים ונוער?';
assert(!understandQuestion(educationResponsibilityQuestion).topics.includes('הרחבת ישיבה'),'general educational responsibility must not be misclassified as yeshiva enrollment/expansion');
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,educationResponsibilityQuestion,{mode});
 assert(m.answerable, `${mode}: inspected correspondence should support a bounded answer about educational responsibility`);
 assert(m.sources.length>=2, `${mode}: educational synthesis should retrieve multiple Evidence Families`);
 assert(m.sources.some(e=>sourceAID(e)==='2276672'), `${mode}: Letter No. 751 should be retrieved for yeshivah-student responsibility`);
 assert(m.claims.every(c=>c.source_numbers.length), `${mode}: each educational claim needs proposition-level citations`);
 if(mode==='researcher'){
  assert(m.research&&m.research.evidence_map.length>0, 'researcher mode must expose a claim-to-witness evidence map');
  assert(m.research.evidence_integrity.derived_non_independent>=1, 'researcher mode must distinguish translated, non-independent witnesses');
  assert.equal(m.research.witnesses.length,m.sources.length);
  assert(m.research.citation_entailment.every(x=>x.valid));
  assert(m.research.context_boundary.every(x=>x.valid));
 }
}
const secretariatCopy=idx.entries.find(e=>sourceAID(e)==='4730884');
assert(secretariatCopy&&/secretariat/i.test(secretariatCopy.witness_type||''));
const yiddishPublic=idx.entries.find(e=>sourceAID(e)==='5100601');
const yiddishPublicRecord=batch078Data.records.find(e=>String(e.aid)==='5100601');
assert(yiddishPublic&&yiddishPublic.language==='Yiddish'&&String(yiddishPublicRecord?.provenance?.textual_status||'').includes('צילום'));
const englishPublic=idx.entries.find(e=>sourceAID(e)==='5043323');
assert(englishPublic&&englishPublic.language==='English'&&englishPublic.context_status==='complete');
const partialExcerpt=idx.entries.find(e=>sourceAID(e)==='4830985');
assert(partialExcerpt&&partialExcerpt.context_status==='partial'&&String(partialExcerpt.verification_scope).includes('אליפסיס'));
const enriched4731005=idx.entries.find(e=>sourceAID(e)==='4731005');
assert(enriched4731005&&enriched4731005.response_propositions.length>=4);
assert(enriched4731005.response_proposition_locators.some(x=>String(x).includes('258–261')));
for(const aid of [5054399,5413166,5100681])assert.equal(idx.entries.filter(e=>sourceAID(e)===String(aid)).length,1);

// These letters also occur in metadata-only promotion batches. Reconciliation
// must retain the inspected witness, including its context and source locator.
for(const aid of [4666202,4666207,4666210]){
  const e=idx.entries.find(e=>e.key===`aid:${aid}`);
  assert(e && ready.has(e.key),`duplicate metadata must not hide inspected letter ${aid}`);
  assert.equal(e.canonical_file,`data/items/chabad-letter-${aid}.json`);
  assert(e.proposition_source_locator && e.documented_circumstances);
}
assert(queue.records.every(e=>e.source_url&&!ready.has(e.key)),'review queue must exclude inspected content');
const batch055Required=[
 [2513915,2],[2513926,2],[2513933,5],[2512360,2],[2513548,2],[2513585,2],[2512155,2],[2513564,2],
 [5996764,2],[5996765,4],[5996725,4],[2512365,5],[2512137,4]
];
for(const [aid,minProps] of batch055Required){
 const e=idx.entries.find(x=>sourceAID(x)===String(aid));
 assert(e&&e.has_content_evidence,`batch-055 source ${aid} must have inspected content evidence`);
 assert.equal(e.status,'Verified',`batch-055 source ${aid} must retain its scoped Verified status`);
 assert(e.response_propositions.length>=minProps,`batch-055 source ${aid} must expose its inspected propositions`);
 assert(e.proposition_source_locator&&e.verification_scope,`batch-055 source ${aid} must expose precise locator and scope`);
 assert.equal(e.context_status,'partial',`batch-055 source ${aid} must preserve partial context`);
}
assert.equal(idx.entries.filter(e=>e.evidence_family_id==='10-kislev-5745-farbrengen').length,1,
 'the separately published first sicha of 10 Kislev must remain inside one event-level Evidence Family');
for(const q of ['מה הרבי אמר על חינוך ילדים?','מה הרבי אמר על דאגה?','מה הרבי אמר על בטחון?']){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,q,{mode});
    assert(m.answerable,`${mode}: real source evidence must answer ${q}`);
    assert(m.sources.length>=2,`${q}: require multiple independently located witnesses`);
    assert(m.claims.every(c=>c.source_numbers.length),'each real content claim needs a citation');
  }
}
const publicationQuestion='מה עולה מהאיגרות על מימון והפצת ספרי חסידות?';
for(const mode of ['regular','researcher']){
  const m=buildAnswerModel(idx.entries,publicationQuestion,{mode});
  assert(m.answerable,`${mode}: inspected publication evidence must answer the natural-language query`);
  assert(m.sources.length>=3,`${mode}: publication synthesis must use at least three independent evidence families`);
  assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=3,`${mode}: translations or duplicate witnesses must not inflate publication synthesis`);
  assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every publication claim needs a proposition-level citation`);
  if(mode==='researcher'){
    assert(m.research&&m.research.evidence_families>=1,`${mode}: researcher mode must expose independent-family depth`);
    assert.equal(m.research.witnesses.length,m.sources.length,`${mode}: researcher mode must expose witness-level provenance for every source`);
    assert(m.research.evidence_map.length>0,`${mode}: researcher mode must expose a claim-to-witness evidence map`);
    assert(m.research.citation_entailment.every(x=>x.valid),`${mode}: researcher claims must pass claim-local citation entailment`);
    assert(m.research.context_boundary.every(x=>x.valid),`${mode}: researcher mode must preserve witness-local context boundaries`);
  }else assert.equal(m.research,undefined,'regular mode must not be padded with researcher-only evidence analysis');
  assert(!m.sources.some(e=>['id:igrot-scan-v13-letter-4-282','id:igrot-scan-v13-letter-4-284'].includes(e.key)),`${mode}: מספר/הפצה כללית must not masquerade as book-publication evidence`);
}
const privateFastQuestion='מה כתב הרבי על תעניות שאדם מוסיף מדעתו?';
for(const mode of ['regular','researcher']){
  const m=buildAnswerModel(idx.entries,privateFastQuestion,{mode});
  assert(m.answerable,`${mode}: inspected private-fast evidence must answer the uncatalogued query`);
  assert(m.sources.some(e=>e.key==='id:igrot-scan-v13-letter-4-287'),`${mode}: the inspected volume XIII witness must be retrieved`);
  assert(m.sources.length<=3,`${mode}: generic single-token overlap must not flood the private-fast answer`);
  assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every private-fast claim needs a proposition-level citation`);
}
const practicalHalachaQuestion='מה כתב הרבי על לימוד הלכה מעשית בבית הכנסת?';
for(const mode of ['regular','researcher']){
  const m=buildAnswerModel(idx.entries,practicalHalachaQuestion,{mode});
  assert(m.answerable,`${mode}: inspected practical-halacha evidence must answer the query`);
  assert(m.sources.some(e=>e.evidence_family_id==='igrot-kodesh-v13-letter-4296'),`${mode}: the inspected practical-halacha correspondence family must be retrieved`);
  assert(!m.sources.some(e=>String(e.aid)==='4202219'),`${mode}: a synagogue phobia response must not match a practical-halacha query solely on location words`);
  assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every practical-halacha claim needs a proposition-level citation`);
}
const kfarRecoveryQuestion='מה הציע הרבי לשיקום כפר חב״ד אחרי הפיגוע?';
for(const mode of ['regular','researcher']){
  const m=buildAnswerModel(idx.entries,kfarRecoveryQuestion,{mode});
  assert(m.answerable,`${mode}: inspected Kfar Chabad recovery evidence must answer the query`);
  assert(m.sources.some(e=>e.evidence_family_id==='kfar-chabad-1956-attack-recovery'),`${mode}: the event-level recovery family must be retrieved`);
  assert(!m.sources.some(e=>e.key==='id:igrot-scan-v13-letter-4-297'),`${mode}: a Kfar Chabad interpersonal dispute must not match the attack-recovery query`);
  assert(!m.sources.some(e=>e.evidence_family_id==='american-rabbinic-organizations-1956'),`${mode}: a letter whose main family is rabbinic-organization policy must not match solely on Kfar metadata`);
  assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every Kfar recovery claim needs a proposition-level citation`);
}
const yeshivaEnrollmentQuestion='כיצד הציע הרבי להגדיל את מספר התלמידים בישיבה?';
for(const mode of ['regular','researcher']){
  const m=buildAnswerModel(idx.entries,yeshivaEnrollmentQuestion,{mode});
  assert(m.answerable,`${mode}: inspected yeshiva-enrollment evidence must answer the query`);
  assert(m.sources.some(e=>e.key==='id:igrot-scan-v13-letter-4-319'),`${mode}: letter ד׳שיט must support the enrollment answer`);
  assert(m.sources.length<=3,`${mode}: broad education evidence must not flood a specific enrollment-policy answer`);
  assert(m.sources.every(e=>['id:igrot-scan-v13-letter-4-284','id:igrot-scan-v13-letter-4-292','id:igrot-scan-v13-letter-4-319','aid:4754490'].includes(e.key)),`${mode}: only inspected enrollment propositions may enter the answer`);
  assert(m.sources.some(e=>String(e.aid)==='4754490'),`${mode}: inspected Boston room-expansion/admission letter must remain eligible`);
  assert(!m.sources.some(e=>['5413024','5413540'].includes(String(e.aid))),`${mode}: general yeshiva expansion/support sources must not enter a narrow recruitment query`);
  assert(!m.sources.some(e=>String(e.aid)==='4812649'),`${mode}: a letter about decline and perseverance must not be mistaken for an explicit recruitment plan`);
  assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every enrollment claim needs a proposition-level citation`);
}
const brownsvilleQuestion='מה נדרש כדי להציל את בתי הספר בית רבקה בבראונסוויל?';
for(const mode of ['regular','researcher']){
  const m=buildAnswerModel(idx.entries,brownsvilleQuestion,{mode});
  assert(m.answerable,`${mode}: inspected Brownsville Beis Rivka evidence must answer the query`);
  assert(m.sources.some(e=>e.key==='id:igrot-kodesh-v13-דשכט'),`${mode}: the inspected Yiddish public appeal must be retrieved`);
  assert(m.sources.length===1,`${mode}: generic school and fundraising sources must not enter the Brownsville building answer`);
  assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every Brownsville claim needs a proposition-level citation`);
}
const lagBaomerYouthQuestion='כיצד הציע הרבי לפעול בל״ג בעומר עם בני נוער?';
for(const mode of ['regular','researcher']){
  const m=buildAnswerModel(idx.entries,lagBaomerYouthQuestion,{mode});
  const lagBaomerYouthWitnessRetrieved=(m.sources||[]).some(e=>String(e.evidence_family_id||'')==='lag-baomer-1956-outreach-campaign'&&e.has_content_evidence===true&&(e.response_propositions||[]).some(p=>/(?:נוער|נער|ילד|youth|teen|adolescent)/.test(String(p))));
  if(!lagBaomerYouthWitnessRetrieved){
    assert.equal(m.answerable,false,`${mode}: without a retrieved, inspected event-specific youth witness, the query must fail closed`);
    assert.equal(m.reason,'specific_event_evidence_missing');
    assert.equal(m.claims.length,0);
  }else{
    assert(m.answerable,`${mode}: inspected Lag BaOmer youth evidence must answer the query`);
  }
  assert(!m.sources.some(e=>['aid:4666207','url:https://www.chabad.org/therebbe/article_cdo/aid/4666217/jewish/page.htm'].includes(e.key)),`${mode}: consolation letters must not match a Lag BaOmer query through generic action words`);
}
const forgetfulnessDreamsQuestion='מה כתב הרבי על שכחה וחלומות?';
for(const mode of ['regular','researcher']){
  const m=buildAnswerModel(idx.entries,forgetfulnessDreamsQuestion,{mode});
  assert(m.answerable,`${mode}: inspected forgetfulness-and-dreams evidence must answer the query`);
  assert(m.sources.some(e=>e.id==='igrot-kodesh-v13-דשלג'&&sourceAID(e)==='4994228'),`${mode}: existing letter ד׳שלג must resolve to its inspected public publisher AID 4994228`);
  assert(m.sources.length<=2,`${mode}: generic mezuzah or health evidence must not flood the specific query`);
  assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every forgetfulness-and-dreams claim needs a proposition-level citation`);
}
const genericForgetfulnessQuestion='מה נכתב באיגרות על שכחה ושיטות למידה?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,genericForgetfulnessQuestion,{mode});
 assert(m.answerable,mode+': generic forgetfulness query must remain answerable');
 assert(m.sources.some(e=>sourceAID(e)==='4994228'&&e.id==='igrot-kodesh-v13-דשלג'),mode+': the existing letter identity must remain retrievable by its actual publisher AID 4994228');
}
const institutionalSupportQuestion='מה נכתב באיגרות על תמיכה בתלמוד תורה במצב דחוק?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,institutionalSupportQuestion,{mode});
 assert(m.answerable,mode+': inspected Talmud Torah support letter must answer a bounded educational-support query');
 assert(m.sources.some(e=>sourceAID(e)==='4929245'&&e.id==='library-igrot-kodesh-v11-3772'),mode+': existing volume-XI bibliographic identity must resolve to public AID 4929245');
 assert(m.sources.length<=2,mode+': generic charity sources must not flood the institutional-support query');
 assert(!m.sources.some(e=>sourceAID(e)==='4279926'),mode+': general support for kosher educational institutions must not match the specific distressed Talmud Torah case');
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length),mode+': each institutional-support claim needs proposition-level citations');
 assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid),mode+': institutional-support claims must pass citation and context checks');
 if(mode==='researcher'){
  assert(m.research&&m.research.evidence_families>=1,mode+': researcher mode must expose the supporting Evidence Family');
  assert(m.research.evidence_map.length>0,mode+': researcher mode must expose a claim-to-witness evidence map');
  assert.equal(m.research.witnesses.length,m.sources.length,mode+': researcher mode must expose witness-level provenance');
 }
}
const charityStudyQuestion='האם צדקה מחליפה לימוד ויגיעה?';
for(const mode of ['regular','researcher']){
  const m=buildAnswerModel(idx.entries,charityStudyQuestion,{mode});
  assert(m.answerable,`${mode}: inspected charity-and-study evidence must answer the query`);
  assert(m.sources.some(e=>e.key==='id:igrot-kodesh-v13-דשלא'),`${mode}: letter ד׳שלא must support the charity-and-study answer`);
  assert(m.sources.length<=2,`${mode}: generic charity evidence must not enter the specific study-effort answer`);
  assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every charity-and-study claim needs a proposition-level citation`);
}
const uniqueRoleQuestion='מה נדרש ממי שיש לו תפקיד ייחודי בענייני דת?';
for(const mode of ['regular','researcher']){
  const m=buildAnswerModel(idx.entries,uniqueRoleQuestion,{mode});
  assert(m.answerable,`${mode}: inspected unique-role evidence must answer the query`);
  assert(m.sources.some(e=>e.key==='id:igrot-scan-v13-letter-4-330'),`${mode}: letter ד׳של must support the unique-role answer`);
  assert(m.sources.length<=3,`${mode}: generic mission language must not flood the unique-role answer`);
  assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every unique-role claim needs a proposition-level citation`);
}
const marginaliaQuestion='האם צריך להדפיס מחדש ספר כדי לפרסם הערות שוליים?';
for(const mode of ['regular','researcher']){
  const m=buildAnswerModel(idx.entries,marginaliaQuestion,{mode});
  assert(m.answerable,`${mode}: inspected book-marginalia evidence must answer the query`);
  assert(m.sources.some(e=>e.key==='id:igrot-kodesh-v13-דשדמ'),`${mode}: letter ד׳שמד must support the marginalia answer through its legacy canonical identity`);
  assert(m.sources.length===1,`${mode}: generic book-publication evidence must not enter the specific marginalia answer`);
  assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every marginalia claim needs a proposition-level citation`);
}
const dentalQuestion='מה כתב הרבי על עקירת שיניים וחוות דעת נוספת?';
for(const mode of ['regular','researcher']){
  const m=buildAnswerModel(idx.entries,dentalQuestion,{mode});
  assert(m.answerable,`${mode}: inspected dental evidence must answer the query`);
  assert(m.sources.some(e=>e.key==='id:igrot-scan-v13-letter-4-349'),`${mode}: letter ד׳שמט must support the dental answer`);
  assert(m.sources.length===1,`${mode}: generic health evidence must not enter the specific dental answer`);
  assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every dental claim needs a proposition-level citation`);
}
const repetitionMemoryQuestion='איך לחזור על חסידות ולשפר זיכרון?';
for(const mode of ['regular','researcher']){
  const m=buildAnswerModel(idx.entries,repetitionMemoryQuestion,{mode});
  assert(m.answerable,`${mode}: inspected repetition-and-memory evidence must answer the query`);
  assert(m.sources.some(e=>e.key==='id:igrot-kodesh-v13-דשמו'),`${mode}: letter ד׳שמו must support the repetition-and-memory answer`);
  assert(m.sources.length<=3,`${mode}: generic study or forgetfulness evidence must not flood the combined query`);
  assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every repetition-and-memory claim needs a proposition-level citation`);
}
const mikvehPeaceQuestion='האם צריך להמתין לשלום לפני שמקדמים בניית מקווה?';
for(const mode of ['regular','researcher']){
  const m=buildAnswerModel(idx.entries,mikvehPeaceQuestion,{mode});
  assert(m.answerable,`${mode}: inspected mikveh-and-peace evidence must answer the query`);
  assert(m.sources.some(e=>e.key==='id:igrot-scan-v13-letter-4-348'),`${mode}: letter ד׳שמח must support the mikveh-and-peace answer`);
  assert(m.sources.length===1,`${mode}: generic mikveh or dispute evidence must not enter the specific answer`);
  assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every mikveh-and-peace claim needs a proposition-level citation`);
}
const synagogueUnionQuestion='מה כתב הרבי על נוסח התפילה באיחוד בתי כנסת?';
for(const mode of ['regular','researcher']){
  const m=buildAnswerModel(idx.entries,synagogueUnionQuestion,{mode});
  assert(m.answerable,`${mode}: inspected synagogue-union evidence must answer the query`);
  assert(m.sources.some(e=>e.key==='id:igrot-scan-v13-letter-4-350'),`${mode}: letter ד׳שנ must support the synagogue-union answer`);
  assert(m.sources.length===1,`${mode}: generic synagogue or rabbinic-organization evidence must not enter the union-and-nusach answer`);
  assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every synagogue-union claim needs a proposition-level citation`);
}
const moroccanLanguageQuestion='כיצד המליץ הרבי לפעול עם עולים ממרוקו שאינם מבינים יידיש?';
for(const mode of ['regular','researcher']){
  const m=buildAnswerModel(idx.entries,moroccanLanguageQuestion,{mode});
  assert(m.answerable,`${mode}: inspected Moroccan-immigrant language evidence must answer the query`);
  assert(m.sources.some(e=>e.key==='id:igrot-scan-v13-letter-4-359'),`${mode}: letter ד׳שנט must support the Moroccan-immigrant answer`);
  assert(m.sources.length===1,`${mode}: generic Yiddish or immigration evidence must not enter the language-access answer`);
  assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every Moroccan-immigrant claim needs a proposition-level citation`);
}
const livelihoodExitQuestion='האם כדאי לעזוב מקור פרנסה כדי לפעול בחב״ד?';
for(const mode of ['regular','researcher']){
  const m=buildAnswerModel(idx.entries,livelihoodExitQuestion,{mode});
  assert(m.answerable,`${mode}: inspected livelihood-exit evidence must answer the query`);
  assert(m.sources.some(e=>e.key==='id:igrot-scan-v13-letter-4-359'),`${mode}: letter ד׳שנט must support the livelihood-exit answer`);
  assert(m.sources.length===1,`${mode}: generic livelihood evidence must not enter the specific exit decision`);
  assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every livelihood-exit claim needs a proposition-level citation`);
}
const torahLoveComparison='מה כתב הרבי על אהבת התורה לעומת אהבת ה׳?';
for(const mode of ['regular','researcher']){
  const m=buildAnswerModel(idx.entries,torahLoveComparison,{mode});
  assert(m.answerable,`${mode}: inspected comparison must cover both love-of-Torah and love-of-G-d`);
  assert(m.sources.some(e=>e.key==='id:igrot-scan-v13-letter-4-354'),`${mode}: letter ד׳שנד must support the comparison`);
  assert(m.sources.length===1,`${mode}: generic Torah or love evidence must not enter the specific comparison`);
  assert.deepEqual(new Set(m.comparative_coverage.supported_topics),new Set(['אהבת התורה','אהבת ה׳']),`${mode}: both comparison sides need proposition-level coverage`);
  assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every love comparison claim needs a proposition-level citation`);
}
const focusedClassQuestion='מה כתב הרבי על תוספת אברכים והרחבת שיעור חסידות?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,focusedClassQuestion,{mode});
 assert(m.answerable,`${mode}: focused class-expansion query must be answerable`);
 assert.deepEqual(m.sources.map(e=>e.key),['id:igrot-kodesh-v13-דתרפא'],`${mode}: class-expansion query must exclude generic livelihood/business letters`);
 assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every focused class-expansion claim needs a proposition citation`);
}

const newBatchChecks=[
  ['מה כתב הרבי על אותיות בולטות במצבה?','id:igrot-kodesh-v13-דשטג'],
  ['האם צריך לסגור סניף תלמוד תורה שאינו מצליח?','id:igrot-kodesh-v13-דשסז'],
  ['מה כתב הרבי על תוספת אברכים והרחבת שיעור חסידות?','id:igrot-kodesh-v13-דתרפא'],
  ['מה נכתב במכתב המזכירות על עיסוק במסחר בזמן לימוד בישיבה?','id:igrot-kodesh-v13-דשם']
];
for(const [question,key] of newBatchChecks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-018 evidence must answer ${question}`);
    assert.deepEqual(m.sources.map(e=>e.key),[key],`${mode}: the specific batch-018 query must retrieve only its inspected evidence family`);
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-018 claim needs a proposition-level citation`);
  }
}


const batch018Comparison='השווה בין האיגרת על הוספת אברכים לשיעור חסידות לבין האיגרת למדריך במחנה גן ישראל על הרחבת ההשפעה ועל לימוד אישי';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,batch018Comparison,{mode});
 assert.equal(m.answerable,false,mode+': do not answer the camp-counselor side without an inspectable, answer-eligible proposition');
 assert.equal(m.reason,'comparative_missing_side',mode+': missing camp evidence must fail closed');
 assert(m.sources.some(e=>e.key==='id:igrot-kodesh-v13-דתרפא'),mode+': retain the supported yeshiva-class side');
 assert(!m.sources.some(e=>e.key==='id:igrot-kodesh-v13-דתרעו'),mode+': do not treat the unlocated camp-counselor identity as evidence');
 assert(m.comparative_coverage.missing_topics.includes('מדריך מחנה גן ישראל והשפעה'),mode+': identify the missing side explicitly');
 assert(m.insufficient_evidence.some(s=>s.includes('מדריך מחנה גן ישראל והשפעה')),mode+': explain the evidence gap');
}
const beitRivkaComparison='השווה בין האיגרת על בקשת ויזה באמצעות בית רבקה לבין האיגרת לוועד בית הספר לנערות בית רבקה בפריז על רישום המוסד לרשת ותכנית הלימודים הרגילה';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,beitRivkaComparison,{mode});
 assert(m.answerable,mode+': inspected Beit Rivka letters must support a two-source comparison');
 assert(m.sources.some(e=>String(e.aid)==='4666292'),mode+': include the visa/branch-committee letter');
 assert(m.sources.some(e=>String(e.aid)==='4666305'),mode+': include the Paris school-registration letter');
 assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=2,mode+': retain two distinct Evidence Families');
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length),mode+': every comparison claim needs claim-local citations');
 assert(m.citation_entailment.every(x=>x.valid),mode+': comparison citations must pass proposition entailment');
 assert(m.context_boundary.every(x=>x.valid),mode+': comparison must preserve witness-local context');
 assert(m.comparative_coverage.supported_topics.includes('בית רבקה בקשת ויזה וסיוע לפליטים'));
 assert(m.comparative_coverage.supported_topics.includes('בית רבקה פריז ורישום בית ספר'));
 if(mode==='researcher'){
  assert(m.research&&m.research.evidence_families>=2,mode+': researcher comparison must expose both families');
  assert(m.research.witnesses.length===m.sources.length,mode+': researcher mode must expose every witness');
  assert(m.research.evidence_map.length>0,mode+': researcher mode must expose a claim-to-witness map');
  assert(m.research.citation_entailment.every(x=>x.valid)&&m.research.context_boundary.every(x=>x.valid),mode+': researcher mode must expose valid claim-local checks');
 }else assert.equal(m.research,undefined,'regular mode must not include researcher-only evidence analysis');
}

// Batch 062: nine new Hebrew/Yiddish letters and one in-place enrichment.
const batch062Required=[
 [4666289,2,'original-letter-aid-4666289'],
 [4666291,2,'original-letter-aid-4666291'],
 [4666292,2,'original-letter-aid-4666292'],
 [4666293,2,'original-letter-aid-4666293'],
 [4666294,2,'original-letter-aid-4666294'],
 [4666296,2,'original-letter-aid-4666296'],
 [4666297,2,'original-letter-aid-4666297'],
 [4666300,2,'original-letter-aid-4666300'],
 [4666301,2,'original-letter-aid-4666301'],
 [4666305,2,'original-letter-aid-4666305']
];
for(const [aid,minProps,family] of batch062Required){
 const e=idx.entries.find(x=>sourceAID(x)===String(aid));
 assert(e&&e.has_content_evidence,'batch-062 AID '+aid+' must have inspected publisher text');
 assert.equal(e.status,'Verified','batch-062 AID '+aid+' must retain scoped publisher-text verification');
 assert.equal(e.evidence_family_id,family,'batch-062 AID '+aid+' must have one distinct Evidence Family');
 assert(e.response_propositions.length>=minProps,'batch-062 AID '+aid+' must expose its inspected paraphrases');
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope);
 assert.equal(e.context_status,'partial');
 assert(!queue.records.some(q=>String(q.key||'').includes('/aid/'+aid+'/')||String(q.source_url||'').includes('/aid/'+aid+'/')),'batch-062 AID '+aid+' must not remain in the review queue');
}
const publishingQuestion='מה נכתב באגרות על הדפסת ספרי חסידות, איסוף תיקונים והפצתם?';
const publicationNormalization=buildAnswerModel(idx.entries,publishingQuestion,{mode:'regular'}).understanding;
assert(!publicationNormalization.topics.includes('הפצת ספרים'),'specific editorial topic must suppress generic publishing bucket');
assert(!publicationNormalization.subtopic.includes('פצתם'),'definite-article stripping must not leave הפצתם as an unsupported residual qualifier');
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,publishingQuestion,{mode});
 if(!m.answerable) throw new Error(mode+': publication synthesis unavailable');
const batch069Required=[[2513862,2],[3294872,2],[2515100,2],[3294874,2],[2513197,2],[2514917,2],[2183868,2],[2600571,2],[2516887,2],[2600694,2],[5989776,3],[5989136,2],[4950814,3]];
for(const [aid,minProps] of batch069Required){const e=idx.entries.find(x=>sourceAID(x)===String(aid));assert(e&&e.has_content_evidence,`batch069 ${aid} content`);assert.equal(e.status,'Verified');assert(e.response_propositions.length>=minProps);assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');assert(e.proposition_source_locator&&e.verification_scope);assert.equal(e.context_status,'partial');}
const audioOnly=idx.entries.filter(e=>['553672','553673'].includes(String(e.aid)));assert.equal(audioOnly.length,2);assert.equal(new Set(audioOnly.map(e=>e.evidence_family_id)).size,1);assert(audioOnly.every(e=>!e.has_content_evidence&&!e.response_propositions?.length));
const pesachA=idx.entries.find(e=>String(e.aid)==='2513862'),pesachB=idx.entries.find(e=>String(e.aid)==='3294874');assert.notEqual(pesachA.evidence_family_id,pesachB.evidence_family_id);assert(pesachB.relations.some(r=>String(r.target_aid)==='2513862'));
for(const mode of ['regular','researcher']){const m=buildAnswerModel(idx.entries,'מה כתב הרבי למי שקשה לו להתפרנס בגלל עבודה בשבת?',{mode});assert(m.answerable);assert(m.sources.some(e=>String(e.aid)==='4950814'));assert(m.claims.every(c=>c.source_numbers.length));assert(m.citation_entailment.every(x=>x.valid));assert(m.context_boundary.every(x=>x.valid));if(mode==='researcher'){assert(m.research.evidence_map.length>0);assert.equal(m.research.witnesses.length,m.sources.length);}}
for(const mode of ['regular','researcher']){const m=buildAnswerModel(idx.entries,'מה נאמר במקורות על הימים שלאחר השבת המתברכים ממנה?',{mode});assert(m.answerable);assert(m.sources.some(e=>String(e.aid)==='5989776'));assert(m.sources.some(e=>String(e.aid)==='5989136'));assert(m.claims.every(c=>c.source_numbers.length));assert(m.citation_entailment.every(x=>x.valid));assert(m.context_boundary.every(x=>x.valid));if(mode==='researcher'){assert(m.research.evidence_families>=2);assert(m.research.evidence_map.length>0);assert.equal(m.research.witnesses.length,m.sources.length);}else assert.equal(m.research,undefined);}
const blockedErev=buildAnswerModel(idx.entries,'מה נאמר על ברכה בערב שבת וערב ראש חודש?',{mode:'regular'});assert(!blockedErev.sources.some(e=>String(e.aid)==='5413068'));

 assert(m.answerable,mode+': inspected publication and editorial evidence must answer');
 assert(m.sources.length>=3,mode+': publication synthesis must use at least three source families');
 assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=3,mode+': duplicate witnesses must not inflate publication synthesis');
 for(const aid of [4666289,4666300,4666301]) assert(m.sources.some(e=>sourceAID(e)===String(aid)),mode+': AID '+aid+' must support publication synthesis');
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length),mode+': every publication claim needs claim-local citations');
 assert(m.citation_entailment.every(x=>x.valid),mode+': publication citations must pass proposition entailment');
 assert(m.context_boundary.every(x=>x.valid),mode+': publication synthesis must preserve witness-local context');
 if(mode==='researcher'){
  assert(m.research&&m.research.evidence_families>=3,mode+': researcher mode must expose at least three independent families');
  assert(m.research.witnesses.length===m.sources.length,mode+': researcher mode must expose every witness');
  assert(m.research.evidence_map.length>0,mode+': researcher mode must expose a claim-to-witness map');
  assert(m.research.citation_entailment.every(x=>x.valid)&&m.research.context_boundary.every(x=>x.valid),mode+': researcher mode must expose valid claim-local checks');
  const derivedSources=m.sources.filter(e=>e._independent_witness===false);
  const independentSources=m.sources.filter(e=>e._independent_witness!==false);
  assert.equal(m.research.evidence_integrity.independent_witnesses,independentSources.length,mode+': derived translations must not be counted as independent witnesses');
  assert.equal(m.research.evidence_integrity.derived_non_independent,derivedSources.length,mode+': every derived translation must remain explicitly non-independent');
  assert(independentSources.length>=3,mode+': synthesis must retain at least three independent original-language Evidence Families');
  assert(derivedSources.every(e=>/translation|derived/i.test(String(e.primary_secondary_status||''))),mode+': non-independent sources must be explicitly identified as translations/derived witnesses');
 }else assert.equal(m.research,undefined,'regular publication mode must not include researcher-only analysis');
}



const batch070Required=[[4096309,2,'pastoral-letter-5737-28-tishrei-4096309'],[4096316,2,'pastoral-letter-5714-11-tammuz-4096316'],[2187392,3,'pastoral-letter-5714-10-kislev-2187392'],[1878120,2,'pastoral-letter-5726-13-teves-1878120'],[4380025,3,'pastoral-letter-undated-purpose-of-challenges-4380025'],[1858362,2,'pastoral-letter-5724-days-of-selichoth-1858362'],[2190037,2,'pastoral-letter-5723-22-elul-2190037'],[1861674,2,'pastoral-letter-5719-25-elul-1861674'],[63797,2,'pastoral-letter-5719-9-iyar-63797'],[6976443,3,'pastoral-letter-5725-20-tammuz-6976443'],[2989328,3,'torat-menachem-letter-5710-rishon-selichot-yeshiva-students-2989328'],[2989329,3,'torat-menachem-letter-5710-yom-rishon-selichot-2989329'],[4279887,3,'torat-menachem-letter-5712-11-nissan-yeshiva-students-4279887'],[2313660,2,'yiddish-letter-5720-lag-baomer-womens-organization-2313660'],[142535,4,'reagan-rebbe-correspondence-1981-1987-aid142535']];
for(const [aid,minProps,family] of batch070Required){const e=idx.entries.find(x=>sourceAID(x)===String(aid));assert(e&&e.has_content_evidence,'batch070 AID '+aid+' content');assert.equal(e.status,'Verified');assert.equal(e.evidence_family_id,family);assert(e.response_propositions.length>=minProps);assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');assert(e.proposition_source_locator&&e.verification_scope);assert.equal(e.context_status,'partial');}
for(const aid of [4096309,4096316,2187392,1878120,4380025,1858362,1861674,63797,6976443,2989328,2989329,4279887,142535])assert.equal(idx.entries.find(e=>sourceAID(e)===String(aid)).independent_witness,true);
const transcribed2190037=idx.entries.find(e=>String(e.aid)==='2190037'),yiddishTranslation=idx.entries.find(e=>String(e.aid)==='2313660');
assert.equal(transcribed2190037.independent_witness,false);assert.equal(yiddishTranslation.independent_witness,false);assert.equal(yiddishTranslation.original_language,'Yiddish');
for(const aid of [2989328,2989329,4279887]){const e=idx.entries.find(x=>sourceAID(x)===String(aid));assert.equal(e.language,'Hebrew');assert.equal(e.original_language,'Hebrew');}
const dossier=idx.entries.find(e=>String(e.aid)==='142535');assert.equal(dossier.type,'correspondence_dossier');assert.equal(dossier.source_class,'Written responses');assert(/President|נשיא/i.test(dossier.audience||''),'dossier addressee context belongs in the audience field, not the conditions field');
assert(!queue.records.some(q=>[4096309,4096316,2187392,1878120,4380025,1858362,2190037,1861674,63797,6976443,2989328,2989329,4279887,2313660,142535].some(aid=>String(q.aid)===String(aid)||String(q.source_url||'').includes('/aid/'+aid+'/'))));
for(const mode of ['regular','researcher']){const m=buildAnswerModel(idx.entries,'מה הדפוס החוזר באגרות על התמודדות עם קשיים ומכשולים?',{mode});if(!m.answerable)console.error('DIFFICULTY_PATTERN_DEBUG',mode,m.reason,m.understanding,m.sources?.map(e=>({aid:e.aid,family:e.evidence_family_id,props:e._supporting_propositions})));assert(m.answerable,mode+': bounded difficulty pattern');for(const aid of [4096309,4096316,4380025])assert(m.sources.some(e=>sourceAID(e)===String(aid)));assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=3);assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));assert.equal(m.synthesis?.attribution,'system_synthesis_not_rebbe_quote');assert.equal(m.pattern_synthesis_integrity.valid,true);if(mode==='researcher')assert(m.research.synthesis_constraints.rule.includes('not independent witnesses'));assert.equal(m.pattern_synthesis_integrity?.valid,true);assert(m.synthesis.source_numbers.length>=3);assert(m.synthesis.basis.every(b=>b.propositions.every(p=>p.source_locator)));if(mode==='researcher'){assert(m.research.evidence_families>=3);assert(m.research.evidence_integrity.independent_witnesses>=3);assert(m.research.evidence_map.length>0);assert.equal(m.research.pattern_synthesis_integrity.valid,true);}else assert.equal(m.research,undefined);}
const batch073Aids=[4994478,5413029,4872259,5357369,4731085,4730903,4731008,5357544,5357574,4854544,4279854];
for(const aid of batch073Aids){
 const e=idx.entries.find(x=>sourceAID(x)===String(aid));
 assert(e,'batch 073 source missing from reconciled index: '+aid);
 assert.equal(e.status,'Verified','batch 073 source must be content-verified: '+aid);
 assert(e.has_content_evidence&&e.response_propositions.length>=2,'batch 073 source needs inspected propositions: '+aid);
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope&&e.evidence_family_id,'batch 073 provenance incomplete: '+aid);
}
const secretariat073=idx.entries.find(e=>e.id==='secretariat-letter-5357574-5719-12-sivan');
assert(secretariat073&&secretariat073.status==='Verified'&&secretariat073.has_content_evidence,'separate secretariat document must be indexed as its own source');
assert(secretariat073.response_propositions.every(p=>/אגרת המזכירות|המסמך/.test(p)),'secretariat propositions must not be attributed to the Rebbe');
const duplicate073=idx.entries.filter(e=>['4854544','5413573'].includes(String(e.aid)));
assert.equal(duplicate073.length,2,'original letter and publisher-identified reprint alias must both be represented');
assert.equal(new Set(duplicate073.map(e=>e.evidence_family_id)).size,1,'publisher-identified reprint must join the original Evidence Family');
assert.equal(duplicate073.find(e=>String(e.aid)==='5413573').status,'Linked','duplicate reprint must not be an independent answer source');
const yeshivaAlias073=batch073Data.records.find(e=>String(e.aid)==='4783983');
const yeshivaOriginal073=idx.entries.find(e=>String(e.aid)==='4279887');
assert(yeshivaAlias073&&yeshivaAlias073.status==='Linked'&&!yeshivaAlias073.has_content_evidence,'AID 4783983 must be a linked duplicate mirror');
assert(yeshivaOriginal073&&yeshivaAlias073.evidence_family_id===yeshivaOriginal073.evidence_family_id,'AID 4783983 must join existing AID 4279887 Evidence Family');
const talk073=idx.entries.find(e=>String(e.aid)==='4279854');
assert(talk073&&talk073.status==='Verified'&&talk073.type==='talk'&&talk073.has_content_evidence,'AID 4279854 must remain a distinct talk transcript, not a letter');
const englishTranslation073=batch073Data.records.find(e=>String(e.aid)==='4096303');
const originalIdentity073=batch073Data.records.find(e=>e.id==='igrot-letter-5737-21-cheshvan-vol32-p48-original');
assert(englishTranslation073&&englishTranslation073.status==='Linked'&&englishTranslation073.has_content_evidence&&englishTranslation073.response_propositions.length===4,'English translation may carry inspected content but remains a linked translation manifestation');
assert(englishTranslation073.translation_observations.length===3&&englishTranslation073.independent_witness===false&&englishTranslation073.translation_of_evidence_family_id===englishTranslation073.evidence_family_id,'English translation must remain non-independent and in the original Evidence Family');
assert(originalIdentity073&&originalIdentity073.status==='Catalogued'&&!originalIdentity073.has_content_evidence&&originalIdentity073.evidence_family_id===englishTranslation073.evidence_family_id,'metadata-only Hebrew bibliographic identity remains linked to the translation family');
assert(originalIdentity073&&originalIdentity073.status==='Catalogued'&&!originalIdentity073.has_content_evidence,'original Hebrew bibliographic identity is metadata-only');
assert.equal(englishTranslation073.evidence_family_id,originalIdentity073.evidence_family_id,'English translation must share the original bibliographic Evidence Family');
const enriched073=idx.entries.find(e=>String(e.aid)==='5071138');
assert(enriched073&&enriched073.response_propositions.length>=3,'existing AID 5071138 must retain the added source-grounded proposition');
const singleDifficultyEntries=idx.entries.filter(e=>String(e.aid)==='4096309');
const singleDifficultyFamily=buildAnswerModel(singleDifficultyEntries,'מה הדפוס החוזר באגרות על התמודדות עם קשיים ומכשולים?',{mode:'researcher'});

assert.equal(singleDifficultyFamily.answerable,false,'one Evidence Family cannot establish a cross-family pattern');
assert.equal(singleDifficultyFamily.reason,'single_evidence_family');
for(const mode of ['regular','researcher']){const m=buildAnswerModel(idx.entries,'מה נכתב במכתבים ובשיחות בעברית על אחריות תלמידי הישיבות להשפיע על הזולת ולחנך?',{mode});assert(m.answerable,mode+': Hebrew yeshiva influence sources');for(const aid of [2989328,4279887,4279854])assert(m.sources.some(e=>sourceAID(e)===String(aid)),'missing Hebrew yeshiva source '+aid);assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));if(mode==='researcher')assert(m.research.evidence_families>=2);}
for(const mode of ['regular','researcher']){const m=buildAnswerModel(idx.entries,'מה כתב הרבי על ייעוד האדם והשפעה על העולם?',{mode});assert(m.answerable,mode+': individual purpose query');for(const aid of [2187392,1858362,1861674])assert(m.sources.some(e=>sourceAID(e)===String(aid)),'missing individual purpose source '+aid);assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));}
for(const mode of ['regular','researcher']){const m=buildAnswerModel(idx.entries,'מה כתב הרבי לנשיא רייגן על חינוך וערכים מוסריים?',{mode});assert(m.answerable,mode+': correspondence dossier query');assert(m.sources.some(e=>String(e.aid)==='142535'));assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));}
const singleFamilyPattern=buildAnswerModel(idx.entries,'מה הדפוס החוזר במכתבים על ניהול מחשבות והסחת הדעת?',{mode:'researcher'});assert.equal(singleFamilyPattern.answerable,false);assert.equal(singleFamilyPattern.reason,'no_cross_family_pattern');
const translationAudit=buildAnswerModel(idx.entries,'מה נכתב במכתב היידי על הזוהר והביטחון?',{mode:'researcher'});assert(translationAudit.sources.some(e=>String(e.aid)==='2313660'));assert.equal(translationAudit.sources.find(e=>String(e.aid)==='2313660')._independent_witness,false);assert(translationAudit.research.evidence_integrity.derived_non_independent>=1);

// Batch 063: nine inspected letters, including one Parsed member of an existing family.
const batch063Required=[[4666280,3,'evidence-family-rebbe-mother-exit-certificate-5706','Verified'],[4666281,3,'original-letter-aid-4666281','Verified'],[4666282,2,'original-letter-aid-4666282','Verified'],[4666283,3,'original-letter-aid-4666283','Verified'],[4666284,2,'shanghai-printing-sephardic-education-5706','Parsed'],[4666285,3,'original-letter-aid-4666285','Verified'],[4666286,2,'original-letter-aid-4666286','Verified'],[4666287,3,'original-letter-aid-4666287','Verified'],[4666288,2,'original-letter-aid-4666288','Verified']];
for(const [aid,minProps,family,status] of batch063Required){const e=idx.entries.find(x=>sourceAID(x)===String(aid));assert(e&&e.has_content_evidence,'batch-063 AID '+aid+' must have inspected text evidence');assert.equal(e.status,status,'batch-063 AID '+aid+' must retain its scoped status');assert.equal(e.evidence_family_id,family,'batch-063 AID '+aid+' must use the reconciled Evidence Family');assert(e.response_propositions.length>=minProps);assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');assert(e.proposition_source_locator&&e.verification_scope);assert.equal(e.context_status,'partial');}
assert(!queue.records.some(q=>String(q.key||'')==='aid:4666280'||String(q.source_url||'').includes('/aid/4666280/')),'inspected AID 4666280 must leave the review queue');
for(const aid of [4666256,4666265,4666269,4666280,4666304]){const e=idx.entries.find(x=>sourceAID(x)===String(aid));assert(e&&e.evidence_family_id==='evidence-family-rebbe-mother-exit-certificate-5706','certificate chain member '+aid+' must share one family');}
for(const aid of [4666271,4666278,4666279,4666284]){const e=idx.entries.find(x=>sourceAID(x)===String(aid));assert(e&&e.evidence_family_id==='shanghai-printing-sephardic-education-5706','Shanghai chain member '+aid+' must share one family');}
const shanghaiQuestion='מה נכתב באגרות על הדפסת ספרים בשנגחאי?';
const shanghaiRegular=buildAnswerModel(idx.entries,shanghaiQuestion,{mode:'regular'});const shanghaiResearcher=buildAnswerModel(idx.entries,shanghaiQuestion,{mode:'researcher'});
assert(shanghaiRegular.answerable&&shanghaiResearcher.answerable,'Shanghai printing query must be answerable in both modes');
assert.equal(shanghaiRegular.sources.filter(e=>e.evidence_family_id==='shanghai-printing-sephardic-education-5706').length,1,'regular mode must keep one item per family');
assert(shanghaiResearcher.sources.filter(e=>e.evidence_family_id==='shanghai-printing-sephardic-education-5706').length>=2,'researcher mode may inspect multiple distinct letters within one family');
assert.equal(shanghaiResearcher.research.evidence_families,new Set(shanghaiResearcher.sources.filter(e=>e._independent_witness!==false).map(e=>e.evidence_family_id)).size,'researcher mode must count family members once');
assert(shanghaiResearcher.research.evidence_map.length>0&&shanghaiResearcher.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)),'researcher evidence map must expose claim-level source locators');
assert(shanghaiResearcher.research.citation_entailment.every(x=>x.valid)&&shanghaiResearcher.research.context_boundary.every(x=>x.valid),'Shanghai synthesis must pass claim entailment and context boundaries');
const shanghaiPattern=buildAnswerModel(idx.entries,'מה הדפוס החוזר באגרות על הדפסת ספרים בשנגחאי?',{mode:'researcher'});assert.equal(shanghaiPattern.answerable,false,'multiple letters from one family must not establish a cross-family pattern');assert.equal(shanghaiPattern.reason,'no_cross_family_pattern');


// Batch 064 content and retrieval regressions.
const b64=[
 [5100223,2,'igrot-letter-5718-18-elul-v17-aid5100223'],
 [5100360,1,'igrot-letter-5719-20-kislev-aid5100360'],
 [5100574,2,'igrot-letter-5719-28-nissan-aid5100574'],
 [5100225,2,'igrot-letter-5718-19-elul-aid5100225'],
 [5100468,1,'igrot-letter-5719-15-adar-i-aid5100468'],
 [5100351,2,'igrot-letter-5719-13-kislev-aid5100351'],
 [5071043,2,'igrot-letter-5718-29-tevet-aid5071043'],
 [5070800,2,'igrot-letter-5718-6-tishrei-aid5070800'],
 [5100353,2,'igrot-letter-5719-14-kislev-aid5100353'],
 [5413068,1,'igrot-letter-5722-erev-shabbat-rosh-chodesh-shevat-aid5413068'],
 [5100487,4,'igrot-letter-5719-2-adar-ii-ו׳תשמא-aid5100487']
];
for(const [aid,n,f] of b64){const e=idx.entries.find(x=>sourceAID(x)===String(aid));assert(e&&e.has_content_evidence,'AID '+aid+' must have inspected content');assert.equal(e.status,'Verified');assert.equal(e.evidence_family_id,f);assert(e.response_propositions.length>=n);assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');assert(e.proposition_source_locator&&e.verification_scope);assert.equal(e.context_status,'partial');}
const qs=[
 ['מה כתב הרבי על שותפות במסחר והרחבת העסק בכוחות עצמו?',5100223],
 ['האם מותר לדבר בענייני חסידות בדרך הרצאה ושיחה ולהוסיף הסבר למאמר?',5100574],
 ['כיצד הוצע לארגן שיעור ציבורי בקונטרס החלצו?',5100468],
 ['מה הציע הרבי לצעירי אגודת חב״ד בניו הייבן לקראת ימי השמחה?',5070800],
 ['מה כתב הרבי על אמירת דברי חסידות בבתי כנסת והפצת המעיינות?',5071043],
 ['מה כתב הרבי על חוסר חשק בלימוד?',5100225],
 ['מה כתב הרבי על ירידת גשמים בשנת שמיטה?',5100487],
 ['מה נאמר על ברכה בערב שבת וערב ראש חודש?',5989776],
 ['מה כתב הרבי על שילוב תורה הנגלה ופנימיות התורה?',5100353],
 ['מה נאמר על ברכה לרגל שנת השלושים ליום החתונה?',5100360]
];
for(const [q,aid] of qs)for(const mode of ['regular','researcher']){const m=buildAnswerModel(idx.entries,q,{mode});assert(m.answerable,mode+' query should be answerable: '+q);assert(m.sources.some(e=>sourceAID(e)===String(aid)),mode+' must retrieve AID '+aid);assert(m.claims.every(c=>c.source_numbers.length));assert(m.citation_entailment.every(x=>x.valid));assert(m.context_boundary.every(x=>x.valid));if(mode==='researcher'){assert(m.research.evidence_map.length>0);assert.equal(m.research.witnesses.length,m.sources.length);}else assert.equal(m.research,undefined);}
const synagogueQ='מה כתב הרבי על אמירת דברי חסידות בבתי כנסת והפצת המעיינות?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,synagogueQ,{mode});
 assert(m.answerable,mode+' synagogue-dissemination query should be answerable');
 assert(m.understanding.topics.includes('הפצת המעיינות בבתי כנסת'),'synagogue query must retain its specific topic');
 assert(!m.understanding.topics.includes('הרחבת שיעור חסידות'),'synagogue query must not inherit the generic class-expansion topic');
 assert(m.sources.some(e=>String(e.aid)==='5071043'),'synagogue query must retrieve AID 5071043');
 assert(!m.sources.some(e=>String(e.aid)==='5071046'),'synagogue query must not conflate the Tanya project with synagogue dissemination');
}
const tanyaProjectQ='מה כתב הרבי על פרויקט תניא והפצת המעיינות?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,tanyaProjectQ,{mode});
 assert(m.answerable,mode+' Tanya-project query should be answerable');
 assert(m.sources.some(e=>String(e.aid)==='5071046'),'Tanya-project query must retain its own source');
}
const tanyaWitness=idx.entries.find(e=>sourceAID(e)==='5071046');
assert(tanyaWitness&&/secretariat/i.test(tanyaWitness.primary_secondary_status||'')&&!/secretariat/i.test(tanyaWitness.witness_type||''),
 'a caveat about an uninspected secretariat copy must not relabel a publisher-attributed Rebbe letter as secretariat-authored');
const crossQ='מה כתבו האיגרות על הרחבת עסק בכוחות עצמו ועל הפצת המעיינות בבתי כנסת?';
for(const mode of ['regular','researcher']){const m=buildAnswerModel(idx.entries,crossQ,{mode});assert(m.answerable);assert(m.sources.some(e=>String(e.aid)==='5100223')&&m.sources.some(e=>String(e.aid)==='5071043'));assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=2);assert(m.claims.every(c=>c.source_numbers.length));assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));if(mode==='researcher'){assert(m.research.evidence_families>=2);assert(m.research.evidence_map.length>0);}}


// Batch 065: inspected publisher letters, family-level synthesis and deep researcher diagnostics.
const batch065Required=[
 [4994198,2,'igrot-letter-5716-7-iyar-v13-aid4994198'],
 [4812708,5,'igrot-letter-5712-25-sivan-aid4812708'],
 [5413170,3,'igrot-letter-5722-1-sivan-v22-aid5413170']
];
for(const [aid,minProps,family] of batch065Required){
 const e=idx.entries.find(x=>sourceAID(x)===String(aid));
 assert(e&&e.has_content_evidence,'batch-065 AID '+aid+' must have inspected source text');
 assert.equal(e.status,'Verified','batch-065 AID '+aid+' must retain scoped published-text status');
 assert.equal(e.evidence_family_id,family,'batch-065 AID '+aid+' must have its own Evidence Family');
 assert(e.response_propositions.length>=minProps);
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope);
 assert.equal(e.context_status,'partial');
}
const enriched4812666=idx.entries.find(x=>String(x.aid)==='4812666');
assert(enriched4812666&&enriched4812666.response_propositions.length>=3,'AID 4812666 must retain the added four-cubits proposition');
assert.equal(enriched4812666.evidence_family_id,'igrot-letter-5712-3-sivan-aid4812666');
const restored5100487=idx.entries.find(x=>String(x.aid)==='5100487');
assert(restored5100487&&restored5100487.has_content_evidence,'AID 5100487 must be exposed as one canonical content-bearing item, not only buried in a volume index');
assert.equal(restored5100487.evidence_family_id,'igrot-letter-5719-2-adar-ii-ו׳תשמא-aid5100487');
assert(restored5100487.response_propositions.length>=4);
const batch075Aids=[4783853,4812732,4812673,5100383,5100452,5100585,5100260,79705];
for(const aid of batch075Aids){const item=idx.entries.find(e=>sourceAID(e)===String(aid));assert(item&&item.status==='Verified'&&item.has_content_evidence===true,`batch 075 source ${aid} must be content-verified`);assert(item.proposition_origin==='source_grounded_paraphrase'&&item.proposition_verbatim===false&&item.proposition_verification==='source_text_inspected'&&item.proposition_source_locator,`batch 075 source ${aid} must have inspected source-grounded propositions`);}
const englishNarrative=idx.entries.find(e=>String(e.aid)==='79705');assert(englishNarrative&&englishNarrative.independent_witness===false&&String(englishNarrative.primary_secondary_status||'').includes('Secondary published narrative'),'English AID 79705 must remain secondary and non-independent');
const yiddishLetter=idx.entries.find(e=>String(e.aid)==='5100585');assert(yiddishLetter&&yiddishLetter.language==='Yiddish','AID 5100585 must retain its Yiddish language label');
const secretary=idx.entries.find(e=>e.id==='secretariat-letter-5357574-5719-12-sivan'),rebbe5357574=idx.entries.find(e=>String(e.aid)==='5357574');assert(secretary&&rebbe5357574&&secretary.evidence_family_id!==rebbe5357574.evidence_family_id,'AID 5357574 secretariat appendix must remain a separate Evidence Family');assert(String(secretary.primary_secondary_status||'').includes('not the Rebbe'),'secretariat appendix must not be attributed to the Rebbe');
const dailyRoutineQ='מה הדפוס החוזר באיגרות לגבי סדרי לימוד ותפילה בחיי היום יום?';
const daily5100391=idx.entries.find(e=>sourceAID(e)==='5100391');
console.log('DAILY_ROUTINE_5100391_INDEX '+JSON.stringify(daily5100391?{id:daily5100391.id,aid:daily5100391.aid,status:daily5100391.status,canonical_status:daily5100391.canonical_status,has_content_evidence:daily5100391.has_content_evidence,independent_witness:daily5100391.independent_witness,source_url:daily5100391.source_url,evidence_family_id:daily5100391.evidence_family_id,propositions:daily5100391.response_propositions,locators:daily5100391.response_proposition_locators,primary_secondary_status:daily5100391.primary_secondary_status,witness_type:daily5100391.witness_type}:null));
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,dailyRoutineQ,{mode});
 console.log('DAILY_ROUTINE_MODEL '+mode+' '+JSON.stringify({answerable:m.answerable,reason:m.reason,sources:m.sources?.map(e=>({aid:sourceAID(e),id:e.id,family:e.evidence_family_id,independent:e.independent_witness,has_content:e.has_content_evidence}))}));
 assert(m.answerable,mode+': daily study/prayer pattern must be supported by multiple inspected families');
 assert(m.sources.length>=3,mode+': daily routine synthesis must use at least three source families');
 assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=3,mode+': translations or aliases must not inflate the daily routine family count');
 for(const aid of [4994198,4812708,5100391]) assert(m.sources.some(e=>sourceAID(e)===String(aid)),mode+': daily routine synthesis must include AID '+aid);
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length),mode+': every daily routine claim needs claim-local citations');
 assert(m.synthesis?.claims?.length>=3,mode+': daily routine synthesis must expose claim-level comparisons');
 assert(m.synthesis.claims.every(c=>c.source_numbers.length>0&&c.source_locators.length>0&&c.source_locators.every(x=>x.locator&&c.source_numbers.includes(x.source_number))),mode+': daily routine synthesis claims must carry source-local body locators');
 assert(m.pattern_synthesis_integrity?.valid===true,mode+': daily routine synthesis must pass integrity validation');
 assert(m.citation_entailment.every(x=>x.valid),mode+': daily routine citations must entail their cited propositions');
 assert(m.context_boundary.every(x=>x.valid),mode+': daily routine synthesis must preserve witness-local context');
 if(mode==='researcher'){
  assert(m.research&&m.research.evidence_families>=3,mode+': deep researcher mode must expose three independent families');
  assert(m.research.witnesses.length===m.sources.length,mode+': researcher mode must expose every witness');
  assert(m.research.evidence_map.length>0,mode+': researcher mode must expose claim-to-witness mapping');
  assert(m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)),mode+': researcher map must retain item-level locators');
  assert(m.research.citation_entailment.every(x=>x.valid)&&m.research.context_boundary.every(x=>x.valid),mode+': researcher diagnostics must pass');
 }else assert.equal(m.research,undefined,'regular mode must not expose researcher-only diagnostics');
}
const kfarChabadQ='מה נכתב על גובה בתים פרטיים בכפר חב״ד?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,kfarChabadQ,{mode});
 assert(m.answerable,mode+': the appended Kfar Chabad building note must be retrievable');
 assert(m.sources.some(e=>String(e.aid)==='5413170'),mode+': the Kfar Chabad note must cite AID 5413170');
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length));
 assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));
 if(mode==='researcher') assert(m.research.evidence_map.length>0&&m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));
}


// Batch 066: twelve newly inspected Hebrew publisher letters; partial context is preserved.
const batch066Required=[
 [5019175,3,'igrot-letter-5717-דתשעג-vxiv-aid5019175'],
 [5019408,3,'igrot-letter-5717-הד-vxiv-aid5019408'],
 [5019192,1,'igrot-letter-5717-דתשצ-vxiv-aid5019192'],
 [5054253,2,'igrot-letter-5717-השצד-vxv-aid5054253'],
 [5054281,3,'igrot-letter-5717-התכב-vxv-aid5054281'],
 [5099923,2,'igrot-letter-5718-וקפב-vxvii-aid5099923'],
 [5099937,2,'igrot-letter-5718-וקצו-vxvii-aid5099937'],
 [5100533,2,'igrot-letter-5719-ותשפח-vxviii-aid5100533'],
 [5100423,3,'igrot-letter-5719-ותרעה-vxviii-aid5100423'],
 [5413208,2,'igrot-letter-5722-חתס-vxxii-aid5413208'],
 [5019512,1,'igrot-letter-5717-הקו-vxiv-aid5019512'],
 [5100416,2,'igrot-letter-5719-ותרסה-vxviii-aid5100416']
];
for(const [aid,minProps,family] of batch066Required){
 const e=idx.entries.find(x=>sourceAID(x)===String(aid));
 assert(e&&e.has_content_evidence,'batch-066 AID '+aid+' must have inspected published body text');
 assert.equal(e.status,'Verified','batch-066 AID '+aid+' must retain scoped published-text verification');
 assert.equal(e.evidence_family_id,family,'batch-066 AID '+aid+' must have one stable Evidence Family');
 assert(e.response_propositions.length>=minProps,'batch-066 AID '+aid+' must expose its non-verbatim propositions');
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope);
 assert.equal(e.context_status,'partial');
 assert.equal(e.canonical_file,'data/items/content-research-batch-066-2026-11-13.json');
 assert(!queue.records.some(q=>String(q.key||'')==='aid:'+aid||String(q.source_url||'').includes('/aid/'+aid+'/')),'inspected AID '+aid+' must not remain in the review queue');
}
const batch066Questions=[
 ['מה נכתב באיגרת על חיפוש שידוך בדרכי תורה?',5019175],
 ['כיצד לחדש קביעות עתים ולימוד בצוותא אחרי הפסק?',5019408],
 ['האם לימוד תורה סותר עבודה במשק חקלאי?',5054281],
 ['מה נכתב על פירות שביעית של נכרים והפניה לגדולי ההוראה?',5100423],
 ['מהו תיקון אישי בהפצת המעיינות?',5100416],
 ['מה נכתב לבחור ישיבה בן שמונה עשרה על המשך הלימוד והפרנסה?',5099937],
 ['מה נכתב על קיום מצוות בחיי היום יום בהקשר לצבא?',5413208],
 ['איך לקיים תורה ומצוות בדרכי נועם ושלום?',5054253],
 ['מה נכתב על חירות בפסח ועל הקשר בין לימוד למעשה?',5099923],
 ['מה נכתב על שלושת השיעורים היומיים בחומש תהלים ותניא?',5019175],
 ['מה נכתב על חינוך תלמידים בשמיני עצרת ושמחת תורה?',5019192],
 ['מה נכתב לתלמידי תומכי תמימים בלוד על לימוד ונסיעות?',5019512]
];
for(const [q,aid] of batch066Questions)for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,q,{mode});
 assert(m.answerable,mode+': batch-066 question must be answerable: '+q);
 assert(m.sources.some(e=>sourceAID(e)===String(aid)),mode+': expected source AID '+aid+' for '+q);
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length));
 assert(m.citation_entailment.every(x=>x.valid));
 assert(m.context_boundary.every(x=>x.valid));
 if(mode==='researcher'){
  assert(m.research&&m.research.evidence_map.length>0);
  assert(m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));
 }else assert.equal(m.research,undefined);
}
const partnershipRegression='מה כתב הרבי על שותפות במסחר והרחבת העסק בכוחות עצמו?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,partnershipRegression,{mode});
 assert(m.answerable,mode+': the existing batch-064 business-partnership question must remain answerable');
 assert(m.sources.some(e=>String(e.aid)==='5100223'),mode+': the source wording about a trading partner and independent expansion must be retrieved');
 assert(m.claims.every(c=>c.source_numbers.length));
 assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));
}
const batch066Cross='השוו בין קביעות עתים ולימוד בצוותא לבין לימוד תורה לצד עבודה במשק חקלאי.';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,batch066Cross,{mode});
 assert(!m.understanding.topics.includes('לימוד וחינוך — חברותא והתקדמות הדרגתית'),mode+': the broad overlapping topic must be suppressed when both specific comparison sides are present');
 assert.equal(m.comparative_coverage?.missing_topics?.length,0,mode+': both requested comparison sides must be represented in displayed claims');
 assert.equal(m.pattern_synthesis_integrity?.valid,true,mode+': cross-family synthesis must pass claim/family/locator integrity');
 assert(m.answerable,mode+': two-family study/farming comparison must be answerable');
 assert(m.sources.some(e=>String(e.aid)==='5019408')&&m.sources.some(e=>String(e.aid)==='5054281'),mode+': comparison must cite both distinct letters');
 assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=2);
 assert(m.claims.every(c=>c.source_numbers.length));
 assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));
 if(mode==='researcher'){
  assert(m.research.evidence_families>=2);
  assert(m.research.evidence_map.length>0&&m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));
  assert.equal(m.synthesis?.topic,'study_routine_and_farming','researcher mode should provide a dedicated cross-family synthesis');
  assert.equal(m.synthesis?.attribution,'system_synthesis_not_rebbe_quote','system synthesis must not be attributed to the Rebbe');
  assert(m.synthesis?.claims?.length===2&&m.synthesis.claims.every(c=>c.source_locators?.length>0),'each comparative claim must carry its own inspected body locator');
  assert(m.synthesis?.evidence_family_ids?.length>=2,'the synthesis must preserve two distinct Evidence Families');
 }else assert.equal(m.research,undefined);
}


// Batch 071: ten new inspected correspondence identities (Hebrew, Yiddish, English)
// plus one in-place enrichment; translations and rewritten shells are not independent.
const batch071Required=[
 [4831328,2,'igrot-letter-5714-b-ramach-aid4831328','Hebrew'],
 [4831188,2,'igrot-letter-5713-b-kato-aid4831188','Hebrew'],
 [5071052,2,'igrot-letter-5718-v-lamed-aid5071052','Hebrew'],
 [5054615,2,'igrot-letter-5717-heh-tashnat-aid5054615','Hebrew'],
 [5054240,2,'igrot-letter-5717-heh-shpa-aid5054240','Hebrew'],
 [4731105,3,'igrot-letter-5710-tashma-aid4731105','Hebrew'],
 [5054461,3,'igrot-letter-5717-heh-ter-aid5054461','Hebrew'],
 [4783876,2,'igrot-letter-5712-3-shevat-aid4783876','Yiddish'],
 [4645967,2,'igrot-letter-5698-12-kislev-aid4645967','Hebrew'],
 [6429866,2,'presidential-letter-ford-1975-01-27-aid6429866','English']
];
for(const [aid,minProps,family,language] of batch071Required){
 const e=idx.entries.find(x=>sourceAID(x)===String(aid));
 assert(e&&e.has_content_evidence,'batch-071 AID '+aid+' must have inspected publisher body text');
 assert.equal(e.status,'Verified','batch-071 AID '+aid+' must retain scoped content verification');
 assert.equal(e.evidence_family_id,family,'batch-071 AID '+aid+' must have a stable, distinct Evidence Family');
 assert(e.response_propositions.length>=minProps,'batch-071 AID '+aid+' must expose its inspected paraphrases');
 assert.equal(e.language,language,'batch-071 AID '+aid+' must preserve the source language');
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope);
 assert.equal(e.context_status,'partial');
 assert.equal(e.canonical_file,'data/items/content-research-batch-071-2026-11-13.json');
 assert(!queue.records.some(q=>String(q.key||'')==='aid:'+aid||String(q.source_url||'').includes('/aid/'+aid+'/')),'inspected AID '+aid+' must not remain in the review queue');
}
const enriched5100487=idx.entries.find(e=>String(e.aid)==='5100487');
assert(enriched5100487&&enriched5100487.response_propositions.some(p=>p.includes('מאמינים בני מאמינים')),'existing AID 5100487 must retain the newly inspected rational-proof distinction');
assert(enriched5100487.proposition_source_locator.includes('300–304'),'AID 5100487 must expose the new proposition locator');
assert.equal(enriched5100487.canonical_file,'data/items/chabad-letter-5100487.json');
const canonical2989555=idx.entries.find(e=>String(e.aid)==='2989555');
assert(canonical2989555,'AID 2989555 must remain in the search index after canonical family reconciliation');
assert.equal(canonical2989555.canonical_file,'data/items/content-research-batch-101-2026-11-15.json','AID 2989555 must resolve to its pre-existing canonical identity, not the removed batch-141 duplicate');
assert.equal(canonical2989555.evidence_family_id,'sicha-5717-bereshit-aid2989555','AID 2989555 must retain one canonical Evidence Family');
assert.equal(canonical2989555.response_propositions.length,4,'AID 2989555 must retain the original proposition, two merged batch-141 propositions and the newly inspected Chabad-method proposition');
assert(canonical2989555.proposition_source_locator.includes('190–193'),'AID 2989555 must expose the newly inspected body locator');
assert(canonical2989555.response_propositions.some(p=>p.includes('יפוצו מעיינותיך חוצה')&&p.includes('חסידות חב״ד')),'AID 2989555 must expose the inspected dissemination proposition after duplicate merge');
const disseminationSynthesis='מה כתב הרבי על הפצת המעיינות והפצת פנימיות התורה?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,disseminationSynthesis,{mode});
 assert(m.answerable,mode+': inspected dissemination evidence must support a multi-source synthesis');
 assert(m.sources.some(e=>String(e.aid)==='4831188'),mode+': Hebrew source on inner Torah dissemination must be retrieved');
 const legacy5071052=idx.entries.find(e=>String(e.aid)==='5071052');
 assert(legacy5071052&&legacy5071052.has_content_evidence,'legacy AID 5071052 must remain in the index from its earlier inspected body; current public route is not treated as a new inspection');
 assert(m.sources.some(e=>String(e.aid)==='5989777'),mode+': newly inspected Hebrew Sicha on bringing the wellsprings to people without a prior connection must be retrieved');
 if(mode==='researcher')assert(m.sources.some(e=>String(e.aid)==='4385753'),mode+': researcher mode must surface the Hebrew Sicha defining the wellsprings as Chassidus');
 assert(m.sources.some(e=>String(e.aid)==='2989555'),mode+': original Hebrew Sicha on Chassidus dissemination must be retrieved');
 assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=3,mode+': dissemination synthesis must use at least three distinct Evidence Families');
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length&&c.source_locators?.length&&c.source_numbers.every(n=>c.source_locators.some(x=>x.source_number===n&&x.locator))),mode+': every displayed source number must have a claim-level body locator');
 assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));
 if(mode==='researcher'){
  assert(m.research&&m.research.evidence_map.length>=3&&m.research.witnesses.length===m.sources.length,'researcher mode must expose a witness-level evidence map for the dissemination synthesis');
  const englishTranslations=m.sources.filter(e=>!!e.translation_of_evidence_family_id);
  assert(m.research&&m.research.evidence_map.length>=2&&englishTranslations.length>=2,'researcher mode must preserve two underlying English translation witnesses');
  assert(englishTranslations.every(e=>e.independent_witness===false),'English translations must remain non-independent witnesses');
  assert(new Set(englishTranslations.map(e=>e.translation_of_evidence_family_id)).size>=2,'English translations must resolve to two distinct underlying Evidence Families');
  assert.equal(m.research.witnesses.length,m.sources.length);
  assert(m.research.evidence_map.length>0);
  assert(m.research.citation_entailment.every(x=>x.valid)&&m.research.context_boundary.every(x=>x.valid));
 }else assert.equal(m.research,undefined);
}
const yiddishMelodyQuestion='מה כתב הרבי ביידיש על הניגון של רבי אברהם המלאך בלכה דודי?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,yiddishMelodyQuestion,{mode});
 assert(m.answerable,mode+': Hebrew query must retrieve the inspected Yiddish correspondence');
 assert(m.sources.some(e=>String(e.aid)==='4783876'),mode+': the Yiddish melody letter must be retrieved');
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length));
 assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));
 if(mode==='researcher'){
  assert(m.research&&m.research.witnesses.length===m.sources.length);
  assert(m.research.evidence_map.length>0);
  assert(m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));
 }else assert.equal(m.research,undefined);
}
const fordLetterQuestion='What did the Rebbe write to President Gerald Ford about religious freedom and education?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,fordLetterQuestion,{mode});
 assert(m.answerable,mode+': English public correspondence must be retrievable in English');
 assert(m.sources.some(e=>String(e.aid)==='6429866'),mode+': the individual Ford letter must be cited');
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length));
 assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));
 if(mode==='researcher'){
  assert(m.research&&m.research.witnesses.length===m.sources.length);
  assert(m.research.evidence_map.length>0);
 }else assert.equal(m.research,undefined);
}


// Batch 072: eight translated English correspondence items plus one full-body enrichment.
const batch072Required=[[2278254,2,'pastoral-letter-5710-14-tammuz-2278254'],[2278256,3,'pastoral-letter-5710-19-tammuz-2278256'],[2278257,2,'pastoral-letter-5710-20-tammuz-2278257'],[2278259,2,'pastoral-letter-5710-21-tammuz-2278259'],[2278260,2,'pastoral-letter-5710-21-tammuz-2278260'],[2278261,2,'pastoral-letter-5710-21-tammuz-2278261'],[2278262,2,'pastoral-letter-5710-21-tammuz-2278262'],[2278265,2,'pastoral-letter-5710-25-tammuz-2278265']];
for(const [aid,minProps,family] of batch072Required){const e=idx.entries.find(x=>sourceAID(x)===String(aid));assert(e&&e.has_content_evidence,'batch-072 AID '+aid+' must have inspected publisher body text');assert.equal(e.status,'Verified');assert.equal(e.evidence_family_id,family);assert(e.response_propositions.length>=minProps);assert.equal(e.language,'English');assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');assert(e.proposition_source_locator&&e.verification_scope);assert.equal(e.context_status,'partial');assert.equal(e.independent_witness,false,'translated English item must not be treated as independent');assert.equal(e.translation_of_evidence_family_id,family);assert.equal(e.canonical_file,'data/items/content-research-batch-072-2026-11-13.json');assert(!queue.records.some(q=>String(q.key||'')==='aid:'+aid||String(q.source_url||'').includes('/aid/'+aid+'/')));}
const enriched2187392=idx.entries.find(e=>String(e.aid)==='2187392');assert(enriched2187392&&enriched2187392.response_propositions.some(p=>p.includes('שמחה פנימית')));assert(enriched2187392.proposition_source_locator.includes('268–289'));assert.equal(enriched2187392.evidence_family_id,'pastoral-letter-5714-10-kislev-2187392');assert.equal(enriched2187392.canonical_file,'data/items/content-research-batch-070-2026-11-13.json');
const educationInfluenceQ='מה כתב הרבי על השפעה על יהודי אחד ועל חינוך ילדים יהודים במעשה ולא בדיבור?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,educationInfluenceQ,{mode});
 
// Batch 097: eight newly inspected original-language Hayom Yom entries; same-page English renderings are not independent witnesses.
const batch097Path='data/items/content-research-batch-097-2026-11-15.json';
const batch097Data=JSON.parse(await readFile(new URL(batch097Path,root)));
const batch097Aids=['3316648','3316664','3316666','3316676','3316679','3316684','3316710','3316719'];
assert.equal(batch097Data.records.length,8);
assert.equal(batch097Data.new_source_identities,8);
assert.equal(batch097Data.existing_identities_enriched,1);
assert.equal(batch097Data.new_response_propositions,11);
assert.equal(batch097Data.existing_response_propositions_added,1);
assert.equal(batch097Data.total_new_paraphrase_entries,12);
assert.equal(batch097Data.source_bodies_inspected,9);
assert.equal(batch097Data.existing_identity_updates[0].aid,3316690);
assert.equal(batch097Data.content_verified_unique_sources_added,0);
assert.equal(batch097Data.blocked_candidates[0].aid,4666220);
assert.equal(batch097Data.crawler_retry,false);
assert.equal(batch097Data.access_control_bypassed,false);
assert.equal(batch097Data.translations_counted_as_independent_witnesses,0);
const enriched3316690=idx.entries.find(e=>sourceAID(e)==='3316690');
assert(enriched3316690&&enriched3316690.response_propositions.length===2);
assert.equal(enriched3316690.evidence_family_id,'hayom-yom-entry-18-tammuz-aid-3316690');
assert.equal(enriched3316690.canonical_file,'data/items/content-research-batch-091-2026-11-15.json');
assert(enriched3316690.response_propositions.some(p=>p.includes('מוחין דגדלות')));
assert.equal(enriched3316690.response_proposition_locators.length,2);
for(const aid of batch097Aids){
 const matches=idx.entries.filter(e=>sourceAID(e)===aid);
 assert.equal(matches.length,1,'batch-097 AID '+aid+' must have one canonical identity');
 const e=matches[0];
 assert.equal(e.canonical_file,batch097Path);
 assert(e.has_content_evidence);
 assert.equal(e.status,'Parsed');
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope&&e.witness_provenance);
 assert.equal(e.response_proposition_locators.length,e.response_propositions.length);
 assert(e.response_proposition_locators.every(Boolean));
 assert.equal(e.independent_witness,true);
 assert.equal(e.context_status,'partial');
}
assert.equal(batch097Data.reconciliation_status,'reconciled');
assert.deepEqual(batch097Data.metrics_actual_after,{answer_eligible_unique_sources:956,content_verified_unique_sources:870,answer_eligible_propositions:2918});
assert.deepEqual(batch097Data.reconciliation_variance,{answer_eligible_unique_sources:0,content_verified_unique_sources:0,answer_eligible_propositions:0});






// Batch 105: source-text readiness, multilingual retrieval, family deduplication and deep synthesis.
const batch105Path='data/items/content-research-batch-105-2026-11-15.json';
const batch105Data=JSON.parse(await readFile(new URL(batch105Path,root)));
assert.equal(batch105Data.records.length,14);
assert(batch105Data.source_body_review.every(r=>!('aid' in r)&&!('id' in r)&&!('evidence_family_id' in r)),'batch 105 source_body_review rows are audit metadata, not duplicate source records');assert.equal(batch105Data.new_source_identities,14);
assert.equal(batch105Data.existing_identities_enriched,1);assert.equal(batch105Data.new_response_propositions,25);
assert.equal(batch105Data.existing_response_propositions_added,2);assert.equal(batch105Data.total_new_paraphrase_entries,27);
assert.equal(batch105Data.answer_eligible_source_families_added,13);assert.equal(batch105Data.independent_witnesses_added,14);
assert.equal(batch105Data.content_verified_unique_sources_added,0);assert.equal(batch105Data.blocked_candidate_count,2);
assert.equal(batch105Data.excluded_candidate_count,1);assert.equal(batch105Data.fallback_source_attempted,true);
assert.equal(batch105Data.crawler_retry,false);assert.equal(batch105Data.access_control_bypassed,false);
assert.equal(batch105Data.full_text_copied,false);assert.equal(batch105Data.scan_only_verification_used,false);
assert.equal(batch105Data.translations_counted_as_independent_witnesses,0);
assert.deepEqual(batch105Data.metrics_expected_after,{answer_eligible_unique_sources:1033,content_verified_unique_sources:854,answer_eligible_propositions:3070});
if(batch105Data.reconciliation_status==='reconciled'){
 assert.deepEqual(readinessMetrics(batch105Data.metrics_actual_after),batch105Data.metrics_expected_after);
 assert.deepEqual(batch105Data.reconciliation_variance,{answer_eligible_unique_sources:0,content_verified_unique_sources:0,answer_eligible_propositions:0});
 assert(batch105Data.deduplication_check.full_index_scan_available);
 assert.deepEqual(batch105Data.deduplication_check.canonical_identity_collisions,[]);
 assert.deepEqual(batch105Data.deduplication_check.missing_canonical_identities,[]);
 assert.equal(batch105Data.deduplication_check.all_target_identities_answer_eligible,true);
 }else if(batch105Data.reconciliation_status==='reconciled_with_variance'){
 assert(batch105Data.metrics_actual_after&&batch105Data.reconciliation_variance);
 assert(batch105Data.deduplication_check.full_index_scan_available);
 assert.deepEqual(batch105Data.deduplication_check.canonical_identity_collisions,[]);
 assert.deepEqual(batch105Data.deduplication_check.missing_canonical_identities,[]);
 assert.equal(batch105Data.deduplication_check.all_target_identities_answer_eligible,true);
 console.log('BATCH105_RECONCILIATION_METRICS',JSON.stringify({actual:readinessMetrics(batch105Data.metrics_actual_after),expected:batch105Data.metrics_expected_after,variance:batch105Data.reconciliation_variance}));
 }else{
 assert.equal(batch105Data.reconciliation_status,'pending');
 assert.equal(batch105Data.metrics_actual_after,null);
 assert.equal(batch105Data.reconciliation_variance,null);
 assert.equal(batch105Data.deduplication_check.full_index_scan_pending_reconciliation,true);
 
}
assert.equal(new Set(batch105Data.records.map(r=>r.aid)).size,14);
assert.equal(new Set(batch105Data.records.map(r=>r.evidence_family_id)).size,13);
assert.equal(batch105Data.records.filter(r=>r.language==='Hebrew').length,12);
assert.equal(batch105Data.records.filter(r=>r.language==='English').length,1);
assert.equal(batch105Data.records.filter(r=>r.language==='Yiddish').length,1);
for(const r of batch105Data.records){assert.equal(r.status,'Parsed');assert.equal(r.pipeline_status,'Parsed');assert.equal(r.canonical_status,'Parsed');assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);assert.equal(r.proposition_verification,'source_text_inspected');assert(r.proposition_source_locator&&r.provenance&&r.verification_scope&&r.context_status==='partial'&&r.has_content_evidence);assert(r.response_propositions.length>0&&r.response_propositions.length===r.response_proposition_locators.length);}
const sameFamilyMaamar=idx.entries.find(e=>sourceAID(e)==='4280038'),sameFamilySicha=idx.entries.find(e=>sourceAID(e)==='4280039');
assert(sameFamilyMaamar&&sameFamilySicha);assert.equal(sameFamilyMaamar.evidence_family_id,sameFamilySicha.evidence_family_id);
const hayomYomYiddish=idx.entries.find(e=>sourceAID(e)==='3315445');
assert(hayomYomYiddish&&hayomYomYiddish.language==='Yiddish'&&hayomYomYiddish.original_language==='Yiddish'&&hayomYomYiddish.proposition_language==='Hebrew'&&hayomYomYiddish.independent_witness===true);assert(hayomYomYiddish.search_text.includes('היום יום'));assert(hayomYomYiddish.response_propositions.some(p=>String(p).includes('חיפוש אמת')&&String(p).includes('בדיקה של כל תנועה')));
const englishLetter=idx.entries.find(e=>sourceAID(e)==='2216588');
assert(englishLetter&&englishLetter.language==='English'&&englishLetter.proposition_language==='English');
const enrichedSicha=idx.entries.find(e=>sourceAID(e)==='2988877');
assert(enrichedSicha&&enrichedSicha.response_propositions.length===3&&enrichedSicha.response_proposition_locators.some(x=>x.includes('209–216')));
for(const aid of batch105Data.new_aids){const e=idx.entries.find(x=>sourceAID(x)===String(aid));assert(e&&e.has_content_evidence,'batch-105 AID '+aid+' must have inspected source body');assert.equal(e.status,'Parsed');assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');assert(!queue.records.some(q=>String(q.key||'')==='aid:'+aid||String(q.source_url||'').includes('/aid/'+aid+'/')));}
const hayomQuestion='מהו התוכן של ערך היום יום ביידיש על חיפוש אמת ובדיקה של כל תנועה?';
const hayomAnalysis=understandQuestion(hayomQuestion);assert(hayomAnalysis.topics.includes('חיפוש אמת ובדיקת תנועה'),'Yiddish Hayom Yom question must map to its proposition-level topic');
console.log('YIDDISH_HAYOM_ANALYSIS',JSON.stringify({topics:hayomAnalysis.topics,terms:hayomAnalysis.terms,subtopic:hayomAnalysis.subtopic,intent:hayomAnalysis.intent,sourceLanguage:hayomAnalysis.source_language||null}));
for(const mode of ['regular','researcher']){const m=buildAnswerModel(idx.entries,hayomQuestion,{mode});const isolated=buildAnswerModel([hayomYomYiddish],hayomQuestion,{mode});console.log('YIDDISH_HAYOM_DEBUG',JSON.stringify({mode,answerable:m.answerable,reason:m.reason,sourceAids:m.sources.map(sourceAID),isolated:{answerable:isolated.answerable,reason:isolated.reason,sourceAids:isolated.sources.map(sourceAID)},target:{title:hayomYomYiddish.title,language:hayomYomYiddish.language,proposition_language:hayomYomYiddish.proposition_language,source_class:hayomYomYiddish.source_class,witness_type:hayomYomYiddish.witness_type,has_content_evidence:hayomYomYiddish.has_content_evidence,independent_witness:hayomYomYiddish.independent_witness,response_propositions:hayomYomYiddish.response_propositions}}));assert(m.answerable&&m.sources.some(e=>sourceAID(e)==='3315445'),mode+': Yiddish Hayom Yom entry must be retrieved');assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length));assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));if(mode==='researcher')assert(m.research&&m.research.depth==='deep'&&m.research.witnesses.length===m.sources.length&&m.research.evidence_map.length>0&&m.research.claim_source_map.length===m.claims.length&&m.research.claim_source_map.every(c=>c.source_numbers.length&&c.source_locators.length));else assert.equal(m.research,undefined);}
const englishQuestion='What did the Rebbe explain about using Yiddish for Chassidic discourses and why practical deeds matter?';
const englishModel=buildAnswerModel(idx.entries,englishQuestion,{mode:'researcher'});
assert(englishModel.answerable&&englishModel.sources.some(e=>sourceAID(e)==='2216588'));
assert(englishModel.claims.length>0&&englishModel.claims.every(c=>c.source_numbers.length));
assert(englishModel.research&&englishModel.research.evidence_map.length>0&&englishModel.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));
const diasporaQuestion='כיצד שני המקורות מתארים את תפקיד הפיזור בין האומות, בירור הניצוצות וחיזוק קיום התורה והמצוות?';
const diasporaModel=buildAnswerModel(idx.entries,diasporaQuestion,{mode:'researcher'});
assert(diasporaModel.answerable&&diasporaModel.sources.some(e=>sourceAID(e)==='4280038')&&diasporaModel.sources.some(e=>sourceAID(e)==='4304375'));
assert(new Set(diasporaModel.sources.map(e=>e.evidence_family_id)).size>=2);
assert(diasporaModel.claims.length>0&&diasporaModel.claims.every(c=>c.source_numbers.length));
assert(diasporaModel.citation_entailment.every(x=>x.valid)&&diasporaModel.context_boundary.every(x=>x.valid));
assert(diasporaModel.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));

const batch110Path='data/items/content-research-batch-110-2026-11-16.json';
const batch110Data=JSON.parse(await readFile(new URL(batch110Path,root)));
const batch110Aids=['6084','6085','6086','6087','6088','6089','6090','6091'];
assert.equal(batch110Data.records.length,8);
assert.equal(batch110Data.reviewed_item_count,8);
assert.equal(batch110Data.source_bodies_inspected,8);
assert.equal(batch110Data.source_body_pages_opened,9);
assert.equal(batch110Data.new_source_identities,8);
assert.equal(batch110Data.existing_identities_enriched,0);
assert.equal(batch110Data.new_response_propositions,10);
assert.equal(batch110Data.answer_eligible_source_families_added,8);
assert.equal(batch110Data.content_verified_unique_sources_added,0);
assert.equal(batch110Data.blocked_candidate_count,7);
assert.equal(batch110Data.fallback_source_attempted,true);
assert.equal(batch110Data.fallback_source_results.accessible_item_level_bodies,8);
assert.equal(batch110Data.crawler_retry,false);
assert.equal(batch110Data.access_control_bypassed,false);
assert.equal(batch110Data.full_text_copied,false);
assert.equal(batch110Data.scan_only_verification_used,false);
assert.equal(batch110Data.translations_counted_as_independent_witnesses,0);
assert.deepEqual(batch110Data.new_aids.map(String),batch110Aids);
assert.deepEqual(batch110Data.metrics_before,{answer_eligible_unique_sources:1051,content_verified_unique_sources:854,answer_eligible_propositions:3111});
assert.deepEqual(batch110Data.metrics_expected_after,{answer_eligible_unique_sources:1059,content_verified_unique_sources:854,answer_eligible_propositions:3121});
assert.deepEqual(batch110Data.metrics_delta_at_batch_boundary,{answer_eligible_unique_sources:8,content_verified_unique_sources:0,answer_eligible_propositions:10});
assert.equal(batch110Data.source_body_review.length,8);
assert(batch110Data.source_body_review.every(r=>!('aid' in r)&&!('id' in r)&&!('evidence_family_id' in r)&&r.body_text_inspected&&r.source_grounded_paraphrase_added));
assert.equal(new Set(batch110Data.records.map(r=>String(r.aid))).size,8);
assert.equal(new Set(batch110Data.records.map(r=>r.evidence_family_id)).size,8);
assert.deepEqual(batch110Data.language_distribution,{Hebrew:5,Yiddish:3});
assert.equal(batch110Data.records.filter(r=>r.language==='Hebrew'&&r.original_language==='Hebrew').length,5);
assert.equal(batch110Data.records.filter(r=>r.language==='Yiddish'&&r.original_language==='Yiddish').length,3);
assert.equal(batch110Data.records.reduce((n,r)=>n+r.response_propositions.length,0),10);
for(const r of batch110Data.records){
 assert.equal(r.status,'Parsed');assert.equal(r.pipeline_status,'Parsed');assert.equal(r.canonical_status,'Parsed');
 assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);assert.equal(r.proposition_verification,'source_text_inspected');
 assert(r.proposition_source_locator&&r.provenance&&r.verification_scope&&r.context_status==='partial'&&r.has_content_evidence);
 assert.equal(r.response_propositions.length,r.response_proposition_locators.length);
}
for(const aid of batch110Aids){
 const e=idx.entries.find(x=>sourceAID(x)===aid);
 assert(e&&e.has_content_evidence,'batch-110 AID '+aid+' must have inspected source body');
 assert.equal(e.status,'Parsed');assert.equal(e.independent_witness,true);
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');
 assert(!queue.records.some(q=>String(q.key||'')==='aid:'+aid||String(q.source_url||'').includes('/aid/'+aid+'/')));
}
assert.equal(batch110Data.deduplication_check.full_index_scan_available,false,'batch110 records only a partial preflight; the test must not claim a full index scan');
assert.equal(batch110Data.reconciliation_excluded,true,'historical partial-preflight batch110 must remain outside the automated reconciliation chain');
assert(String(batch110Data.reconciliation_exclusion_reason||'').includes('partial-preflight'));
assert.deepEqual(batch110Data.deduplication_check.canonical_identity_collisions,[]);
assert.deepEqual(batch110Data.deduplication_check.missing_canonical_identities,[]);
assert.equal(batch110Data.deduplication_check.all_target_identities_answer_eligible,false,'batch110 target eligibility remains unconfirmed until canonical reconciliation');
assert.equal(batch110Data.status,'pending_reconciliation','batch110 is a historical partial-preflight record outside the latest contiguous reconciliation chain');
assert.equal(batch110Data.reconciliation_status,'pending','do not mark an older non-contiguous batch reconciled');
assert.equal(batch110Data.metrics_actual_after,null,'no measured after-boundary is recorded for this historical batch');
assert.equal(batch110Data.reconciliation_variance,null,'do not invent a reconciliation variance for an unreconciled historical batch');
const batch111Path='data/items/content-research-batch-111-2026-11-16.json';
const batch111Data=JSON.parse(await readFile(new URL(batch111Path,root)));
const batch111Aids=['6093','6094','6095','6096','6097','6098','6099','6100'];
assert.equal(batch111Data.records.length,8);
assert.equal(batch111Data.reviewed_item_count,9);
assert.equal(batch111Data.source_bodies_inspected,9);
assert.equal(batch111Data.source_body_pages_opened,9);
assert.equal(batch111Data.new_source_identities,8);
assert.equal(batch111Data.existing_identities_enriched,1);
assert.equal(batch111Data.new_response_propositions,10);
assert.equal(batch111Data.existing_response_propositions_added,2);
assert.equal(batch111Data.total_new_paraphrase_entries,12);
assert.equal(batch111Data.answer_eligible_source_families_added,8);
assert.equal(batch111Data.content_verified_unique_sources_added,0);
assert.equal(batch111Data.blocked_candidate_count,0);
assert.equal(batch111Data.fallback_source_attempted,false);
assert.equal(batch111Data.crawler_retry,false);
assert.equal(batch111Data.access_control_bypassed,false);
assert.equal(batch111Data.full_text_copied,false);
assert.equal(batch111Data.scan_only_verification_used,false);
assert.equal(batch111Data.translations_counted_as_independent_witnesses,0);
assert.deepEqual(batch111Data.new_aids.map(String),batch111Aids);
assert.deepEqual(batch111Data.metrics_before,{answer_eligible_unique_sources:1059,content_verified_unique_sources:854,answer_eligible_propositions:3121});
assert.deepEqual(batch111Data.metrics_expected_after,{answer_eligible_unique_sources:1067,content_verified_unique_sources:854,answer_eligible_propositions:3133});
assert.deepEqual(batch111Data.metrics_delta_at_batch_boundary,{answer_eligible_unique_sources:8,content_verified_unique_sources:0,answer_eligible_propositions:12});
assert.deepEqual(batch111Data.language_distribution,{Hebrew:4,Yiddish:4});
assert.deepEqual(batch111Data.original_language_distribution,{Hebrew:4,Yiddish:4});
assert.equal(batch111Data.records.filter(r=>r.language==='Hebrew'&&r.original_language==='Hebrew').length,4);
assert.equal(batch111Data.records.filter(r=>r.language==='Yiddish'&&r.original_language==='Yiddish').length,4);
assert.equal(batch111Data.records.reduce((n,r)=>n+r.response_propositions.length,0),10);
assert.equal(batch111Data.source_body_review.length,9);
assert(batch111Data.source_body_review.every(r=>r.inspected_original_language_body===true&&r.locator));
assert.equal(batch111Data.existing_identity_updates.length,1);
assert.deepEqual(batch111Data.enriched_aids,[2989153]);
assert.equal(batch111Data.existing_identity_updates[0].propositions_added,2);
assert.equal(batch111Data.existing_identity_updates[0].total_propositions_after,6);
const enriched2989153=idx.entries.find(e=>sourceAID(e)==='2989153');
assert(enriched2989153&&enriched2989153.has_content_evidence&&enriched2989153.response_propositions.length===13);
assert(enriched2989153.response_proposition_locators.some(x=>String(x).includes('שורות 247–256')));
assert(enriched2989153.response_proposition_locators.some(x=>String(x).includes('שורות 243–244')));
assert.equal(enriched2989153.status,'Parsed');
assert.equal(enriched2989153.evidence_family_id,'sicha-5713-20-menachem-av-akev-aid2989153');
assert.equal(new Set(batch111Data.records.map(r=>String(r.aid))).size,8);
assert.equal(new Set(batch111Data.records.map(r=>r.evidence_family_id)).size,8);
for(const r of batch111Data.records){
 assert.equal(r.status,'Parsed');assert.equal(r.pipeline_status,'Parsed');assert.equal(r.canonical_status,'Parsed');
 assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);assert.equal(r.proposition_verification,'source_text_inspected');
 assert(r.proposition_source_locator&&r.provenance&&r.verification_scope&&r.context_status==='partial'&&r.has_content_evidence);
 assert.equal(r.response_propositions.length,r.response_proposition_locators.length);
}
for(const aid of batch111Aids){
 const e=idx.entries.find(x=>sourceAID(x)===aid);
 assert(e&&e.has_content_evidence,'batch-111 AID '+aid+' must have inspected source body');
 assert.equal(e.status,'Parsed');assert.equal(e.independent_witness,true);
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');
 assert(!queue.records.some(q=>String(q.key||'')==='aid:'+aid||String(q.source_url||'').includes('/aid/'+aid+'/')));
}
assert.equal(batch111Data.deduplication_check.full_index_scan_available,true);
assert.deepEqual(batch111Data.deduplication_check.canonical_identity_collisions,[]);
assert.deepEqual(batch111Data.deduplication_check.missing_canonical_identities,[]);
assert.equal(batch111Data.deduplication_check.all_target_identities_answer_eligible,true);
assert(['reconciled','reconciled_with_variance'].includes(batch111Data.reconciliation_status));
const batch111Actual=readinessMetrics(batch111Data.metrics_actual_after);
const batch111Audit=projectState.development_recovery.reconciliation_chain.find(x=>String(x.batch_id)==='111');
assert(batch111Audit);
assert.deepEqual(batch111Actual,readinessMetrics(batch111Audit.metrics_actual_after));
assert.deepEqual(batch111Data.reconciliation_variance,{
 answer_eligible_unique_sources:batch111Actual.answer_eligible_unique_sources-batch111Data.metrics_expected_after.answer_eligible_unique_sources,
 content_verified_unique_sources:batch111Actual.content_verified_unique_sources-batch111Data.metrics_expected_after.content_verified_unique_sources,
 answer_eligible_propositions:batch111Actual.answer_eligible_propositions-batch111Data.metrics_expected_after.answer_eligible_propositions
});
const batch112Path='data/items/content-research-batch-112-2026-11-16.json';
const batch112Data=JSON.parse(await readFile(new URL(batch112Path,root)));
const batch112Aids=['6101','6102','6103','6104','6105','6106','6107','6108','2989411'];
assert.equal(batch112Data.records.length,9);
assert.equal(batch112Data.reviewed_item_count,10);
assert.equal(batch112Data.source_bodies_inspected,10);
assert.equal(batch112Data.source_body_pages_opened,10);
assert.equal(batch112Data.new_source_identities,9);
assert.equal(batch112Data.existing_identities_enriched,1);
assert.equal(batch112Data.new_response_propositions,13);
assert.equal(batch112Data.existing_response_propositions_added,1);
assert.equal(batch112Data.total_new_paraphrase_entries,14);
assert.equal(batch112Data.answer_eligible_source_families_added,9);
assert.equal(batch112Data.content_verified_unique_sources_added,0);
assert.equal(batch112Data.blocked_candidate_count,1);
assert.equal(batch112Data.fallback_source_attempted,true);
assert.equal(batch112Data.fallback_source_results.body_text_inspected,true);
assert.deepEqual(batch112Data.fallback_source_results.inspected_aids,[6105]);
assert.equal(batch112Data.crawler_retry,false);
assert.equal(batch112Data.access_control_bypassed,false);
assert.equal(batch112Data.full_text_copied,false);
assert.equal(batch112Data.scan_only_verification_used,false);
assert.equal(batch112Data.translations_counted_as_independent_witnesses,0);
assert.deepEqual(batch112Data.new_aids.map(String),batch112Aids);
assert.deepEqual(batch112Data.enriched_aids,[5959845]);
assert.deepEqual(batch112Data.metrics_before,{answer_eligible_unique_sources:1067,content_verified_unique_sources:854,answer_eligible_propositions:3133});
assert.deepEqual(batch112Data.metrics_expected_after,{answer_eligible_unique_sources:1076,content_verified_unique_sources:854,answer_eligible_propositions:3147});
assert.deepEqual(batch112Data.metrics_delta_at_batch_boundary,{answer_eligible_unique_sources:9,content_verified_unique_sources:0,answer_eligible_propositions:14});
assert.deepEqual(batch112Data.language_distribution,{Hebrew:6,Yiddish:3});
assert.deepEqual(batch112Data.original_language_distribution,{Hebrew:6,Yiddish:3});
assert.equal(batch112Data.records.filter(r=>r.language==='Hebrew'&&r.original_language==='Hebrew').length,6);
assert.equal(batch112Data.records.filter(r=>r.language==='Yiddish'&&r.original_language==='Yiddish').length,3);
assert.equal(batch112Data.records.reduce((n,r)=>n+r.response_propositions.length,0),13);
assert.equal(batch112Data.source_body_review.length,10);
assert(batch112Data.source_body_review.every(r=>r.inspected_original_language_body===true&&r.locator));
assert.equal(batch112Data.existing_identity_updates.length,1);
assert.equal(batch112Data.existing_identity_updates[0].aid,5959845);
assert.equal(batch112Data.existing_identity_updates[0].propositions_added,1);
assert.equal(batch112Data.existing_identity_updates[0].total_propositions_after,5);
assert.equal(batch112Data.blocked_candidates[0].aid,6105);
assert(batch112Data.blocked_candidates[0].redirected_to.includes('528641'));
assert.equal(new Set(batch112Data.records.map(r=>String(r.aid))).size,9);
assert.equal(new Set(batch112Data.records.map(r=>r.evidence_family_id)).size,9);
for(const r of batch112Data.records){
 assert.equal(r.status,'Parsed');assert.equal(r.pipeline_status,'Parsed');assert.equal(r.canonical_status,'Parsed');
 assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);assert.equal(r.proposition_verification,'source_text_inspected');
 assert(r.proposition_source_locator&&r.provenance&&r.verification_scope&&r.context_status==='partial'&&r.has_content_evidence);
 assert.equal(r.response_propositions.length,r.response_proposition_locators.length);
}
for(const aid of batch112Aids){
 const e=idx.entries.find(x=>sourceAID(x)===aid);
 assert(e&&e.has_content_evidence,'batch-112 AID '+aid+' must have inspected source body');
 assert.equal(e.status,'Parsed');assert.equal(e.independent_witness,true);
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');
 assert(!queue.records.some(q=>String(q.key||'')==='aid:'+aid||String(q.source_url||'').includes('/aid/'+aid+'/')));
}
const letter2989411=idx.entries.find(e=>sourceAID(e)==='2989411');
assert(letter2989411&&letter2989411.type==='letter'&&letter2989411.response_propositions.length===3);
assert.equal(letter2989411.evidence_family_id,'letter-5711-5-elul-yeshiva-students-aid2989411');
const enriched5959845=idx.entries.find(e=>sourceAID(e)==='5959845');
assert(enriched5959845&&enriched5959845.response_propositions.length===16);
assert(enriched5959845.response_proposition_locators.some(x=>String(x).includes('214–224')&&String(x).includes('233–244')));
assert(enriched5959845.response_proposition_locators.some(x=>String(x).includes('246–253')));
assert.equal(enriched5959845.status,'Parsed');
assert.equal(enriched5959845.evidence_family_id,'sicha-5728-shabbat-pinchas-torah-and-practical-work-aid5959845');
assert.equal(batch112Data.deduplication_check.full_index_scan_available,true);
assert.deepEqual(batch112Data.deduplication_check.canonical_identity_collisions,[]);
assert.deepEqual(batch112Data.deduplication_check.missing_canonical_identities,[]);
assert.equal(batch112Data.deduplication_check.all_target_identities_answer_eligible,true);
assert(['reconciled','reconciled_with_variance'].includes(batch112Data.reconciliation_status));
const batch112Actual=readinessMetrics(batch112Data.metrics_actual_after);
const batch112ReconciliationAudit=projectState.development_recovery.reconciliation_chain.find(x=>String(x.batch_id)==='112');
assert(batch112ReconciliationAudit,'batch 112 must retain its own reconciled boundary snapshot');
assert.deepEqual(batch112Actual,readinessMetrics(batch112ReconciliationAudit.metrics_actual_after));
assert.deepEqual(batch112Data.reconciliation_variance,{
 answer_eligible_unique_sources:batch112Actual.answer_eligible_unique_sources-batch112Data.metrics_expected_after.answer_eligible_unique_sources,
 content_verified_unique_sources:batch112Actual.content_verified_unique_sources-batch112Data.metrics_expected_after.content_verified_unique_sources,
 answer_eligible_propositions:batch112Actual.answer_eligible_propositions-batch112Data.metrics_expected_after.answer_eligible_propositions
});
const batch113Path='data/items/content-research-batch-113-2026-11-16.json';
const batch114Path='data/items/content-research-batch-114-2026-11-16.json';
const batch115Path='data/items/content-research-batch-115-2026-11-16.json';
const batch113Data=JSON.parse(await readFile(new URL(batch113Path,root),'utf8'));
const batch113Aids=['528645','528646','528647','528649','528650','528651','528652','528653','528654','528655','528656','528657','528658','528659','528660'];
assert.equal(batch113Data.batch_id,'113');
assert.equal(batch113Data.records.length,15);
assert.deepEqual(batch113Data.new_aids,batch113Aids.map(Number));
assert.deepEqual(batch113Data.enriched_aids,[2989585,5959845]);
assert.equal(batch113Data.new_source_identities,15);
assert.equal(batch113Data.existing_identities_enriched,2);
assert.equal(batch113Data.new_response_propositions,15);
assert.equal(batch113Data.existing_response_propositions_added,2);
assert.equal(batch113Data.total_new_paraphrase_entries,17);
assert.equal(batch113Data.answer_eligible_source_families_added,15);
assert.equal(batch113Data.independent_witnesses_added,15);
assert.equal(batch113Data.content_verified_unique_sources_added,0);
assert.equal(batch113Data.source_bodies_inspected,17);
assert.equal(batch113Data.source_body_pages_opened,17);
assert.equal(batch113Data.source_body_review.length,17);
assert(batch113Data.source_body_review.every(r=>r.inspected_original_language_body===true&&r.body_locator));
assert.deepEqual(batch113Data.language_distribution,{Hebrew:9,Yiddish:6});
assert.deepEqual(batch113Data.original_language_distribution,{Hebrew:9,Yiddish:6});
assert.equal(batch113Data.records.filter(r=>r.language==='Hebrew'&&r.original_language==='Hebrew').length,9);
assert.equal(batch113Data.records.filter(r=>r.language==='Yiddish'&&r.original_language==='Yiddish').length,6);
assert.equal(batch113Data.records.reduce((n,r)=>n+r.response_propositions.length,0),15);
assert.equal(new Set(batch113Data.records.map(r=>String(r.aid))).size,15);
assert.equal(new Set(batch113Data.records.map(r=>r.evidence_family_id)).size,15);
assert.equal(batch113Data.excluded_candidates[0].aid,528648);
assert.equal(batch113Data.blocked_candidate_count,1);
assert.equal(batch113Data.fallback_source_attempted,true);
assert.equal(batch113Data.fallback_source_results.body_text_inspected,true);
assert.equal(batch113Data.fallback_source_results.accessible_item_level_bodies,15);
assert.equal(batch113Data.crawler_retry,false);
assert.equal(batch113Data.access_control_bypassed,false);
assert.equal(batch113Data.full_text_copied,false);
assert.equal(batch113Data.scan_only_verification_used,false);
assert.equal(batch113Data.translations_counted_as_independent_witnesses,0);
assert.deepEqual(batch113Data.metrics_before,{answer_eligible_unique_sources:1076,content_verified_unique_sources:854,answer_eligible_propositions:3147});
assert.deepEqual(batch113Data.metrics_expected_after,{answer_eligible_unique_sources:1091,content_verified_unique_sources:854,answer_eligible_propositions:3164});
assert.deepEqual(batch113Data.metrics_delta_at_batch_boundary,{answer_eligible_unique_sources:15,content_verified_unique_sources:0,answer_eligible_propositions:17});
assert.equal(batch113Data.existing_identity_updates.length,2);
assert.equal(batch113Data.existing_identity_updates.find(x=>x.aid===5959845).total_propositions_after,6);
assert.equal(batch113Data.existing_identity_updates.find(x=>x.aid===2989585).total_propositions_after,8);
for(const r of batch113Data.records){
 assert.equal(r.status,'Parsed');assert.equal(r.pipeline_status,'Parsed');assert.equal(r.canonical_status,'Parsed');
 assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);assert.equal(r.proposition_verification,'source_text_inspected');
 assert(r.proposition_source_locator&&r.provenance&&r.verification_scope&&r.context_status==='partial'&&r.has_content_evidence);
 assert.equal(r.response_propositions.length,r.response_proposition_locators.length);
 assert.equal(r.independent_witness,true);assert.equal(r.translation_of_evidence_family_id,null);assert.equal(r.body_text_inspected,undefined);assert.equal(r.original_language_body_inspected,undefined);assert.equal(r.inspection_method,undefined);
}
for(const aid of batch113Aids){
 const matches=idx.entries.filter(e=>sourceAID(e)===aid);assert.equal(matches.length,1,'batch-113 AID '+aid+' must have one canonical identity');
 const e=matches[0];assert(e.has_content_evidence,'batch-113 AID '+aid+' must have inspected body text');assert.equal(e.status,'Parsed');
 assert.equal(e.canonical_file,batch113Path);assert.equal(e.independent_witness,true);assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');assert(e.proposition_source_locator&&e.verification_scope);
 assert(!queue.records.some(q=>String(q.key||'')==='aid:'+aid||String(q.source_url||'').includes('/aid/'+aid+'/')));
}
assert(!idx.entries.some(e=>sourceAID(e)==='528648'&&e.has_content_evidence===true),'AID 528648 is a month index, not an item-level source');
const enriched5959845Batch113=idx.entries.find(e=>sourceAID(e)==='5959845');
assert(enriched5959845Batch113&&enriched5959845Batch113.response_propositions.length===16);
assert(enriched5959845Batch113.response_propositions.some(p=>p.includes('לשבור כלים')));
assert(enriched5959845Batch113.response_propositions.some(p=>p.includes('כבוד אישי')));assert(enriched5959845Batch113.response_propositions.some(p=>p.includes('חלקו האפשרי של הרב')));
assert(enriched5959845Batch113.response_proposition_locators.some(l=>String(l).includes('246–253')));
const enriched2989585Batch113=idx.entries.find(e=>sourceAID(e)==='2989585');
assert(enriched2989585Batch113&&enriched2989585Batch113.response_propositions.length===19);
assert(enriched2989585Batch113.response_propositions.some(p=>p.includes('לפני בר־מצווה')));
assert(enriched2989585Batch113.response_proposition_locators.some(l=>String(l).includes('189–193')));
assert.equal(batch113Data.deduplication_check.full_index_scan_available,true);
assert.deepEqual(batch113Data.deduplication_check.canonical_identity_collisions,[]);
assert.deepEqual(batch113Data.deduplication_check.missing_canonical_identities,[]);
assert.equal(batch113Data.deduplication_check.all_target_identities_answer_eligible,true);
assert(['reconciled','reconciled_with_variance'].includes(batch113Data.reconciliation_status));
const batch113Actual=readinessMetrics(batch113Data.metrics_actual_after);
const batch113Audit=projectState.development_recovery.reconciliation_chain.find(x=>String(x.batch_id)==='113');
assert(batch113Audit,'batch 113 must retain its own reconciled boundary snapshot');
assert.deepEqual(batch113Actual,readinessMetrics(batch113Audit.metrics_actual_after));
assert.deepEqual(batch113Data.reconciliation_variance,{
 answer_eligible_unique_sources:batch113Actual.answer_eligible_unique_sources-batch113Data.metrics_expected_after.answer_eligible_unique_sources,
 content_verified_unique_sources:batch113Actual.content_verified_unique_sources-batch113Data.metrics_expected_after.content_verified_unique_sources,
 answer_eligible_propositions:batch113Actual.answer_eligible_propositions-batch113Data.metrics_expected_after.answer_eligible_propositions
});
const lastBatchSummary=projectState.development_recovery.last_batch_summary;
assert.equal(String(lastBatchSummary.batch_id),currentReviewBatchId);
assert.equal(String(lastBatchSummary.batch_file),String(acquisitionState.manual_web_review.batch_file));
assert.equal(String(projectState.development_recovery.current_batch),String(projectState.current_batch));
const currentBatchReconciled=['reconciled','reconciled_with_variance'].includes(lastBatchSummary.reconciliation_status||lastBatchSummary.status);
if(currentBatchReconciled){
 assert.equal(String(projectState.development_recovery.last_completed_batch),currentReviewBatchId);
 assert.deepEqual(readinessMetrics(lastBatchSummary.metrics_actual_after),readinessMetrics(metrics));
 assert.deepEqual(Object.keys(lastBatchSummary.metrics_delta_actual).sort(),['answer_eligible_propositions','answer_eligible_unique_sources','content_verified_unique_sources'].sort());
 assert.deepEqual(lastBatchSummary.metrics_delta_actual,{
  answer_eligible_unique_sources:metrics.answer_eligible_unique_sources-lastBatchSummary.metrics_actual_before.answer_eligible_unique_sources,
  content_verified_unique_sources:metrics.content_verified_unique_sources-lastBatchSummary.metrics_actual_before.content_verified_unique_sources,
  answer_eligible_propositions:metrics.answer_eligible_propositions-lastBatchSummary.metrics_actual_before.answer_eligible_propositions
 });
 assert.deepEqual(readinessMetrics(acquisitionState.manual_web_review.metrics_actual_after),readinessMetrics(metrics));
}else{
 assert.equal(lastBatchSummary.status,'pending_reconciliation');
 assert.equal(lastBatchSummary.reconciliation_status,'pending_reconciliation');
 assert.equal(lastBatchSummary.metrics_actual_after,null);
 assert.equal(lastBatchSummary.metrics_delta_actual,null);
 assert.equal(acquisitionState.manual_web_review.metrics_actual_after,null);
 const lastReconciled=projectState.development_recovery.reconciliation_chain?.slice(-1)[0];
 assert(lastReconciled,'pending batches must retain the last completed reconciliation boundary');
 assert.equal(String(projectState.development_recovery.last_completed_batch),String(lastReconciled.batch_id));
 assert(Number(lastReconciled.batch_id)<Number(currentReviewBatchId),'pending current batch must not be marked completed');
}
assert.equal(String(acquisitionState.manual_web_review.batch_id),currentReviewBatchId);
assert(String(acquisitionState.manual_web_review.batch_file).includes('content-research-batch-'+currentReviewBatchId.padStart(3,'0')+'-'));
assert.equal(String(acquisitionState.previous_manual_web_review.batch_id),previousReviewBatchId);
assert(String(acquisitionState.previous_manual_web_review.batch_file).includes('content-research-batch-'+previousReviewBatchId.padStart(3,'0')+'-'));
assert.equal(Number(currentReviewBatchId)-Number(previousReviewBatchId),1);
assert.equal(String(acquisitionState.last_manual_web_review.batch_id),currentReviewBatchId);assert.equal(String(acquisitionState.last_manual_review.batch_id),currentReviewBatchId);
for(const id of ['129','130','131','132','133','134','135','136','137'])assert(acquisitionState.manual_web_review_history.some(x=>String(x.batch_id)===id));

console.log('EDUCATION_INFLUENCE_DEBUG '+mode+' '+JSON.stringify({reason:m.reason,topics:m.understanding?.topics,source_aids:m.sources?.map(e=>e.aid),families:m.sources?.map(e=>e.evidence_family_id),claims:m.claims,coverage:m.comparative_coverage,citations:m.citation_entailment}));
 assert(m.answerable,mode+': multi-source educational influence/action synthesis must be answerable');
 const individualInfluence=m.sources.find(e=>String(e.aid)==='2278256');
 assert(individualInfluence,'the single-person influence letter must survive retrieval');
 assert.equal(individualInfluence.independent_witness,false,'English translation remains a derived presentation, not an independent witness');
 assert(individualInfluence.translation_of_evidence_family_id===individualInfluence.evidence_family_id);
 const childEducation=m.sources.find(e=>String(e.aid)==='2278261');
  assert(childEducation,'the immigrant-child education letter must survive multi-source retrieval');
  assert.equal(childEducation.independent_witness,false,'the translated child-education presentation remains derived, not independent');
  assert.equal(childEducation.translation_of_evidence_family_id,childEducation.evidence_family_id);
 assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=2);
 assert(m.claims.length>0);
 if(mode==='researcher'){
  assert(m.research&&m.research.depth==='deep'&&m.research.evidence_families>=2);
  assert(m.research.evidence_integrity.derived_non_independent>=1,'researcher mode must expose the translated letter as derived, not independent');
  assert(m.research.claim_source_map.every(c=>c.source_locators.length>0),'researcher mode must preserve claim-level source locators');
  assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));
  assert.equal(m.research.witnesses.length,m.sources.length);
  assert(m.research.evidence_map.length>0&&m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));
  assert(m.research.citation_entailment.every(x=>x.valid)&&m.research.context_boundary.every(x=>x.valid));
 }else assert.equal(m.research,undefined);
}

const batch087Aids=batch087Data.records.filter(r=>r.aid).map(r=>String(r.aid));
assert.equal(batch087Data.records.length,8);assert.equal(batch087Aids.length,7);assert.equal(new Set(batch087Aids).size,7);
assert.equal(new Set(batch087Data.records.map(r=>r.evidence_family_id)).size,8);assert.equal(new Set(batch087Data.records.map(r=>r.source_url)).size,8);
assert.equal(batch087Data.records.filter(r=>r.language==='English').length,7);assert.equal(batch087Data.records.filter(r=>r.language==='Hebrew').length,1);
assert.equal(batch087Data.records.filter(r=>r.independent_witness===false).length,8);assert.equal(batch087Data.records.filter(r=>r.translation_of_evidence_family_id).length,2);
assert.equal(batch087Data.records.filter(r=>r.status==='Linked').length,1);assert.equal(batch087Data.records.filter(r=>r.status==='Parsed').length,7);
assert.equal(batch087Data.records.reduce((n,r)=>n+r.response_propositions.length,0),15);
assert.equal(batch087Data.new_response_propositions,15);assert.equal(batch087Data.existing_response_propositions_added,1);assert.equal(batch087Data.new_source_identities,7);assert.equal(batch087Data.duplicate_alias_identities,1);assert.equal(batch087Data.existing_identities_enriched,1);
assert.equal(batch087Data.answer_eligible_source_families_added,7);assert.equal(batch087Data.non_independent_presentations_added,7);
assert.equal(batch087Data.source_bodies_inspected,10);assert.equal(batch087Data.reviewed_item_count,18);assert.equal(batch087Data.blocked_candidate_count,8);
assert.equal(batch087Data.not_promoted_after_inspection[0].aid,'2189943');assert.equal(batch087Data.crawler_retry,false);assert.equal(batch087Data.access_control_bypassed,false);assert.equal(batch087Data.full_text_copied,false);
assert.deepEqual(batch087Data.metrics_before,{answer_eligible_unique_sources:869,content_verified_unique_sources:852,answer_eligible_propositions:2781});
assert.deepEqual(batch087Data.metrics_expected_after,{answer_eligible_unique_sources:876,content_verified_unique_sources:852,answer_eligible_propositions:2797});
assert.equal(batch087Data.reconciliation_status,'reconciled');assert.deepEqual(batch087Data.metrics_actual_after,batch087Data.metrics_expected_after);
assert.deepEqual(batch087Data.reconciliation_variance,{answer_eligible_unique_sources:0,content_verified_unique_sources:0,answer_eligible_propositions:0});
for(const aid of batch087Aids){
 const matches=idx.entries.filter(e=>sourceAID(e)===aid);assert.equal(matches.length,1,'batch-087 AID '+aid+' must have one canonical identity');
 const e=matches[0];assert(e,'batch-087 AID '+aid+' must be indexed');
 if(aid==='1273962'){
  assert.equal(e.evidence_family_id,'letter-aid-1273962-education-young-children');
  assert.equal(e.canonical_file,'data/items/mixed-authorized-content-2026-11-12-039.json');
  assert.equal(e.status,'Verified');
  assert.equal(e.response_proposition_locators.length,e.response_propositions.length,'canonical AID 1273962 must have one locator per proposition');
  assert(e.response_proposition_locators.every(Boolean));
  assert(e.response_proposition_locators[0].includes('283')&&e.response_proposition_locators[1].includes('283')&&e.response_proposition_locators[2].includes('285'));
  const alias=batch087Data.records.find(r=>String(r.aid)==='1273962');
  assert.equal(alias.status,'Linked');assert.equal(alias.has_content_evidence,false);assert.equal(alias.evidence_family_id,e.evidence_family_id);
 }else{
  assert(e.has_content_evidence);
  assert.equal(e.canonical_file,batch087Path);
  assert.equal(e.status,'Parsed');
  assert.equal(e.proposition_origin,'source_grounded_paraphrase');
  assert.equal(e.proposition_verbatim,false);
  assert.equal(e.proposition_verification,'source_text_inspected');
  assert(e.proposition_source_locator&&e.verification_scope&&e.witness_provenance);
  assert.equal(e.response_proposition_locators.length,e.response_propositions.length);
  assert(e.response_proposition_locators.every(Boolean));
  assert.equal(e.independent_witness,false);
  assert.equal(e.context_status,'partial');
 }
}
const batch087Pdf=batch087Data.records.find(r=>r.id==='igrot-letter-5702-rosh-chodesh-nissan-achlei-torah-p169');assert(batch087Pdf&&batch087Pdf.language==='Hebrew'&&batch087Pdf.original_language==='Yiddish');assert.equal(batch087Pdf.independent_witness,false);assert.equal(batch087Pdf.translation_of_evidence_family_id,batch087Pdf.evidence_family_id);assert(batch087Pdf.verification_scope.includes('המקור ביידיש לא נבדק'));
const indexedPdf=idx.entries.find(e=>e.id==='igrot-letter-5702-rosh-chodesh-nissan-achlei-torah-p169');assert(indexedPdf&&indexedPdf.has_content_evidence&&indexedPdf.status==='Parsed');assert.equal(indexedPdf.canonical_file,batch087Path);
const enriched1875534=idx.entries.find(e=>sourceAID(e)==='1875534');assert(enriched1875534&&enriched1875534.status==='Verified');assert.equal(enriched1875534.evidence_family_id,'chabad-letter-1875534');assert.equal(enriched1875534.response_propositions.length,6);assert.equal(enriched1875534.response_proposition_locators.length,6);assert.equal(enriched1875534.has_content_evidence,true);assert.equal(enriched1875534.independent_witness,false);assert(enriched1875534.response_propositions.some(p=>p.includes('מפגש של מחשבות ורעיונות חורג מזמן וממרחק')));assert(enriched1875534.response_propositions.some(p=>p.includes('בקשת תרומה עקיפה')));assert(enriched1875534.response_proposition_locators.some(l=>l.includes('288–290')));
const withheld2189943=idx.entries.find(e=>sourceAID(e)==='2189943');assert(!withheld2189943||withheld2189943.has_content_evidence!==true);
const educationCorrespondenceQuestion='מה מתועד באיגרות על חינוך ילדים צעירים, חינוך עברי, דיבור בכיתה, מטרות החינוך ומעורבות תלמידים?';
for(const mode of ['regular','researcher']){const m=buildAnswerModel(idx.entries,educationCorrespondenceQuestion,{mode});assert(m.answerable,mode+': bounded cross-family comparison should be answerable');for(const aid of ['1273962','1875534','1875506','1273','66725','4082940','4650780','1874637'])assert(m.sources.some(e=>sourceAID(e)===aid),mode+': source '+aid);assert(m.sources.some(e=>e.id==='igrot-letter-5702-rosh-chodesh-nissan-achlei-torah-p169'));assert(m.synthesis&&m.synthesis.topic==='education_correspondence_comparison');assert.equal(m.synthesis.attribution,'system_synthesis_not_rebbe_quote');assert.equal(m.synthesis.claims.length,7);assert(m.synthesis.basis.length>=8);assert(new Set(m.synthesis.evidence_family_ids).size>=8);assert(m.synthesis.claims.every(c=>c.source_numbers.length&&c.source_locators.length&&c.source_locators.every(x=>x.locator)));assert(m.pattern_synthesis_integrity?.valid===true);assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));if(mode==='researcher'){assert.equal(m.research.depth,'deep');assert(m.research.evidence_integrity.derived_non_independent>=8);assert(m.research.claim_source_map.length>=7&&m.research.claim_source_map.every(c=>c.source_locators.length));assert(m.research.synthesis_constraints.rule.includes('case comparison'));}else assert.equal(m.research,undefined);}

// Batch 096: nine newly inspected original-language Hayom Yom entries; one existing letter identity received only locator enrichment.
const batch096Path='data/items/content-research-batch-096-2026-11-15.json';
const batch096Data=JSON.parse(await readFile(new URL(batch096Path,root)));
const batch096Aids=['3316616','3316619','3316622','3316627','3316640','3316694','3316701','3316725','3316748'];
assert.equal(batch096Data.records.length,9);
assert.equal(batch096Data.new_source_identities,9);
assert.equal(batch096Data.existing_identities_enriched,1);
assert.equal(batch096Data.new_response_propositions,11);
assert.equal(batch096Data.content_verified_unique_sources_added,0);
assert.equal(batch096Data.blocked_candidates[0].aid,4666220);
assert.equal(batch096Data.crawler_retry,false);
assert.equal(batch096Data.access_control_bypassed,false);
const batch096Families=new Set();
for(const aid of batch096Aids){
 const matches=idx.entries.filter(e=>sourceAID(e)===aid);
 assert.equal(matches.length,1,'batch-096 AID '+aid+' must have one canonical identity');
 const e=matches[0];
 assert.equal(e.canonical_file,batch096Path);
 assert.equal(e.status,'Parsed');
 assert.equal(e.has_content_evidence,true);
 assert.equal(e.context_status,'partial');
 assert.equal(e.independent_witness,true);
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope&&e.witness_provenance);
 assert.equal(e.response_proposition_locators.length,e.response_propositions.length);
 assert(e.response_proposition_locators.every(Boolean));
 assert(e.translation_status.includes('not counted independently'));
 assert(e.evidence_family_id);
 batch096Families.add(e.evidence_family_id);
}
assert.equal(batch096Families.size,9,'each dated Hayom Yom entry must retain its own Evidence Family');
const existing4666220=idx.entries.find(e=>sourceAID(e)==='4666220');
assert(existing4666220&&existing4666220.has_content_evidence,'the previously inspected AID 4666220 identity must remain available');
assert.equal(idx.entries.filter(e=>sourceAID(e)==='4666220').length,1,'the blocked recheck must not create a duplicate identity');
assert.equal(existing4666220.canonical_file,'data/items/chabad-letter-4666220.json');
assert.equal(existing4666220.evidence_family_id,'original-letter-aid-4666220');
assert.equal(existing4666220.response_propositions.length,2);
assert.equal(existing4666220.proposition_origin,'source_grounded_paraphrase');
assert.equal(existing4666220.proposition_verification,'source_text_inspected');
assert.equal(existing4666220.context_status,'partial');
assert.equal(batch096Data.reconciliation_status,'reconciled');
assert.deepEqual(batch096Data.metrics_expected_after,{answer_eligible_unique_sources:948,content_verified_unique_sources:870,answer_eligible_propositions:2906});
assert.deepEqual(batch096Data.metrics_actual_after,batch096Data.metrics_expected_after);
assert.deepEqual(batch096Data.reconciliation_variance,{answer_eligible_unique_sources:0,content_verified_unique_sources:0,answer_eligible_propositions:0});




// Publisher transcriptions of original-language correspondence are direct text witnesses, not translations or copied derivatives.
const originalPublisherTranscripts=normalizeEvidenceIntegrity(idx.entries.filter(e=>['4666292','4666305'].includes(String(e.aid))));
assert.equal(originalPublisherTranscripts.length,2);
assert(originalPublisherTranscripts.every(e=>e._independent_witness===true),'authorized original-language publisher transcriptions must remain independent text witnesses');
const explicitDerivedCopy=normalizeEvidenceIntegrity(idx.entries.filter(e=>String(e.aid)==='2190037'));
assert.equal(explicitDerivedCopy.length,1);
assert.equal(explicitDerivedCopy[0]._independent_witness,false,'an explicitly transcribed copy must remain non-independent');


// Batch 074: seven new original-language publisher identities, two existing identities rechecked in place, and one in-place content enrichment.
// Counts are checked from the live normalized index above; no stale cumulative totals are hard-coded.
const batch074Data=JSON.parse(await readFile(new URL('data/items/content-research-batch-074-2026-11-13.json',root)));
assert.equal(batch074Data.records.length,7,'batch 074 must contain seven genuinely new item-level source identities');
assert.equal(batch074Data.new_response_propositions,20,'batch 074 proposition count must match the seven genuinely new inspected records');
const batch074Required=[
 [4783989,3,'igrot-letter-5712-13-nissan-aid4783989','Hebrew'],
 [4754323,3,'igrot-letter-5711-11-tevet-aid4754323','Hebrew'],
 [4812647,2,'igrot-letter-5712-1-sivan-aid4812647','Hebrew'],
 [4929255,4,'igrot-letter-5715-18-elul-aid4929255','Hebrew'],
 [5054364,3,'igrot-letter-5717-11-sivan-aid5054364','Hebrew'],
 [5357253,2,'igrot-letter-5711-15-menachem-av-aid5357253','Hebrew'],
 [5287606,3,'igrot-letter-5720-2-shevat-aid5287606','Hebrew']
];
for(const [aid,minProps,family,language] of batch074Required){
 const e=idx.entries.find(x=>sourceAID(x)===String(aid));
 assert(e&&e.has_content_evidence,'batch-074 AID '+aid+' must have inspected publisher body text');
 assert.equal(e.status,'Verified','batch-074 AID '+aid+' must retain scoped body-level verification');
 assert.equal(e.evidence_family_id,family,'batch-074 AID '+aid+' must have its own dated Evidence Family');
 assert(e.response_propositions.length>=minProps,'batch-074 AID '+aid+' must expose its inspected paraphrases');
 assert.equal(e.language,language,'batch-074 AID '+aid+' must preserve source language');
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope,'batch-074 AID '+aid+' must retain locator and verification scope');
 assert.equal(e.context_status,'partial','batch-074 AID '+aid+' must not imply complete incoming context');
 assert.equal(e.canonical_file,'data/items/content-research-batch-074-2026-11-13.json');
 assert.equal(e.independent_witness,true,'original-language publisher text is one distinct letter witness');
 assert.equal(e.translation_of_evidence_family_id,null,'no translation is counted as an independent source');
 assert(!queue.records.some(q=>String(q.key||'')==='aid:'+aid||String(q.source_url||'').includes('/aid/'+aid+'/')),'inspected AID '+aid+' must not remain in the review queue');
}
const enriched5357369=idx.entries.find(e=>String(e.aid)==='5357369');
assert(enriched5357369&&enriched5357369.response_propositions.some(p=>p.includes('קרעמער')),'existing AID 5357369 must retain the new inspected letter-distribution proposition');
assert(enriched5357369.proposition_source_locator.includes('301–302'),'AID 5357369 must expose the exact added passage locator');
assert.equal(enriched5357369.evidence_family_id,'igrot-letter-5714-24-shevat-het-aleph-aid5357369','existing AID 5357369 must stay in its original Evidence Family');
assert.equal(enriched5357369.canonical_file,'data/items/content-research-batch-073-2026-11-13.json');
const rechecked4731080=idx.entries.find(e=>String(e.aid)==='4731080');
assert(rechecked4731080&&rechecked4731080.response_propositions.length>=3,'existing AID 4731080 must retain its inspected Yiddish propositions');
assert.equal(rechecked4731080.evidence_family_id,'igrot-letter-5710-11-elul-תשכ-aid4731080','AID 4731080 must retain its original Evidence Family');
assert.equal(rechecked4731080.canonical_file,'data/items/content-research-batch-059-2026-11-12.json','AID 4731080 must remain in its original canonical batch');
assert(batch074Data.existing_identity_updates.some(x=>String(x.aid)==='4731080'&&x.update_type==='rechecked_existing_identity'),'AID 4731080 must be recorded as rechecked, not new');
const rechecked4812666=idx.entries.find(e=>String(e.aid)==='4812666');
assert(rechecked4812666&&rechecked4812666.response_propositions.length>=3,'existing AID 4812666 must retain its inspected Hebrew propositions');
assert.equal(rechecked4812666.evidence_family_id,'igrot-letter-5712-3-sivan-aid4812666','AID 4812666 must retain its original Evidence Family');
assert.equal(rechecked4812666.canonical_file,'data/items/content-research-batch-058-2026-11-12.json','AID 4812666 must remain in its original canonical batch');
assert(batch074Data.existing_identity_updates.some(x=>String(x.aid)==='4812666'&&x.update_type==='rechecked_existing_identity'),'AID 4812666 must be recorded as rechecked, not new');

const tzedakahSynthesisQ='מה עולה מן האיגרות על צדקה לאורך השנה, הרחבת הנתינה וחלוקת תרומות?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,tzedakahSynthesisQ,{mode});
 assert(m.answerable,mode+': inspected tzedakah correspondence must support a bounded multi-source synthesis');
 const expected=[4783989,4731080,4812647,5287606,5054399,5413166,5100681];
 const expectedFound=expected.filter(aid=>m.sources.some(e=>sourceAID(e)===String(aid)));
 assert(!m.understanding.topics.includes('שבת שירה ומתן תורה'),mode+': generic מן must not trigger Shabbat Shirah for a tzedakah query');
 assert(expectedFound.length>=3,mode+': synthesis must retrieve at least three of the inspected, distinct tzedakah Evidence Families; found '+expectedFound.join(',')+'; sources '+m.sources.map(e=>e.aid||e.id).join(',')+'; query '+m.understanding.query+'; topics '+m.understanding.topics.join('|')+'; intent '+m.understanding.intent);
 assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=3,mode+': tzedakah synthesis must deduplicate by Evidence Family');
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length),mode+': every synthesized claim needs proposition-level citations');
 assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid),mode+': tzedakah synthesis must preserve claim entailment and witness-local context');
 if(mode==='researcher'){
  assert(m.research&&m.research.evidence_families>=3,mode+': researcher mode must expose independent-family depth');
  assert.equal(m.research.witnesses.length,m.sources.length,mode+': researcher mode must expose provenance for each witness');
  assert(m.research.evidence_map.length>0&&m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)),mode+': researcher mode must map claims to exact source locators');
  assert(m.research.citation_entailment.every(x=>x.valid)&&m.research.context_boundary.every(x=>x.valid),mode+': researcher mode must retain citation and context audits');
 }else assert.equal(m.research,undefined,'regular mode must not expose researcher-only detail');
}
// Batch 077: three new Hebrew Evidence Families and case-specific charity allocation synthesis.
const batch077Data=JSON.parse(await readFile(new URL('data/items/content-research-batch-077-2026-11-13.json',root)));
assert.equal(batch077Data.reviewed_item_count,12);assert.equal(batch077Data.source_bodies_inspected,12);assert.equal(batch077Data.new_source_identities,3);assert.equal(batch077Data.existing_identities_enriched,1);assert.equal(batch077Data.existing_identities_rechecked,8);assert.equal(batch077Data.new_response_propositions,8);assert.equal(batch077Data.answer_eligible_source_families_added,3);

assert.equal(batch077Data.metrics_actual_after.answer_eligible_unique_sources,792);assert.equal(batch077Data.metrics_actual_after.content_verified_unique_sources,789);assert.equal(batch077Data.metrics_actual_after.answer_eligible_propositions,2630);assert.equal(batch077Data.reconciliation_status,'reconciled');
const batch077Aids=[5100681,5054399,5413166];
for(const aid of batch077Aids){const e=idx.entries.find(x=>sourceAID(x)===String(aid));assert(e&&e.has_content_evidence,'batch-077 AID '+aid+' must have inspected publisher body/excerpt');assert.equal(e.status,'Verified');assert.equal(e.language,'Hebrew');assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');assert(e.proposition_source_locator&&e.verification_scope&&e.witness_provenance);assert.equal(e.context_status,'partial');assert.equal(e.independent_witness,true);assert.equal(e.translation_of_evidence_family_id,null);assert.equal(e.canonical_file,'data/items/content-research-batch-077-2026-11-13.json');assert(!queue.records.some(q=>String(q.key||'')==='aid:'+aid||String(q.source_url||'').includes('/aid/'+aid+'/')));}
assert.equal(new Set(batch077Aids.map(aid=>idx.entries.find(e=>sourceAID(e)===String(aid)).evidence_family_id)).size,3);
const linked5357409=idx.entries.find(e=>String(e.aid)==='5357409');assert(linked5357409&&linked5357409.relations.some(r=>r.target_id==='chabad-letter-5100681'&&r.same_evidence_family===false));
const charityAllocationQ='מה עולה מן האיגרות על צדקה לאורך השנה, חלוקת תרומות בין הקופה הכללית לקרובים, תרומה לישיבת תורת אמת ונדבה בבניית בית?';
for(const mode of ['regular','researcher']){const m=buildAnswerModel(idx.entries,charityAllocationQ,{mode});assert(m.answerable,mode+': distinct charity-allocation cases must support a bounded multi-source answer');for(const aid of batch077Aids)assert(m.sources.some(e=>sourceAID(e)===String(aid)),mode+': synthesis must retain new AID '+aid);assert(m.synthesis&&m.synthesis.topic==='tzedakah_contexts_and_allocation');for(const topic of ['general_fund_and_relatives','dedicated_yeshiva_donation','home_building_donation']){const c=m.synthesis.claims.find(x=>x.topic===topic);assert(c&&c.source_numbers.length&&c.source_locators.length,mode+': '+topic+' must expose claim-level locators');}assert(m.synthesis.attribution==='system_synthesis_not_rebbe_quote');assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length));assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));if(mode==='researcher'){assert(m.research&&m.research.evidence_families>=3);assert(m.research.evidence_map.length>0&&m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));assert(m.research.citation_entailment.every(x=>x.valid)&&m.research.context_boundary.every(x=>x.valid));}else assert.equal(m.research,undefined);}
const elulPracticeQ='מה נכתב באיגרת על עבודת התשובה באלול, מפגש עם משפיעים והתוועדות?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,elulPracticeQ,{mode});
 assert(m.answerable,mode+': the inspected Elul correspondence must answer its bounded topic');
 assert(m.sources.some(e=>String(e.aid)==='4929255'),mode+': the Elul answer must cite the inspected source');
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length));
 assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));
 if(mode==='researcher')assert(m.research&&m.research.witnesses.length===m.sources.length&&m.research.evidence_map.length>0);
 else assert.equal(m.research,undefined);
}


// Batch 076: English publisher renderings remain non-independent, while existing
// Hebrew witnesses support a claim-cited multi-source answer in both modes.
const batch076Data=JSON.parse(await readFile(new URL('data/items/content-research-batch-076-2026-11-13.json',root)));
const batch076Aids=[72910,1266,1273955,3567490,2387459,1866734,1878196,6977991,1273936,1898720];
assert.equal(batch076Data.reviewed_item_count,11);
assert.equal(batch076Data.source_bodies_inspected,11);
assert.equal(batch076Data.new_source_identities,10);
assert.equal(batch076Data.existing_identities_enriched,1);
assert.equal(batch076Data.new_response_propositions,20);
assert.equal(batch076Data.existing_response_propositions_added,1);
assert.equal(new Set(batch076Data.records.map(e=>e.evidence_family_id)).size,10);
// Historical batch-079 metrics are asserted against its own manifest below; current global metrics are validated against the live index at the top of this test.
for(const aid of batch076Aids){
 const e=idx.entries.find(x=>sourceAID(x)===String(aid));
 assert(e&&e.has_content_evidence,'batch-076 source '+aid+' must expose inspected content');
 assert.equal(e.status,'Verified','batch-076 source '+aid+' must retain scoped publisher-body verification');
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope,'batch-076 source '+aid+' must expose exact locator and scope');
 assert.equal(e.context_status,'partial');
 assert.equal(e.independent_witness,false,'English rendering '+aid+' must not be counted as an independent witness');
 assert(e.evidence_family_id,'batch-076 source '+aid+' must have one underlying Evidence Family');
}
const enriched4812673=idx.entries.find(e=>String(e.aid)==='4812673');
assert(enriched4812673&&enriched4812673.response_propositions.length>=3,'AID 4812673 must retain its existing family and the additional Hebrew proposition');
assert.equal(enriched4812673.evidence_family_id,'igrot-letter-5712-10-sivan-aid4812673');
const moodQuestion='מה כתב הרבי על מיעוט חיות בלימוד ומחשבות מבלבלות?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,moodQuestion,{mode});
 assert(m.answerable,mode+': inspected correspondence must answer the mood-and-study question');
 assert(m.sources.some(e=>String(e.aid)==='5100351'),mode+': AID 5100351 must support the thought-redirection claim');
 assert(m.sources.some(e=>String(e.aid)==='4854525'),mode+': AID 4854525 must support the low-mood-and-study claim');
 assert(new Set(m.sources.filter(e=>e._independent_witness!==false).map(e=>e.evidence_family_id)).size>=2,mode+': synthesis must retain at least two independent Hebrew Evidence Families');
 assert(m.claims.every(c=>c.source_numbers.length),mode+': each mood-and-study claim needs a source citation');
 assert(m.citation_entailment.every(x=>x.valid),mode+': every citation must entail its exact claim');
 assert(m.context_boundary.every(x=>x.valid),mode+': circumstances and qualifications must remain witness-local');
 if(mode==='researcher'){
  assert(m.research&&m.research.evidence_map.length>0,'researcher mode must expose the claim-to-witness evidence map');
  assert(m.research.citation_entailment.every(x=>x.valid),'researcher mode must expose valid claim-local citations');
  assert(m.research.context_boundary.every(x=>x.valid),'researcher mode must expose valid context boundaries');
  assert(m.research.evidence_families>=2,'researcher mode must count at least two independent evidence families');
 }else assert.equal(m.research,undefined,'regular mode must not expose researcher-only analysis');
}

const batch078TeshuvahQuestion='מה מתארות האיגרות על תשובה תתאה ותשובה עילאה?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,batch078TeshuvahQuestion,{mode});
 assert(m.answerable,mode+': new teshuvah sources must support a multi-source answer');
 assert(m.sources.some(e=>sourceAID(e)==='4754232'));
 assert(m.sources.some(e=>sourceAID(e)==='5019468'));
 assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=2);
 assert(m.synthesis&&m.synthesis.topic==='teshuvah_levels'&&m.synthesis.attribution==='system_synthesis_not_rebbe_quote');
 assert.equal(m.synthesis.claims.length,2);
 assert.equal(m.synthesis.basis.length,2);
 assert(m.claims.every(c=>c.source_numbers.length));
 if(mode==='researcher'){assert(m.research.evidence_map.length>0&&m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));assert(m.research.pattern_synthesis_integrity?.valid===true);}
}
const batch078HealthQuestion='מה מתארות האיגרות על מילוי הוראות רופאים בזמן אשפוז?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,batch078HealthQuestion,{mode});
 assert(m.answerable,mode+': inspected personal health letters must support a bounded multi-source answer');
 assert(m.sources.some(e=>sourceAID(e)==='4812675'));
 assert(m.sources.some(e=>sourceAID(e)==='4831361'));
 assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=2);
 assert(m.claims.every(c=>c.source_numbers.length));
 if(mode==='researcher')assert(m.research.evidence_map.length>0&&m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));
}


// Batch 079: four new inspected Hebrew/Yiddish witnesses, two enriched identities,
// two additional rechecks, and claim-level synthesis across the Jewish-home cases.
const batch079Data=JSON.parse(await readFile(new URL('data/items/content-research-batch-079-2026-11-14.json',root)));
const batch079Path='data/items/content-research-batch-079-2026-11-14.json';
const batch079Aids=[5413165,5413167,5413169,5413171];
assert.equal(batch079Data.records.length,4);
assert.equal(new Set(batch079Aids.map(String)).size,4);
assert.equal(new Set(batch079Data.records.map(e=>e.evidence_family_id)).size,4);
assert.equal(batch079Data.source_bodies_inspected,8);
assert.equal(batch079Data.new_source_identities,4);
assert.equal(batch079Data.existing_identities_enriched,2);
assert.equal(batch079Data.existing_identities_rechecked,4);
assert.equal(batch079Data.new_response_propositions,7);
assert.equal(batch079Data.existing_response_propositions_added,1);
assert.equal(batch079Data.reconciliation_status,'reconciled');
assert.deepEqual(batch079Data.metrics_actual_after, {
 answer_eligible_unique_sources:803,
 content_verified_unique_sources:800,
 answer_eligible_propositions:2635
});
assert.deepEqual(batch079Data.reconciliation_variance,{
 answer_eligible_unique_sources:0,
 content_verified_unique_sources:0,
 answer_eligible_propositions:0
});
for(const aid of batch079Aids){
 const e=idx.entries.find(x=>sourceAID(x)===String(aid));
 assert(e&&e.has_content_evidence,'batch-079 AID '+aid+' must expose inspected body content');
 assert.equal(e.status,'Verified','batch-079 AID '+aid+' must retain scoped publisher-body verification');
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope&&e.witness_provenance,'batch-079 AID '+aid+' must retain provenance and source locator');
 assert.equal(e.context_status,'partial');
 assert.equal(e.independent_witness,true);
 assert.equal(e.translation_of_evidence_family_id,null);
 assert.equal(e.canonical_file,batch079Path);
 assert(!queue.records.some(q=>String(q.key||'')==='aid:'+aid||String(q.source_url||'').includes('/aid/'+aid+'/')));
}
assert.equal(idx.entries.find(e=>sourceAID(e)==='5413165').language,'Yiddish');
assert.equal(idx.entries.find(e=>sourceAID(e)==='5413169').date_precision,'approximate');
const nonIndependent5357409=idx.entries.find(e=>sourceAID(e)==='5357409');assert(nonIndependent5357409&&nonIndependent5357409.independent_witness===false&&nonIndependent5357409.evidence_family_id==='igrot-letter-5715-11-tevet-aid4872269','AID 5357409 must remain linked to its existing Evidence Family and not count as an independent witness');
const batch058Data=JSON.parse(await readFile(new URL('data/items/content-research-batch-058-2026-11-12.json',root)));
const alias5357409Record=batch058Data.records.find(r=>String(r.aid)==='5357409');
assert.equal(alias5357409Record.family_resolution.canonical_item_present_in_repository,true);
assert(nonIndependent5357409.relations.some(r=>r.target_id==='chabad-letter-4872269'&&r.same_evidence_family===true),'the search index must expose the same-family link to the canonical fuller item');
const canonical4872269=idx.entries.find(e=>sourceAID(e)==='4872269');
assert(canonical4872269&&canonical4872269.independent_witness===true&&canonical4872269.evidence_family_id===nonIndependent5357409.evidence_family_id,'AID 4872269 must be the inspected canonical full-text witness for the shared family');
const enriched5357409=idx.entries.find(e=>sourceAID(e)==='5357409');
assert(enriched5357409&&enriched5357409.response_propositions.some(p=>p.includes('מזוזה נאה יותר')&&p.includes('ברכה')),'AID 5357409 must retain the additional bounded mezuzah detail');
const linked5357571=idx.entries.find(e=>sourceAID(e)==='5357571');
assert(linked5357571&&linked5357571.relations.some(r=>r.target_id==='chabad-letter-5413167'&&r.same_evidence_family===false),'AID 5357571 must link to the distinct evening-yeshiva letter without merging families');
const linked5413167=idx.entries.find(e=>sourceAID(e)==='5413167');
assert(linked5413167&&linked5413167.relations.some(r=>r.target_id==='chabad-letter-5357571'&&r.same_evidence_family===false),'AID 5413167 must expose the reciprocal cross-family research link');

const homeQuestion='מה נכתב באיגרות על חינוך הבית היהודי, הכנסת השכינה לבית, חנוכת הבית וקביעת מזוזות?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,homeQuestion,{mode});
 assert(m.answerable,mode+': the distinct home-and-house-dedication witnesses must support a bounded multi-source answer');
 assert(m.sources.some(e=>sourceAID(e)==='5413165'),mode+': the Yiddish convention letter must be retained');
 assert(m.sources.some(e=>e.evidence_family_id==='igrot-letter-5715-11-tevet-aid4872269'&&e._independent_witness!==false),mode+': the canonical housewarming/mezuzah Evidence Family must be retained without counting its non-independent AID 5357409 presentation as a separate witness');
 assert(m.sources.some(e=>sourceAID(e)==='4872269'),mode+': the fuller canonical AID 4872269 body must be retrieved');
 assert(m.sources.every(e=>sourceAID(e)!=='5357409'||e._independent_witness===false),mode+': the shorter AID 5357409 presentation must never be treated as independent');
 assert(m.synthesis&&m.synthesis.topic==='jewish_home_and_house_dedication',mode+': synthesis must explicitly distinguish the two contexts');
 assert(m.synthesis.attribution==='system_synthesis_not_rebbe_quote');
 assert(m.synthesis.claims.length>=2&&m.synthesis.claims.every(c=>c.source_numbers.length&&c.source_locators.length),mode+': each synthesis claim must carry source-level locators');
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length),mode+': every answer claim needs source numbers');
 assert(m.citation_entailment.every(x=>x.valid),mode+': every citation must entail its claim');
 assert(m.context_boundary.every(x=>x.valid),mode+': context boundaries must remain witness-local');
 if(mode==='researcher'){
  assert(m.research&&m.research.evidence_families>=2, 'researcher mode must expose multiple Evidence Families');
  assert(m.research.evidence_map.length>0&&m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)), 'researcher mode must expose claim-to-witness locators');
  assert(m.research.citation_entailment.every(x=>x.valid)&&m.research.context_boundary.every(x=>x.valid));
 }else assert.equal(m.research,undefined);
}
const yeshivaUnityQuestion='מה נכתב במכתב להנהלת רשת ישיבות הערב על אחדות בין לומדי תורה?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,yeshivaUnityQuestion,{mode});
 assert(m.answerable,mode+': the inspected evening-yeshiva letter must answer the unity question');
 assert(m.sources.some(e=>sourceAID(e)==='5413167'));
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length));
 assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));
 if(mode==='researcher')assert(m.research&&m.research.evidence_map.length>0&&m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));
 else assert.equal(m.research,undefined);
}
const tanyaMarginalQuestion='מה מבארת ההערה על הקשר בין ההתבוננות בפרק מ״ט בתניא לבין הדיבור בדברי תורה?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,tanyaMarginalQuestion,{mode});
 assert(m.answerable,mode+': the inspected marginal response must answer the bounded Tanya question');
 assert(m.sources.some(e=>sourceAID(e)==='5413169'));
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length));
 assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));
 if(mode==='researcher')assert(m.research&&m.research.evidence_map.length>0);
 else assert.equal(m.research,undefined);
}

 

const secretariatLetter=idx.entries.find(e=>e.id==='igrot-kodesh-v13-דשם');
assert(secretariatLetter,'the volume-XIII office letter must remain discoverable');
assert.equal(secretariatLetter.type,'secretariat_letter');
assert.equal(secretariatLetter.source_class,'Secretariat correspondence');
assert.equal(secretariatLetter.author_role,'secretariat');
assert.match(secretariatLetter.primary_secondary_status,/not a direct Rebbe-authored letter/);
const directRebbeAttributionQuestion='מה כתב הרבי על עיסוק במסחר בזמן לימוד בישיבה?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,directRebbeAttributionQuestion,{mode});
 assert(!m.sources.some(e=>e.id==='igrot-kodesh-v13-דשם'),mode+': a secretary-signed office letter must not be attributed to the Rebbe');
 if(m.answerable)assert(m.sources.every(e=>e.author_role!=='secretariat'));
}
const secretariatQuestion='מה נכתב במכתב המזכירות על עיסוק במסחר בזמן לימוד בישיבה?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,secretariatQuestion,{mode});
 assert(m.answerable,mode+': explicitly framed secretariat-letter question must be answerable');
 const s=m.sources.find(e=>e.id==='igrot-kodesh-v13-דשם');
 assert(s&&s.type==='secretariat_letter');
 assert.match(s.primary_secondary_status,/not a direct Rebbe-authored letter/);
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length));
 assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));
 if(mode==='researcher')assert(m.research&&m.research.cases.some(c=>c.witness_class==='secretariat'));
 else assert.equal(m.research,undefined);
}

// Batch 080: seven new inspected Hebrew/Yiddish letters, one existing identity rechecked,
// 25 bounded propositions, and claim-level retrieval in regular/researcher modes.
const batch080Data=JSON.parse(await readFile(new URL('data/items/content-research-batch-080-2026-11-14.json',root)));
const batch080Aids=[4929253,5413540,5413024,5413389,4854607,4754490,4854828];
assert.equal(batch080Data.records.length,7);
assert.equal(batch080Data.source_bodies_inspected,8);
assert.equal(batch080Data.new_source_identities,7);
assert.equal(batch080Data.existing_identities_rechecked,1);
assert.equal(batch080Data.new_response_propositions,25);
assert.equal(batch080Data.records.reduce((n,e)=>n+e.response_propositions.length,0),26,'one later enrichment is stored in the original AID identity');
assert.equal(batch080Data.post_reconciliation_enrichment_count,1);
assert.equal(batch080Data.post_reconciliation_enrichment_batch,'081');
assert.equal(new Set(batch080Data.records.map(e=>e.evidence_family_id)).size,7);
assert.equal(batch080Data.reconciliation_status,'reconciled');
assert.deepEqual(batch080Data.metrics_actual_after,{
 answer_eligible_unique_sources:810,
 content_verified_unique_sources:807,
 answer_eligible_propositions:2660
});
assert.deepEqual(batch080Data.reconciliation_variance,{
 answer_eligible_unique_sources:0,
 content_verified_unique_sources:0,
 answer_eligible_propositions:0
});
for(const aid of batch080Aids){
 const e=idx.entries.find(x=>sourceAID(x)===String(aid));
 assert(e&&e.has_content_evidence,'batch-080 AID '+aid+' must expose inspected body content');
 assert.equal(e.status,'Verified');
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope&&e.witness_provenance);
 assert.equal(e.context_status,'partial');
 assert.equal(e.independent_witness,true);
 assert.equal(e.translation_of_evidence_family_id,null);
 assert.equal(e.canonical_file,'data/items/content-research-batch-080-2026-11-14.json');
 assert(!queue.records.some(q=>String(q.key||'')==='aid:'+aid||String(q.source_url||'').includes('/aid/'+aid+'/')));
}
assert.equal(idx.entries.find(e=>sourceAID(e)==='5413540').language,'Yiddish');
assert.equal(idx.entries.find(e=>sourceAID(e)==='5413024').language,'Yiddish');
assert.equal(idx.entries.find(e=>sourceAID(e)==='5413389').language,'Yiddish');
assert.equal(idx.entries.find(e=>sourceAID(e)==='4754490').language,'Yiddish');
const rechecked5357574=idx.entries.find(e=>sourceAID(e)==='5357574');
assert(rechecked5357574&&rechecked5357574.has_content_evidence,'AID 5357574 remains in its existing Evidence Family');
assert.equal(rechecked5357574.canonical_file,'data/items/content-research-batch-073-2026-11-13.json');

const educationGovernanceQuestion='מה נכתב באגרות על אחריות הנהלות מוסדות חינוך, בחינת תוצאות החינוך, תיקון ליקויים והעמדת החינוך על יסודות תורה ומצוות?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,educationGovernanceQuestion,{mode});
 assert(m.answerable,mode+': education-governance sources must support a bounded multi-source answer');
 assert(m.sources.some(e=>sourceAID(e)==='4929253'));
 assert(m.sources.some(e=>sourceAID(e)==='5413540'));
 assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=2);
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length));
 assert(m.citation_entailment.every(x=>x.valid));
 assert(m.context_boundary.every(x=>x.valid));
 if(mode==='researcher'){
  assert(m.research&&m.research.evidence_families>=2);
  assert(m.research.evidence_map.length>0&&m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));
  assert(m.research.citation_entailment.every(x=>x.valid)&&m.research.context_boundary.every(x=>x.valid));
 }else assert.equal(m.research,undefined);
}
const yeshivaExpansionQuestion='מה נכתב באגרות על הרחבת החינוך הישיבתי, קליטת תלמידים נוספים, הפצת תורה ותמיכת הציבור בישיבות?';
assert(understandQuestion(yeshivaExpansionQuestion).topics.includes('הרחבת ישיבה'),'yeshiva expansion phrasing must resolve to the enrollment topic');
const yeshivaAdmissionWitness=idx.entries.find(e=>sourceAID(e)==='4754490');
assert(yeshivaAdmissionWitness&&yeshivaAdmissionWitness.has_content_evidence&&yeshivaAdmissionWitness.language==='Yiddish','the inspected Yiddish Boston yeshiva letter must remain indexed as its own witness');
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,yeshivaExpansionQuestion,{mode});
 assert(m.answerable,mode+': yeshiva expansion sources must support a bounded multi-source answer');
 assert(m.sources.some(e=>sourceAID(e)==='5413024'));
 assert(m.sources.some(e=>sourceAID(e)==='4754490'));
 assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=2);
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length));
 assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));
 if(mode==='researcher'){
  assert(m.research&&m.research.evidence_families>=2);
  assert(m.research.evidence_map.length>0&&m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));
 }else assert.equal(m.research,undefined);
}
const vocationalSchoolQuestion='מה נכתב באיגרת על בית ספר למלאכה, היחס בין לימודי מלאכה ללימודי קודש ותנאי קבלה?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,vocationalSchoolQuestion,{mode});
 assert(m.answerable,mode+': the vocational-school letter must support a bounded answer');
 assert(m.sources.some(e=>sourceAID(e)==='4854607'));
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length));
 assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));
 if(mode==='researcher')assert(m.research&&m.research.evidence_map.length>0);
 else assert.equal(m.research,undefined);
}



// Batch 081: nine new inspected Hebrew letters, one in-place enrichment,
// explicit excerpt/provenance boundaries, and claim-level multi-family synthesis.
const batch081Data=JSON.parse(await readFile(new URL('data/items/content-research-batch-081-2026-11-14.json',root)));
const batch081Path='data/items/content-research-batch-081-2026-11-14.json';
const batch081Aids=[5099914,5356971,4812730,4994319,5099977,5019597,5019603,4928859,4783811];
assert.equal(batch081Data.records.length,9);
assert.equal(batch081Data.source_bodies_inspected,10);
assert.equal(batch081Data.reviewed_item_count,10);
assert.equal(batch081Data.new_source_identities,9);
assert.equal(batch081Data.existing_identities_enriched,1);
assert.equal(batch081Data.new_response_propositions,23);
assert.equal(batch081Data.existing_response_propositions_added,1);
assert.equal(batch081Data.records.reduce((n,e)=>n+e.response_propositions.length,0),23);
assert.equal(new Set(batch081Data.records.map(e=>e.aid)).size,9);
assert.equal(new Set(batch081Data.records.map(e=>e.evidence_family_id)).size,9);
assert.equal(new Set(batch081Data.records.map(e=>e.source_url)).size,9);
assert.equal(batch081Data.records.filter(e=>e.witness.complete_partial==='partial').length,4);
assert.equal(batch081Data.records.filter(e=>e.context_status==='partial').length,9);
assert.equal(batch081Data.blocked_candidate_count,8);
assert.equal(batch081Data.blocked_candidates.length,8);
assert.equal(batch081Data.crawler_retry,false);
assert.equal(batch081Data.access_control_bypassed,false);
assert.equal(batch081Data.full_text_copied,false);
assert.equal(batch081Data.existing_identity_updates.length,1);
assert.equal(batch081Data.metrics_before.answer_eligible_unique_sources,810);
assert.equal(batch081Data.metrics_before.content_verified_unique_sources,807);
assert.equal(batch081Data.metrics_before.answer_eligible_propositions,2660);
assert.deepEqual(batch081Data.metrics_expected_after,{
 answer_eligible_unique_sources:819,
 content_verified_unique_sources:816,
 answer_eligible_propositions:2684
});
assert.equal(batch081Data.reconciliation_status,'superseded_by_batch_082');
assert.equal(batch081Data.superseded_by_batch,'082');
assert.equal(batch081Data.metrics_actual_after,null);
assert.equal(batch081Data.reconciliation_variance,null);
assert.equal(batch082Data.metrics_before.answer_eligible_unique_sources,819);
assert.equal(batch082Data.metrics_before.content_verified_unique_sources,816);
assert.equal(batch082Data.metrics_before.answer_eligible_propositions,2684);
assert.equal(batch082Data.reconciliation_status,'reconciled_with_variance');
assert.deepEqual(batch082Data.metrics_actual_after,{answer_eligible_unique_sources:829,content_verified_unique_sources:826,answer_eligible_propositions:2706});
assert.deepEqual(batch082Data.reconciliation_variance,{answer_eligible_unique_sources:-1,content_verified_unique_sources:-1,answer_eligible_propositions:-3});
for(const record of batch081Data.records){
 const aid=String(record.aid),e=idx.entries.find(x=>sourceAID(x)===aid);
 assert(e&&e.has_content_evidence,'batch-081 AID '+aid+' must expose inspected body content');
 assert.equal(e.status,'Verified');
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope&&e.witness_provenance);
 assert.equal(e.context_status,'partial');
 if(aid==='5019603'){
  assert.equal(e.independent_witness,false);
  assert.equal(e.witness_type,'publisher_text_completed_from_photograph');
  assert.equal(e.translation_of_evidence_family_id,null);
 }else{
  assert.equal(e.independent_witness,true);
  assert.equal(e.translation_of_evidence_family_id,null);
 }
 assert.equal(e.evidence_family_id,record.evidence_family_id);
 assert.equal(e.canonical_file,batch081Path,'new AID '+aid+' must be selected from the inspected batch after deduplication');
 assert(record.response_propositions.every(p=>e.response_propositions.includes(p)),'all reviewed propositions for AID '+aid+' must survive reconciliation');
 assert.equal(e.response_proposition_locators.length,e.response_propositions.length);
 assert(e.response_proposition_locators.every(Boolean));
 assert(!queue.records.some(q=>String(q.key||'')==='aid:'+aid||String(q.source_url||'').includes('/aid/'+aid+'/')));
}
const enriched4929253=idx.entries.find(e=>sourceAID(e)==='4929253');
assert(enriched4929253&&enriched4929253.response_propositions.some(p=>p.includes('אהבת עצמו')),'existing AID 4929253 must retain its additional inspected proposition');
assert(enriched4929253.response_proposition_locators.some(l=>l.includes('265–266')));
assert.equal(enriched4929253.canonical_file,'data/items/content-research-batch-080-2026-11-14.json');
assert.equal(enriched4929253.evidence_family_id,'igrot-letter-5715-18-elul-gteshpe-aid4929253');
const secretariatExcerpt=idx.entries.find(e=>sourceAID(e)==='4928859');
assert(secretariatExcerpt&&/secretariat/i.test(secretariatExcerpt.witness_type||''),'AID 4928859 must preserve its secretariat-copy provenance');
const sinaiAuthorshipQuestion='מה כתב הרבי על מסורת מעמד הר סיני?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,sinaiAuthorshipQuestion,{mode});
 assert(!m.sources.some(e=>sourceAID(e)==='4928859'),mode+': a secretariat-copy excerpt must not be presented as a direct Rebbe-authored witness');
}
const studyYouthEducationQuestion='מה נכתב באיגרות על לימוד בחברותא, מסירת יהדות לבני נוער והתקדמות הדרגתית?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,studyYouthEducationQuestion,{mode});
 assert(m.answerable,mode+': two inspected correspondence families must support a bounded study/youth-education synthesis');
 assert(m.sources.some(e=>sourceAID(e)==='5019597'),mode+': personal chavruta-study letter must be retained');
 assert(m.sources.some(e=>sourceAID(e)==='5019603'),mode+': youth-education letter must be retained');
 assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=2);
 assert(m.synthesis&&m.synthesis.topic==='study_and_youth_education');
 assert(m.pattern_synthesis_integrity?.valid===true,mode+': study/youth synthesis must pass topic-specific integrity while preserving the non-independent photo-completed text');
 assert.equal(m.synthesis.attribution,'system_synthesis_not_rebbe_quote');
 assert(m.synthesis.claims.length>=2&&m.synthesis.claims.every(c=>c.source_numbers.length&&c.source_locators.length),mode+': each synthesis claim must carry its own item-level locator');

  const photoCompletedBasis=m.synthesis.basis.find(b=>String(b.aid)==='5019603');
  assert(photoCompletedBasis&&photoCompletedBasis.independent_witness===false&&photoCompletedBasis.witness_status==='publisher_text_completed_from_photograph_not_independent');
  assert(m.synthesis.limits.some(x=>x.includes('5019603')&&x.includes('לא-עצמאי')&&x.includes('צילום')));
  if(mode==='researcher')assert(m.research&&m.research.evidence_families>=2,'researcher mode must retain both item families while preserving the non-independent witness flag'); const studyClaim=m.synthesis.claims.find(c=>c.topic==='study_with_chavruta');
 const youthClaim=m.synthesis.claims.find(c=>c.topic==='youth_education_and_gradual_practice');
 assert(studyClaim&&studyClaim.source_numbers.some(n=>sourceAID(m.sources[n-1])==='5019597'));
 assert(youthClaim&&youthClaim.source_numbers.some(n=>sourceAID(m.sources[n-1])==='5019603'));
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length));
 assert(m.citation_entailment.every(x=>x.valid),mode+': citations must entail their own claims');
 assert(m.context_boundary.every(x=>x.valid),mode+': circumstances and limits must remain witness-local');
 if(mode==='researcher'){
  assert(m.research&&m.research.evidence_families>=2);
  assert(m.research.evidence_map.length>0&&m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));
  assert(m.research.witnesses.some(w=>w.proposition_source_locator&&w.verification_scope));
  assert(m.research.citation_entailment.every(x=>x.valid)&&m.research.context_boundary.every(x=>x.valid));
 }else assert.equal(m.research,undefined);
}

// Batch 086: source-grounded Living Torah synopsis propositions, deduplication and deep researcher locators.
const batch086Aids=['3902044','490071','796411','3908661','4477456','2755550','318996','3789070','4057736','3507813','1203574','675648','3256519','363474'];
assert.equal(batch086Data.records.length,1,'batch 086 must add exactly one new source identity');
assert.equal(batch086Data.records[0].aid,363474);
assert.equal(batch086Data.existing_identity_updates.length,13,'batch 086 must enrich 13 existing identities in place');
assert.equal(batch086Data.source_bodies_inspected,15,'15 item-level bodies must be inspected');
assert.equal(batch086Data.reviewed_item_count,17,'metadata-only and withheld pages must be accounted for');
assert.equal(batch086Data.answer_eligible_source_families_added,14);
assert.equal(batch086Data.new_response_propositions,1);
assert.equal(batch086Data.existing_response_propositions_added,13);
assert.equal(batch086Data.total_new_paraphrase_entries,14);
assert.equal(batch086Data.metrics_before.answer_eligible_unique_sources,855);
assert.equal(batch086Data.metrics_expected_after.answer_eligible_unique_sources,869);
assert.equal(batch086Data.metrics_expected_after.content_verified_unique_sources,852,'publisher synopses must not inflate content-verified');
assert.equal(batch086Data.metrics_expected_after.answer_eligible_propositions,2781);
assert.equal(batch086Data.reconciliation_status,'reconciled');
assert.deepEqual(batch086Data.reconciliation_variance,{answer_eligible_unique_sources:0,content_verified_unique_sources:0,answer_eligible_propositions:0});
assert.deepEqual(batch086Data.metrics_actual_after,{answer_eligible_unique_sources:869,content_verified_unique_sources:852,answer_eligible_propositions:2781});
const batch086Entries=batch086Aids.map(aid=>idx.entries.find(e=>sourceAID(e)===aid));
assert(batch086Entries.every(Boolean),'all 14 batch 086 AIDs must be present in the public index');
for(const e of batch086Entries){
 assert.equal(e.answer_eligible,true,'publisher synopsis proposition must be answer eligible only within its explicit scope');
 assert.equal(e.status,'Parsed','publisher synopsis must not be promoted to Verified');
 assert.equal(e.has_content_evidence,true);
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope);
 assert.equal(e.independent_witness,false,'publisher synopsis is not an independent transcript witness');
 assert.match(e.primary_secondary_status||'',/Secondary publisher synopsis/);
}
assert.equal(new Set(batch086Entries.map(e=>e.evidence_family_id)).size,14,'each distinct item AID must retain its own Evidence Family');
assert.equal(idx.entries.filter(e=>sourceAID(e)==='3789070').length,1,'archive-day alias and direct item page must resolve to one indexed identity');
assert.equal(idx.entries.find(e=>sourceAID(e)==='3789070').canonical_file,'data/items/living-torah-aid-3789070.json');
const held387881=idx.entries.find(e=>sourceAID(e)==='387881');
assert(held387881&&!held387881.answer_eligible&&held387881.date_precision==='unknown','conflicting-date item must remain non-answerable');
assert(queue.records.some(e=>String(e.aid||'')==='387881'||String(e.key||'').endsWith('387881')),'date-conflict item must remain in the review queue');
assert(queue.records.every(e=>!batch086Aids.includes(String(e.aid||''))&&!batch086Aids.some(a=>String(e.key||'').endsWith(a))),'answer-eligible batch 086 items must leave the review queue');
// Current metrics are checked against the live normalized index at the top of this test; historical batch totals must not be compared with today's corpus.
const queenQuestion='מה מתעד תקציר Living Torah על אסתר המלכה, הדסה וגאווה יהודית?';
const queenModel=buildAnswerModel(idx.entries,queenQuestion,{mode:'regular'});
assert(queenModel.answerable&&queenModel.sources.some(e=>sourceAID(e)==='363474'));
assert(queenModel.claims.length>0&&queenModel.claims.every(c=>c.source_numbers.length&&c.source_locators.length));
assert(queenModel.citation_entailment.every(x=>x.valid)&&queenModel.context_boundary.every(x=>x.valid));
const multiQuestion='מה מתעדים תקצירי Living Torah על גאווה יהודית, מעשי טוב וחסד והפצת יהדות בסביבה הקרובה?';
const multiUnderstanding=understandQuestion(multiQuestion);
assert(!multiUnderstanding.topics.includes('רופא מצליח וגאווה'),'generic Jewish pride must not select the doctor-success topic without a doctor context');
assert(understandQuestion('מה מתואר על רופא מצליח וגאווה?').topics.includes('רופא מצליח וגאווה'),'explicit doctor context should retain the doctor-success topic');
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,multiQuestion,{mode});
 assert(m.answerable,mode+': multi-source publisher-synopsis query should be answerable within source scope');
 for(const aid of ['363474','490071','318996'])assert(m.sources.some(e=>sourceAID(e)===aid),mode+': required source '+aid+' must be retrieved');
 assert(m.claims.length>=3&&m.claims.every(claim=>claim.source_numbers.length&&claim.source_locators.length));
 assert(m.citation_entailment.every(x=>x.valid),mode+': each claim citation must entail that claim');
 assert(m.context_boundary.every(x=>x.valid),mode+': context must remain witness-local');
 if(mode==='researcher'){
  assert.equal(m.research.depth,'deep');
  assert(m.research.evidence_witnesses.length>=3);
  assert(m.research.evidence_witnesses.every(w=>w.proposition_source_locator&&w.verification_scope&&w.primary_secondary_status));
  assert.equal(m.research.claim_source_map.length,m.claims.length);
  assert(m.research.evidence_integrity.publisher_synopsis_witnesses>=3);
  assert(m.research.synthesis_constraints.non_independent_sources>=3);
  assert(!m.synthesis&&!m.research.pattern_synthesis,'secondary synopsis-only sources must not be turned into a general Rebbe teaching synthesis');
 }else assert.equal(m.research,undefined);
}
const batch086Ui=await readFile(new URL('index.html',root),'utf8');
assert(batch086Ui.includes('מיפוי טענות והפניות')&&batch086Ui.includes('מיקום הטענה')&&batch086Ui.includes('claim_source_map'),'researcher UI must expose claim-level source locators');



// Regression guard: AID 1875534 must be eligible after body inspection; translation/photo-only items remain Parsed and non-independent.
// Batch 088: ten new source identities, two duplicate/translation aliases, three existing identities enriched.
const batch088Path='data/items/content-research-batch-088-2026-11-15.json';
const batch088Data=JSON.parse(await readFile(new URL(batch088Path,root)));
assert.equal(batch088Data.batch_id,'088');
assert.equal(batch088Data.records.length,12);
assert.equal(batch088Data.reviewed_item_count,13);
assert.equal(batch088Data.source_bodies_inspected,13);
assert.equal(batch088Data.new_source_identities,10);
assert.equal(batch088Data.duplicate_alias_identities,2);
assert.equal(batch088Data.existing_identities_enriched,3);
assert.equal(batch088Data.new_response_propositions,20);
assert.equal(batch088Data.existing_response_propositions_added,1);
assert.equal(batch088Data.existing_response_propositions_promoted_to_answer_eligible,5);
assert.equal(batch088Data.records.reduce((n,e)=>n+e.response_propositions.length,0),20);
assert.equal(batch088Data.records.filter(e=>e.status==='Verified').length,2);
assert.equal(batch088Data.records.filter(e=>e.status==='Parsed').length,8);
assert.equal(batch088Data.records.filter(e=>e.status==='Linked').length,2);
assert.equal(batch088Data.records.filter(e=>e.independent_witness===true).length,7);
assert.equal(batch088Data.records.filter(e=>e.independent_witness===false).length,5);
assert.equal(batch088Data.records.filter(e=>e.translation_of_evidence_family_id).length,1);
assert.equal(batch088Data.records.filter(e=>e.author_role==='secretariat').length,1);
assert.equal(batch088Data.records.filter(e=>e.type==='marginal_response').length,1);
assert.equal(batch088Data.records.filter(e=>e.type==='public_letter').length,1);
assert.equal(batch088Data.answer_eligible_source_families_added,11);
assert.equal(batch088Data.independent_witnesses_added,7);
assert.equal(batch088Data.non_independent_presentations_added,3);
assert.equal(batch088Data.content_verified_unique_sources_added,3);
assert.equal(batch088Data.content_verified_unique_sources_downgraded,2);
assert.equal(batch088Data.content_verified_unique_sources_net_change,1);
assert.equal(batch088Data.translation_manifestations_linked,1);
assert.equal(batch088Data.source_type_distribution.published_hebrew_letter_text,7);
assert.equal(batch088Data.source_type_distribution.published_hebrew_marginal_response_excerpt,1);
assert.equal(batch088Data.source_type_distribution.published_yiddish_public_letter_excerpt,1);
assert.equal(batch088Data.source_type_distribution.published_hebrew_secretariat_signed_response,1);
assert.equal(batch088Data.blocked_candidate_count,10);
assert.equal(batch088Data.fallback_source_attempted,true);
assert.equal(batch088Data.crawler_retry,false);
assert.equal(batch088Data.access_control_bypassed,false);
assert.equal(batch088Data.full_text_copied,false);
assert.equal(batch088Data.scan_only_verification_used_for_content,false);
assert.deepEqual(batch088Data.metrics_before,{answer_eligible_unique_sources:876,content_verified_unique_sources:852,answer_eligible_propositions:2797});
assert.deepEqual(batch088Data.metrics_expected_after,{answer_eligible_unique_sources:887,content_verified_unique_sources:853,answer_eligible_propositions:2823});
assert.equal(batch088Data.reconciliation_status,'reconciled_with_variance');
assert.deepEqual(batch088Data.metrics_actual_after,{answer_eligible_unique_sources:886,content_verified_unique_sources:852,answer_eligible_propositions:2818});
assert.deepEqual(batch088Data.reconciliation_variance,{answer_eligible_unique_sources:-1,content_verified_unique_sources:-1,answer_eligible_propositions:-5});
for(const r of batch088Data.records){
 if(r.status==='Linked'){
  assert.equal(r.has_content_evidence,false);assert.equal(r.response_propositions.length,0);
  const existing=idx.entries.find(x=>String(x.source_url||'')===String(r.source_url));
  assert(existing,'linked batch-088 alias must resolve to an existing canonical source');
  assert.equal(existing.evidence_family_id,r.evidence_family_id);
  assert.notEqual(existing.canonical_file,batch088Path);
  if(r.id==='chabadlibrary-1200710552'){
   assert.equal(existing.original_language,'Russian');assert.equal(existing.independent_witness,false);
   assert.equal(r.translation_of_evidence_family_id,r.evidence_family_id);
  }
  if(r.id==='chabadlibrary-1200710429'){
   assert.equal(existing.status,'Parsed');assert.equal(existing.independent_witness,false);
   assert.match(existing.primary_secondary_status,/photograph/i);
  }
  continue;
 }
 const e=idx.entries.find(x=>x.id===r.id);
 assert(e&&e.has_content_evidence,'batch-088 source '+r.id+' must have inspected text content');
 assert.equal(e.canonical_file,batch088Path);
 assert.equal(e.status,r.status);
 assert.equal(e.evidence_family_id,r.evidence_family_id);
 assert.equal(e.response_propositions.length,2);
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope&&e.provenance);
 assert.equal(e.response_proposition_locators.length,2);
 assert(e.response_proposition_locators.every(Boolean));
 assert.equal(e.context_status,'partial');
 assert.equal(e.translation_of_evidence_family_id,null);
 assert(!queue.records.some(q=>String(q.source_url||'')===String(e.source_url)),'batch-088 source '+r.id+' must leave the review queue');
}
const yiddish088=idx.entries.find(e=>e.id==='chabadlibrary-1200710378');
assert(yiddish088&&yiddish088.language==='Yiddish'&&yiddish088.original_language==='Yiddish');
assert.equal(yiddish088.independent_witness,true);
const marginal088=idx.entries.find(e=>e.id==='chabadlibrary-1200710132');
assert(marginal088&&marginal088.type==='marginal_response'&&marginal088.independent_witness===false);
const copy088=idx.entries.find(e=>e.id==='chabadlibrary-1200980070');
assert(copy088&&copy088.independent_witness===false&&/copy/i.test(copy088.primary_secondary_status||''));
const direct5412963=idx.entries.find(e=>sourceAID(e)==='5412963');
assert(direct5412963&&direct5412963.status==='Verified'&&Array.isArray(direct5412963.response_proposition_locators)&&direct5412963.response_proposition_locators.some(l=>l.includes('245–249')),'AID 5412963 must retain its item-level body locator after the proposition was split into bounded ranges');
const secretariat088=idx.entries.find(e=>sourceAID(e)==='5413093');
assert(secretariat088&&secretariat088.type==='secretariat_letter'&&secretariat088.author_role==='secretariat');
assert.match(secretariat088.primary_secondary_status,/not a direct Rebbe-authored letter/);
const enriched1875534b=idx.entries.find(e=>sourceAID(e)==='1875534');
assert(enriched1875534b&&enriched1875534b.has_content_evidence===true&&enriched1875534b.response_propositions.length===6);
assert.equal(enriched1875534b.independent_witness,false);
assert(enriched1875534b.response_proposition_locators.some(l=>l.includes('288–290')));
const translated0552=idx.entries.find(e=>String(e.source_url||'').endsWith('/1200710552'));
assert(translated0552&&translated0552.original_language==='Russian'&&translated0552.status==='Parsed'&&translated0552.independent_witness===false);
const photo0429=idx.entries.find(e=>String(e.source_url||'').endsWith('/1200710429'));
assert(photo0429&&photo0429.status==='Parsed'&&photo0429.independent_witness===false);

const batch088Queries=[
 ['מה כתב הרבי למחנך על השפעת החינוך לאחר שהתלמידים עוזבים את המסגרת?','chabadlibrary-1200890083'],
 ['מה נכתב במכתב הכללי ביידיש על מאמץ, עשייה והישגים?','chabadlibrary-1200710378'],
 ['מה נכתב במכתב המזכירות ח׳שמה על כיסוי הראש לפני החתונה?','chabad-secretariat-letter-5413093'],
 ['מה נכתב באיגרת ח׳שדמ על שילוב בני נוער שאמם אינה יהודייה?','chabad-letter-5412963']
];
for(const [q,id] of batch088Queries)for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,q,{mode});
 assert(m.answerable,mode+': batch-088 inspected source must answer '+q);
 assert(m.sources.some(e=>e.id===id),mode+': expected batch-088 source '+id);
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length),mode+': every batch-088 claim needs source numbers');
 assert(m.citation_entailment.every(x=>x.valid),mode+': batch-088 citations must entail their claims');
 assert(m.context_boundary.every(x=>x.valid),mode+': batch-088 claims must preserve source context');
 if(mode==='researcher'){
  assert.equal(m.research.depth,'deep');
  assert(m.research.evidence_map.length>0);
  assert(m.research.claim_source_map.length===m.claims.length);
  assert(m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));
 }else assert.equal(m.research,undefined);
}
const directAttributionHeadCover='מה כתב הרבי על כיסוי הראש לפני החתונה?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,directAttributionHeadCover,{mode});
 assert(!m.sources.some(e=>sourceAID(e)==='5413093'),mode+': a secretary-signed response must not be attributed directly to the Rebbe');
}
assert.equal(acquisitionState.manual_web_review.crawler_retry,false);
assert.deepEqual(readinessMetrics(acquisitionState.manual_web_review.metrics_actual_after),readinessMetrics(metrics));


// Batch 089: fourteen existing Living Torah identities gain bounded publisher-synopsis evidence; none becomes Verified or independent.
const batch089Aids=['335482','2889264','4525544','2349222','281313','363469','2606412','2946206','702100','1974202','4547216','2316185','2920438','4469446'];
assert.equal(batch089Data.records.length,0);
assert.equal(batch089Data.source_bodies_inspected,14);
assert.equal(batch089Data.existing_identities_enriched,14);
assert.equal(batch089Data.existing_identities_rechecked,1);
assert.equal(batch089Data.new_source_identities,0);
assert.equal(batch089Data.existing_response_propositions_added,14);
assert.equal(batch089Data.answer_eligible_source_families_added,14);
assert.equal(batch089Data.blocked_candidate_count,8);
assert.equal(batch089Data.translations_counted_as_independent_witnesses,0);
assert.equal(new Set(batch089Data.enriched_aids.map(String)).size,14);
assert.equal(new Set(batch089Data.existing_identity_updates.map(x=>x.identity)).size,14);
assert.deepEqual(batch089Data.metrics_expected_after,{answer_eligible_unique_sources:900,content_verified_unique_sources:852,answer_eligible_propositions:2832});
assert(['reconciled','reconciled_with_variance'].includes(batch089Data.reconciliation_status));
assert.equal(batch089Data.status,batch089Data.reconciliation_status);
assert(batch089Data.metrics_actual_after,'batch 089 must retain measured canonical after-metrics');
const batch089Actual=readinessMetrics(batch089Data.metrics_actual_after);
const batch089MeasuredVariance={answer_eligible_unique_sources:batch089Actual.answer_eligible_unique_sources-batch089Data.metrics_expected_after.answer_eligible_unique_sources,content_verified_unique_sources:batch089Actual.content_verified_unique_sources-batch089Data.metrics_expected_after.content_verified_unique_sources,answer_eligible_propositions:batch089Actual.answer_eligible_propositions-batch089Data.metrics_expected_after.answer_eligible_propositions};
assert.deepEqual(batch089Data.reconciliation_variance,batch089MeasuredVariance,'batch 089 must preserve measured variance from its historical projection rather than forcing zero');
assert.equal(batch089Data.reconciliation_status,Object.values(batch089MeasuredVariance).every(v=>v===0)?'reconciled':'reconciled_with_variance');
assert.equal(batch089Data.existing_identity_rechecks[0].aid,4057736,'AID 4057736 was already enriched in batch 086 and must not be duplicated');
assert(!batch089Aids.includes('4057736'));
assert(!batch089Aids.includes('1558542'),'mismatched archive segment AID 1558542 must not be relabelled as the queued Kfar Chabad item');
assert.equal(new Set(batch089Data.existing_identity_updates.map(x=>x.id)).size,14);
for(const aid of batch089Aids){
 const matches=idx.entries.filter(e=>sourceAID(e)===aid);
 assert.equal(matches.length,1,'batch-089 AID '+aid+' must have exactly one indexed canonical identity');
 const e=matches[0];
 assert(e.has_content_evidence,'batch-089 AID '+aid+' must be answer eligible');
 assert.equal(e.canonical_file,'data/items/bulk-indexed-2026-09-25-001.json');
 assert.equal(e.status,'Parsed');
 assert.equal(e.canonical_status,'Parsed');
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.proposition_source_locator.includes('AID '+aid));
 assert.equal(e.response_propositions.length,1);
 assert.equal(e.response_proposition_locators.length,1);
 assert(e.verification_scope.includes('תקציר')&&e.verification_scope.includes('לא נבדקו'));
 assert.equal(e.independent_witness,false);
 assert.match(e.primary_secondary_status,/Secondary publisher synopsis/);
 assert(!queue.records.some(q=>q.id===e.id),'batch-089 reviewed item '+e.id+' must leave the content review queue');
}
assert.equal(new Set(batch089Aids.map(a=>idx.entries.find(e=>sourceAID(e)===a).evidence_family_id)).size,14);
const batch089MultiSourceQuery='מה מתעדים שני תקצירי Living Torah על שיחתו של שלמה גזית בנוגע למסירת חלקים מארץ ישראל ועל שלמות הארץ, שלמות העם ושלמות התורה?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,batch089MultiSourceQuery,{mode});
 assert(m.answerable,mode+': batch-089 multi-item synopsis retrieval must remain answerable as separate cases');
 assert(m.sources.some(e=>sourceAID(e)==='281313'),mode+': expected Shlomo Gazit item-level source');
 assert(m.sources.some(e=>sourceAID(e)==='4469446'),mode+': expected integrity-of-land/people/Torah item-level source');
 assert.equal(m.synthesis?.topic,'living_torah_integrity_comparison',mode+': bounded comparison topic');
 assert.equal(m.synthesis?.attribution,'system_synthesis_not_rebbe_quote',mode+': system synthesis is not a Rebbe quotation');
 assert.deepEqual(m.synthesis?.independent_evidence_family_ids,[],mode+': publisher synopses are not independent witnesses');
 assert(m.sources.every(e=>e.independent_witness===false),mode+': both publisher synopses remain non-independent');
 assert(m.claims.length>=2&&m.claims.every(c=>c.source_numbers.length),mode+': separate claims must have source numbers');
 assert(m.citation_entailment.every(x=>x.valid),mode+': every claim must be entailed by its own publisher synopsis');
 assert(m.context_boundary.every(x=>x.valid),mode+': circumstances and limitations must stay witness-local');
 if(mode==='researcher'){
  assert.equal(m.research.depth,'deep');
  assert(m.research.evidence_witnesses.length>=2);
  assert.equal(m.research.claim_source_map.length,m.claims.length);
  assert(m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));
  assert(m.research.synthesis_constraints.non_independent_sources>=2);
  assert(m.research.synthesis_constraints.publisher_synopsis_sources>=2);
  assert(m.research.evidence_witnesses.some(w=>String(w.aid)==='281313'));
  assert(m.research.evidence_witnesses.some(w=>String(w.aid)==='4469446'));
  assert.match(m.research.synthesis_constraints.rule,/Publisher synopses/);
 }else assert.equal(m.research,undefined);
}


const batch161Aids=batch161Data.new_aids.map(String);
assert.equal(batch161Data.records.length,10);assert.equal(batch161Data.new_source_identities,10);assert.equal(batch161Data.new_response_propositions,10);assert.equal(batch161Data.answer_eligible_source_families_added,10);assert.equal(batch161Data.content_verified_unique_sources_added,0);assert.equal(batch161Data.blocked_candidate_count,1);assert.equal(batch161Data.crawler_retry,false);assert.equal(batch161Data.access_control_bypassed,false);assert.equal(batch161Data.full_text_copied,false);assert.equal(batch161Data.scan_only_verification_used,false);assert.equal(batch161Data.translations_counted_as_independent_witnesses,0);
assert.equal(new Set(batch161Aids).size,10);assert.equal(new Set(batch161Data.records.map(r=>r.evidence_family_id)).size,10);assert.deepEqual(new Set(batch161Aids),new Set(['528576','528577','528578','528579','528580','528581','528582','528583','528584','528585']));
assert.equal(batch161Data.source_body_review.length,10);assert(batch161Data.source_body_review.every(x=>x.body_text_inspected&&x.inspected_original_language_body&&x.inspection_method==='public_web_open_body'));assert.equal(batch161Data.source_body_review.filter(x=>x.language==='Yiddish').length,7);assert.equal(batch161Data.source_body_review.filter(x=>x.language==='Hebrew').length,3);
for(const r of batch161Data.records){const aid=String(r.aid),e=idx.entries.find(x=>sourceAID(x)===aid);assert(e&&e.has_content_evidence,'batch161 AID '+aid+' must appear as answer-eligible after reconciliation');assert.equal(e.canonical_file,batch161Path);assert.equal(e.status,'Parsed');assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');assert(e.proposition_source_locator&&e.proposition_source_locator.includes('AID '+aid));assert.equal(e.response_proposition_locators.length,e.response_propositions.length);assert.equal(e.independent_witness,true);assert.equal(e.evidence_family_id,r.evidence_family_id);assert(!Object.hasOwn(r,'body_text_inspected')&&!Object.hasOwn(r,'inspection_method'),'audit-only inspection flags belong in source_body_review, not canonical source records');}
assert(['reconciled','reconciled_with_variance'].includes(batch161Data.reconciliation_status),'batch161 must have completed canonical reconciliation before readiness passes');assert(batch161Data.metrics_actual_before&&batch161Data.metrics_actual_after,'batch161 must retain measured canonical before/after metrics');

const batch162Aids=batch162Data.new_aids.map(String);
assert.equal(batch162Data.records.length,16);
assert.equal(batch162Data.reviewed_item_count,16);
assert.equal(batch162Data.source_bodies_inspected,16);
assert.equal(batch162Data.new_source_identities,16);
assert.equal(batch162Data.new_response_propositions,19);
assert.equal(batch162Data.answer_eligible_source_families_added,16);
assert.equal(batch162Data.independent_witnesses_added,15);
assert.equal(batch162Data.non_independent_presentations_added,1);
assert.equal(batch162Data.content_verified_unique_sources_added,0);
assert.equal(batch162Data.blocked_candidate_count,5);
assert.equal(batch162Data.crawler_retry,false);
assert.equal(batch162Data.access_control_bypassed,false);
assert.equal(batch162Data.full_text_copied,false);
assert.equal(batch162Data.scan_only_verification_used,false);
assert.equal(batch162Data.translations_counted_as_independent_witnesses,0);
assert.equal(new Set(batch162Aids).size,16);
assert.equal(new Set(batch162Data.records.map(r=>r.evidence_family_id)).size,16);
assert.deepEqual(new Set(batch162Aids),new Set(['528587','528588','528590','528591','528592','528593','528594','528596','528597','528598','528599','528600','528601','528602','528603','5920875']));
assert.equal(batch162Data.source_body_review.length,16);
assert(batch162Data.source_body_review.every(x=>x.body_text_inspected&&x.inspection_method==='public_web_open_body'));
assert.equal(batch162Data.source_body_review.filter(x=>x.language==='Hebrew').length,8);
assert.equal(batch162Data.source_body_review.filter(x=>x.language==='Yiddish').length,5);
assert.equal(batch162Data.source_body_review.filter(x=>x.language==='Hebrew and Yiddish').length,2);
assert.equal(batch162Data.source_body_review.filter(x=>x.language==='English').length,1);
assert.equal(batch162Data.source_body_review.filter(x=>x.inspected_original_language_body).length,15);
const batch162EnglishRecord=batch162Data.records.find(r=>String(r.aid)==='5920875');
assert.equal(batch162EnglishRecord.independent_witness,false);
assert.equal(batch162EnglishRecord.translation_of_evidence_family_id,batch162EnglishRecord.evidence_family_id);
assert.equal(batch162EnglishRecord.response_propositions.length,2);
assert(batch162Data.records.every(r=>r.status==='Parsed'&&r.context_status==='partial'&&r.proposition_origin==='source_grounded_paraphrase'&&r.proposition_verbatim===false&&r.proposition_verification==='source_text_inspected'&&r.response_proposition_locators.length===r.response_propositions.length));
for(const r of batch162Data.records){const aid=String(r.aid),e=idx.entries.find(x=>sourceAID(x)===aid);assert(e&&e.has_content_evidence,'batch162 AID '+aid+' must appear as answer-eligible after reconciliation');assert.equal(e.canonical_file,batch162Path);assert.equal(e.status,'Parsed');assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');assert(e.proposition_source_locator&&e.proposition_source_locator.includes('AID '+aid));assert.equal(e.response_proposition_locators.length,e.response_propositions.length);assert.equal(e.evidence_family_id,r.evidence_family_id);}
const batch162English=idx.entries.find(e=>sourceAID(e)==='5920875');
assert(batch162English&&batch162English.independent_witness===false&&batch162English.translation_of_evidence_family_id===batch162English.evidence_family_id);
assert.equal(batch162English.status,'Parsed');
assert(batch162English.verification_scope.includes('תרגום')&&batch162English.verification_scope.includes('לא נבדק'));
assert.equal(batch162Data.deduplication_check.full_index_scan_available,true);
assert.equal(batch162Data.deduplication_check.post_addition_canonical_scan_pending,false);
assert.equal(batch162Data.reconciliation_identity_integrity.passed,true);
assert.equal(batch162Data.reconciliation_identity_integrity.canonical_identity_collisions.length,0);
assert.equal(batch162Data.reconciliation_identity_integrity.missing_canonical_identities.length,0);
assert.equal(batch162Data.reconciliation_identity_integrity.all_target_identities_answer_eligible,true);
assert(['reconciled','reconciled_with_variance'].includes(batch162Data.reconciliation_status));
assert(batch162Data.metrics_actual_after,'batch162 must retain measured canonical after-metrics');
const prayerVitalityQuestion='מה מתעדים ערכי היום יום על תפילה, חיות פנימית, שילוב מוח ולב ועבודה מעשית?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,prayerVitalityQuestion,{mode});
 assert(m.answerable,mode+': five-family Hayom Yom prayer/vitality synthesis must be answerable');
 assert.deepEqual(m.sources.map(e=>sourceAID(e)),['528587','528597','528598','528600','528602']);
 assert.equal(m.synthesis?.topic,'hayom_yom_prayer_vitality_community_practice');
 assert.equal(m.synthesis?.attribution,'system_synthesis_not_rebbe_quote');
 assert.equal(m.synthesis?.claims.length,5);
 assert.equal(m.synthesis?.evidence_family_ids.length,5);
 assert(m.claims.length===5&&m.claims.every(c=>c.source_numbers.length===1&&c.source_locators.length===1));
 assert(m.citation_entailment.every(x=>x.valid),mode+': every claim must be entailed by its own item-level proposition');
 assert(m.context_boundary.every(x=>x.valid),mode+': each entry context must remain separate');
 if(mode==='researcher'){
  assert.equal(m.research.depth,'deep');
  assert.equal(m.research.evidence_families,5);
  assert.equal(m.research.independent_evidence_families,5);
  assert.equal(m.research.claim_source_map.length,5);
  assert(m.research.evidence_map.every(c=>c.witnesses.length===1&&c.witnesses[0].proposition_source_locator));
  assert.equal(m.research.pattern_synthesis.topic,'hayom_yom_prayer_vitality_community_practice');
 }else assert.equal(m.research,undefined);
}



const batch163Aids=batch163Data.new_aids.map(String);
assert.equal(batch163Data.batch_id,'163');
assert.equal(batch163Data.records.length,14);
assert.equal(batch163Data.reviewed_item_count,15);
assert.equal(batch163Data.source_bodies_inspected,15);
assert.equal(batch163Data.new_source_identities,14);
assert.equal(batch163Data.existing_identities_enriched,1);
assert.equal(batch163Data.existing_identities_rechecked,1);
assert.equal(batch163Data.new_response_propositions,17);
assert.equal(batch163Data.existing_response_propositions_added,1);
assert.equal(batch163Data.total_new_paraphrase_entries,18);
assert.equal(batch163Data.answer_eligible_source_families_added,14);
assert.equal(batch163Data.independent_witnesses_added,12);
assert.equal(batch163Data.non_independent_presentations_added,2);
assert.equal(batch163Data.content_verified_unique_sources_added,0);
assert.equal(batch163Data.blocked_candidate_count,2);
assert.equal(batch163Data.crawler_retry,false);assert.equal(batch163Data.access_control_bypassed,false);assert.equal(batch163Data.full_text_copied,false);assert.equal(batch163Data.scan_only_verification_used,false);
assert.equal(batch163Data.translations_counted_as_independent_witnesses,0);
assert.deepEqual(new Set(batch163Aids),new Set(['528604','528605','528606','528607','528609','528610','528612','528613','528614','528615','528616','528618','6072','6075']));
assert.equal(new Set(batch163Aids).size,14);
assert.equal(new Set(batch163Data.records.map(r=>r.evidence_family_id)).size,14);
assert.equal(batch163Data.records.reduce((n,r)=>n+r.response_propositions.length,0),17);
assert.equal(batch163Data.source_body_review.length,15);
assert.equal(batch163Data.source_body_review.filter(x=>x.body_text_inspected).length,15);
assert.equal(batch163Data.source_body_review.filter(x=>x.inspected_original_language_body).length,12);
assert.equal(batch163Data.source_body_review.filter(x=>x.language==='English').length,2);
assert.equal(batch163Data.source_body_review.filter(x=>x.existing_identity).length,1);
assert(batch163Data.source_body_review.every(x=>x.web_source_ref&&x.body_locator));
const translated163=batch163Data.records.filter(r=>r.independent_witness===false);
assert.equal(translated163.length,2);
for(const r of translated163){assert.equal(r.translation_of_evidence_family_id,r.evidence_family_id);assert.equal(r.original_language,'Hebrew');assert.equal(r.language,'English');assert.equal(r.access.source_language_body_inspected,false);assert(r.verification_scope.includes('לא נבדק'));}
for(const r of batch163Data.records){assert.equal(r.status,'Parsed');assert.equal(r.pipeline_status,'Parsed');assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);assert.equal(r.proposition_verification,'source_text_inspected');assert(r.proposition_source_locator&&r.provenance&&r.verification_scope&&r.context_status==='partial'&&r.has_content_evidence);assert.equal(r.response_propositions.length,r.response_proposition_locators.length);assert(r.response_proposition_locators.every(Boolean));}
assert.equal(batch163Data.existing_identity_updates.length,1);
assert.equal(batch163Data.existing_identity_updates[0].aid,528545);
assert.equal(batch163Data.existing_identity_updates[0].before,4);
assert.equal(batch163Data.existing_identity_updates[0].after,5);
assert.equal(batch163Data.existing_identity_updates[0].total_propositions_after,5);
assert.deepEqual(batch163Data.blocked_candidates.map(x=>x.aid),[528608,528611]);
assert(batch163Data.blocked_candidates.every(x=>x.handling.includes('תרגום')));
assert(batch163Data.excluded_candidates.some(x=>x.aid===528617));
assert.equal(batch163Data.fallback_source_results.accessible_item_level_bodies,14);
assert.equal(batch163Data.fallback_source_results.non_independent_translation_presentations,2);
assert.equal(batch163Data.deduplication_check.recent_manual_batch_files_checked,13);
assert.equal(batch163Data.deduplication_check.recent_manual_batch_record_rows_checked,121);
assert.equal(batch163Data.deduplication_check.review_queue_records,1022);
assert.equal(batch163Data.deduplication_check.review_queue_matches,0);
assert.equal(batch163Data.deduplication_check.full_index_scan_available,true);
assert.equal(batch163Data.deduplication_check.post_addition_canonical_scan_pending,false);
assert.equal(batch163Data.reconciliation_identity_integrity.passed,true);
assert.equal(batch163Data.reconciliation_identity_integrity.canonical_identity_collisions.length,0);
assert.equal(batch163Data.reconciliation_identity_integrity.missing_canonical_identities.length,0);
assert.equal(batch163Data.reconciliation_identity_integrity.all_target_identities_answer_eligible,true);
assert(['reconciled','reconciled_with_variance'].includes(batch163Data.reconciliation_status));
assert(batch163Data.metrics_actual_after,'batch163 must retain measured canonical after-metrics');
const indexedBatch163=idx.entries.filter(e=>batch163Aids.includes(String(sourceAID(e))));
assert.equal(indexedBatch163.length,14);
assert(indexedBatch163.every(e=>e.answer_eligible&&e.canonical_file===batch163Path));
assert.equal(new Set(indexedBatch163.map(e=>e.evidence_family_id)).size,14);
assert.equal(indexedBatch163.filter(e=>e.independent_witness===false).length,2);
const bodyRefinementQuestion='מה מתעדים ערכי היום יום על אחריות חינוכית, אהבה חסידית, זיכוך הגוף, לימוד רש״י ותפקיד הנשמה?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,bodyRefinementQuestion,{mode});
 assert(m.answerable,mode+': five-family Hayom Yom education/love/body/soul synthesis must be answerable');
 assert.deepEqual(m.sources.map(e=>sourceAID(e)),['528607','528612','528614','528615','528618']);
 assert.equal(m.synthesis?.topic,'hayom_yom_education_love_body_refinement_and_soul_work');
 assert.equal(m.synthesis?.attribution,'system_synthesis_not_rebbe_quote');
 assert.equal(m.synthesis?.claims.length,5);
 assert.equal(m.synthesis?.evidence_family_ids.length,5);
 assert(m.claims.length===5&&m.claims.every(c=>c.source_numbers.length===1&&c.source_locators.length===1&&c.source_locators.every(x=>x.locator)));
 assert(m.citation_entailment.every(x=>x.valid));
 assert(m.context_boundary.every(x=>x.valid));
 if(mode==='researcher'){
  assert.equal(m.research.depth,'deep');
  assert.equal(m.research.evidence_families,5);
  assert.equal(m.research.independent_evidence_families,5);
  assert.equal(m.research.claim_source_map.length,5);
  assert(m.research.evidence_map.length===5&&m.research.evidence_map.every(c=>c.witnesses.length===1&&c.witnesses[0].proposition_source_locator));
  assert(m.synthesis.method.includes('not independent archival corroboration'));
  assert.equal(m.research.pattern_synthesis.topic,'hayom_yom_education_love_body_refinement_and_soul_work');
 }else assert.equal(m.research,undefined);
}


 
// Batch 164: fifteen original-language Adar I Hayom Yom entries, one in-place enrichment, and a five-family deep-researcher route.
const batch164Path='data/items/content-research-batch-164-2026-11-22.json';
const batch164Data=JSON.parse(await readFile(new URL(batch164Path,root),'utf8'));
const batch165Path='data/items/content-research-batch-165-2026-11-22.json';
const batch165Data=JSON.parse(await readFile(new URL(batch165Path,root),'utf8'));
const batch164Aids=Array.from({length:15},(_,i)=>528619+i);
assert.equal(batch164Data.batch_id,'164');assert.equal(batch164Data.records.length,15);assert.deepEqual(batch164Data.new_aids,batch164Aids);
assert.equal(batch164Data.reviewed_item_count,16);assert.equal(batch164Data.source_bodies_inspected,16);assert.equal(batch164Data.source_body_pages_opened,16);
assert.equal(batch164Data.new_source_identities,15);assert.equal(batch164Data.existing_identities_enriched,1);assert.equal(batch164Data.existing_identities_rechecked,1);
assert.equal(batch164Data.new_response_propositions,18);assert.equal(batch164Data.existing_response_propositions_added,1);assert.equal(batch164Data.total_new_paraphrase_entries,19);
assert.equal(batch164Data.answer_eligible_source_families_added,15);assert.equal(batch164Data.independent_witnesses_added,15);assert.equal(batch164Data.non_independent_presentations_added,0);
assert.equal(batch164Data.content_verified_unique_sources_added,0);assert.equal(batch164Data.translations_counted_as_independent_witnesses,0);
assert.deepEqual(batch164Data.language_distribution,{Hebrew:9,Yiddish:4,"Hebrew and Yiddish":2});
assert.equal(batch164Data.records.reduce((n,r)=>n+r.response_propositions.length,0),18);
assert.equal(batch164Data.records.find(r=>Number(r.aid)===528619).response_propositions.length,2);
assert.equal(batch164Data.records.find(r=>Number(r.aid)===528625).response_propositions.length,2);
assert.equal(batch164Data.records.find(r=>Number(r.aid)===528632).response_propositions.length,2);
assert.deepEqual(batch164Data.blocked_candidates.map(x=>x.aid),[4666220]);assert.equal(batch164Data.fallback_source_attempted,true);
assert.equal(batch164Data.fallback_source_results.accessible_item_level_bodies,16);
assert.equal(batch164Data.crawler_retry,false);assert.equal(batch164Data.access_control_bypassed,false);assert.equal(batch164Data.full_text_copied,false);assert.equal(batch164Data.scan_only_verification_used,false);
assert.equal(batch164Data.metrics_actual_after,null);assert.equal(batch164Data.metrics_expected_after,null);
assert.equal(batch164Data.deduplication_check.code_search_exact_aid_queries,15);assert.deepEqual(batch164Data.deduplication_check.code_search_matches,[]);
assert.equal(batch164Data.deduplication_check.review_queue_records,1022);assert.equal(batch164Data.deduplication_check.review_queue_matches,0);
assert.equal(batch164Data.deduplication_check.full_index_scan_available,false);assert.equal(batch164Data.deduplication_check.post_addition_canonical_scan_pending,true);
assert.equal(batch164Data.existing_identity_updates.length,1);assert.equal(batch164Data.existing_identity_updates[0].aid,528545);
assert.equal(batch164Data.existing_identity_updates[0].before,5);assert.equal(batch164Data.existing_identity_updates[0].after,6);
assert.deepEqual(batch164Data.enriched_aids,[528545]);assert.equal(batch164Data.existing_identity_rechecks.length,1);
for(const r of batch164Data.records){
 if(String(r.aid)==='4422924'){
  assert.equal(r.source_class,'Rebbe correspondence translation');assert.equal(r.type,'rebbe_correspondence_letter_translation');
 }else{
  assert.equal(r.source_class,'Hayom Yom');assert.equal(r.type,'hayom_yom_entry');
 }assert.equal(r.status,'Parsed');assert.equal(r.pipeline_status,'Parsed');
 assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);assert.equal(r.proposition_verification,'source_text_inspected');
 assert(r.proposition_source_locator&&r.provenance&&r.verification_scope&&r.context_status==='partial'&&r.has_content_evidence);
 assert.equal(r.response_propositions.length,r.response_proposition_locators.length);assert(r.response_proposition_locators.every(Boolean));
 assert.equal(r.independent_witness,true);assert.equal(r.translation_of_evidence_family_id,null);
 assert(['Hebrew','Yiddish','Hebrew and Yiddish'].includes(r.language));
}
assert.equal(batch164Data.retrieval_synthesis.attribution,'system_synthesis_not_rebbe_quote');
assert.equal(batch164Data.retrieval_synthesis.claim_count,5);assert.equal(batch164Data.retrieval_synthesis.claim_level_source_locators,5);
assert.equal(new Set(batch164Data.retrieval_synthesis.claims.flatMap(c=>c.source_aids)).size,5);
const enriched528545=idx.entries.find(e=>sourceAID(e)==='528545');
assert(enriched528545&&enriched528545.response_propositions.length===6&&enriched528545.evidence_family_id==='hayom-yom-528545-5703');
assert(enriched528545.response_proposition_locators.some(l=>String(l).includes('שורה 168')));
const indexedBatch164=idx.entries.filter(e=>batch164Aids.includes(Number(sourceAID(e))));
assert.equal(indexedBatch164.length,15);assert(indexedBatch164.every(e=>e.answer_eligible&&e.canonical_file===batch164Path));
assert.equal(new Set(indexedBatch164.map(e=>e.evidence_family_id)).size,15);
const batch164Question='מה מתועד בערכי היום יום באדר א׳ על עבודה פנימית, אהבת ישראל, שליחות, תפילה וצדקה?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,batch164Question,{mode});
 assert(m.answerable,mode+': five distinct Adar I Hayom Yom families must support the bounded comparison');
 assert.deepEqual(m.sources.map(e=>sourceAID(e)),['528619','528620','528624','528628','528629']);
 assert.equal(m.synthesis?.topic,'hayom_yom_adar_i_inner_work_community_and_prayer');
 assert.equal(m.synthesis?.attribution,'system_synthesis_not_rebbe_quote');assert.equal(m.synthesis?.claims.length,5);
 assert.equal(new Set(m.synthesis.evidence_family_ids).size,5);
 assert(m.claims.length===5&&m.claims.every(c=>c.source_numbers.length===1&&c.source_locators.length===1&&c.source_locators.every(x=>x.locator)));
 assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));
 if(mode==='researcher'){
  assert(m.research&&m.research.depth==='deep');assert(m.research.evidence_families>=5);assert(m.research.independent_evidence_families>=5);
  assert(m.research.evidence_map.length>=5&&m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));
  assert.equal(m.research.claim_source_map.length,5);
  assert(m.research.claim_source_map.every(c=>c.source_numbers.length===1&&c.source_locators.length>=1&&c.source_locators.every(x=>x.locator)));
  assert(m.research.synthesis_constraints.rule.includes('not independent archival corroboration'));
 }else assert.equal(m.research,undefined);
}
 



 // Batch 165: 11 original-language Hayom Yom entries, one published Hebrew letter, and two existing translations reviewed in place.
 const batch165Aids=[528634,528635,528636,528638,528639,528640,528641,528642,528643,528645,528646,4666220];
 assert.equal(batch165Data.batch_id,'165');assert.equal(batch165Data.records.length,12);assert.deepEqual(batch165Data.new_aids,batch165Aids);
 assert.deepEqual(batch165Data.enriched_aids,[6101,6108]);assert.equal(batch165Data.reviewed_item_count,17);assert.equal(batch165Data.source_bodies_inspected,14);assert.equal(batch165Data.source_body_pages_opened,14);
 assert.equal(batch165Data.new_source_identities,12);assert.equal(batch165Data.existing_identities_enriched,2);assert.equal(batch165Data.existing_identities_rechecked,2);
 assert.equal(batch165Data.new_response_propositions,14);assert.equal(batch165Data.existing_response_propositions_added,0);assert.equal(batch165Data.total_new_paraphrase_entries,14);
 assert.equal(batch165Data.answer_eligible_source_families_added,12);assert.equal(batch165Data.independent_witnesses_added,12);assert.equal(batch165Data.non_independent_presentations_added,0);assert.equal(batch165Data.non_independent_presentations_reviewed,2);
 assert.equal(batch165Data.content_verified_unique_sources_added,0);assert.equal(batch165Data.translations_counted_as_independent_witnesses,0);
 assert.deepEqual(batch165Data.language_distribution,{Hebrew:9,Yiddish:1,"Hebrew and Yiddish":2});
 assert.deepEqual(batch165Data.reviewed_body_language_distribution,{Hebrew:9,Yiddish:1,"Hebrew and Yiddish":2,English:2});
 assert.deepEqual(batch165Data.source_type_distribution,{"Hayom Yom":11,"Letters":1});
 assert.equal(batch165Data.records.reduce((n,r)=>n+r.response_propositions.length,0),14);
 assert.deepEqual(batch165Data.blocked_candidates.map(x=>x.aid),[528637,528644,4666220]);assert.equal(batch165Data.fallback_source_attempted,true);
 assert.equal(batch165Data.fallback_source_results.accessible_item_level_bodies,14);
 assert.equal(batch165Data.fallback_source_results.original_language_body_inspected,12);
 assert.equal(batch165Data.fallback_source_results.english_translation_bodies_inspected,2);
 assert.equal(batch165Data.fallback_source_results.new_translation_presentations_added,0);
 assert.equal(batch165Data.crawler_retry,false);assert.equal(batch165Data.access_control_bypassed,false);assert.equal(batch165Data.full_text_copied,false);assert.equal(batch165Data.scan_only_verification_used,false);
 assert.equal(batch165Data.metrics_actual_after,null);assert.equal(batch165Data.metrics_expected_after,null);
 assert.equal(batch165Data.deduplication_check.code_search_exact_aid_queries,12);assert.deepEqual(batch165Data.deduplication_check.code_search_matches,[]);
 assert.deepEqual(batch165Data.deduplication_check.existing_aids_found,[6101,6108]);
 assert.equal(batch165Data.deduplication_check.review_queue_records,1022);assert.equal(batch165Data.deduplication_check.review_queue_matches,0);
 assert.equal(batch165Data.deduplication_check.canonical_bulk_files_checked,12);assert.equal(batch165Data.deduplication_check.canonical_bulk_records_checked,1328);assert.equal(batch165Data.deduplication_check.canonical_bulk_matches,0);
 assert.equal(batch165Data.deduplication_check.full_index_scan_available,false);assert.equal(batch165Data.deduplication_check.post_addition_canonical_scan_pending,true);
 for(const r of batch165Data.records){
  assert(["Hayom Yom","Letters"].includes(r.source_class));assert.equal(r.status,'Parsed');assert.equal(r.pipeline_status,'Parsed');
  assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);assert.equal(r.proposition_verification,'source_text_inspected');
  assert(r.proposition_source_locator&&r.provenance&&r.verification_scope&&r.context_status==='partial'&&r.has_content_evidence);
  assert.equal(r.response_propositions.length,r.response_proposition_locators.length);assert(r.response_proposition_locators.every(Boolean));
  assert.equal(r.independent_witness,true);assert.equal(r.translation_of_evidence_family_id,null);
 }
 assert.equal(new Set(batch165Data.records.map(r=>r.evidence_family_id)).size,12);
 const indexedBatch165=idx.entries.filter(e=>batch165Aids.includes(Number(sourceAID(e))));
 assert.equal(indexedBatch165.length,12);assert(indexedBatch165.every(e=>e.answer_eligible&&e.canonical_file==='data/items/content-research-batch-165-2026-11-22.json'));
 assert.equal(new Set(indexedBatch165.map(e=>e.evidence_family_id)).size,12);
 assert.equal(indexedBatch165.filter(e=>e.independent_witness===false).length,0);
 const existing6101=batch112Data.records.find(r=>Number(r.aid)===6101),existing6108=batch112Data.records.find(r=>Number(r.aid)===6108);
 assert(existing6101&&existing6108);assert(existing6101.translation_presentations.some(x=>x.language==='English'&&x.body_inspected&&x.independent_witness===false));
 assert(existing6108.translation_presentations.some(x=>x.language==='English'&&x.body_inspected&&x.independent_witness===false));
 assert(existing6101.parallel_language_presentations.some(x=>Number(x.aid)===528637&&!x.body_inspected));
 assert(existing6108.parallel_language_presentations.some(x=>Number(x.aid)===528644&&!x.body_inspected));
 assert.equal(idx.entries.filter(e=>Number(sourceAID(e))===6101).length,1);assert.equal(idx.entries.filter(e=>Number(sourceAID(e))===6108).length,1);
 assert.equal(batch165Data.existing_identity_updates.length,2);assert.equal(batch165Data.translation_presentations_reviewed.length,2);
 assert(batch165Data.source_body_review.some(x=>x.aid===4666220&&x.body_text_inspected&&x.inspection_method==='public_pdf_open_text_extraction'));

const reconciledProjectState=JSON.parse(await readFile(new URL('data/project-state.json',root),'utf8'));
const reconciliationChain=reconciledProjectState.development_recovery.reconciliation_chain;
assert.deepEqual(reconciliationChain.slice(0,12).map(x=>String(x.batch_id)),['099','100','101','102','103','104','105','106','107','108','109','110','111','112']);
assert(reconciliationChain.some(x=>String(x.batch_id)===currentReviewBatchId),'reconciliation history must include the current batch');
const batch099Audit=reconciliationChain.find(x=>String(x.batch_id)==='099');
const batch100Audit=reconciliationChain.find(x=>String(x.batch_id)==='100');
const batch101Audit=reconciliationChain.find(x=>String(x.batch_id)==='101');
const batch102Audit=reconciliationChain.find(x=>String(x.batch_id)==='102');
const batch103Audit=reconciliationChain.find(x=>String(x.batch_id)==='103');
const batch104Audit=reconciliationChain.find(x=>String(x.batch_id)==='104');
const batch105Audit=reconciliationChain.find(x=>String(x.batch_id)==='105');
const batch106ChainAudit=reconciliationChain.find(x=>String(x.batch_id)==='106');
assert.equal(batch099Audit.batch_file,'data/items/content-research-batch-099-2026-11-15.json');
assert.equal(batch099Audit.batch_record_count,16);
assert.equal(batch099Audit.new_source_identity_count,12);
assert.equal(batch099Audit.existing_identities_enriched,2);
assert.equal(batch099Audit.source_bodies_inspected,14);
assert.equal(batch099Audit.answer_eligible_selected_count,14);
assert.equal(batch099Audit.selected_unique_evidence_families,14);
assert.equal(batch099Audit.non_independent_selected_count,4);
assert(batch099Audit.items.filter(x=>![553672,553673].includes(x.aid)).every(x=>x.selected_index_entry.present&&x.selected_index_entry.answer_eligible&&x.selected_index_entry.proposition_source_locator));
assert(batch099Audit.items.filter(x=>[553672,553673].includes(x.aid)).every(x=>x.selected_index_entry.present&&!x.selected_index_entry.answer_eligible));
const duplicate553673Audit=batch099Audit.items.find(x=>x.aid===553673);
assert.equal(duplicate553673Audit.same_family_duplicate,true);
assert.equal(duplicate553673Audit.canonical_identity_collision,false);
assert.equal(batch099Audit.same_family_duplicate_count,1);
assert.equal(batch099Audit.canonical_identity_collision_count,0);
assert.equal(batch100Audit.answer_eligible_selected_count,10);
assert.equal(batch100Audit.selected_unique_evidence_families,10);
assert.equal(batch101Audit.answer_eligible_selected_count,15);
assert.equal(batch101Audit.selected_unique_evidence_families,15);
assert.equal(String(reconciledProjectState.development_recovery.last_reconciliation.batch_id),currentReviewBatchId);
assert(batch105Audit&&batch106ChainAudit);
assert.equal(batch105Audit.reconciliation_status,'reconciled');
console.log('BATCH106_CHAIN_AUDIT',JSON.stringify(batch106ChainAudit));
assert.equal(batch106ChainAudit.canonical_identity_collision_count,0);
assert.equal(batch106ChainAudit.same_family_duplicate_count,0);
const batch112Audit=reconciliationChain.find(x=>String(x.batch_id)==='112');
assert(batch112Audit);
assert.equal(batch112Audit.batch_record_count,10);
assert.equal(batch112Audit.new_source_identity_count,9);
assert.equal(batch112Audit.existing_identities_enriched,1);
assert.equal(batch112Audit.source_bodies_inspected,10);
assert.equal(batch112Audit.answer_eligible_selected_count,10);
assert.equal(batch112Audit.selected_unique_evidence_families,10);
assert.equal(batch112Audit.canonical_identity_collision_count,0);
assert.equal(batch112Audit.same_family_duplicate_count,0);
assert(batch112Audit.items.every(x=>x.canonical_records_found===1&&x.selected_index_entry.answer_eligible));
assert.equal(reconciledProjectState.development_recovery.last_reconciliation.items.length,16);
assert(reconciledProjectState.development_recovery.last_reconciliation.items.every(x=>x.canonical_records_found===1&&x.selected_index_entry.answer_eligible));
assert.equal(reconciledProjectState.development_recovery.last_reconciliation.canonical_identity_collision_count,0);
assert.equal(reconciledProjectState.development_recovery.last_reconciliation_pending,Boolean(reconciledProjectState.development_recovery.pending_reconciliation_batches.length||reconciledProjectState.metrics_integrity.answer_readiness.pending_batches.length));
assert(!reconciledProjectState.development_recovery.pending_reconciliation_batches.includes('112'));
assert(!reconciledProjectState.metrics_integrity.answer_readiness.pending_batches.includes('112'));
assert.deepEqual(readinessMetrics(reconciledProjectState.metrics_integrity.answer_readiness.actual_after),readinessMetrics(metrics));
const batch106ReconciledAids=new Set(['2989153','2989320','2989243','4304434','5959845','2988989','5990037','5989929','5959840','2989386']);
const batch106IdentityAudit=(batch106ChainAudit.items||[]).filter(x=>batch106ReconciledAids.has(String(x.aid)));
assert.equal(batch106IdentityAudit.length,10);
assert(batch106IdentityAudit.some(x=>x.aid===5959845&&x.canonical_records_found===1&&x.selected_index_entry.answer_eligible));
assert(batch106IdentityAudit.every(x=>x.canonical_records_found===1&&!x.canonical_identity_collision&&x.selected_index_entry.answer_eligible));
assert(['reconciled','reconciled_with_variance'].includes(reconciledProjectState.metrics_integrity.answer_readiness.reconciliation_status));
assert(!reconciledProjectState.metrics_integrity.answer_readiness.pending_batches.includes('099'));
assert(!reconciledProjectState.metrics_integrity.answer_readiness.pending_batches.includes('105'));
assert(!reconciledProjectState.metrics_integrity.answer_readiness.pending_batches.includes('106'));
assert(!reconciledProjectState.development_recovery.pending_reconciliation_batches.includes('101'));
assert(!reconciledProjectState.development_recovery.pending_reconciliation_batches.includes('103'));
assert(!reconciledProjectState.development_recovery.pending_reconciliation_batches.includes('104'));
assert(!reconciledProjectState.development_recovery.pending_reconciliation_batches.includes('105'));
assert(!reconciledProjectState.development_recovery.pending_reconciliation_batches.includes('106'));
assert.equal(batch104Audit.reconciliation_status,'reconciled');
assert.equal(batch102Audit.reconciliation_status,'reconciled');
assert.equal(batch103Audit.reconciliation_status,'reconciled');


// Batches 090–092: source-body evidence, in-place enrichment, duplicate family links and deep retrieval.
assert.equal(batch090Data.records.length,8);
assert.equal(batch090Data.new_response_propositions,17);
assert.equal(batch091Data.records.length,9);
assert.equal(batch091Data.new_response_propositions,9);
assert.deepEqual(batch091Data.metrics_expected_after,{answer_eligible_unique_sources:917,content_verified_unique_sources:852,answer_eligible_propositions:2858});
assert.equal(batch092Data.records.length,5);
assert.equal(batch092Data.source_bodies_inspected,11);
assert.equal(batch092Data.source_body_pages_opened,3);
assert.equal(batch092Data.search_extracts_inspected,8);
assert.equal(batch092Data.new_source_identities,5);
assert.equal(batch092Data.existing_identities_enriched,1);
assert.equal(batch092Data.new_response_propositions,8);
assert.equal(batch092Data.existing_response_propositions_added,1);
assert.equal(batch092Data.blocked_candidate_count,1);
assert.equal(batch092Data.not_promoted_after_inspection_count,1);
assert.equal(batch092Data.translations_counted_as_independent_witnesses,0);
assert.equal(batch092Data.duplicate_aliases_linked.length,1);
assert.equal(batch092Data.duplicate_aliases_linked[0].alias_aid,5357409);
assert.equal(batch092Data.duplicate_aliases_linked[0].canonical_aid,4872269);
assert(!batch092Data.records.some(r=>Number(r.aid)===5357409),'duplicate AID 5357409 must not become a second canonical source record');
assert.equal(batch092Data.not_promoted_after_inspection[0].aid,5357409);
assert.deepEqual(batch092Data.metrics_expected_after,{answer_eligible_unique_sources:922,content_verified_unique_sources:853,answer_eligible_propositions:2867});
assert.equal(batch092Data.reconciliation_status,'superseded_by_full_corpus_reconciliation');
assert.equal(batch092Data.metrics_actual_after,null);
assert.deepEqual(readinessMetrics(acquisitionState.manual_web_review_current_metrics),readinessMetrics(metrics));
const batch092Aids=batch092Data.new_aids.map(String);
assert.deepEqual(batch092Aids,['5054489','5100603','5071021','5100374','5100372']);
assert.equal(new Set(batch092Aids).size,5);
assert.equal(new Set(batch092Data.records.map(r=>r.evidence_family_id)).size,5);
for(const aid of batch092Aids){
 const matches=idx.entries.filter(e=>sourceAID(e)===aid);
 assert.equal(matches.length,1,'batch-092 AID '+aid+' must have exactly one indexed identity');
 const e=matches[0];
 assert(e.has_content_evidence,'batch-092 AID '+aid+' must be answer eligible');
 assert.equal(e.canonical_file,batch092Path);
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope&&e.witness_provenance);
 assert.equal(e.response_proposition_locators.length,e.response_propositions.length);
 assert.equal(e.context_status,'partial');
 assert.equal(e.independent_witness,true);
 assert.equal(e.language,'Hebrew');
 assert(e.response_propositions.every(p=>typeof p==='string'&&p.length>30));
}
const batch092Verified=idx.entries.find(e=>sourceAID(e)==='5100372');
assert.equal(batch092Verified.canonical_status,'Verified','only directly opened new AID 5100372 may be promoted to Verified');
assert.equal(batch092Verified.response_propositions.length,2);
for(const aid of ['5054489','5100603','5071021','5100374']){
 const e=idx.entries.find(x=>sourceAID(x)===aid);
 assert.equal(e.canonical_status,'Parsed','search-result-only Hebrew text must remain Parsed');
 assert.match(e.verification_scope,/תוצאת חיפוש|תוצאת החיפוש/);
}
const enriched5054491=idx.entries.find(e=>sourceAID(e)==='5054491');
assert(enriched5054491&&enriched5054491.canonical_file==='data/items/content-research-batch-057-2026-11-12.json');
assert.equal(enriched5054491.evidence_family_id,'igrot-letter-5717-8-menachem-av-v15-aid5054491');
assert.equal(enriched5054491.response_propositions.length,3);
assert(enriched5054491.response_proposition_locators.some(l=>String(l).includes('line 298')));
assert.equal(idx.entries.filter(e=>sourceAID(e)==='5357409').length,0,'duplicate AID 5357409 must not add a new independent item');

// Batch 093/094: exact AID deduplication, original-language body evidence and in-place enrichment.
assert.equal(batch093Data.records.length,8);
assert.equal(batch093Data.new_source_identities,8);
assert.equal(batch093Data.existing_identity_rechecks.length,2);
assert(batch093Data.existing_identity_rechecks.some(x=>String(x.aid)==='2190037'));
assert(!batch093Data.records.some(r=>String(r.aid)==='2190037'),'AID 2190037 already exists in batch 070 and must not be duplicated');
assert.deepEqual(batch093Data.metrics_expected_after,{answer_eligible_unique_sources:930,content_verified_unique_sources:853,answer_eligible_propositions:2875});
assert.equal(new Set(batch093Data.records.map(r=>String(r.aid))).size,8);
assert.equal(new Set(batch093Data.records.map(r=>r.evidence_family_id)).size,8);
assert.equal(new Set(batch093Data.records.map(r=>r.source_url)).size,8);
for(const r of batch093Data.records){
 const aid=String(r.aid);
 const matches=idx.entries.filter(e=>sourceAID(e)===aid);
 assert.equal(matches.length,1,'batch-093 AID '+aid+' must have exactly one indexed identity');
 const e=matches[0];
 assert(e.has_content_evidence&&e.response_propositions.length>0);
 assert.equal(e.canonical_file,batch093Path);
 assert.equal(e.status,'Parsed');
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope);
 assert.equal(e.response_proposition_locators.length,e.response_propositions.length);
}
const existing2190037=idx.entries.filter(e=>sourceAID(e)==='2190037');
assert.equal(existing2190037.length,1,'the duplicate AID 2190037 must resolve to one canonical item');
assert.equal(existing2190037[0].canonical_file,'data/items/content-research-batch-070-2026-11-13.json');
assert.equal(existing2190037[0].evidence_family_id,'pastoral-letter-5723-22-elul-2190037');
assert.equal(existing2190037[0].independent_witness,false);
const enriched6436855=idx.entries.find(e=>sourceAID(e)==='6436855');
assert(enriched6436855&&enriched6436855.canonical_file===batch093Path);
assert.equal(enriched6436855.evidence_family_id,'sicha-v34-vayelech-1-aid6436855');
assert.equal(enriched6436855.response_propositions.length,2,'AID 6436855 must be enriched in place, not duplicated');
assert.equal(enriched6436855.response_proposition_locators.length,2);
assert(enriched6436855.response_propositions.some(p=>p.includes('הנחיות משה ליהושע')));
assert(enriched6436855.response_proposition_locators.some(l=>String(l).includes('301–307')));

assert.equal(batch094Data.records.length,8);
assert.equal(batch094Data.records_reviewed,11);
assert.equal(batch094Data.source_bodies_inspected,10);
assert.equal(batch094Data.new_source_identities,8);
assert.equal(batch094Data.existing_identities_enriched,1);
assert.equal(batch094Data.new_response_propositions,9);
assert.equal(batch094Data.existing_response_propositions_added,1);
assert.equal(batch094Data.answer_eligible_source_families_added,8);
assert.equal(batch094Data.content_verified_unique_sources_added,0);
assert.deepEqual(batch094Data.metrics_expected_after,{answer_eligible_unique_sources:938,content_verified_unique_sources:853,answer_eligible_propositions:2885});
assert.equal(batch094Data.deduplication_check.full_index_scan_available,true);
assert.equal(batch094Data.deduplication_check.candidate_aids_found.length,0);
assert.equal(batch094Data.translations_counted_as_independent_witnesses,0);
assert(batch094Data.existing_identity_updates.some(x=>String(x.aid)==='6436855'));
assert(!batch094Data.records.some(r=>String(r.aid)==='4557806'),'publisher adaptation from two talks must not be counted as a new independent item');
assert(batch094Data.not_promoted_after_inspection.some(x=>String(x.aid)==='4557806'));
assert.equal(new Set(batch094Data.records.map(r=>String(r.aid))).size,8);
assert.equal(new Set(batch094Data.records.map(r=>r.evidence_family_id)).size,8);
assert.equal(new Set(batch094Data.records.map(r=>r.source_url)).size,8);
for(const r of batch094Data.records){
 const aid=String(r.aid);
 const matches=idx.entries.filter(e=>sourceAID(e)===aid);
 assert.equal(matches.length,1,'batch-094 AID '+aid+' must have exactly one indexed identity');
 const e=matches[0];
 assert(e.has_content_evidence&&e.response_propositions.length===1);
 assert.equal(e.canonical_file,batch094Path);
 assert.equal(e.status,'Parsed','excerpt-only new identities must remain Parsed');
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope&&e.evidence_family_id);
 assert.equal(e.response_proposition_locators.length,e.response_propositions.length);
 assert.equal(e.context_status,'partial');
 assert.equal(e.independent_witness,true);
}
const batch094Languages=batch094Data.records.reduce((a,r)=>(a[r.language]=(a[r.language]||0)+1,a),{});
assert.deepEqual(batch094Languages,{Hebrew:3,Yiddish:5});
const essence4632005=idx.entries.find(e=>sourceAID(e)==='4632005');
assert(essence4632005&&essence4632005.type==='maamar'&&essence4632005.original_language==='Hebrew');
assert(essence4632005.response_proposition_locators.some(l=>String(l).includes('260–282')));

const studyPersistenceQuestion='מה נכתב באיגרות על קביעות עתים בלימוד תורה לצד עבודה, התמדה, לימוד בחברותא והתקדמות הדרגתית?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,studyPersistenceQuestion,{mode});
 assert(m.answerable,mode+': inspected study-persistence letters must support a bounded multi-source answer');
 for(const aid of ['5019408','5100285','5100603'])assert(m.sources.some(e=>sourceAID(e)===aid),mode+': multi-source retrieval must retain AID '+aid);
 assert(m.claims.length>=2&&m.claims.every(c=>c.source_numbers.length),mode+': every study-persistence claim must retain claim-level source numbers');
 assert(m.citation_entailment.every(x=>x.valid),mode+': each study-persistence claim must be entailed by its own source');
 assert(m.context_boundary.every(x=>x.valid),mode+': personal correspondence context must remain witness-local');
 if(mode==='researcher'){
  assert.equal(m.research.depth,'deep');
  assert(m.research.evidence_map.length>=3);
  assert.equal(m.research.claim_source_map.length,m.claims.length);
  assert(m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));
  assert(m.research.evidence_witnesses.some(w=>String(w.aid)==='5019408'));
  assert(m.research.evidence_witnesses.some(w=>String(w.aid)==='5100285'));
  assert(m.research.evidence_witnesses.some(w=>String(w.aid)==='5100603'));
 }else assert.equal(m.research,undefined);
}


// Batch 098: nine new identities, one in-place enrichment, and mixed-language evidence.
const batch098Path='data/items/content-research-batch-098-2026-11-15.json';
const batch098Data=JSON.parse(await readFile(new URL(batch098Path,root)));
assert.equal(batch098Data.records.length,9);
assert.equal(batch098Data.reviewed_item_count,10);
assert.equal(batch098Data.source_bodies_inspected,10);
assert.equal(batch098Data.new_source_identities,9);
assert.equal(batch098Data.existing_identities_enriched,1);
assert.equal(batch098Data.new_response_propositions,10);
assert.equal(batch098Data.existing_response_propositions_added,1);
assert.equal(batch098Data.answer_eligible_source_families_added,9);
assert.equal(batch098Data.content_verified_unique_sources_added,0);
assert.equal(batch098Data.blocked_candidate_count,2);
assert.deepEqual(batch098Data.metrics_expected_after,{answer_eligible_unique_sources:965,content_verified_unique_sources:870,answer_eligible_propositions:2929});
assert.equal(new Set(batch098Data.new_aids.map(String)).size,9);
assert.equal(new Set(batch098Data.records.map(r=>String(r.aid))).size,9);
assert.equal(new Set(batch098Data.records.map(r=>r.evidence_family_id)).size,9);
assert.equal(new Set(batch098Data.records.map(r=>r.source_url)).size,9);
assert.equal(batch098Data.translations_counted_as_independent_witnesses,0);
assert.equal(batch098Data.crawler_retry,false);
assert.equal(batch098Data.access_control_bypassed,false);
assert.equal(batch098Data.full_text_copied,false);
assert.equal(batch098Data.scan_only_verification_used,false);
assert.equal(batch098Data.deduplication_check.full_index_scan_pending_reconciliation,false);
assert.equal(batch098Data.deduplication_check.full_index_scan_available,true);
assert.equal(batch098Data.reconciliation_status,'reconciled');
assert.deepEqual(batch098Data.metrics_actual_after,batch098Data.metrics_expected_after);
const batch098Languages=batch098Data.records.reduce((a,r)=>(a[r.language]=(a[r.language]||0)+1,a),{});
assert.deepEqual(batch098Languages,{Hebrew:4,Yiddish:4,English:1});
for(const r of batch098Data.records){
 const aid=String(r.aid);
 const matches=idx.entries.filter(e=>sourceAID(e)===aid);
 assert.equal(matches.length,1,'batch-098 AID '+aid+' must have exactly one canonical identity');
 const e=matches[0];
 assert(e.has_content_evidence,'batch-098 AID '+aid+' must be answer eligible');
 assert.equal(e.canonical_file,batch098Path);
 assert.equal(e.status,'Parsed','excerpt-only new identities must remain Parsed');
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope);
 assert.equal(e.response_proposition_locators.length,e.response_propositions.length);
 assert.equal(e.context_status,'partial');
 assert(e.evidence_family_id);
}
const enriched3316701=idx.entries.find(e=>sourceAID(e)==='3316701');
assert(enriched3316701&&enriched3316701.canonical_file==='data/items/content-research-batch-096-2026-11-15.json');
assert.equal(enriched3316701.evidence_family_id,'hayom-yom-tammuz-20-aid3316701');
assert.equal(enriched3316701.response_propositions.length,2,'AID 3316701 must be enriched in place without changing its Evidence Family');
assert(enriched3316701.response_proposition_locators.some(l=>String(l).includes('line 256')));
assert(batch098Data.existing_identity_updates.some(x=>String(x.aid)==='3316701'));
const blocked4666220=batch098Data.blocked_candidates.find(x=>String(x.aid)==='4666220');
const blockedLibrary=batch098Data.blocked_candidates.find(x=>String(x.aid)==='1200720068');
assert(blocked4666220&&blockedLibrary,'both blocked source attempts must be recorded');

const tzedakahStudyQuestion='מה נכתב על צדקה, יגיעה בלימוד תורה והזמן שיש להקדיש ללימוד?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,tzedakahStudyQuestion,{mode});
 assert(m.answerable,mode+': the inspected English recipient testimony must support a bounded answer');
 assert(m.sources.some(e=>sourceAID(e)==='259799'),mode+': the English correspondence testimony must be retrievable');
 assert(m.claims.length>=1&&m.claims.every(c=>c.source_numbers.length),mode+': the claim must retain claim-level source numbers');
 assert(m.citation_entailment.every(x=>x.valid),mode+': the claim must be entailed by its own source');
 assert(m.context_boundary.every(x=>x.valid),mode+': personal correspondence context must remain witness-local');
 if(mode==='researcher'){
  assert.equal(m.research.depth,'deep');
  assert(m.research.evidence_witnesses.some(w=>String(w.aid)==='259799'));
  assert.equal(m.research.claim_source_map.length,m.claims.length);
  assert(m.research.claim_source_map.every(c=>c.source_numbers.length&&c.source_locators.length));
 }else assert.equal(m.research,undefined);
}


// Batch 099: twelve inspected Hebrew text identities, one in-place enrichment, and same-family audio deduplication.
const batch099Path='data/items/content-research-batch-099-2026-11-15.json';
const batch099Data=JSON.parse(await readFile(new URL(batch099Path,root)));
assert.equal(batch099Data.records.length,12);assert.equal(batch099Data.reviewed_item_count,16);assert.equal(batch099Data.source_bodies_inspected,14);assert.equal(batch099Data.source_body_pages_opened,16);
assert.equal(batch099Data.new_source_identities,12);assert.equal(batch099Data.existing_identities_enriched,2);assert.equal(batch099Data.existing_identities_rechecked,2);
assert.equal(batch099Data.new_response_propositions,20);assert.equal(batch099Data.existing_response_propositions_added,3);assert.equal(batch099Data.total_new_paraphrase_entries,23);assert.equal(batch099Data.answer_eligible_source_families_added,12);
assert.equal(batch099Data.content_verified_unique_sources_added,0);assert.equal(batch099Data.translations_counted_as_independent_witnesses,0);
assert.equal(batch099Data.crawler_retry,false);assert.equal(batch099Data.access_control_bypassed,false);assert.equal(batch099Data.full_text_copied,false);assert.equal(batch099Data.scan_only_verification_used,false);
assert.equal(batch099Data.blocked_candidate_count,1);assert.equal(batch099Data.metadata_only_candidate_count,10);
assert.equal(batch099Data.duplicate_aliases_linked.length,2);assert(batch099Data.duplicate_aliases_linked.some(x=>x.alias_aid===553673&&x.canonical_aid===553673&&x.duplicate_file==='data/items/bulk-indexed-2026-09-24-001.json'));
assert(batch099Data.duplicate_aliases_linked.some(x=>x.alias_aid===553673&&x.canonical_aid===553672));
assert.equal(batch099Data.duplicate_aliases_linked[0].evidence_family_id,'yechidus-5743-21-kislev-parallel-language-audio');
assert.equal(new Set(batch099Data.new_aids.map(String)).size,12);assert.equal(new Set(batch099Data.records.map(r=>String(r.aid))).size,12);
assert.equal(new Set(batch099Data.records.map(r=>r.evidence_family_id)).size,12);assert.equal(new Set(batch099Data.records.map(r=>r.source_url)).size,12);
assert.equal(batch099Data.records.filter(r=>r.independent_witness===true).length,8);assert.equal(batch099Data.records.filter(r=>r.independent_witness===false).length,4);
const batch099Languages=batch099Data.records.reduce((a,r)=>(a[r.language]=(a[r.language]||0)+1,a),{});assert.deepEqual(batch099Languages,{Hebrew:12});
for(const r of batch099Data.records){const aid=String(r.aid),matches=idx.entries.filter(e=>sourceAID(e)===aid);assert.equal(matches.length,1,'batch-099 AID '+aid+' must have exactly one canonical identity');const e=matches[0];assert(e.has_content_evidence&&e.response_propositions.length>0);assert.equal(e.canonical_file,batch099Path);assert.equal(e.status,'Parsed');assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');assert(e.proposition_source_locator&&e.verification_scope&&e.witness_provenance);assert.equal(e.response_proposition_locators.length,e.response_propositions.length);assert.equal(e.context_status,'partial');assert(e.evidence_family_id);}
const enriched3316719Batch099=idx.entries.find(e=>sourceAID(e)==='3316719');assert(enriched3316719Batch099&&enriched3316719Batch099.canonical_file==='data/items/content-research-batch-097-2026-11-15.json');assert.equal(enriched3316719Batch099.evidence_family_id,'hayom-yom-tammuz-22-aid3316719');assert.equal(enriched3316719Batch099.response_propositions.length,2);assert(enriched3316719Batch099.response_propositions.some(p=>p.includes('ניגון חסידי')));assert.equal(enriched3316719Batch099.response_proposition_locators.length,2);assert(batch099Data.existing_identity_updates.some(x=>String(x.aid)==='3316719'));
const enriched2989588Batch099=idx.entries.find(e=>sourceAID(e)==='2989588');assert(enriched2989588Batch099&&enriched2989588Batch099.canonical_file===batch099Path);assert.equal(enriched2989588Batch099.evidence_family_id,'sicha-5717-24-sivan-aid2989588');assert.equal(enriched2989588Batch099.response_propositions.length,3);assert(enriched2989588Batch099.response_proposition_locators.some(l=>String(l).includes('211–213')));assert(enriched2989588Batch099.response_proposition_locators.some(l=>String(l).includes('215–217')));assert(batch099Data.existing_identity_updates.some(x=>String(x.aid)==='2989588'));
const yechidusHebrew=idx.entries.find(e=>sourceAID(e)==='553672'),yechidusYiddish=idx.entries.find(e=>sourceAID(e)==='553673');assert(yechidusHebrew&&yechidusYiddish);assert.equal(yechidusHebrew.evidence_family_id,'yechidus-5743-21-kislev-parallel-language-audio');assert.equal(yechidusYiddish.evidence_family_id,yechidusHebrew.evidence_family_id);assert.equal(yechidusHebrew.independent_witness,false);assert.equal(yechidusYiddish.independent_witness,false);assert.equal(yechidusHebrew.response_propositions.length,0);assert.equal(yechidusYiddish.response_propositions.length,0);
assert(batch099Data.deduplication_check.same_family_duplicate_presentations.some(x=>x.aid===553673));assert.equal(batch099Data.deduplication_check.duplicate_alias_identities,1);assert.equal(batch099Data.deduplication_check.full_index_scan_available,true);assert.equal(batch099Data.deduplication_check.full_index_scan_pending_reconciliation,false);assert.equal(batch099Data.reconciliation_status,'reconciled');assert.deepEqual(batch099Data.metrics_expected_after,{answer_eligible_unique_sources:977,content_verified_unique_sources:854,answer_eligible_propositions:2952});assert.deepEqual(readinessMetrics(batch099Data.metrics_actual_after),batch099Data.metrics_expected_after);assert.deepEqual(batch099Data.reconciliation_variance,{answer_eligible_unique_sources:0,content_verified_unique_sources:0,answer_eligible_propositions:0});
const batch099EducationQuestion='מה מתארות השיחות על השפעה חינוכית ועל הוראה מעשית בפרשת השבוע?';
const batch099EducationAids=new Set(['5959982','5990031','6132085']);
const batch099EducationEntries=idx.entries.filter(e=>batch099EducationAids.has(sourceAID(e)));
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(batch099EducationEntries,batch099EducationQuestion,{mode});
 assert(m.answerable,mode+': inspected Sicha texts must support a bounded multi-source education/everyday-life answer');
 assert(m.sources.some(e=>sourceAID(e)==='5990031'),mode+': expected the source on educational influence');
 assert(m.sources.some(e=>sourceAID(e)==='6132085'),mode+': expected the source on practical weekly-parasha guidance');
 assert(m.claims.length>=2&&m.claims.every(c=>c.source_numbers.length),mode+': every claim must retain claim-level source numbers');
 assert(m.citation_entailment.every(x=>x.valid),mode+': each claim must be entailed by its own inspected proposition');
 assert(m.context_boundary.every(x=>x.valid),mode+': witness circumstances must remain local');
 if(mode==='researcher'){
  assert.equal(m.research.depth,'deep');
  assert(m.research.evidence_map.length>=2);
  assert.equal(m.research.claim_source_map.length,m.claims.length);
  assert(m.research.claim_source_map.every(c=>c.source_numbers.length&&c.source_locators.length));
  assert(m.research.evidence_witnesses.some(w=>String(w.aid)==='5990031'));
 }else assert.equal(m.research,undefined);
}


 
// Batch 100: nine new Hebrew Sicha text witnesses, fourteen inspected paraphrases, and one excluded audio-only listing.
const batch100Path='data/items/content-research-batch-100-2026-11-15.json';
const batch100Data=JSON.parse(await readFile(new URL(batch100Path,root)));
const batch100Aids=['2989585','4296215','2989341','4296163','4280029','4385617','4279842','2988877','2989022'];
assert.equal(batch100Data.records.length,9);
assert.equal(batch100Data.reviewed_item_count,11);
assert.equal(batch100Data.source_bodies_inspected,10);
assert.equal(batch100Data.source_body_pages_opened,11);
assert.equal(batch100Data.new_source_identities,9);
assert.equal(batch100Data.existing_identities_enriched,1);
assert.equal(batch100Data.existing_identities_rechecked,1);
assert.equal(batch100Data.new_response_propositions,14);
assert.equal(batch100Data.existing_response_propositions_added,2);
assert(batch100Data.records.reduce((n,r)=>n+r.response_propositions.length,0)>=16,'batch 100 canonical records may include later in-place enrichments');
assert(batch100Data.existing_identity_updates.some(x=>String(x.aid)==='2989585'));
assert.equal(batch100Data.content_verified_unique_sources_added,0);
assert.equal(batch100Data.blocked_candidate_count,1);
assert.equal(batch100Data.blocked_candidates[0].aid,553674);
assert.equal(batch100Data.crawler_retry,false);
assert.equal(batch100Data.access_control_bypassed,false);
assert.equal(batch100Data.full_text_copied,false);
assert.equal(batch100Data.scan_only_verification_used,false);
assert.equal(batch100Data.translations_counted_as_independent_witnesses,0);
assert.deepEqual(batch100Data.metrics_before,{answer_eligible_unique_sources:977,content_verified_unique_sources:854,answer_eligible_propositions:2852});
assert.deepEqual(batch100Data.metrics_expected_after,{answer_eligible_unique_sources:986,content_verified_unique_sources:854,answer_eligible_propositions:2970});
assert.equal(batch100Data.reconciliation_status,'reconciled');
assert.deepEqual(readinessMetrics(batch100Data.metrics_actual_after),batch100Data.metrics_expected_after);
assert.deepEqual(batch100Data.reconciliation_variance,{answer_eligible_unique_sources:0,content_verified_unique_sources:0,answer_eligible_propositions:0});
assert.equal(batch100Data.deduplication_check.full_index_scan_available,true);
assert.equal(batch100Data.deduplication_check.full_index_scan_pending_reconciliation,false);
assert.deepEqual(batch100Data.deduplication_check.canonical_identity_collisions,[]);
assert.deepEqual(batch100Data.deduplication_check.missing_canonical_identities,[]);
assert.equal(new Set(batch100Aids).size,9);
assert.equal(new Set(batch100Data.records.map(r=>String(r.aid))).size,9);
assert.equal(new Set(batch100Data.records.map(r=>r.evidence_family_id)).size,9);
assert.equal(new Set(batch100Data.records.map(r=>r.source_url)).size,9);
for(const aid of batch100Aids){
 const r=batch100Data.records.find(x=>String(x.aid)===aid);
 const matches=idx.entries.filter(e=>sourceAID(e)===aid);
 assert.equal(matches.length,1,'batch-100 AID '+aid+' must have exactly one canonical index identity');
 const e=matches[0];
 assert(e.has_content_evidence&&e.response_propositions.length>0);
 assert.equal(e.canonical_file,batch100Path);
 assert.equal(e.status,'Parsed');
 assert.equal(e.context_status,'partial');
 assert.equal(e.independent_witness,true);
 assert.equal(e.translation_of_evidence_family_id,null);
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope&&e.witness_provenance);
 assert.equal(e.response_proposition_locators.length,e.response_propositions.length);
 assert.equal(e.response_proposition_locators.every(Boolean),true);
 assert.equal(e.evidence_family_id,r.evidence_family_id);
 assert.equal(e.response_propositions.length,r.response_propositions.length);
 assert(!queue.records.some(q=>String(q.key||'')==='aid:'+aid||String(q.source_url||'').includes('/aid/'+aid+'/')));
}
const enriched2989585=idx.entries.find(e=>sourceAID(e)==='2989585');
assert(enriched2989585&&enriched2989585.canonical_file===batch100Path);
assert.equal(enriched2989585.evidence_family_id,'sicha-5717-shavuot-day2-aid2989585');
assert.equal(enriched2989585.response_propositions.length,19);
assert(enriched2989585.response_proposition_locators.some(l=>String(l).includes('222–233')));
assert(enriched2989585.response_proposition_locators.some(l=>String(l).includes('214–217')));
assert(enriched2989585.response_proposition_locators.some(l=>String(l).includes('321–332')));
assert(enriched2989585.response_proposition_locators.some(l=>String(l).includes('343–374')));
assert(enriched2989585.response_proposition_locators.some(l=>String(l).includes('380–388')));
const batch100PreparationQuestion='מה מתארות השיחות על קבלת התורה בשמחה ועל הפיכתה למורה דרך בחיי היום־יום?';
const batch100PreparationEntries=idx.entries.filter(e=>['2989585','4385617'].includes(sourceAID(e)));
assert.equal(batch100PreparationEntries.length,2);
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(batch100PreparationEntries,batch100PreparationQuestion,{mode});
 assert(m.answerable,mode+': the inspected Torah-preparation texts must support a bounded answer');
 assert(m.sources.some(e=>sourceAID(e)==='2989585'),mode+': the Shavuot Sicha on receiving Torah joyfully must be retrieved');
 assert(m.sources.some(e=>sourceAID(e)==='4385617'),mode+': the Sicha addressed to women and girls on daily Torah guidance must be retrieved');
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length),mode+': every claim needs proposition-level source numbers');
 assert(m.citation_entailment.every(x=>x.valid),mode+': each claim must be entailed by its cited proposition');
 assert(m.context_boundary.every(x=>x.valid),mode+': witness circumstances must remain local');
 if(mode==='researcher'){
  assert.equal(m.research.depth,'deep');
  assert(m.research.evidence_map.length>=2);
  assert(m.research.claim_source_map.length>=m.claims.length);
  assert(m.research.claim_source_map.every(c=>c.source_numbers.length&&c.source_locators.length));
 }else assert.equal(m.research,undefined);
}

// Batch 101: fourteen new Hebrew body-inspected identities, three documentation classes,
// explicit exclusion of translations, and a three-family daily-learning synthesis.
const batch101Path='data/items/content-research-batch-101-2026-11-15.json';
const batch101Data=JSON.parse(await readFile(new URL(batch101Path,root)));
const batch101Aids=['2989311','5959840','2989404','2989555','2989195','4304430','2989020','2989386','2989426','2989396','2989589','2989587','2989554','2989348','2021558'];
assert.equal(batch101Data.records.length,15);
assert.equal(batch101Data.reviewed_item_count,21);
assert.equal(batch101Data.source_bodies_inspected,18);
assert.equal(batch101Data.source_body_pages_opened,21);
assert.equal(batch101Data.new_source_identities,15);
assert.equal(batch101Data.existing_identities_rechecked,1);
assert.equal(batch101Data.new_response_propositions,30);
assert.equal(batch101Data.existing_response_propositions_added,0);
assert.equal(batch101Data.records.reduce((n,r)=>n+r.response_propositions.length,0),31,'AID 5959840 receives one later in-place enrichment in batch 106');
assert.equal(batch101Data.blocked_candidate_count,3);
assert.equal(batch101Data.metadata_only_candidate_count,2);
assert.equal(batch101Data.translations_counted_as_independent_witnesses,0);
assert.equal(batch101Data.crawler_retry,false);
assert.equal(batch101Data.access_control_bypassed,false);
assert.equal(batch101Data.full_text_copied,false);
assert.equal(batch101Data.scan_only_verification_used,false);
assert(batch101Data.translation_candidates_excluded.some(x=>String(x.aid)==='2989234'));
assert(batch101Data.blocked_candidates.some(x=>String(x.aid)==='4666220'));
assert.deepEqual(batch101Data.metrics_before,{answer_eligible_unique_sources:986,content_verified_unique_sources:854,answer_eligible_propositions:2869});
assert.deepEqual(batch101Data.metrics_expected_after,{answer_eligible_unique_sources:1001,content_verified_unique_sources:854,answer_eligible_propositions:3000});
assert.equal(batch101Data.reconciliation_status,'reconciled');
assert.deepEqual(readinessMetrics(batch101Data.metrics_actual_after),batch101Data.metrics_expected_after);
assert.deepEqual(batch101Data.reconciliation_variance,{answer_eligible_unique_sources:0,content_verified_unique_sources:0,answer_eligible_propositions:0});
assert.equal(batch101Data.deduplication_check.full_index_scan_available,true);
assert.equal(batch101Data.deduplication_check.full_index_scan_pending_reconciliation,false);
assert.deepEqual(batch101Data.deduplication_check.canonical_identity_collisions,[]);
assert.deepEqual(batch101Data.deduplication_check.missing_canonical_identities,[]);
assert.equal(new Set(batch101Aids).size,15);
assert.equal(new Set(batch101Data.records.map(r=>String(r.aid))).size,15);
assert.equal(new Set(batch101Data.records.map(r=>r.evidence_family_id)).size,15);
assert.equal(new Set(batch101Data.records.map(r=>r.source_url)).size,15);
assert.deepEqual(batch101Data.records.reduce((a,r)=>(a[r.language]=(a[r.language]||0)+1,a),{}),{Hebrew:14,English:1});
for(const r of batch101Data.records){
 const aid=String(r.aid),matches=idx.entries.filter(e=>sourceAID(e)===aid);
 assert.equal(matches.length,1,'batch-101 AID '+aid+' must have exactly one canonical index identity');
 const e=matches[0];
 assert(e.has_content_evidence&&e.response_propositions.length>0);
 assert.equal(e.canonical_file,batch101Path);
 assert.equal(e.status,'Parsed');
 assert.equal(e.context_status,'partial');
 assert.equal(e.independent_witness,true);
 assert.equal(e.translation_of_evidence_family_id,null);
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope&&e.witness_provenance);
 assert.equal(e.response_proposition_locators.length,e.response_propositions.length);
 assert(e.response_proposition_locators.every(Boolean));
 assert.equal(e.evidence_family_id,r.evidence_family_id);
 assert(!queue.records.some(q=>String(q.key||'')==='aid:'+aid||String(q.source_url||'').includes('/aid/'+aid+'/')));
}
const englishLetter=idx.entries.find(e=>sourceAID(e)==='2021558');
assert(englishLetter&&englishLetter.language==='English'&&englishLetter.original_language==='English');
assert.equal(englishLetter.witness_type,'published_english_letter_transcription');
assert.equal(englishLetter.proposition_origin,'source_grounded_paraphrase');
assert.equal(englishLetter.proposition_verification,'source_text_inspected');
assert.equal(englishLetter.response_propositions.length,4);
assert(englishLetter.response_proposition_locators.some(l=>String(l).includes('274–284')));
assert(englishLetter.response_proposition_locators.some(l=>String(l).includes('295–299')));
const englishLetterQuestion='What does the letter recommend when a person has strong doubts about a long-standing Jewish way of life?';
const englishLetterModel=buildAnswerModel([englishLetter],englishLetterQuestion,{mode:'regular'});
assert(englishLetterModel.answerable);
assert(englishLetterModel.sources.some(e=>sourceAID(e)==='2021558'));
assert(englishLetterModel.claims.length>=2&&englishLetterModel.claims.every(c=>c.source_numbers.length));
assert(englishLetterModel.citation_entailment.every(x=>x.valid));
assert(englishLetterModel.context_boundary.every(x=>x.valid));
const rechecked2989588=idx.entries.find(e=>sourceAID(e)==='2989588');
assert(rechecked2989588&&rechecked2989588.evidence_family_id==='sicha-5717-24-sivan-aid2989588');
assert(!batch101Aids.includes('2989588'),'existing AID 2989588 must not be duplicated');
const dailyLearningQuestion='מהי תכלית הלימודים לפי המקורות, וכיצד יש לממש את הלימוד בחיי היום־יום, בחופשת הקיץ ובהשפעה על אחרים?';
const dailyLearningAids=['5959840','2989588','2989589'];
const dailyLearningEntries=idx.entries.filter(e=>dailyLearningAids.includes(sourceAID(e)));
assert.equal(dailyLearningEntries.length,3);
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(dailyLearningEntries,dailyLearningQuestion,{mode});
 assert(m.answerable,mode+': three inspected Hebrew sources must support a bounded daily-learning synthesis');
 for(const aid of dailyLearningAids)assert(m.sources.some(e=>sourceAID(e)===aid),mode+': daily-learning synthesis must retain AID '+aid);
 assert(new Set(m.sources.filter(e=>e._independent_witness!==false).map(e=>e.evidence_family_id)).size>=3,mode+': synthesis must use three independent Evidence Families');
 assert(m.claims.length>=2&&m.claims.every(c=>c.source_numbers.length),mode+': every synthesized claim needs claim-level source numbers');
 assert(m.citation_entailment.every(x=>x.valid),mode+': every claim must be entailed by its own inspected proposition');
 assert(m.context_boundary.every(x=>x.valid),mode+": each source's audience and limitations must remain local");
 if(mode==='researcher'){
  assert.equal(m.research.depth,'deep');
  assert(m.research.evidence_families>=3);
  assert.equal(m.research.claim_source_map.length,m.claims.length);
  assert(m.research.claim_source_map.every(c=>c.source_numbers.length&&c.source_locators.length));
  assert(m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));
 }else assert.equal(m.research,undefined);
}
assert.deepEqual(readinessMetrics(batch101Data.metrics_actual_after),batch101Data.metrics_expected_after);
assert.deepEqual(readinessMetrics(acquisitionState.manual_web_review_current_metrics),readinessMetrics(metrics));


// Batch 102: nine new Hebrew item identities in eight Evidence Families,
// plus one in-place enrichment of the original AID 2989585 record.
const batch102Path='data/items/content-research-batch-102-2026-11-15.json';
const batch102Data=JSON.parse(await readFile(new URL(batch102Path,root)));
const batch102Aids=batch102Data.records.map(r=>String(r.aid));
assert.equal(batch102Data.records.length,9);
assert.equal(batch102Data.reviewed_item_count,16);
assert.equal(batch102Data.source_bodies_inspected,10);
assert.equal(batch102Data.new_source_identities,9);
assert.equal(batch102Data.existing_identities_enriched,1);
assert.equal(batch102Data.new_response_propositions,18);
assert.equal(batch102Data.existing_response_propositions_added,1);
assert.equal(batch102Data.total_new_paraphrase_entries,19);
assert.equal(batch102Data.answer_eligible_source_families_added,8);
assert.equal(batch102Data.independent_witnesses_added,8);
assert.equal(batch102Data.non_independent_presentations_added,1);
assert.equal(batch102Data.content_verified_unique_sources_added,0);
assert.equal(batch102Data.blocked_candidate_count,3);
assert.equal(batch102Data.metadata_only_candidate_count,2);
assert.equal(batch102Data.crawler_retry,false);
assert.equal(batch102Data.access_control_bypassed,false);
assert.equal(batch102Data.full_text_copied,false);
assert.equal(batch102Data.translations_counted_as_independent_witnesses,0);
assert.deepEqual(batch102Data.metrics_before,{answer_eligible_unique_sources:1001,content_verified_unique_sources:854,answer_eligible_propositions:2899});
assert.deepEqual(batch102Data.metrics_expected_after,{answer_eligible_unique_sources:1009,content_verified_unique_sources:854,answer_eligible_propositions:3018});
assert.equal(batch102Data.reconciliation_status,'reconciled');
assert.deepEqual(readinessMetrics(batch102Data.metrics_actual_after),batch102Data.metrics_expected_after);
assert.deepEqual(batch102Data.reconciliation_variance,{answer_eligible_unique_sources:0,content_verified_unique_sources:0,answer_eligible_propositions:0});
assert.equal(batch102Data.deduplication_check.full_index_scan_available,true);
assert.deepEqual(batch102Data.deduplication_check.canonical_identity_collisions,[]);
assert.deepEqual(batch102Data.deduplication_check.missing_canonical_identities,[]);
assert.equal(new Set(batch102Aids).size,9);
assert.equal(new Set(batch102Data.records.map(r=>r.evidence_family_id)).size,8);
assert.equal(new Set(batch102Data.records.map(r=>r.source_url)).size,9);
assert.deepEqual(batch102Data.records.reduce((a,r)=>(a[r.language]=(a[r.language]||0)+1,a),{}),{Hebrew:9});
assert.equal(batch102Data.records.filter(r=>r.source_class==='Sichos').length,6);
assert.equal(batch102Data.records.filter(r=>r.source_class==='Maamarim').length,3);
assert.equal(batch102Data.records.filter(r=>r.independent_witness===false).length,1);
assert.equal(batch102Data.records.reduce((n,r)=>n+r.response_propositions.length,0),18);
for(const r of batch102Data.records){
 const aid=String(r.aid),matches=idx.entries.filter(e=>sourceAID(e)===aid);
 assert.equal(matches.length,1,'batch-102 AID '+aid+' must have exactly one canonical index identity');
 const e=matches[0];
 assert(e.has_content_evidence&&e.response_propositions.length===r.response_propositions.length);
 assert.equal(e.canonical_file,batch102Path);
 assert.equal(e.status,'Parsed');
 assert.equal(e.context_status,'partial');
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope&&e.witness_provenance);
 assert.equal(e.response_proposition_locators.length,e.response_propositions.length);
 assert(e.response_proposition_locators.every(Boolean));
}
const sameFamilyMaamar=idx.entries.find(e=>sourceAID(e)==='5989527');
const sameFamilySicha=idx.entries.find(e=>sourceAID(e)==='5989563');
assert(sameFamilyMaamar&&sameFamilySicha);
assert.equal(sameFamilyMaamar.evidence_family_id,sameFamilySicha.evidence_family_id);
assert.equal(sameFamilyMaamar.independent_witness,false);
assert(sameFamilyMaamar.relations.some(r=>r.type==='same_evidence_family'&&r.target_id==='sicha-5728-21-kislev-aid5989563'));
const batch102Enriched2989585=idx.entries.find(e=>sourceAID(e)==='2989585');
assert(enriched2989585&&batch102Enriched2989585.canonical_file==='data/items/content-research-batch-100-2026-11-15.json');
assert.equal(batch102Enriched2989585.response_propositions.length,16);
assert.equal(batch102Enriched2989585.response_proposition_locators.length,16);
assert(batch102Enriched2989585.response_propositions.some(p=>p.includes('שפלות רוחנית')&&p.includes('מניעות')));
assert.equal(batch102Enriched2989585.status,'Parsed');
assert.equal(batch102Data.existing_identity_updates[0].aid,2989585);
assert(!queue.records.some(q=>String(q.key||'')==='aid:2989237'||String(q.key||'')==='aid:5989562'));

// Cross-family synthesis: two separately dated Hebrew talks on learning,
// public speech at a farbrengen and practical Torah/mitzvah action.
const torahActionQuestion='ערוך השוואה בין שיחת י״ט כסלו על אמירת מטרת ההתכנסות בקול לבין שיחת כ׳ כסלו על הארכת ההתוועדות בלימוד תורה והמשכתה לקיום מצוות.';
const crossFamilyEntries=idx.entries.filter(e=>['5989562','4385757'].includes(sourceAID(e)));
assert.equal(crossFamilyEntries.length,2);
for(const mode of ['regular','researcher']){
 const answerEntries=mode==='researcher'?crossFamilyEntries:idx.entries;
 const m=buildAnswerModel(answerEntries,torahActionQuestion,{mode});
 assert(m.answerable,mode+': two inspected Hebrew Evidence Families should support the Torah-learning/action comparison');
 assert(m.sources.some(e=>sourceAID(e)==='5989562'));
 assert(m.sources.some(e=>sourceAID(e)==='4385757'));
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length&&c.source_locators.length));
 assert(m.citation_entailment.every(x=>x.valid));
 assert(m.context_boundary.every(x=>x.valid));
 if(mode==='researcher'){
  assert.equal(m.research.depth,'deep');
  assert(m.research.evidence_families>=2);
  assert.equal(m.research.claim_source_map.length,m.claims.length);
  assert(m.research.claim_source_map.every(c=>c.source_numbers.length&&c.source_locators.length));
  assert(m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));
 }else assert.equal(m.research,undefined);
}

 
// Batch 103: source-body inspection, non-independent translation linkage and in-place enrichment.
const batch103Path='data/items/content-research-batch-103-2026-11-15.json';
const batch103Data=JSON.parse(await readFile(new URL(batch103Path,root)));
const batch103Aids=batch103Data.records.map(r=>String(r.aid));
assert.equal(batch103Data.records.length,12);
assert.equal(batch103Data.reviewed_item_count,21);
assert.equal(batch103Data.source_bodies_inspected,13);
assert.equal(batch103Data.new_source_identities,12);
assert.equal(batch103Data.existing_identities_enriched,1);
assert.equal(batch103Data.new_response_propositions,25);
assert.equal(batch103Data.existing_response_propositions_added,1);
assert.equal(batch103Data.total_new_paraphrase_entries,25);
assert.equal(batch103Data.answer_eligible_source_families_added,11);
assert.equal(batch103Data.independent_witnesses_added,9);
assert.equal(batch103Data.non_independent_presentations_added,3);
assert.equal(batch103Data.content_verified_unique_sources_added,0);
assert.equal(batch103Data.blocked_candidate_count,1);
assert.equal(batch103Data.metadata_only_candidate_count,7);
assert.equal(batch103Data.crawler_retry,false);
assert.equal(batch103Data.access_control_bypassed,false);
assert.equal(batch103Data.full_text_copied,false);
assert.equal(batch103Data.translations_counted_as_independent_witnesses,0);
assert.deepEqual(batch103Data.metrics_before,{answer_eligible_unique_sources:1009,content_verified_unique_sources:854,answer_eligible_propositions:3018});
assert.deepEqual(batch103Data.metrics_expected_after,{answer_eligible_unique_sources:1020,content_verified_unique_sources:854,answer_eligible_propositions:3043});
assert.equal(batch103Data.reconciliation_status,'reconciled');
assert.deepEqual(readinessMetrics(batch103Data.metrics_actual_after),batch103Data.metrics_expected_after);
assert.deepEqual(batch103Data.reconciliation_variance,{answer_eligible_unique_sources:0,content_verified_unique_sources:0,answer_eligible_propositions:0});
assert.equal(batch103Data.deduplication_check.full_index_scan_available,true);
assert.deepEqual(batch103Data.deduplication_check.canonical_identity_collisions,[]);
assert.deepEqual(batch103Data.deduplication_check.missing_canonical_identities,[]);
assert.equal(batch103Data.deduplication_check.all_target_identities_answer_eligible,true);
assert.equal(new Set(batch103Aids).size,12);
assert.equal(new Set(batch103Data.records.map(r=>r.evidence_family_id)).size,11);
assert.equal(new Set(batch103Data.records.map(r=>r.source_url)).size,12);
assert.deepEqual(batch103Data.records.reduce((a,r)=>(a[r.language]=(a[r.language]||0)+1,a),{}),{Hebrew:10,English:2});
assert.equal(batch103Data.records.filter(r=>r.source_class==='Sichos').length,6);
assert.equal(batch103Data.records.filter(r=>r.source_class==='Maamarim').length,5);
assert.equal(batch103Data.records.filter(r=>r.source_class==='Correspondence').length,1);
assert.equal(batch103Data.records.filter(r=>r.independent_witness===false).length,3);
assert.equal(batch103Data.records.reduce((n,r)=>n+r.response_propositions.length,0),25);
assert.equal(batch103Data.source_body_recheck.source_bodies_reopened,12);
assert.equal(batch103Data.source_body_recheck.new_response_propositions_added,1);
assert.equal(batch103Data.records.find(r=>String(r.aid)==='5989700').response_propositions.length,3);
assert(batch103Data.records.find(r=>String(r.aid)==='5989700').response_propositions[2].includes('אין לשנות את התורה'));
const educationMission103=batch103Data.records.find(r=>String(r.aid)==='3008913');
assert(educationMission103.response_propositions[0].includes('שליחות חינוכית'));
assert(educationMission103.response_propositions[1].includes('האם'));
assert(educationMission103.response_proposition_locators[0].includes('237–238'));
assert(educationMission103.response_proposition_locators[1].includes('234–236'));
const publicAvodah103=batch103Data.records.find(r=>String(r.aid)==='4279912');
assert(publicAvodah103.response_proposition_locators[0].includes('249–258'));
assert(publicAvodah103.response_proposition_locators[1].includes('258–262'));
for(const r of batch103Data.records){
 const aid=String(r.aid),matches=idx.entries.filter(e=>sourceAID(e)===aid);
 assert.equal(matches.length,1,'batch-103 AID '+aid+' must have exactly one canonical index identity');
 const e=matches[0];
 assert(e.has_content_evidence&&e.response_propositions.length===r.response_propositions.length);
 assert.equal(e.canonical_file,batch103Path);
 assert.equal(e.status,'Parsed');
 assert.equal(e.context_status,'partial');
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope&&e.witness_provenance);
 assert.equal(e.response_proposition_locators.length,e.response_propositions.length);
 assert(e.response_proposition_locators.every(Boolean));
 assert.equal(e.evidence_family_id,r.evidence_family_id);
 assert.equal(e.independent_witness,r.independent_witness);
}
const translatedYiddishHe=idx.entries.find(e=>sourceAID(e)==='3008869');
const translatedYiddishEn=idx.entries.find(e=>sourceAID(e)==='4418266');
assert(translatedYiddishHe&&translatedYiddishEn);
assert.equal(translatedYiddishHe.evidence_family_id,translatedYiddishEn.evidence_family_id);
assert.equal(translatedYiddishHe.independent_witness,false);
assert.equal(translatedYiddishEn.independent_witness,false);
assert.equal(translatedYiddishHe.original_language,'Yiddish');
assert.equal(translatedYiddishEn.original_language,'Yiddish');
const translatedLetter=idx.entries.find(e=>sourceAID(e)==='2277093');
assert(translatedLetter&&translatedLetter.type==='letter');
assert.equal(translatedLetter.independent_witness,false);
assert.equal(translatedLetter.original_language,'unknown');
assert.equal(batch103Data.existing_identity_updates[0].aid,2989585);

// Cross-source synthesis regression: public mission and personal avodah, with claim-level citations.
const batch104Path='data/items/content-research-batch-104-2026-11-15.json';
const batch104Data=JSON.parse(await readFile(new URL(batch104Path,root)));
assert.equal(batch104Data.records.length,1);
assert.equal(batch104Data.new_source_identities,1);
assert.equal(batch104Data.existing_identities_enriched,1);
assert.equal(batch104Data.answer_eligible_source_families_added,0);
assert.equal(batch104Data.new_response_propositions,0);
assert.equal(batch104Data.reused_same_family_propositions,3);
assert.equal(batch104Data.records[0].aid,4872269);
assert.equal(batch104Data.records[0].evidence_family_id,'igrot-letter-5715-11-tevet-aid4872269');
assert.equal(batch104Data.records[0].independent_witness,true);
assert.equal(batch104Data.records[0].status,'Verified');
assert.equal(batch104Data.records[0].response_propositions.length,3);
assert.equal(batch104Data.records[0].response_proposition_locators.length,3);
assert.equal(batch104Data.metrics_expected_after.answer_eligible_unique_sources,1020);
assert.equal(batch104Data.metrics_expected_after.content_verified_unique_sources,854);
assert.equal(batch104Data.metrics_expected_after.answer_eligible_propositions,3043);
assert.equal(batch104Data.reconciliation_status,'reconciled');
assert.deepEqual(readinessMetrics(batch104Data.metrics_actual_after),batch104Data.metrics_expected_after);
assert.deepEqual(batch104Data.reconciliation_variance,{answer_eligible_unique_sources:0,content_verified_unique_sources:0,answer_eligible_propositions:0});
assert(batch104Data.deduplication_check.full_index_scan_available);
assert.equal(batch104Data.deduplication_check.canonical_identity_collisions.length,0);
assert.equal(batch104Data.deduplication_check.all_target_identities_answer_eligible,true);
const missionBalanceQuestion='השווה בין שיחת ט׳ אלול ה׳תשי״ח לבין שיחת כ״ח סיון ה׳תשי״ב: כיצד מתוארת שליחות חינוכית והשפעה על הזולת, ומה מוסיפה השיחה השנייה על הגבלת זמן העסקנות ושמירה על העבודה האישית?';
const missionEntries=idx.entries.filter(e=>['3008913','4279912'].includes(sourceAID(e)));
assert.equal(missionEntries.length,2);
for(const mode of ['regular','researcher']){
 const answerEntries=missionEntries;
 const m=buildAnswerModel(answerEntries,missionBalanceQuestion,{mode});
 assert(m.answerable,mode+': inspected Sicha pair should support mission/personal-work synthesis');
 assert(m.sources.some(e=>sourceAID(e)==='3008913'));
 assert(m.sources.some(e=>sourceAID(e)==='4279912'));
 assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=2);
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length));
 assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));
 if(mode==='researcher'){
  assert(m.research&&m.research.evidence_families>=2);
  assert(m.research.evidence_map.length>0&&m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));
  assert.equal(m.research.claim_source_map.length,m.claims.length);
  assert(m.research.claim_source_map.every(c=>c.source_numbers.length&&c.source_locators.length));
 }else assert.equal(m.research,undefined);
}


// Batch 106: eight new Hebrew source identities, one in-place enrichment, one recheck,
// blocked-page fallback, and multi-source claim-local citations in deep researcher mode.
const batch106Path='data/items/content-research-batch-106-2026-11-16.json';
const batch106Data=JSON.parse(await readFile(new URL(batch106Path,root)));
const batch106Aids=['2989153','2989320','2989243','4304434','5959845','2988989','5990037','5989929'];
assert.equal(batch106Data.records.length,8);assert.equal(batch106Data.new_source_identities,8);
assert.equal(batch106Data.existing_identities_enriched,1);assert.equal(batch106Data.existing_identities_rechecked,1);
assert.equal(batch106Data.new_response_propositions,11);assert.equal(batch106Data.existing_response_propositions_added,1);
assert.equal(batch106Data.total_new_paraphrase_entries,12);assert.equal(batch106Data.answer_eligible_source_families_added,8);
assert.equal(batch106Data.content_verified_unique_sources_added,0);assert.equal(batch106Data.source_bodies_inspected,10);
assert.equal(batch106Data.reviewed_item_count,11);assert.equal(batch106Data.blocked_candidate_count,1);
assert.equal(batch106Data.fallback_source_attempted,true);assert.equal(batch106Data.crawler_retry,false);
assert.equal(batch106Data.access_control_bypassed,false);assert.equal(batch106Data.full_text_copied,false);
assert.equal(batch106Data.scan_only_verification_used,false);assert.equal(batch106Data.translations_counted_as_independent_witnesses,0);
assert.deepEqual(batch106Data.metrics_before,{answer_eligible_unique_sources:1033,content_verified_unique_sources:854,answer_eligible_propositions:3070});
assert.deepEqual(batch106Data.metrics_expected_after,{answer_eligible_unique_sources:1041,content_verified_unique_sources:854,answer_eligible_propositions:3089});
const batch106Actual=readinessMetrics(batch106Data.metrics_actual_after);
assert(['reconciled','reconciled_with_variance'].includes(batch106Data.reconciliation_status));
assert.deepEqual(batch106Data.reconciliation_variance,{
 answer_eligible_unique_sources:batch106Actual.answer_eligible_unique_sources-batch106Data.metrics_expected_after.answer_eligible_unique_sources,
 content_verified_unique_sources:batch106Actual.content_verified_unique_sources-batch106Data.metrics_expected_after.content_verified_unique_sources,
 answer_eligible_propositions:batch106Actual.answer_eligible_propositions-batch106Data.metrics_expected_after.answer_eligible_propositions
});
assert(batch106Data.deduplication_check.full_index_scan_available);
assert.deepEqual(batch106Data.deduplication_check.canonical_identity_collisions,[]);
assert.deepEqual(batch106Data.deduplication_check.missing_canonical_identities,[]);
assert.equal(batch106Data.deduplication_check.all_target_identities_answer_eligible,true);
assert.equal(new Set(batch106Data.records.map(r=>String(r.aid))).size,8);
assert.equal(new Set(batch106Data.records.map(r=>r.evidence_family_id)).size,8);
assert.equal(batch106Data.records.reduce((n,r)=>n+r.response_propositions.length,0),25);
assert.equal(batch106Data.records.filter(r=>r.language==='Hebrew'&&r.original_language==='Hebrew').length,8);
assert(batch106Data.source_body_review.every(r=>!('aid' in r)&&!('id' in r)&&!('evidence_family_id' in r)),'source_body_review is audit metadata, not a second canonical source record');
for(const r of batch106Data.records){
 assert.equal(r.status,'Parsed');assert.equal(r.pipeline_status,'Parsed');assert.equal(r.canonical_status,'Parsed');
 assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);assert.equal(r.proposition_verification,'source_text_inspected');
 assert(r.proposition_source_locator&&r.provenance&&r.verification_scope&&r.context_status==='partial'&&r.has_content_evidence);
 assert(r.response_propositions.length>0&&r.response_propositions.length===r.response_proposition_locators.length);assert.equal(r.independent_witness,true);
}
for(const aid of batch106Aids){
 const matches=idx.entries.filter(e=>sourceAID(e)===aid);assert.equal(matches.length,1,'batch-106 AID '+aid+' must have exactly one canonical identity');
 const e=matches[0];assert(e&&e.has_content_evidence);assert.equal(e.status,'Parsed');assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');assert(e.proposition_source_locator&&e.verification_scope);
 assert(!queue.records.some(q=>String(q.aid||'')===aid||String(q.key||'')==='aid:'+aid||String(q.source_url||'').includes('/aid/'+aid+'/')));
}
const enriched2989153=idx.entries.find(e=>sourceAID(e)==='2989153');
assert(enriched2989153&&enriched2989153.response_propositions.length===13,'AID 2989153 must remain one enriched identity with thirteen source-grounded propositions');
assert(enriched2989153.response_proposition_locators.some(l=>String(l).includes('207–210')));assert(enriched2989153.response_proposition_locators.some(l=>String(l).includes('199–203')));assert(enriched2989153.response_proposition_locators.some(l=>String(l).includes('189–191')));
assert.equal(enriched2989153.evidence_family_id,'sicha-5713-20-menachem-av-akev-aid2989153');
const enriched5959840=idx.entries.find(e=>sourceAID(e)==='5959840');
assert(enriched5959840&&enriched5959840.response_propositions.length===3,'AID 5959840 must be enriched in place, not duplicated');
assert(enriched5959840.response_proposition_locators.some(l=>String(l).includes('171–177')));
assert.equal(enriched5959840.evidence_family_id,'sicha-5728-24-sivan-shelach-aid5959840');
const rechecked2989386=idx.entries.find(e=>sourceAID(e)==='2989386');
assert(rechecked2989386&&rechecked2989386.response_propositions.length===2,'AID 2989386 remains its existing identity with no duplicate proposition');
assert.equal(batch106Data.existing_identity_updates[0].aid,5959840);assert.equal(batch106Data.existing_identity_rechecks[0].aid,2989386);
assert.equal(batch106Data.blocked_candidates[0].aid,4543720);assert.equal(batch106Data.deduplication_check.translations_counted_as_independent_witnesses,0);
const restraintWorkQuestion='מה עולה מן השיחות על נדרים ופרישות בעניינים גשמיים, ועל שילוב תורה, מלאכה וגמילות חסדים בעבודת ה׳?';
const crossSourceEvidence=idx.entries.filter(e=>['2989243','5959845'].includes(sourceAID(e)));
assert.equal(crossSourceEvidence.length,2,'the full index must contain one canonical record for each distinct source family');
const regularSynthesis=buildAnswerModel(crossSourceEvidence,restraintWorkQuestion,{mode:'regular'});
assert(regularSynthesis.answerable,'the two inspected source families must support a bounded cross-source synthesis');
assert(regularSynthesis.sources.some(e=>sourceAID(e)==='2989243'),'the vows/restraint source must be retrieved from the full corpus');
assert(regularSynthesis.sources.some(e=>sourceAID(e)==='5959845'),'the Torah/work/gemilut chasadim source must be retrieved from the full corpus');
assert(new Set(regularSynthesis.sources.map(e=>e.evidence_family_id)).size>=2,'retrieval must preserve distinct Evidence Families');
assert(regularSynthesis.claims.length>=2&&regularSynthesis.claims.every(c=>c.source_numbers.length&&c.source_locators.length),'each regular claim must have source-local citations');
assert(regularSynthesis.citation_entailment.every(x=>x.valid)&&regularSynthesis.context_boundary.every(x=>x.valid),'regular claims must pass entailment and context-boundary checks');
assert.equal(regularSynthesis.research,undefined);
const researcherSynthesis=buildAnswerModel(regularSynthesis.sources,restraintWorkQuestion,{mode:'researcher'});
assert(researcherSynthesis.answerable,'deep researcher synthesis must work on the retrieved evidence set');
assert(researcherSynthesis.sources.some(e=>sourceAID(e)==='2989243')&&researcherSynthesis.sources.some(e=>sourceAID(e)==='5959845'));
assert(new Set(researcherSynthesis.sources.map(e=>e.evidence_family_id)).size>=2);
assert(researcherSynthesis.claims.length>=2&&researcherSynthesis.claims.every(c=>c.source_numbers.length&&c.source_locators.length));
assert(researcherSynthesis.citation_entailment.every(x=>x.valid)&&researcherSynthesis.context_boundary.every(x=>x.valid));
assert.equal(researcherSynthesis.research.depth,'deep');
assert(researcherSynthesis.research.claim_source_map.length===researcherSynthesis.claims.length);
assert(researcherSynthesis.research.claim_source_map.every(c=>c.source_numbers.length&&c.source_locators.length));
assert(researcherSynthesis.research.evidence_map.length>0&&researcherSynthesis.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));

 
// Batch 107: ten new identities, one in-place Hebrew enrichment, blocked-source fallback,
// no translation inflation, and claim-local multi-source synthesis in deep researcher mode.
const batch107Path='data/items/content-research-batch-107-2026-11-16.json';
const batch107Data=JSON.parse(await readFile(new URL(batch107Path,root)));
const batch107Aids=['2282092','2279298','5920875','2282134','2282093','2279300','4544402','4772806','5430533','4736086'];
assert.equal(batch107Data.records.length,10);assert.equal(batch107Data.new_source_identities,10);
assert.equal(batch107Data.existing_identities_enriched,1);assert.equal(batch107Data.existing_response_propositions_added,1);
assert.equal(batch107Data.new_response_propositions,20);assert.equal(batch107Data.total_new_paraphrase_entries,21);
assert.equal(batch107Data.answer_eligible_source_families_added,10);assert.equal(batch107Data.content_verified_unique_sources_added,0);
assert.equal(batch107Data.source_bodies_inspected,11);assert.equal(batch107Data.source_body_pages_opened,12);
assert.equal(batch107Data.reviewed_item_count,21);assert.equal(batch107Data.blocked_candidate_count,9);
assert.equal(batch107Data.excluded_candidate_count,1);assert.equal(batch107Data.blocked_candidates.length,9);
assert.equal(batch107Data.excluded_candidates[0].aid,6429726);
assert.equal(batch107Data.fallback_source_attempted,true);assert.equal(batch107Data.fallback_source_results.accessible_item_level_bodies,10);
assert.equal(batch107Data.crawler_retry,false);assert.equal(batch107Data.access_control_bypassed,false);
assert.equal(batch107Data.full_text_copied,false);assert.equal(batch107Data.scan_only_verification_used,false);
assert.equal(batch107Data.search_extracts_used_as_content,0);assert.equal(batch107Data.translations_counted_as_independent_witnesses,0);
assert.equal(batch107Data.independent_witnesses_added,4);assert.equal(batch107Data.non_independent_presentations_added,6);
assert.deepEqual(batch107Data.metrics_before,{answer_eligible_unique_sources:1041,content_verified_unique_sources:854,answer_eligible_propositions:3089});
assert.deepEqual(batch107Data.metrics_expected_after,{answer_eligible_unique_sources:1051,content_verified_unique_sources:854,answer_eligible_propositions:3111});
assert.equal(batch107Data.records.reduce((n,r)=>n+r.response_propositions.length,0),24);
assert.equal(new Set(batch107Data.records.map(r=>String(r.aid))).size,10);
assert.equal(new Set(batch107Data.records.map(r=>r.evidence_family_id)).size,10);
assert.equal(batch107Data.records.filter(r=>r.language==='English'&&r.original_language==='unknown'&&r.independent_witness===false).length,6);
assert.equal(batch107Data.records.filter(r=>r.language==='Yiddish'&&r.original_language==='Yiddish'&&r.independent_witness===true).length,4);
assert(batch107Data.source_body_review.every(r=>!('aid' in r)&&!('id' in r)&&!('evidence_family_id' in r)),'source_body_review must remain audit metadata');
for(const r of batch107Data.records){
 assert.equal(r.status,'Parsed');assert.equal(r.pipeline_status,'Parsed');assert.equal(r.canonical_status,'Parsed');
 assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);
 assert.equal(r.proposition_verification,'source_text_inspected');assert.equal(r.proposition_language,'Hebrew');
 assert(r.proposition_source_locator&&r.provenance&&r.verification_scope&&r.context_status==='partial'&&r.has_content_evidence);
 const expectedPropCount=['4736086','5430533'].includes(String(r.aid))?4:2;
 assert(r.response_propositions.length===expectedPropCount&&r.response_propositions.length===r.response_proposition_locators.length);
}
for(const aid of batch107Aids){
 const matches=idx.entries.filter(e=>sourceAID(e)===aid);assert.equal(matches.length,1,'batch-107 AID '+aid+' must have exactly one canonical index identity');
 const e=matches[0];assert(e&&e.has_content_evidence);assert.equal(e.status,'Parsed');
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');assert(e.proposition_source_locator&&e.verification_scope);
 assert(!queue.records.some(q=>String(q.aid||'')===aid||String(q.key||'')==='aid:'+aid||String(q.source_url||'').includes('/aid/'+aid+'/')));
}
assert.equal(batch107Data.existing_identity_updates[0].aid,2989153);
assert.equal(batch107Data.existing_identity_updates[0].propositions_added,1);
assert.equal(batch107Data.existing_identity_updates[0].total_propositions_after,2);
assert.equal(batch107Data.existing_identity_updates[0].canonical_file,batch106Path);
const choiceEntry=idx.entries.find(e=>sourceAID(e)==='2989153');
assert(choiceEntry&&choiceEntry.response_propositions.length===10&&choiceEntry.response_proposition_locators.some(l=>String(l).includes('207–210'))&&choiceEntry.response_proposition_locators.some(l=>String(l).includes('199–203'))&&choiceEntry.response_proposition_locators.some(l=>String(l).includes('189–191'))&&choiceEntry.response_proposition_locators.some(l=>String(l).includes('247–256'))&&choiceEntry.response_proposition_locators.some(l=>String(l).includes('243–244')));
const choiceQuestion='מה מציעה שיחת עקב תשי״ג לעשות כאשר אדם ניצב בפני שתי דרכי עבודה ואינו יודע במה לבחור?';
const choiceModel=buildAnswerModel([choiceEntry],choiceQuestion,{mode:'researcher'});
assert(choiceModel.answerable&&choiceModel.sources.some(e=>sourceAID(e)==='2989153'));
assert(choiceModel.claims.length>0&&choiceModel.claims.every(c=>c.source_numbers.length&&c.source_locators.length));
assert(choiceModel.research&&choiceModel.research.depth==='deep'&&choiceModel.research.claim_source_map.length===choiceModel.claims.length);
assert(choiceModel.research.claim_source_map.every(c=>c.source_numbers.length&&c.source_locators.length));
const chassidusDisseminationQuestion='כיצד השיחה מסבירה את ההוראה להפיץ עניינים עמוקים בחסידות גם למי שעדיין אינו אוחז בהם, ומה תפקיד ההבנה השכלית ביחס לרגש הלב?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel([choiceEntry],chassidusDisseminationQuestion,{mode});
 assert(m.answerable,mode+': section 9 on intellectual work, dissemination and later emotional internalization must be retrievable');
 assert(m.sources.some(e=>sourceAID(e)==='2989153'));
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length&&c.source_locators.length));
 assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));
 if(mode==='researcher'){
  assert(m.research&&m.research.depth==='deep');
  assert(m.research.claim_source_map.length===m.claims.length);
  assert(m.research.claim_source_map.every(c=>c.source_numbers.length&&c.source_locators.length));
  assert(m.research.evidence_map.length>0&&m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));
 }else assert.equal(m.research,undefined);
}
const generosityEntries=idx.entries.filter(e=>['5920875','4772806'].includes(sourceAID(e)));
assert.equal(generosityEntries.length,2);
const generosityQuestion='כיצד מתארים המקורות את התמיכה בלימוד תורה לאחרים ואת ההשקעה בחינוך של ילדים שאינם ילדיו של אדם?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(generosityEntries,generosityQuestion,{mode});
 assert(m.answerable,mode+': Letter 92 and Vayeira should support bounded cross-source synthesis');
 assert(m.sources.some(e=>sourceAID(e)==='5920875')&&m.sources.some(e=>sourceAID(e)==='4772806'));
 assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=2);
 assert(m.claims.length>=2&&m.claims.every(c=>c.source_numbers.length&&c.source_locators.length));
 assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));
 if(mode==='researcher'){
  assert(m.research&&m.research.depth==='deep');
  assert(m.research.evidence_map.length>0&&m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));
  assert.equal(m.research.claim_source_map.length,m.claims.length);
  assert(m.research.claim_source_map.every(c=>c.source_numbers.length&&c.source_locators.length));
 }else assert.equal(m.research,undefined);
}
const batch107Actual=readinessMetrics(batch107Data.metrics_actual_after);
assert(['reconciled','reconciled_with_variance'].includes(batch107Data.reconciliation_status));

assert.deepEqual(batch107Data.reconciliation_variance,{
 answer_eligible_unique_sources:batch107Actual.answer_eligible_unique_sources-batch107Data.metrics_expected_after.answer_eligible_unique_sources,
 content_verified_unique_sources:batch107Actual.content_verified_unique_sources-batch107Data.metrics_expected_after.content_verified_unique_sources,
 answer_eligible_propositions:batch107Actual.answer_eligible_propositions-batch107Data.metrics_expected_after.answer_eligible_propositions
});
assert(batch107Data.deduplication_check.full_index_scan_available);
assert.deepEqual(batch107Data.deduplication_check.canonical_identity_collisions,[]);
assert.deepEqual(batch107Data.deduplication_check.missing_canonical_identities,[]);
assert.equal(batch107Data.deduplication_check.all_target_identities_answer_eligible,true);
assert(acquisitionState.manual_web_review_history.some(x=>String(x.batch_id)==='111'&&x.batch_file==='data/items/content-research-batch-111-2026-11-16.json'));

const batch108Path='data/items/content-research-batch-108-2026-11-16.json';
const batch108Data=JSON.parse(await readFile(new URL(batch108Path,root)));
assert.equal(batch108Data.records.length,0);
assert.equal(batch108Data.reviewed_item_count,10);
assert.equal(batch108Data.source_bodies_inspected,10);
assert.equal(batch108Data.existing_identities_enriched,8);
assert.equal(batch108Data.existing_identities_rechecked,2);
assert.equal(batch108Data.existing_response_propositions_added,8);
assert.equal(batch108Data.new_source_identities,0);
assert.equal(batch108Data.new_response_propositions,0);
assert.equal(batch108Data.answer_eligible_source_families_added,0);
assert.equal(batch108Data.content_verified_unique_sources_added,0);
assert.equal(batch108Data.translations_counted_as_independent_witnesses,0);
assert.equal(batch108Data.fallback_source_attempted,true);
assert.equal(batch108Data.fallback_source_results.accessible_item_level_bodies,10);
assert.equal(batch108Data.blocked_candidates.length,2);
assert.equal(batch108Data.source_body_review.length,10);
assert(batch108Data.source_body_review.every(r=>!('aid' in r)&&!('id' in r)&&!('evidence_family_id' in r)));
assert.deepEqual(batch108Data.metrics_before,{answer_eligible_unique_sources:1051,content_verified_unique_sources:854,answer_eligible_propositions:3111});
assert.deepEqual(batch108Data.metrics_expected_after,batch108Data.metrics_before);
assert.equal(batch108Data.reconciliation_status,'reconciled_with_variance');
const batch108Actual=readinessMetrics(batch108Data.metrics_actual_after);

assert.deepEqual(batch108Data.reconciliation_variance,{
 answer_eligible_unique_sources:batch108Actual.answer_eligible_unique_sources-batch108Data.metrics_expected_after.answer_eligible_unique_sources,
 content_verified_unique_sources:batch108Actual.content_verified_unique_sources-batch108Data.metrics_expected_after.content_verified_unique_sources,
 answer_eligible_propositions:batch108Actual.answer_eligible_propositions-batch108Data.metrics_expected_after.answer_eligible_propositions
});
assert(batch108Data.deduplication_check.full_index_scan_available);
assert.deepEqual(batch108Data.deduplication_check.canonical_identity_collisions,[]);
assert.deepEqual(batch108Data.deduplication_check.missing_canonical_identities,[]);
for(const aid of batch108Data.enriched_aids){
 const e=idx.entries.find(x=>sourceAID(x)===String(aid));
 assert(e&&e.has_content_evidence,'batch-108 AID '+aid+' must remain one content-bearing identity');
 assert.equal(e.status,'Parsed');
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.provenance&&e.verification_scope);
 assert(e.response_propositions.length===e.response_proposition_locators.length);
}
for(const aid of [2989153,4304434,5959845,2988989,5990037,5989929,4736086,5430533]){
 const e=idx.entries.find(x=>sourceAID(x)===String(aid));
 assert(e&&e.response_propositions.length>0);
 assert.equal(e.independent_witness,true);
}
const yiddishEducation=idx.entries.find(e=>sourceAID(e)==='4736086');
assert(yiddishEducation&&yiddishEducation.response_propositions.some(p=>String(p).includes('שמונה ימים')));
const yiddishIdolatry=idx.entries.find(e=>sourceAID(e)==='5430533');
assert(yiddishIdolatry&&yiddishIdolatry.response_propositions.some(p=>String(p).includes('כוכבים ומזלות')));
assert(acquisitionState.manual_web_review_history.some(x=>String(x.batch_id)==='110'));
assert.equal(acquisitionState.manual_web_review_current_metrics.answer_eligible_propositions,metrics.answer_eligible_propositions);

const batch109Path='data/items/content-research-batch-109-2026-11-16.json';
const batch109Data=JSON.parse(await readFile(new URL(batch109Path,root)));
const batch109Aids=['2989153','4304434','5959845','2988989','5990037','5989929','4736086','5430533'];
assert.equal(batch109Data.records.length,0);
assert.equal(batch109Data.reviewed_item_count,8);
assert.equal(batch109Data.source_bodies_inspected,8);
assert.equal(batch109Data.source_body_pages_opened,8);
assert.equal(batch109Data.existing_identities_enriched,8);
assert.equal(batch109Data.existing_response_propositions_added,8);
assert.equal(batch109Data.new_source_identities,0);
assert.equal(batch109Data.new_response_propositions,0);
assert.equal(batch109Data.answer_eligible_source_families_added,0);
assert.equal(batch109Data.content_verified_unique_sources_added,0);
assert.equal(batch109Data.translations_counted_as_independent_witnesses,0);
assert.equal(batch109Data.blocked_candidate_count,0);
assert.equal(batch109Data.fallback_source_attempted,false);
assert.equal(batch109Data.crawler_retry,false);
assert.equal(batch109Data.access_control_bypassed,false);
assert.equal(batch109Data.full_text_copied,false);
assert.equal(batch109Data.scan_only_verification_used,false);
assert.deepEqual(batch109Data.enriched_aids.map(String),batch109Aids);
assert.deepEqual(batch109Data.metrics_before,{answer_eligible_unique_sources:1051,content_verified_unique_sources:854,answer_eligible_propositions:3111});
assert.deepEqual(batch109Data.metrics_expected_after,{answer_eligible_unique_sources:1051,content_verified_unique_sources:854,answer_eligible_propositions:3111});
assert.deepEqual(batch109Data.metrics_delta_at_batch_boundary,{answer_eligible_unique_sources:0,content_verified_unique_sources:0,answer_eligible_propositions:0});
assert.equal(batch109Data.source_body_review.length,8);
assert(batch109Data.source_body_review.every(r=>!('aid' in r)&&!('id' in r)&&!('evidence_family_id' in r)&&r.body_text_inspected&&r.source_grounded_paraphrase_added));
assert.equal(batch109Data.existing_identity_updates.length,8);
assert.equal(new Set(batch109Data.existing_identity_updates.map(x=>String(x.aid))).size,8);
assert.equal(new Set(batch109Data.evidence_family_ids).size,8);
assert.deepEqual(batch109Data.language_distribution,{Hebrew:6,Yiddish:2});
assert(['reconciled','reconciled_with_variance'].includes(batch109Data.reconciliation_status));
const batch109Actual=readinessMetrics(batch109Data.metrics_actual_after);
assert.deepEqual(batch109Data.reconciliation_variance,{answer_eligible_unique_sources:batch109Actual.answer_eligible_unique_sources-batch109Data.metrics_expected_after.answer_eligible_unique_sources,content_verified_unique_sources:batch109Actual.content_verified_unique_sources-batch109Data.metrics_expected_after.content_verified_unique_sources,answer_eligible_propositions:batch109Actual.answer_eligible_propositions-batch109Data.metrics_expected_after.answer_eligible_propositions});
assert(batch109Data.deduplication_check.full_index_scan_available);
assert.deepEqual(batch109Data.deduplication_check.canonical_identity_collisions,[]);
assert.deepEqual(batch109Data.deduplication_check.missing_canonical_identities,[]);
assert.equal(batch109Data.deduplication_check.all_target_identities_answer_eligible,true);
for(const update of batch109Data.existing_identity_updates){
 const matches=idx.entries.filter(e=>sourceAID(e)===String(update.aid));
 assert.equal(matches.length,1,'batch-109 AID '+update.aid+' must remain one canonical identity');
 const e=matches[0];
 assert(e.has_content_evidence&&e.response_propositions.length===e.response_proposition_locators.length);
 assert.equal(e.evidence_family_id,update.evidence_family_id);
 assert.equal(e.status,'Parsed');
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.response_proposition_locators.includes(update.locator));
}
assert(acquisitionState.manual_web_review_history.some(x=>String(x.batch_id)==='110'));
assert(acquisitionState.manual_web_review_history.some(x=>String(x.batch_id)==='110'&&x.batch_file==='data/items/content-research-batch-110-2026-11-16.json'));
assert.deepEqual(readinessMetrics(acquisitionState.manual_web_review_current_metrics),readinessMetrics(metrics));


const batch114Data=JSON.parse(await readFile(new URL(batch114Path,root),'utf8'));
const batch114Aids=[528661,528662,528663,528664,528665,528666,528667,528668,528669,528670,528671,528672];
assert.equal(batch114Data.batch_id,'114');assert.equal(batch114Data.records.length,12);assert.deepEqual(batch114Data.new_aids,batch114Aids);
assert.deepEqual(batch114Data.enriched_aids,[5959845]);assert.equal(batch114Data.new_source_identities,12);assert.equal(batch114Data.existing_identities_enriched,1);
assert.equal(batch114Data.new_response_propositions,12);assert.equal(batch114Data.existing_response_propositions_added,1);assert.equal(batch114Data.total_new_paraphrase_entries,13);
assert.equal(batch114Data.answer_eligible_source_families_added,12);assert.equal(batch114Data.independent_witnesses_added,12);assert.equal(batch114Data.content_verified_unique_sources_added,0);
assert.equal(batch114Data.source_bodies_inspected,13);assert.equal(batch114Data.source_body_pages_opened,13);assert.equal(batch114Data.source_body_review.length,13);
assert(batch114Data.source_body_review.every(r=>r.inspected_original_language_body===true&&r.body_locator));
assert.deepEqual(batch114Data.language_distribution,{Hebrew:9,Yiddish:3});assert.deepEqual(batch114Data.original_language_distribution,{Hebrew:9,Yiddish:3});
assert.equal(batch114Data.records.reduce((n,r)=>n+r.response_propositions.length,0),12);assert.equal(new Set(batch114Data.records.map(r=>String(r.aid))).size,12);
assert.equal(new Set(batch114Data.records.map(r=>r.evidence_family_id)).size,12);assert.equal(batch114Data.blocked_candidate_count,1);assert.equal(batch114Data.fallback_source_attempted,true);
assert.equal(batch114Data.fallback_source_results.body_text_inspected,true);assert.equal(batch114Data.fallback_source_results.accessible_item_level_bodies,12);
assert.equal(batch114Data.crawler_retry,false);assert.equal(batch114Data.access_control_bypassed,false);assert.equal(batch114Data.full_text_copied,false);
assert.equal(batch114Data.scan_only_verification_used,false);assert.equal(batch114Data.translations_counted_as_independent_witnesses,0);
assert.deepEqual(batch114Data.metrics_before,{answer_eligible_unique_sources:1091,content_verified_unique_sources:854,answer_eligible_propositions:3164});
assert.deepEqual(batch114Data.metrics_expected_after,{answer_eligible_unique_sources:1103,content_verified_unique_sources:854,answer_eligible_propositions:3177});
assert.deepEqual(batch114Data.metrics_delta_at_batch_boundary,{answer_eligible_unique_sources:12,content_verified_unique_sources:0,answer_eligible_propositions:13});
assert.equal(batch114Data.existing_identity_updates[0].total_propositions_after,7);
for(const r of batch114Data.records){assert.equal(r.status,'Parsed');assert.equal(r.pipeline_status,'Parsed');assert.equal(r.canonical_status,'Parsed');assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);assert.equal(r.proposition_verification,'source_text_inspected');assert(r.proposition_source_locator&&r.provenance&&r.verification_scope&&r.context_status==='partial'&&r.has_content_evidence);assert.equal(r.response_propositions.length,r.response_proposition_locators.length);assert.equal(r.independent_witness,true);assert.equal(r.translation_of_evidence_family_id,null);}
for(const aid of batch114Aids){const matches=idx.entries.filter(e=>sourceAID(e)===String(aid));assert.equal(matches.length,1,'batch-114 AID '+aid+' must have one canonical identity');const e=matches[0];assert(e.has_content_evidence);assert.equal(e.status,'Parsed');assert.equal(e.canonical_file,batch114Path);assert.equal(e.independent_witness,true);assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');assert(e.proposition_source_locator&&e.verification_scope);assert(!queue.records.some(q=>String(q.key||'')==='aid:'+aid||String(q.source_url||'').includes('/aid/'+aid+'/')));}

const batch115Data=JSON.parse(await readFile(new URL(batch115Path,root),'utf8'));
const batch115Aids=[528673,528674,528675,528676,528677,528679,528680,528681,528682,528683,528684];
assert.equal(batch115Data.batch_id,'115');assert.equal(batch115Data.records.length,11);assert.deepEqual(batch115Data.new_aids,batch115Aids);
assert.deepEqual(batch115Data.enriched_aids,[5959845]);assert.equal(batch115Data.new_source_identities,11);assert.equal(batch115Data.existing_identities_enriched,1);
assert.equal(batch115Data.new_response_propositions,11);assert.equal(batch115Data.existing_response_propositions_added,1);assert.equal(batch115Data.total_new_paraphrase_entries,12);
assert.equal(batch115Data.answer_eligible_source_families_added,11);assert.equal(batch115Data.independent_witnesses_added,11);assert.equal(batch115Data.content_verified_unique_sources_added,0);
assert.equal(batch115Data.source_bodies_inspected,12);assert.equal(batch115Data.source_body_pages_opened,13);assert.equal(batch115Data.source_body_review.length,12);assert.equal(batch115Data.metadata_only_items_rechecked,1);
assert(batch115Data.source_body_review.every(r=>r.inspected_original_language_body===true&&r.body_locator));
assert.deepEqual(batch115Data.language_distribution,{Hebrew:8,Yiddish:3});assert.deepEqual(batch115Data.original_language_distribution,{Hebrew:8,Yiddish:3});
assert.equal(batch115Data.records.reduce((n,r)=>n+r.response_propositions.length,0),11);assert.equal(new Set(batch115Data.records.map(r=>String(r.aid))).size,11);
assert.equal(new Set(batch115Data.records.map(r=>r.evidence_family_id)).size,11);assert.equal(batch115Data.blocked_candidate_count,1);assert.equal(batch115Data.fallback_source_attempted,true);
assert.equal(batch115Data.fallback_source_results.body_text_inspected,true);assert.equal(batch115Data.fallback_source_results.accessible_item_level_bodies,11);
assert.equal(batch115Data.excluded_candidates[0].aid,528678);assert.equal(batch115Data.blocked_candidates[0].aid,528673);
assert.equal(batch115Data.crawler_retry,false);assert.equal(batch115Data.access_control_bypassed,false);assert.equal(batch115Data.full_text_copied,false);
assert.equal(batch115Data.scan_only_verification_used,false);assert.equal(batch115Data.translations_counted_as_independent_witnesses,0);
assert.deepEqual(batch115Data.metrics_before,{answer_eligible_unique_sources:1103,content_verified_unique_sources:854,answer_eligible_propositions:3177});
assert.deepEqual(batch115Data.metrics_expected_after,{answer_eligible_unique_sources:1114,content_verified_unique_sources:854,answer_eligible_propositions:3189});
assert.deepEqual(batch115Data.metrics_delta_at_batch_boundary,{answer_eligible_unique_sources:11,content_verified_unique_sources:0,answer_eligible_propositions:12});
assert.equal(batch115Data.existing_identity_updates[0].total_propositions_after,8);
for(const r of batch115Data.records){assert.equal(r.status,'Parsed');assert.equal(r.pipeline_status,'Parsed');assert.equal(r.canonical_status,'Parsed');assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);assert.equal(r.proposition_verification,'source_text_inspected');assert(r.proposition_source_locator&&r.provenance&&r.verification_scope&&r.context_status==='partial'&&r.has_content_evidence);assert.equal(r.response_propositions.length,r.response_proposition_locators.length);assert.equal(r.independent_witness,true);assert.equal(r.translation_of_evidence_family_id,null);}
for(const aid of batch115Aids){const matches=idx.entries.filter(e=>sourceAID(e)===String(aid));assert.equal(matches.length,1,'batch-115 AID '+aid+' must have exactly one canonical identity');const e=matches[0];assert(e.has_content_evidence);assert.equal(e.status,'Parsed');assert.equal(e.canonical_file,batch115Path);assert.equal(e.independent_witness,true);assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');assert(e.proposition_source_locator&&e.verification_scope);assert(!queue.records.some(q=>String(q.key||'')==='aid:'+aid||String(q.source_url||'').includes('/aid/'+aid+'/')));}
const enriched5959845Batch115=idx.entries.find(e=>sourceAID(e)==='5959845');assert(enriched5959845Batch115&&enriched5959845Batch115.response_propositions.length===16);assert(enriched5959845Batch115.response_propositions.some(p=>p.includes('חלקו האפשרי של הרב')));assert(enriched5959845Batch115.response_proposition_locators.some(l=>String(l).includes('343–347')));
assert.equal(batch115Data.deduplication_check.full_index_scan_available,true);assert.deepEqual(batch115Data.deduplication_check.canonical_identity_collisions,[]);assert.deepEqual(batch115Data.deduplication_check.missing_canonical_identities,[]);assert.equal(batch115Data.deduplication_check.all_target_identities_answer_eligible,true);
assert(['reconciled','reconciled_with_variance'].includes(batch115Data.reconciliation_status));const batch116BoundaryData=JSON.parse(await readFile(new URL('data/items/content-research-batch-116-2026-11-16.json',root),'utf8'));const batch115Actual=readinessMetrics(batch115Data.metrics_actual_after);assert.deepEqual(batch115Actual,readinessMetrics(batch116BoundaryData.metrics_actual_before));assert(batch115Data.reconciliation_snapshot_adjustment.excluded_later_in_place_proposition_count>=3,'batch 115 snapshot must exclude later in-place enrichments');
const audit115=projectState.development_recovery.reconciliation_chain.find(x=>String(x.batch_id)==='115');assert(audit115);assert.deepEqual(batch115Actual,readinessMetrics(audit115.metrics_actual_after));
assert.deepEqual(batch115Data.reconciliation_variance,{answer_eligible_unique_sources:batch115Actual.answer_eligible_unique_sources-batch115Data.metrics_expected_after.answer_eligible_unique_sources,content_verified_unique_sources:batch115Actual.content_verified_unique_sources-batch115Data.metrics_expected_after.content_verified_unique_sources,answer_eligible_propositions:batch115Actual.answer_eligible_propositions-batch115Data.metrics_expected_after.answer_eligible_propositions});

const enriched5959845Batch114=idx.entries.find(e=>sourceAID(e)==='5959845');assert(enriched5959845Batch114&&enriched5959845Batch114.response_propositions.length===16);assert(enriched5959845Batch114.response_propositions.some(p=>p.includes('כבוד אישי')));assert(enriched5959845Batch114.response_propositions.some(p=>p.includes('חלקו האפשרי של הרב')));assert(enriched5959845Batch114.response_proposition_locators.some(l=>String(l).includes('260–280')));assert(enriched5959845Batch114.response_proposition_locators.some(l=>String(l).includes('343–347')));
assert.equal(batch114Data.deduplication_check.full_index_scan_available,true);assert.deepEqual(batch114Data.deduplication_check.canonical_identity_collisions,[]);assert.deepEqual(batch114Data.deduplication_check.missing_canonical_identities,[]);assert.equal(batch114Data.deduplication_check.all_target_identities_answer_eligible,true);
assert(['reconciled','reconciled_with_variance'].includes(batch114Data.reconciliation_status));const batch114Actual=readinessMetrics(batch114Data.metrics_actual_after);assert(batch114Actual.answer_eligible_unique_sources<metrics.answer_eligible_unique_sources&&batch114Actual.answer_eligible_propositions<metrics.answer_eligible_propositions,'batch 114 snapshot must precede batch 115 additions');
const audit114=projectState.development_recovery.reconciliation_chain.find(x=>String(x.batch_id)==='114');assert(audit114);assert.deepEqual(batch114Actual,readinessMetrics(audit114.metrics_actual_after));
assert(projectState.development_recovery.reconciliation_chain.some(x=>String(x.batch_id)==='122'));
assert(acquisitionState.manual_web_review_history.some(x=>String(x.batch_id)==='122'));assert(acquisitionState.manual_web_review_history.some(x=>String(x.batch_id)==='121'));assert.deepEqual(readinessMetrics(acquisitionState.manual_web_review_current_metrics),readinessMetrics(metrics));
const rabbinicResponsibilityQuestion='מה מתועד על אחריות רבנים ותלמידי ישיבות בחינוך הציבור ובזיכוי הרבים?';
assert(understandQuestion(rabbinicResponsibilityQuestion).topics.includes('אחריות חינוכית והשפעה על הזולת'));
for(const mode of ['regular','researcher']){const m=buildAnswerModel(idx.entries,rabbinicResponsibilityQuestion,{mode});assert(m.answerable,mode+': rabbinic responsibility question must produce a bounded multi-source answer');assert(m.sources.some(e=>sourceAID(e)==='528671'),mode+': Yiddish Hayom Yom item on public responsibility must be retrieved');assert(m.sources.some(e=>sourceAID(e)==='2276672'),mode+': inspected yeshiva-student responsibility letter must be retrieved');assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=2,mode+': distinct source families must remain distinct');assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length),mode+': every synthesis claim needs claim-level citations');if(mode==='researcher')assert(m.research&&m.research.witnesses.length>=2&&m.research.claim_source_map.every(c=>c.source_locators.length>0),'researcher mode must expose witness-level provenance and claim locators');}
const teacherStudentBoundariesQuestion='מה השיחה אומרת על כבוד אישי לעומת אדישות כלפי דברי תורה ומסורות של רבותינו?';
for(const mode of ['regular','researcher']){const m=buildAnswerModel(idx.entries,teacherStudentBoundariesQuestion,{mode});assert(m.answerable,mode+': the inspected Sicha must answer the bounded teacher-student question');assert(m.sources.some(e=>sourceAID(e)==='5959845'),mode+': the enriched Sicha must be retrieved');assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length),mode+': Sicha claims need claim-level citations');if(mode==='researcher')assert(m.research&&m.research.depth==='deep'&&m.research.witnesses.some(w=>String(w.proposition_source_locator||'').includes('260–280')),'researcher mode must expose the new Sicha locator');}
const enriched5959845Final=idx.entries.find(e=>sourceAID(e)==='5959845');
assert(enriched5959845Final&&enriched5959845Final.response_propositions.length===16,'AID 5959845 must retain the existing propositions and all three later in-place enrichments');
assert(enriched5959845Final.response_proposition_locators.some(l=>String(l).includes('338–343')));
assert(enriched5959845Final.response_propositions.some(p=>p.includes('בנות צלפחד')&&p.includes('רבי עקיבא')&&p.includes('רבי שמעון')));
assert(enriched5959845Final.response_propositions.some(p=>p.includes('תשובת המעפילים')&&p.includes('ארץ ישראל')));
assert(enriched5959845Final.response_proposition_locators.some(l=>String(l).includes('290–305')));
assert(enriched5959845Final.response_proposition_locators.some(l=>String(l).includes('305–307')));
assert(enriched5959845Final.response_propositions.some(p=>p.includes('מילי דחסידותא')&&p.includes('ללמוד בעצמו')));
assert(enriched5959845Final.response_proposition_locators.some(l=>String(l).includes('316–325')));assert(enriched5959845Final.response_propositions.some(p=>p.includes('עשה לך רב')&&p.includes('קנה לך חבר')));assert(enriched5959845Final.response_proposition_locators.some(l=>String(l).includes('319–325')));
assert(enriched5959845Final.response_propositions.some(p=>p.includes('הערת שוליים 21')&&p.includes('עול משמעת')));
assert(enriched5959845Final.response_proposition_locators.some(l=>String(l).includes('434–435')));



const batch116Path='data/items/content-research-batch-116-2026-11-16.json';
const batch116Data=JSON.parse(await readFile(new URL(batch116Path,root),'utf8'));
const batch116Aids=[528685,528686,528687,528688,528689,528690,528691,528692,528693,528694];
assert(!idx.entries.some(e=>e.body_text_inspected===true||e.inspected_original_language_body===true||e.existing_identity===true),'source_body_review and existing-identity audit rows must never enter the canonical answer index');
assert.equal(batch116Data.batch_id,'116');assert.equal(batch116Data.records.length,10);assert.deepEqual(batch116Data.new_aids,batch116Aids);
assert.deepEqual(batch116Data.enriched_aids,[5959845]);assert.equal(batch116Data.new_source_identities,10);assert.equal(batch116Data.existing_identities_enriched,1);
assert.equal(batch116Data.new_response_propositions,11);assert.equal(batch116Data.existing_response_propositions_added,2);assert.equal(batch116Data.total_new_paraphrase_entries,13);
assert.equal(batch116Data.answer_eligible_source_families_added,10);assert.equal(batch116Data.independent_witnesses_added,10);assert.equal(batch116Data.content_verified_unique_sources_added,0);
assert.equal(batch116Data.reviewed_item_count,11);assert.equal(batch116Data.source_bodies_inspected,11);assert.equal(batch116Data.source_body_pages_opened,15);assert.equal(batch116Data.source_body_review.length,11);
assert(batch116Data.source_body_review.every(r=>r.inspected_original_language_body===true&&r.body_locator));
assert.deepEqual(batch116Data.language_distribution,{Hebrew:9,Yiddish:1});assert.deepEqual(batch116Data.original_language_distribution,{Hebrew:9,Yiddish:1});
assert.equal(batch116Data.records.reduce((n,r)=>n+r.response_propositions.length,0),11);assert.equal(new Set(batch116Data.records.map(r=>String(r.aid))).size,10);assert.equal(new Set(batch116Data.records.map(r=>r.evidence_family_id)).size,10);
assert.equal(batch116Data.blocked_candidate_count,4);assert.deepEqual(batch116Data.blocked_candidates.map(x=>x.aid),[4666265,4666267,4666269,5413540]);
assert.equal(batch116Data.fallback_source_attempted,true);assert.equal(batch116Data.fallback_source_results.body_text_inspected,true);assert.equal(batch116Data.fallback_source_results.accessible_item_level_bodies,10);assert.equal(batch116Data.fallback_source_results.existing_identity_bodies,1);
assert.equal(batch116Data.crawler_retry,false);assert.equal(batch116Data.access_control_bypassed,false);assert.equal(batch116Data.full_text_copied,false);assert.equal(batch116Data.scan_only_verification_used,false);assert.equal(batch116Data.translations_counted_as_independent_witnesses,0);
assert.deepEqual(batch116Data.metrics_before,{answer_eligible_unique_sources:1114,content_verified_unique_sources:854,answer_eligible_propositions:3189});
assert.deepEqual(batch116Data.metrics_expected_after,{answer_eligible_unique_sources:1124,content_verified_unique_sources:854,answer_eligible_propositions:3202});
assert.deepEqual(batch116Data.metrics_delta_at_batch_boundary,{answer_eligible_unique_sources:10,content_verified_unique_sources:0,answer_eligible_propositions:13});
assert.equal(batch116Data.existing_identity_updates[0].existing_propositions_before,8);assert.equal(batch116Data.existing_identity_updates[0].propositions_added,2);assert.equal(batch116Data.existing_identity_updates[0].total_propositions_after,10);
for(const r of batch116Data.records){assert.equal(r.status,'Parsed');assert.equal(r.pipeline_status,'Parsed');assert.equal(r.canonical_status,'Parsed');assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);assert.equal(r.proposition_verification,'source_text_inspected');assert(r.proposition_source_locator&&r.provenance&&r.verification_scope&&r.context_status==='partial'&&r.has_content_evidence);assert.equal(r.response_propositions.length,r.response_proposition_locators.length);assert.equal(r.independent_witness,true);assert.equal(r.translation_of_evidence_family_id,null);}
for(const aid of batch116Aids){const matches=idx.entries.filter(e=>sourceAID(e)===String(aid));assert.equal(matches.length,1,'batch-116 AID '+aid+' must have one canonical identity');const e=matches[0];assert(e.has_content_evidence);assert.equal(e.status,'Parsed');assert.equal(e.canonical_file,batch116Path);assert.equal(e.independent_witness,true);assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');assert(e.proposition_source_locator&&e.verification_scope);assert(!queue.records.some(q=>String(q.key||'')==='aid:'+aid||String(q.source_url||'').includes('/aid/'+aid+'/')));}
const enriched5959845Batch116=idx.entries.find(e=>sourceAID(e)==='5959845');assert(enriched5959845Batch116&&enriched5959845Batch116.response_propositions.length===16);assert(enriched5959845Batch116.response_proposition_locators.some(l=>String(l).includes('290–305')));assert(enriched5959845Batch116.response_proposition_locators.some(l=>String(l).includes('305–307')));assert(enriched5959845Batch116.response_proposition_locators.some(l=>String(l).includes('316–325')));
assert.equal(batch116Data.deduplication_check.full_index_scan_available,true);assert.deepEqual(batch116Data.deduplication_check.canonical_identity_collisions,[]);assert.deepEqual(batch116Data.deduplication_check.missing_canonical_identities,[]);assert.equal(batch116Data.deduplication_check.all_target_identities_answer_eligible,true);
assert(['reconciled','reconciled_with_variance'].includes(batch116Data.reconciliation_status));const batch117BoundaryData=JSON.parse(await readFile(new URL('data/items/content-research-batch-117-2026-11-16.json',root),'utf8'));const batch116Actual=readinessMetrics(batch116Data.metrics_actual_after);assert.deepEqual(batch116Actual,readinessMetrics(batch117BoundaryData.metrics_actual_before));assert(batch116Data.reconciliation_snapshot_adjustment.excluded_later_in_place_proposition_count>=1,'batch 116 snapshot must exclude the later AID 5959845 enrichment');
const audit116=projectState.development_recovery.reconciliation_chain.find(x=>String(x.batch_id)==='116');assert(audit116);assert.deepEqual(batch116Actual,readinessMetrics(audit116.metrics_actual_after));
assert(!projectState.development_recovery.pending_reconciliation_batches.includes('116'));assert(!projectState.metrics_integrity.answer_readiness.pending_batches.includes('116'));
assert(projectState.development_recovery.reconciliation_chain.some(x=>String(x.batch_id)==='122'));
assert(acquisitionState.manual_web_review_history.some(x=>String(x.batch_id)==='122'));assert(acquisitionState.manual_web_review_history.some(x=>String(x.batch_id)==='121'));assert.deepEqual(readinessMetrics(acquisitionState.manual_web_review_current_metrics),readinessMetrics(metrics));
assert(acquisitionState.manual_web_review_history.some(x=>String(x.batch_id)==='116'));
assert(acquisitionState.manual_web_review_history.some(x=>String(x.batch_id)==='117'));

const batch117Path='data/items/content-research-batch-117-2026-11-16.json';
const batch117Data=JSON.parse(await readFile(new URL(batch117Path,root),'utf8'));
const batch117Aids=[528695,528696,528697,528699,528700,528701,528702,528703,528704,528705,528706];
assert.equal(batch117Data.batch_id,'117');assert.equal(batch117Data.records.length,11);assert.deepEqual(batch117Data.new_aids,batch117Aids);
assert.deepEqual(batch117Data.enriched_aids,[5959845]);assert.equal(batch117Data.new_source_identities,11);assert.equal(batch117Data.existing_identities_enriched,1);
assert.equal(batch117Data.new_response_propositions,11);assert.equal(batch117Data.existing_response_propositions_added,1);assert.equal(batch117Data.total_new_paraphrase_entries,12);
assert.equal(batch117Data.answer_eligible_source_families_added,11);assert.equal(batch117Data.independent_witnesses_added,11);assert.equal(batch117Data.content_verified_unique_sources_added,0);
assert.equal(batch117Data.reviewed_item_count,12);assert.equal(batch117Data.source_bodies_inspected,12);assert.equal(batch117Data.source_body_pages_opened,13);assert.equal(batch117Data.source_body_review.length,12);
assert(batch117Data.source_body_review.every(r=>r.inspected_original_language_body===true&&r.body_locator));
assert.deepEqual(batch117Data.language_distribution,{Hebrew:7,Yiddish:4});assert.deepEqual(batch117Data.original_language_distribution,{Hebrew:7,Yiddish:4});
assert.equal(batch117Data.records.reduce((n,r)=>n+r.response_propositions.length,0),11);assert.equal(new Set(batch117Data.records.map(r=>String(r.aid))).size,11);assert.equal(new Set(batch117Data.records.map(r=>r.evidence_family_id)).size,11);
assert.equal(batch117Data.blocked_candidate_count,1);assert.equal(batch117Data.blocked_candidates[0].aid,528698);
assert.equal(batch117Data.fallback_source_attempted,true);assert.equal(batch117Data.fallback_source_results.body_text_inspected,true);assert.equal(batch117Data.fallback_source_results.accessible_item_level_bodies,11);assert.equal(batch117Data.fallback_source_results.existing_identity_bodies,1);
assert.equal(batch117Data.crawler_retry,false);assert.equal(batch117Data.access_control_bypassed,false);assert.equal(batch117Data.full_text_copied,false);assert.equal(batch117Data.scan_only_verification_used,false);assert.equal(batch117Data.translations_counted_as_independent_witnesses,0);
assert.deepEqual(batch117Data.metrics_before,{answer_eligible_unique_sources:1124,content_verified_unique_sources:854,answer_eligible_propositions:3202});
assert.deepEqual(batch117Data.metrics_expected_after,{answer_eligible_unique_sources:1135,content_verified_unique_sources:854,answer_eligible_propositions:3214});
assert.deepEqual(batch117Data.metrics_delta_at_batch_boundary,{answer_eligible_unique_sources:11,content_verified_unique_sources:0,answer_eligible_propositions:12});
assert.equal(batch117Data.existing_identity_updates[0].existing_propositions_before,10);assert.equal(batch117Data.existing_identity_updates[0].propositions_added,1);assert.equal(batch117Data.existing_identity_updates[0].total_propositions_after,11);
for(const r of batch117Data.records){assert.equal(r.status,'Parsed');assert.equal(r.pipeline_status,'Parsed');assert.equal(r.canonical_status,'Parsed');assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);assert.equal(r.proposition_verification,'source_text_inspected');assert(r.proposition_source_locator&&r.provenance&&r.verification_scope&&r.context_status==='partial'&&r.has_content_evidence);assert.equal(r.response_propositions.length,r.response_proposition_locators.length);assert.equal(r.independent_witness,true);assert.equal(r.translation_of_evidence_family_id,null);}
for(const aid of batch117Aids){const matches=idx.entries.filter(e=>sourceAID(e)===String(aid));assert.equal(matches.length,1,'batch-117 AID '+aid+' must have one canonical identity');const e=matches[0];assert(e.has_content_evidence);assert.equal(e.status,'Parsed');assert.equal(e.canonical_file,batch117Path);assert.equal(e.independent_witness,true);assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');assert(e.proposition_source_locator&&e.verification_scope);assert(!queue.records.some(q=>String(q.key||'')==='aid:'+aid||String(q.source_url||'').includes('/aid/'+aid+'/')));}
assert.equal(batch117Data.deduplication_check.full_index_scan_available,true);assert.deepEqual(batch117Data.deduplication_check.canonical_identity_collisions,[]);assert.deepEqual(batch117Data.deduplication_check.missing_canonical_identities,[]);assert.equal(batch117Data.deduplication_check.all_target_identities_answer_eligible,true);
assert(['reconciled','reconciled_with_variance'].includes(batch117Data.reconciliation_status));assert.equal(batch117Data.reconciliation_snapshot_adjustment.excluded_later_in_place_proposition_count,0);assert.deepEqual(readinessMetrics(batch117Data.metrics_delta_actual),{answer_eligible_unique_sources:11,content_verified_unique_sources:0,answer_eligible_propositions:12});const batch118BoundaryFor117=JSON.parse(await readFile(new URL('data/items/content-research-batch-118-2026-11-16.json',root),'utf8'));assert.deepEqual(readinessMetrics(batch117Data.metrics_actual_after),readinessMetrics(batch118BoundaryFor117.metrics_actual_before));assert.deepEqual(batch117Data.reconciliation_variance,{answer_eligible_unique_sources:batch117Data.metrics_actual_after.answer_eligible_unique_sources-batch117Data.metrics_expected_after.answer_eligible_unique_sources,content_verified_unique_sources:batch117Data.metrics_actual_after.content_verified_unique_sources-batch117Data.metrics_expected_after.content_verified_unique_sources,answer_eligible_propositions:batch117Data.metrics_actual_after.answer_eligible_propositions-batch117Data.metrics_expected_after.answer_eligible_propositions});
const audit117=projectState.development_recovery.reconciliation_chain.find(x=>String(x.batch_id)==='117');assert(audit117);assert.deepEqual(readinessMetrics(batch117Data.metrics_actual_after),readinessMetrics(audit117.metrics_actual_after));
assert(!projectState.development_recovery.pending_reconciliation_batches.includes('117'));assert(!projectState.metrics_integrity.answer_readiness.pending_batches.includes('117'));
assert(projectState.development_recovery.reconciliation_chain.some(x=>String(x.batch_id)==='122'));
assert(acquisitionState.manual_web_review_history.some(x=>String(x.batch_id)==='122'));assert(acquisitionState.manual_web_review_history.some(x=>String(x.batch_id)==='121'));assert.deepEqual(readinessMetrics(acquisitionState.manual_web_review_current_metrics),readinessMetrics(metrics));
assert(acquisitionState.manual_web_review_history.some(x=>String(x.batch_id)==='117'));


 
// Batch 118: eleven inspected Hebrew/Yiddish daily entries, one existing Sicha enrichment, one blocked page and one index-only page excluded.
const batch118Path='data/items/content-research-batch-118-2026-11-16.json';
const batch118Data=JSON.parse(await readFile(new URL(batch118Path,root),'utf8'));
const batch118Aids=[528707,528708,528710,528711,528712,528713,528714,528715,528716,528717,528718];
assert.equal(batch118Data.batch_id,'118');assert.equal(batch118Data.records.length,11);assert.deepEqual(batch118Data.new_aids,batch118Aids);
assert.deepEqual(batch118Data.enriched_aids,[2989585]);assert.equal(batch118Data.new_source_identities,11);assert.equal(batch118Data.existing_identities_enriched,1);
assert.equal(batch118Data.new_response_propositions,12);assert.equal(batch118Data.existing_response_propositions_added,3);assert.equal(batch118Data.total_new_paraphrase_entries,15);
assert.equal(batch118Data.answer_eligible_source_families_added,11);assert.equal(batch118Data.independent_witnesses_added,11);assert.equal(batch118Data.content_verified_unique_sources_added,0);
assert.equal(batch118Data.reviewed_item_count,12);assert.equal(batch118Data.source_bodies_inspected,12);assert.equal(batch118Data.source_body_pages_opened,14);assert.equal(batch118Data.metadata_only_items_rechecked,1);assert.equal(batch118Data.source_body_review.length,12);
assert(batch118Data.source_body_review.every(r=>r.inspected_original_language_body===true&&r.body_locator));
assert.deepEqual(batch118Data.language_distribution,{Hebrew:6,Yiddish:5});assert.deepEqual(batch118Data.original_language_distribution,{Hebrew:6,Yiddish:5});
assert.equal(batch118Data.records.reduce((n,r)=>n+r.response_propositions.length,0),13);assert.equal(batch118Data.records.find(r=>String(r.aid)==='528717').response_propositions.length,2);assert.equal(new Set(batch118Data.records.map(r=>String(r.aid))).size,11);assert.equal(new Set(batch118Data.records.map(r=>r.evidence_family_id)).size,11);
assert.equal(batch118Data.blocked_candidate_count,1);assert.equal(batch118Data.blocked_candidates[0].aid,4666220);
assert.equal(batch118Data.excluded_candidate_count,1);assert.equal(batch118Data.excluded_candidates[0].aid,528709);
assert.equal(batch118Data.fallback_source_attempted,true);assert.equal(batch118Data.fallback_source_results.body_text_inspected,true);assert.equal(batch118Data.fallback_source_results.accessible_item_level_bodies,11);assert.equal(batch118Data.fallback_source_results.existing_identity_bodies,1);
assert.equal(batch118Data.crawler_retry,false);assert.equal(batch118Data.access_control_bypassed,false);assert.equal(batch118Data.full_text_copied,false);assert.equal(batch118Data.scan_only_verification_used,false);assert.equal(batch118Data.translations_counted_as_independent_witnesses,0);
assert.deepEqual(batch118Data.metrics_before,{answer_eligible_unique_sources:1135,content_verified_unique_sources:854,answer_eligible_propositions:3214});
assert.deepEqual(batch118Data.metrics_expected_after,{answer_eligible_unique_sources:1146,content_verified_unique_sources:854,answer_eligible_propositions:3229});
assert.deepEqual(batch118Data.metrics_delta_at_batch_boundary,{answer_eligible_unique_sources:11,content_verified_unique_sources:0,answer_eligible_propositions:15});
for(const r of batch118Data.records){assert.equal(r.status,'Parsed');assert.equal(r.pipeline_status,'Parsed');assert.equal(r.canonical_status,'Parsed');assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);assert.equal(r.proposition_verification,'source_text_inspected');assert(r.proposition_source_locator&&r.provenance&&r.verification_scope&&r.context_status==='partial'&&r.has_content_evidence);assert.equal(r.response_propositions.length,r.response_proposition_locators.length);assert.equal(r.independent_witness,true);assert.equal(r.translation_of_evidence_family_id,null);}
for(const aid of batch118Aids){const matches=idx.entries.filter(e=>sourceAID(e)===String(aid));assert.equal(matches.length,1,'batch-118 AID '+aid+' must have exactly one canonical identity');const e=matches[0];assert(e.has_content_evidence);assert.equal(e.status,'Parsed');assert.equal(e.canonical_file,batch118Path);assert.equal(e.independent_witness,true);assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');assert(e.proposition_source_locator&&e.verification_scope);assert(!queue.records.some(q=>String(q.key||'')==='aid:'+aid||String(q.source_url||'').includes('/aid/'+aid+'/')));}
const enriched2989585Batch118=idx.entries.find(e=>sourceAID(e)==='2989585');assert(enriched2989585Batch118&&enriched2989585Batch118.response_propositions.length===19);assert(enriched2989585Batch118.response_proposition_locators.some(l=>String(l).includes('321–332')));assert(enriched2989585Batch118.response_proposition_locators.some(l=>String(l).includes('343–374')));assert(enriched2989585Batch118.response_proposition_locators.some(l=>String(l).includes('380–388')));assert(enriched2989585Batch118.response_proposition_locators.some(l=>String(l).includes('393–409')));assert(enriched2989585Batch118.response_proposition_locators.some(l=>String(l).includes('412–429')));
assert.equal(batch118Data.existing_identity_updates[0].existing_propositions_before,8);assert.equal(batch118Data.existing_identity_updates[0].propositions_added,3);assert.equal(batch118Data.existing_identity_updates[0].total_propositions_after,11);
assert.equal(batch118Data.deduplication_check.full_index_scan_available,true);assert.deepEqual(batch118Data.deduplication_check.canonical_identity_collisions,[]);assert.deepEqual(batch118Data.deduplication_check.missing_canonical_identities,[]);assert.equal(batch118Data.deduplication_check.all_target_identities_answer_eligible,true);
assert(['reconciled','reconciled_with_variance'].includes(batch118Data.reconciliation_status));assert.deepEqual(readinessMetrics(batch118Data.metrics_delta_actual),{answer_eligible_unique_sources:11,content_verified_unique_sources:0,answer_eligible_propositions:15});const batch119BoundaryFor118=JSON.parse(await readFile(new URL('data/items/content-research-batch-119-2026-11-16.json',root),'utf8'));assert.deepEqual(readinessMetrics(batch118Data.metrics_actual_after),readinessMetrics(batch119BoundaryFor118.metrics_actual_before));
const batch117BoundaryFor118=JSON.parse(await readFile(new URL('data/items/content-research-batch-117-2026-11-16.json',root),'utf8'));assert.deepEqual(readinessMetrics(batch118Data.metrics_actual_before),readinessMetrics(batch117BoundaryFor118.metrics_actual_after));
const audit118=projectState.development_recovery.reconciliation_chain.find(x=>String(x.batch_id)==='118');assert(audit118);assert.deepEqual(readinessMetrics(batch118Data.metrics_actual_after),readinessMetrics(audit118.metrics_actual_after));
assert(!projectState.development_recovery.pending_reconciliation_batches.includes('118'));assert(!projectState.metrics_integrity.answer_readiness.pending_batches.includes('118'));
assert(projectState.development_recovery.reconciliation_chain.some(x=>String(x.batch_id)==='122'));
assert(acquisitionState.manual_web_review_history.some(x=>String(x.batch_id)==='122'));assert(acquisitionState.manual_web_review_history.some(x=>String(x.batch_id)==='121'));assert.deepEqual(readinessMetrics(acquisitionState.manual_web_review_current_metrics),readinessMetrics(metrics));
assert(acquisitionState.manual_web_review_history.some(x=>String(x.batch_id)==='118'));assert(acquisitionState.manual_web_review_history.some(x=>String(x.batch_id)==='117'));
const wisdomToActionQuestion='מה השיחה מסבירה על הקשר בין ראיית הנולד, לימוד תורה והמעבר להבנה למעשה בפועל?';
for(const mode of ['regular','researcher']){const m=buildAnswerModel(idx.entries,wisdomToActionQuestion,{mode});assert(m.answerable,mode+': the enriched Shavuot Sicha must support a bounded wisdom-to-action answer');assert(m.sources.some(e=>sourceAID(e)==='2989585'));assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length));if(mode==='researcher')assert(m.research&&m.research.depth==='deep'&&m.research.claim_source_map.some(c=>c.source_locators.some(l=>String(l).includes('343–374'))),'researcher mode must expose the new in-place Sicha locators');}

 
// Batch 119: ten directly inspected Hebrew/Yiddish daily entries, one blocked page replaced in the same run, and two propositions added to an existing Sicha identity.
const batch119Path='data/items/content-research-batch-119-2026-11-16.json';
const batch119Data=JSON.parse(await readFile(new URL(batch119Path,root),'utf8'));
const batch120Path='data/items/content-research-batch-120-2026-11-16.json';
const batch120Data=JSON.parse(await readFile(new URL(batch120Path,root),'utf8'));
const batch121Path='data/items/content-research-batch-121-2026-11-16.json';
const batch121Data=JSON.parse(await readFile(new URL(batch121Path,root),'utf8'));
const batch121Aids=[528748,528749,528750,528751,528752,528753,528754,528755,528756,528757,528758,528759,528760,528761,528762,528763];
const batch119Aids=[528719,528720,528721,528722,528723,528724,528726,528727,528728,528729];
assert.equal(batch119Data.batch_id,'119');assert.equal(batch119Data.records.length,10);assert.deepEqual(batch119Data.new_aids,batch119Aids);
assert.deepEqual(batch119Data.enriched_aids,[2989585]);assert.equal(batch119Data.new_source_identities,10);assert.equal(batch119Data.existing_identities_enriched,1);
assert.equal(batch119Data.new_response_propositions,11);assert.equal(batch119Data.existing_response_propositions_added,2);assert.equal(batch119Data.total_new_paraphrase_entries,13);
assert.equal(batch119Data.answer_eligible_source_families_added,10);assert.equal(batch119Data.independent_witnesses_added,10);assert.equal(batch119Data.content_verified_unique_sources_added,0);
assert.equal(batch119Data.reviewed_item_count,11);assert.equal(batch119Data.source_bodies_inspected,11);assert.equal(batch119Data.source_body_pages_opened,11);assert.equal(batch119Data.source_body_review.length,11);
assert(batch119Data.source_body_review.every(r=>r.body_text_inspected===true&&r.inspected_original_language_body===true&&r.body_locator));
assert.deepEqual(batch119Data.language_distribution,{Hebrew:4,Yiddish:6});assert.deepEqual(batch119Data.original_language_distribution,{Hebrew:4,Yiddish:6});
assert.equal(batch119Data.records.reduce((n,r)=>n+r.response_propositions.length,0),11);assert.equal(new Set(batch119Data.records.map(r=>String(r.aid))).size,10);
assert.equal(new Set(batch119Data.records.map(r=>r.evidence_family_id)).size,10);assert.equal(new Set(batch119Data.records.map(r=>r.source_url)).size,10);
assert.equal(batch119Data.blocked_candidate_count,1);assert.equal(batch119Data.blocked_candidates[0].aid,528725);
assert.equal(batch119Data.fallback_source_attempted,true);assert.equal(batch119Data.fallback_source_results.body_text_inspected,true);assert.equal(batch119Data.fallback_source_results.accessible_item_level_bodies,10);assert.equal(batch119Data.fallback_source_results.existing_identity_bodies,1);
assert.equal(batch119Data.crawler_retry,false);assert.equal(batch119Data.access_control_bypassed,false);assert.equal(batch119Data.full_text_copied,false);assert.equal(batch119Data.scan_only_verification_used,false);assert.equal(batch119Data.translations_counted_as_independent_witnesses,0);
assert.deepEqual(batch119Data.metrics_before,{answer_eligible_unique_sources:1146,content_verified_unique_sources:854,answer_eligible_propositions:3229});
assert.deepEqual(batch119Data.metrics_expected_after,{answer_eligible_unique_sources:1156,content_verified_unique_sources:854,answer_eligible_propositions:3242});
assert.deepEqual(batch119Data.metrics_delta_at_batch_boundary,{answer_eligible_unique_sources:10,content_verified_unique_sources:0,answer_eligible_propositions:13});
for(const r of batch119Data.records){assert.equal(r.status,'Parsed');assert.equal(r.pipeline_status,'Parsed');assert.equal(r.canonical_status,'Parsed');assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);assert.equal(r.proposition_verification,'source_text_inspected');assert(r.proposition_source_locator&&r.provenance&&r.verification_scope&&r.context_status==='partial'&&r.has_content_evidence);assert.equal(r.response_propositions.length,r.response_proposition_locators.length);assert.equal(r.independent_witness,true);assert.equal(r.translation_of_evidence_family_id,null);}
for(const aid of batch119Aids){const matches=idx.entries.filter(e=>sourceAID(e)===String(aid));assert.equal(matches.length,1,'batch-119 AID '+aid+' must have exactly one canonical identity');const e=matches[0];assert(e.has_content_evidence);assert.equal(e.status,'Parsed');assert.equal(e.canonical_file,batch119Path);assert.equal(e.independent_witness,true);assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');assert(e.proposition_source_locator&&e.verification_scope);assert(!queue.records.some(q=>String(q.key||'')==='aid:'+aid||String(q.source_url||'').includes('/aid/'+aid+'/')));}
assert(!idx.entries.some(e=>sourceAID(e)==='528725'&&e.has_content_evidence&&e.response_propositions?.length),'blocked AID 528725 must not be indexed as answer-eligible content');
const enriched2989585Batch119=idx.entries.find(e=>sourceAID(e)==='2989585');assert(enriched2989585Batch119&&enriched2989585Batch119.response_propositions.length===19);
assert(enriched2989585Batch119.response_proposition_locators.some(l=>String(l).includes('393–409')));assert(enriched2989585Batch119.response_proposition_locators.some(l=>String(l).includes('412–429')));
assert.equal(batch119Data.existing_identity_updates[0].existing_propositions_before,11);assert.equal(batch119Data.existing_identity_updates[0].propositions_added,2);assert.equal(batch119Data.existing_identity_updates[0].total_propositions_after,13);
assert.equal(batch119Data.deduplication_check.full_index_scan_available,true);assert.deepEqual(batch119Data.deduplication_check.canonical_identity_collisions,[]);assert.deepEqual(batch119Data.deduplication_check.missing_canonical_identities,[]);assert.equal(batch119Data.deduplication_check.all_target_identities_answer_eligible,true);
assert(['reconciled','reconciled_with_variance'].includes(batch119Data.reconciliation_status));
assert.deepEqual(readinessMetrics(batch119Data.metrics_actual_before),readinessMetrics(batch118Data.metrics_actual_after));
assert.deepEqual(readinessMetrics(batch119Data.metrics_actual_after),readinessMetrics(batch120Data.metrics_actual_before));
assert.deepEqual(batch119Data.reconciliation_variance,{answer_eligible_unique_sources:batch119Data.metrics_actual_after.answer_eligible_unique_sources-batch119Data.metrics_expected_after.answer_eligible_unique_sources,content_verified_unique_sources:batch119Data.metrics_actual_after.content_verified_unique_sources-batch119Data.metrics_expected_after.content_verified_unique_sources,answer_eligible_propositions:batch119Data.metrics_actual_after.answer_eligible_propositions-batch119Data.metrics_expected_after.answer_eligible_propositions});
const audit119=projectState.development_recovery.reconciliation_chain.find(x=>String(x.batch_id)==='119');assert(audit119);assert.deepEqual(readinessMetrics(batch119Data.metrics_actual_after),readinessMetrics(audit119.metrics_actual_after));
assert(!projectState.development_recovery.pending_reconciliation_batches.includes('119'));assert(!projectState.metrics_integrity.answer_readiness.pending_batches.includes('119'));
assert(projectState.development_recovery.reconciliation_chain.some(x=>String(x.batch_id)==='122'));
assert(acquisitionState.manual_web_review_history.some(x=>String(x.batch_id)==='122'));assert(acquisitionState.manual_web_review_history.some(x=>String(x.batch_id)==='121'));assert.deepEqual(readinessMetrics(acquisitionState.manual_web_review_current_metrics),readinessMetrics(metrics));
assert(acquisitionState.manual_web_review_history.some(x=>String(x.batch_id)==='119'));assert(acquisitionState.manual_web_review_history.some(x=>String(x.batch_id)==='118'));
 
// Batch 120: seventeen inspected Hebrew/Yiddish Hayom Yom entries, two inspected English letter translations (non-independent presentations), and three in-place Sicha propositions.
const batch120Aids=[528730,528731,528732,528733,528734,528735,528736,528737,528738,528740,528741,528742,528743,528744,528745,528746,528747,3906812,5920863];
assert.equal(batch120Data.batch_id,'120');assert.equal(batch120Data.records.length,19);assert.deepEqual(batch120Data.new_aids,batch120Aids);
assert.deepEqual(batch120Data.enriched_aids,[2989585]);assert.equal(batch120Data.new_source_identities,19);assert.equal(batch120Data.existing_identities_enriched,1);
assert.equal(batch120Data.new_response_propositions,25);assert.equal(batch120Data.existing_response_propositions_added,3);assert.equal(batch120Data.total_new_paraphrase_entries,28);
assert.equal(batch120Data.answer_eligible_source_families_added,19);assert.equal(batch120Data.independent_witnesses_added,17);assert.equal(batch120Data.non_independent_presentations_added,2);assert.equal(batch120Data.content_verified_unique_sources_added,0);
assert.equal(batch120Data.reviewed_item_count,19);assert.equal(batch120Data.source_bodies_inspected,19);assert.equal(batch120Data.source_body_pages_opened,19);assert.equal(batch120Data.source_body_review.length,19);
assert(batch120Data.source_body_review.every(r=>r.body_text_inspected===true));
assert(batch120Data.source_body_review.filter(r=>r.language!=='English').every(r=>r.inspected_original_language_body===true));
assert(batch120Data.source_body_review.filter(r=>r.language==='English').every(r=>r.inspected_original_language_body===false));
assert.equal(batch120Data.records.reduce((n,r)=>n+r.response_propositions.length,0),25);assert.equal(new Set(batch120Data.records.map(r=>String(r.aid))).size,19);
assert.equal(new Set(batch120Data.records.map(r=>r.evidence_family_id)).size,19);assert.deepEqual(batch120Data.language_distribution,{Hebrew:14,Yiddish:3,English:2});
assert.equal(batch120Data.blocked_candidate_count,1);assert.equal(batch120Data.blocked_candidates[0].aid,528725);assert.equal(batch120Data.excluded_candidate_count,1);assert.equal(batch120Data.excluded_candidates[0].aid,528739);
assert.equal(batch120Data.fallback_source_attempted,true);assert.equal(batch120Data.fallback_source_results.body_text_inspected,true);assert.equal(batch120Data.fallback_source_results.accessible_item_level_bodies,19);assert.equal(batch120Data.fallback_source_results.existing_identity_bodies,1);
assert.equal(batch120Data.crawler_retry,false);assert.equal(batch120Data.access_control_bypassed,false);assert.equal(batch120Data.full_text_copied,false);assert.equal(batch120Data.scan_only_verification_used,false);assert.equal(batch120Data.translations_counted_as_independent_witnesses,0);
assert.deepEqual(batch120Data.metrics_before,{answer_eligible_unique_sources:1156,content_verified_unique_sources:854,answer_eligible_propositions:3242});
assert.deepEqual(batch120Data.metrics_expected_after,{answer_eligible_unique_sources:1175,content_verified_unique_sources:854,answer_eligible_propositions:3270});
assert.deepEqual(batch120Data.metrics_delta_at_batch_boundary,{answer_eligible_unique_sources:19,content_verified_unique_sources:0,answer_eligible_propositions:28});
for(const r of batch120Data.records){assert.equal(r.status,'Parsed');assert.equal(r.pipeline_status,'Parsed');assert.equal(r.canonical_status,'Parsed');assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);assert.equal(r.proposition_verification,'source_text_inspected');assert(r.proposition_source_locator&&r.provenance&&r.verification_scope&&r.context_status==='partial'&&r.has_content_evidence);assert.equal(r.response_propositions.length,r.response_proposition_locators.length);}
for(const aid of batch120Aids){const matches=idx.entries.filter(e=>sourceAID(e)===String(aid));assert.equal(matches.length,1,'batch-120 AID '+aid+' must have exactly one canonical identity');const e=matches[0];assert(e.has_content_evidence);assert.equal(e.status,'Parsed');assert.equal(e.canonical_file,batch120Path);assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');assert(e.proposition_source_locator&&e.verification_scope);assert(!queue.records.some(q=>String(q.key||'')==='aid:'+aid||String(q.source_url||'').includes('/aid/'+aid+'/')));}
for(const aid of [3906812,5920863]){const e=idx.entries.find(e=>sourceAID(e)===String(aid));assert(e);assert.equal(e.independent_witness,false,'published English translation must not be counted as an independent witness');assert.equal(e.translation_of_evidence_family_id,e.evidence_family_id);}
for(const aid of batch120Aids.filter(a=>![3906812,5920863].includes(a))){const e=idx.entries.find(e=>sourceAID(e)===String(aid));assert.equal(e.independent_witness,true);}
assert(!idx.entries.some(e=>sourceAID(e)==='528725'&&e.has_content_evidence&&e.response_propositions?.length),'blocked AID 528725 must not be indexed as answer-eligible content');
assert(!idx.entries.some(e=>sourceAID(e)==='528739'&&e.has_content_evidence&&e.response_propositions?.length),'month-navigation AID 528739 must not be indexed as answer-eligible content');
const enriched2989585Batch120=idx.entries.find(e=>sourceAID(e)==='2989585');assert(enriched2989585Batch120&&enriched2989585Batch120.response_propositions.length===19);
assert(enriched2989585Batch120.response_proposition_locators.some(l=>String(l).includes('434–437')));
assert(enriched2989585Batch120.response_proposition_locators.some(l=>String(l).includes('439–454')));
assert(enriched2989585Batch120.response_proposition_locators.some(l=>String(l).includes('455–477')));
assert(enriched2989585Batch120.response_proposition_locators.some(l=>String(l).includes('483–485')));
assert(enriched2989585Batch120.response_proposition_locators.some(l=>String(l).includes('499–501')));
assert(enriched2989585Batch120.response_proposition_locators.some(l=>String(l).includes('503–508')));
assert.equal(batch120Data.existing_identity_updates[0].existing_propositions_before,13);assert.equal(batch120Data.existing_identity_updates[0].propositions_added,3);assert.equal(batch120Data.existing_identity_updates[0].total_propositions_after,16);
assert.equal(batch120Data.deduplication_check.full_index_scan_available,true);assert.deepEqual(batch120Data.deduplication_check.canonical_identity_collisions,[]);assert.deepEqual(batch120Data.deduplication_check.missing_canonical_identities,[]);assert.equal(batch120Data.deduplication_check.all_target_identities_answer_eligible,true);
assert(['reconciled','reconciled_with_variance'].includes(batch120Data.reconciliation_status));
assert.deepEqual(readinessMetrics(batch120Data.metrics_actual_before),readinessMetrics(batch119Data.metrics_actual_after));
assert.deepEqual(readinessMetrics(batch120Data.metrics_actual_after),readinessMetrics(batch121Data.metrics_actual_before));
assert.deepEqual(readinessMetrics(batch121Data.metrics_actual_after),readinessMetrics(metrics));
assert.deepEqual(batch120Data.reconciliation_variance,{answer_eligible_unique_sources:batch120Data.metrics_actual_after.answer_eligible_unique_sources-batch120Data.metrics_expected_after.answer_eligible_unique_sources,content_verified_unique_sources:batch120Data.metrics_actual_after.content_verified_unique_sources-batch120Data.metrics_expected_after.content_verified_unique_sources,answer_eligible_propositions:batch120Data.metrics_actual_after.answer_eligible_propositions-batch120Data.metrics_expected_after.answer_eligible_propositions});
const audit120=projectState.development_recovery.reconciliation_chain.find(x=>String(x.batch_id)==='120');assert(audit120);assert.deepEqual(readinessMetrics(batch120Data.metrics_actual_after),readinessMetrics(audit120.metrics_actual_after));
assert.deepEqual(readinessMetrics(batch120Data.metrics_actual_after),readinessMetrics(batch121Data.metrics_actual_before));
const audit121=projectState.development_recovery.reconciliation_chain.find(x=>String(x.batch_id)==='121');assert(audit121);assert.deepEqual(readinessMetrics(batch121Data.metrics_actual_after),readinessMetrics(audit121.metrics_actual_after));
assert(!projectState.development_recovery.pending_reconciliation_batches.includes('120'));assert(!projectState.metrics_integrity.answer_readiness.pending_batches.includes('120'));
assert(!projectState.development_recovery.pending_reconciliation_batches.includes('121'));assert(!projectState.metrics_integrity.answer_readiness.pending_batches.includes('121'));
assert(projectState.development_recovery.reconciliation_chain.some(x=>String(x.batch_id)==='122'));
assert(acquisitionState.manual_web_review_history.some(x=>String(x.batch_id)==='122'));assert(acquisitionState.manual_web_review_history.some(x=>String(x.batch_id)==='121'));assert.deepEqual(readinessMetrics(acquisitionState.manual_web_review_current_metrics),readinessMetrics(metrics));
assert(acquisitionState.manual_web_review_history.some(x=>String(x.batch_id)==='120'));assert(acquisitionState.manual_web_review_history.some(x=>String(x.batch_id)==='119'));assert(acquisitionState.manual_web_review_history.some(x=>String(x.batch_id)==='118'));
const translatedLettersEducationQuestion='מה המכתבים מתעדים על אחריות ההורים והקהילה לחינוך ילדים, ובפרט לימוד בקיץ והקמת בתי ספר לבנות?';
for(const mode of ['regular','researcher']){const m=buildAnswerModel(idx.entries,translatedLettersEducationQuestion,{mode});assert(m.answerable,mode+': multi-source education responsibility synthesis must be answerable');assert(m.sources.some(e=>sourceAID(e)==='3906812'));assert(m.sources.some(e=>sourceAID(e)==='5920863'));assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length));if(mode==='researcher'){assert(m.research&&m.research.depth==='deep'&&m.research.claim_source_map.some(c=>c.source_locators.some(l=>String(l).includes('272–287')))&&m.research.claim_source_map.some(c=>c.source_locators.some(l=>String(l).includes('272–288'))),'researcher mode must expose both translated-letter locators in the claim-source map');assert(m.research.synthesis_constraints.non_independent_sources>=2,'deep researcher must mark both English translations as non-independent presentations');assert(m.research.evidence_witnesses.filter(w=>['3906812','5920863'].includes(String(w.aid))).every(w=>w.independent_witness===false),'deep researcher must preserve translation non-independence');}}


// Batch 121 assertions
assert.equal(batch121Data.batch_id,'121');assert.equal(batch121Data.records.length,16);assert.deepEqual(batch121Data.new_aids,batch121Aids);assert.deepEqual(batch121Data.enriched_aids,[2989585]);assert.equal(batch121Data.new_source_identities,16);assert.equal(batch121Data.existing_identities_enriched,1);assert.equal(batch121Data.new_response_propositions,20);assert.equal(batch121Data.existing_response_propositions_added,3);assert.equal(batch121Data.total_new_paraphrase_entries,23);assert.equal(batch121Data.answer_eligible_source_families_added,16);assert.equal(batch121Data.independent_witnesses_added,16);assert.equal(batch121Data.non_independent_presentations_added,0);assert.equal(batch121Data.content_verified_unique_sources_added,0);assert.equal(batch121Data.reviewed_item_count,17);assert.equal(batch121Data.source_bodies_inspected,16);assert.equal(batch121Data.source_body_pages_opened,17);assert.equal(batch121Data.source_body_review.length,16);assert(batch121Data.source_body_review.every(r=>r.body_text_inspected&&r.inspected_original_language_body));assert.equal(batch121Data.records.reduce((n,r)=>n+r.response_propositions.length,0),20);assert.equal(new Set(batch121Data.records.map(r=>String(r.aid))).size,16);assert.equal(new Set(batch121Data.records.map(r=>r.evidence_family_id)).size,16);assert.deepEqual(batch121Data.language_distribution,{Hebrew:10,Yiddish:5,'Hebrew/Yiddish':1});assert.equal(batch121Data.excluded_candidate_count,1);assert.equal(batch121Data.excluded_candidates[0].aid,553691);assert.equal(batch121Data.fallback_source_attempted,true);assert.equal(batch121Data.fallback_source_results.accessible_item_level_bodies,16);assert.equal(batch121Data.fallback_source_results.existing_identity_bodies,1);assert.equal(batch121Data.crawler_retry,false);assert.equal(batch121Data.access_control_bypassed,false);assert.equal(batch121Data.full_text_copied,false);assert.equal(batch121Data.scan_only_verification_used,false);assert.equal(batch121Data.translations_counted_as_independent_witnesses,0);assert.deepEqual(batch121Data.metrics_before,{answer_eligible_unique_sources:1175,content_verified_unique_sources:854,answer_eligible_propositions:3270});assert.deepEqual(batch121Data.metrics_expected_after,{answer_eligible_unique_sources:1191,content_verified_unique_sources:854,answer_eligible_propositions:3293});assert.deepEqual(batch121Data.metrics_delta_at_batch_boundary,{answer_eligible_unique_sources:16,content_verified_unique_sources:0,answer_eligible_propositions:23});for(const r of batch121Data.records){assert.equal(r.status,'Parsed');assert.equal(r.pipeline_status,'Parsed');assert.equal(r.canonical_status,'Parsed');assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);assert.equal(r.proposition_verification,'source_text_inspected');assert(r.proposition_source_locator&&r.provenance&&r.verification_scope&&r.context_status==='partial'&&r.has_content_evidence);assert.equal(r.response_propositions.length,r.response_proposition_locators.length);}for(const aid of batch121Aids){const matches=idx.entries.filter(e=>sourceAID(e)===String(aid));assert.equal(matches.length,1,'batch-121 AID '+aid+' must have exactly one canonical identity');const e=matches[0];assert(e.has_content_evidence);assert.equal(e.status,'Parsed');assert.equal(e.canonical_file,batch121Path);assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');assert(e.proposition_source_locator&&e.verification_scope);assert(!queue.records.some(q=>String(q.key||'')==='aid:'+aid||String(q.source_url||'').includes('/aid/'+aid+'/')));}assert(queue.records.some(q=>String(q.aid)==='553691'&&String(q.verification_scope||'').includes('לא נמצא תמליל')));const enriched2989585Batch121=idx.entries.find(e=>sourceAID(e)==='2989585');assert(enriched2989585Batch121&&enriched2989585Batch121.response_propositions.length===19);assert.equal(batch121Data.existing_identity_updates[0].existing_propositions_before,16);assert.equal(batch121Data.existing_identity_updates[0].propositions_added,3);assert.equal(batch121Data.existing_identity_updates[0].total_propositions_after,19);assert.equal(batch121Data.deduplication_check.full_index_scan_available,true);assert.deepEqual(batch121Data.deduplication_check.canonical_identity_collisions,[]);assert.deepEqual(batch121Data.deduplication_check.missing_canonical_identities,[]);assert.equal(batch121Data.deduplication_check.all_target_identities_answer_eligible,true);assert(['reconciled','reconciled_with_variance'].includes(batch121Data.reconciliation_status));const crossContextQuestion='מה המקורות מתעדים על שמירת הקשר הרוחני מחוץ למסגרת לימוד קבועה, ובכלל זה לימוד משניות בדרך ועיסוק בענייני מסחר?';for(const mode of ['regular','researcher']){const m=buildAnswerModel(idx.entries,crossContextQuestion,{mode});assert(m.answerable,mode+': cross-context spiritual continuity synthesis must be answerable');assert(m.sources.some(e=>sourceAID(e)==='528748'));assert(m.sources.some(e=>sourceAID(e)==='528756'));assert(m.sources.some(e=>sourceAID(e)==='2989585'));assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length));if(mode==='researcher'){assert(m.research&&m.research.depth==='deep');assert(m.research.claim_source_map.some(c=>c.source_locators.some(l=>String(l).includes('172–173'))));assert(m.research.claim_source_map.some(c=>c.source_locators.some(l=>String(l).includes('499–508'))));assert(m.research.evidence_families.length>=3);}}

// Batch 122: twelve inspected Hebrew/Yiddish Hayom Yom entries and two distinct
// unedited Hebrew Sicha transcripts. Existing-source enrichment was attempted
// but withheld where the public page was blocked or only a rewritten summary shell.
const batch122Path='data/items/content-research-batch-122-2026-11-16.json';
const batch122Data=JSON.parse(await readFile(new URL(batch122Path,root),'utf8'));
const batch122Aids=[528764,528765,528766,528767,528768,528769,528771,528772,528773,528774,528775,528776,4280364,4280365];
const batch123Path='data/items/content-research-batch-123-2026-11-16.json';
const batch123Data=JSON.parse(await readFile(new URL(batch123Path,root),'utf8'));
const batch123Aids=[528777,528778,528779,528780,528781,528782,528783,528784,528785,528786,528787,528788,528789,528790];
const batch124Path='data/items/content-research-batch-124-2026-11-16.json';
const batch124Data=JSON.parse(await readFile(new URL(batch124Path,root),'utf8'));
const batch124Aids=[528791,528792,528793,528794,528795,528796,528797,528798,528799,528801,528802,528804];
const batch125Path='data/items/content-research-batch-125-2026-11-16.json';
const batch125Data=JSON.parse(await readFile(new URL(batch125Path,root),'utf8'));
const batch125Aids=[528805,528806,528807,528808,528809,528810,528811,528812,528813,528814,528815,528816,528817,528818,528819];
const batch126Path='data/items/content-research-batch-126-2026-11-16.json';
const batch126Data=JSON.parse(await readFile(new URL(batch126Path,root),'utf8'));
const batch126Aids=[3316840,3316843,3316846,3316847,3316850,3316852,3316854,3316856,3316858,3316863,3316866];
const batch127Path='data/items/content-research-batch-127-2026-11-16.json';
const batch127Data=JSON.parse(await readFile(new URL(batch127Path,root),'utf8'));
const batch127Aids=[528832,528833,528834,528835,528836,528837,528838,528839,528840,528841,528842,528843,528844,528845,5920904];
const batch128Path='data/items/content-research-batch-128-2026-11-16.json';
const batch128Data=JSON.parse(await readFile(new URL(batch128Path,root),'utf8'));
const batch128Aids=[528846,528847,528848,528849,528850,528851,528852,528853,528854,528855,528856,528857,528858,528859,528860,528862,528863,528864];
const batch129Path='data/items/content-research-batch-129-2026-11-16.json';
const batch129Data=JSON.parse(await readFile(new URL(batch129Path,root),'utf8'));
const batch130Path='data/items/content-research-batch-130-2026-11-17.json';
const batch130Data=JSON.parse(await readFile(new URL(batch130Path,root),'utf8'));
const batch130Aids=[528877,528878,528880,528881,528882,528883,528884,528885,528886,528887,528888,528889,528890,528891,2277337];
const batch131Path='data/items/content-research-batch-131-2026-11-17.json';
const batch131Data=JSON.parse(await readFile(new URL(batch131Path,root),'utf8'));
const batch131Aids=[528893,528894,528895,528896,528897,528898,528899,528900,528901,528902,528903,528904,528905,528906];
const batch132Path='data/items/content-research-batch-132-2026-11-17.json';
const batch132Data=JSON.parse(await readFile(new URL(batch132Path,root),'utf8'));
const batch132Aids=[528907,528908,528909,528910,528911,528912,528913,528914,528915,528916,528917,528918,528919,528920,528921,1924127];
const batch133Path='data/items/content-research-batch-133-2026-11-17.json';
const batch133Data=JSON.parse(await readFile(new URL(batch133Path,root),'utf8'));
const batch133Aids=[528923,528924,528925,528926,528927,528928,528929,528930,528931,528932,528933,528934,528935,528936,528937,528938,528939,528940,6427690];
const batch130DatePageId='hayom-yom-5704-18-tishrei-date-page-2026-09-29';
assert.equal(batch122Data.batch_id,'122');
assert.equal(batch122Data.records.length,14);
assert.deepEqual(batch122Data.new_aids,batch122Aids);assert.deepEqual(batch122Data.enriched_aids,[528717]);
assert.equal(batch122Data.new_source_identities,14);
assert.equal(batch122Data.existing_identities_enriched,1);
assert.equal(batch122Data.new_response_propositions,19);
assert.equal(batch122Data.existing_response_propositions_added,1);
assert.equal(batch122Data.total_new_paraphrase_entries,20);
assert.equal(batch122Data.answer_eligible_source_families_added,14);
assert.equal(batch122Data.independent_witnesses_added,14);
assert.equal(batch122Data.non_independent_presentations_added,0);
assert.equal(batch122Data.content_verified_unique_sources_added,0);
assert.equal(batch122Data.source_bodies_inspected,15);assert.equal(batch122Data.reviewed_item_count,18);assert.equal(batch122Data.source_body_pages_opened,19);
assert.equal(batch122Data.source_body_review.length,15);
assert(batch122Data.source_body_review.every(r=>r.body_text_inspected&&r.inspected_original_language_body));
assert.equal(batch122Data.records.reduce((n,r)=>n+r.response_propositions.length,0),20,'batch 123 adds one later in-place proposition to AID 528765; batch 122 historical new-proposition count remains 19');
assert.equal(batch122Data.records.find(r=>String(r.aid)==='528765').response_propositions.length,2);
assert.equal(new Set(batch122Data.records.map(r=>String(r.aid))).size,14);
assert.equal(new Set(batch122Data.records.map(r=>r.evidence_family_id)).size,14);
assert.equal(new Set(batch122Data.records.map(r=>r.source_url)).size,14);
assert.deepEqual(batch122Data.language_distribution,{Hebrew:10,Yiddish:2,'Hebrew/Yiddish':2});
assert.deepEqual(batch122Data.original_language_distribution,{Hebrew:10,Yiddish:2,'Hebrew/Yiddish':2});
assert.equal(batch122Data.source_type_distribution.published_hebrew_hayom_yom_entry,8);
assert.equal(batch122Data.source_type_distribution.published_yiddish_hayom_yom_entry,2);
assert.equal(batch122Data.source_type_distribution.published_mixed_hebrew_yiddish_hayom_yom_entry,2);
assert.equal(batch122Data.source_type_distribution.published_unedited_hebrew_sicha_transcript,2);
assert.equal(batch122Data.blocked_candidate_count,2);
assert.equal(batch122Data.blocked_candidates.some(x=>String(x.aid)==='2989585'),true);
assert.equal(batch122Data.blocked_candidates.some(x=>String(x.aid)==='4783983'),true);
assert.equal(batch122Data.excluded_candidate_count,1);
assert.equal(batch122Data.excluded_candidates[0].aid,528770);
assert.equal(batch122Data.fallback_source_attempted,true);
assert.equal(batch122Data.fallback_source_results.accessible_item_level_bodies,14);
assert.equal(batch122Data.fallback_source_results.existing_identity_bodies,1);assert.deepEqual(batch122Data.fallback_source_results.existing_identity_aids,[528717]);
assert.equal(batch122Data.crawler_retry,false);
assert.equal(batch122Data.access_control_bypassed,false);
assert.equal(batch122Data.full_text_copied,false);
assert.equal(batch122Data.scan_only_verification_used,false);
assert.equal(batch122Data.translations_counted_as_independent_witnesses,0);
assert.deepEqual(batch122Data.metrics_before,{answer_eligible_unique_sources:1191,content_verified_unique_sources:854,answer_eligible_propositions:3293});
assert.deepEqual(batch122Data.metrics_expected_after,{answer_eligible_unique_sources:1205,content_verified_unique_sources:854,answer_eligible_propositions:3313});
assert.deepEqual(batch122Data.metrics_delta_at_batch_boundary,{answer_eligible_unique_sources:14,content_verified_unique_sources:0,answer_eligible_propositions:20});
for(const r of batch122Data.records){
 assert.equal(r.status,'Parsed');assert.equal(r.pipeline_status,'Parsed');assert.equal(r.canonical_status,'Parsed');
 assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);assert.equal(r.proposition_verification,'source_text_inspected');
 assert(r.proposition_source_locator&&r.provenance&&r.verification_scope&&r.context_status==='partial'&&r.has_content_evidence);
 assert.equal(r.response_propositions.length,r.response_proposition_locators.length);
}
for(const aid of batch122Aids){
 const matches=idx.entries.filter(e=>sourceAID(e)===String(aid));
 assert.equal(matches.length,1,'batch-122 AID '+aid+' must have exactly one canonical identity');
 const e=matches[0];assert(e.has_content_evidence);assert.equal(e.status,'Parsed');
 assert.equal(e.canonical_file,batch122Path);assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope);
 assert(!queue.records.some(q=>String(q.key||'')==='aid:'+aid||String(q.source_url||'').includes('/aid/'+aid+'/')));
}
assert(!idx.entries.some(e=>sourceAID(e)==='528770'&&e.has_content_evidence&&e.response_propositions?.length),'month-navigation AID 528770 must not be indexed as answer-eligible content');
assert(['reconciled','reconciled_with_variance'].includes(batch122Data.reconciliation_status));
assert.equal(batch122Data.deduplication_check.full_index_scan_available,true);
assert.deepEqual(batch122Data.deduplication_check.canonical_identity_collisions,[]);
assert.deepEqual(batch122Data.deduplication_check.missing_canonical_identities,[]);
assert.equal(batch122Data.deduplication_check.all_target_identities_answer_eligible,true);
assert.deepEqual(readinessMetrics(batch122Data.metrics_actual_after),readinessMetrics(metrics));
assert.deepEqual(readinessMetrics(batch122Data.metrics_actual_before),readinessMetrics(batch121Data.metrics_actual_after));
const audit122=projectState.development_recovery.reconciliation_chain.find(x=>String(x.batch_id)==='122');
assert(audit122);assert.deepEqual(readinessMetrics(batch122Data.metrics_actual_after),readinessMetrics(audit122.metrics_actual_after));
assert(!projectState.development_recovery.pending_reconciliation_batches.includes('122'));
assert(!projectState.metrics_integrity.answer_readiness.pending_batches.includes('122'));
assert(projectState.development_recovery.reconciliation_chain.some(x=>String(x.batch_id)==='122'));

assert(acquisitionState.manual_web_review_history.some(x=>String(x.batch_id)==='122'));
assert(acquisitionState.manual_web_review_history.some(x=>String(x.batch_id)==='121'));
assert.deepEqual(readinessMetrics(acquisitionState.manual_web_review_current_metrics),readinessMetrics(metrics));
const interpersonalSynthesisQuestion='מה המקורות מתעדים על עשיית טובה ליהודי, אהבת ישראל ולימוד זכות?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,interpersonalSynthesisQuestion,{mode});
 assert(m.answerable,mode+': multi-source interpersonal-responsibility synthesis must be answerable');
 assert(m.sources.some(e=>sourceAID(e)==='4280365'));
 assert(m.sources.some(e=>sourceAID(e)==='528767'));
 assert(m.sources.some(e=>sourceAID(e)==='528772'));
 assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=3);
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length));
 if(mode==='researcher'){
  assert(m.research&&m.research.depth==='deep');
  assert(m.research.claim_source_map.length>0);
  assert(m.research.citation_entailment.every(x=>x.valid));
  assert(m.research.context_boundary.every(x=>x.valid));
  assert(m.research.evidence_families.length>=3);
 }
}
const farbrengenSynthesisQuestion='מה השיחה מתעדת על תפילה בציבור, תורה וגמילות חסדים?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,farbrengenSynthesisQuestion,{mode});
 assert(m.answerable,mode+': inspected 19 Kislev transcript must answer the bounded query');
 assert(m.sources.some(e=>sourceAID(e)==='4280364'));
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length));
 if(mode==='researcher')assert(m.research&&m.research.depth==='deep'&&m.research.claim_source_map.some(c=>c.source_locators.some(l=>String(l).includes('245–252'))));
}

assert.equal(batch122Data.existing_identity_updates.length,1);assert.equal(batch122Data.existing_identity_updates[0].aid,528717);assert.equal(batch122Data.existing_identity_updates[0].existing_propositions_before,1);assert.equal(batch122Data.existing_identity_updates[0].propositions_added,1);assert.equal(batch122Data.existing_identity_updates[0].total_propositions_after,2);const enriched528717=idx.entries.find(e=>sourceAID(e)==='528717');assert(enriched528717&&enriched528717.response_propositions.length===2);assert.equal(enriched528717.canonical_file,'data/items/content-research-batch-118-2026-11-16.json');assert.equal(enriched528717.evidence_family_id,'hayom-yom-528717-5703');assert(enriched528717.response_proposition_locators.some(l=>String(l).includes('172–173')));const shlichutDailyQuestion='מה היום יום מתעד על שליחותו של חסיד ועל הקשר בין השליח למשלח בפעולות היום־יום?';for(const mode of ['regular','researcher']){const m=buildAnswerModel(idx.entries,shlichutDailyQuestion,{mode});assert(m.answerable,mode+': existing enriched Hayom Yom AID 528717 must answer the bounded shlichut question');assert(m.sources.some(e=>sourceAID(e)==='528717'));assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length));if(mode==='researcher')assert(m.research&&m.research.depth==='deep'&&m.research.claim_source_map.some(c=>c.source_locators.some(l=>String(l).includes('172–173'))));}


// Batch 123: fourteen new original-language daily entries and one in-place enrichment.
assert.equal(batch123Data.batch_id,'123');
assert.equal(batch123Data.batch_file,batch123Path);
assert.equal(batch123Data.records.length,14);
assert.deepEqual(batch123Data.new_aids,batch123Aids);
assert.deepEqual(batch123Data.enriched_aids,[528765]);
assert.equal(batch123Data.new_source_identities,14);
assert.equal(batch123Data.existing_identities_enriched,1);
assert.equal(batch123Data.new_response_propositions,23);
assert.equal(batch123Data.existing_response_propositions_added,1);
assert.equal(batch123Data.total_new_paraphrase_entries,24);
assert.equal(batch123Data.answer_eligible_source_families_added,14);
assert.equal(batch123Data.independent_witnesses_added,14);
assert.equal(batch123Data.content_verified_unique_sources_added,0);
assert.equal(batch123Data.source_bodies_inspected,15);
assert.equal(batch123Data.source_body_review.length,15);
assert.equal(batch123Data.records.reduce((n,r)=>n+r.response_propositions.length,0),23);
assert.equal(new Set(batch123Data.records.map(r=>String(r.aid))).size,14);
assert.equal(new Set(batch123Data.records.map(r=>r.evidence_family_id)).size,14);
assert.equal(new Set(batch123Data.records.map(r=>r.source_url)).size,14);
assert.deepEqual(batch123Data.language_distribution,{Hebrew:10,Yiddish:3,'Hebrew/Yiddish':1});
assert.deepEqual(batch123Data.original_language_distribution,{Hebrew:10,Yiddish:3,'Hebrew/Yiddish':1});
assert.equal(batch123Data.source_type_distribution.published_hebrew_hayom_yom_entry,10);
assert.equal(batch123Data.source_type_distribution.published_yiddish_hayom_yom_entry,3);
assert.equal(batch123Data.source_type_distribution.published_mixed_hebrew_yiddish_hayom_yom_entry,1);
assert.equal(batch123Data.blocked_candidate_count,1);
assert.equal(String(batch123Data.blocked_candidates[0].aid),'4666220');
assert.equal(batch123Data.fallback_source_attempted,true);
assert.equal(batch123Data.fallback_source_results.accessible_item_level_bodies,14);
assert.equal(batch123Data.fallback_source_results.existing_identity_bodies,1);
assert.deepEqual(batch123Data.fallback_source_results.existing_identity_aids,[528765]);
assert.equal(batch123Data.crawler_retry,false);
assert.equal(batch123Data.access_control_bypassed,false);
assert.equal(batch123Data.full_text_copied,false);
assert.equal(batch123Data.scan_only_verification_used,false);
assert.equal(batch123Data.translations_counted_as_independent_witnesses,0);
assert.deepEqual(batch123Data.metrics_before,{answer_eligible_unique_sources:1205,content_verified_unique_sources:854,answer_eligible_propositions:3313});
assert.deepEqual(batch123Data.metrics_expected_after,{answer_eligible_unique_sources:1219,content_verified_unique_sources:854,answer_eligible_propositions:3337});
assert.deepEqual(batch123Data.metrics_delta_at_batch_boundary,{answer_eligible_unique_sources:14,content_verified_unique_sources:0,answer_eligible_propositions:24});
for(const r of batch123Data.records){
 assert.equal(r.status,'Parsed');assert.equal(r.pipeline_status,'Parsed');assert.equal(r.canonical_status,'Parsed');
 assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);assert.equal(r.proposition_verification,'source_text_inspected');
 assert(r.proposition_source_locator&&r.provenance&&r.verification_scope&&r.context_status==='partial'&&r.has_content_evidence);
 assert.equal(r.response_propositions.length,r.response_proposition_locators.length);
}
for(const aid of batch123Aids){
 const matches=idx.entries.filter(e=>sourceAID(e)===String(aid));
 assert.equal(matches.length,1,'batch-123 AID '+aid+' must have exactly one canonical identity');
 const e=matches[0];assert(e.has_content_evidence);assert.equal(e.status,'Parsed');
 assert.equal(e.canonical_file,batch123Path);assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope);
 assert(!queue.records.some(q=>String(q.key||'')==='aid:'+aid||String(q.source_url||'').includes('/aid/'+aid+'/')));
}
const enriched528765=idx.entries.find(e=>sourceAID(e)==='528765');
assert(enriched528765&&enriched528765.response_propositions.length===2);
assert.equal(enriched528765.canonical_file,'data/items/content-research-batch-122-2026-11-16.json');
assert.equal(enriched528765.evidence_family_id,'hayom-yom-528765-5703');
assert(enriched528765.response_proposition_locators.some(l=>String(l).includes('שורה 173')));
assert(enriched528765.response_proposition_locators.some(l=>String(l).includes('שורה 174')));
assert.equal(batch123Data.existing_identity_updates[0].aid,528765);
assert.equal(batch123Data.existing_identity_updates[0].existing_propositions_before,1);
assert.equal(batch123Data.existing_identity_updates[0].propositions_added,1);
assert.equal(batch123Data.existing_identity_updates[0].total_propositions_after,2);
assert(['reconciled','reconciled_with_variance'].includes(batch123Data.reconciliation_status));
assert.equal(batch123Data.deduplication_check.full_index_scan_available,true);
assert.deepEqual(batch123Data.deduplication_check.canonical_identity_collisions,[]);
assert.deepEqual(batch123Data.deduplication_check.missing_canonical_identities,[]);
assert.equal(batch123Data.deduplication_check.all_target_identities_answer_eligible,true);
assert.deepEqual(readinessMetrics(batch123Data.metrics_actual_after),readinessMetrics(batch124Data.metrics_actual_before));
assert.deepEqual(readinessMetrics(batch124Data.metrics_actual_after),readinessMetrics(batch125Data.metrics_actual_before));
assert.deepEqual(readinessMetrics(batch125Data.metrics_actual_after),readinessMetrics(batch126Data.metrics_actual_before));
assert.deepEqual(readinessMetrics(batch126Data.metrics_actual_after),readinessMetrics(batch127Data.metrics_actual_before));
assert.deepEqual(readinessMetrics(batch127Data.metrics_actual_after),readinessMetrics(batch128Data.metrics_actual_before));
assert.deepEqual(readinessMetrics(batch128Data.metrics_actual_after),readinessMetrics(batch129Data.metrics_actual_before));
assert.deepEqual(readinessMetrics(batch129Data.metrics_actual_after),readinessMetrics(batch130Data.metrics_actual_before));
assert.deepEqual(readinessMetrics(batch130Data.metrics_actual_after),readinessMetrics(batch131Data.metrics_actual_before));
assert.deepEqual(readinessMetrics(batch131Data.metrics_actual_after),readinessMetrics(batch132Data.metrics_actual_before));
for(const b of ['124','125','126','127','128','129','130','131','132','133','134','135']){assert(!projectState.development_recovery.pending_reconciliation_batches.includes(b));assert(!projectState.metrics_integrity.answer_readiness.pending_batches.includes(b));}
assert.equal(String(projectState.current_batch),currentReviewBatchId);
assert.equal(String(projectState.development_recovery.current_batch),currentReviewBatchId);
assert.equal(String(projectState.development_recovery.last_batch_summary.batch_id),currentReviewBatchId);


for(const [id,next] of [['124',batch125Data.metrics_actual_before],['125',batch126Data.metrics_actual_before],['126',batch127Data.metrics_actual_before],['127',batch128Data.metrics_actual_before],['128',batch129Data.metrics_actual_before],['129',batch130Data.metrics_actual_before],['130',batch131Data.metrics_actual_before],['131',batch132Data.metrics_actual_before],['132',batch133Data.metrics_actual_before],['133',batch134Data.metrics_actual_before],['134',batch135Data.metrics_actual_before],['135',metrics]]){const audit=projectState.development_recovery.reconciliation_chain.find(x=>String(x.batch_id)===id);assert(audit,'missing reconciliation audit for batch '+id);assert.deepEqual(readinessMetrics(audit.metrics_actual_after),readinessMetrics(next));}
assert.equal(String(acquisitionState.manual_web_review.batch_id),currentReviewBatchId);
assert(String(acquisitionState.manual_web_review.batch_file).includes('content-research-batch-'+currentReviewBatchId.padStart(3,'0')+'-'));
assert.equal(String(acquisitionState.previous_manual_web_review.batch_id),previousReviewBatchId);
assert(String(acquisitionState.previous_manual_web_review.batch_file).includes('content-research-batch-'+previousReviewBatchId.padStart(3,'0')+'-'));
assert.equal(String(acquisitionState.last_manual_web_review.batch_id),currentReviewBatchId);
assert.equal(String(acquisitionState.last_manual_review.batch_id),currentReviewBatchId);
for(const id of ['126','127','128','129','130','131','132','133','134','135'])assert(acquisitionState.manual_web_review_history.some(x=>String(x.batch_id)===id));
assert.deepEqual(readinessMetrics(acquisitionState.manual_web_review_current_metrics),readinessMetrics(metrics));
 
// Batch 124: twelve new original-language Hebrew/Yiddish daily entries and one
// in-place footnote enrichment of the existing AID 5959845 identity.
assert.equal(batch124Data.batch_id,'124');
assert.equal(batch124Data.batch_file,batch124Path);
assert.equal(batch124Data.records.length,12);
assert.deepEqual(batch124Data.new_aids,batch124Aids);
assert.deepEqual(batch124Data.enriched_aids,[5959845]);
assert.equal(batch124Data.new_source_identities,12);
assert.equal(batch124Data.existing_identities_enriched,1);
assert.equal(batch124Data.new_response_propositions,20);
assert.equal(batch124Data.existing_response_propositions_added,1);
assert.equal(batch124Data.total_new_paraphrase_entries,21);
assert.equal(batch124Data.answer_eligible_source_families_added,12);
assert.equal(batch124Data.independent_witnesses_added,12);
assert.equal(batch124Data.non_independent_presentations_added,0);
assert.equal(batch124Data.content_verified_unique_sources_added,0);
assert.equal(batch124Data.source_bodies_inspected,13);
assert.equal(batch124Data.source_body_review.length,13);
assert.equal(batch124Data.records.reduce((n,r)=>n+r.response_propositions.length,0),20);
assert.equal(new Set(batch124Data.records.map(r=>String(r.aid))).size,12);
assert.equal(new Set(batch124Data.records.map(r=>r.evidence_family_id)).size,12);
assert.equal(new Set(batch124Data.records.map(r=>r.source_url)).size,12);
assert.deepEqual(batch124Data.language_distribution,{Hebrew:7,Yiddish:5});
assert.deepEqual(batch124Data.original_language_distribution,{Hebrew:7,Yiddish:5});
assert.equal(batch124Data.source_type_distribution.published_hebrew_hayom_yom_entry,7);
assert.equal(batch124Data.source_type_distribution.published_yiddish_hayom_yom_entry,5);
assert.equal(batch124Data.blocked_candidate_count,3);
assert.equal(batch124Data.excluded_candidate_count,1);
assert.equal(batch124Data.excluded_candidates[0].aid,528800);
assert.equal(batch124Data.fallback_source_attempted,true);
assert.equal(batch124Data.fallback_source_results.accessible_item_level_bodies,12);
assert.equal(batch124Data.fallback_source_results.existing_identity_bodies,1);
assert.deepEqual(batch124Data.fallback_source_results.existing_identity_aids,[5959845]);
assert.equal(batch124Data.crawler_retry,false);
assert.equal(batch124Data.access_control_bypassed,false);
assert.equal(batch124Data.full_text_copied,false);
assert.equal(batch124Data.scan_only_verification_used,false);
assert.equal(batch124Data.translations_counted_as_independent_witnesses,0);
assert.deepEqual(batch124Data.metrics_before,{answer_eligible_unique_sources:1219,content_verified_unique_sources:854,answer_eligible_propositions:3337});
assert.deepEqual(batch124Data.metrics_expected_after,{answer_eligible_unique_sources:1231,content_verified_unique_sources:854,answer_eligible_propositions:3358});
assert.deepEqual(batch124Data.metrics_delta_at_batch_boundary,{answer_eligible_unique_sources:12,content_verified_unique_sources:0,answer_eligible_propositions:21});
for(const r of batch124Data.records){
 assert.equal(r.status,'Parsed');assert.equal(r.pipeline_status,'Parsed');assert.equal(r.canonical_status,'Parsed');
 assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);assert.equal(r.proposition_verification,'source_text_inspected');
 assert(r.proposition_source_locator&&r.provenance&&r.verification_scope&&r.context_status==='partial'&&r.has_content_evidence);
 assert.equal(r.response_propositions.length,r.response_proposition_locators.length);
 assert.equal(r.independent_witness,true);assert.equal(r.translation_of_evidence_family_id,null);
}
for(const aid of batch124Aids){
 const matches=idx.entries.filter(e=>sourceAID(e)===String(aid));
 assert.equal(matches.length,1,'batch-124 AID '+aid+' must have exactly one canonical identity');
 const e=matches[0];assert(e.has_content_evidence);assert.equal(e.status,'Parsed');assert.equal(e.canonical_file,batch124Path);
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope);
 assert(!queue.records.some(q=>String(q.key||'')==='aid:'+aid||String(q.source_url||'').includes('/aid/'+aid+'/')));
}
assert.equal(batch124Data.existing_identity_updates.length,1);
assert.equal(batch124Data.existing_identity_updates[0].aid,5959845);
assert.equal(batch124Data.existing_identity_updates[0].existing_propositions_before,11);
assert.equal(batch124Data.existing_identity_updates[0].propositions_added,1);
assert.equal(batch124Data.existing_identity_updates[0].total_propositions_after,12);
const enriched5959845Batch124=idx.entries.find(e=>sourceAID(e)==='5959845');
assert(enriched5959845Batch124&&enriched5959845Batch124.response_propositions.length===16);
assert.equal(enriched5959845Batch124.canonical_file,'data/items/content-research-batch-106-2026-11-16.json');
assert.equal(enriched5959845Batch124.evidence_family_id,'sicha-5728-shabbat-pinchas-torah-and-practical-work-aid5959845');
assert(enriched5959845Batch124.response_proposition_locators.some(l=>String(l).includes('434–435')));
assert(['reconciled','reconciled_with_variance'].includes(batch124Data.reconciliation_status));
assert.equal(batch124Data.deduplication_check.full_index_scan_available,true);
assert.deepEqual(batch124Data.deduplication_check.canonical_identity_collisions,[]);
assert.deepEqual(batch124Data.deduplication_check.missing_canonical_identities,[]);
assert.equal(batch124Data.deduplication_check.all_target_identities_answer_eligible,true);

assert.equal(batch125Data.batch_id,'125');
assert.equal(batch125Data.batch_file,batch125Path);
assert.equal(batch125Data.records.length,15);
assert.deepEqual(batch125Data.new_aids,batch125Aids);
assert.deepEqual(batch125Data.enriched_aids,[5959845]);
assert.equal(batch125Data.new_source_identities,15);
assert.equal(batch125Data.existing_identities_enriched,1);
assert.equal(batch125Data.new_response_propositions,23);
assert.equal(batch125Data.existing_response_propositions_added,1);
assert.equal(batch125Data.total_new_paraphrase_entries,24);
assert.equal(batch125Data.answer_eligible_source_families_added,15);
assert.equal(batch125Data.independent_witnesses_added,15);
assert.equal(batch125Data.content_verified_unique_sources_added,0);
assert.equal(batch125Data.source_bodies_inspected,16);
assert.equal(batch125Data.source_body_review.length,16);
assert.equal(batch125Data.records.reduce((n,r)=>n+r.response_propositions.length,0)-batch126Data.existing_identity_updates.filter(u=>u.canonical_file===batch125Path).reduce((n,u)=>n+u.propositions_added,0)-batch127Data.existing_identity_updates.filter(u=>u.canonical_file===batch125Path).reduce((n,u)=>n+u.propositions_added,0),23);
assert.equal(new Set(batch125Data.records.map(r=>String(r.aid))).size,15);
assert.equal(new Set(batch125Data.records.map(r=>r.evidence_family_id)).size,15);
assert.equal(batch125Data.language_distribution.Hebrew,6);
assert.equal(batch125Data.language_distribution.Yiddish,9);
assert.equal(batch125Data.blocked_candidate_count,1);
assert.equal(batch125Data.fallback_source_attempted,true);
assert.equal(batch125Data.fallback_source_results.translated_alternative_page_accessed,1);
assert.equal(batch125Data.fallback_source_results.original_language_text_visible_on_alternative_page,true);
assert.equal(batch125Data.crawler_retry,false);
assert.equal(batch125Data.access_control_bypassed,false);
assert.equal(batch125Data.full_text_copied,false);
assert.equal(batch125Data.translations_counted_as_independent_witnesses,0);
assert.equal(batch125Data.existing_identity_updates[0].aid,5959845);
assert.equal(batch125Data.existing_identity_updates[0].existing_propositions_before,12);
assert.equal(batch125Data.existing_identity_updates[0].propositions_added,1);
assert.equal(batch125Data.existing_identity_updates[0].total_propositions_after,13);
for(const aid of batch125Aids){
 const matches=idx.entries.filter(e=>sourceAID(e)===String(aid));
 assert.equal(matches.length,1,'batch-125 AID '+aid+' must have exactly one canonical identity');
 const e=matches[0];assert(e.has_content_evidence);assert.equal(e.status,'Parsed');assert.equal(e.canonical_file,batch125Path);
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.provenance&&e.verification_scope&&e.context_status==='partial');
 assert.equal(e.response_propositions.length,e.response_proposition_locators.length);
 assert.equal(e.independent_witness,true);assert.equal(e.translation_of_evidence_family_id,null);
 assert(!queue.records.some(q=>String(q.key||'')==='aid:'+aid||String(q.source_url||'').includes('/aid/'+aid+'/')));
}
const recovered528810=idx.entries.find(e=>sourceAID(e)==='528810');
assert(recovered528810&&recovered528810.source_url.includes('fr.chabad.org'));
assert(recovered528810.translation_status.includes('הטקסט המקורי'));
assert.equal(batch125Data.deduplication_check.full_index_scan_available,true);
assert.deepEqual(batch125Data.deduplication_check.canonical_identity_collisions,[]);
assert.deepEqual(batch125Data.deduplication_check.missing_canonical_identities,[]);
assert.equal(batch125Data.deduplication_check.all_target_identities_answer_eligible,true);
const enriched5959845Batch125=idx.entries.find(e=>sourceAID(e)==='5959845');
assert(enriched5959845Batch125&&enriched5959845Batch125.response_propositions.length===16);
assert.equal(enriched5959845Batch125.canonical_file,'data/items/content-research-batch-106-2026-11-16.json');
assert.equal(enriched5959845Batch125.evidence_family_id,'sicha-5728-shabbat-pinchas-torah-and-practical-work-aid5959845');
assert(enriched5959845Batch125.response_proposition_locators.some(l=>String(l).includes('338–343')));
const loveIsraelAphorismQuestion='מה מתעד היום יום על היחס בין חסידות, יראת שמים ואהבת ישראל?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,loveIsraelAphorismQuestion,{mode});
 assert(m.answerable,mode+': inspected love-of-Israel aphorism must answer the query');
 assert(m.sources.some(e=>sourceAID(e)==='528808'),mode+': AID 528808 must support the love-of-Israel query');
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length),mode+': every love-of-Israel claim needs proposition-level citations');
 if(mode==='researcher'){assert(m.research&&m.research.depth==='deep');assert(m.research.evidence_map.length>0&&m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));assert.equal(m.research.claim_source_map.length,m.claims.length);assert(m.research.claim_source_map.every(c=>c.source_numbers.length&&c.source_locators.length));}
}
const fourPairsTefillinQuestion='מהו סדר הנחת ארבעת זוגות התפילין לפי ערך היום יום?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,fourPairsTefillinQuestion,{mode});
 assert(m.answerable,mode+': inspected four-pairs tefillin entry must answer the query');
 assert(m.sources.some(e=>sourceAID(e)==='528819'),mode+': AID 528819 must support the tefillin sequence');
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length),mode+': every tefillin claim needs proposition-level citations');
 if(mode==='researcher'){assert(m.research&&m.research.depth==='deep');assert(m.research.evidence_map.length>0&&m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));assert.equal(m.research.claim_source_map.length,m.claims.length);assert(m.research.claim_source_map.every(c=>c.source_numbers.length&&c.source_locators.length));}
}
const katontiEditQuestion='מה מספר היום יום על הוספת ״במדת אמת ליעקב״ לאגרת קטנתי?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,katontiEditQuestion,{mode});
 assert(m.answerable,mode+': inspected Katonti editing tradition must answer the query');
 assert(m.sources.some(e=>sourceAID(e)==='528810'),mode+': AID 528810 must support the Katonti query through its inspected original-language body');
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length),mode+': every Katonti claim needs proposition-level citations');
 if(mode==='researcher'){assert(m.research&&m.research.depth==='deep');assert(m.research.evidence_map.length>0&&m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));assert.equal(m.research.claim_source_map.length,m.claims.length);assert(m.research.claim_source_map.every(c=>c.source_numbers.length&&c.source_locators.length));}
}
assert(['reconciled','reconciled_with_variance'].includes(batch125Data.reconciliation_status));
assert.deepEqual(readinessMetrics(batch123Data.metrics_actual_after),readinessMetrics(batch124Data.metrics_actual_before));
assert.deepEqual(readinessMetrics(batch124Data.metrics_actual_after),readinessMetrics(batch125Data.metrics_actual_before));
assert.deepEqual(readinessMetrics(batch125Data.metrics_actual_after),readinessMetrics(batch126Data.metrics_actual_before));
assert(!projectState.development_recovery.pending_reconciliation_batches.includes('124'));
assert(!projectState.development_recovery.pending_reconciliation_batches.includes('125'));
assert(!projectState.development_recovery.pending_reconciliation_batches.includes('126'));
assert(!projectState.metrics_integrity.answer_readiness.pending_batches.includes('124'));
assert(!projectState.metrics_integrity.answer_readiness.pending_batches.includes('125'));
assert(!projectState.metrics_integrity.answer_readiness.pending_batches.includes('126'));
const audit124=projectState.development_recovery.reconciliation_chain.find(x=>String(x.batch_id)==='124');
assert(audit124);assert.deepEqual(readinessMetrics(audit124.metrics_actual_after),readinessMetrics(batch125Data.metrics_actual_before));
const audit125=projectState.development_recovery.reconciliation_chain.find(x=>String(x.batch_id)==='125');
assert(audit125);assert.deepEqual(readinessMetrics(audit125.metrics_actual_after),readinessMetrics(batch126Data.metrics_actual_before));
assert(acquisitionState.manual_web_review_history.some(x=>String(x.batch_id)==='125'));
assert(acquisitionState.manual_web_review_history.some(x=>String(x.batch_id)==='126'));
assert.deepEqual(readinessMetrics(acquisitionState.manual_web_review_current_metrics),readinessMetrics(metrics));

assert.equal(batch126Data.batch_id,'126');
assert.equal(batch126Data.batch_file,batch126Path);
assert.equal(batch126Data.records.length,11);
assert.deepEqual(batch126Data.new_aids,batch126Aids);
assert.deepEqual(batch126Data.enriched_aids,[528819]);
assert.equal(batch126Data.new_source_identities,11);
assert.equal(batch126Data.existing_identities_enriched,1);
assert.equal(batch126Data.new_response_propositions,19);
assert.equal(batch126Data.existing_response_propositions_added,1);
assert.equal(batch126Data.total_new_paraphrase_entries,20);
assert.equal(batch126Data.answer_eligible_source_families_added,11);
assert.equal(batch126Data.independent_witnesses_added,11);
assert.equal(batch126Data.content_verified_unique_sources_added,0);
assert.equal(batch126Data.source_bodies_inspected,12);
assert.equal(batch126Data.source_body_pages_opened,15);
assert.equal(batch126Data.source_body_review.length,12);
assert.equal(batch126Data.records.reduce((n,r)=>n+r.response_propositions.length,0),19);
assert.equal(new Set(batch126Data.records.map(r=>String(r.aid))).size,11);
assert.equal(new Set(batch126Data.records.map(r=>r.evidence_family_id)).size,11);
assert.equal(batch126Data.language_distribution.Hebrew,8);
assert.equal(batch126Data.language_distribution.Yiddish,3);
assert.equal(batch126Data.blocked_candidate_count,3);
assert.deepEqual(batch126Data.blocked_candidates.map(x=>x.aid),[528820,528821,528822]);
assert.equal(batch126Data.fallback_source_attempted,true);
assert.equal(batch126Data.fallback_source_results.accessible_item_level_bodies,11);
assert.equal(batch126Data.fallback_source_results.existing_identity_bodies,1);
assert.equal(batch126Data.fallback_source_results.body_text_inspected,true);
assert.equal(batch126Data.crawler_retry,false);
assert.equal(batch126Data.access_control_bypassed,false);
assert.equal(batch126Data.full_text_copied,false);
assert.equal(batch126Data.scan_only_verification_used,false);
assert.equal(batch126Data.translations_counted_as_independent_witnesses,0);
assert.deepEqual(batch126Data.metrics_before,{answer_eligible_unique_sources:1246,content_verified_unique_sources:854,answer_eligible_propositions:3382});
assert.deepEqual(batch126Data.metrics_expected_after,{answer_eligible_unique_sources:1257,content_verified_unique_sources:854,answer_eligible_propositions:3402});
assert.deepEqual(batch126Data.metrics_delta_at_batch_boundary,{answer_eligible_unique_sources:11,content_verified_unique_sources:0,answer_eligible_propositions:20});
assert.equal(batch126Data.existing_identity_updates[0].aid,528819);
assert.equal(batch126Data.existing_identity_updates[0].existing_propositions_before,2);
assert.equal(batch126Data.existing_identity_updates[0].propositions_added,1);
assert.equal(batch126Data.existing_identity_updates[0].total_propositions_after,3);
for(const aid of batch126Aids){
 const matches=idx.entries.filter(e=>sourceAID(e)===String(aid));
 assert.equal(matches.length,1,'batch-126 AID '+aid+' must have exactly one canonical identity');
 const e=matches[0];
 assert(e.has_content_evidence);assert.equal(e.status,'Parsed');assert.equal(e.canonical_file,batch126Path);
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope&&e.response_proposition_locators.length===e.response_propositions.length);
 assert.equal(e.independent_witness,true);assert.equal(e.translation_of_evidence_family_id,null);
 assert(!queue.records.some(q=>String(q.key||'')==='aid:'+aid||String(q.source_url||'').includes('/aid/'+aid+'/')));
}
const tefillinScope=idx.entries.find(e=>sourceAID(e)==='528819');
assert(tefillinScope&&tefillinScope.response_propositions.length===5);
assert(tefillinScope.response_propositions.some(p=>p.includes('לפי הבנתו')));
assert(tefillinScope.response_propositions.some(p=>p.includes('אין בה ניסוח של חיוב כללי')));
assert(tefillinScope.response_propositions.some(p=>p.includes('חלוקת לימוד פרשת השבוע')));
assert.equal(tefillinScope.evidence_family_id,'hayom-yom-528819-5703');
assert.equal(batch126Data.deduplication_check.full_index_scan_available,true);
assert.equal(batch126Data.deduplication_check.full_index_scan_pending_reconciliation,false);
assert.deepEqual(batch126Data.deduplication_check.canonical_identity_collisions,[]);
assert.deepEqual(batch126Data.deduplication_check.missing_canonical_identities,[]);
assert.equal(batch126Data.deduplication_check.all_target_identities_answer_eligible,true);
assert(['reconciled','reconciled_with_variance'].includes(batch126Data.reconciliation_status));
assert.deepEqual(readinessMetrics(batch125Data.metrics_actual_after),readinessMetrics(batch126Data.metrics_actual_before));
assert.deepEqual(readinessMetrics(batch126Data.metrics_actual_after),readinessMetrics(batch127Data.metrics_actual_before));
assert(!projectState.development_recovery.pending_reconciliation_batches.includes('125'));
assert(!projectState.development_recovery.pending_reconciliation_batches.includes('126'));
assert(!projectState.metrics_integrity.answer_readiness.pending_batches.includes('125'));
assert(!projectState.metrics_integrity.answer_readiness.pending_batches.includes('126'));
const audit126=projectState.development_recovery.reconciliation_chain.find(x=>String(x.batch_id)==='126');
assert(audit126);assert.deepEqual(readinessMetrics(audit126.metrics_actual_after),readinessMetrics(batch127Data.metrics_actual_before));
assert(acquisitionState.manual_web_review_history.some(x=>String(x.batch_id)==='126'));
assert.deepEqual(readinessMetrics(acquisitionState.manual_web_review_current_metrics),readinessMetrics(metrics));


// Batch 127: 14 original-language daily entries, one explicitly non-independent English translation,
// five same-family aliases, and an in-place enrichment of AID 528819.
assert.equal(batch127Data.batch_id,'127');assert.equal(batch127Data.records.length,15);assert.deepEqual(batch127Data.new_aids,batch127Aids);
assert.deepEqual(batch127Data.enriched_aids,[528819]);assert.equal(batch127Data.new_source_identities,15);assert.equal(batch127Data.existing_identities_enriched,1);
assert.equal(batch127Data.new_response_propositions,22);assert.equal(batch127Data.existing_response_propositions_added,1);assert.equal(batch127Data.total_new_paraphrase_entries,23);
assert.equal(batch127Data.answer_eligible_source_families_added,15);assert.equal(batch127Data.independent_witnesses_added,14);assert.equal(batch127Data.non_independent_presentations_added,1);
assert.equal(batch127Data.content_verified_unique_sources_added,0);assert.equal(batch127Data.source_bodies_inspected,16);assert.equal(batch127Data.source_body_pages_opened,24);assert.equal(batch127Data.reviewed_item_count,24);
assert.equal(batch127Data.source_body_review.length,16);assert.deepEqual(batch127Data.language_distribution,{Hebrew:13,Yiddish:1,English:1});assert.deepEqual(batch127Data.original_language_distribution,{Hebrew:13,Yiddish:1,unknown:1});
assert.deepEqual(batch127Data.source_type_distribution,{published_hebrew_hayom_yom_entry:13,published_yiddish_hayom_yom_entry:1,published_english_translation_of_letter:1});
assert.deepEqual(batch127Data.blocked_candidates.map(x=>x.aid),[5900,5901,5902]);assert.equal(batch127Data.same_family_items.length,5);assert.equal(batch127Data.fallback_source_attempted,true);
assert.equal(batch127Data.fallback_source_results.accessible_item_level_bodies,15);assert.equal(batch127Data.fallback_source_results.existing_identity_bodies,1);assert.equal(batch127Data.fallback_source_results.same_family_alternative_pages,5);
assert.equal(batch127Data.crawler_retry,false);assert.equal(batch127Data.access_control_bypassed,false);assert.equal(batch127Data.full_text_copied,false);assert.equal(batch127Data.scan_only_verification_used,false);assert.equal(batch127Data.translations_counted_as_independent_witnesses,0);
assert.deepEqual(batch127Data.metrics_before,{answer_eligible_unique_sources:1257,content_verified_unique_sources:854,answer_eligible_propositions:3402});
assert.deepEqual(batch127Data.metrics_expected_after,{answer_eligible_unique_sources:1272,content_verified_unique_sources:854,answer_eligible_propositions:3425});
assert.deepEqual(batch127Data.metrics_delta_at_batch_boundary,{answer_eligible_unique_sources:15,content_verified_unique_sources:0,answer_eligible_propositions:23});
assert.equal(batch127Data.existing_identity_updates[0].aid,528819);assert.equal(batch127Data.existing_identity_updates[0].total_propositions_after,4);
assert.equal(batch127Data.records.find(r=>String(r.aid)==='528837').language,'Yiddish');
assert.equal(batch127Data.records.find(r=>String(r.aid)==='5920904').independent_witness,false);
assert.equal(batch127Data.records.find(r=>String(r.aid)==='5920904').translation_of_evidence_family_id,batch127Data.records.find(r=>String(r.aid)==='5920904').evidence_family_id);
assert.equal(batch127Data.deduplication_check.pre_reconciliation_index_count,9122);assert.equal(batch127Data.deduplication_check.full_index_scan_available,true);
for(const alias of batch127Data.same_family_items){const canonical=batch127Data.records.find(r=>String(r.aid)===String(alias.canonical_aid));assert(canonical&&canonical.evidence_family_id===alias.evidence_family_id);assert.equal(alias.independent_witness,false);assert(canonical.relations.some(r=>r.type==='same_evidence_family'&&r.target_id==='aid:'+alias.aid));const aliasMatches=idx.entries.filter(e=>sourceAID(e)===String(alias.aid));assert(aliasMatches.every(e=>e.evidence_family_id===alias.evidence_family_id&&e.independent_witness===false));}
for(const aid of batch127Aids){const matches=idx.entries.filter(e=>sourceAID(e)===String(aid));assert.equal(matches.length,1,'batch-127 AID '+aid+' must have one canonical indexed identity');const e=matches[0];assert(e.has_content_evidence);assert.equal(e.canonical_file,batch127Path);assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');assert(e.proposition_source_locator&&e.verification_scope);assert.equal(e.response_proposition_locators.length,e.response_propositions.length);assert.equal(e.status,'Parsed');if(String(aid)==='5920904'){assert.equal(e.independent_witness,false);assert.equal(e.translation_of_evidence_family_id,e.evidence_family_id);assert.equal(e.language,'English');}else{assert.equal(e.independent_witness,true);assert(['Hebrew','Yiddish'].includes(e.language));}}
assert.equal(batch127Data.deduplication_check.full_index_scan_pending_reconciliation,false);assert.deepEqual(batch127Data.deduplication_check.canonical_identity_collisions,[]);assert.deepEqual(batch127Data.deduplication_check.missing_canonical_identities,[]);assert.equal(batch127Data.deduplication_check.all_target_identities_answer_eligible,true);
assert(['reconciled','reconciled_with_variance'].includes(batch127Data.reconciliation_status));
const elulTehillimQuestion='מה מתעד היום יום על אמירת תהילים בחודש אלול?';
for(const mode of ['regular','researcher']){const m=buildAnswerModel(idx.entries,elulTehillimQuestion,{mode});assert(m.sources.some(e=>sourceAID(e)==='528832'));assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length&&c.source_locators.length));assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));if(mode==='researcher')assert(m.research&&m.research.depth==='deep'&&m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));}
const chaiElulLetterQuestion='מה מתעד המכתב על התוועדויות חי אלול, אהבת ישראל וקביעות שיעורי תורה בנגלה ובנסתר?';
for(const mode of ['regular','researcher']){const m=buildAnswerModel(idx.entries,chaiElulLetterQuestion,{mode});const translated=m.sources.find(e=>sourceAID(e)==='5920904');assert(translated);assert.equal(translated.independent_witness,false);assert.equal(translated.translation_of_evidence_family_id,translated.evidence_family_id);assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length&&c.source_locators.length));assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));if(mode==='researcher'){assert(m.research&&m.research.depth==='deep');assert(m.research.evidence_integrity.derived_non_independent>=1);assert(m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));}}

const elulSelfWorkQuestion='איך משלבים חשבון נפש בחודש אלול עם עבודה בכוח עצמו?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,elulSelfWorkQuestion,{mode});
 assert(m.answerable,mode+': Elul self-accounting and self-driven service question must be answerable');
 assert(m.sources.some(e=>sourceAID(e)==='3316856'),mode+': AID 3316856 must support the Elul accounting claim');
 assert(m.sources.some(e=>sourceAID(e)==='3316863'),mode+': AID 3316863 must support the self-driven service claim');
 assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=2,mode+': two distinct Hayom Yom evidence families must remain separate');
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length),mode+': every synthesis claim needs claim-level citations');
 if(mode==='researcher'){
  assert(m.research&&m.research.depth==='deep');
  assert(m.research.evidence_map.length>0&&m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));
  assert.equal(m.research.claim_source_map.length,m.claims.length);
  assert(m.research.claim_source_map.every(c=>c.source_numbers.length&&c.source_locators.length));
 }
}
const storiesQuestion='מה מתעד היום יום על סיפורי חסידים כהוראה לחיים?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,storiesQuestion,{mode});
 assert(m.answerable,mode+': Chassidic stories as life instruction question must be answerable');
 assert(m.sources.some(e=>sourceAID(e)==='3316854'),mode+': AID 3316854 must support the stories question');
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length),mode+': story claims need claim-level citations');
 if(mode==='researcher')assert(m.research&&m.research.depth==='deep'&&m.research.claim_source_map.every(c=>c.source_numbers.length&&c.source_locators.length));
}


// Batch 128: 18 inspected original-language Hebrew/Yiddish Hayom Yom entries, five same-family publisher links, one blocked route and one navigation-only exclusion.
assert.equal(batch128Data.batch_id,'128');assert.equal(batch128Data.records.length,18);assert.deepEqual(batch128Data.new_aids,batch128Aids);
assert.equal(batch128Data.new_source_identities,18);assert.equal(batch128Data.existing_identities_enriched,5);assert.equal(batch128Data.existing_identities_rechecked,5);assert.equal(batch128Data.new_response_propositions,24);assert.equal(batch128Data.existing_response_propositions_added,0);assert.equal(batch128Data.total_new_paraphrase_entries,24);
assert.equal(batch128Data.answer_eligible_source_families_added,18);assert.equal(batch128Data.independent_witnesses_added,18);assert.equal(batch128Data.non_independent_presentations_added,5);assert.equal(batch128Data.content_verified_unique_sources_added,0);
assert.equal(batch128Data.source_bodies_inspected,22);assert.equal(batch128Data.source_body_pages_opened,23);assert.equal(batch128Data.source_body_review.length,23);assert.equal(batch128Data.reviewed_item_count,25);
assert.deepEqual(batch128Data.language_distribution,{Hebrew:13,Yiddish:5});assert.deepEqual(batch128Data.original_language_distribution,{Hebrew:13,Yiddish:5});assert.deepEqual(batch128Data.source_type_distribution,{published_hebrew_hayom_yom_entry:13,published_yiddish_hayom_yom_entry:5});
assert.deepEqual(batch128Data.metrics_before,{answer_eligible_unique_sources:1272,content_verified_unique_sources:854,answer_eligible_propositions:3425});assert.deepEqual(batch128Data.metrics_expected_after,{answer_eligible_unique_sources:1290,content_verified_unique_sources:854,answer_eligible_propositions:3449});assert.deepEqual(batch128Data.metrics_delta_at_batch_boundary,{answer_eligible_unique_sources:18,content_verified_unique_sources:0,answer_eligible_propositions:24});
assert.deepEqual(batch128Data.blocked_candidates.map(x=>x.aid),[5900]);assert.deepEqual(batch128Data.excluded_candidates.map(x=>x.aid),[528861]);assert.equal(batch128Data.fallback_source_attempted,true);assert.equal(batch128Data.fallback_source_results.accessible_item_level_bodies,18);assert.equal(batch128Data.fallback_source_results.existing_identity_bodies,4);assert.equal(batch128Data.fallback_source_results.same_family_alternative_pages,5);
assert.equal(batch128Data.crawler_retry,false);assert.equal(batch128Data.access_control_bypassed,false);assert.equal(batch128Data.full_text_copied,false);assert.equal(batch128Data.scan_only_verification_used,false);assert.equal(batch128Data.translations_counted_as_independent_witnesses,0);
assert.equal(batch128Data.records.reduce((n,r)=>n+r.response_propositions.length,0),24);assert.equal(new Set(batch128Data.records.map(r=>String(r.aid))).size,18);assert.equal(new Set(batch128Data.records.map(r=>r.evidence_family_id)).size,18);assert.equal(batch128Data.records.some(r=>String(r.aid)==='528861'),false);
assert.equal(batch128Data.deduplication_check.full_index_scan_available,true);assert.equal(batch128Data.deduplication_check.full_index_scan_pending_reconciliation,false);assert.deepEqual(batch128Data.deduplication_check.canonical_identity_collisions,[]);assert.deepEqual(batch128Data.deduplication_check.missing_canonical_identities,[]);assert.equal(batch128Data.deduplication_check.all_target_identities_answer_eligible,true);
assert(['reconciled','reconciled_with_variance'].includes(batch128Data.reconciliation_status));assert.deepEqual(readinessMetrics(batch127Data.metrics_actual_after),readinessMetrics(batch128Data.metrics_actual_before));assert.deepEqual(readinessMetrics(batch128Data.metrics_actual_after),readinessMetrics(batch129Data.metrics_actual_before));
for(const alias of batch128Data.same_family_items){const canonical=idx.entries.find(e=>sourceAID(e)===String(alias.canonical_aid));assert(canonical);assert.equal(canonical.evidence_family_id,alias.evidence_family_id);assert.equal(alias.independent_witness,false);assert(canonical.relations.some(r=>r.type==='same_evidence_family'&&r.target_id==='aid:'+alias.aid));assert.equal(idx.entries.filter(e=>sourceAID(e)===String(alias.aid)).length,0);}
for(const update of batch128Data.existing_identity_updates){assert.equal(update.propositions_added,0);assert.equal(update.canonical_file,batch127Path);assert.equal(update.total_propositions_after,update.existing_propositions_before);}
for(const aid of batch128Aids){const matches=idx.entries.filter(e=>sourceAID(e)===String(aid));assert.equal(matches.length,1,'batch-128 AID '+aid+' must have one canonical indexed identity');const e=matches[0];assert(e.has_content_evidence);assert.equal(e.canonical_file,batch128Path);assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');assert(e.proposition_source_locator&&e.verification_scope);assert.equal(e.response_proposition_locators.length,e.response_propositions.length);assert.equal(e.status,'Parsed');assert.equal(e.independent_witness,true);assert.equal(e.translation_of_evidence_family_id,null);assert(['Hebrew','Yiddish'].includes(e.language));assert(!queue.records.some(q=>String(q.key||'')==='aid:'+aid||String(q.source_url||'').includes('/aid/'+aid+'/')));}
const redirectedAlias=batch128Data.same_family_items.find(x=>String(x.aid)==='5910');assert(redirectedAlias&&redirectedAlias.redirected_to_canonical===true&&redirectedAlias.body_text_inspected===false);


// Batch 129: 12 original-language daily entries, five same-family older presentations,
// one in-place enrichment of AID 528819, and one blocked public route with fallback.
const batch129Aids=[528865,528866,528867,528868,528869,528870,528871,528872,528873,528874,528875,528876];
assert.equal(batch129Data.batch_id,'129');assert.equal(batch129Data.batch_file,batch129Path);assert.equal(batch129Data.records.length,12);
assert.deepEqual(batch129Data.new_aids,batch129Aids);assert.deepEqual(batch129Data.enriched_aids,[528819]);
assert.equal(batch129Data.new_source_identities,12);assert.equal(batch129Data.existing_identities_enriched,1);assert.equal(batch129Data.existing_identities_rechecked,1);
assert.equal(batch129Data.new_response_propositions,20);assert.equal(batch129Data.existing_response_propositions_added,1);assert.equal(batch129Data.total_new_paraphrase_entries,21);
assert.equal(batch129Data.source_bodies_inspected,13);assert.equal(batch129Data.source_body_pages_opened,18);assert.equal(batch129Data.source_body_review.length,13);assert.equal(batch129Data.reviewed_item_count,19);
assert.deepEqual(batch129Data.language_distribution,{Hebrew:10,Yiddish:1,'Hebrew/Yiddish':1});
assert.deepEqual(batch129Data.source_type_distribution,{published_hebrew_hayom_yom_entry:10,published_yiddish_hayom_yom_entry:1,published_hebrew_yiddish_hayom_yom_entry:1});
assert.equal(batch129Data.blocked_candidates[0].aid,4666220);assert.equal(batch129Data.fallback_source_attempted,true);
assert.equal(batch129Data.fallback_source_results.accessible_item_level_bodies,12);assert.equal(batch129Data.fallback_source_results.same_family_alternative_pages,5);
assert.equal(batch129Data.crawler_retry,false);assert.equal(batch129Data.access_control_bypassed,false);assert.equal(batch129Data.full_text_copied,false);assert.equal(batch129Data.scan_only_verification_used,false);assert.equal(batch129Data.translations_counted_as_independent_witnesses,0);
assert.equal(batch129Data.records.reduce((n,r)=>n+r.response_propositions.length,0),20);assert.equal(new Set(batch129Data.records.map(r=>String(r.aid))).size,12);assert.equal(new Set(batch129Data.records.map(r=>r.evidence_family_id)).size,12);
assert.equal(batch129Data.deduplication_check.full_index_scan_available,true);assert.equal(batch129Data.deduplication_check.full_index_scan_pending_reconciliation,false);assert.deepEqual(batch129Data.deduplication_check.canonical_identity_collisions,[]);assert.deepEqual(batch129Data.deduplication_check.missing_canonical_identities,[]);assert.equal(batch129Data.deduplication_check.all_target_identities_answer_eligible,true);
assert.equal(batch129Data.existing_identity_updates[0].aid,528819);assert.equal(batch129Data.existing_identity_updates[0].existing_propositions_before,4);assert.equal(batch129Data.existing_identity_updates[0].total_propositions_after,5);
const tefillinEnriched129=idx.entries.find(e=>sourceAID(e)==='528819');assert(tefillinEnriched129&&tefillinEnriched129.response_propositions.length===5);assert(tefillinEnriched129.response_propositions.some(p=>p.includes('לפי הבנתו')));assert.equal(tefillinEnriched129.evidence_family_id,'hayom-yom-528819-5703');
for(const alias of batch129Data.same_family_items){const canonical=idx.entries.find(e=>sourceAID(e)===String(alias.canonical_aid));assert(canonical);assert.equal(canonical.evidence_family_id,alias.evidence_family_id);assert.equal(alias.independent_witness,false);assert(canonical.relations.some(r=>r.type==='same_evidence_family'&&r.target_id==='aid:'+alias.aid));assert.equal(idx.entries.filter(e=>sourceAID(e)===String(alias.aid)).length,0);}
for(const aid of batch129Aids){const matches=idx.entries.filter(e=>sourceAID(e)===String(aid));assert.equal(matches.length,1,'batch-129 AID '+aid+' must have one canonical indexed identity');const e=matches[0];assert(e.has_content_evidence);assert.equal(e.canonical_file,batch129Path);assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');assert(e.proposition_source_locator&&e.verification_scope);assert.equal(e.response_proposition_locators.length,e.response_propositions.length);assert.equal(e.status,'Parsed');assert.equal(e.independent_witness,true);assert.equal(e.translation_of_evidence_family_id,null);assert(['Hebrew','Yiddish','Hebrew/Yiddish'].includes(e.language));assert(!queue.records.some(q=>String(q.key||'')==='aid:'+aid||String(q.source_url||'').includes('/aid/'+aid+'/')));}
assert(['reconciled','reconciled_with_variance'].includes(batch129Data.reconciliation_status));
assert.deepEqual(readinessMetrics(batch129Data.metrics_actual_after),readinessMetrics(batch130Data.metrics_actual_before));
assert.deepEqual(readinessMetrics(batch130Data.metrics_actual_after),readinessMetrics(batch131Data.metrics_actual_before));
 
// Batch 130: fourteen original-language Hayom Yom AID entries, one
// non-independent English translation,
// and one in-place Sicha enrichment.
assert.equal(batch130Data.batch_id,'130');assert.equal(batch130Data.batch_file,batch130Path);
assert.equal(batch130Data.records.length,15);assert.deepEqual(batch130Data.new_aids,batch130Aids);
assert.deepEqual(batch130Data.enriched_aids,[5959845]);
assert.equal(batch130Data.new_source_identities,15);assert.equal(batch130Data.existing_identities_enriched,1);
assert.equal(batch130Data.new_response_propositions,23);assert.equal(batch130Data.existing_response_propositions_added,1);assert.equal(batch130Data.total_new_paraphrase_entries,24);
assert.equal(batch130Data.answer_eligible_source_families_added,15);assert.equal(batch130Data.independent_witnesses_added,14);assert.equal(batch130Data.non_independent_presentations_added,1);assert.equal(batch130Data.content_verified_unique_sources_added,0);
assert.equal(batch130Data.reviewed_item_count,18);assert.equal(batch130Data.source_bodies_inspected,17);assert.equal(batch130Data.source_body_pages_opened,18);assert.equal(batch130Data.source_body_review.length,18);
assert.equal(batch130Data.records.reduce((n,r)=>n+r.response_propositions.length,0),23);
assert.equal(new Set(batch130Data.records.filter(r=>r.aid!==null&&r.aid!==undefined).map(r=>String(r.aid))).size,15);
assert.equal(new Set(batch130Data.records.map(r=>r.evidence_family_id)).size,15);
assert.deepEqual(batch130Data.language_distribution,{Hebrew:12,Yiddish:2,English:1});
assert.deepEqual(batch130Data.source_type_distribution,{published_hebrew_hayom_yom_entry:12,published_yiddish_hayom_yom_entry:2,published_english_translated_correspondence:1});
assert.equal(batch130Data.blocked_candidates[0].aid,528879);assert.equal(batch130Data.fallback_source_attempted,true);
assert.equal(batch130Data.fallback_source_results.accessible_item_level_bodies,15);assert.equal(batch130Data.fallback_source_results.date_page_fallback_bodies,1);assert.equal(batch130Data.fallback_source_results.existing_identity_bodies,1);
assert.equal(batch130Data.crawler_retry,false);assert.equal(batch130Data.access_control_bypassed,false);assert.equal(batch130Data.full_text_copied,false);assert.equal(batch130Data.scan_only_verification_used,false);assert.equal(batch130Data.translations_counted_as_independent_witnesses,0);
assert.deepEqual(batch130Data.metrics_before,{answer_eligible_unique_sources:1302,content_verified_unique_sources:854,answer_eligible_propositions:3470});
assert.deepEqual(batch130Data.metrics_expected_after,{answer_eligible_unique_sources:1317,content_verified_unique_sources:854,answer_eligible_propositions:3494});
assert.deepEqual(batch130Data.metrics_delta_at_batch_boundary,{answer_eligible_unique_sources:16,content_verified_unique_sources:0,answer_eligible_propositions:26});
assert.equal(batch130Data.deduplication_check.full_index_scan_available,true);assert.equal(batch130Data.deduplication_check.full_index_scan_pending_reconciliation,false);
assert.deepEqual(batch130Data.deduplication_check.canonical_identity_collisions,[]);assert.deepEqual(batch130Data.deduplication_check.missing_canonical_identities,[]);assert.equal(batch130Data.deduplication_check.all_target_identities_answer_eligible,true);
assert(['reconciled','reconciled_with_variance'].includes(batch130Data.reconciliation_status));
assert.deepEqual(readinessMetrics(batch129Data.metrics_actual_after),readinessMetrics(batch130Data.metrics_actual_before));
assert.deepEqual(readinessMetrics(batch130Data.metrics_actual_after),readinessMetrics(batch131Data.metrics_actual_before));
assert(batch129Data.reconciliation_snapshot_adjustment.excluded_later_in_place_proposition_count>=1,'batch 129 snapshot must exclude the later in-place AID 5959845 proposition introduced by batch 130');
for(const r of batch130Data.records){assert.equal(r.status,'Parsed');assert.equal(r.pipeline_status,'Parsed');assert.equal(r.canonical_status,'Parsed');assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);assert.equal(r.proposition_verification,'source_text_inspected');assert(r.proposition_source_locator&&r.provenance&&r.verification_scope&&r.context_status==='partial'&&r.has_content_evidence);assert.equal(r.response_propositions.length,r.response_proposition_locators.length);}
for(const aid of batch130Aids){const matches=idx.entries.filter(e=>sourceAID(e)===String(aid));assert.equal(matches.length,1,'batch-130 AID '+aid+' must have exactly one canonical identity');const e=matches[0];assert(e.has_content_evidence);assert.equal(e.status,'Parsed');assert.equal(e.canonical_file,batch130Path);assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');assert(e.proposition_source_locator&&e.verification_scope);assert.equal(e.response_proposition_locators.length,e.response_propositions.length);assert(!queue.records.some(q=>String(q.key||'')==='aid:'+aid||String(q.source_url||'').includes('/aid/'+aid+'/')));}
const englishTranslatedLetter=idx.entries.find(e=>sourceAID(e)==='2277337');assert(englishTranslatedLetter);assert.equal(englishTranslatedLetter.independent_witness,false);assert.equal(englishTranslatedLetter.translation_of_evidence_family_id,englishTranslatedLetter.evidence_family_id);assert.equal(englishTranslatedLetter.original_language,'unknown');
const datePageFallback=batch130Data.source_body_review.find(r=>r.id===batch130DatePageId);assert(datePageFallback&&datePageFallback.body_text_inspected===true&&datePageFallback.included_in_corpus===false&&datePageFallback.identity_resolution==='not_admitted'&&datePageFallback.reason);assert(!idx.entries.some(e=>e.id===batch130DatePageId));assert.equal(batch130Data.new_source_ids.length,0);assert.equal(batch130Data.fallback_source_results.date_page_fallback_promoted,false);
const blocked528879=batch130Data.source_body_review.find(r=>String(r.aid)==='528879');assert(blocked528879&&blocked528879.body_text_inspected===false&&blocked528879.reason&&blocked528879.handling&&blocked528879.alternate_body_text_inspected===true);
const enriched5959845Batch130=idx.entries.find(e=>sourceAID(e)==='5959845');assert(enriched5959845Batch130&&enriched5959845Batch130.response_propositions.length===16);assert(enriched5959845Batch130.response_propositions.some(p=>p.includes('דימוי הביכורים')));assert(enriched5959845Batch130.response_proposition_locators.some(l=>String(l).includes('376–379')));
assert.equal(batch130Data.existing_identity_updates[0].aid,5959845);assert.equal(batch130Data.existing_identity_updates[0].existing_propositions_before,13);assert.equal(batch130Data.existing_identity_updates[0].total_propositions_after,14);
const sukkotDailyQuestion='מה מתעדים ערכי היום יום על מנהגי הושענא רבה ושמיני עצרת?';
assert(understandQuestion(sukkotDailyQuestion).topics.includes('מנהגי היום יום בהושענא רבה ושמיני עצרת'));
for(const mode of ['regular','researcher']){const m=buildAnswerModel(idx.entries,sukkotDailyQuestion,{mode});assert(m.answerable,mode+': bounded Hayom Yom festival-custom synthesis must be answerable');assert(m.sources.some(e=>sourceAID(e)==='528882'));assert(m.sources.some(e=>sourceAID(e)==='528883'));assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=2);assert(m.claims.length>=2&&m.claims.every(c=>c.source_numbers.length&&c.source_locators.length));if(mode==='researcher'){assert(m.research&&m.research.depth==='deep');assert(m.research.evidence_families>=2);assert(m.research.independent_evidence_families>=2);assert(m.research.claim_source_map.some(c=>JSON.stringify(c).includes('172–173')));assert(m.research.claim_source_map.some(c=>JSON.stringify(c).includes('172–174')));}}

assert.deepEqual(readinessMetrics(batch128Data.metrics_actual_after),readinessMetrics(batch129Data.metrics_actual_before));
assert.deepEqual(readinessMetrics(batch129Data.metrics_actual_after),readinessMetrics(batch130Data.metrics_actual_before));

assert.equal(batch131Data.records.length,14);
assert.equal(batch131Data.new_source_identities,14);
assert.equal(batch131Data.existing_identities_enriched,1);
assert.equal(batch131Data.new_response_propositions,19);
assert.equal(batch131Data.existing_response_propositions_added,1);
assert.equal(batch131Data.total_new_paraphrase_entries,20);
assert.equal(batch131Data.answer_eligible_source_families_added,13);
assert.equal(batch131Data.content_verified_unique_sources_added,0);
assert.equal(batch131Data.source_bodies_inspected,15);
assert.equal(batch131Data.reviewed_item_count,19);
assert.deepEqual(batch131Data.language_distribution,{Hebrew:9,Yiddish:4,'Hebrew/Yiddish':1});
assert.deepEqual(batch131Data.blocked_candidates.map(x=>x.aid),[553672,5913,5914]);
assert.deepEqual(batch131Data.excluded_candidates.map(x=>x.aid),[528892]);
assert.equal(batch131Data.fallback_source_attempted,true);
assert.equal(batch131Data.crawler_retry,false);
assert.equal(batch131Data.access_control_bypassed,false);
assert.deepEqual(batch131Data.metrics_before,{answer_eligible_unique_sources:1317,content_verified_unique_sources:854,answer_eligible_propositions:3494});
assert.deepEqual(batch131Data.metrics_expected_after,{answer_eligible_unique_sources:1330,content_verified_unique_sources:854,answer_eligible_propositions:3514});
assert.equal(new Set(batch131Data.records.map(r=>r.evidence_family_id)).size,13);
const continuation131=batch131Data.records.find(r=>String(r.aid)==='528895');
const first131=batch131Data.records.find(r=>String(r.aid)==='528894');
assert(continuation131&&first131&&continuation131.evidence_family_id===first131.evidence_family_id);
assert.equal(continuation131.independent_witness,false);
const enriched131=idx.entries.find(e=>sourceAID(e)==='2989153');
assert(enriched131&&enriched131.response_propositions.length===11);
assert(enriched131.response_propositions.some(p=>p.includes('אמונה פשוטה')&&p.includes('פשיטות העצמות')));
assert(enriched131.response_propositions.some(p=>p.includes('גרמניה')&&p.includes('מסירות נפש')));
assert(enriched131.response_propositions.some(p=>p.includes('יארצייט')&&p.includes('תחנון')));
assert(enriched131.response_propositions.some(p=>p.includes('פנימיות התורה')&&p.includes('נגלה')));
for(const aid of batch131Aids){const found=idx.entries.filter(e=>sourceAID(e)===String(aid));assert.equal(found.length,1);assert.equal(found[0].status,'Parsed');assert.equal(found[0].canonical_file,batch131Path);assert.equal(found[0].proposition_origin,'source_grounded_paraphrase');assert.equal(found[0].proposition_verbatim,false);assert.equal(found[0].proposition_verification,'source_text_inspected');assert.equal(found[0].response_proposition_locators.length,found[0].response_propositions.length);}
assert.equal(batch131Data.deduplication_check.full_index_scan_available,true);
assert.equal(batch131Data.deduplication_check.full_index_scan_pending_reconciliation,false);
assert(['reconciled','reconciled_with_variance'].includes(batch131Data.reconciliation_status));
const householdInfluenceQ='מה מתעדים ערכי היום יום על השפעת לימוד תורה יומי על בני הבית ועל היכולת של כל יהודי להשפיע על מכריו?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,householdInfluenceQ,{mode});
 assert(m.answerable);
 assert(m.sources.some(e=>sourceAID(e)==='528896'));
 assert(m.sources.some(e=>sourceAID(e)==='528897'));
 assert(m.sources.some(e=>sourceAID(e)==='3317931'),'new original-Hebrew influence entry must enter the existing cross-family synthesis');
 assert.equal(m.synthesis?.topic,'hayom_yom_household_and_influence');
 assert.equal(m.synthesis?.attribution,'system_synthesis_not_rebbe_quote');
 assert.equal(m.synthesis?.claims.length,2);
 const influenceClaim=m.synthesis.claims.find(c=>c.topic==='individual_influence');
 assert(influenceClaim&&influenceClaim.source_numbers.some(n=>sourceAID(m.sources[n-1])==='3317931'));
 assert(m.pattern_synthesis_integrity?.valid===true,'household/influence synthesis must pass the explicit witness-level integrity branch');
 assert(m.claims.every(c=>c.source_locators.length));
 assert(m.citation_entailment.every(x=>x.valid));
 assert(m.context_boundary.every(x=>x.valid));
 if(mode==='researcher'){
  assert.equal(m.research.depth,'deep');
  assert(m.research.evidence_families>=3);
  assert(m.research.independent_evidence_families>=3);
  assert(m.research.claim_source_map.every(c=>c.source_locators.length));
  const influenceSourceNumber=m.sources.findIndex(e=>sourceAID(e)==='3317931')+1;
  assert(m.research.claim_source_map.find(c=>c.text===influenceClaim.text).source_locators.some(x=>x.source_number===influenceSourceNumber));
 }
}
const livingTorahQ='בשלושת תקצירי Living Torah על גאווה יהודית, מעשי טוב וחסד והפצת יהדות בסביבה הקרובה, מה מתועד בכל תקציר?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,livingTorahQ,{mode});
 assert(m.answerable);
 for(const aid of ['363474','490071','318996'])assert(m.sources.some(e=>sourceAID(e)===aid),'missing Living Torah synopsis '+aid);
 assert(m.claims.length>=3&&m.claims.every(c=>c.source_locators.length));
 assert(m.citation_entailment.every(x=>x.valid));
 assert(m.sources.every(e=>e.independent_witness===false||e._independent_witness===false||String(e.witness_type||'').toLowerCase().includes('synopsis')));
}


// Batch 132: fifteen original-language daily entries, three in-place Sicha additions,
 // and claim-level synthesis across three independent Hayom Yom Evidence Families.
assert.equal(batch132Data.batch_id,'132');assert.equal(batch132Data.batch_file,batch132Path);
assert.equal(batch132Data.records.length,16);assert.deepEqual(batch132Data.new_aids,batch132Aids);
assert.deepEqual(batch132Data.enriched_aids,[2989153]);
const batch132EnglishLetter=batch132Data.records.find(r=>String(r.aid)==='1924127');assert(batch132EnglishLetter);assert.equal(batch132EnglishLetter.source_class,'Correspondence');assert.equal(batch132EnglishLetter.author_role,'correspondent');assert.equal(batch132EnglishLetter.source_role,'correspondent_question_not_rebbe_answer');assert(batch132EnglishLetter.provenance.authorship_status.includes('not a statement by the Rebbe'));assert(batch132EnglishLetter.response_propositions.every(p=>p.includes('הכותב')));
assert.equal(batch132Data.new_source_identities,16);assert.equal(batch132Data.existing_identities_enriched,1);
assert.equal(batch132Data.new_response_propositions,23);assert.equal(batch132Data.existing_response_propositions_added,3);assert.equal(batch132Data.total_new_paraphrase_entries,26);
assert.equal(batch132Data.answer_eligible_source_families_added,16);assert.equal(batch132Data.independent_witnesses_added,16);assert.equal(batch132Data.non_independent_presentations_added,0);assert.equal(batch132Data.content_verified_unique_sources_added,0);
assert.equal(batch132Data.reviewed_item_count,19);assert.equal(batch132Data.source_bodies_inspected,17);assert.equal(batch132Data.source_body_pages_opened,19);assert.equal(batch132Data.source_body_review.length,19);
assert.equal(batch132Data.records.reduce((n,r)=>n+r.response_propositions.length,0),23);
assert.equal(new Set(batch132Data.records.map(r=>String(r.aid))).size,15);assert.equal(new Set(batch132Data.records.map(r=>r.evidence_family_id)).size,15);
assert.deepEqual(batch132Data.language_distribution,{Hebrew:9,Yiddish:5,'Hebrew/Yiddish':1,English:1});
assert.deepEqual(batch132Data.source_type_distribution,{published_hebrew_hayom_yom_entry:9,published_yiddish_hayom_yom_entry:5,published_hebrew_yiddish_hayom_yom_entry:1,published_english_incoming_correspondence_letter:1});
assert.deepEqual(batch132Data.blocked_candidates.map(x=>x.aid),[528913,816546]);assert.equal(batch132Data.fallback_source_attempted,true);
assert.equal(batch132Data.fallback_source_results.accessible_item_level_bodies,16);assert.equal(batch132Data.fallback_source_results.existing_identity_bodies,1);assert.equal(batch132Data.fallback_source_results.accessible_english_correspondence_bodies,1);
assert.equal(batch132Data.crawler_retry,false);assert.equal(batch132Data.access_control_bypassed,false);assert.equal(batch132Data.full_text_copied,false);assert.equal(batch132Data.scan_only_verification_used,false);assert.equal(batch132Data.translations_counted_as_independent_witnesses,0);
assert.deepEqual(batch132Data.metrics_before,{answer_eligible_unique_sources:1330,content_verified_unique_sources:854,answer_eligible_propositions:3514});
assert.deepEqual(batch132Data.metrics_expected_after,{answer_eligible_unique_sources:1346,content_verified_unique_sources:854,answer_eligible_propositions:3540});
assert.deepEqual(batch132Data.metrics_delta_at_batch_boundary,{answer_eligible_unique_sources:16,content_verified_unique_sources:0,answer_eligible_propositions:26});
for(const r of batch132Data.records){assert.equal(r.status,'Parsed');assert.equal(r.pipeline_status,'Parsed');assert.equal(r.canonical_status,'Parsed');assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);assert.equal(r.proposition_verification,'source_text_inspected');assert(r.proposition_source_locator&&r.provenance&&r.verification_scope&&r.context_status==='partial'&&r.has_content_evidence);assert.equal(r.response_propositions.length,r.response_proposition_locators.length);}
for(const aid of batch132Aids){const found=idx.entries.filter(e=>sourceAID(e)===String(aid));assert.equal(found.length,1,'batch-132 AID '+aid+' must have one canonical identity');const e=found[0];assert(e.has_content_evidence);assert.equal(e.status,'Parsed');assert.equal(e.canonical_file,batch132Path);assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');assert(e.proposition_source_locator&&e.verification_scope);assert.equal(e.response_proposition_locators.length,e.response_propositions.length);assert.equal(e.independent_witness,true);assert.equal(e.translation_of_evidence_family_id,null);assert(!queue.records.some(q=>String(q.key||'')==='aid:'+aid||String(q.source_url||'').includes('/aid/'+aid+'/')));}
assert.equal(batch132Data.deduplication_check.full_index_scan_available,true);assert.equal(batch132Data.deduplication_check.full_index_scan_pending_reconciliation,false);
assert.deepEqual(batch132Data.deduplication_check.canonical_identity_collisions,[]);assert.deepEqual(batch132Data.deduplication_check.missing_canonical_identities,[]);assert.equal(batch132Data.deduplication_check.all_target_identities_answer_eligible,true);
assert(['reconciled','reconciled_with_variance'].includes(batch132Data.reconciliation_status));
assert.deepEqual(readinessMetrics(batch131Data.metrics_actual_after),readinessMetrics(batch132Data.metrics_actual_before));
assert.deepEqual(readinessMetrics(batch132Data.metrics_actual_after),readinessMetrics(batch133Data.metrics_actual_before));
assert.deepEqual(readinessMetrics(batch133Data.metrics_actual_after),readinessMetrics(metrics));
assert(batch131Data.reconciliation_snapshot_adjustment.excluded_later_in_place_proposition_count>=3,'batch 131 historical snapshot must exclude three later AID 2989153 additions');
const thoughtPrayerActionQ='כיצד מציגים ערכי היום יום את הקשר בין מחשבה, תפילה, עבודה מעשית והכרה עצמית?';
assert(understandQuestion(thoughtPrayerActionQ).topics.includes('מחשבה תפילה ועבודה מעשית'));
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,thoughtPrayerActionQ,{mode});
 assert(m.answerable,mode+': three-family Hayom Yom thought/prayer/action synthesis must be answerable');
 for(const aid of ['528908','528913','528918'])assert(m.sources.some(e=>sourceAID(e)===aid),'missing thought/prayer/action source '+aid);
 assert.equal(m.synthesis?.topic,'hayom_yom_thought_prayer_action');
 assert.equal(m.synthesis?.attribution,'system_synthesis_not_rebbe_quote');
 assert.equal(m.synthesis?.claims.length,3);
 assert(m.claims.length===3&&m.claims.every(c=>c.source_locators.length));
 assert(m.citation_entailment.every(x=>x.valid));assert(m.context_boundary.every(x=>x.valid));
 if(mode==='researcher'){assert.equal(m.research.depth,'deep');assert(m.research.evidence_families>=3);assert(m.research.independent_evidence_families>=3);assert.equal(m.research.claim_source_map.length,3);assert(m.research.claim_source_map.every(c=>c.source_locators.length));}
}


// Batch 133 content contract and claim-level Hayom Yom synthesis.
assert.equal(batch133Data.records.length,19);assert.deepEqual(batch133Data.new_aids,batch133Aids);assert.equal(batch133Data.new_response_propositions,25);assert.equal(batch133Data.existing_response_propositions_added,1);assert.equal(batch133Data.content_verified_unique_sources_added,0);assert.equal(batch133Data.source_bodies_inspected,20);assert.equal(batch133Data.reviewed_item_count,22);
assert.deepEqual(batch133Data.blocked_candidates.map(x=>x.aid),[4666220]);assert.deepEqual(batch133Data.excluded_candidates.map(x=>x.aid),[528922]);assert.equal(batch133Data.fallback_source_attempted,true);assert.equal(batch133Data.crawler_retry,false);assert.equal(batch133Data.access_control_bypassed,false);
for(const r of batch133Data.records){assert.equal(r.status,'Parsed');assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);assert.equal(r.proposition_verification,'source_text_inspected');assert(r.proposition_source_locator&&r.provenance&&r.verification_scope&&r.context_status==='partial');}
for(const aid of batch133Aids){const m=idx.entries.filter(e=>sourceAID(e)===String(aid));assert.equal(m.length,1);assert(m[0].has_content_evidence);assert.equal(m[0].status,'Parsed');assert.equal(m[0].canonical_file,batch133Path);assert.equal(m[0].independent_witness,true);}
assert.equal(batch133Data.deduplication_check.full_index_scan_available,true);assert.equal(batch133Data.deduplication_check.all_target_identities_answer_eligible,true);assert(['reconciled','reconciled_with_variance'].includes(batch133Data.reconciliation_status));assert.deepEqual(readinessMetrics(batch132Data.metrics_actual_after),readinessMetrics(batch133Data.metrics_actual_before));assert.deepEqual(readinessMetrics(batch133Data.metrics_actual_after),readinessMetrics(metrics));
const e133=idx.entries.find(e=>sourceAID(e)==='2989153');assert(e133&&e133.response_propositions.length===13);assert(e133.response_propositions.some(p=>p.includes('גירעון')&&p.includes('מקום שינה')));const carter133=idx.entries.find(e=>sourceAID(e)==='6427690');assert(carter133&&carter133.author_role==='author'&&carter133.source_role==='outgoing_letter_by_rebbe');
const mindQ='מה מתעדים ערכי היום יום על הקשר בין המוח ללב בשיטת חב״ד?';assert(understandQuestion(mindQ).topics.includes('מוח ולב בשיטת חב״ד'));for(const mode of ['regular','researcher']){const m=buildAnswerModel(idx.entries,mindQ,{mode});assert(m.answerable);assert(m.sources.some(e=>sourceAID(e)==='528938'));assert(m.sources.some(e=>sourceAID(e)==='528939'));assert.equal(m.synthesis?.topic,'hayom_yom_mind_heart');assert.equal(m.synthesis?.attribution,'system_synthesis_not_rebbe_quote');assert.equal(m.synthesis?.claims.length,2);assert(m.claims.every(c=>c.source_locators.length));assert(m.citation_entailment.every(x=>x.valid));assert(m.context_boundary.every(x=>x.valid));assert(m.pattern_synthesis_integrity.valid);if(mode==='researcher'){assert.equal(m.research.depth,'deep');assert(m.research.evidence_families>=2);assert(m.research.independent_evidence_families>=2);assert.equal(m.research.claim_source_map.length,2);}}


// Batch 134: inspected English translations, in-place enrichment, and derived-witness case comparison.
const batch134Aids=[2277932,2277929,2277928,2277934,2277937,2277940,2277941,2277942,2277921,2277945];
const batch135Aids=[4422946,2281917,2277173,5920891,2277247,5920893,2281851,2277371,2281922];
assert.equal(batch134Data.batch_id,'134');assert.equal(batch134Data.batch_file,batch134Path);assert.equal(batch134Data.records.length,10);assert.deepEqual(batch134Data.new_aids,batch134Aids);
assert.equal(batch134Data.new_source_identities,10);assert.equal(batch134Data.existing_identities_enriched,1);assert.equal(batch134Data.new_response_propositions,20);assert.equal(batch134Data.existing_response_propositions_added,1);assert.equal(batch134Data.total_new_paraphrase_entries,21);
assert.equal(batch134Data.answer_eligible_source_families_added,10);assert.equal(batch134Data.independent_witnesses_added,0);assert.equal(batch134Data.non_independent_presentations_added,10);assert.equal(batch134Data.content_verified_unique_sources_added,0);
assert.equal(batch134Data.source_bodies_inspected,11);assert.equal(batch134Data.reviewed_item_count,13);assert.equal(batch134Data.blocked_candidates[0].aid,4666220);assert.equal(batch134Data.excluded_candidates[0].aid,2277935);assert.equal(batch134Data.fallback_source_attempted,true);
assert.equal(batch134Data.crawler_retry,false);assert.equal(batch134Data.access_control_bypassed,false);assert.equal(batch134Data.full_text_copied,false);assert.equal(batch134Data.scan_only_verification_used,false);assert.equal(batch134Data.translations_counted_as_independent_witnesses,0);
assert.deepEqual(batch134Data.metrics_before,{answer_eligible_unique_sources:1365,content_verified_unique_sources:854,answer_eligible_propositions:3567});
assert.deepEqual(batch134Data.metrics_expected_after,{answer_eligible_unique_sources:1375,content_verified_unique_sources:854,answer_eligible_propositions:3588});
assert.deepEqual(batch134Data.metrics_delta_at_batch_boundary,{answer_eligible_unique_sources:10,content_verified_unique_sources:0,answer_eligible_propositions:21});
assert.equal(batch134Data.records.reduce((n,r)=>n+r.response_propositions.length,0),20);assert.equal(new Set(batch134Data.records.map(r=>String(r.aid))).size,10);assert.equal(new Set(batch134Data.records.map(r=>r.evidence_family_id)).size,10);
for(const r of batch134Data.records){assert.equal(r.status,'Parsed');assert.equal(r.pipeline_status,'Parsed');assert.equal(r.canonical_status,'Parsed');assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);assert.equal(r.proposition_verification,'source_text_inspected');assert(r.proposition_source_locator&&r.provenance&&r.verification_scope);assert.equal(r.context_status,'partial');assert.equal(r.independent_witness,false);assert.equal(r.translation_of_evidence_family_id,r.evidence_family_id);assert.equal(r.original_language,'unknown');assert.equal(r.language,'English');assert.equal(r.response_propositions.length,r.response_proposition_locators.length);}
assert.equal(batch134Data.deduplication_check.full_index_scan_available,true);assert.equal(batch134Data.deduplication_check.full_index_scan_pending_reconciliation,false);assert.deepEqual(batch134Data.deduplication_check.canonical_identity_collisions,[]);assert.deepEqual(batch134Data.deduplication_check.missing_canonical_identities,[]);assert.equal(batch134Data.deduplication_check.all_target_identities_answer_eligible,true);
assert(['reconciled','reconciled_with_variance'].includes(batch134Data.reconciliation_status));assert.deepEqual(readinessMetrics(batch133Data.metrics_actual_after),readinessMetrics(batch134Data.metrics_actual_before));assert.deepEqual(readinessMetrics(batch134Data.metrics_actual_after),readinessMetrics(batch135Data.metrics_actual_before));assert.deepEqual(readinessMetrics(batch135Data.metrics_actual_after),readinessMetrics(metrics));
const carter134=idx.entries.find(e=>sourceAID(e)==='6427690');assert(carter134&&carter134.response_propositions.length===3&&carter134.response_propositions.some(p=>p.includes('גברת קרטר')&&p.includes('המשפחה')));
assert.equal(batch134Data.existing_identity_updates[0].aid,6427690);assert.equal(batch134Data.existing_identity_updates[0].existing_propositions_before,2);assert.equal(batch134Data.existing_identity_updates[0].total_propositions_after,3);
for(const aid of batch134Aids){const matches=idx.entries.filter(e=>sourceAID(e)===String(aid));assert.equal(matches.length,1,'batch-134 AID '+aid+' must have exactly one canonical identity');const e=matches[0];assert(e.has_content_evidence);assert.equal(e.status,'Parsed');assert.equal(e.canonical_file,batch134Path);assert.equal(e.independent_witness,false);assert.equal(e.translation_of_evidence_family_id,e.evidence_family_id);assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');assert(e.proposition_source_locator&&e.verification_scope&&e.provenance);assert.equal(e.response_proposition_locators.length,e.response_propositions.length);}
const existing568=idx.entries.filter(e=>sourceAID(e)==='2277935');assert.equal(existing568.length,1,'AID 2277935 must not be duplicated');assert.equal(existing568[0].canonical_file,'data/items/content-research-batch-056-2026-11-12.json');
const letter569=idx.entries.find(e=>sourceAID(e)==='2277937'),letter569star=idx.entries.find(e=>sourceAID(e)==='2277940');assert(letter569&&letter569star&&letter569.evidence_family_id!==letter569star.evidence_family_id);assert(letter569.relations.some(r=>r.type==='related_correspondence'&&r.target_id==='aid:2277945'));
const northAfricaQ='מה מתעדים מכתבי תש״י על שליחות חינוכית בצפון אפריקה, הקמת מוסדות חינוך ותיאום עם ליפסקר וגורודצקי?';assert(understandQuestion(northAfricaQ).topics.includes('שליחות חינוכית בצפון אפריקה'));
for(const mode of ['regular','researcher']){const m=buildAnswerModel(idx.entries,northAfricaQ,{mode});assert(m.answerable,mode+': North Africa education correspondence comparison must be answerable');for(const aid of ['2277921','2277937','2277942','2277945'])assert(m.sources.some(e=>sourceAID(e)===aid),mode+': missing North Africa source '+aid);assert.equal(m.synthesis?.topic,'north_africa_education_mission');assert.equal(m.synthesis?.attribution,'system_synthesis_not_rebbe_quote');assert.equal(m.synthesis?.claims.length,5);assert.equal(m.synthesis.claims[4].source_locators.length,2);assert.equal(m.claims.length,6);const ritualClaims=m.claims.filter(c=>c.source_numbers.includes(5));assert.equal(ritualClaims.length,2);assert(ritualClaims.some(c=>String(c.text).includes('הלל')));assert(ritualClaims.some(c=>String(c.text).includes('תפילין')));assert.equal(m.claims.length,5);assert(m.claims.every(c=>c.source_numbers.length===1&&c.source_locators.length===1));assert(m.citation_entailment.every(x=>x.valid));assert(m.context_boundary.every(x=>x.valid));if(mode==='researcher'){assert.equal(m.research.depth,'deep');assert.equal(m.research.evidence_families,4);assert.equal(m.research.independent_evidence_families,0);assert.equal(m.research.evidence_integrity.derived_non_independent,4);assert.equal(m.research.synthesis_scope,'cross_family_derived_case_comparison');assert.equal(m.research.claim_source_map.length,5);assert.equal(m.research.claim_source_map[4].source_locators.length,2);assert(m.research.claim_source_map.every(c=>c.source_numbers.length===1&&c.source_locators.length===1));assert(m.research.evidence_map.every(c=>c.witnesses.length===1&&c.witnesses[0].proposition_source_locator));}}


// Batch 135: ten newly inspected English correspondence translations, one in-place translation-family enrichment, and a bounded five-letter educational/publication comparison.
assert.equal(batch135Data.batch_id,'135');assert.equal(batch135Data.batch_file,batch135Path);assert.equal(batch135Data.records.length,9);assert.deepEqual(batch135Data.new_aids,batch135Aids);
assert.equal(batch135Data.new_source_identities,9);assert.equal(batch135Data.existing_identities_enriched,2);assert.equal(batch135Data.new_response_propositions,22);assert.equal(batch135Data.existing_response_propositions_added,6);assert.equal(batch135Data.total_new_paraphrase_entries,28);
assert.equal(batch135Data.answer_eligible_source_families_added,9);assert.equal(batch135Data.independent_witnesses_added,0);assert.equal(batch135Data.non_independent_presentations_added,9);assert.equal(batch135Data.content_verified_unique_sources_added,0);
assert.equal(batch135Data.source_bodies_inspected,11);assert.equal(batch135Data.source_body_review.length,11);assert.equal(batch135Data.reviewed_item_count,36);assert.equal(batch135Data.blocked_candidate_count,15);assert.equal(batch135Data.excluded_candidate_count,10);
assert.equal(batch135Data.fallback_source_attempted,true);assert.equal(batch135Data.crawler_retry,false);assert.equal(batch135Data.access_control_bypassed,false);assert.equal(batch135Data.full_text_copied,false);assert.equal(batch135Data.scan_only_verification_used,false);assert.equal(batch135Data.translations_counted_as_independent_witnesses,0);
assert.deepEqual(batch135Data.metrics_before,{answer_eligible_unique_sources:1375,content_verified_unique_sources:854,answer_eligible_propositions:3588});
assert.deepEqual(batch135Data.metrics_expected_after,{answer_eligible_unique_sources:1384,content_verified_unique_sources:854,answer_eligible_propositions:3616});
assert.deepEqual(batch135Data.metrics_delta_at_batch_boundary,{answer_eligible_unique_sources:9,content_verified_unique_sources:0,answer_eligible_propositions:28});
assert.equal(batch135Data.records.reduce((n,r)=>n+r.response_propositions.length,0),22);assert.equal(new Set(batch135Data.records.map(r=>String(r.aid))).size,9);assert.equal(new Set(batch135Data.records.map(r=>r.evidence_family_id)).size,9);
for(const r of batch135Data.records){assert.equal(r.status,'Parsed');assert.equal(r.pipeline_status,'Parsed');assert.equal(r.canonical_status,'Parsed');assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);assert.equal(r.proposition_verification,'source_text_inspected');assert(r.proposition_source_locator&&r.provenance&&r.verification_scope);assert.equal(r.context_status,'partial');assert.equal(r.independent_witness,false);assert.equal(r.translation_of_evidence_family_id,r.evidence_family_id);assert.equal(r.language,'English');assert.equal(r.original_language,'unknown');assert.equal(r.response_propositions.length,r.response_proposition_locators.length);}
assert.equal(batch135Data.existing_identity_updates[0].aid,4096303);assert.equal(batch135Data.existing_identity_updates[0].existing_propositions_before,0);assert.equal(batch135Data.existing_identity_updates[0].propositions_added,3);assert.equal(batch135Data.existing_identity_updates[0].total_propositions_after,3);assert.equal(batch135Data.existing_identity_updates[1].aid,2279298);assert.equal(batch135Data.existing_identity_updates[1].canonical_file,'data/items/content-research-batch-107-2026-11-16.json');assert.equal(batch135Data.existing_identity_updates[1].existing_propositions_before,2);assert.equal(batch135Data.existing_identity_updates[1].propositions_added,3);assert.equal(batch135Data.existing_identity_updates[1].total_propositions_after,5);
assert.equal(batch135Data.deduplication_check.full_index_scan_available,true);assert.equal(batch135Data.deduplication_check.full_index_scan_pending_reconciliation,false);assert.deepEqual(batch135Data.deduplication_check.canonical_identity_collisions,[]);assert.deepEqual(batch135Data.deduplication_check.missing_canonical_identities,[]);assert.equal(batch135Data.deduplication_check.all_target_identities_answer_eligible,true);
assert(['reconciled','reconciled_with_variance'].includes(batch135Data.reconciliation_status));assert.deepEqual(readinessMetrics(batch134Data.metrics_actual_after),readinessMetrics(batch135Data.metrics_actual_before));assert.deepEqual(readinessMetrics(batch135Data.metrics_actual_after),readinessMetrics(batch136Data.metrics_actual_before));
for(const aid of batch135Aids){const matches=idx.entries.filter(e=>sourceAID(e)===String(aid));assert.equal(matches.length,1,'batch-135 AID '+aid+' must have exactly one canonical identity');const e=matches[0];assert(e.has_content_evidence);assert.equal(e.status,'Parsed');assert.equal(e.canonical_file,batch135Path);assert.equal(e.independent_witness,false);assert.equal(e.translation_of_evidence_family_id,e.evidence_family_id);assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');assert.equal(e.response_propositions.length,e.response_proposition_locators.length);}
const enriched4096303=idx.entries.find(e=>sourceAID(e)==='4096303');assert(enriched4096303&&enriched4096303.has_content_evidence&&enriched4096303.status==='Linked'&&enriched4096303.response_propositions.length===4&&enriched4096303.independent_witness===false&&enriched4096303.translation_of_evidence_family_id===enriched4096303.evidence_family_id);assert(enriched4096303.response_proposition_locators.some(x=>x.includes('189–190'))&&enriched4096303.response_proposition_locators.some(x=>x.includes('191–194'))&&enriched4096303.response_proposition_locators.some(x=>x.includes('196–197'))&&enriched4096303.response_proposition_locators.some(x=>x.includes('197–199')),'AID 4096303 translation propositions must cite inspected body lines 189–199');
const enriched2279298=idx.entries.find(e=>sourceAID(e)==='2279298');assert(enriched2279298&&enriched2279298.has_content_evidence&&enriched2279298.canonical_file==='data/items/content-research-batch-107-2026-11-16.json'&&enriched2279298.response_propositions.length===5&&enriched2279298.independent_witness===false&&enriched2279298.translation_of_evidence_family_id===enriched2279298.evidence_family_id);assert(enriched2279298.response_proposition_locators.some(x=>x.includes('287–297')),'AID 2279298 must be merged into its existing batch-107 identity, not duplicated.');
const translatedFamilyMembers=idx.entries.filter(e=>e.evidence_family_id===enriched4096303.evidence_family_id);assert(translatedFamilyMembers.some(e=>e.id==='igrot-letter-5737-21-cheshvan-vol32-p48-original'&&!e.has_content_evidence));const answerBearingTranslationMembers=translatedFamilyMembers.filter(e=>e.has_content_evidence&&Array.isArray(e.response_propositions)&&e.response_propositions.length>0);assert.equal(answerBearingTranslationMembers.length,1,'one inspected translation manifestation may carry content once within the existing Evidence Family');assert.equal(answerBearingTranslationMembers[0].independent_witness,false);assert.equal(answerBearingTranslationMembers[0].translation_of_evidence_family_id,enriched4096303.evidence_family_id);
const educationLettersQ='מה ניתן ללמוד מהשוואה בין מכתבי הרבי על חינוך והפצת ספרים?';assert(understandQuestion(educationLettersQ).topics.includes('חינוך והפצת ספרים במכתבים'));
for(const mode of ['regular','researcher']){const m=buildAnswerModel(idx.entries,educationLettersQ,{mode});assert(m.answerable,'education-letter comparison must be answerable in '+mode+': '+m.reason);assert.equal(m.understanding.intent,'guidance');for(const aid of ['4422946','2277173','5920891','2277371','2277247'])assert(m.sources.some(e=>sourceAID(e)===aid),'missing educational comparison source '+aid);assert.equal(m.synthesis?.topic,'education_publication_letters_comparison');assert.equal(m.synthesis?.attribution,'system_synthesis_not_rebbe_quote');assert.equal(m.synthesis?.claims.length,5);assert(m.synthesis.claims.every(c=>c.source_numbers.length===1&&c.source_locators.length===1&&c.source_locators[0].locator));assert(m.claims.every(c=>c.source_locators.length===1));assert(m.citation_entailment.every(x=>x.valid));assert(m.context_boundary.every(x=>x.valid));assert(m.pattern_synthesis_integrity.valid);if(mode==='researcher'){assert.equal(m.research.depth,'deep');assert.equal(m.research.synthesis_scope,'cross_family_derived_case_comparison');assert.equal(m.research.evidence_families,5);assert.equal(m.research.independent_evidence_families,0);assert.equal(m.research.evidence_integrity.independent_witnesses,0);assert.equal(m.research.evidence_integrity.derived_non_independent,5);assert.equal(m.research.claim_source_map.length,5);assert(m.research.claim_source_map.every(c=>c.source_numbers.length===1));}}

// Batch 136: twelve newly inspected English letter translations, one existing-family enrichment, and a bounded five-letter education/outreach comparison.
const batch136Aids=[2277145,2277156,2277138,2277150,2277146,2277155,2277159,2277176,2277168,2277130,2277169,2277148];
assert.equal(batch136Data.batch_id,'136');assert.equal(batch136Data.batch_file,batch136Path);assert.equal(batch136Data.records.length,12);assert.deepEqual(batch136Data.new_aids,batch136Aids);
assert.equal(batch136Data.new_source_identities,12);assert.equal(batch136Data.existing_identities_enriched,1);assert.equal(batch136Data.new_response_propositions,22);assert.equal(batch136Data.existing_response_propositions_added,1);assert.equal(batch136Data.total_new_paraphrase_entries,23);
assert.equal(batch136Data.answer_eligible_source_families_added,12);assert.equal(batch136Data.independent_witnesses_added,0);assert.equal(batch136Data.non_independent_presentations_added,12);assert.equal(batch136Data.content_verified_unique_sources_added,0);
assert.equal(batch136Data.source_bodies_inspected,13);assert.equal(batch136Data.reviewed_item_count,14);assert.equal(batch136Data.blocked_candidates[0].aid,null);assert.equal(batch136Data.blocked_candidates[0].route_id,'4754257');assert.equal(batch136Data.fallback_source_attempted,true);
assert.equal(batch136Data.crawler_retry,false);assert.equal(batch136Data.access_control_bypassed,false);assert.equal(batch136Data.full_text_copied,false);assert.equal(batch136Data.scan_only_verification_used,false);assert.equal(batch136Data.translations_counted_as_independent_witnesses,0);
assert.deepEqual(batch136Data.metrics_before,{answer_eligible_unique_sources:1384,content_verified_unique_sources:854,answer_eligible_propositions:3616});
assert.deepEqual(batch136Data.metrics_expected_after,{answer_eligible_unique_sources:1396,content_verified_unique_sources:854,answer_eligible_propositions:3639});
assert.deepEqual(batch136Data.metrics_delta_at_batch_boundary,{answer_eligible_unique_sources:12,content_verified_unique_sources:0,answer_eligible_propositions:23});
assert.equal(batch136Data.records.reduce((n,r)=>n+r.response_propositions.length,0),22);assert.equal(new Set(batch136Data.records.map(r=>String(r.aid))).size,12);assert.equal(new Set(batch136Data.records.map(r=>r.evidence_family_id)).size,12);
for(const r of batch136Data.records){assert.equal(r.status,'Parsed');assert.equal(r.pipeline_status,'Parsed');assert.equal(r.canonical_status,'Parsed');assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);assert.equal(r.proposition_verification,'source_text_inspected');assert(r.proposition_source_locator&&r.provenance&&r.verification_scope);assert.equal(r.context_status,'partial');assert.equal(r.independent_witness,false);assert.equal(r.translation_of_evidence_family_id,r.evidence_family_id);assert.equal(r.original_language,'unknown');assert.equal(r.language,'English');assert.equal(r.response_propositions.length,r.response_proposition_locators.length);}
assert.equal(batch136Data.deduplication_check.full_index_scan_available,true);assert.equal(batch136Data.deduplication_check.full_index_scan_pending_reconciliation,false);assert.deepEqual(batch136Data.deduplication_check.canonical_identity_collisions,[]);assert.deepEqual(batch136Data.deduplication_check.missing_canonical_identities,[]);assert.equal(batch136Data.deduplication_check.all_target_identities_answer_eligible,true);
assert(['reconciled','reconciled_with_variance'].includes(batch136Data.reconciliation_status));assert.deepEqual(readinessMetrics(batch135Data.metrics_actual_after),readinessMetrics(batch136Data.metrics_actual_before));assert.deepEqual(readinessMetrics(batch136Data.metrics_actual_after),readinessMetrics(metrics));
for(const aid of batch136Aids){const matches=idx.entries.filter(e=>sourceAID(e)===String(aid));assert.equal(matches.length,1,'batch-136 AID '+aid+' must have exactly one canonical identity');const e=matches[0];assert(e.has_content_evidence);assert.equal(e.status,'Parsed');assert.equal(e.canonical_file,batch136Path);assert.equal(e.independent_witness,false);assert.equal(e.translation_of_evidence_family_id,e.evidence_family_id);assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');assert.equal(e.response_propositions.length,e.response_proposition_locators.length);}
assert.equal(batch136Data.existing_identity_updates[0].aid,4096303);assert.equal(batch136Data.existing_identity_updates[0].existing_propositions_before,3);assert.equal(batch136Data.existing_identity_updates[0].propositions_added,1);assert.equal(batch136Data.existing_identity_updates[0].total_propositions_after,4);
const cheshvanOutreachQ='מה מלמדים מכתבי חשוון תשי״א על אחריות חינוכית, הפצת תורה והשפעה על הזולת?';
assert(understandQuestion(cheshvanOutreachQ).topics.includes('אחריות חינוכית והשפעה על הזולת'));
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,cheshvanOutreachQ,{mode});
 assert(m.answerable,'Cheshvan 5711 education/outreach comparison must be answerable in '+mode+': '+m.reason);
 assert.equal(m.synthesis?.topic,'cheshvan_5711_education_outreach_letters');
 assert.equal(m.synthesis?.attribution,'system_synthesis_not_rebbe_quote');
 assert.equal(m.synthesis?.claims.length,5);
 assert(m.synthesis.claims.every(c=>c.source_numbers.length===1&&c.source_locators.length===1&&c.source_locators[0].locator&&c.witnesses?.length===1&&c.witnesses[0].independent_witness===false));
 assert(m.citation_entailment.every(x=>x.valid));assert(m.context_boundary.every(x=>x.valid));assert(m.pattern_synthesis_integrity.valid);
 for(const aid of ['2277145','2277138','2277146','2277176','2277130'])assert(m.sources.some(e=>sourceAID(e)===aid),'missing Cheshvan 5711 outreach letter '+aid);
 if(mode==='researcher'){assert.equal(m.research.depth,'deep');assert.equal(m.research.synthesis_scope,'cross_family_derived_case_comparison');assert.equal(m.research.evidence_families,5);assert.equal(m.research.independent_evidence_families,0);assert.equal(m.research.evidence_integrity.independent_witnesses,0);assert.equal(m.research.evidence_integrity.derived_non_independent,5);assert.equal(m.research.claim_source_map.length,5);assert(m.research.claim_source_map.every(c=>c.source_numbers.length===1&&c.source_locators.length===1));assert(m.research.synthesis_constraints.rule.includes('not independent witnesses'));}
}


// Batch 137: twelve inspected Yechidus event translations, one in-place Hebrew Sicha enrichment.
const batch137Path='data/items/content-research-batch-137-2026-11-17.json';
const batch137Data=JSON.parse(await readFile(new URL(batch137Path,root),'utf8'));
const batch137Aids=[2498908,2511676,2499039,2499790,2507215,2507246,2506320,2511619,2506437,2514160,2506495,2512299];
assert.equal(batch137Data.batch_id,'137');assert.equal(batch137Data.batch_file,batch137Path);assert.equal(batch137Data.records.length,12);assert.deepEqual(batch137Data.new_aids,batch137Aids);
assert.equal(batch137Data.new_source_identities,12);assert.equal(batch137Data.existing_identities_enriched,1);assert.equal(batch137Data.new_response_propositions,24);assert.equal(batch137Data.existing_response_propositions_added,1);assert.equal(batch137Data.total_new_paraphrase_entries,25);
assert.equal(batch137Data.answer_eligible_source_families_added,12);assert.equal(batch137Data.independent_witnesses_added,0);assert.equal(batch137Data.non_independent_presentations_added,12);assert.equal(batch137Data.content_verified_unique_sources_added,0);
assert.equal(batch137Data.source_bodies_inspected,13);assert.equal(batch137Data.source_body_review.length,13);assert.equal(batch137Data.reviewed_item_count,14);assert.equal(batch137Data.blocked_candidates[0].aid,4666220);assert.equal(batch137Data.fallback_source_attempted,true);assert.equal(batch137Data.fallback_source_results.accessible_item_level_bodies,12);
assert.equal(batch137Data.crawler_retry,false);assert.equal(batch137Data.access_control_bypassed,false);assert.equal(batch137Data.full_text_copied,false);assert.equal(batch137Data.scan_only_verification_used,false);assert.equal(batch137Data.translations_counted_as_independent_witnesses,0);
assert.deepEqual(batch137Data.metrics_before,{answer_eligible_unique_sources:1396,content_verified_unique_sources:854,answer_eligible_propositions:3639});
assert.deepEqual(batch137Data.metrics_expected_after,{answer_eligible_unique_sources:1408,content_verified_unique_sources:854,answer_eligible_propositions:3664});
assert.deepEqual(batch137Data.metrics_delta_at_batch_boundary,{answer_eligible_unique_sources:12,content_verified_unique_sources:0,answer_eligible_propositions:25});
assert.equal(batch137Data.records.reduce((n,r)=>n+r.response_propositions.length,0),24);assert.equal(new Set(batch137Data.records.map(r=>String(r.aid))).size,12);assert.equal(new Set(batch137Data.records.map(r=>r.evidence_family_id)).size,12);
for(const r of batch137Data.records){assert.equal(r.status,'Parsed');assert.equal(r.pipeline_status,'Parsed');assert.equal(r.canonical_status,'Parsed');assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);assert.equal(r.proposition_verification,'source_text_inspected');assert(r.proposition_source_locator&&r.provenance&&r.verification_scope);assert.equal(r.context_status,'partial');assert.equal(r.independent_witness,false);assert.equal(r.translation_of_evidence_family_id,r.evidence_family_id);assert.equal(r.original_language,'unknown');assert.equal(r.language,'English');const expectedBatch156Props={'2277173':3,'3907042':3,'3905775':2,'2022588':3,'2278280':4,'1923078':3,'2076262':3,'1889610':2};
 assert.equal(r.response_propositions.length,expectedBatch156Props[String(r.aid)]);assert.equal(r.response_propositions.length,r.response_proposition_locators.length);}
assert.equal(batch137Data.deduplication_check.full_index_scan_available,true);assert.equal(batch137Data.deduplication_check.full_index_scan_pending_reconciliation,false);assert(Array.isArray(batch137Data.deduplication_check.canonical_identity_collisions));assert(Array.isArray(batch137Data.deduplication_check.missing_canonical_identities));assert.equal(batch137Data.deduplication_check.all_target_identities_answer_eligible,true);
assert(['reconciled','reconciled_with_variance'].includes(batch137Data.reconciliation_status));assert.deepEqual(readinessMetrics(batch136Data.metrics_actual_after),readinessMetrics(batch137Data.metrics_actual_before));assert.deepEqual(readinessMetrics(batch137Data.metrics_actual_after),readinessMetrics(metrics));
assert.equal(batch137Data.existing_identity_updates[0].aid,5959845);assert.equal(batch137Data.existing_identity_updates[0].existing_propositions_before,14);assert.equal(batch137Data.existing_identity_updates[0].total_propositions_after,15);
for(const aid of batch137Aids){const matches=idx.entries.filter(e=>sourceAID(e)===String(aid));assert.equal(matches.length,1,'batch-137 AID '+aid+' must have exactly one canonical identity');const e=matches[0];assert(e.has_content_evidence);assert.equal(e.status,'Parsed');assert.equal(e.canonical_file,batch137Path);assert.equal(e.independent_witness,false);assert.equal(e.translation_of_evidence_family_id,e.evidence_family_id);assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');assert.equal(e.response_propositions.length,2);assert.equal(e.response_propositions.length,e.response_proposition_locators.length);}
const enriched5959845Batch137=idx.entries.find(e=>sourceAID(e)==='5959845');assert(enriched5959845Batch137&&enriched5959845Batch137.response_propositions.length===16);assert(enriched5959845Batch137.response_propositions.some(p=>p.includes('עשה לך רב')&&p.includes('קנה לך חבר')));assert(enriched5959845Batch137.response_proposition_locators.some(l=>String(l).includes('319–325')));
const yechidusQuestion='מה מלמדות שיחות היחידות השונות על אחדות ישראל והשליחות האישית לאחר החזרה הביתה?';
for(const mode of ['regular','researcher']){const m=buildAnswerModel(idx.entries,yechidusQuestion,{mode});assert(m.answerable,mode+': five-event Yechidus comparison must be answerable');assert.equal(m.synthesis?.topic,'yechidus_unity_and_mission');assert.equal(m.synthesis?.attribution,'system_synthesis_not_rebbe_quote');assert.equal(m.synthesis?.claims?.length,5);assert.equal(m.synthesis?.evidence_family_ids?.length,5);assert.equal(m.synthesis?.independent_evidence_family_ids?.length,0);assert.equal(m.pattern_synthesis_integrity?.valid,true);assert(m.synthesis.claims.every(c=>c.source_numbers.length===1&&c.source_locators.length===1&&c.source_locators[0].locator&&c.witnesses?.length===1&&c.witnesses[0].independent_witness===false));assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));if(mode==='researcher'){assert(m.research&&m.research.depth==='deep');assert.equal(m.research.synthesis_scope,'cross_family_derived_case_comparison');assert.equal(m.research.evidence_families,5);assert.equal(m.research.independent_evidence_families,0);assert.equal(m.research.evidence_integrity.derived_non_independent,5);assert(m.research.claim_source_map.every(c=>c.source_locators.length===1));}else assert.equal(m.research,undefined);}


// Batch 138: twelve inspected publisher-translated correspondence items.
// Each letter is its own Evidence Family, but the English rendering is a
// derived presentation, not an independent witness. AID 553672 remains excluded
// because the accessible page contains audio links but no transcript.
const batch138Path='data/items/content-research-batch-138-2026-11-17.json';
const batch138Data=JSON.parse(await readFile(new URL(batch138Path,root)));
const batch138Aids=['2277184','2277190','2277193','2277219','2243707','2244140','2244141','2274740','2274827','3905688','3905750','3905762'];
assert.equal(batch138Data.records.length,12);
assert.deepEqual(batch138Data.records.map(e=>String(e.aid)),batch138Aids);
assert.equal(batch138Data.new_source_identities,12);
assert.equal(batch138Data.new_response_propositions,24);
assert.equal(batch138Data.total_new_paraphrase_entries,25);
assert.equal(batch138Data.existing_identities_enriched,1);
assert.equal(batch138Data.existing_identity_updates[0].aid,2277247);
assert.equal(batch138Data.existing_identity_updates[0].existing_propositions_before,2);
assert.equal(batch138Data.existing_identity_updates[0].total_propositions_after,3);
assert.equal(batch138Data.blocked_candidates[0].aid,553672);
assert.equal(batch138Data.blocked_candidates[0].status,'publisher_media_page_without_transcript');
assert(!batch138Data.records.some(e=>String(e.aid)==='553672'));
assert.equal(batch138Data.translations_counted_as_independent_witnesses,0);
assert.equal(batch138Data.crawler_retry,false);
assert.equal(batch138Data.access_control_bypassed,false);
assert.equal(batch138Data.full_text_copied,false);
for(const r of batch138Data.records){
 assert.equal(r.status,'Parsed');
 assert.equal(r.has_content_evidence,true);
 assert.equal(r.independent_witness,false);
 assert.equal(r.translation_of_evidence_family_id,r.evidence_family_id);
 assert.equal(r.original_language,'unknown');
 assert.equal(r.language,'English');
 assert.equal(r.proposition_language,'Hebrew');
 assert.equal(r.proposition_origin,'source_grounded_paraphrase');
 assert.equal(r.proposition_verbatim,false);
 assert.equal(r.proposition_verification,'source_text_inspected');
 assert.equal(r.context_status,'partial');
 assert.equal(r.response_propositions.length,2);
 assert.equal(r.response_propositions.length,r.response_proposition_locators.length);
 assert(r.proposition_source_locator&&r.provenance&&r.verification_scope);
}
assert.equal(batch138Data.deduplication_check.full_index_scan_available,true);
assert.equal(batch138Data.deduplication_check.full_index_scan_pending_reconciliation,false);
assert(Array.isArray(batch138Data.deduplication_check.canonical_identity_collisions));
assert(Array.isArray(batch138Data.deduplication_check.missing_canonical_identities));
assert.equal(batch138Data.deduplication_check.all_target_identities_answer_eligible,true);
assert(['reconciled','reconciled_with_variance'].includes(batch138Data.reconciliation_status));
assert.deepEqual(readinessMetrics(batch137Data.metrics_actual_after),readinessMetrics(batch138Data.metrics_actual_before));
assert.deepEqual(readinessMetrics(batch138Data.metrics_actual_after),readinessMetrics(metrics));
assert.equal(batch138Data.metrics_expected_after.answer_eligible_unique_sources,1420);
assert.equal(batch138Data.metrics_actual_after.answer_eligible_unique_sources,metrics.answer_eligible_unique_sources);
for(const aid of batch138Aids){
 const matches=idx.entries.filter(e=>sourceAID(e)===aid);
 assert.equal(matches.length,1,'batch-138 AID '+aid+' must have exactly one canonical identity');
 const e=matches[0];
 assert(e.has_content_evidence);
 assert.equal(e.status,'Parsed');
 assert.equal(e.canonical_file,batch138Path);
 assert.equal(e.independent_witness,false);
 assert.equal(e.translation_of_evidence_family_id,e.evidence_family_id);
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');
 assert.equal(e.response_propositions.length,2);
 assert.equal(e.response_propositions.length,e.response_proposition_locators.length);
}
const enrichedLetter837=idx.entries.find(e=>sourceAID(e)==='2277247');
assert(enrichedLetter837&&enrichedLetter837.response_propositions.length===3);
assert(enrichedLetter837.response_propositions.some(p=>p.includes('פדיון הנפש')&&p.includes('הנמען')));
assert(enrichedLetter837.response_proposition_locators.some(l=>String(l).includes('199–200')));
assert(!idx.entries.some(e=>sourceAID(e)==='553672'&&e.has_content_evidence===true));

const yudTesLettersQuestion='מה עולה מארבע איגרות י״ט כסלו תשי״א על הפצת המעיינות, תפקיד מנהיגי הקהילות ותמיכה במוסדות?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,yudTesLettersQuestion,{mode});
 assert(m.answerable,mode+': four-letter Yud-Tes Kislev comparison must be answerable');
 assert.equal(m.synthesis?.topic,'yud_tes_kislev_dissemination_letters');
 assert.equal(m.synthesis?.attribution,'system_synthesis_not_rebbe_quote');
 assert.equal(m.synthesis?.evidence_quality,'four_distinct_letter_families_all_derived_translations');
 assert.equal(m.synthesis?.claims?.length,4);
 assert.equal(m.synthesis?.basis?.length,4);
 assert.equal(m.synthesis?.evidence_family_ids?.length,4);
 assert.equal(m.synthesis?.independent_evidence_family_ids?.length,0);
 assert.deepEqual(m.sources.map(e=>sourceAID(e)),['2277184','2277190','2277193','2277219']);
 assert.equal(new Set(m.sources.map(e=>e.evidence_family_id)).size,4);
 assert(m.sources.every(e=>e.independent_witness===false&&e.status==='Parsed'));
 assert(m.synthesis.claims.every(c=>c.source_numbers.length===1&&c.source_locators.length===1&&c.source_locators[0].locator&&c.witnesses?.length===1&&c.witnesses[0].independent_witness===false&&c.text===c.witnesses[0].proposition));
 assert.equal(m.pattern_synthesis_integrity?.valid,true);
 assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));
 if(mode==='researcher'){
  assert(m.research&&m.research.depth==='deep');
  assert.equal(m.research.synthesis_scope,'cross_family_derived_case_comparison');
  assert.equal(m.research.evidence_families,4);
  assert.equal(m.research.independent_evidence_families,0);
  assert.equal(m.research.evidence_integrity.independent_witnesses,0);
  assert.equal(m.research.evidence_integrity.derived_non_independent,4);
  assert.equal(m.research.evidence_witnesses.length,4);
  assert.equal(m.research.evidence_map.length,4);
  assert(m.research.claim_source_map.every(c=>c.source_locators.length===1&&c.source_locators[0].locator));
  assert(m.research.synthesis_constraints.rule.includes('not independent witnesses'));
 }else assert.equal(m.research,undefined);
}

const batch139Path='data/items/content-research-batch-139-2026-11-17.json';
const batch139Data=JSON.parse(await readFile(new URL(batch139Path,root),'utf8'));
const batch140Path='data/items/content-research-batch-140-2026-11-17.json';
const batch140Data=JSON.parse(await readFile(new URL(batch140Path,root),'utf8'));
const batch139Aids=['4279913','4279926','4279851','2989413','2989417','2989565','2989298','2465321','2487556','2513997','2512367','2513225'];
const batch140Aids=['2989331','2989369','2989411'];
assert.equal(batch139Data.records.length,12);
assert.deepEqual(batch139Data.new_aids.map(String),batch139Aids);
assert.equal(batch139Data.new_source_identities,12);
assert.equal(batch139Data.new_response_propositions,24);
assert.equal(batch139Data.existing_response_propositions_added,3);
assert.equal(batch139Data.total_new_paraphrase_entries,27);
assert.equal(batch139Data.existing_identity_updates.length,2);
assert.equal(batch139Data.existing_identity_rechecks.length,3);
assert(!batch139Data.records.some(r=>String(r.aid)==='2989329'),'duplicate AID 2989329 must not remain as a new identity');
assert(batch139Data.existing_identity_rechecks.some(r=>String(r.aid)==='2989329'&&r.canonical_file==='data/items/content-research-batch-070-2026-11-13.json'));
assert.deepEqual(readinessMetrics(batch139Data.metrics_before),readinessMetrics(batch138Data.metrics_expected_after));
assert.deepEqual(readinessMetrics(batch139Data.metrics_expected_after),{answer_eligible_unique_sources:1432,content_verified_unique_sources:854,answer_eligible_propositions:3716});
assert.equal(batch139Data.deduplication_check.full_index_scan_available,true);
assert.equal(batch139Data.deduplication_check.full_index_scan_pending_reconciliation,false);
assert(Array.isArray(batch139Data.deduplication_check.canonical_identity_collisions));
assert(Array.isArray(batch139Data.deduplication_check.missing_canonical_identities));
assert.equal(batch139Data.deduplication_check.all_target_identities_answer_eligible,true);
const canonical2989329=idx.entries.filter(e=>sourceAID(e)==='2989329');
assert.equal(canonical2989329.length,1);
assert.equal(canonical2989329[0].canonical_file,'data/items/content-research-batch-070-2026-11-13.json');
assert.equal(canonical2989329[0].status,'Verified');
for(const aid of batch139Aids){
 const matches=idx.entries.filter(e=>sourceAID(e)===aid);assert.equal(matches.length,1,'batch-139 AID '+aid+' must have exactly one canonical identity');
 const e=matches[0];assert(e.has_content_evidence);assert.equal(e.status,'Parsed');assert.equal(e.canonical_file,batch139Path);
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope);assert.equal(e.response_propositions.length,e.response_proposition_locators.length);
}
for(const aid of [4279926,4279851,2989413,2989565,2989298]){
 const e=idx.entries.find(x=>sourceAID(x)===String(aid));assert(e&&e.response_propositions.length===3,'batch-140 enrichment must be merged in place for AID '+aid);
 assert.equal(e.canonical_file,batch139Path);assert(e.response_proposition_locators.length===3);
}
for(const aid of [4279913,2989417]){
 const e=idx.entries.find(x=>sourceAID(x)===String(aid));assert(e&&e.response_propositions.length===2,'rechecked identity must not receive a redundant proposition: '+aid);
}
assert.equal(batch140Data.records.length,3);
assert.deepEqual(batch140Data.new_aids.map(String),batch140Aids);
assert.equal(batch140Data.new_source_identities,3);
assert.equal(batch140Data.existing_identities_enriched,5);
assert.equal(batch140Data.existing_identities_rechecked,2);
assert.equal(batch140Data.new_response_propositions,6);
assert.equal(batch140Data.existing_response_propositions_added,5);
assert.equal(batch140Data.total_new_paraphrase_entries,11);
assert.equal(batch140Data.source_bodies_inspected,10);
assert.equal(batch140Data.records.reduce((n,r)=>n+r.response_propositions.length,0),6);
assert.equal(batch140Data.translations_counted_as_independent_witnesses,0);
assert.equal(batch140Data.independent_witnesses_added,2);
assert.equal(batch140Data.non_independent_presentations_added,1);
assert.equal(batch140Data.new_translation_manifestations,1);
assert.equal(batch140Data.records.filter(r=>r.independent_witness===true).length,2);
assert.equal(batch140Data.records.find(r=>String(r.aid)==='2989411').independent_witness,false);
assert.equal(batch140Data.records.find(r=>String(r.aid)==='2989411').translation_of_evidence_family_id,batch140Data.records.find(r=>String(r.aid)==='2989411').evidence_family_id);
assert.equal(batch140Data.content_verified_unique_sources_added,0);
assert.deepEqual(readinessMetrics(batch140Data.metrics_before),readinessMetrics(batch139Data.metrics_expected_after));
assert.deepEqual(readinessMetrics(batch140Data.metrics_expected_after),{answer_eligible_unique_sources:1435,content_verified_unique_sources:854,answer_eligible_propositions:3727});
assert.equal(batch140Data.deduplication_check.full_index_scan_available,true);
assert.equal(batch140Data.deduplication_check.full_index_scan_pending_reconciliation,false);
assert(Array.isArray(batch140Data.deduplication_check.canonical_identity_collisions));
assert(Array.isArray(batch140Data.deduplication_check.missing_canonical_identities));
assert.equal(batch140Data.deduplication_check.all_target_identities_answer_eligible,true);
assert.deepEqual(readinessMetrics(batch140Data.metrics_actual_before),readinessMetrics(batch139Data.metrics_actual_after));
assert.deepEqual(readinessMetrics(batch140Data.metrics_actual_after),readinessMetrics(metrics));
for(const aid of batch140Aids){
 const matches=idx.entries.filter(e=>sourceAID(e)===aid);assert.equal(matches.length,1,'batch-140 AID '+aid+' must have exactly one canonical identity');
 const e=matches[0];assert(e.has_content_evidence);assert.equal(e.status,'Parsed');assert.equal(e.canonical_file,batch140Path);
 assert.equal(e.language,'Hebrew');assert.equal(e.original_language,'Hebrew');assert.equal(e.independent_witness,true);
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope);assert.equal(e.response_propositions.length,2);assert.equal(e.response_propositions.length,e.response_proposition_locators.length);
}
assert.equal(batch140Data.existing_identity_updates.length,5);
assert.equal(batch140Data.existing_identity_rechecks.length,2);



// Batch 144: seven distinct general telegrams, four Hebrew talks, one Hebrew letter,
// and one English testimony carrying a translated Yiddish letter. The latter is
// a derived presentation, not an independent witness.
const batch144Path='data/items/content-research-batch-144-2026-11-17.json';
const batch144Data=JSON.parse(await readFile(new URL(batch144Path,root),'utf8'));
const batch144Aids=['4280036','4280068','4280139','4385646','5959941','5959973','4280027','4304431','4304427','4304341','4304436','2989328','259799'];
assert.equal(batch144Data.records.length,13);
assert.deepEqual(batch144Data.new_aids.map(String),batch144Aids);
assert.equal(batch144Data.new_source_identities,13);
assert.equal(batch144Data.new_response_propositions,19);
assert.equal(batch144Data.existing_identities_enriched,2);
assert.equal(batch144Data.existing_response_propositions_added,2);
assert.equal(batch144Data.total_new_paraphrase_entries,21);
assert.equal(batch144Data.answer_eligible_source_families_added,15);
assert.equal(batch144Data.independent_witnesses_added,12);
assert.equal(batch144Data.non_independent_presentations_added,1);
assert.equal(batch144Data.content_verified_unique_sources_added,0);
assert.equal(batch144Data.translations_counted_as_independent_witnesses,0);
assert.equal(batch144Data.recovered_candidate_count,1);
assert.equal(batch144Data.recovered_candidates[0].aid,4280139);
assert.equal(batch144Data.blocked_candidate_count,0);
assert.equal(batch144Data.source_body_review.length,15);
assert.equal(batch144Data.source_body_review.filter(x=>x.web_source_ref).length,15);
assert.equal(batch144Data.crawler_retry,false);
assert.equal(batch144Data.access_control_bypassed,false);
assert.equal(batch144Data.full_text_copied,false);
assert.equal(typeof batch144Data.deduplication_check.full_index_scan_available,'boolean');
if(batch144Data.reconciliation_status==='reconciled'){
 assert.equal(batch144Data.deduplication_check.full_index_scan_available,true);
 assert.equal(batch144Data.deduplication_check.full_index_scan_pending_reconciliation,false);
 assert.deepEqual(readinessMetrics(batch144Data.metrics_actual_after),readinessMetrics(metrics));
}else{
 assert.equal(batch144Data.deduplication_check.full_index_scan_available,false);
 assert.equal(batch144Data.deduplication_check.full_index_scan_pending_reconciliation,true);
 assert.equal(batch144Data.metrics_actual_after,null);
}
for(const record of batch144Data.records){
 assert.equal(record.status,'Parsed');
 if(record.independent_witness===true)assert.match(record.primary_secondary_status,/^Primary published text witness:/);
 else assert.match(record.primary_secondary_status,/secondary|testimony|translated/i);
 assert.equal(record.has_content_evidence,true);
 assert.equal(record.proposition_origin,'source_grounded_paraphrase');
 assert.equal(record.proposition_verbatim,false);
 assert.equal(record.proposition_verification,'source_text_inspected');
 assert(record.proposition_source_locator&&record.verification_scope&&record.provenance);
 assert.equal(record.response_propositions.length,record.response_proposition_locators.length);
 assert(record.evidence_family_id);
 const matches=idx.entries.filter(e=>sourceAID(e)===String(record.aid));
 assert.equal(matches.length,1,'batch-144 AID '+record.aid+' must have exactly one canonical identity after reconciliation');
 const e=matches[0];
 assert(e.has_content_evidence);
 assert.equal(e.status,'Parsed');
 assert.equal(e.canonical_file,batch144Path);
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope);
 assert.equal(e.response_propositions.length,e.response_proposition_locators.length);
 assert.equal(e.evidence_family_id,record.evidence_family_id);
 assert.equal(e.independent_witness,record.independent_witness);
}
const shavuot5720=idx.entries.find(e=>sourceAID(e)==='4280139');
const shavuot5730=idx.entries.find(e=>sourceAID(e)==='5959973');
assert(shavuot5720&&shavuot5730);
assert.notEqual(shavuot5720.evidence_family_id,shavuot5730.evidence_family_id,'same-theme Shavuot telegrams from distinct years must remain separate Evidence Families');
const shavuot5720Record=batch144Data.records.find(x=>String(x.aid)==='4280139');
assert(shavuot5720Record.relations.some(r=>r.target_aid===5959973&&r.relation==='parallel_theme_distinct_date'));
const translatedYiddish259799=idx.entries.find(e=>sourceAID(e)==='259799');
assert(translatedYiddish259799);
assert.equal(translatedYiddish259799.language,'English');
assert.equal(translatedYiddish259799.original_language,'Yiddish');
assert.equal(translatedYiddish259799.independent_witness,false);
assert.equal(translatedYiddish259799.translation_of_evidence_family_id,translatedYiddish259799.evidence_family_id);
for(const [aid,canonicalFile] of [['5478256','data/items/igrot-kodesh-vol3-p372-livelihood-minyan.json'],['2301532','data/items/response-cases-shidduch-001.json']]){
 const e=idx.entries.find(x=>sourceAID(x)===aid);
 assert(e&&e.has_content_evidence,'existing identity '+aid+' must be enriched in place');
 assert.equal(e.canonical_file,canonicalFile);
 assert.equal(e.status,'Parsed');
 assert.equal(e.response_propositions.length,1);
 assert.equal(e.response_proposition_locators.length,1);
 assert.equal(e.independent_witness,false);
 assert.equal(e.translation_of_evidence_family_id,e.evidence_family_id);
}

const activeFarbrengenQuery='מהו הדפוס החוזר במברקים על התוועדויות פעילות לקראת מועדים שונים, ומה נאמר על המשכיות הפעילות לאורך השנה?';
const activeFarbrengenUnderstanding=understandQuestion(activeFarbrengenQuery);
assert(activeFarbrengenUnderstanding.topics.includes('התוועדויות פעילות והמשכיות לאורך השנה'));
assert.equal(activeFarbrengenUnderstanding.intent,'pattern');
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,activeFarbrengenQuery,{mode});
 assert(m.answerable,mode+': active-farbrengen comparison must be supported by multiple dated telegram families');
 assert.equal(m.synthesis?.kind,'cross_family_research_synthesis');
 assert.equal(m.synthesis?.topic,'active_farbrengen_messages');
 assert.equal(m.synthesis?.attribution,'system_synthesis_not_rebbe_quote');
 assert(m.sources.length>=2);
 assert(!m.sources.some(e=>sourceAID(e)==='259799'),'translated Yiddish presentation must not be counted as an independent farbrengen witness');
 assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=2);
 assert(m.claims.length>=2);
 assert(m.claims.every(c=>c.source_numbers.length>0&&c.source_locators.length>0));
 assert(m.synthesis.claims.length>=2);
 assert(m.synthesis.claims.every(c=>c.source_numbers.length>0&&c.source_locators.length>0));
 const yearRoundClaim=m.synthesis.claims.find(c=>c.topic==='year_round_continuity');
 assert(yearRoundClaim&&yearRoundClaim.source_locators.length===1,'year-round continuation must remain attached only to the telegram that explicitly states it');
 if(mode==='researcher'){
  assert(m.research&&m.research.depth==='deep');
  assert.equal(m.research.synthesis_scope,'cross_family');
  assert(m.research.evidence_families>=2);
  assert(m.research.independent_evidence_families>=2);
  assert(m.research.evidence_integrity.independent_witnesses>=2);
  assert.equal(m.research.evidence_integrity.derived_non_independent,0);
  assert(m.research.evidence_map.length===m.claims.length);
  assert(m.research.claim_source_map.every(c=>c.source_locators.length>0));
  assert(m.research.witnesses.every(w=>w.proposition_locators.length>0));
 }else assert.equal(m.research,undefined);
}


// Batch 145: twelve bilingual Hayom Yom entries with inspected original-language excerpts,
// plus one in-place enrichment of existing AID 528832. Same-page English renderings are not witnesses.
const batch145Path='data/items/content-research-batch-145-2026-11-17.json';
const batch145Data=JSON.parse(await readFile(new URL(batch145Path,root),'utf8'));
const batch145Aids=['3315370','3315386','3315388','3317931','3317985','3318010','3318015','3318017','3318041','3315396','3315412','3315415'];
assert.equal(batch145Data.records.length,12);
assert.deepEqual(batch145Data.new_aids.map(String),batch145Aids);
assert.equal(batch145Data.new_source_identities,12);
assert.equal(batch145Data.existing_identities_enriched,1);
assert.equal(batch145Data.enriched_aids[0],528832);
assert.equal(batch145Data.new_response_propositions,12);
assert.equal(batch145Data.existing_response_propositions_added,1);
assert.equal(batch145Data.total_new_paraphrase_entries,13);
assert.equal(batch145Data.answer_eligible_source_families_added,12);
assert.equal(batch145Data.independent_witnesses_added,12);
assert.equal(batch145Data.non_independent_presentations_added,0);
assert.equal(batch145Data.content_verified_unique_sources_added,0);
assert.equal(batch145Data.translations_counted_as_independent_witnesses,0);
assert.equal(batch145Data.blocked_candidates[0].aid,4666220);
assert.equal(batch145Data.fallback_source_attempted,true);
assert.equal(batch145Data.crawler_retry,false);
assert.equal(batch145Data.access_control_bypassed,false);
assert.equal(batch145Data.full_text_copied,false);
assert.equal(batch145Data.reviewed_item_count,14);
assert.equal(batch145Data.source_bodies_inspected,13);
assert.equal(batch145Data.source_body_pages_opened,14);
assert.equal(batch145Data.source_body_review.length,13);
assert.equal(batch145Data.existing_identity_updates.length,1);
assert.equal(batch145Data.existing_identity_updates[0].aid,528832);
assert.equal(batch145Data.existing_identity_updates[0].action,'enriched_existing_identity_in_place');
assert.equal(new Set(batch145Data.records.map(r=>String(r.aid))).size,12);
assert.equal(new Set(batch145Data.records.map(r=>r.evidence_family_id)).size,12);
assert.equal(new Set(batch145Data.records.map(r=>r.source_url)).size,12);
for(const r of batch145Data.records){
 assert.equal(r.status,'Parsed');
 assert.equal(r.pipeline_status,'Parsed');
 assert.equal(r.canonical_status,'Parsed');
 assert.equal(r.has_content_evidence,true);
 assert.equal(r.independent_witness,true);
 assert.equal(r.translation_of_evidence_family_id,null);
 assert.equal(r.proposition_origin,'source_grounded_paraphrase');
 assert.equal(r.proposition_verbatim,false);
 assert.equal(r.proposition_verification,'source_text_inspected');
 assert(r.proposition_source_locator&&r.provenance&&r.verification_scope);
 assert.equal(r.context_status,'partial');
 assert.equal(r.response_propositions.length,1);
 assert.equal(r.response_propositions.length,r.response_proposition_locators.length);
 const found=idx.entries.filter(e=>sourceAID(e)===String(r.aid));
 assert.equal(found.length,1,'batch-145 AID '+r.aid+' must have one canonical identity after reconciliation');
 assert.equal(found[0].canonical_file,batch145Path);
 assert.equal(found[0].status,'Parsed');
}
const enriched528832=idx.entries.find(e=>sourceAID(e)==='528832');
assert(enriched528832&&enriched528832.response_propositions.length===3);
assert(enriched528832.response_propositions.some(p=>p.includes('שלושים ושישה פרקי תהילים')&&p.includes('כל נדרי')&&p.includes('לאחר נעילה')));
assert.equal(enriched528832.evidence_family_id,'hayom-yom-528832-5703');
assert.equal(enriched528832.canonical_file,'data/items/content-research-batch-127-2026-11-16.json');
assert.equal(enriched528832.content_enrichment_batch_id,'145');
assert.equal(enriched528832.response_proposition_locators.length,3);
assert.equal(batch145Data.translations_counted_as_independent_witnesses,0);
assert(['reconciled','reconciled_with_variance'].includes(batch145Data.reconciliation_status),'batch 145 must be reconciled before readiness is reported');
assert.equal(batch145Data.deduplication_check.full_index_scan_available,true);
assert.equal(batch145Data.deduplication_check.full_index_scan_pending_reconciliation,false);
assert.deepEqual(batch145Data.deduplication_check.canonical_identity_collisions,[]);
assert.deepEqual(batch145Data.deduplication_check.missing_canonical_identities,[]);
assert.equal(batch145Data.deduplication_check.all_target_identities_answer_eligible,true);

const batch146Path='data/items/content-research-batch-146-2026-11-17.json';
const batch146Data=JSON.parse(await readFile(new URL(batch146Path,root),'utf8'));
const batch146Aids=['4304430','4304429','4304360','4304438','4304437','4304414','4304420','4304396'];
assert.equal(batch146Data.records.length,8);
assert.deepEqual(batch146Data.new_aids.map(String),batch146Aids);
assert.equal(batch146Data.new_source_identities,8);
assert.equal(batch146Data.answer_eligible_source_families_added,7);
assert.equal(batch146Data.new_response_propositions,10);
assert.equal(batch146Data.total_new_paraphrase_entries,11);
assert.equal(batch146Data.existing_identities_enriched,1);
assert.equal(batch146Data.existing_response_propositions_added,1);
assert.equal(batch146Data.existing_identity_updates_count,1);
assert.deepEqual(batch146Data.enriched_aids,[4304431]);
assert.equal(batch146Data.content_verified_unique_sources_added,0);
assert.equal(batch146Data.independent_witnesses_added,8);
assert.equal(batch146Data.non_independent_presentations_added,0);
assert.equal(batch146Data.translations_counted_as_independent_witnesses,0);
assert.equal(batch146Data.reviewed_item_count,16);
assert.equal(batch146Data.source_bodies_inspected,9);
assert.equal(batch146Data.source_body_pages_opened,9);
assert.equal(batch146Data.source_body_review.length,9);
assert.equal(batch146Data.blocked_candidate_count,7);
assert.equal(batch146Data.fallback_source_attempted,true);
assert.equal(batch146Data.crawler_retry,false);
assert.equal(batch146Data.access_control_bypassed,false);
assert.equal(batch146Data.full_text_copied,false);
assert.equal(batch146Data.scan_only_verification_used,false);
assert.equal(new Set(batch146Data.records.map(r=>String(r.aid))).size,8);
assert.equal(new Set(batch146Data.records.map(r=>r.source_url)).size,8);
assert.equal(new Set(batch146Data.records.map(r=>r.evidence_family_id)).size,7);

const batch144EnrichmentPath='data/items/content-research-batch-144-2026-11-17.json';
const batch144EnrichmentData=JSON.parse(await readFile(new URL(batch144EnrichmentPath,root),'utf8'));
const enriched4304431=batch144EnrichmentData.records.find(r=>String(r.aid)==='4304431');
assert(enriched4304431);
assert.equal(enriched4304431.response_propositions.length,4);
assert.equal(enriched4304431.response_proposition_locators.length,4);
assert(enriched4304431.response_propositions[2].includes('כל השנה'));
assert(enriched4304431.response_proposition_locators[2].includes('שורות 209–217'));
assert(enriched4304431.response_propositions[3].includes('אדמו״ר הרש״ב'));
assert(enriched4304431.response_proposition_locators[3].includes('שורות 258–285'));
assert.equal(enriched4304431.conditions_or_qualifications.length,3);
assert.equal(enriched4304431.status,'Parsed');
assert.equal(enriched4304431.evidence_family_id,'sicha-י-ז-תמוז-נדחה-ה-תשכ-ד-aid4304431');
assert.equal(idx.entries.filter(e=>sourceAID(e)==='4304431').length,1);
assert.equal(idx.entries.find(e=>sourceAID(e)==='4304431').canonical_file,batch144EnrichmentPath);
assert.equal(idx.entries.find(e=>sourceAID(e)==='4304431').response_propositions.length,4);

const sameEventPair=batch146Data.records.filter(r=>['4304430','4304429'].includes(String(r.aid)));
assert.equal(sameEventPair.length,2);
assert.equal(sameEventPair[0].evidence_family_id,sameEventPair[1].evidence_family_id);
assert(sameEventPair.every(r=>r.relations.some(x=>x.type==='same_evidence_family')));
for(const r of batch146Data.records){
 assert.equal(r.status,'Parsed');
 assert.equal(r.pipeline_status,'Parsed');
 assert.equal(r.canonical_status,'Parsed');
 assert.equal(r.has_content_evidence,true);
 assert.equal(r.independent_witness,true);
 assert.equal(r.translation_of_evidence_family_id,null);
 assert.equal(r.proposition_origin,'source_grounded_paraphrase');
 assert.equal(r.proposition_verbatim,false);
 assert.equal(r.proposition_verification,'source_text_inspected');
 assert(r.proposition_source_locator&&r.provenance&&r.verification_scope);
 assert.equal(r.context_status,'partial');
 assert(r.response_propositions.length>=1);
 assert.equal(r.response_propositions.length,r.response_proposition_locators.length);
 const found=idx.entries.filter(e=>sourceAID(e)===String(r.aid));
 assert.equal(found.length,1,'batch-146 AID '+r.aid+' must have one canonical identity after reconciliation');
 assert.equal(found[0].canonical_file,batch146Path);
 assert.equal(found[0].status,'Parsed');
}
assert(['reconciled','reconciled_with_variance'].includes(batch146Data.reconciliation_status),'batch 146 must be reconciled before readiness is reported');
assert.equal(batch146Data.deduplication_check.full_index_scan_available,true);
assert.equal(batch146Data.deduplication_check.full_index_scan_pending_reconciliation,false);
assert.deepEqual(batch146Data.deduplication_check.canonical_identity_collisions,[]);
assert.deepEqual(batch146Data.deduplication_check.missing_canonical_identities,[]);
assert.equal(batch146Data.deduplication_check.all_target_identities_answer_eligible,true);
assert.deepEqual(readinessMetrics(batch146Data.metrics_actual_after),readinessMetrics(metrics));

const communityHospitalityQuestion='מה מתועד בשיחות על קבלת אורחים ואחדות ישראל?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,communityHospitalityQuestion,{mode});
 assert(m.answerable,mode+': community/hospitality comparison must be supported by two distinct Hebrew Sichos families');
 assert.equal(m.synthesis?.topic,'community_unity_and_hospitality');
 assert.equal(m.synthesis?.attribution,'system_synthesis_not_rebbe_quote');
 assert.equal(m.sources.length,2);
 assert.deepEqual(m.sources.map(e=>String(e.aid)),['4304437','4304438']);
 assert.equal(new Set(m.sources.map(e=>e.evidence_family_id)).size,2);
 assert.equal(m.claims.length,2);
 assert(m.claims.every(c=>c.source_numbers.length===1&&c.source_locators.length===1&&c.source_locators[0].locator));
 assert(m.synthesis.claims.every(c=>c.source_numbers.length===1&&c.source_locators.length===1&&c.source_locators[0].locator));
 if(mode==='researcher'){
  assert(m.research&&m.research.depth==='deep');
  assert.equal(m.research.synthesis_scope,'cross_family');
  assert.equal(m.research.evidence_families,2);
  assert.equal(m.research.independent_evidence_families,2);
  assert.equal(m.research.evidence_integrity.independent_witnesses,2);
  assert.equal(m.research.evidence_integrity.derived_non_independent,0);
  assert.equal(m.research.claim_source_map.length,2);
  assert(m.research.claim_source_map.every(c=>c.source_locators.length===1&&c.source_locators[0].locator));
 }else assert.equal(m.research,undefined);
}

assert.deepEqual(readinessMetrics(batch145Data.metrics_actual_after),readinessMetrics(batch146Data.metrics_actual_before));


const batch147Path='data/items/content-research-batch-147-2026-11-17.json';
const batch147Data=JSON.parse(await readFile(new URL(batch147Path,root),'utf8'));
const batch147Aids=['2465321','2487225','2466894','2499039','2487556','2487457','2504381','2499828'];
assert.equal(batch147Data.records.length,8);
assert.deepEqual(batch147Data.new_aids.map(String),batch147Aids);
assert.equal(batch147Data.new_source_identities,8);
assert.equal(batch147Data.answer_eligible_source_families_added,8);
assert.equal(batch147Data.new_response_propositions,8);
assert.equal(batch147Data.existing_identities_enriched,1);
assert.equal(batch147Data.existing_response_propositions_added,1);
assert.equal(batch147Data.total_new_paraphrase_entries,9);
assert.equal(batch147Data.independent_witnesses_added,0);
assert.equal(batch147Data.non_independent_presentations_added,8);
assert.equal(batch147Data.content_verified_unique_sources_added,0);
assert.equal(batch147Data.translations_counted_as_independent_witnesses,0);
assert.equal(batch147Data.reviewed_item_count,19);
assert.equal(batch147Data.source_bodies_inspected,9);
assert.equal(batch147Data.source_body_pages_opened,9);
assert.equal(batch147Data.source_body_review.length,8);
assert.equal(batch147Data.blocked_candidate_count,10);
assert.equal(batch147Data.fallback_source_attempted,true);
assert.equal(batch147Data.crawler_retry,false);
assert.equal(batch147Data.access_control_bypassed,false);
assert.equal(batch147Data.full_text_copied,false);
assert.equal(batch147Data.scan_only_verification_used,false);
assert.equal(new Set(batch147Data.records.map(r=>String(r.aid))).size,8);
assert.equal(new Set(batch147Data.records.map(r=>r.evidence_family_id)).size,8);
assert.equal(new Set(batch147Data.records.map(r=>r.source_url)).size,8);
for(const r of batch147Data.records){
 assert.equal(r.status,'Parsed');
 assert.equal(r.pipeline_status,'Parsed');
 assert.equal(r.canonical_status,'Parsed');
 assert.equal(r.has_content_evidence,true);
 assert.equal(r.independent_witness,false);
 assert.equal(r.translation_of_evidence_family_id,r.evidence_family_id);
 assert(r.translation_status&&r.translation_status.includes('non-independent'));
 assert.equal(r.proposition_origin,'source_grounded_paraphrase');
 assert.equal(r.proposition_verbatim,false);
 assert.equal(r.proposition_verification,'source_text_inspected');
 assert(r.proposition_source_locator&&r.provenance&&r.verification_scope);
 assert.equal(r.context_status,'partial');
 assert.equal(r.response_propositions.length,1);
 assert.equal(r.response_proposition_locators.length,1);
 const found=idx.entries.filter(e=>sourceAID(e)===String(r.aid));
 assert.equal(found.length,1,'batch-147 AID '+r.aid+' must have one canonical identity after reconciliation');
 assert.equal(found[0].canonical_file,batch147Path);
 assert.equal(found[0].status,'Parsed');
 assert.equal(found[0].independent_witness,false);
}
assert(batch147Data.existing_identity_updates.some(x=>String(x.aid)==='4304431'&&x.existing_propositions_before===3&&x.total_propositions_after===4));
assert(['reconciled','reconciled_with_variance'].includes(batch147Data.reconciliation_status),'batch 147 must be reconciled before readiness is reported');
assert.equal(batch147Data.deduplication_check.full_index_scan_available,true);
assert.equal(batch147Data.deduplication_check.full_index_scan_pending_reconciliation,false);
assert.deepEqual(batch147Data.deduplication_check.canonical_identity_collisions,[]);
assert.deepEqual(batch147Data.deduplication_check.missing_canonical_identities,[]);
assert.equal(batch147Data.deduplication_check.all_target_identities_answer_eligible,true);
assert.deepEqual(readinessMetrics(batch147Data.metrics_actual_after),readinessMetrics(metrics));

const batch147Question='מה מתועד ביחידות על שלום, אחדות והמשך השליחות לאחר המפגש?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,batch147Question,{mode});
 assert(m.answerable,mode+': eight distinct Yechidus event families must support a bounded peace/unity/mission comparison');
 assert.equal(m.synthesis?.topic,'yechidus_peace_and_mission');
 assert.equal(m.synthesis?.attribution,'system_synthesis_not_rebbe_quote');
 assert.equal(m.sources.length,8);
 assert.deepEqual(m.sources.map(e=>String(e.aid)),batch147Aids);
 assert.equal(new Set(m.sources.map(e=>e.evidence_family_id)).size,8);
 assert(m.sources.every(e=>e.independent_witness===false));
 assert.equal(m.synthesis.claims.length,8);
 assert.equal(m.synthesis.evidence_family_ids.length,8);
 assert.equal(m.synthesis.independent_evidence_family_ids.length,0);
 assert(m.claims.every(c=>c.source_numbers.length===1&&c.source_locators.length===1&&c.source_locators[0].locator));
 assert(m.synthesis.claims.every(c=>c.source_numbers.length===1&&c.source_locators.length===1&&c.witnesses?.length===1&&c.witnesses[0].independent_witness===false));
 assert.equal(m.pattern_synthesis_integrity.valid,true);
 assert(m.citation_entailment.every(x=>x.valid));
 assert(m.context_boundary.every(x=>x.valid));
 if(mode==='researcher'){
  assert.equal(m.research.depth,'deep');
  assert.equal(m.research.synthesis_scope,'cross_family_derived_case_comparison');
  assert.equal(m.research.evidence_families,8);
  assert.equal(m.research.independent_evidence_families,0);
  assert.equal(m.research.evidence_integrity.independent_witnesses,0);
  assert.equal(m.research.evidence_integrity.derived_non_independent,8);
  assert.equal(m.research.evidence_witnesses.length,8);
  assert(m.research.evidence_witnesses.every(w=>w.independent_witness===false));
  assert.equal(m.research.claim_source_map.length,8);
  assert(m.research.claim_source_map.every(c=>c.source_numbers.length===1&&c.source_locators.length===1&&c.source_locators[0].locator));
  assert.equal(m.research.pattern_synthesis_integrity.valid,true);
 }else assert.equal(m.research,undefined);
}


const batch149Path='data/items/content-research-batch-149-2026-11-18.json';
const batch149Data=JSON.parse(await readFile(new URL(batch149Path,root),'utf8'));
const batch150Path='data/items/content-research-batch-150-2026-11-21.json';
const batch150Data=JSON.parse(await readFile(new URL(batch150Path,root),'utf8'));
const batch149Aids=['2988940','4385713','5959970','4280106','3008908','2989018','2989044','5989796'];
assert.equal(batch149Data.records.length,8);assert.deepEqual(batch149Data.new_aids.map(String),batch149Aids);
assert.equal(batch149Data.new_source_identities,8);assert.equal(batch149Data.existing_identities_enriched,1);
assert.equal(batch149Data.new_response_propositions,14);assert.equal(batch149Data.existing_response_propositions_added,1);
assert.equal(batch149Data.total_new_paraphrase_entries,15);assert.equal(batch149Data.source_bodies_inspected,9);
assert.equal(batch149Data.source_body_pages_opened,12);assert.equal(batch149Data.reviewed_item_count,22);
assert.equal(batch149Data.blocked_candidate_count,10);assert.equal(batch149Data.fallback_source_attempted,true);
assert.equal(batch149Data.crawler_retry,false);assert.equal(batch149Data.access_control_bypassed,false);
assert.equal(batch149Data.full_text_copied,false);assert.equal(batch149Data.scan_only_verification_used,false);
assert.equal(batch149Data.translations_counted_as_independent_witnesses,0);
assert.equal(new Set(batch149Data.records.map(r=>String(r.aid))).size,8);
assert.equal(new Set(batch149Data.records.map(r=>r.evidence_family_id)).size,8);
assert.equal(new Set(batch149Data.records.map(r=>r.source_url)).size,8);
for(const r of batch149Data.records){
 assert.equal(r.status,'Parsed');assert.equal(r.pipeline_status,'Parsed');assert.equal(r.canonical_status,'Parsed');
 assert.equal(r.has_content_evidence,true);assert.equal(r.independent_witness,true);assert.equal(r.translation_of_evidence_family_id,null);
 assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);
 assert.equal(r.proposition_verification,'source_text_inspected');assert(r.proposition_source_locator&&r.provenance&&r.verification_scope);
 assert.equal(r.context_status,'partial');assert(r.response_propositions.length>=1);
 assert.equal(r.response_propositions.length,r.response_proposition_locators.length);assert(r.response_proposition_locators.every(Boolean));
 const found=idx.entries.filter(e=>sourceAID(e)===String(r.aid));
 assert.equal(found.length,1,'batch-149 AID '+r.aid+' must have one canonical identity after reconciliation');
 assert.equal(found[0].canonical_file,batch149Path);assert.equal(found[0].status,'Parsed');assert.equal(found[0].has_content_evidence,true);
 assert(!queue.records.some(q=>String(q.aid||'')===String(r.aid)),'batch-149 AID '+r.aid+' must not remain in the review queue');
}
assert(['reconciled','reconciled_with_variance'].includes(batch149Data.reconciliation_status),'batch149 must be reconciled before readiness is reported');
assert.equal(batch149Data.deduplication_check.full_index_scan_available,true);
assert.equal(batch149Data.deduplication_check.full_index_scan_pending_reconciliation,false);
assert.deepEqual(batch149Data.deduplication_check.canonical_identity_collisions,[]);
assert.deepEqual(batch149Data.deduplication_check.missing_canonical_identities,[]);
assert.equal(batch149Data.deduplication_check.all_target_identities_answer_eligible,true);
assert.deepEqual(readinessMetrics(batch149Data.metrics_actual_after),readinessMetrics(batch150Data.metrics_actual_before));
const enriched4385534=idx.entries.find(e=>sourceAID(e)==='4385534');
assert(enriched4385534&&enriched4385534.canonical_file==='data/items/content-research-batch-142-2026-11-17.json');
assert.equal(enriched4385534.evidence_family_id,'sicha-5726-19-kislev-vayeshev-aid4385534');
assert.equal(enriched4385534.response_propositions.length,2);
assert(enriched4385534.response_proposition_locators.some(x=>x.includes('243–260')));
const practiceQuestion='מה עולה מארבע שיחות על הקשר בין לימוד חסידות, מעשה בפועל, והפצת המעיינות לאורך זמן?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,practiceQuestion,{mode});
 assert(m.answerable,mode+': four original-Hebrew Sicha families must support the bounded practical-Chassidus synthesis');
 assert.equal(m.synthesis?.topic,'chassidic_learning_practical_action');
 assert.equal(m.synthesis?.attribution,'system_synthesis_not_rebbe_quote');
 assert.equal(m.sources.length,4);
 assert.deepEqual(m.sources.map(e=>String(e.aid)),['2988940','2989044','4280106','4385534']);
 assert.equal(new Set(m.sources.map(e=>e.evidence_family_id)).size,4);
 assert.equal(m.claims.length,4);
 assert(m.claims.every(c=>c.source_numbers.length===1&&c.source_locators.length===1&&c.source_locators[0].locator&&c.witnesses?.length===1));
 assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));
 assert.equal(m.pattern_synthesis_integrity.valid,true);
 if(mode==='researcher'){
  assert.equal(m.research.depth,'deep');assert.equal(m.research.synthesis_scope,'cross_family');
  assert.equal(m.research.evidence_families,4);assert.equal(m.research.independent_evidence_families,4);
  assert.equal(m.research.evidence_integrity.independent_witnesses,4);assert.equal(m.research.evidence_integrity.derived_non_independent,0);
  assert.equal(m.research.evidence_map.length,4);assert.equal(m.research.claim_source_map.length,4);
  assert(m.research.claim_source_map.every(c=>c.source_locators.length===1&&c.source_locators[0].locator));
 }else assert.equal(m.research,undefined);
}


const batch150Aids=['4872325','4994205','4730828','5287503','4928852','5357433','4929082','5100419','5357411','5357099'];
assert.equal(batch150Data.records.length,10);assert.deepEqual(batch150Data.new_aids.map(String),batch150Aids);
assert.equal(batch150Data.new_source_identities,10);assert.equal(batch150Data.existing_identities_enriched,1);
assert.equal(batch150Data.new_response_propositions,10);assert.equal(batch150Data.existing_response_propositions_added,1);
assert.equal(batch150Data.total_new_paraphrase_entries,11);assert.equal(batch150Data.source_bodies_inspected,11);
assert.equal(batch150Data.source_body_pages_opened,11);assert.equal(batch150Data.source_body_review.length,11);
assert.equal(batch150Data.blocked_candidate_count,1);assert.equal(batch150Data.fallback_source_attempted,true);
assert.equal(batch150Data.crawler_retry,false);assert.equal(batch150Data.access_control_bypassed,false);
assert.equal(batch150Data.full_text_copied,false);assert.equal(batch150Data.scan_only_verification_used,false);
assert.equal(batch150Data.translations_counted_as_independent_witnesses,0);
assert.equal(batch150Data.content_verified_unique_sources_added,0);
assert.equal(new Set(batch150Data.records.map(r=>String(r.aid))).size,10);
assert.equal(new Set(batch150Data.records.map(r=>r.evidence_family_id)).size,10);
assert.equal(new Set(batch150Data.records.map(r=>r.source_url)).size,10);
for(const r of batch150Data.records){
 assert.equal(r.status,'Parsed');assert.equal(r.pipeline_status,'Parsed');assert.equal(r.canonical_status,'Parsed');
 assert.equal(r.type,'letter');assert.equal(r.source_class,'Correspondence');
 assert.equal(r.language,'Hebrew');assert.equal(r.original_language,'Hebrew');
 assert.equal(r.has_content_evidence,true);assert.equal(r.independent_witness,true);assert.equal(r.translation_of_evidence_family_id,null);
 assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);
 assert.equal(r.proposition_verification,'source_text_inspected');assert(r.proposition_source_locator&&r.provenance&&r.verification_scope);
 assert.equal(r.context_status,'partial');assert.equal(r.response_propositions.length,1);assert.equal(r.response_proposition_locators.length,1);
 assert(r.response_proposition_locators[0].includes('AID '+r.aid));assert.equal(r.canonical_file,batch150Path);
 const found=idx.entries.filter(e=>sourceAID(e)===String(r.aid));
 assert.equal(found.length,1,'batch150 AID '+r.aid+' must have one canonical identity after reconciliation');
 assert.equal(found[0].canonical_file,batch150Path);assert.equal(found[0].status,'Parsed');assert.equal(found[0].has_content_evidence,true);
 assert.equal(found[0].response_propositions.length,1);assert.equal(found[0].response_proposition_locators.length,1);
 assert(!queue.records.some(q=>String(q.aid||'')===String(r.aid)),'batch150 AID '+r.aid+' must not remain in the review queue');
}
assert(['reconciled','reconciled_with_variance'].includes(batch150Data.reconciliation_status),'batch150 must be reconciled before readiness is reported');
assert(['reconciled','reconciled_with_variance'].includes(batch149Data.reconciliation_status),'batch149 must be reconciled before readiness is reported');
assert.equal(batch150Data.deduplication_check.full_index_scan_available,true);
assert.equal(batch150Data.deduplication_check.full_index_scan_pending_reconciliation,false);
assert.deepEqual(batch150Data.deduplication_check.canonical_identity_collisions,[]);
assert.deepEqual(batch150Data.deduplication_check.missing_canonical_identities,[]);
assert.equal(batch150Data.deduplication_check.all_target_identities_answer_eligible,true);
assert.deepEqual(readinessMetrics(batch150Data.metrics_actual_after),readinessMetrics(metrics));
assert.deepEqual(readinessMetrics(batch149Data.metrics_actual_after),readinessMetrics(batch150Data.metrics_actual_before));
const enriched2988940=idx.entries.find(e=>sourceAID(e)==='2988940');
assert(enriched2988940&&enriched2988940.canonical_file===batch149Path);
assert.equal(enriched2988940.evidence_family_id,'sicha-5716-19-kislev-shabbat-vayeshev-aid2988940');
assert.equal(enriched2988940.response_propositions.length,2);
assert.equal(enriched2988940.response_proposition_locators.length,2);
assert(enriched2988940.response_proposition_locators.some(x=>x.includes('סעיף ז, שורות 226–231')));
assert(batch150Data.existing_identity_updates.some(x=>String(x.aid)==='2988940'&&x.canonical_file===batch149Path&&x.existing_propositions_before===1&&x.total_propositions_after===2));

const institutionalEducationQuestion='מה מלמדים מכתבי הרבי על חינוך, תמיכה במוסדות והפצת תורה והשפעה על הזולת?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,institutionalEducationQuestion,{mode});
 assert(m.answerable,mode+': ten original-Hebrew correspondence families must support the bounded education/institution synthesis');
 assert.equal(m.synthesis?.topic,'institutional_education_and_public_influence');
 assert.equal(m.synthesis?.attribution,'system_synthesis_not_rebbe_quote');
 assert.equal(m.sources.length,10);assert.deepEqual(m.sources.map(e=>String(e.aid)),batch150Aids);
 assert.equal(new Set(m.sources.map(e=>e.evidence_family_id)).size,10);
 assert.equal(m.claims.length,10);
 assert(m.claims.every(c=>c.source_numbers.length===1&&c.source_locators.length===1&&c.source_locators[0].locator&&c.witnesses?.length===1));
 assert(m.citation_entailment.every(x=>x.valid));assert(m.context_boundary.every(x=>x.valid));
 assert.equal(m.pattern_synthesis_integrity.valid,true);
 if(mode==='researcher'){
  assert.equal(m.research.depth,'deep');assert.equal(m.research.synthesis_scope,'cross_family_derived_case_comparison');
  assert.equal(m.research.evidence_families,10);assert.equal(m.research.independent_evidence_families,10);
  assert.equal(m.research.evidence_integrity.independent_witnesses,10);assert.equal(m.research.evidence_integrity.derived_non_independent,0);
  assert.equal(m.research.evidence_map.length,10);assert.equal(m.research.claim_source_map.length,10);
  assert(m.research.claim_source_map.every(c=>c.source_locators.length===1&&c.source_locators[0].locator));
 }else assert.equal(m.research,undefined);
}


// Batch 151: ten-event Yechidus synthesis, including three new families and six in-place enrichments.
const batch151Path='data/items/content-research-batch-151-2026-11-21.json';
const batch151Data=JSON.parse(await readFile(new URL(batch151Path,root),'utf8'));
const batch151Aids=['2505782','2505723','2505757'];
const batch151SynthesisAids=['2498908','2515477','2515046','2487225','2505782','2505723','2505757','2511676','2511619','2512367'];
assert.equal(batch151Data.records.length,3);
assert.deepEqual(batch151Data.new_aids.map(String),batch151Aids);
assert.equal(batch151Data.new_source_identities,3);
assert.equal(batch151Data.existing_identities_enriched,6);
assert.equal(batch151Data.existing_identities_rechecked,2);
assert.equal(batch151Data.new_response_propositions,3);
assert.equal(batch151Data.existing_response_propositions_added,6);
assert.equal(batch151Data.total_new_paraphrase_entries,9);
assert.equal(batch151Data.source_bodies_inspected,11);
assert.equal(batch151Data.source_body_pages_opened,11);
assert.equal(batch151Data.answer_eligible_source_families_added,3);
assert.equal(batch151Data.independent_witnesses_added,0);
assert.equal(batch151Data.non_independent_presentations_added,3);
assert.equal(batch151Data.content_verified_unique_sources_added,0);
assert.equal(batch151Data.translations_counted_as_independent_witnesses,0);
assert.equal(batch151Data.blocked_candidate_count,1);
assert.equal(batch151Data.fallback_source_attempted,true);
assert.equal(batch151Data.crawler_retry,false);
assert.equal(batch151Data.access_control_bypassed,false);
assert.equal(batch151Data.full_text_copied,false);
assert.equal(batch151Data.scan_only_verification_used,false);
assert.equal(batch151Data.source_body_review.length,11);
assert.equal(batch151Data.existing_identity_updates.length,6);
assert.equal(batch151Data.existing_identity_rechecks.length,2);
assert.equal(batch151Data.deduplication_check.full_index_scan_pending_reconciliation,true);
assert.deepEqual(batch151Data.retrieval_synthesis.source_aids.map(String),batch151SynthesisAids);
assert(batch151Data.records.every(r=>r.proposition_origin==='source_grounded_paraphrase'&&r.proposition_verbatim===false&&r.proposition_verification==='source_text_inspected'&&r.proposition_source_locator&&r.independent_witness===false&&r.status==='Parsed'));
for(const aid of batch151SynthesisAids){
 const e=idx.entries.find(x=>String(x.aid)===aid);
 assert(e,'batch151 Yechidus identity must be in the canonical index: '+aid);
 assert.equal(e.independent_witness,false,'translated Yechidus must not count as an independent witness: '+aid);
 assert(e.response_propositions?.length>0,'Yechidus identity must carry inspected content: '+aid);
}
for(const aid of ['2487225','2515477','2515046','2511676','2511619','2512367']){
 const e=idx.entries.find(x=>String(x.aid)===aid);
 assert(e,'enriched Yechidus identity must remain canonical: '+aid);
 assert((e.response_proposition_locators||[]).length>=(aid==='2487225'?2:3),'enriched identity must retain claim-level locators: '+aid);
}
const batch151Question='מה מלמדות שיחות היחידות על אחדות, שליחות והמשך הפעולה לאחר המפגש?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,batch151Question,{mode});
 assert(m.answerable,mode+': ten distinct Yechidus event families must support a bounded unity/mission comparison');
 assert.equal(m.synthesis?.topic,'yechidus_unity_and_mission');
 assert.equal(m.synthesis?.attribution,'system_synthesis_not_rebbe_quote');
 assert.equal(m.sources.length,10);
 assert.deepEqual(m.sources.map(e=>String(e.aid)),batch151SynthesisAids);
 assert.equal(new Set(m.sources.map(e=>e.evidence_family_id)).size,10);
 assert(m.sources.every(e=>e.independent_witness===false));
 assert.equal(m.synthesis.claims.length,10);
 assert.equal(m.synthesis.evidence_family_ids.length,10);
 assert.equal(m.synthesis.independent_evidence_family_ids.length,0);
 assert(m.claims.every(c=>c.source_numbers.length===1&&c.source_locators.length===1&&c.source_locators[0].locator));
 assert(m.synthesis.claims.every(c=>c.source_numbers.length===1&&c.source_locators.length===1&&c.witnesses?.length===1&&c.witnesses[0].independent_witness===false));
 assert.equal(m.pattern_synthesis_integrity.valid,true);
 assert(m.citation_entailment.every(x=>x.valid));
 assert(m.context_boundary.every(x=>x.valid));
 if(mode==='researcher'){
  assert.equal(m.research.depth,'deep');
  assert.equal(m.research.synthesis_scope,'cross_family_derived_case_comparison');
  assert.equal(m.research.evidence_families,10);
  assert.equal(m.research.independent_evidence_families,0);
  assert.equal(m.research.evidence_integrity.independent_witnesses,0);
  assert.equal(m.research.evidence_integrity.derived_non_independent,10);
  assert.equal(m.research.evidence_witnesses.length,10);
  assert(m.research.evidence_witnesses.every(w=>w.independent_witness===false));
  assert.equal(m.research.claim_source_map.length,10);
  assert(m.research.claim_source_map.every(c=>c.source_numbers.length===1&&c.source_locators.length===1&&c.source_locators[0].locator));
  assert.equal(m.research.pattern_synthesis_integrity.valid,true);
 }else assert.equal(m.research,undefined);
}

 
// Batch 152: eight distinct first-person memoir event families, one shared witness group, and one in-place translation enrichment.
const batch152Path='data/items/content-research-batch-152-2026-11-21.json';
const batch152Data=JSON.parse(await readFile(new URL(batch152Path,root),'utf8'));
const batch152Aids=['260062','2593500','1026221','260037','2593531','260093','2593601','2593412'];
assert.equal(batch152Data.records.length,8);assert.deepEqual(batch152Data.new_aids.map(String),batch152Aids);
assert.equal(batch152Data.reviewed_item_count,9);assert.equal(batch152Data.source_bodies_inspected,9);assert.equal(batch152Data.source_body_pages_opened,9);
assert.equal(batch152Data.new_source_identities,8);assert.equal(batch152Data.existing_identities_enriched,1);assert.equal(batch152Data.existing_identities_rechecked,0);
assert.equal(batch152Data.new_response_propositions,8);assert.equal(batch152Data.existing_response_propositions_added,2);assert.equal(batch152Data.total_new_paraphrase_entries,10);
assert.equal(batch152Data.answer_eligible_source_families_added,8);assert.equal(batch152Data.independent_witnesses_added,1);assert.equal(batch152Data.independent_witness_groups_added,1);assert.equal(batch152Data.same_author_testimony_records,8);
assert.equal(batch152Data.content_verified_unique_sources_added,0);assert.equal(batch152Data.translations_counted_as_independent_witnesses,0);assert.equal(batch152Data.blocked_candidate_count,2);
assert.equal(batch152Data.fallback_source_attempted,true);assert.equal(batch152Data.crawler_retry,false);assert.equal(batch152Data.access_control_bypassed,false);assert.equal(batch152Data.full_text_copied,false);assert.equal(batch152Data.scan_only_verification_used,false);
assert.equal(batch152Data.source_body_review.length,8);assert.equal(batch152Data.existing_identity_updates.length,1);
assert.equal(batch152Data.deduplication_check.full_index_scan_available,false);assert.equal(batch152Data.deduplication_check.full_index_scan_pending_reconciliation,true);assert.equal(batch152Data.deduplication_check.review_queue_matches,0);
assert.equal(batch152Data.reconciliation_status,'pending_reconciliation');assert.equal(batch152Data.metrics_actual_after,null);
assert.equal(new Set(batch152Data.records.map(r=>r.aid)).size,8);assert.equal(new Set(batch152Data.records.map(r=>r.source_url)).size,8);assert.equal(new Set(batch152Data.records.map(r=>r.evidence_family_id)).size,8);
assert(batch152Data.records.every(r=>r.source_class==='Testimonies'&&r.type==='testimony'&&r.status==='Parsed'&&r.pipeline_status==='Parsed'&&r.canonical_status==='Parsed'&&r.context_status==='partial'&&r.has_content_evidence===true));
assert(batch152Data.records.every(r=>r.proposition_origin==='source_grounded_paraphrase'&&r.proposition_verbatim===false&&r.proposition_verification==='source_text_inspected'&&r.proposition_source_locator&&r.response_propositions.length===1&&r.response_proposition_locators.length===1));
assert(batch152Data.records.every(r=>r.witness_group_id==='zalmon-jaffe-memoir-series'&&r.independent_witness===true&&r.provenance?.source_url===r.source_url&&r.verification_scope&&r.access?.rights_status==='copyrighted-link-only'));
assert(batch152Data.records.slice(1).every(r=>r.relations.some(x=>x.type==='researcher/model_link'&&x.target_id==='yechidus-testimony-aid260062')));
for(const aid of batch152Aids){const e=idx.entries.find(x=>String(x.aid)===aid);assert(e,'batch152 testimony must be in canonical index: '+aid);assert.equal(e.witness_group_id,'zalmon-jaffe-memoir-series','search index must preserve shared witness group: '+aid);}
const enriched2505782=idx.entries.find(e=>sourceAID(e)==='2505782');
assert(enriched2505782&&enriched2505782.canonical_file===batch151Path);assert.equal(enriched2505782.evidence_family_id,'yechidus-event-aid2505782');assert.equal(enriched2505782.independent_witness,false);
assert.equal(enriched2505782.response_propositions.length,3);assert.equal(enriched2505782.response_proposition_locators.length,3);
assert(enriched2505782.response_proposition_locators.some(x=>x.includes('body lines 261–265')));assert(enriched2505782.response_proposition_locators.some(x=>x.includes('body lines 268–271')));
assert(batch152Data.existing_identity_updates.some(x=>String(x.aid)==='2505782'&&x.canonical_file===batch151Path&&x.propositions_added===2&&x.total_propositions_after===3));
const jaffeQuestion='מה אפשר ללמוד מעדויות היחידות של זלמן יפה על הדרכה אישית, חינוך, צדקה וניהול עומס?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,jaffeQuestion,{mode});
 assert(m.answerable,mode+': eight inspected Jaffe memoir event families must support a bounded case comparison');
 assert.equal(m.synthesis?.topic,'jaffe_memoir_practical_guidance');assert.equal(m.synthesis?.attribution,'system_synthesis_not_rebbe_quote');
 assert.equal(m.sources.length,8);assert.deepEqual(m.sources.map(e=>String(e.aid)),batch152Aids);assert.equal(new Set(m.sources.map(e=>e.evidence_family_id)).size,8);
 assert.deepEqual(m.synthesis.independent_evidence_family_ids,[]);assert.deepEqual(m.synthesis.independent_witness_group_ids,['zalmon-jaffe-memoir-series']);
 assert.equal(m.claims.length,8);assert(m.claims.every(c=>c.source_numbers.length===1&&c.source_locators.length===1&&c.source_locators[0].locator&&c.witnesses?.length===1&&c.witnesses[0].witness_group_id==='zalmon-jaffe-memoir-series'));
 assert(m.citation_entailment.every(x=>x.valid));assert(m.context_boundary.every(x=>x.valid));assert.equal(m.pattern_synthesis_integrity.valid,true);
 if(mode==='researcher'){
  assert.equal(m.research.depth,'deep');assert.equal(m.research.synthesis_scope,'cross_family_derived_case_comparison');assert.equal(m.research.evidence_families,8);
  assert.equal(m.research.independent_evidence_families,1);assert.equal(m.research.independent_witness_groups,1);assert.equal(m.research.evidence_integrity.independent_witnesses,1);
  assert.equal(m.research.evidence_integrity.same_witness_group_additional_records,7);assert.equal(m.research.evidence_integrity.derived_non_independent,0);
  assert.deepEqual(m.research.witness_group_ids,['zalmon-jaffe-memoir-series']);assert.equal(m.research.evidence_map.length,8);assert.equal(m.research.claim_source_map.length,8);
  assert(m.research.claim_source_map.every(c=>c.source_numbers.length===1&&c.source_locators.length===1&&c.source_locators[0].locator));
 }else assert.equal(m.research,undefined);
}

 
// Batch 153: twelve new correspondence identities, one in-place enrichment, and 13 claim-local sources.
const batch153Path='data/items/content-research-batch-153-2026-11-21.json';
const batch153Data=JSON.parse(await readFile(new URL(batch153Path,root),'utf8'));
const batch153Aids=['1915051','4421667','2231227','1916313','1897847','1277','4264343','2216519','1950150','2022585','2201421','821778'];
const batch153SynthesisAids=[...batch153Aids,'2022582'];
assert.equal(batch153Data.records.length,12);assert.deepEqual(batch153Data.new_aids.map(String),batch153Aids);
assert.equal(batch153Data.reviewed_item_count,15);assert.equal(batch153Data.source_bodies_inspected,13);assert.equal(batch153Data.source_body_pages_opened,13);
assert.equal(batch153Data.new_source_identities,12);assert.equal(batch153Data.existing_identities_enriched,1);assert.equal(batch153Data.existing_identities_rechecked,0);
assert.equal(batch153Data.new_response_propositions,24);assert.equal(batch153Data.existing_response_propositions_added,1);assert.equal(batch153Data.total_new_paraphrase_entries,25);
assert.equal(batch153Data.answer_eligible_source_families_added,12);assert.equal(batch153Data.independent_witnesses_added,9);assert.equal(batch153Data.independent_witness_groups_added,9);assert.equal(batch153Data.non_independent_presentations_added,3);
assert.equal(batch153Data.content_verified_unique_sources_added,0);assert.equal(batch153Data.translations_counted_as_independent_witnesses,0);assert.equal(batch153Data.blocked_candidate_count,2);
assert.equal(batch153Data.fallback_source_attempted,true);assert.equal(batch153Data.fallback_source_results.accessible_item_level_bodies,12);assert.equal(batch153Data.fallback_source_results.body_text_inspected,true);
assert.equal(batch153Data.crawler_retry,false);assert.equal(batch153Data.access_control_bypassed,false);assert.equal(batch153Data.full_text_copied,false);assert.equal(batch153Data.scan_only_verification_used,false);
assert.equal(batch153Data.source_body_review.length,12);assert(batch153Data.source_body_review.every(x=>x.body_text_inspected===true&&x.source_grounded_paraphrase_added===true&&x.context_status==='partial'));
assert.equal(batch153Data.existing_identity_updates.length,1);assert.equal(batch153Data.existing_identity_updates[0].canonical_file,'data/items/chabad-letter-2022582.json');assert.equal(batch153Data.existing_identity_updates[0].propositions_added,1);assert.equal(batch153Data.existing_identity_updates[0].total_propositions_after,5);
assert.deepEqual(batch153Data.retrieval_synthesis.source_aids.map(String),batch153SynthesisAids);
assert.equal(batch153Data.retrieval_synthesis.source_count,13);assert.equal(batch153Data.retrieval_synthesis.distinct_evidence_families,13);assert.equal(batch153Data.retrieval_synthesis.independent_evidence_families,10);assert.equal(batch153Data.retrieval_synthesis.independent_witness_groups,10);assert.equal(batch153Data.retrieval_synthesis.derived_non_independent_presentations,3);assert.equal(batch153Data.retrieval_synthesis.claim_count,13);assert.equal(batch153Data.retrieval_synthesis.claim_level_source_locators,13);
assert(batch153Data.records.every(r=>r.status==='Parsed'&&r.pipeline_status==='Parsed'&&r.canonical_status==='Parsed'&&r.context_status==='partial'&&r.has_content_evidence===true));
assert(batch153Data.records.every(r=>r.proposition_origin==='source_grounded_paraphrase'&&r.proposition_verbatim===false&&r.proposition_verification==='source_text_inspected'&&r.response_propositions.length===r.response_proposition_locators.length&&r.response_proposition_locators.every(Boolean)));
assert.equal(batch153Data.records.filter(r=>r.independent_witness===true).length,9);
assert.equal(batch153Data.records.filter(r=>r.independent_witness===false).length,3);
assert.deepEqual(batch153Data.records.filter(r=>r.independent_witness===false).map(r=>String(r.aid)).sort(),['1915051','2201421','4264343']);
assert(batch153Data.blocked_candidates.some(x=>String(x.aid)==='4666220'));
assert(batch153Data.blocked_candidates.some(x=>String(x.aid)==='2487225'));
assert(batch153Data.blocked_candidates.every(x=>x.status==='public_reader_body_unavailable_via_web_tool'));
assert.equal(batch153Data.reconciliation_status,'reconciled_with_variance');
assert.deepEqual(readinessMetrics(batch153Data.metrics_actual_after),{answer_eligible_unique_sources:1537,content_verified_unique_sources:854,answer_eligible_propositions:3893});
assert.deepEqual(batch153Data.reconciliation_variance,{answer_eligible_unique_sources:1,content_verified_unique_sources:0,answer_eligible_propositions:0});
assert.equal(batch153Data.deduplication_check.full_index_scan_available,true);
assert.equal(batch153Data.deduplication_check.all_target_identities_answer_eligible,true);
assert.deepEqual(batch153Data.deduplication_check.canonical_identity_collisions,[]);
assert.deepEqual(batch153Data.deduplication_check.missing_canonical_identities,[]);
assert.equal(batch153Data.deduplication_check.post_addition_canonical_scan_pending,false);
const enriched2022582=idx.entries.find(e=>sourceAID(e)==='2022582');
assert(enriched2022582&&enriched2022582.canonical_file==='data/items/chabad-letter-2022582.json');
assert.equal(enriched2022582.status,'Verified');assert.equal(enriched2022582.evidence_family_id,'chabad-letter-2022582');
assert.equal(enriched2022582.response_propositions.length,5);assert.equal(enriched2022582.response_proposition_locators.length,5);
assert(enriched2022582.response_proposition_locators[4].includes('body lines 274–275'));
assert(batch153Data.existing_identity_updates.some(x=>String(x.aid)==='2022582'&&x.propositions_added===1&&x.total_propositions_after===5&&x.status_after==='Verified'));
for(const aid of batch153Aids){
 const e=idx.entries.find(x=>sourceAID(x)===aid);
 assert(e,'batch153 correspondence identity must be in the canonical index: '+aid);
 assert.equal(e.status,'Parsed');assert.equal(e.context_status,'partial');assert.equal(e.has_content_evidence,true);
}
const practicalGuidanceQuestion='מה אפשר ללמוד מן האיגרות על חינוך, תקשורת עם פונים, תמיכה במוסדות, בריאות וסיוע מעשי? הצג כל טענה עם מקור ומיקום גוף.';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,practicalGuidanceQuestion,{mode});
 assert(m.answerable,mode+': thirteen distinct correspondence families must support bounded practical-guidance synthesis');
 assert.equal(m.synthesis?.topic,'cross_family_practical_guidance_letters');assert.equal(m.synthesis?.attribution,'system_synthesis_not_rebbe_quote');
 assert.equal(m.sources.length,13);assert.deepEqual(m.sources.map(e=>String(e.aid)),batch153SynthesisAids);
 assert.equal(new Set(m.sources.map(e=>e.evidence_family_id)).size,13);
 assert.equal(m.synthesis.claims.length,13);assert.equal(m.synthesis.evidence_family_ids.length,13);assert.equal(m.synthesis.independent_evidence_family_ids.length,10);
 assert(m.claims.every(c=>c.source_numbers.length===1&&c.source_locators.length===1&&c.source_locators[0].locator&&c.witnesses?.length===1));
 assert(m.synthesis.claims.every(c=>c.source_numbers.length===1&&c.source_locators.length===1&&c.source_locators[0].locator&&c.witnesses?.length===1));
 assert(m.citation_entailment.every(x=>x.valid));assert(m.context_boundary.every(x=>x.valid));assert.equal(m.pattern_synthesis_integrity.valid,true);
 if(mode==='researcher'){
  assert.equal(m.research.depth,'deep');assert.equal(m.research.synthesis_scope,'cross_family_derived_case_comparison');
  assert.equal(m.research.evidence_families,13);assert.equal(m.research.independent_evidence_families,10);
  assert.equal(m.research.evidence_integrity.independent_witnesses,10);assert.equal(m.research.evidence_integrity.derived_non_independent,3);
  assert.equal(m.research.evidence_witnesses.length,13);assert.equal(m.research.evidence_witnesses.filter(w=>w.independent_witness===false).length,3);
  assert.equal(m.research.evidence_map.length,13);assert.equal(m.research.claim_source_map.length,13);
  assert(m.research.claim_source_map.every(c=>c.source_numbers.length===1&&c.source_locators.length===1&&c.source_locators[0].locator));
  assert.equal(m.research.pattern_synthesis_integrity.valid,true);
 }else assert.equal(m.research,undefined);
}


// Batch 154: twelve directly inspected Hebrew/Yiddish correspondence pages.
// Each proposition is a non-verbatim, source-grounded paraphrase with its own locator.
const batch154Path='data/items/content-research-batch-154-2026-11-21.json';
const batch154Data=JSON.parse(await readFile(new URL(batch154Path,root),'utf8'));
assert.equal(batch154Data.records.length,12);
assert.equal(new Set(batch154Data.records.map(r=>String(r.aid))).size,12);
assert.equal(new Set(batch154Data.records.map(r=>r.evidence_family_id)).size,12);
assert.equal(batch154Data.new_source_identities,12);
assert.equal(batch154Data.new_response_propositions,24);
assert.equal(batch154Data.blocked_candidate_count,8);
assert.equal(batch154Data.fallback_source_attempted,true);
assert.equal(batch154Data.crawler_retry,false);
assert.equal(batch154Data.access_control_bypassed,false);
assert.equal(batch154Data.content_verified_unique_sources_added,0);
assert.equal(batch154Data.records.filter(r=>r.independent_witness===false).length,12);
for(const r of batch154Data.records){
 assert.equal(r.status,'Parsed');
 assert.equal(r.proposition_origin,'source_grounded_paraphrase');
 assert.equal(r.proposition_verbatim,false);
 assert.equal(r.proposition_verification,'source_text_inspected');
 assert(r.proposition_source_locator&&r.verification_scope&&r.provenance);
 assert.equal(r.response_propositions.length,2);
 assert.equal(r.response_proposition_locators.length,2);
 assert(r.response_proposition_locators.every(Boolean));
 const entry=idx.entries.find(e=>sourceAID(e)===String(r.aid)&&e.evidence_family_id===r.evidence_family_id);
 assert(entry,'batch-154 AID '+r.aid+' must have a canonical search-index entry');
 assert.equal(entry.answer_eligible,true,'batch-154 AID '+r.aid+' must be answer eligible from inspected propositions');
 assert.equal(entry.proposition_origin,'source_grounded_paraphrase');
 assert.equal(entry.proposition_verbatim,false);
 assert.equal(entry.proposition_verification,'source_text_inspected');
 assert(entry.proposition_source_locator&&entry.verification_scope);
}
const component098=JSON.parse(await readFile(new URL('data/items/content-research-batch-098-2026-11-15.json',root),'utf8')).records.find(r=>String(r.aid)==='259799');
const component144=JSON.parse(await readFile(new URL('data/items/content-research-batch-144-2026-11-17.json',root),'utf8')).records.find(r=>String(r.aid)==='259799');
assert(component098.document_component_id&&component144.document_component_id);
assert.notEqual(component098.document_component_id,component144.document_component_id,'distinct letters embedded in one publisher page must retain distinct document components');
assert.notEqual(component098.evidence_family_id,component144.evidence_family_id,'distinct letters on one page are not collapsed into one Evidence Family');


const batch155Path='data/items/content-research-batch-155-2026-11-21.json';
const batch155Data=JSON.parse(await readFile(new URL(batch155Path,root),'utf8'));
const batch155ExpectedAids=['2279284','2279261','2278362','2278361','3906843','2277081','2278150','2277998','5920906','2377430','3137281'];
assert.equal(batch155Data.batch_id,'155');
assert.equal(batch155Data.reviewed_item_count,26);
assert.equal(batch155Data.source_bodies_inspected,13);
assert.equal(batch155Data.source_body_pages_opened,13);
assert.equal(batch155Data.new_source_identities,12);
assert.equal(batch155Data.existing_identities_enriched,2);
assert.equal(batch155Data.existing_identities_rechecked,0);
assert.equal(batch155Data.new_response_propositions,24);
assert.equal(batch155Data.existing_response_propositions_added,2);
assert.equal(batch155Data.total_new_paraphrase_entries,26);
assert.equal(batch155Data.answer_eligible_source_families_added,11);
assert.equal(batch155Data.independent_witnesses_added,1);
assert.equal(batch155Data.independent_witness_groups_added,1);
assert.equal(batch155Data.non_independent_presentations_added,11);
assert.equal(batch155Data.content_verified_unique_sources_added,0);
assert.equal(batch155Data.blocked_candidate_count,13);
assert.equal(batch155Data.fallback_source_attempted,true);
assert.equal(batch155Data.fallback_source_results.accessible_item_level_bodies,13);
assert.equal(batch155Data.crawler_retry,false);
assert.equal(batch155Data.access_control_bypassed,false);
assert.equal(batch155Data.full_text_copied,false);
assert.equal(batch155Data.scan_only_verification_used,false);
assert.equal(batch155Data.translations_counted_as_independent_witnesses,0);
assert.deepEqual(batch155Data.new_aids.map(String).sort(),batch155ExpectedAids.slice().sort());
assert.equal(new Set(batch155Data.records.map(r=>String(r.aid))).size,11);
assert.equal(new Set(batch155Data.records.map(r=>r.id)).size,12);
assert.equal(new Set(batch155Data.records.map(r=>r.evidence_family_id)).size,11);
assert.equal(batch155Data.records.length,12);
assert.equal(batch155Data.source_body_review.length,13);
assert(batch155Data.source_body_review.every(r=>!('aid' in r)&&!('id' in r)&&!('evidence_family_id' in r)&&r.body_text_inspected&&r.source_grounded_paraphrase_added));
assert.equal(batch155Data.blocked_candidates.length,13);
assert.equal(batch155Data.deduplication_check.new_aids_unique,true);
assert.equal(batch155Data.deduplication_check.new_identity_keys_unique,true);
assert.equal(batch155Data.deduplication_check.new_source_urls_unique,false);
assert.equal(batch155Data.deduplication_check.duplicate_source_url_explained,true);
assert.equal(batch155Data.deduplication_check.unique_new_evidence_families,11);
assert.equal(batch155Data.deduplication_check.same_family_memberships,1);
assert.equal(batch155Data.deduplication_check.translations_counted_as_independent_witnesses,0);
assert.equal(batch155Data.deduplication_check.full_index_scan_available,true);
assert.equal(batch155Data.deduplication_check.full_index_scan_pending_reconciliation,true);
const koreaComponents155=batch155Data.records.filter(r=>String(r.aid)==='2377430');
assert.equal(koreaComponents155.length,2);
assert.equal(new Set(koreaComponents155.map(r=>r.evidence_family_id)).size,1);
assert.notEqual(koreaComponents155[0].document_component_id,koreaComponents155[1].document_component_id);
const koreaTestimony155=koreaComponents155.find(r=>r.document_component_id==='recipient-testimony');
const koreaExcerpt155=koreaComponents155.find(r=>r.document_component_id==='yiddish-letter-excerpt');
assert(koreaTestimony155&&koreaExcerpt155);
assert.equal(koreaTestimony155.independent_witness,true);
assert.equal(koreaExcerpt155.independent_witness,false);
assert.equal(koreaExcerpt155.translation_of_evidence_family_id,koreaExcerpt155.evidence_family_id);
const hebrewAdaptation155=batch155Data.records.find(r=>String(r.aid)==='3137281');
assert(hebrewAdaptation155);
assert.equal(hebrewAdaptation155.source_role,'secondary_editorial_adaptation');
assert.equal(hebrewAdaptation155.independent_witness,false);
assert.equal(hebrewAdaptation155.direct_rebbe_attribution_allowed,false);
assert.equal(batch155Data.language_distribution.English,11);
assert.equal(batch155Data.language_distribution.Hebrew,1);
assert.equal(batch155Data.source_type_distribution.publisher_translation,9);
assert.equal(batch155Data.source_type_distribution.recipient_testimony,1);
assert.equal(batch155Data.source_type_distribution.translated_letter_excerpt,1);
assert.equal(batch155Data.source_type_distribution.secondary_editorial_adaptation,1);
for(const r of batch155Data.records){
 assert.equal(r.status,'Parsed');
 assert.equal(r.pipeline_status,'Parsed');
 assert.equal(r.canonical_status,'Parsed');
 assert.equal(r.proposition_origin,'source_grounded_paraphrase');
 assert.equal(r.proposition_verbatim,false);
 assert.equal(r.proposition_verification,'source_text_inspected');
 assert(r.proposition_source_locator&&r.provenance&&r.verification_scope&&r.context_status==='partial'&&r.has_content_evidence);
 assert(r.response_propositions.length>0&&r.response_propositions.length===r.response_proposition_locators.length);
}
const batch155Mixed=JSON.parse(await readFile(new URL('data/items/mixed-authorized-content-2026-11-12-039.json',root),'utf8'));
const enriched3907531Batch155=batch155Mixed.records.find(r=>String(r.aid)==='3907531'||String(r.source_url||'').includes('/aid/3907531/'));
assert(enriched3907531Batch155&&enriched3907531Batch155.response_propositions.length===4);
assert(enriched3907531Batch155.response_propositions.some(p=>p.includes('התוועדויות')));
assert(enriched3907531Batch155.response_proposition_locators.some(l=>String(l).includes('285–286')));
assert.equal(enriched3907531Batch155.pipeline_status,'Verified');
const batch155Existing082=JSON.parse(await readFile(new URL('data/items/content-research-batch-082-2026-11-14.json',root),'utf8'));
const enriched5920864Batch155=batch155Existing082.records.find(r=>String(r.aid)==='5920864');
assert(enriched5920864Batch155&&enriched5920864Batch155.response_propositions.length===3);
assert(enriched5920864Batch155.response_propositions.some(p=>p.includes('שלושה הקשרים')));
assert(enriched5920864Batch155.response_proposition_locators.some(l=>String(l).includes('193–200')));
assert.equal(enriched5920864Batch155.pipeline_status,'Verified');
assert.equal(batch155Data.reconciliation_status==='pending_reconciliation'||['reconciled','reconciled_with_variance'].includes(batch155Data.reconciliation_status),true);
if(['reconciled','reconciled_with_variance'].includes(batch155Data.reconciliation_status)){
 assert(batch155Data.metrics_actual_after&&batch155Data.reconciliation_variance);
 assert.equal(batch155Data.deduplication_check.full_index_scan_available,true);
 assert.equal(batch155Data.deduplication_check.full_index_scan_pending_reconciliation,false);
 assert.deepEqual(batch155Data.deduplication_check.canonical_identity_collisions,[]);
 assert.deepEqual(batch155Data.deduplication_check.missing_canonical_identities,[]);
 assert.equal(batch155Data.deduplication_check.all_target_identities_answer_eligible,true);
 const indexedBatch155=idx.entries.filter(e=>batch155Data.records.some(r=>sourceAID(e)===String(r.aid)&&e.evidence_family_id===r.evidence_family_id&&(e.document_component_id||null)===(r.document_component_id||null)));
 assert.equal(indexedBatch155.length,12);
 assert(indexedBatch155.every(e=>e.answer_eligible));
 assert.equal(new Set(indexedBatch155.map(e=>e.evidence_family_id)).size,11);
 const batch155DoctorQuestion='מה מתועד במכתב 606 על ביקור אצל רופא ועל הוראותיו?';
 const batch155DoctorModel=buildAnswerModel(idx.entries,batch155DoctorQuestion,{mode:'researcher'});
 assert(batch155DoctorModel.answerable&&batch155DoctorModel.sources.some(e=>sourceAID(e)==='2278150'));
 assert(batch155DoctorModel.claims.length>0&&batch155DoctorModel.claims.every(c=>c.source_numbers.length));
 assert(batch155DoctorModel.citation_entailment.every(x=>x.valid));
 assert(batch155DoctorModel.context_boundary.every(x=>x.valid));
 assert(batch155DoctorModel.research&&batch155DoctorModel.research.evidence_map.length>0);
 assert(batch155DoctorModel.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));
}


// Batch 156: eight newly inspected publisher letters, one in-place enrichment,
// one blocked public-reader candidate, and one secondary adaptation excluded.
const batch156Data=JSON.parse(await readFile(new URL('data/items/content-research-batch-156-2026-11-21.json',root),'utf8'));
assert.equal(batch156Data.batch_id,'156');
assert.equal(batch156Data.source_bodies_inspected,9);
assert.equal(batch156Data.new_source_identities,8);
assert.equal(batch156Data.existing_identities_enriched,1);
assert.equal(batch156Data.new_response_propositions,23);
assert.equal(batch156Data.existing_response_propositions_added,4);
assert.equal(batch156Data.total_new_paraphrase_entries,27);
assert.equal(batch156Data.source_body_pages_opened,18);
assert.equal(batch156Data.reinspection.source_bodies_reopened,8);
assert.equal(batch156Data.reinspection.new_paraphrases_added,8);
assert.equal(batch156Data.reinspection.fallback_source_results.accessible_item_level_bodies,8);
assert.equal(batch156Data.reinspection.blocked_candidates[0].aid,3905775);
assert.equal(batch156Data.reinspection.crawler_retry,false);
assert.equal(batch156Data.reinspection.access_control_bypassed,false);
assert.equal(batch156Data.content_verified_unique_sources_added,0);
assert.equal(batch156Data.crawler_retry,false);
assert.equal(batch156Data.access_control_bypassed,false);
assert.equal(batch156Data.translations_counted_as_independent_witnesses,0);
assert.equal(batch156Data.records.length,8);
assert.equal(new Set(batch156Data.records.map(r=>String(r.aid))).size,8);
assert.equal(new Set(batch156Data.records.map(r=>r.evidence_family_id)).size,8);
assert.equal(batch156Data.records.reduce((n,r)=>n+r.response_propositions.length,0),23);
assert(batch156Data.blocked_candidates.some(x=>String(x.aid)==='4666220'));
assert(batch156Data.excluded_candidates.some(x=>String(x.aid)==='827413'));
for(const r of batch156Data.records){
 assert.equal(r.status,'Parsed');assert.equal(r.pipeline_status,'Parsed');assert.equal(r.canonical_status,'Parsed');
 assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);assert.equal(r.proposition_verification,'source_text_inspected');
 assert(r.proposition_source_locator&&r.provenance&&r.verification_scope&&r.context_status==='partial'&&r.has_content_evidence);
 const expectedBatch156Props={'2277173':3,'3907042':3,'3905775':2,'2022588':3,'2278280':4,'1923078':3,'2076262':3,'1889610':2};
 assert.equal(r.response_propositions.length,expectedBatch156Props[String(r.aid)]);assert.equal(r.response_propositions.length,r.response_proposition_locators.length);
 assert(r.response_proposition_locators.every(Boolean));assert.equal(r.independent_witness,false);
}
const enriched2282999=JSON.parse(await readFile(new URL('data/items/chabad-letter-2282999.json',root),'utf8'));
assert.equal(enriched2282999.pipeline_status,'Verified');assert.equal(enriched2282999.response_propositions.length,7);
assert(enriched2282999.response_proposition_locators.some(l=>String(l).includes('310–314')));
assert(enriched2282999.response_proposition_locators.some(l=>String(l).includes('307–316')));
assert(enriched2282999.response_proposition_locators.some(l=>String(l).includes('299–305')));
assert(enriched2282999.response_proposition_locators.some(l=>String(l).includes('303–308')));
assert.equal(batch156Data.reconciliation_status==='pending_reconciliation'||['reconciled','reconciled_with_variance'].includes(batch156Data.reconciliation_status),true);
if(['reconciled','reconciled_with_variance'].includes(batch156Data.reconciliation_status)){
 assert(batch156Data.metrics_actual_after&&batch156Data.reconciliation_variance);
 assert.equal(batch156Data.deduplication_check.full_index_scan_available,true);
 assert.deepEqual(batch156Data.deduplication_check.canonical_identity_collisions,[]);
 assert.deepEqual(batch156Data.deduplication_check.missing_canonical_identities,[]);
 const indexedBatch156=idx.entries.filter(e=>batch156Data.records.some(r=>sourceAID(e)===String(r.aid)&&e.evidence_family_id===r.evidence_family_id));
 assert.equal(indexedBatch156.length,8);assert(indexedBatch156.every(e=>e.answer_eligible));
 assert.equal(new Set(indexedBatch156.map(e=>e.evidence_family_id)).size,8);
 const batch156Question='מה מתועד באיגרות על חינוך בקהילה, התאמת מסגרות חינוך, ביקורי מורים בבתים ואחריות ההורים?';
 const batch156Model=buildAnswerModel(idx.entries,batch156Question,{mode:'researcher'});
 const batch156ModelAids=new Set(batch156Model.sources.map(sourceAID));
 assert(batch156Model.answerable);
 assert([2277173,1889610,2076262,1923078].filter(a=>batch156ModelAids.has(String(a))).length>=2);
 assert(batch156Model.claims.length>0&&batch156Model.claims.every(c=>c.source_numbers.length));
 assert(batch156Model.citation_entailment.every(x=>x.valid));assert(batch156Model.context_boundary.every(x=>x.valid));
 assert(batch156Model.research&&batch156Model.research.evidence_map.length>=2);
 assert(batch156Model.research.depth==='deep');
 assert(batch156Model.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));
}


// Batch 157: eight original-language Hebrew/Yiddish Hayom Yom entries, eight same-family English translations,
// one blocked candidate, and a claim-level deep-researcher synthesis across two distinct entries.
const batch157Data=JSON.parse(await readFile(new URL('data/items/content-research-batch-157-2026-11-21.json',root),'utf8'));
const batch157Aids=[528545,528546,528547,528548,528549,528550,528551,528552];
assert.equal(batch157Data.batch_id,'157');assert.equal(batch157Data.records.length,8);assert.deepEqual(batch157Data.new_aids,batch157Aids);
assert.equal(batch157Data.source_bodies_inspected,8);assert.equal(batch157Data.source_body_pages_opened,16);assert.equal(batch157Data.reviewed_item_count,16);
assert.equal(batch157Data.new_source_identities,8);assert.equal(batch157Data.new_response_propositions,12);assert.equal(batch157Data.total_new_paraphrase_entries,12);
assert.equal(batch157Data.answer_eligible_source_families_added,8);assert.equal(batch157Data.independent_witnesses_added,8);assert.equal(batch157Data.non_independent_presentations_added,8);
assert.equal(batch157Data.content_verified_unique_sources_added,0);assert.equal(batch157Data.same_family_items.length,8);
assert.equal(batch157Data.translations_counted_as_independent_witnesses,0);assert.equal(batch157Data.fallback_source_attempted,true);
assert.deepEqual(batch157Data.blocked_candidates.map(x=>x.aid),[4666220]);
assert.equal(batch157Data.crawler_retry,false);assert.equal(batch157Data.access_control_bypassed,false);assert.equal(batch157Data.full_text_copied,false);assert.equal(batch157Data.scan_only_verification_used,false);
assert.equal(batch157Data.language_distribution.Hebrew,5);assert.equal(batch157Data.language_distribution.Yiddish,3);
assert.equal(batch157Data.source_type_distribution.published_hebrew_hayom_yom_entry,5);assert.equal(batch157Data.source_type_distribution.published_yiddish_hayom_yom_entry,3);
assert.equal(batch157Data.records.reduce((n,r)=>n+r.response_propositions.length,0),15,'includes in-place propositions recorded later for AID 528545 and AID 528552');
assert.equal(batch157Data.records.find(r=>Number(r.aid)===528545).response_propositions.length,6,'AID 528545 must receive its sixth proposition in place in batch 164');
assert(batch157Data.records.find(r=>Number(r.aid)===528545).response_proposition_locators.some(l=>String(l).includes('שורה 168')));
assert.equal(new Set(batch157Data.records.map(r=>String(r.aid))).size,8);assert.equal(new Set(batch157Data.records.map(r=>r.evidence_family_id)).size,8);
for(const r of batch157Data.records){
 assert.equal(r.source_class,'Hayom Yom');assert.equal(r.status,'Parsed');assert.equal(r.pipeline_status,'Parsed');assert.equal(r.canonical_status,'Parsed');
 assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);assert.equal(r.proposition_verification,'source_text_inspected');
 assert(r.proposition_source_locator&&r.provenance&&r.verification_scope&&r.context_status==='partial'&&r.has_content_evidence);
 assert.equal(r.response_propositions.length,r.response_proposition_locators.length);assert(r.response_proposition_locators.every(Boolean));
 assert.equal(r.independent_witness,true);assert.equal(r.translation_of_evidence_family_id,null);assert(['Hebrew','Yiddish'].includes(r.language));
}
for(const alias of batch157Data.same_family_items){
 const canonical=batch157Data.records.find(r=>String(r.aid)===String(alias.canonical_aid));assert(canonical&&canonical.evidence_family_id===alias.evidence_family_id);
 assert.equal(alias.independent_witness,false);assert(canonical.relations.some(r=>r.type==='same_evidence_family'&&r.target_id==='aid:'+alias.aid));
 const aliasMatches=idx.entries.filter(e=>sourceAID(e)===String(alias.aid));assert(aliasMatches.every(e=>e.evidence_family_id===alias.evidence_family_id&&e.independent_witness===false));
}
assert(['reconciled','reconciled_with_variance'].includes(batch157Data.reconciliation_status));
assert(batch157Data.metrics_actual_after&&batch157Data.reconciliation_variance);
assert.equal(batch157Data.deduplication_check.full_index_scan_available,true);assert.equal(batch157Data.deduplication_check.full_index_scan_pending_reconciliation,false);
assert.deepEqual(batch157Data.deduplication_check.canonical_identity_collisions,[]);assert.deepEqual(batch157Data.deduplication_check.missing_canonical_identities,[]);
assert.equal(batch157Data.deduplication_check.all_target_identities_answer_eligible,true);
const indexedBatch157=idx.entries.filter(e=>batch157Aids.includes(Number(sourceAID(e))));
assert.equal(indexedBatch157.length,8);assert(indexedBatch157.every(e=>e.answer_eligible&&e.canonical_file==='data/items/content-research-batch-157-2026-11-21.json'));
assert.equal(new Set(indexedBatch157.map(e=>e.evidence_family_id)).size,8);
for(const aid of batch157Aids){const e=indexedBatch157.find(x=>sourceAID(x)===String(aid));assert(e);assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');assert(e.proposition_source_locator&&e.verification_scope);assert.equal(e.status,'Parsed');}
const batch157Question='מה מתועד בערכי היום יום על מנהגי חנוכה ושבת מברכים?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,batch157Question,{mode});assert(m.answerable,mode+': two distinct Hayom Yom families must support Chanukah and Shabbat Mevorchim comparison');
 assert(m.sources.some(e=>sourceAID(e)==='528551'));assert(m.sources.some(e=>sourceAID(e)==='528552'));
 assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=2);assert.equal(m.synthesis?.topic,'hayom_yom_chanukah_and_shabbat_mevorchim');
 assert.equal(m.synthesis?.attribution,'system_synthesis_not_rebbe_quote');assert.equal(m.synthesis?.claims.length,2);
 assert(m.synthesis.claims.every(c=>c.source_numbers.length&&c.source_locators.length&&c.source_locators.every(x=>x.locator)));
 assert(m.claims.length>=2&&m.claims.every(c=>c.source_numbers.length&&c.source_locators.length));
 assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));assert.equal(m.pattern_synthesis_integrity?.valid,true);
 if(mode==='researcher'){
  assert(m.research&&m.research.depth==='deep');assert(m.research.evidence_families>=2);assert(m.research.independent_evidence_families>=2);
  assert(m.research.evidence_map.length>=2&&m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));
  assert.equal(m.research.claim_source_map.length,m.claims.length);assert(m.research.claim_source_map.every(c=>c.source_numbers.length&&c.source_locators.length&&c.source_locators.every(x=>x.locator)));
  assert(m.research.synthesis_constraints.rule.includes('not independent witnesses'));
 }else assert.equal(m.research,undefined);
}

// Batch 159: nine original-language Hayom Yom entries, one promoted from staging after
// the index + recent-batch + review-queue preflight; five-family claim-level Chanukah synthesis.
const batch159Data=JSON.parse(await readFile(new URL('data/items/content-research-batch-159-2026-11-21.json',root),'utf8'));
const batch159Aids=[528553,528554,528555,528557,528558,528559,528560,528561,528562];
assert.equal(batch159Data.batch_id,'159');assert.equal(batch159Data.records.length,9);assert.deepEqual(batch159Data.new_aids,batch159Aids);
assert.equal(batch159Data.source_bodies_inspected,9);assert.equal(batch159Data.reviewed_item_count,9);assert.equal(batch159Data.new_source_identities,9);
assert.equal(batch159Data.new_response_propositions,14);assert.equal(batch159Data.total_new_paraphrase_entries,14);
assert.equal(batch159Data.answer_eligible_source_families_added,9);assert.equal(batch159Data.independent_witnesses_added,9);
assert.equal(batch159Data.content_verified_unique_sources_added,0);assert.equal(batch159Data.translations_counted_as_independent_witnesses,0);
assert.equal(batch159Data.fallback_source_attempted,true);assert.deepEqual(batch159Data.blocked_candidates.map(x=>x.aid),[4666220]);
assert.deepEqual(batch159Data.excluded_candidates.map(x=>x.aid),[528556]);
assert.equal(batch159Data.crawler_retry,false);assert.equal(batch159Data.access_control_bypassed,false);assert.equal(batch159Data.full_text_copied,false);assert.equal(batch159Data.scan_only_verification_used,false);
assert.equal(batch159Data.pre_addition_full_index_scan.entries,9122);assert.equal(batch159Data.deduplication_check.recent_manual_batch_files_checked,22);
assert.equal(batch159Data.deduplication_check.recent_manual_batch_record_rows_checked,193);assert.equal(batch159Data.deduplication_check.review_queue_records,1022);assert.equal(batch159Data.deduplication_check.review_queue_matches,0);
assert.equal(batch159Data.records.reduce((n,r)=>n+r.response_propositions.length,0),14);
assert.equal(batch159Data.retrieval_synthesis.claim_level_source_locators,6);assert.equal(batch159Data.retrieval_synthesis.claims.find(c=>c.claim_id==='rosh_chodesh_prayer_order').source_locators.length,2);
assert.equal(new Set(batch159Data.records.map(r=>String(r.aid))).size,9);assert.equal(new Set(batch159Data.records.map(r=>r.evidence_family_id)).size,9);
for(const r of batch159Data.records){
 assert.equal(r.source_class,'Hayom Yom');assert.equal(r.status,'Parsed');assert.equal(r.pipeline_status,'Parsed');assert.equal(r.canonical_status,'Parsed');
 assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);assert.equal(r.proposition_verification,'source_text_inspected');
 assert(r.proposition_source_locator&&r.provenance&&r.verification_scope&&r.context_status==='partial'&&r.has_content_evidence);
 assert.equal(r.response_propositions.length,r.response_proposition_locators.length);assert(r.response_proposition_locators.every(Boolean));
 assert.equal(r.independent_witness,true);assert.equal(r.translation_of_evidence_family_id,null);
 assert(['Hebrew','Yiddish','Hebrew and Yiddish'].includes(r.language));
}
assert(['reconciled','reconciled_with_variance'].includes(batch159Data.reconciliation_status));
assert(batch159Data.metrics_actual_before&&batch159Data.metrics_actual_after&&batch159Data.metrics_delta_actual);assert.equal(batch159Data.reconciliation_variance,null);assert.equal(batch159Data.reconciliation_comparison_status,'not_applicable_no_projection');
assert.equal(batch159Data.deduplication_check.full_index_scan_available,true);assert.equal(batch159Data.deduplication_check.full_index_scan_pending_reconciliation,false);
assert.deepEqual(batch159Data.deduplication_check.canonical_identity_collisions,[]);assert.deepEqual(batch159Data.deduplication_check.missing_canonical_identities,[]);
assert.equal(batch159Data.deduplication_check.all_target_identities_answer_eligible,true);
const indexedBatch159=idx.entries.filter(e=>batch159Aids.includes(Number(sourceAID(e))));
assert.equal(indexedBatch159.length,9);assert(indexedBatch159.every(e=>e.answer_eligible&&e.canonical_file==='data/items/content-research-batch-159-2026-11-21.json'));
assert.equal(new Set(indexedBatch159.map(e=>e.evidence_family_id)).size,9);
for(const aid of batch159Aids){
 const e=indexedBatch159.find(x=>sourceAID(x)===String(aid));assert(e);
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');assert.equal(e.proposition_verbatim,false);assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope);assert.equal(e.status,'Parsed');
}
assert.equal(idx.entries.filter(e=>sourceAID(e)==='528556').length,0,'navigation-only AID 528556 must not enter the answer index');
const batch159Question='מה מתועד בערכי היום יום על חנוכה — מנהגי הבית, סדרי התפילה והמאבק על תוכן התורה והמצוות?';
const expected159Aids=['528553','528554','528555','528557','528558'];
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,batch159Question,{mode});
 assert(m.answerable,mode+': five distinct inspected Hayom Yom entry families must support the Chanukah comparison');
 assert(expected159Aids.every(aid=>m.sources.some(e=>sourceAID(e)===aid)));
 assert.equal(m.synthesis?.topic,'hayom_yom_chanukah_practices_and_religious_identity');
 assert.equal(m.synthesis?.attribution,'system_synthesis_not_rebbe_quote');assert.equal(m.synthesis?.claims.length,5);
 assert.equal(new Set(m.synthesis.evidence_family_ids).size,5);assert.equal(m.synthesis.basis.length,5);
 assert(m.synthesis.claims.every(c=>c.source_numbers.length===1&&c.source_locators.length>=1&&c.source_locators.every(x=>x.locator)));
 assert(m.claims.length>=5&&m.claims.every(c=>c.source_numbers.length&&c.source_locators.length));
 assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));assert.equal(m.pattern_synthesis_integrity?.valid,true);
 if(mode==='researcher'){
  assert(m.research&&m.research.depth==='deep');assert(m.research.evidence_families>=5);assert(m.research.independent_evidence_families>=5);
  assert(m.research.evidence_map.length>=5&&m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));
  assert.equal(m.research.claim_source_map.length,5);assert(m.research.claim_source_map.every(c=>c.source_numbers.length===1&&c.source_locators.length>=1&&c.source_locators.every(x=>x.locator)));
  assert(m.research.synthesis_constraints.rule.includes('not independent archival corroboration'));
 }else assert.equal(m.research,undefined);
}


// Batch 160: thirteen original-language Hayom Yom bodies; fifteen bounded non-verbatim propositions.
const batch160Data=JSON.parse(await readFile(new URL('data/items/content-research-batch-160-2026-11-21.json',root),'utf8'));
const batch160Aids=Array.from({length:13},(_,i)=>528563+i);
assert.equal(batch160Data.batch_id,'160');assert.equal(batch160Data.records.length,13);assert.deepEqual(batch160Data.new_aids,batch160Aids);
assert.equal(batch160Data.source_bodies_inspected,14);assert.equal(batch160Data.source_body_pages_opened,14);assert.equal(batch160Data.reviewed_item_count,14);assert.equal(batch160Data.new_source_identities,13);assert.equal(batch160Data.existing_identities_enriched,1);assert.equal(batch160Data.existing_identities_rechecked,1);assert.equal(batch160Data.existing_response_propositions_added,1);
assert.equal(batch160Data.new_response_propositions,15);assert.equal(batch160Data.total_new_paraphrase_entries,16);assert.equal(batch160Data.answer_eligible_source_families_added,13);assert.deepEqual(batch160Data.enriched_aids,[528552]);
assert.equal(batch160Data.independent_witnesses_added,13);assert.equal(batch160Data.content_verified_unique_sources_added,0);assert.equal(batch160Data.translations_counted_as_independent_witnesses,0);
assert.deepEqual(batch160Data.blocked_candidates.map(x=>x.aid),[4666220]);assert.equal(batch160Data.fallback_source_attempted,true);
assert.equal(batch160Data.crawler_retry,false);assert.equal(batch160Data.access_control_bypassed,false);assert.equal(batch160Data.full_text_copied,false);assert.equal(batch160Data.scan_only_verification_used,false);
assert.deepEqual(batch160Data.language_distribution,{"Hebrew":7,"Yiddish":3,"Hebrew and Yiddish":4});
assert.equal(batch160Data.records.reduce((n,r)=>n+r.response_propositions.length,0),15);assert.equal(batch160Data.source_body_review.length,14);assert(batch160Data.source_body_review.some(x=>x.aid===528552&&x.existing_identity===true&&x.web_source_ref==='turn199779view0'));assert.equal(batch160Data.existing_identity_updates.length,1);assert.equal(batch160Data.existing_identity_updates[0].before,2);assert.equal(batch160Data.existing_identity_updates[0].after,3);assert.equal(batch160Data.existing_identity_updates[0].existing_propositions_before,2);assert.equal(batch160Data.existing_identity_updates[0].total_propositions_after,3);assert.deepEqual(batch160Data.deduplication_check.existing_aids_found,[528552]);
assert.equal(new Set(batch160Data.records.map(r=>String(r.aid))).size,13);assert.equal(new Set(batch160Data.records.map(r=>r.evidence_family_id)).size,13);
for(const r of batch160Data.records){
 assert.equal(r.source_class,'Hayom Yom');assert.equal(r.type,'hayom_yom_entry');assert.equal(r.status,'Parsed');assert.equal(r.pipeline_status,'Parsed');
 assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);assert.equal(r.proposition_verification,'source_text_inspected');
 assert(r.proposition_source_locator&&r.provenance&&r.verification_scope&&r.context_status==='partial'&&r.has_content_evidence);
 assert.equal(r.response_propositions.length,r.response_proposition_locators.length);assert(r.response_proposition_locators.every(Boolean));
 assert.equal(r.independent_witness,true);assert.equal(r.translation_of_evidence_family_id,null);
 assert(['Hebrew','Yiddish','Hebrew and Yiddish'].includes(r.language));
}
assert.equal(batch160Data.retrieval_synthesis.attribution,'system_synthesis_not_rebbe_quote');
assert.equal(batch160Data.retrieval_synthesis.claim_count,5);assert.equal(batch160Data.retrieval_synthesis.claim_level_source_locators,5);
assert.equal(new Set(batch160Data.retrieval_synthesis.evidence_family_ids).size,5);
assert(batch160Data.retrieval_synthesis.claims.every(c=>c.source_aids.length===1&&c.source_locators.length===1&&c.source_locators[0].locator));
assert.equal(batch160Data.pre_addition_full_index_scan.entries,9122);
assert.equal(batch160Data.deduplication_check.recent_manual_batch_files_checked,23);
assert.equal(batch160Data.deduplication_check.recent_manual_batch_record_rows_checked,202);
assert.equal(batch160Data.deduplication_check.review_queue_records,1022);assert.equal(batch160Data.deduplication_check.review_queue_matches,0);assert.equal(batch160Data.fallback_source_results.accessible_item_level_bodies,14);
assert(['reconciled','reconciled_with_variance'].includes(batch160Data.reconciliation_status));
assert(batch160Data.metrics_actual_before&&batch160Data.metrics_actual_after&&batch160Data.metrics_delta_actual);
assert.equal(batch160Data.reconciliation_variance,null);assert.equal(batch160Data.reconciliation_comparison_status,'not_applicable_no_projection');
assert.equal(batch160Data.deduplication_check.full_index_scan_available,true);assert.equal(batch160Data.deduplication_check.full_index_scan_pending_reconciliation,false);
assert.deepEqual(batch160Data.deduplication_check.canonical_identity_collisions,[]);assert.deepEqual(batch160Data.deduplication_check.missing_canonical_identities,[]);
assert.equal(batch160Data.deduplication_check.all_target_identities_answer_eligible,true);
const indexedBatch160=idx.entries.filter(e=>batch160Aids.includes(Number(sourceAID(e))));
assert.equal(indexedBatch160.length,13);assert(indexedBatch160.every(e=>e.answer_eligible&&e.canonical_file==='data/items/content-research-batch-160-2026-11-21.json'));
assert.equal(new Set(indexedBatch160.map(e=>e.evidence_family_id)).size,13);
const batch160Question='מה מתועד בערכי היום יום על חינוך, אווירה של תורה ומצוות וקביעות בלימוד חומש עם רש״י?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,batch160Question,{mode});
 assert(m.answerable,mode+': inspected Hayom Yom entries must support the bounded education/spiritual-atmosphere/daily-study comparison');
 for(const aid of ['528564','528567','528575'])assert(m.sources.some(e=>sourceAID(e)===aid),mode+': expected distinct dated entry '+aid);
 assert(m.claims.length>=3&&m.claims.every(c=>c.source_numbers.length&&c.source_locators.length&&c.source_locators.every(x=>x.locator)));
 assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));
 if(mode==='researcher'){
  assert(m.research&&m.research.depth==='deep');assert(m.research.evidence_families>=3);
  assert(m.research.evidence_map.length>=3&&m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));
  assert.equal(m.research.claim_source_map.length,m.claims.length);
  assert(m.research.claim_source_map.every(c=>c.source_numbers.length&&c.source_locators.length&&c.source_locators.every(x=>x.locator)));
 }else assert.equal(m.research,undefined);
}


// Batch 166: thirteen original-language Adar II Hayom Yom bodies and a five-family claim-level synthesis.
const batch166Data=JSON.parse(await readFile(new URL('data/items/content-research-batch-166-2026-11-22.json',root),'utf8'));
const batch166Aids=[528647,528649,528650,528651,528652,528653,528654,528655,528656,528657,528658,528659,528660];
assert.equal(batch166Data.batch_id,'166');assert.equal(batch166Data.records.length,13);assert.deepEqual(batch166Data.new_aids,batch166Aids);
assert.equal(batch166Data.reviewed_item_count,17);assert.equal(batch166Data.source_bodies_inspected,13);assert.equal(batch166Data.source_body_pages_opened,13);
assert.equal(batch166Data.new_source_identities,13);assert.equal(batch166Data.existing_identities_enriched,0);assert.equal(batch166Data.new_response_propositions,15);assert.equal(batch166Data.total_new_paraphrase_entries,15);
assert.equal(batch166Data.answer_eligible_source_families_added,13);assert.equal(batch166Data.independent_witnesses_added,13);assert.equal(batch166Data.non_independent_presentations_added,0);
assert.equal(batch166Data.content_verified_unique_sources_added,0);assert.equal(batch166Data.translations_counted_as_independent_witnesses,0);
assert.deepEqual(batch166Data.language_distribution,{Hebrew:7,Yiddish:5,'Hebrew and Yiddish':1});
assert.deepEqual(batch166Data.blocked_candidates.map(x=>x.aid),[550377,550379,550381]);assert.equal(batch166Data.excluded_candidates[0].aid,528648);
assert.equal(batch166Data.fallback_source_attempted,true);assert.equal(batch166Data.fallback_source_results.accessible_item_level_bodies,13);
assert.equal(batch166Data.fallback_source_results.full_transcript_bodies_opened,0);assert.equal(batch166Data.crawler_retry,false);
assert.equal(batch166Data.access_control_bypassed,false);assert.equal(batch166Data.full_text_copied,false);assert.equal(batch166Data.scan_only_verification_used,false);
assert.equal(batch166Data.metrics_actual_after,null);assert.equal(batch166Data.metrics_expected_after,null);
assert.equal(batch166Data.deduplication_check.code_search_exact_aid_queries,13);assert.deepEqual(batch166Data.deduplication_check.code_search_matches,[]);
assert.equal(batch166Data.deduplication_check.review_queue_records,1022);assert.equal(batch166Data.deduplication_check.review_queue_matches,0);
assert.equal(batch166Data.deduplication_check.recent_manual_batch_files_checked,2);assert.equal(batch166Data.deduplication_check.recent_manual_batch_record_rows_checked,27);
assert.equal(batch166Data.deduplication_check.full_index_scan_available,false);assert.equal(batch166Data.deduplication_check.post_addition_canonical_scan_pending,true);
assert.equal(new Set(batch166Data.records.map(r=>String(r.aid))).size,13);assert.equal(new Set(batch166Data.records.map(r=>r.evidence_family_id)).size,13);
assert.equal(batch166Data.records.reduce((n,r)=>n+r.response_propositions.length,0),16,'batch 167 adds one in-place proposition to AID 528659 without changing batch 166 original delta');
for(const r of batch166Data.records){
 assert.equal(r.source_class,'Hayom Yom');assert.equal(r.type,'hayom_yom_entry');
 assert.equal(r.status,'Parsed');assert.equal(r.pipeline_status,'Parsed');assert.equal(r.canonical_status,'Parsed');
 assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);assert.equal(r.proposition_verification,'source_text_inspected');
 assert(r.proposition_source_locator&&r.provenance&&r.verification_scope&&r.context_status==='partial'&&r.has_content_evidence);
 assert.equal(r.response_propositions.length,r.response_proposition_locators.length);assert(r.response_proposition_locators.every(Boolean));
 assert.equal(r.independent_witness,true);assert.equal(r.translation_of_evidence_family_id,null);
 assert(['Hebrew','Yiddish','Hebrew and Yiddish'].includes(r.language));
}
assert.equal(batch166Data.retrieval_synthesis.topic,'hayom_yom_adar_ii_study_and_practical_action');
assert.equal(batch166Data.retrieval_synthesis.attribution,'system_synthesis_not_rebbe_quote');
assert.equal(batch166Data.retrieval_synthesis.claim_count,5);assert.equal(batch166Data.retrieval_synthesis.claim_level_source_locators,5);
assert.equal(new Set(batch166Data.retrieval_synthesis.claims.flatMap(c=>c.source_aids)).size,5);
assert(batch166Data.retrieval_synthesis.claims.every(c=>c.source_aids.length===1&&c.source_locators.length===1&&c.source_locators[0].locator));
const indexedBatch166=idx.entries.filter(e=>batch166Aids.includes(Number(sourceAID(e))));
assert.equal(indexedBatch166.length,13);assert(indexedBatch166.every(e=>e.answer_eligible&&e.canonical_file==='data/items/content-research-batch-166-2026-11-22.json'));
assert.equal(new Set(indexedBatch166.map(e=>e.evidence_family_id)).size,13);
const batch166Question='מה מתועד בערכי היום יום באדר ב׳ על הקשר בין הכנה, לימוד ועבודה מעשית?';
const batch166SynthesisAids=['528650','528653','528655','528656','528659'];
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,batch166Question,{mode});
 assert(m.answerable,mode+': five inspected Adar II Hayom Yom families must support the bounded preparation/study/action synthesis');
 assert(batch166SynthesisAids.every(aid=>m.sources.some(e=>sourceAID(e)===aid)));
 assert.equal(m.synthesis?.topic,'hayom_yom_adar_ii_study_and_practical_action');
 assert.equal(m.synthesis?.attribution,'system_synthesis_not_rebbe_quote');assert.equal(m.synthesis?.claims.length,5);
 assert.equal(new Set(m.synthesis.evidence_family_ids).size,5);assert.equal(m.synthesis.basis.length,5);
 assert(m.synthesis.claims.every(c=>c.source_numbers.length===1&&c.source_locators.length===1&&c.source_locators.every(x=>x.locator)&&c.witnesses?.length===1&&c.witnesses[0].independent_witness===true));
 assert.equal(m.claims.length,5);assert(m.claims.every(c=>c.source_numbers.length===1&&c.source_locators.length===1&&c.source_locators.every(x=>x.locator)));
 assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));assert.equal(m.pattern_synthesis_integrity?.valid,true);
 if(mode==='researcher'){
  assert(m.research&&m.research.depth==='deep');assert(m.research.evidence_families>=5);assert(m.research.independent_evidence_families>=5);
  assert(m.research.evidence_map.length>=5&&m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));
  assert.equal(m.research.claim_source_map.length,5);assert(m.research.claim_source_map.every(c=>c.source_numbers.length===1&&c.source_locators.length===1&&c.source_locators.every(x=>x.locator)));
  assert(m.research.synthesis_constraints.rule.includes('not independent archival corroboration'));
 }else assert.equal(m.research,undefined);
}


const gazitOriginalEntry=idx.entries.find(e=>sourceAID(e)==='281313'&&Array.isArray(e.response_propositions)&&e.response_propositions.some(p=>String(p).includes('שלמה גזית')));
assert(gazitOriginalEntry,'AID 281313 publisher synopsis must be present in the canonical search index');
const gazitShadowEntry={...gazitOriginalEntry,response_propositions:['פרפרזה לא קשורה שאינה מתארת את שיחתו של שלמה גזית'],response_proposition_locators:[gazitOriginalEntry.proposition_source_locator||gazitOriginalEntry.response_proposition_locators?.[0]]};
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel([gazitShadowEntry,...idx.entries],batch089MultiSourceQuery,{mode});
 assert(m.answerable,mode+': a duplicate AID record without the required proposition must not shadow the matching source; reason='+m.reason);
 assert(['281313','4469446'].every(aid=>m.sources.some(e=>sourceAID(e)===aid)));
 assert.equal(m.synthesis?.topic,'living_torah_integrity_comparison');
 assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));
 if(mode==='researcher')assert(m.research&&m.research.depth==='deep'&&m.research.evidence_map.length>=2);
}

 
// Batch 167: twelve original-language Adar II entries and one in-place enrichment.
const batch167Data=JSON.parse(await readFile(new URL('data/items/content-research-batch-167-2026-11-22.json',root),'utf8'));
const batch167Aids=[4422924,528661,528662,528663,528664,528665,528666,528667,528668,528669,528670,528671,528672];
assert.equal(batch167Data.batch_id,'167');assert.equal(batch167Data.records.length,13);assert.deepEqual(batch167Data.new_aids,batch167Aids);
assert.equal(batch167Data.reviewed_item_count,16);assert.equal(batch167Data.source_bodies_inspected,14);assert.equal(batch167Data.source_body_pages_opened,14);
assert.equal(batch167Data.new_source_identities,13);assert.equal(batch167Data.existing_identities_enriched,1);
assert.equal(batch167Data.new_response_propositions,16);assert.equal(batch167Data.existing_response_propositions_added,1);assert.equal(batch167Data.total_new_paraphrase_entries,17);
assert.equal(batch167Data.answer_eligible_source_families_added,13);assert.equal(batch167Data.independent_witnesses_added,12);assert.equal(batch167Data.non_independent_presentations_added,1);
assert.equal(batch167Data.content_verified_unique_sources_added,0);assert.equal(batch167Data.translations_counted_as_independent_witnesses,0);
assert.deepEqual(batch167Data.language_distribution,{English:1,Hebrew:9,Yiddish:3});
assert.equal(batch167Data.blocked_candidates[0].aid,4666220);assert.equal(batch167Data.fallback_source_attempted,true);
assert.equal(batch167Data.fallback_source_results.alternate_same_item_body_opened,false);
assert.equal(batch167Data.fallback_source_results.false_match_candidates_excluded,1);assert.equal(batch167Data.fallback_source_results.accessible_item_level_bodies,13);assert.equal(batch167Data.fallback_source_results.translation_body_inspected,1);
assert.equal(batch167Data.crawler_retry,false);assert.equal(batch167Data.access_control_bypassed,false);
assert.equal(batch167Data.full_text_copied,false);assert.equal(batch167Data.scan_only_verification_used,false);
assert.equal(batch167Data.deduplication_check.canonical_bulk_files_checked,12);assert.equal(batch167Data.deduplication_check.canonical_bulk_records_checked,1328);
assert.equal(batch167Data.deduplication_check.recent_manual_batch_files_checked,10);assert.equal(batch167Data.deduplication_check.recent_manual_batch_record_rows_checked,110);
assert.equal(batch167Data.deduplication_check.review_queue_records,1022);assert.equal(batch167Data.deduplication_check.review_queue_matches,0);assert.equal(batch167Data.deduplication_check.code_search_exact_aid_queries,1);
assert.equal(batch167Data.deduplication_check.full_index_scan_available,false);assert.equal(batch167Data.deduplication_check.post_addition_canonical_scan_pending,true);
assert.equal(new Set(batch167Data.records.map(r=>String(r.aid))).size,12);assert.equal(new Set(batch167Data.records.map(r=>r.evidence_family_id)).size,12);
assert.equal(batch167Data.records.reduce((n,r)=>n+r.response_propositions.length,0),16);
for(const r of batch167Data.records){
 assert.equal(r.source_class,'Hayom Yom');assert.equal(r.type,'hayom_yom_entry');
 assert.equal(r.status,'Parsed');assert.equal(r.pipeline_status,'Parsed');assert.equal(r.canonical_status,'Parsed');
 assert.equal(r.proposition_origin,'source_grounded_paraphrase');assert.equal(r.proposition_verbatim,false);assert.equal(r.proposition_verification,'source_text_inspected');
 assert(r.proposition_source_locator&&r.provenance&&r.verification_scope&&r.context_status==='partial'&&r.has_content_evidence);
 assert.equal(r.response_propositions.length,r.response_proposition_locators.length);assert(r.response_proposition_locators.every(Boolean));
 if(String(r.aid)==='4422924'){
  assert.equal(r.independent_witness,false);assert.equal(r.translation_of_evidence_family_id,r.evidence_family_id);
  assert.equal(r.language,'English');assert.equal(r.original_language,'unknown');assert.equal(r.witness_type,'publisher_translation_of_correspondence');
 }else{
  assert.equal(r.independent_witness,true);assert.equal(r.translation_of_evidence_family_id,null);
  assert(['Hebrew','Yiddish'].includes(r.language));
 }
}
const batch167Update=batch167Data.existing_identity_updates[0];
assert.equal(batch167Update.aid,528659);assert.equal(batch167Update.canonical_file,'data/items/content-research-batch-166-2026-11-22.json');
assert.equal(batch167Update.existing_propositions_before,1);assert.equal(batch167Update.total_propositions_after,2);
const enriched528659=batch166Data.records.find(r=>String(r.aid)==='528659');
assert.equal(enriched528659.response_propositions.length,2);
assert(enriched528659.response_propositions[1].includes('ספירות')&&enriched528659.response_propositions[1].includes('מדרגות'));
assert.equal(batch167Data.retrieval_synthesis.topic,'living_torah_integrity_comparison');
assert.equal(batch167Data.retrieval_synthesis.attribution,'system_synthesis_not_rebbe_quote');
assert.deepEqual(batch167Data.proposition_language_distribution,{English:2,Hebrew:15});
assert.deepEqual(batch167Data.source_type_distribution,{"Hayom Yom":12,"Rebbe correspondence translation":1});
assert.equal(batch167Data.source_body_review.length,14);
assert.equal(batch167Data.translation_presentations_reviewed,1);
assert.equal(batch167Data.translations_counted_as_independent_witnesses,0);
assert.equal(batch167Data.metrics_delta_at_batch_boundary.answer_eligible_unique_sources,13);
assert.equal(batch167Data.metrics_delta_at_batch_boundary.answer_eligible_propositions,17);
if(['reconciled','reconciled_with_variance'].includes(batch167Data.reconciliation_status)){
 const indexed167=idx.entries.filter(e=>batch167Aids.includes(Number(sourceAID(e))));
 assert.equal(indexed167.length,13);assert(indexed167.every(e=>e.answer_eligible&&e.canonical_file===batch167Data.batch_file));
 assert.equal(new Set(indexed167.map(e=>e.evidence_family_id)).size,13);
}
