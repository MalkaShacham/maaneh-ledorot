// Check corpus counts against the same normalization used by the live answers.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {normalizeEvidenceIntegrity,buildAnswerModel,citationEntailment} from '../src/answer-engine-validated.js';
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
assert(!queue.records.some(e=>String(e.source_url||'').includes('/aid/4666210/')),'metadata-only AID 4666210 alias must not remain pending after the content-bearing identity is verified');
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
const batch055Required=[
 [2513915,2],[2513926,2],[2513933,5],[2512360,2],[2513548,2],[2513585,2],[2512155,2],[2513564,2],
 [5996764,2],[5996765,4],[5996725,4],[2512365,5],[2512137,4]
];
for(const [aid,minProps] of batch055Required){
 const e=idx.entries.find(x=>String(x.aid)===String(aid));
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
    assert(m.research&&m.research.evidence_families>=3,`${mode}: researcher mode must expose independent-family depth`);
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
  if(!m.answerable) console.log('YESHIVA_DEBUG',JSON.stringify({mode,reason:m.reason,understanding:m.understanding,source_keys:m.sources.map(e=>e.key),source_aids:m.sources.map(e=>e.aid),source_families:m.sources.map(e=>e.evidence_family_id),insufficient:m.insufficient_evidence}));
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
  assert(m.answerable,`${mode}: inspected Lag BaOmer youth evidence must answer the query`);
  assert(m.sources.some(e=>e.evidence_family_id==='lag-baomer-1956-outreach-campaign'),`${mode}: the campaign family must be retrieved`);
  assert(!m.sources.some(e=>['aid:4666207','url:https://www.chabad.org/therebbe/article_cdo/aid/4666217/jewish/page.htm'].includes(e.key)),`${mode}: consolation letters must not match a Lag BaOmer query through generic action words`);
  assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every Lag BaOmer claim needs a proposition-level citation`);
}
const forgetfulnessDreamsQuestion='מה כתב הרבי על שכחה וחלומות?';
for(const mode of ['regular','researcher']){
  const m=buildAnswerModel(idx.entries,forgetfulnessDreamsQuestion,{mode});
  assert(m.answerable,`${mode}: inspected forgetfulness-and-dreams evidence must answer the query`);
  assert(m.sources.some(e=>e.key==='id:igrot-kodesh-v13-דשלג'),`${mode}: letter ד׳שלג must support the forgetfulness-and-dreams answer`);
  assert(m.sources.length<=2,`${mode}: generic mezuzah or health evidence must not flood the specific query`);
  assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every forgetfulness-and-dreams claim needs a proposition-level citation`);
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
  ['מה כתב הרבי על עיסוק במסחר בזמן לימוד בישיבה?','id:igrot-kodesh-v13-דשם']
];
for(const [question,key] of newBatchChecks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    if(!m.answerable) console.log('BATCH018_DEBUG',JSON.stringify({question,mode,reason:m.reason,understanding:m.understanding,source_keys:m.sources.map(e=>e.key),insufficient:m.insufficient_evidence}));
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
 if(!m.answerable)console.log('BEIT_RIVKA_COMPARE_DEBUG',JSON.stringify({mode,reason:m.reason,understanding:m.understanding,source_keys:m.sources.map(e=>e.key),insufficient:m.insufficient_evidence,coverage:m.comparative_coverage}));
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
 const e=idx.entries.find(x=>String(x.aid)===String(aid));
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
 if(!m.answerable)console.log('BATCH062_PUBLICATION_DEBUG',JSON.stringify({mode,reason:m.reason,understanding:m.understanding,sources:m.sources.map(e=>({key:e.key,aid:e.aid,family:e.evidence_family_id,props:e.response_propositions})),insufficient:m.insufficient_evidence,coverage:m.comparative_coverage}));
 assert(m.answerable,mode+': inspected publication and editorial evidence must answer');
 assert(m.sources.length>=3,mode+': publication synthesis must use at least three source families');
 assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=3,mode+': duplicate witnesses must not inflate publication synthesis');
 for(const aid of [4666289,4666300,4666301]) assert(m.sources.some(e=>String(e.aid)===String(aid)),mode+': AID '+aid+' must support publication synthesis');
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length),mode+': every publication claim needs claim-local citations');
 assert(m.citation_entailment.every(x=>x.valid),mode+': publication citations must pass proposition entailment');
 assert(m.context_boundary.every(x=>x.valid),mode+': publication synthesis must preserve witness-local context');
 if(mode==='researcher'){
  console.log('BATCH062_RESEARCH_SOURCES',JSON.stringify({sources:m.sources.map(e=>({aid:e.aid,key:e.key,family:e.evidence_family_id,source_class:e.source_class,witness_type:e.witness_type,primary_secondary_status:e.primary_secondary_status,parent:e.parent_evidence_family_id,independent:e._independent_witness})),integrity:m.research.evidence_integrity}));
  assert(m.research&&m.research.evidence_families>=3,mode+': researcher mode must expose at least three independent families');
  assert(m.research.witnesses.length===m.sources.length,mode+': researcher mode must expose every witness');
  assert(m.research.evidence_map.length>0,mode+': researcher mode must expose a claim-to-witness map');
  assert(m.research.citation_entailment.every(x=>x.valid)&&m.research.context_boundary.every(x=>x.valid),mode+': researcher mode must expose valid claim-local checks');
  assert.equal(m.research.evidence_integrity.derived_non_independent,0,mode+': no translation may be counted as an independent witness');
 }else assert.equal(m.research,undefined,'regular publication mode must not include researcher-only analysis');
}
