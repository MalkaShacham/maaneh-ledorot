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
 assert.equal(e.independent_witness,true);
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
  assert(m.sources.every(e=>['id:igrot-scan-v13-letter-4-284','id:igrot-scan-v13-letter-4-292','id:igrot-scan-v13-letter-4-319'].includes(e.key)),`${mode}: only inspected enrollment propositions may enter the answer`);
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
for(const mode of ['regular','researcher']){const m=buildAnswerModel(idx.entries,'מה הדפוס החוזר באגרות על התמודדות עם קשיים ומכשולים?',{mode});if(!m.answerable)console.error('DIFFICULTY_PATTERN_DEBUG',mode,m.reason,m.understanding,m.sources?.map(e=>({aid:e.aid,family:e.evidence_family_id,props:e._supporting_propositions})));assert(m.answerable,mode+': bounded difficulty pattern');for(const aid of [4096309,4096316,4380025])assert(m.sources.some(e=>sourceAID(e)===String(aid)));assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=3);assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));assert.equal(m.synthesis?.attribution,'system_synthesis_not_rebbe_quote');assert.equal(m.pattern_synthesis_integrity?.valid,true);assert(m.synthesis.source_numbers.length>=3);assert(m.synthesis.basis.every(b=>b.propositions.every(p=>p.source_locator)));if(mode==='researcher'){assert(m.research.evidence_families>=3);assert(m.research.evidence_integrity.independent_witnesses>=3);assert(m.research.evidence_map.length>0);assert.equal(m.research.pattern_synthesis_integrity.valid,true);}else assert.equal(m.research,undefined);}
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
assert(englishTranslation073&&englishTranslation073.status==='Linked'&&!englishTranslation073.has_content_evidence&&englishTranslation073.response_propositions.length===0,'English translation must not be answer-eligible');
assert(englishTranslation073.translation_observations.length===3&&englishTranslation073.independent_witness===false,'English translation observations must remain non-independent');
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
const disseminationSynthesis='מה כתב הרבי על הפצת המעיינות והפצת פנימיות התורה?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,disseminationSynthesis,{mode});
 assert(m.answerable,mode+': inspected dissemination evidence must support a multi-source synthesis');
 assert(m.sources.some(e=>String(e.aid)==='4831188'),mode+': Hebrew source on inner Torah dissemination must be retrieved');
 assert(m.sources.some(e=>String(e.aid)==='5071052'),mode+': Hebrew source on the demand to disseminate the wellsprings must be retrieved');
 assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=2,mode+': dissemination synthesis must use independent Evidence Families');
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length),mode+': each synthesized claim must cite its supporting sources');
 assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));
 if(mode==='researcher'){
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
assert.equal(acquisitionState.manual_web_review.batch_id,'109');assert.equal(acquisitionState.manual_web_review.batch_file,'data/items/content-research-batch-109-2026-11-16.json');
assert.deepEqual(acquisitionState.manual_web_review_current_metrics,metrics);

console.log('EDUCATION_INFLUENCE_DEBUG '+mode+' '+JSON.stringify({reason:m.reason,topics:m.understanding?.topics,source_aids:m.sources?.map(e=>e.aid),families:m.sources?.map(e=>e.evidence_family_id),claims:m.claims,coverage:m.comparative_coverage,citations:m.citation_entailment}));
 assert(m.answerable,mode+': multi-source educational influence/action synthesis must be answerable');
 assert(m.sources.some(e=>String(e.aid)==='2278256'));
 assert(m.sources.some(e=>String(e.aid)==='2278261')||m.sources.some(e=>String(e.aid)==='2278254'));
 assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=2);
 assert(m.claims.length>0);
 if(mode==='researcher'){
  assert(m.research&&m.research.evidence_families>=2);
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

assert.equal(acquisitionState.previous_manual_web_review.batch_id,'108');
assert.equal(acquisitionState.previous_manual_web_review.batch_file,'data/items/content-research-batch-108-2026-11-16.json');
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
 assert.equal(m.synthesis.attribution,'system_synthesis_not_rebbe_quote');
 assert(m.synthesis.claims.length>=2&&m.synthesis.claims.every(c=>c.source_numbers.length&&c.source_locators.length),mode+': each synthesis claim must carry its own item-level locator');
 const studyClaim=m.synthesis.claims.find(c=>c.topic==='study_with_chavruta');
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
assert.equal(batch088Data.reconciliation_status,'reconciled');
assert.deepEqual(batch088Data.metrics_actual_after,batch088Data.metrics_expected_after);
assert.deepEqual(batch088Data.reconciliation_variance,{answer_eligible_unique_sources:0,content_verified_unique_sources:0,answer_eligible_propositions:0});
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
assert(direct5412963&&direct5412963.status==='Verified'&&direct5412963.proposition_source_locator.includes('244–249'));
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
assert.deepEqual(acquisitionState.manual_web_review_current_metrics,metrics);


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
assert.equal(batch089Data.reconciliation_status,'reconciled');
assert.equal(batch089Data.status,'reconciled');
assert.deepEqual(batch089Data.metrics_actual_after,batch089Data.metrics_expected_after);
assert.deepEqual(batch089Data.reconciliation_variance,{answer_eligible_unique_sources:0,content_verified_unique_sources:0,answer_eligible_propositions:0});
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

const reconciledProjectState=JSON.parse(await readFile(new URL('data/project-state.json',root),'utf8'));
const reconciliationChain=reconciledProjectState.development_recovery.reconciliation_chain;
assert.deepEqual(reconciliationChain.map(x=>String(x.batch_id)),['099','100','101','102','103','104','105','106']);
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
assert.equal(reconciledProjectState.development_recovery.last_reconciliation.batch_id,'106');
assert(batch105Audit&&batch106ChainAudit);
assert.equal(batch105Audit.reconciliation_status,'reconciled');
console.log('BATCH106_CHAIN_AUDIT',JSON.stringify(batch106ChainAudit));
assert.equal(batch106ChainAudit.canonical_identity_collision_count,0);
assert.equal(batch106ChainAudit.same_family_duplicate_count,0);
const batch106ReconciledAids=new Set(['2989153','2989320','2989243','4304434','5959845','2988989','5990037','5989929','5959840','2989386']);
const batch106IdentityAudit=(reconciledProjectState.development_recovery.last_reconciliation.items||[]).filter(x=>batch106ReconciledAids.has(String(x.aid)));
assert.equal(batch106IdentityAudit.length,10);
assert(batch106IdentityAudit.every(x=>x.canonical_records_found===1&&!x.canonical_identity_collision&&x.selected_index_entry.answer_eligible));
assert.equal(reconciledProjectState.metrics_integrity.answer_readiness.reconciliation_status,'reconciled');
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
assert.deepEqual(acquisitionState.manual_web_review_current_metrics,metrics);
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
assert.deepEqual(batch098Data.metrics_expected_after,{answer_eligible_unique_sources:965,content_verified_unique_sources:854,answer_eligible_propositions:2929});
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
assert.equal(batch100Data.records.reduce((n,r)=>n+r.response_propositions.length,0),16);
assert(batch100Data.existing_identity_updates.some(x=>String(x.aid)==='2989585'));
assert.equal(batch100Data.content_verified_unique_sources_added,0);
assert.equal(batch100Data.blocked_candidate_count,1);
assert.equal(batch100Data.blocked_candidates[0].aid,553674);
assert.equal(batch100Data.crawler_retry,false);
assert.equal(batch100Data.access_control_bypassed,false);
assert.equal(batch100Data.full_text_copied,false);
assert.equal(batch100Data.scan_only_verification_used,false);
assert.equal(batch100Data.translations_counted_as_independent_witnesses,0);
assert.deepEqual(batch100Data.metrics_before,{answer_eligible_unique_sources:977,content_verified_unique_sources:854,answer_eligible_propositions:2952});
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
assert.equal(enriched2989585.response_propositions.length,6);
assert(enriched2989585.response_proposition_locators.some(l=>String(l).includes('222–233')));
assert(enriched2989585.response_proposition_locators.some(l=>String(l).includes('214–217')));
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
assert.deepEqual(batch101Data.metrics_before,{answer_eligible_unique_sources:986,content_verified_unique_sources:854,answer_eligible_propositions:2969});
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
assert.deepEqual(metrics,batch101Data.metrics_actual_after);
assert.deepEqual(acquisitionState.manual_web_review_current_metrics,metrics);


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
assert.deepEqual(batch102Data.metrics_before,{answer_eligible_unique_sources:1001,content_verified_unique_sources:854,answer_eligible_propositions:2999});
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
assert.equal(batch102Enriched2989585.response_propositions.length,7);
assert.equal(batch102Enriched2989585.response_proposition_locators.length,7);
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
if(batch106Data.reconciliation_status==='reconciled'){
 assert.deepEqual(readinessMetrics(batch106Data.metrics_actual_after),batch106Data.metrics_expected_after);
 assert.deepEqual(batch106Data.reconciliation_variance,{answer_eligible_unique_sources:0,content_verified_unique_sources:0,answer_eligible_propositions:0});
 assert(batch106Data.deduplication_check.full_index_scan_available);
 assert.deepEqual(batch106Data.deduplication_check.canonical_identity_collisions,[]);
 assert.deepEqual(batch106Data.deduplication_check.missing_canonical_identities,[]);
 assert.equal(batch106Data.deduplication_check.all_target_identities_answer_eligible,true);
}else if(batch106Data.reconciliation_status==='reconciled_with_variance'){
 assert.deepEqual(readinessMetrics(batch106Data.metrics_actual_after),{answer_eligible_unique_sources:1041,content_verified_unique_sources:854,answer_eligible_propositions:3090});
 assert.deepEqual(batch106Data.reconciliation_variance,{answer_eligible_unique_sources:0,content_verified_unique_sources:0,answer_eligible_propositions:1});
 assert(batch106Data.deduplication_check.full_index_scan_available);
 assert.deepEqual(batch106Data.deduplication_check.canonical_identity_collisions,[]);
 assert.deepEqual(batch106Data.deduplication_check.missing_canonical_identities,[]);
 assert.equal(batch106Data.deduplication_check.all_target_identities_answer_eligible,true);
 console.log('BATCH106_RECONCILIATION_METRICS',JSON.stringify({actual:readinessMetrics(batch106Data.metrics_actual_after),expected:batch106Data.metrics_expected_after,variance:batch106Data.reconciliation_variance,dedup:batch106Data.deduplication_check}));
}else{
 assert.equal(batch106Data.reconciliation_status,'pending');assert.equal(batch106Data.metrics_actual_after,null);
 assert.equal(batch106Data.reconciliation_variance,null);assert.equal(batch106Data.deduplication_check.full_index_scan_pending_reconciliation,true);
 
}
assert.equal(new Set(batch106Data.records.map(r=>String(r.aid))).size,8);
assert.equal(new Set(batch106Data.records.map(r=>r.evidence_family_id)).size,8);
assert.equal(batch106Data.records.reduce((n,r)=>n+r.response_propositions.length,0),18);
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
assert(enriched2989153&&enriched2989153.response_propositions.length===3,'AID 2989153 must be enriched in place within its existing batch-106 identity');
assert(enriched2989153.response_proposition_locators.some(l=>String(l).includes('207–210')));assert(enriched2989153.response_proposition_locators.some(l=>String(l).includes('199–203')));
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
assert.equal(batch107Data.records.reduce((n,r)=>n+r.response_propositions.length,0),22);
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
 const expectedPropCount=['4736086','5430533'].includes(String(r.aid))?3:2;
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
assert(choiceEntry&&choiceEntry.response_propositions.length===3&&choiceEntry.response_proposition_locators.some(l=>String(l).includes('207–210'))&&choiceEntry.response_proposition_locators.some(l=>String(l).includes('199–203')));
const choiceQuestion='מה מציעה שיחת עקב תשי״ג לעשות כאשר אדם ניצב בפני שתי דרכי עבודה ואינו יודע במה לבחור?';
const choiceModel=buildAnswerModel([choiceEntry],choiceQuestion,{mode:'researcher'});
assert(choiceModel.answerable&&choiceModel.sources.some(e=>sourceAID(e)==='2989153'));
assert(choiceModel.claims.length>0&&choiceModel.claims.every(c=>c.source_numbers.length&&c.source_locators.length));
assert(choiceModel.research&&choiceModel.research.depth==='deep'&&choiceModel.research.claim_source_map.length===choiceModel.claims.length);
assert(choiceModel.research.claim_source_map.every(c=>c.source_numbers.length&&c.source_locators.length));
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
if(batch107Data.reconciliation_status==='reconciled'){
 assert.deepEqual(readinessMetrics(batch107Data.metrics_actual_after),batch107Data.metrics_expected_after);
 assert.deepEqual(batch107Data.reconciliation_variance,{answer_eligible_unique_sources:0,content_verified_unique_sources:0,answer_eligible_propositions:0});
 assert(batch107Data.deduplication_check.full_index_scan_available);
 assert.deepEqual(batch107Data.deduplication_check.canonical_identity_collisions,[]);
 assert.deepEqual(batch107Data.deduplication_check.missing_canonical_identities,[]);
 assert.equal(batch107Data.deduplication_check.all_target_identities_answer_eligible,true);
}else if(batch107Data.reconciliation_status==='reconciled_with_variance'){
 assert.deepEqual(readinessMetrics(batch107Data.metrics_actual_after),{answer_eligible_unique_sources:1051,content_verified_unique_sources:854,answer_eligible_propositions:3112});
 assert.deepEqual(batch107Data.reconciliation_variance,{answer_eligible_unique_sources:0,content_verified_unique_sources:0,answer_eligible_propositions:1});
 assert(batch107Data.deduplication_check.full_index_scan_available);
 assert.deepEqual(batch107Data.deduplication_check.canonical_identity_collisions,[]);
 assert.deepEqual(batch107Data.deduplication_check.missing_canonical_identities,[]);
 assert.equal(batch107Data.deduplication_check.all_target_identities_answer_eligible,true);
 console.log('BATCH107_RECONCILIATION_METRICS',JSON.stringify({actual:readinessMetrics(batch107Data.metrics_actual_after),expected:batch107Data.metrics_expected_after,variance:batch107Data.reconciliation_variance}));
}else{
 assert.equal(batch107Data.reconciliation_status,'pending');assert.equal(batch107Data.metrics_actual_after,null);
 assert.equal(batch107Data.reconciliation_variance,null);assert.equal(batch107Data.deduplication_check.full_index_scan_pending_reconciliation,true);
}
assert.equal(acquisitionState.manual_web_review.batch_id,'109');
assert.equal(acquisitionState.manual_web_review.batch_file,'data/items/content-research-batch-109-2026-11-16.json');

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
assert.deepEqual(readinessMetrics(batch108Data.metrics_actual_after),{answer_eligible_unique_sources:1051,content_verified_unique_sources:854,answer_eligible_propositions:3112});
assert.deepEqual(batch108Data.reconciliation_variance,{answer_eligible_unique_sources:0,content_verified_unique_sources:0,answer_eligible_propositions:1});
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
assert.equal(acquisitionState.manual_web_review.batch_id,'109');
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
assert.deepEqual(batch109Data.metrics_expected_after,{answer_eligible_unique_sources:1051,content_verified_unique_sources:854,answer_eligible_propositions:3119});
assert.equal(batch109Data.source_body_review.length,8);
assert(batch109Data.source_body_review.every(r=>!('aid' in r)&&!('id' in r)&&!('evidence_family_id' in r)&&r.body_text_inspected&&r.source_grounded_paraphrase_added));
assert.equal(batch109Data.existing_identity_updates.length,8);
assert.equal(new Set(batch109Data.existing_identity_updates.map(x=>String(x.aid))).size,8);
assert.equal(new Set(batch109Data.evidence_family_ids).size,8);
assert.deepEqual(batch109Data.language_distribution,{Hebrew:6,Yiddish:2});
assert(['reconciled','reconciled_with_variance'].includes(batch109Data.reconciliation_status));
const batch109Actual=readinessMetrics(batch109Data.metrics_actual_after);
assert.deepEqual(batch109Actual,metrics);
assert.equal(batch109Actual.answer_eligible_unique_sources,1051);
assert.equal(batch109Actual.content_verified_unique_sources,854);
assert(batch109Actual.answer_eligible_propositions>=3119&&batch109Actual.answer_eligible_propositions<=3120);
assert.deepEqual(batch109Data.reconciliation_variance,{answer_eligible_unique_sources:0,content_verified_unique_sources:0,answer_eligible_propositions:batch109Actual.answer_eligible_propositions-3119});
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
assert.equal(acquisitionState.manual_web_review.batch_id,'109');
assert.equal(acquisitionState.manual_web_review.batch_file,batch109Path);
assert.deepEqual(acquisitionState.manual_web_review_current_metrics,metrics);
