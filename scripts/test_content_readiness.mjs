// Check corpus counts against the same normalization used by the live answers.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {normalizeEvidenceIntegrity,buildAnswerModel,citationEntailment} from '../src/answer-engine-validated.js';
const root=new URL('../',import.meta.url);
const sourceAID=e=>{
  if(e?.aid!==undefined&&e?.aid!==null&&String(e.aid).trim())return String(e.aid);
  const match=String(e?.source_url||'').match(/\/aid\/(\d+)(?:\/|$)/);
  return match?match[1]:null;
};
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
const batch073Data=JSON.parse(await readFile(new URL('data/items/content-research-batch-073-2026-11-13.json',root)));
const batch078Data=JSON.parse(await readFile(new URL('data/items/content-research-batch-078-2026-11-13.json',root)));
assert.equal(new Set(queue.records.map(e=>e.key)).size,queue.records.length);
assert(!queue.records.some(e=>String(e.source_url||'').includes('/aid/4666210/')),'metadata-only AID 4666210 alias must not remain pending after the content-bearing identity is verified');
const ready=new Set(eligible.map(e=>e.key));
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
const focusedClassQuestion='מה מתועד במענה המזכירות על תוספת אברכים והרחבת שיעור חסידות?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,focusedClassQuestion,{mode});
 assert(m.answerable,`${mode}: focused class-expansion query must be answerable`);
 assert.deepEqual(m.sources.map(e=>e.key),['id:igrot-kodesh-v13-דתרפא'],`${mode}: class-expansion query must exclude generic livelihood/business letters`);
 assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every focused class-expansion claim needs a proposition citation`);
}

const newBatchChecks=[
  ['מה כתב הרבי על אותיות בולטות במצבה?','id:igrot-kodesh-v13-דשטג'],
  ['האם צריך לסגור סניף תלמוד תורה שאינו מצליח?','id:igrot-kodesh-v13-דשסז'],
  ['מה מתועד במענה המזכירות על תוספת אברכים והרחבת שיעור חסידות?','id:igrot-kodesh-v13-דתרפא'],
  ['מה מתועד במענה המזכירות על מסחר ולימוד יום שלם?','id:igrot-kodesh-v13-דשם']
];
for(const [question,key] of newBatchChecks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-018 evidence must answer ${question}`);
    assert.deepEqual(m.sources.map(e=>e.key),[key],`${mode}: the specific batch-018 query must retrieve only its inspected evidence family`);
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-018 claim needs a proposition-level citation`);
  }
}


const batch018SecretariatItem=idx.entries.find(e=>e.key==='id:igrot-kodesh-v13-דשם');
assert(batch018SecretariatItem&&/secretariat/i.test(batch018SecretariatItem.witness_type||''),'batch-018 item ד׳שס must be explicitly classified as a secretary-signed response');
assert.equal(batch018SecretariatItem.independent_witness,false);
for(const mode of ['regular','researcher']){
 const direct=buildAnswerModel(idx.entries,'מה כתב הרבי על עיסוק במסחר בזמן לימוד בישיבה?',{mode});
 assert(!direct.sources.some(e=>e.key==='id:igrot-kodesh-v13-דשם'),'secretary-signed batch-018 item must not be attributed directly to the Rebbe');
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
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,dailyRoutineQ,{mode});
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
 assert(m.answerable,mode+': two-family study/farming comparison must be answerable');
 assert(m.sources.some(e=>String(e.aid)==='5019408')&&m.sources.some(e=>String(e.aid)==='5054281'),mode+': comparison must cite both distinct letters');
 assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=2);
 assert(m.claims.every(c=>c.source_numbers.length));
 assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));
 if(mode==='researcher'){
  assert(m.research.evidence_families>=2);
  assert(m.research.evidence_map.length>0&&m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));
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
const educationInfluenceQ='מה כתב הרבי על השפעה על יהודי אחד ועל חינוך ילדים יהודים במעשה ולא בדיבור?';for(const mode of ['regular','researcher']){const m=buildAnswerModel(idx.entries,educationInfluenceQ,{mode});assert(m.answerable,mode+': multi-source educational influence/action synthesis must be answerable');assert(m.sources.some(e=>String(e.aid)==='2278256'));assert(m.sources.some(e=>String(e.aid)==='2278261')||m.sources.some(e=>String(e.aid)==='2278254'));assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=2);assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length));assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));if(mode==='researcher'){assert(m.research&&m.research.evidence_families>=2);assert.equal(m.research.witnesses.length,m.sources.length);assert(m.research.evidence_map.length>0&&m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));assert(m.research.citation_entailment.every(x=>x.valid)&&m.research.context_boundary.every(x=>x.valid));}else assert.equal(m.research,undefined);}


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
const acquisitionState=JSON.parse(await readFile(new URL('data/acquisition/latest.json',root),'utf8'));
assert.equal(acquisitionState.manual_web_review.batch_id,'082');
assert.equal(acquisitionState.previous_manual_web_review.batch_id,'081');
assert.deepEqual(acquisitionState.manual_web_review_history.slice(0,3).map(x=>x.batch_id),['082','081','080']);
assert(acquisitionState.manual_web_review_history.some(x=>x.batch_id==='079'));
assert(acquisitionState.manual_web_review_history.some(x=>x.batch_id==='077'));
const batch082Reconciliation=JSON.parse(await readFile(new URL('data/items/content-research-batch-082-2026-11-14.json',root),'utf8'));
assert.equal(batch082Reconciliation.reconciliation_status,acquisitionState.manual_web_review.reconciliation_status);
if(acquisitionState.manual_web_review.reconciliation_status==='reconciled'){
 assert.deepEqual(acquisitionState.manual_web_review_current_metrics,{answer_eligible_unique_sources:833,content_verified_unique_sources:830,answer_eligible_propositions:2707});
 assert.deepEqual(batch082Reconciliation.metrics_actual_after,{answer_eligible_unique_sources:833,content_verified_unique_sources:830,answer_eligible_propositions:2707});
}else{
 assert.equal(acquisitionState.manual_web_review.reconciliation_status,'pending_reconciliation');
 assert.deepEqual(acquisitionState.manual_web_review_current_metrics,{answer_eligible_unique_sources:799,content_verified_unique_sources:796,answer_eligible_propositions:2627});
 assert.equal(batch082Reconciliation.metrics_actual_after,null);
}
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
assert.equal(metrics.answer_eligible_unique_sources,833,'batches 079-082 must reconcile to 833 unique answer-eligible Evidence Families');
assert.equal(metrics.content_verified_unique_sources,830,'batches 079-082 must reconcile to 830 content-verified Evidence Families');
assert.equal(metrics.answer_eligible_propositions,2707,'batches 079-082 must reconcile to 2707 source-grounded propositions');
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
const sadnessQuestion='מה כתוב באיגרת ו׳לג על עצבות בעבודת ה׳ והצלחה בלימודים?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,sadnessQuestion,{mode});
 assert(m.answerable,mode+': the publisher-attributed Hebrew letter must answer the specific sadness-in-divine-service question');
 assert(m.sources.some(e=>String(e.aid)==='5071054'&&e._independent_witness===true));
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length));
 assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));
 if(mode==='researcher')assert(m.research.evidence_map.length>0&&m.research.witnesses.length>=1);
}
const secretaryLowVitalityQuestion='מה מתועד במענה המזכירות על מיעוט חיות בלימוד?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,secretaryLowVitalityQuestion,{mode});
 assert(m.answerable,mode+': the secretary-signed response must answer a neutral secretariat question about low vitality in study');
 assert(m.sources.some(e=>String(e.aid)==='4854525'&&e._independent_witness===false));
 assert(m.sources.every(e=>/secretariat/i.test(e.witness_type||'')));
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length));
 assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));
 if(mode==='researcher')assert(m.research.evidence_map.length>0&&m.research.witnesses.length>=1);
 else assert.equal(m.research,undefined);
}

const confusingThoughtsQuestion='מה מתועד באיגרת על מחשבות מבלבלות והפניית המחשבה לתורה?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,confusingThoughtsQuestion,{mode});
 assert(m.answerable,mode+': prior inspected AID 5100351 paraphrases must support the confusing-thoughts question');
 assert(m.sources.some(e=>sourceAID(e)==='5100351'&&e._independent_witness===true));
}
const publisherAttributedSadnessItem=idx.entries.find(e=>sourceAID(e)==='5071054');
assert(publisherAttributedSadnessItem&&publisherAttributedSadnessItem.witness_type==='published_hebrew_letter_text'&&publisherAttributedSadnessItem.independent_witness===true,'AID 5071054 must remain a publisher-attributed Hebrew letter, not be confused with a secretary-signed response');
const publisherAttributedMoodItem=idx.entries.find(e=>sourceAID(e)==='5100351');
assert(publisherAttributedMoodItem&&publisherAttributedMoodItem.witness_type==='published_hebrew_letter_text'&&publisherAttributedMoodItem.independent_witness===true,'AID 5100351 must remain a publisher-attributed Hebrew letter, not be confused with a secretary-signed response');
const directMoodQuestion='מה כתב הרבי על עצבות ומיעוט חיות בלימוד?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,directMoodQuestion,{mode});
 assert(!m.sources.some(e=>String(e.aid)==='4854525'),mode+': secretary-signed AID 4854525 must not be attributed directly to the Rebbe');
}

// The query follows both inspected propositions: AID 4754232 names תשובה תתאה/עילאה; AID 5019468 describes stages from repentance for sin to תשובה מאהבה.
const batch078TeshuvahQuestion='מה מתארות האיגרות על מדרגות התשובה, מתשובה על חטא ועד תשובה מאהבה?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,batch078TeshuvahQuestion,{mode});
 assert(m.answerable,mode+': new teshuvah sources must support a multi-source answer');
 assert(m.sources.some(e=>sourceAID(e)==='4754232'));
 assert(m.sources.some(e=>sourceAID(e)==='5019468'));
 assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=2);
 assert(m.claims.every(c=>c.source_numbers.length));
 if(mode==='researcher')assert(m.research.evidence_map.length>0&&m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));
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

 
// Batch 079: fifteen publisher bodies inspected; nine candidate identities, two in-place enrichments and four rechecks.
const batch079Path='data/items/content-research-batch-079-2026-11-13.json';
const batch079Data=JSON.parse(await readFile(new URL(batch079Path,root)));
assert.equal(batch079Data.records_reviewed,15);
assert.equal(batch079Data.source_bodies_inspected,15);
assert.equal(batch079Data.records.length,9);
assert.equal(batch079Data.new_source_identities,9);
assert.equal(batch079Data.existing_identities_enriched,2);
assert.equal(batch079Data.existing_identities_rechecked,4);
assert.equal(batch079Data.new_response_propositions,18);
assert.equal(batch079Data.existing_response_propositions_added,2);
assert.equal(batch079Data.response_propositions_added,20);
assert.equal(batch079Data.answer_eligible_source_families_added,9);
assert.equal(batch079Data.blocked_candidate_count,5);
assert.equal(batch079Data.crawler_retry,false);
assert.equal(batch079Data.access_control_bypassed,false);
assert.equal(batch079Data.full_text_copied,false);
assert.equal(new Set(batch079Data.records.map(e=>e.evidence_family_id)).size,9);
assert.equal(batch079Data.records.filter(e=>e.language==='Yiddish').length,1);
const batch079Required=[[4831007,2,'igrot-public-letter-5713-15-kislev-aid4831007','Hebrew'],[4831137,2,'igrot-public-letter-5713-11-nisan-aid4831137','Hebrew'],[4831186,2,'igrot-letter-5713-b-kig-aid4831186','Hebrew'],[4831187,3,'igrot-letter-5713-23-iyar-aid4831187','Yiddish'],[4831315,2,'igrot-public-letter-5713-first-selichot-aid4831315','Hebrew'],[5357370,1,'igrot-letter-excerpt-5714-28-shevat-aid5357370','Hebrew'],[5100610,2,'igrot-letter-5719-16-iyar-aid5100610','Hebrew'],[5100451,2,'igrot-letter-5719-1-adar-rishon-aid5100451','Hebrew'],[5100615,2,'igrot-letter-5719-18-iyar-aid5100615','Hebrew']];
for(const [aid,minProps,family,language] of batch079Required){
 const e=idx.entries.find(x=>sourceAID(x)===String(aid));
 assert(e&&e.has_content_evidence,'batch-079 AID '+aid+' must have inspected publisher body text');
 assert.equal(e.status,'Verified');
 assert.equal(e.evidence_family_id,family);
 assert(e.response_propositions.length>=minProps);
 assert.equal(e.language,language);
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope);
 assert.equal(e.context_status,'partial');
 assert.equal(e.independent_witness,true);
 assert.equal(e.translation_of_evidence_family_id,null);
 assert.equal(e.canonical_file,batch079Path,'AID '+aid+' must be a distinct canonical identity, not a duplicate alias');
 assert(!queue.records.some(q=>String(q.key||'')==='aid:'+aid||String(q.source_url||'').includes('/aid/'+aid+'/')));
}
console.log('AID4812708_INDEX_DEBUG',JSON.stringify(idx.entries.filter(e=>sourceAID(e)==='4812708').map(e=>({canonical_file:e.canonical_file,id:e.id,aid:e.aid,proposition_count:e.response_propositions?.length,proposition_origin:e.proposition_origin,proposition_verification:e.proposition_verification,proposition_source_locator:e.proposition_source_locator,witness_type:e.witness_type,independent_witness:e.independent_witness,verification_scope:e.verification_scope,context_status:e.context_status,integrity_issues:e._evidence_integrity_issues,first:e.response_propositions?.[0],last:e.response_propositions?.slice(-1)[0]})),null,2));
const enriched4812708=idx.entries.find(e=>sourceAID(e)==='4812708');
assert(enriched4812708&&enriched4812708.response_propositions.some(p=>p.includes('זיכוך העולם')&&p.includes('משיח')));
assert.equal(enriched4812708.evidence_family_id,'igrot-letter-5712-25-sivan-aid4812708');
assert.equal(enriched4812708.canonical_file,'data/items/content-research-batch-065-2026-11-13.json');
const enriched5071118=idx.entries.find(e=>sourceAID(e)==='5071118');
assert(enriched5071118&&enriched5071118.response_propositions.some(p=>p.includes('שולחן ערוך')&&p.includes('תועלת המעשית')));
assert.equal(enriched5071118.evidence_family_id,'igrot-letter-5718-7-adar-v16-aid5071118');
assert.equal(enriched5071118.canonical_file,'data/items/content-research-batch-057-2026-11-12.json');
const communityActivityQ='מה עולה מן האיגרות על התוועדויות ופעילות קהילתית, לימוד ומעשה בפועל?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,communityActivityQ,{mode});
 assert(m.answerable,mode+': distinct community activity correspondence must support a bounded synthesis');
 assert(m.sources.some(e=>sourceAID(e)==='4831007'),mode+': holiday farbrengen letter must be retrieved');
 assert(m.sources.some(e=>sourceAID(e)==='5357370')||m.sources.some(e=>sourceAID(e)==='4831187'),mode+': a second distinct gathering/communal responsibility source must be retrieved');
 assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=2);
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length));
 assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));
 assert(m.synthesis&&m.synthesis.topic==='community_gatherings_and_shared_responsibility');
 assert.equal(m.synthesis.attribution,'system_synthesis_not_rebbe_quote');
 assert(m.synthesis.claims.length>=2&&m.synthesis.claims.every(c=>c.source_locators.length));
 if(mode==='researcher'){
  assert(m.research&&m.research.evidence_families>=2);
  assert(m.research.evidence_map.length>0&&m.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)));
  assert(m.research.citation_entailment.every(x=>x.valid)&&m.research.context_boundary.every(x=>x.valid));
 }else assert.equal(m.research,undefined);
}
const freedomQ='מה מתארת האיגרת על יציאת מצרים יומיומית וחירות רוחנית ממגבלות הגוף?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,freedomQ,{mode});
 assert(m.answerable,mode+': the inspected public Pesach letter must be retrievable');
 assert(m.sources.some(e=>sourceAID(e)==='4831137'));
 assert(m.claims.every(c=>c.source_numbers.length));
 assert(m.citation_entailment.every(x=>x.valid));
}
const microcosmQ='מה נכתב על האדם כעולם קטן, דומם צומח חי ומדבר וקידוש ממדי החיים?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,microcosmQ,{mode});
 assert(m.answerable,mode+': the inspected Rosh Hashanah letter must be retrievable');
 assert(m.sources.some(e=>sourceAID(e)==='4831315'));
 assert(m.claims.every(c=>c.source_numbers.length));
 assert(m.citation_entailment.every(x=>x.valid));
}


const batch080Path='data/items/content-research-batch-080-2026-11-13.json';
const batch080Data=JSON.parse(await readFile(new URL(batch080Path,root)));
assert.equal(batch080Data.records.length,10,'batch-080 must contain ten body-inspected source identities');
assert.equal(batch080Data.source_bodies_inspected,10);
assert.equal(batch080Data.new_source_identities,10);
assert.equal(batch080Data.new_rebbe_letter_identities,8);
assert.equal(batch080Data.new_secretariat_document_identities,2);
assert.equal(batch080Data.existing_identities_enriched,1);
assert.equal(batch080Data.existing_identity_rechecks.length,15);
assert.equal(batch080Data.blocked_candidate_count,3);
assert.equal(batch080Data.new_response_propositions,19);
assert.equal(batch080Data.response_propositions_added,19);
assert.equal(batch080Data.existing_response_propositions_added,0);
assert.equal(new Set(batch080Data.records.map(r=>String(r.aid))).size,10);
assert.equal(new Set(batch080Data.records.map(r=>r.evidence_family_id)).size,10);
assert.equal(new Set(batch080Data.records.map(r=>r.source_url)).size,10);
assert.equal(batch080Data.records.filter(r=>r.language==='Hebrew').length,6);
assert.equal(batch080Data.records.filter(r=>r.language==='English').length,4);
assert.equal(metrics.answer_eligible_unique_sources,833,'batches 079-082 must reconcile to 833 unique answer-eligible Evidence Families');
assert.equal(metrics.content_verified_unique_sources,830,'batches 079-082 must reconcile to 830 content-verified Evidence Families');
assert.equal(metrics.answer_eligible_propositions,2707,'batches 079-082 must reconcile to 2707 source-grounded propositions');
for(const r of batch080Data.records){
 const e=idx.entries.find(x=>sourceAID(x)===String(r.aid));
 assert(e&&e.has_content_evidence,'batch-080 AID '+r.aid+' must be present with content evidence');
 assert.equal(e.status,'Verified','batch-080 AID '+r.aid+' must retain scoped publisher-text verification');
 assert.equal(e.canonical_file,batch080Path);
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope);
 assert.equal(e.response_proposition_locators.length,e.response_propositions.length);
 assert(e.response_proposition_locators.every(Boolean));
}
for(const aid of ['4872065','4831497']){
 const e=idx.entries.find(x=>sourceAID(x)===aid);
 assert(e&&/secretariat/i.test(e.witness_type||''),'batch-080 AID '+aid+' must retain secretariat authorship classification');
 assert.equal(e.independent_witness,false,'secretariat letters are not independent Rebbe-authored witnesses');
}
for(const aid of ['2277929','2278502','4264336','3905730']){
 const e=idx.entries.find(x=>sourceAID(x)===aid);
 assert(e&&/translation/i.test(e.witness_type||''),'batch-080 AID '+aid+' must be labelled as a published translation');
 assert.equal(e.independent_witness,false,'translations must not count as independent witnesses');
}
const volume13Secretariat=idx.entries.find(e=>e.id==='igrot-kodesh-v13-דשם');
assert(volume13Secretariat&&/secretariat/i.test(volume13Secretariat.witness_type||''));
assert.equal(volume13Secretariat.independent_witness,false);
const secretariatQuestion='מה מתועד במענה המזכירות על מסחר ולימוד יום שלם?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,secretariatQuestion,{mode});
 assert(m.answerable,mode+': a neutral question about the secretariat letter must be answerable');
 assert(m.sources.some(e=>e.key==='id:igrot-kodesh-v13-דשם'));
 assert(m.sources.every(e=>/secretariat/i.test(e.witness_type||'')));
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length));
 assert(m.citation_entailment.every(x=>x.valid));
 const direct=buildAnswerModel(idx.entries,'מה כתב הרבי על עיסוק במסחר בזמן לימוד בישיבה?',{mode});
 assert.equal(direct.answerable,false,mode+': do not attribute a secretary-signed response directly to the Rebbe');
 assert.equal(direct.reason,'secretariat_authorship_boundary');
 assert(direct.sources.some(e=>e.key==='id:igrot-kodesh-v13-דשם'));
}



const batch081Path='data/items/content-research-batch-081-2026-11-13.json';
const batch081Data=JSON.parse(await readFile(new URL(batch081Path,root)));
assert.equal(batch081Data.records.length,9);
assert.equal(batch081Data.source_bodies_inspected,10);
assert.equal(batch081Data.new_source_identities,9);
assert.equal(batch081Data.existing_identities_enriched,7);
assert.equal(batch081Data.existing_identities_rechecked,1);
assert.equal(batch081Data.blocked_candidate_count,4);
assert.equal(batch081Data.new_response_propositions,22);
assert.equal(batch081Data.response_propositions_added,22);
assert.equal(batch081Data.existing_response_propositions_added,0);
assert.equal(batch081Data.existing_identity_updates.length,7);
assert.equal(new Set(batch081Data.records.map(r=>String(r.aid))).size,9);
assert.equal(new Set(batch081Data.records.map(r=>r.evidence_family_id)).size,9);
assert.equal(new Set(batch081Data.records.map(r=>r.source_url)).size,9);
assert.equal(batch081Data.records.filter(r=>r.language==='Hebrew').length,9);
assert.equal(batch081Data.records.filter(r=>r.type==='letter-fragment').length,1);
for(const r of batch081Data.records){
 const e=idx.entries.find(x=>sourceAID(x)===String(r.aid));
 assert(e&&e.has_content_evidence);
 assert.equal(e.status,'Verified');
 assert.equal(e.canonical_file,batch081Path);
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope);
 assert.equal(e.response_proposition_locators.length,e.response_propositions.length);
 assert(e.response_proposition_locators.every(Boolean));
 assert.equal(e.independent_witness,true);
}
for(const id of ['igrot-kodesh-v13-דתרע','igrot-kodesh-v13-דתרעב','igrot-kodesh-v13-דתרעו','igrot-kodesh-v13-דתרעח','igrot-kodesh-v13-דתרפא','igrot-kodesh-v13-דתרפב','igrot-kodesh-v13-דתרפג']){
 const e=idx.entries.find(x=>x.id===id);
 assert(e&&/secretariat/i.test(e.witness_type||''));
 assert.equal(e.independent_witness,false);
}
const secretariatClassQ='מה מתועד במענה המזכירות על תוספת אברכים והרחבת שיעור חסידות?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,secretariatClassQ,{mode});
 assert(m.answerable,mode+': secretary-signed class-expansion response must be retrievable when asked neutrally');
 assert(m.sources.some(e=>e.key==='id:igrot-kodesh-v13-דתרפא'));
 assert(m.sources.every(e=>/secretariat/i.test(e.witness_type||'')));
 const direct=buildAnswerModel(idx.entries,'מה כתב הרבי על תוספת אברכים והרחבת שיעור חסידות?',{mode});
 assert.equal(direct.answerable,false);
 assert.equal(direct.reason,'secretariat_authorship_boundary');
}


// Batch 082: six new Hebrew publisher identities, two in-place secretariat reclassifications,
// and two rechecks. Only the six new Evidence Families add to answer-readiness counts.
const batch082Path='data/items/content-research-batch-082-2026-11-14.json';
const batch082Data=JSON.parse(await readFile(new URL(batch082Path,root)));
assert.equal(batch082Data.records.length,6);
assert.equal(batch082Data.source_bodies_inspected,10);
assert.equal(batch082Data.new_source_identities,6);
assert.equal(batch082Data.existing_identities_enriched,2);
assert.equal(batch082Data.existing_identities_rechecked,2);
assert.equal(batch082Data.existing_secretariat_reclassifications,2);
assert.equal(batch082Data.new_response_propositions,16);
assert.equal(batch082Data.response_propositions_added,16);
assert.equal(batch082Data.existing_response_propositions_added,0);
assert.equal(batch082Data.blocked_candidate_count,35);
assert.equal(batch082Data.records.reduce((n,r)=>n+r.response_propositions.length,0),16);
assert.equal(new Set(batch082Data.records.map(r=>String(r.aid))).size,6);
assert.equal(new Set(batch082Data.records.map(r=>r.evidence_family_id)).size,6);
assert.equal(new Set(batch082Data.records.map(r=>r.source_url)).size,6);
for(const r of batch082Data.records){
 const e=idx.entries.find(x=>sourceAID(x)===String(r.aid));
 assert(e&&e.has_content_evidence,'batch-082 AID '+r.aid+' must have inspected publisher body text');
 assert.equal(e.status,'Verified');
 assert.equal(e.canonical_file,batch082Path);
 assert.equal(e.evidence_family_id,r.evidence_family_id);
 assert.equal(e.proposition_origin,'source_grounded_paraphrase');
 assert.equal(e.proposition_verbatim,false);
 assert.equal(e.proposition_verification,'source_text_inspected');
 assert(e.proposition_source_locator&&e.verification_scope);
 assert.equal(e.response_proposition_locators.length,e.response_propositions.length);
 assert(e.response_proposition_locators.every(Boolean));
 assert.equal(e.context_status,'partial');
 assert.equal(e.language,'Hebrew');
 assert(!queue.records.some(q=>String(q.key||'')==='aid:'+r.aid||String(q.source_url||'').includes('/aid/'+r.aid+'/')));
}
const expectedIndexLocators082={
 '4754363':{volume:'4',page:16},
 '4754536':{volume:'4',page:22},
 '4812831':{volume:'6',page:12},
 '5054581':{volume:'15',page:15},
 '5100309':{volume:'18',page:6}
};
for(const [aid,expected] of Object.entries(expectedIndexLocators082)){
 const r=batch082Data.records.find(x=>String(x.aid)===aid);
 assert(r&&r.locator.index_pdf_page===expected.page&&r.locator.volume===expected.volume,'AID '+aid+' must carry only the corroborated printed-index locator');
 assert(/bibliographic locator only/i.test(r.provenance.index_locator_verification_scope),'AID '+aid+' index must be explicitly locator-only, not content verification');
 assert(!/bibliographic identity|bibliographic_locator_verified_only|index-first/i.test(r.verification_scope),'AID '+aid+' content verification scope must remain body-only; index metadata must not make it locator-only');
 assert(r.proposition_source_locator.includes('body lines'),'AID '+aid+' content propositions must continue to cite the inspected publisher body');
}
const noIndexLocator082=batch082Data.records.find(x=>String(x.aid)==='5100438');
assert(noIndexLocator082&&!('index_pdf_page' in noIndexLocator082.locator),'AID 5100438 must not receive an unverified volume-index locator');

for(const aid of ['5100309','5054581']){
 const e=idx.entries.find(x=>sourceAID(x)===aid);
 assert(e&&/secretariat/i.test(e.witness_type||''),'AID '+aid+' must be identified as a secretariat response');
 assert.equal(e.independent_witness,false);
}
for(const aid of ['4854786','4854525']){
 const e=idx.entries.find(x=>sourceAID(x)===aid);
 assert(e&&/secretariat/i.test(e.witness_type||''),'existing AID '+aid+' must retain the corrected secretariat classification');
 assert.equal(e.independent_witness,false);
 assert(e.provenance?.signature_status);
}
for(const aid of ['5100579','4854804']){
 const e=idx.entries.find(x=>sourceAID(x)===aid);
 assert(e&&e.has_content_evidence&&e.response_propositions.length>=2,'rechecked AID '+aid+' must retain its prior propositions without duplication');
}
const secretaryReturnQ='מה מתועד במענה המזכירות לגבי תלמיד שהתגייס ומבקש לחזור לישיבה?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,secretaryReturnQ,{mode});
 assert(m.answerable,mode+': a neutral secretariat question about enlistment and return to yeshiva must be answerable');
 assert(m.sources.some(e=>sourceAID(e)==='5100309'));
 assert(m.sources.every(e=>/secretariat/i.test(e.witness_type||'')));
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length));
 assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));
 const direct=buildAnswerModel(idx.entries,'מה כתב הרבי על תלמיד שהתגייס ומבקש לחזור לישיבה?',{mode});
 assert(!direct.sources.some(e=>sourceAID(e)==='5100309'),'secretariat response must not be attributed directly to the Rebbe');
}
const tanyaProjectQBatch082='מה כתב הרבי על פרויקט תניא והפצת המעיינות?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,tanyaProjectQBatch082,{mode});
 assert(m.answerable,mode+': the publisher-attributed Tanya project letter must remain retrievable');
 assert(m.sources.some(e=>sourceAID(e)==='5071046'&&e._independent_witness!==false),'AID 5071046 must not be falsely classified as secretary-signed merely because its signature status says a secretariat copy was not inspected');
 assert(m.claims.length>0&&m.claims.every(c=>c.source_numbers.length));
 assert(m.citation_entailment.every(x=>x.valid)&&m.context_boundary.every(x=>x.valid));
}
const indexHtml=await readFile(new URL('index.html',root),'utf8');
const sourceCardStart=indexHtml.indexOf('function sourceCard');
const sourceCardEnd=indexHtml.indexOf('function sources',sourceCardStart);
const sourceCardText=indexHtml.slice(sourceCardStart,sourceCardEnd);
assert.equal((sourceCardText.match(/const url=/g)||[]).length,1,'sourceCard must not redeclare const url; the duplicate declaration breaks the page script');
