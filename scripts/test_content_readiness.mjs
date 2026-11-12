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
  assert(m.answerable,`${mode}: inspected yeshiva-enrollment evidence must answer the query`);
  assert(m.sources.some(e=>e.key==='id:igrot-scan-v13-letter-4-319'),`${mode}: letter ד׳שיט must support the enrollment answer`);
  assert(m.sources.length<=3,`${mode}: broad education evidence must not flood a specific enrollment-policy answer`);
  assert(m.sources.every(e=>['id:igrot-scan-v13-letter-4-284','id:igrot-scan-v13-letter-4-292','id:igrot-scan-v13-letter-4-319'].includes(e.key)),`${mode}: only inspected enrollment propositions may enter the answer`);
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
const newBatchChecks=[
  ['מה כתב הרבי על אותיות בולטות במצבה?','id:igrot-kodesh-v13-דשטג'],
  ['האם צריך לסגור סניף תלמוד תורה שאינו מצליח?','id:igrot-kodesh-v13-דשסז'],
  ['כיצד להגדיל משתתפים בכיתות לימוד בלי להזניח לימוד אישי?','id:igrot-scan-v13-letter-4-368'],
  ['מה כתב הרבי על עיסוק במסחר בזמן לימוד בישיבה?','id:igrot-kodesh-v13-דשם']
];
for(const [question,key] of newBatchChecks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-018 evidence must answer ${question}`);
    assert.deepEqual(m.sources.map(e=>e.key),[key],`${mode}: the specific batch-018 query must retrieve only its inspected evidence family`);
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-018 claim needs a proposition-level citation`);
  }
}
const batch019Checks=[
  ['האם צריך ללמוד זוהר לפני שמתחילים ללמוד חסידות?','id:igrot-scan-v13-letter-4-371'],
  ['כיצד להשפיע על כיסוי ראש כששכנוע ישיר לא מצליח?','id:igrot-kodesh-v13-דשעב'],
  ['מה כתב הרבי לאדם שנמצא בטיפול רופאים מומחים והתקשה בלימוד?','id:igrot-kodesh-v13-דשעג'],
  ['מה הציע הרבי לגבי בית מרקחת ושם כפר חב״ד?','id:igrot-kodesh-v13-דשעו'],
  ['מה כתב הרבי לסניף נשי חב״ד במונטריאול על הרחבת הפעילות?','id:igrot-kodesh-v13-דשעט']
];
for(const [question,key] of batch019Checks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-019 evidence must answer ${question}`);
    assert.deepEqual(m.sources.map(e=>e.key),[key],`${mode}: the specific batch-019 query must retrieve only its inspected evidence family`);
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-019 claim needs a proposition-level citation`);
  }
}
const batch020Checks=[
  ['האם לחכות לידיעה שלמה לפני הפצת המעיינות?','id:igrot-scan-v13-letter-4-380'],
  ['מה כתב הרבי על שתילי אתרוגי קלבריה שניטעו בארץ?','id:igrot-scan-v13-letter-4-381'],
  ['כיצד לנהוג כשכוח הזיכרון מתעייף בזמן הלימוד?','id:igrot-kodesh-v13-דשפט'],
  ['כיצד לבחור מקום לבניין ישיבה ליד בתי ספר למלאכה?','id:igrot-scan-v13-letter-4-385'],
  ['מה כתב הרבי על ניטל לפי הלוח היוליאני או הגרגוריאני?','id:igrot-scan-v13-letter-4-391']
];
for(const [question,key] of batch020Checks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-020 evidence must answer ${question}`);
    assert(m.sources.some(e=>e.key===key),`${mode}: the specific batch-020 witness must be retrieved for ${question}`);
    assert(m.sources.length<=(mode==='researcher'?10:5),`${mode}: the specific batch-020 query must not be flooded by generic evidence`);
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-020 claim needs a proposition-level citation`);
  }
}
const draft=eligible.find(e=>String(e.aid)==='4422914');
assert(draft && /draft/.test(draft.primary_secondary_status),'publisher draft limitation must be preserved');
const batch021Checks=[
  ['האם לימוד נגלה פוטר מלימוד חסידות?','id:igrot-scan-v13-letter-4-392'],
  ['לימודי חול בחצי יום הראשון בבית רבקה','id:igrot-scan-v13-letter-4-397'],
  ['כתבי היד של החסיד משה יצחק מיאס','id:igrot-scan-v13-letter-4-399'],
  ['כיצד הוצע לפתור את שאלת המניין ליד הדירות החדשות בכפר חב״ד?','id:igrot-kodesh-v13-דתג'],
  ['משמרות אמירת תהלים ולימוד חסידות בכפר חב״ד','id:igrot-kodesh-v13-דתד']
];
for(const [question,key] of batch021Checks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-021 evidence must answer ${question}`);
    assert(m.sources.some(e=>e.key===key),`${mode}: the specific batch-021 witness must be retrieved for ${question}`);
    assert(m.sources.length<=(mode==='researcher'?8:4),`${mode}: the specific batch-021 query must not be flooded by generic evidence`);
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-021 claim needs a proposition-level citation`);
  }
}
const batch022Checks=[
  ['מה כתב הרבי על תצלום התנאים, סופי השורות וקנס?','id:igrot-kodesh-v13-דתו'],
  ['כיצד הציע הרבי להתמודד עם מחשבות בלתי רצויות?','id:igrot-kodesh-v13-דתח'],
  ['האם משמעת תקיפה מחייבת להקל ולרחם?','id:igrot-kodesh-v13-דתי'],
  ['מה כתב הרבי לרב הרצוג על רדיואקטיביות והסקה על גיל העולם?','id:igrot-kodesh-v13-דתיד'],
  ['מדוע הודגש הידור חיצוני בחוברת בטורונטו?','id:igrot-kodesh-v13-דתיז']
];
for(const [question,key] of batch022Checks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-022 evidence must answer ${question}`);
    assert(m.sources.some(e=>e.key===key),`${mode}: the specific batch-022 witness must be retrieved for ${question}`);
    if(m.sources.length>(mode==='researcher'?8:4)) console.log('BATCH022_OVERRETRIEVAL',JSON.stringify({mode,question,source_keys:m.sources.map(e=>e.key),source_titles:m.sources.map(e=>e.title)}));
    assert(m.sources.length<=(mode==='researcher'?8:4),`${mode}: the specific batch-022 query must not be flooded by generic evidence: ${question}; sources=${m.sources.map(e=>e.key).join(',')}`);
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-022 claim needs a proposition-level citation`);
  }
}
const batch023Checks=[
  ['מה כתב הרבי על דחיית חתונה בגלל הוצאות דירה מופרזות?','id:igrot-kodesh-v13-דתכג'],
  ['מה מקור המנהג להרכין את הראש בקדיש ולגעת בתחילת ובסוף מקום הקריאה?','id:igrot-kodesh-v13-דתכה'],
  ['האם לענות לשאלות באותו מפגש או במפגש הבא בעבודת נשים?','id:igrot-kodesh-v13-דתכח'],
  ['מדוע צריך לנקוב בסכום מסוים כשמתחייבים לצדקה?','id:igrot-kodesh-v13-דתל'],
  ['מתי אומרים תהלים בלילה והאם לבטל שיעורים קבועים לשם כך?','id:igrot-kodesh-v13-דתלג']
];
for(const [question,key] of batch023Checks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-023 evidence must answer ${question}`);
    assert(m.sources.some(e=>e.key===key),`${mode}: the specific batch-023 witness must be retrieved for ${question}`);
    assert(m.sources.length<=(mode==='researcher'?8:4),`${mode}: the specific batch-023 query must not be flooded by generic evidence: ${question}; sources=${m.sources.map(e=>e.key).join(',')}`);
    if(question.includes('סכום מסוים')){
      assert.equal(m.sources.length,1,`${mode}: the fixed-amount charity pledge query must return only its directly supporting witness`);
      assert.equal(m.sources[0].key,key,`${mode}: generic charity or amount mentions must not displace the specific pledge letter`);
    }
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-023 claim needs a proposition-level citation`);
  }
}
const batch024Checks=[
  ['מתי לקבוע מזוזה כשנכנסים לדירה חדשה?','id:igrot-kodesh-v13-דתמג'],
  ['כיצד צריך משגיח לענות לתלמידים ששואלים הרבה?','id:igrot-kodesh-v13-דתמה'],
  ['כיצד לתאם פעילות להפצת חסידות בביקורו של אוריאל צימר בארץ?','id:igrot-kodesh-v13-דתמו'],
  ['כיצד הציע הרבי להתמודד עם קושי להבין ייסורים וחסרונות של אנשים?','id:igrot-kodesh-v13-דתמד'],
  ['האם להמתין להזדמנות כדי לפעול לחיזוק היהדות?','id:igrot-kodesh-v13-דתמט']
];
for(const [question,key] of batch024Checks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-024 evidence must answer ${question}`);
    assert(m.sources.some(e=>e.key===key),`${mode}: the specific batch-024 witness must be retrieved for ${question}`);
    assert(m.sources.length<=(mode==='researcher'?8:4),`${mode}: the specific batch-024 query must not be flooded by generic evidence`);
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-024 claim needs a proposition-level citation`);
  }
}
const batch025Checks=[
  ['מה כתב הרבי על ניתוח להסרת שקדים וחוות דעת של שני מומחים?','id:igrot-kodesh-v13-דתנג'],
  ['כיצד הוצע לממן פתיחת בית ספר לבנות במלבורן?','id:igrot-kodesh-v13-דתנו'],
  ['האם הבדל אשכנזי ספרדי הוא סיבה לדחות שידוך?','id:igrot-kodesh-v13-דתנז'],
  ['מה הציע הרבי לאיגוד הרבנים לגבי צמצום שעות לימודי חול?','id:igrot-kodesh-v13-דתנח'],
  ['מה כתב הרבי על נסיעה עם תינוק בן פחות משנה ועל קבלת עצה רוחנית?','id:igrot-kodesh-v13-דתסד']
];
for(const [question,key] of batch025Checks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-025 evidence must answer ${question}`);
    assert(m.sources.some(e=>e.key===key),`${mode}: the specific batch-025 witness must be retrieved for ${question}`);
    assert(m.sources.length<=(mode==='researcher'?8:4),`${mode}: the specific batch-025 query must not be flooded by generic evidence`);
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-025 claim needs a proposition-level citation`);
  }
}
const batch026Checks=[
  ['האם מתאים לדבר על גלגול נשמות עם מי שאינו שומר מצוות?','id:igrot-kodesh-v13-דתעב'],
  ['כיצד צריך להודיע להנהלת בית ספר על עניין מוסדי?','id:igrot-kodesh-v13-דתעא'],
  ['מה לעשות כשהורים מתנגדים ללימוד חסידות?','id:igrot-kodesh-v13-דתעד'],
  ['האם בחור ישיבה צריך להפסיק ללמוד בגלל יחס לא ראוי?','id:igrot-kodesh-v13-דתעז'],
  ['כיצד הציע הרבי לסניף נשי חב״ד בלונדון לנצל את הקיץ?','id:igrot-kodesh-v13-דתפ']
];
for(const [question,key] of batch026Checks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-026 evidence must answer ${question}`);
    assert(m.sources.some(e=>e.key===key),`${mode}: the specific batch-026 witness must be retrieved for ${question}`);
    assert(m.sources.length<=(mode==='researcher'?8:4),`${mode}: the specific batch-026 query must not be flooded by generic evidence`);
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-026 claim needs a proposition-level citation`);
  }
}
const batch027Checks=[
  ['האם לפרסם מי יזם חלוקת מצה שמורה?','id:igrot-kodesh-v13-דתפז'],
  ['כיצד לתאם בין שני רופאים מומחים שנותנים חוות דעת?','id:igrot-kodesh-v13-דתפז'],
  ['האם צריך מיקרופון בסידור קידושין בחצר?','id:igrot-kodesh-v13-דתפח'],
  ['כיצד לנצל את חופשת הקיץ בסניף נשי חב״ד בטורונטו?','id:igrot-kodesh-v13-דתצב'],
  ['כיצד מכסים את העיניים והפה בעטיפת טלית גדול?','id:igrot-kodesh-v13-דתצג']
];
for(const [question,key] of batch027Checks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-027 evidence must answer ${question}`);
    assert(m.sources.some(e=>e.key===key),`${mode}: the specific batch-027 witness must be retrieved for ${question}`);
    assert(m.sources.length<=(mode==='researcher'?8:4),`${mode}: the specific batch-027 query must not be flooded by generic evidence`);
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-027 claim needs a proposition-level citation`);
  }
}
const batch028Checks=[
  ['באיזה סדר הוצע ללמוד חסידות, מאיגרת התשובה ואילך?','id:igrot-kodesh-v13-דתצט'],
  ['האם מרחק ממקום שיעור חסידות הוא סיבה לא להשתתף?','id:igrot-kodesh-v13-דתקב'],
  ['מה כתב הרבי על הקשר בין שמחה לשינויים הורמונליים וחומרנות?','id:igrot-kodesh-v13-דתקא'],
  ['האם אפשר להסביר את הפיגוע בכפר חב״ד לפי האיגרת?','id:igrot-kodesh-v13-דתקו'],
  ['מה קודם בכפר חב״ד: בית הטבילה או בית הכנסת?','id:igrot-kodesh-v13-דתקח-star']
];
for(const [question,key] of batch028Checks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-028 evidence must answer ${question}`);
    assert(m.sources.some(e=>e.key===key),`${mode}: the specific batch-028 witness must be retrieved for ${question}`);
    assert(m.sources.length<=(mode==='researcher'?8:4),`${mode}: the specific batch-028 query must not be flooded by generic evidence`);
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-028 claim needs a proposition-level citation`);
  }
}
const batch029Checks=[
  ['מה הקשר בין קושי להתרכז בתפילה לבין קביעות בלימוד תורה?','id:igrot-kodesh-v13-דתקי'],
  ['מה הובהר על מכתב קודם שנחתם בידי המזכירות?','id:igrot-kodesh-v13-דתקיא'],
  ['מה קודם בתפילין של ראש: הידוק במקום או יישור הבתים?','id:igrot-kodesh-v13-דתקיז'],
  ['כיצד הוצע להשפיע על חבר ילדות שהתרחק מן הסביבה החרדית?','id:igrot-kodesh-v13-דתקיט'],
  ['למה מחנה קיץ מתאים במיוחד לחינוך כשאין לימודי חול?','id:igrot-kodesh-v13-דתקכג']
];
for(const [question,key] of batch029Checks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-029 evidence must answer ${question}`);
    assert(m.sources.some(e=>e.key===key),`${mode}: the specific batch-029 witness must be retrieved for ${question}`);
    assert(m.sources.length<=(mode==='researcher'?8:4),`${mode}: the specific batch-029 query must not be flooded by generic evidence`);
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-029 claim needs a proposition-level citation`);
  }
}
const batch030Checks=[
  ['למה הומלץ לבחור ללמוד עוד שלוש או ארבע שנים לימודי קודש במקום אנגלית וכימיה?','id:igrot-kodesh-v13-דתקכד'],
  ['מה קודם בהקמת בית ספר לבנות בכפר חב״ד: שיפור הבניין או סגל המורים ורמת הלימודים?','id:igrot-kodesh-v13-דתקכו'],
  ['מה נכתב על נוסעים שביטלו הפלגה בשבת וקבלת החזר כספי?','id:igrot-kodesh-v13-דתקלא'],
  ['האם להתחיל בחידושים בלימוד חסידות לפני לימוד והבנה?','id:igrot-kodesh-v13-דתקלד'],
  ['האם מותר לשנות מנוסח אשכנז לספרד ומספרד לנוסח האר״י?','id:igrot-kodesh-v13-דתקלז']
];
for(const [question,key] of batch030Checks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-030 evidence must answer ${question}`);
    assert(m.sources.some(e=>e.key===key),`${mode}: the specific batch-030 witness must be retrieved for ${question}`);
    assert(m.sources.length<=(mode==='researcher'?8:4),`${mode}: the specific batch-030 query must not be flooded by generic evidence`);
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-030 claim needs a proposition-level citation`);
  }
}
const batch031Checks=[
  ['כיצד הציע הרבי להתמודד עם קושי בריכוז בלימוד?','id:igrot-kodesh-v13-דתקמג'],
  ['האם העדר חבר לימוד פוטר מלימוד חסידות?','id:igrot-kodesh-v13-דתקמה'],
  ['באיזה תנאי כדאי לפתוח סניף דואר בכפר חב״ד?','id:igrot-kodesh-v13-דתקמו'],
  ['כיצד להכריע באמצעי פעילות נוער השנויים במחלוקת?','id:igrot-kodesh-v13-דתקנ'],
  ['מה אמר הרבי לרופא מצליח על גאווה והצלחה?','url:https://www.chabad.org/therebbe/livingtorah/player_cdo/aid/1638122/jewish/Cure-for-Arrogance.htm'],
  ['כיצד לחבר מחשבה על ארץ ישראל להשפעה בגולה?','url:https://www.chabad.org/therebbe/livingtorah/player_cdo/aid/1775208/jewish/Home-is-Where-the-Heart-Is.htm']
];
for(const [question,key] of batch031Checks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-031 evidence must answer ${question}`);
    assert.deepEqual(m.sources.map(e=>e.key),[key],`${mode}: the specific batch-031 query must retrieve only its inspected evidence family`);
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-031 claim needs a proposition-level citation`);
  }
}
const batch032Checks=[
  ['מה האחריות באונייה ישראלית לקבוע הפלגה המחייבת הפעלת מערכות בשבת?','id:igrot-kodesh-v13-דתקנה'],
  ['מתי רופא מומחה ביקש בדיקה נוספת לקביעת דרך הטיפול?','id:igrot-kodesh-v13-דתקנז'],
  ['מה האחריות של מונטווידאו להשלמת המקווה?','id:igrot-kodesh-v13-דתקנט'],
  ['כיצד משמש משל קטר הדיזל לעבודת האדם?','id:igrot-kodesh-v13-דתקם'],
  ['באילו תנאים אושרה נסיעתו למרוקו לעבודה בחינוך?','id:igrot-kodesh-v13-דתקסב'],
  ['כיצד משאירים צינור מתכת בתוך סתימת פתח?','id:igrot-kodesh-v13-דתקסא']
];
for(const [question,key] of batch032Checks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-032 evidence must answer ${question}`);
    assert(m.sources.some(e=>e.key===key),`${mode}: the intended batch-032 source must support ${question}`);
    assert(m.sources.length<=(mode==='researcher'?5:3),`${mode}: the specific batch-032 query must not be flooded by generic evidence`);
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-032 claim needs a proposition-level citation`);
  }
}
const batch033Checks=[
  ['כיצד להכריע במחלוקת הנהלה על ענישת תלמידים?','id:igrot-kodesh-v13-דתקעד'],
  ['לקיחת מדריך והצלחתו עם התלמידים','id:igrot-kodesh-v13-דתקעא'],
  ['קל להשפיע על יחידים וקשה לפעול על ציבור','id:igrot-kodesh-v13-דתקעז'],
  ['מה נכתב על המשך משפט מחיצה בבית הכנסת?','id:igrot-kodesh-v13-דתקעה'],
  ['מה הקשר בין התעוררות מהתוועדות לשינוי מעשי ולדחיית לימוד?','id:igrot-kodesh-v13-דתקעב'],
  ['כיצד להשפיע על צעירים דרך ברית הסטודנטים הדתיים יבנה?','id:igrot-kodesh-v13-דתקסט']
];
for(const [question,key] of batch033Checks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-033 evidence must answer ${question}`);
    assert(m.sources.some(e=>e.key===key),`${mode}: the intended batch-033 source must support ${question}`);
    assert(m.sources.length<=(mode==='researcher'?5:3),`${mode}: the specific batch-033 query must not be flooded by generic evidence`);
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-033 claim needs a proposition-level citation`);
  }
}
const batch034Checks=[
  ['אילו מערכות באונייה אינן יכולות לפעול באוטומציה מלאה במשך שבת?','id:igrot-kodesh-v13-דתקפ'],
  ['למה מכתב חברת צים לא הספיק בלי בדיקת יומני האונייה?','id:igrot-kodesh-v13-דתקפג'],
  ['מה האחריות של מי שנבחר למשלחת לשמש דוגמה חיה?','id:igrot-kodesh-v13-דתקפו'],
  ['כיצד הוצע להגדיל את מספר התלמידים בימי החופש במרוקו?','id:igrot-kodesh-v13-דתקפט'],
  ['מתי דברי התעוררות נעשים דברים בטלים במקום להביא למעשה?','id:igrot-kodesh-v13-דתקצא'],
  ['מה נכתב על קירוב אנשים לתורה בלי לשנות את התורה כדי להתאימה?','id:igrot-kodesh-v13-דתקצג'],
  ['מה נכתב על סדר השלמת שיעורי חת״ת?','id:igrot-kodesh-v13-דתקצג']
];
for(const [question,key] of batch034Checks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-034 evidence must answer ${question}`);
    assert(m.sources.some(e=>e.key===key),`${mode}: the intended batch-034 source must support ${question}`);
    assert(m.sources.length<=(mode==='researcher'?6:3),`${mode}: the specific batch-034 query must not be flooded by generic evidence`);
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-034 claim needs a proposition-level citation`);
  }
}
const batch035Checks=[
  ['כיצד יכולה מורה לנצל גם מקצוע שאינו דתי לחינוך לאמונה?','id:igrot-kodesh-v13-דתקצה'],
  ['כיצד הבחין בין מקורות שונים למנהגי פורים?','id:igrot-kodesh-v13-דתקצז'],
  ['מה היו התנאים להצעת גיוס הכסף להשלמת המקווה בכפר חב״ד?','id:igrot-kodesh-v13-דתקצח'],
  ['מה נכתב למי שביקש לעזוב משרה במוסד חב״ד בגלל תלונות?','id:igrot-kodesh-v13-דתקצט'],
  ['מה לעשות כשהתנגדות מונעת השתתפות בהתוועדות?','id:igrot-kodesh-v13-דתר'],
  ['כיצד להשלים פיגור בהכנת קייטנה שהתחילה מאוחר?','id:igrot-kodesh-v13-דתרה'],
  ['האם לדחות תלמידות בקיץ בגלל מחסור במקום?','id:igrot-kodesh-v13-דתרו'],
  ['האם אפשר לחזור מהסכמה בכתב למשרת הוראה?','id:igrot-kodesh-v13-דתרז'],
  ['איך מתחילים ללמוד חסידות כשקשה להבין?','id:igrot-kodesh-v13-דתרח']
];
for(const [question,key] of batch035Checks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-035 evidence must answer ${question}`);
    assert(m.sources.some(e=>e.key===key),`${mode}: the intended batch-035 source must support ${question}`);
    assert(m.sources.length<=(mode==='researcher'?6:3),`${mode}: the specific batch-035 query must not be flooded by generic evidence`);
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-035 claim needs a proposition-level citation`);
  }
}
const batch036Checks=[
  ['מה צריכה בחירת המורות לבחון בסמינר בכפר חב״ד?','id:igrot-kodesh-v13-דתרי'],
  ['מדוע פעולה מעשית אחת מועדפת על אנחות רבות?','id:igrot-kodesh-v13-דתריא'],
  ['למה נדחו תעניות פרטיות בקיץ?','id:igrot-kodesh-v13-דתריד'],
  ['מדוע הכרזה על מגבית אחרת באותו זמן עלולה לפגוע בשתי המגבות?','id:igrot-kodesh-v13-דתרטו'],
  ['כיצד לארגן בני נוער המסתובבים ללא מטרה ברחובות בימי החופש?','id:igrot-kodesh-v13-דתריט'],
  ['למה קביעות בלימוד חסידות אינה מספיקה?','id:igrot-kodesh-v13-דתרכ'],
  ['כיצד זכירת החסדים שכבר ניתנו מחזקת אמונה וביטחון?','id:igrot-kodesh-v13-דתרכב']
];
for(const [question,key] of batch036Checks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-036 evidence must answer ${question}`);
    assert(m.sources.some(e=>e.key===key),`${mode}: the intended batch-036 source must support ${question}`);
    assert(m.sources.length<=(mode==='researcher'?25:5),`${mode}: the specific batch-036 query must stay within the mode's evidence budget`);
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-036 claim needs a proposition-level citation`);
  }
}
const batch037Checks=[
  ['כיצד נוסעים יכולים להשפיע על הפסקת חילול שבת באוניות?','id:igrot-kodesh-v13-דתרכד'],
  ['האם למכור בניין ישיבה בגלל המצב הקשה?','id:igrot-kodesh-v13-דתרל'],
  ['מדוע נדרש בית ספר חב״די לבנות במלבורן למרות מוסדות אחרים?','id:igrot-kodesh-v13-דתרלא'],
  ['האם להשתתף בקונגרס קהילות שאין לו הישגים קודמים?','id:igrot-kodesh-v13-דתרלג'],
  ['באיזה בית כנסת להשתדל לקבל משרת חזן לימים הנוראים?','id:igrot-kodesh-v13-דתרלה'],
  ['מה לעשות כשהעבודה אינה מניבה תוצאות?','id:igrot-kodesh-v13-דתרלז'],
  ['באיזה תנאי אושרה נסיעה מתומכי תמימים לוד לארצות הברית?','id:igrot-kodesh-v13-דתרלח']
];
for(const [question,key] of batch037Checks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-037 evidence must answer ${question}`);
    assert(m.sources.some(e=>e.key===key),`${mode}: the intended batch-037 source must support ${question}`);
    assert(m.sources.length<=(mode==='researcher'?25:6),`${mode}: the specific batch-037 query must stay within the mode's evidence budget`);
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-037 claim needs a proposition-level citation`);
  }
}
const batch038Checks=[
  ['למה אין לצמצם את בית הספר לנערות באגאדיר בימי החופש?','id:igrot-kodesh-v13-דתרלט'],
  ['למה להאמין להבטחות הבת במקום לשלוח לה מכתב התעוררות?','id:igrot-kodesh-v13-דתרמה'],
  ['האם נער צריך לחזור למרוקו כדי לעזור לאביו בפרנסה?','id:igrot-kodesh-v13-דתרמח'],
  ['כיצד להפוך נסיעה לשליחות מצווה אחרי תאונת דרכים?','id:igrot-kodesh-v13-דתרמט'],
  ['כיצד מוסברת שמינית שבשמינית בלי להפוך אותה לגסות הרוח?','id:igrot-kodesh-v13-דתרנ'],
  ['מה הקשר בין המקווה, בית התפילה והעירוב בכפר חב״ד?','id:igrot-kodesh-v13-דתרנא'],
  ['מה מלמדת הגהת ספר תורה על אהבת ישראל?','id:igrot-kodesh-v13-דתרנב']
];
for(const [question,key] of batch038Checks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-038 evidence must answer ${question}`);
    assert(m.sources.some(e=>e.key===key),`${mode}: the intended batch-038 source must support ${question}`);
    assert(m.sources.length<=(mode==='researcher'?25:6),`${mode}: the specific batch-038 query must stay within the mode's evidence budget`);
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-038 claim needs a proposition-level citation`);
  }
}
const batch039Checks=[
  ['למה חברי הוועד הרוחני בכפר חב״ד צריכים להיות דוגמה חיה?','id:igrot-kodesh-v13-דתרנד'],
  ['האם לעזוב את ברונא מפני שאין תלמיד מתאים להתקשרות בלימוד?','id:igrot-kodesh-v13-דתרנה'],
  ['כיצד לנצל נסיעה למקום העבודה ובחזרה לשיעורי חת״ת?','id:igrot-kodesh-v13-דתרנו'],
  ['כיצד לדבר בראש השנה וביום הכיפורים בלי לייגע את השומעים?','id:igrot-kodesh-v13-דתרנט'],
  ['מה הבעיה בפירוש מילולי של מושגי קבלה בלי להפשיטם מגשמיות?','id:igrot-kodesh-v13-דתרס'],
  ['האם להמתין לבניין ייעודי לפני פתיחת בית ספר לבנות במלבורן?','id:igrot-kodesh-v13-דתרסה'],
  ['לפי איזה מקום מחשבים סיום אחד עשר חודשי קדיש כשמקום הפטירה באזור זמן אחר?','id:igrot-kodesh-v13-דתרסז']
];
for(const [question,key] of batch039Checks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-039 evidence must answer ${question}`);
    assert(m.sources.some(e=>e.key===key),`${mode}: the intended batch-039 source must support ${question}`);
    assert(m.sources.length<=(mode==='researcher'?25:6),`${mode}: the specific batch-039 query must stay within the mode's evidence budget`);
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-039 claim needs a proposition-level citation`);
  }
}
const openBookQuestion='מה לעשות כשהמחשבה משוטטת בזמן לימוד ותפילה?';
for(const mode of ['regular','researcher']){
  const m=buildAnswerModel(idx.entries,openBookQuestion,{mode});
  assert(m.answerable,`${mode}: inspected open-book evidence must answer the batch-039 query`);
  assert(m.sources.some(e=>e.evidence_family_id==='study-concentration-open-book-and-chassidic-practice'),`${mode}: the shared open-book evidence family must support the answer`);
  assert.equal(new Set(m.sources.map(e=>e.evidence_family_id)).size,m.sources.length,`${mode}: repeated letters in one evidence family must not inflate the answer`);
  assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every open-book claim needs a proposition-level citation`);
}
const batch040Checks=[
  ['למה ספק בהצלחת ההשפעה על אברכים אינו סיבה להימנע מלזרוע הרבה גרעינים?','id:igrot-kodesh-v13-דתרע'],
  ['מה נכתב על חינוך נשים ובנות ספרדיות?','id:igrot-kodesh-v13-דתרעב'],
  ['מה נכתב על פעילות נשי ובנות חב״ד עם מגבלה רפואית?','id:igrot-kodesh-v13-דתרעג'],
  ['מה צריך שליח ציבור ללמוד לפני ראש השנה ויום הכיפורים לגבי פירוש המלות והפיוטים?','id:igrot-kodesh-v13-דתרעד'],
  ['מה נכתב על השפעת מדריך גן ישראל ושינוי בילד לאורך שבועות חודשים ושנים?','id:igrot-kodesh-v13-דתרעו'],
  ['מהם התנאים לקבל משרת רבנות?','id:igrot-kodesh-v13-דתרעז'],
  ['מה נכתב על זמן קצר בכל יום ללימוד חסידות ועל טבילה במקווה במצב בריאותי?','id:igrot-kodesh-v13-דתרעח'],
  ['האם שנים מקרא ואחד תרגום מחליפים חומש עם רש״י בכל יום, ומה ידוע על ציצית שנטוותה במכונה?','id:igrot-kodesh-v13-דתרפב'],
  ['האם שנים מקרא ואחד תרגום מחליפים חומש עם רש״י בכל יום?','id:igrot-kodesh-v13-דתרפב'],
  ['מה נכתב על דברים היוצאים מן הלב בחזרת מאמרים?','id:igrot-kodesh-v13-דתרפג']
];
for(const [question,key] of batch040Checks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-040 evidence must answer ${question}`);
    assert(m.sources.some(e=>e.key===key),`${mode}: the intended batch-040 source must support ${question}`);
    assert(m.sources.length<=(mode==='researcher'?25:6),`${mode}: the specific batch-040 query must stay within the mode's evidence budget`);
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-040 claim needs a proposition-level citation`);
  }
}
const batch041Checks=[
  ['כיצד לחפש ולהציל ספרים וכתבי יד של חסידות חב״ד מהתפוררות?','id:igrot-kodesh-v13-דתרפה'],
  ['מדוע ביקור השלוחים נחשב רק חרישה וזריעה ומי צריך לרכז את ההמשך?','family:tammuz-5716-student-emissary-visits-and-local-followup'],
  ['מה הייתה מטרת החוברת הראשונה של שיחות לנוער?','id:igrot-kodesh-v13-דתרפט'],
  ['מדוע עבודה במוסד חינוכי אינה רק כורח לפרנסה?','id:igrot-kodesh-v13-דתרצא'],
  ['מה תפקידו הרוחני של שמש בבית הכנסת לאחר חתימת חוזה העבודה?','id:igrot-kodesh-v13-דתרצב'],
  ['מה צריך בית ספר חרדי ללמד לצד תורה מבחינת עיקרי יהדות והלכות יום יום?','id:igrot-kodesh-v13-דתרצג'],
  ['האם תלמיד שטוען שמצב יראת השמים שלו טוב יותר בבית צריך לעזוב את הישיבה?','id:igrot-kodesh-v13-דתרצד'],
  ['כיצד הותאמה ההדרכה לשמירת העיניים והלשון לאופי השואל ולסביבתו?','id:igrot-kodesh-v13-דתרצה'],
  ['מה נכתב על בדיקת יומן האונייה ולחץ מצד נוסעים ורבנים בעניין הפלגה בשבת?','id:igrot-kodesh-v13-דתרצו'],
  ['אם הדפסה מחודשת של ספר הרקמה יקרה ומתעכבת, האם לפרסם רק את התוספות?','family:sefer-harikma-marginalia-publication-plan']
];
for(const [question,key] of batch041Checks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-041 evidence must answer ${question}`);
    const intended=key.startsWith('family:')
      ? m.sources.some(e=>e.evidence_family_id===key.slice(7))
      : m.sources.some(e=>e.key===key);
    assert(intended,`${mode}: the intended batch-041 source or evidence family must support ${question}`);
    assert(m.sources.length<=(mode==='researcher'?25:6),`${mode}: the specific batch-041 query must stay within the mode's evidence budget`);
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-041 claim needs a proposition-level citation`);
  }
}
const batch042Checks=[
  ['כיצד להעריך כישורים להדרכה ולחינוך ולהסיט רושם שלילי מן הסביבה?','id:igrot-kodesh-v13-דתרצט'],
  ['מה נכתב על נוסח התפילה שקבע אדמו״ר הזקן ועל קשר התפילין?','id:igrot-kodesh-v13-דתש'],
  ['מה נכתב על תלונות על חוסר הצלחה?','id:igrot-kodesh-v13-דתשא'],
  ['מה נכתב על בית רבקה במלבורן ועל משפחת המייסדים?','family:melbourne-beit-rivkah-founding-and-family-support'],
  ['האם לעזוב שיעור תניא מקומי ולהחליף התוועדות חסידית בשיחה מוסרית בסעודה שלישית?','id:igrot-kodesh-v13-דתשו'],
  ['מה נכתב על התפלת מי ים בשבת?','id:igrot-kodesh-v13-דתשז'],
  ['מה נכתב על גירעון ישיבות תומכי תמימים ועל תרומה מיידית?','id:igrot-kodesh-v13-דתשי'],
  ['מה תפקידם של צעירי אגודת ישראל לשמש דוגמה חיה בתקופת משבר?','id:igrot-kodesh-v13-דתשיא'],
  ['מה נכתב על מסירה מרב לרב בפנימיות התורה?','id:igrot-kodesh-v13-דתשיב'],
  ['כיצד יש לפתור סכסוך הנוגע לפרנסה בלי קללה ולשון פוגענית?','id:igrot-kodesh-v13-דתשיג']
];
for(const [question,key] of batch042Checks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-042 evidence must answer ${question}`);
    const intended=key.startsWith('family:')
      ? m.sources.some(e=>e.evidence_family_id===key.slice(7))
      : m.sources.some(e=>e.key===key);
    assert(intended,`${mode}: the intended batch-042 source or evidence family must support ${question}`);
    assert(m.sources.length<=(mode==='researcher'?25:6),`${mode}: the specific batch-042 query must stay within the mode's evidence budget`);
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-042 claim needs a proposition-level citation`);
  }
}
const batch043Checks=[
  ['מה הוצע למי שמתמודד עם מצב חלש בלימוד, ביראת שמים ובמלחמת היצר?','id:igrot-kodesh-v13-דתשיד'],
  ['האם יש עבירה שאין תשובה יכולה לתקן, והאם כל דרכי התשובה שוות?','id:igrot-kodesh-v13-דתשטו'],
  ['למה צעיר שהצליח בחינוך הכשר התבקש להישאר בארץ ולא לנסוע ללמוד בברוקלין?','id:igrot-kodesh-v13-דתשיז'],
  ['כיצד מבטאים הודיה על נס גלוי שאירע בעת חתונת בת?','id:igrot-kodesh-v13-דתשיח'],
  ['מדוע כתבי היד שהעתיק האב לא נחשבו לחיבורים מקוריים שלו ולא הודפסו כפי שהם?','id:igrot-kodesh-v13-דתשיט'],
  ['מה הוצע במקום תעניות המזיקות לבריאות ולמה הודגש ריבוי שלום?','id:igrot-kodesh-v13-דתשכ'],
  ['האם להתחיל בהקמת סמינר כשיש רק חלק חשוב מהתקציב, ואיך לבחור מורות?','id:igrot-kodesh-v13-דתשכב'],
  ['כיצד להגיב להתנגדות פומבית ללימוד חסידות: במחאה בלבד או בלימוד פומבי?','family:jerusalem-public-chassidus-study-response-to-opposition-5716'],
  ['האם חולה צריך לאכול מאכל שהרופא דורש ורב מורה הוראה מתיר?','id:igrot-kodesh-v13-דתשכה'],
  ['האם התלהבות בפעילות חינוכית פוטרת מהתייעצות וממתן מקום לחוות דעת אחרים?','id:igrot-kodesh-v13-דתשכו'],
  ['מדוע טענה שאין תועלת בפעילות עם צעירים בארצות הברית אינה סיבה להפסיק?','id:igrot-kodesh-v13-דתשכז'],
  ['מה דיווחו השלוחים על הכיוון מחיים רוחניים אל חומריות בקרב הנוער בארץ?','id:igrot-kodesh-v13-דתשכח']
];
for(const [question,key] of batch043Checks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-043 evidence must answer ${question}`);
    const intended=key.startsWith('family:')
      ? m.sources.some(e=>e.evidence_family_id===key.slice(7))
      : m.sources.some(e=>e.key===key);
    assert(intended,`${mode}: the intended batch-043 source or evidence family must support ${question}`);
    assert(m.sources.length<=(mode==='researcher'?25:6),`${mode}: the specific batch-043 query must stay within the mode's evidence budget`);
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-043 claim needs a proposition-level citation`);
  }
}
const batch044Checks=[
  ['כיצד מבחינים בין אמת תורנית ללא פשרה לבין התאמת הדרך והקצב לאדם מסוים?','family:torah-truth-without-compromise-personalized-path-to-observance-5716'],
  ['מה נכתב על קביעת זמן יומי להתבוננות קודם התפילה ועל המעבר ללימוד תורה?','id:igrot-kodesh-v13-דתשלא'],
  ['מהם היסודות העמידים לבניין בית בישראל מול שינויי העולם?','id:igrot-kodesh-v13-דתשלב'],
  ['כיצד הוצע לתזמן הפלגת עולים מצפון אפריקה כדי להימנע מהפלגה בשבת?','family:israeli-ships-shabbat-1956'],
  ['האם להמתין לכל תקציב שתי המקוואות או להתחיל מיד במקווה לנשים?','id:igrot-kodesh-v13-דתשלד'],
  ['כיצד צד אחד יכול להתחיל לתקן פירוד בהנהלה ומה נדרש לתיקון העבר?','family:kfar-chabad-mikveh-lighting-language-access-and-management-peace-5716'],
  ['איזה פתרון ציבורי הוצע כשדמי מפתח גבוהים מעכבים שידוכים ונישואין?','id:igrot-kodesh-v13-דתשלו'],
  ['מה הוצע לאשה במצב רוח ירוד לגבי צעדים פעילים, המשך לימודים ועבודה בחינוך?','id:igrot-kodesh-v13-דתשלז'],
  ['כיצד יכול רופא לתרום לשכונה ולדבר על רפואת הנפש בשפה המתאימה למטופל?','id:igrot-kodesh-v13-דתשלח'],
  ['כיצד לערוך חשבון נפש בסוף השנה בלי להגדיל כישלונות ובלי ליפול לייאוש?','id:igrot-kodesh-v13-דתשלט'],
  ['מה האחריות המיוחדת של חייל לקדושת המחנה ולהשפעה על חבריו?','id:igrot-kodesh-v13-דתשמ'],
  ['האם חשש שפעילות ופרסום יולידו תחושת ישות הוא סיבה להפסיק לפעול?','id:igrot-kodesh-v13-דתשמא'],
  ['מה הקושיה על הסברת חיוב מזונות אשת עבד בדרך הארץ לפי הרמב״ן והריטב״א?','id:igrot-kodesh-v13-דתשמב'],
  ['האם הזכרת לחם הפנים בפיוטי העבודה מספיקה בלי פסוקי המוספים?','id:igrot-kodesh-v13-דתשמג']
];
for(const [question,key] of batch044Checks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-044 evidence must answer ${question}`);
    const intended=key.startsWith('family:')
      ? m.sources.some(e=>e.evidence_family_id===key.slice(7))
      : m.sources.some(e=>e.key===key);
    assert(intended,`${mode}: the intended batch-044 source or evidence family must support ${question}`);
    assert(m.sources.length<=(mode==='researcher'?25:6),`${mode}: the specific batch-044 query must stay within the mode's evidence budget`);
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-044 claim needs a proposition-level citation`);
  }
}
const batch045Checks=[
  ['מתי הוצע לחלוץ תפילין בראש חודש ביחס לקדיש שלאחר עלינו?','original-letter-aid-4666234'],
  ['כיצד מוסברת ברכת תפילין של ראש כשמפסיקים בין תפילין של יד לתפילין של ראש?','original-letter-aid-4666235'],
  ['כיצד ביקשו להעביר מסרים רוחניים לחיילים יהודים ולאירופה המשוחררת?','original-letter-aid-4666236'],
  ['מדוע ראש השנה נקרא ראש וכיצד שבת קשורה להתפתחות רוחנית לאורך השנה?','original-letter-aid-4666237'],
  ['כיצד חישב המענה את שווי הצדקה במקום יום תענית במטבע בן הזמן?','original-letter-aid-4666238'],
  ['מדוע תכלית תחיית המתים מתוארת כנשמה בגוף דווקא?','original-letter-aid-4666239'],
  ['האם מעכה שבבית נחור היה בן או בת לפי רש״י והמדרש לעומת הספורנו?','original-letter-aid-4666240'],
  ['האם שבת אצל חולה שיש בו סכנה הותרה או רק נדחית?','original-letter-aid-4666215'],
  ['לאילו מקורות הופנה הנמען בבירור שתי הבחינות בקריאת שמע?','shema-two-aspects-source-referral-and-chassidic-review-5716']
];
for(const [question,family] of batch045Checks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-045 evidence must answer ${question}`);
    assert(m.sources.some(e=>e.evidence_family_id===family),`${mode}: the intended batch-045 evidence family must support ${question}`);
    assert(m.sources.length<=(mode==='researcher'?25:6),`${mode}: the specific batch-045 query must stay within the mode's evidence budget`);
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-045 claim needs a proposition-level citation`);
  }
}
const batch046Checks=[
  ['לפי מכתב רמג, מהו ניקוד ״לרצות״ בפרקי אבות ומה שונה בתפילת טל?','original-letter-aid-4666282'],
  ['האם אהבת הזולת תלויה בכך שמאמץ הקירוב הצליח?','original-letter-aid-4666283'],
  ['לפי מה מסווג המענה עבירה: סוג המעשה בלבד או גם המניע והקביעות?','original-letter-aid-4666306'],
  ['מדוע יציאת מצרים נזכרת במתן תורה במקום בריאת העולם?','original-letter-aid-4666228'],
  ['כיצד נדרשה תחושת אחריות של נוער חרדי לעבור ממחשבה ודיבור למעשה?','original-letter-aid-5019148'],
  ['כיצד הובעה שותפות בהקמת בית רבקה במלבורן מעבר לברכה כללית?','melbourne-beit-rivkah-founding-and-family-support'],
  ['האם נכון להשתמט מהזמנה לרב מורה הוראה במקום להציג לפניו את הטענות והמצב?','original-letter-aid-5019150'],
  ['כיצד הוסברה חומרת הנהגת מנהג מנוגד בתוך בית הכנסת עצמו?','original-letter-aid-5019453']
];
for(const [question,family] of batch046Checks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-046 evidence must answer ${question}`);
    assert(m.sources.some(e=>e.evidence_family_id===family),`${mode}: the intended batch-046 evidence family must support ${question}`);
    assert(m.sources.length<=(mode==='researcher'?25:6),`${mode}: the specific batch-046 query must stay within the mode's evidence budget`);
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-046 claim needs a proposition-level citation`);
  }
}
const batch047Checks=[
  ['האם סכסוך של הורה עם הנהלת מוסד מצדיק להפסיק את החינוך היהודי של הילדה?','letter-no-767-parent-school-dispute'],
  ['מדוע גם שיפור קטן בסביבת החינוך של ילד עשוי להיות חשוב?','letter-no-204-educational-environment'],
  ['מה צריך לברר לפני אירוסין בנוגע ליסודות הבית ולקביעות עתים לתורה?','letter-no-871-marriage-partner'],
  ['מדוע הטיוטה מסתייגת מהשקעה במניות ומציעה אפיק רגוע יותר?','original-draft-aid-821810-stock-investing'],
  ['כיצד הוצע להתמודד עם הפסד בעסק שמימן פעילות חינוכית וציבורית?','original-draft-aid-821811-business-loss'],
  ['מהם שני מוקדי המעלה של איש עסקים לפי מכתב 1006?','letter-no-1006-businessman-torah-study'],
  ['מה אחריות ההורים בחופשת הקיץ וכיצד לנצל את השעות הפנויות ללימוד תורה?','letter-no-1051-summer-education'],
  ['האם להיכנס לשותפות בעסק שיפעל בשבת בחלקו של השותף האחר?','letter-no-997-business-shabbos-partnership'],
  ['מה הוצע לבעל עסק מודאג מחובות במקום להמתין ללקוחות?','letter-no-1016-economic-confidence'],
  ['כיצד מיושם לכתחילה אריבער בהחלטה לפתוח עסק סיטונאי?','letter-no-1105-opening-wholesale-business']
];
for(const [question,family] of batch047Checks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-047 evidence must answer ${question}`);
    assert(m.sources.some(e=>e.evidence_family_id===family),`${mode}: the intended batch-047 evidence family must support ${question}`);
    assert(m.sources.length<=(mode==='researcher'?25:6),`${mode}: the specific batch-047 query must stay within the mode's evidence budget`);
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-047 claim needs a proposition-level citation`);
  }
}
const batch048Checks=[
  ['מה נדרש מוועידה ציבורית לעשות למען חינוך ילדי עולים וילדים יהודים באמריקה מעבר להבעת דאגה?','letter-no-634-immigrant-and-american-jewish-education'],
  ['מדוע האחריות לחינוך ילדים לקראת שבועות אינה מוגבלת לילדי המשפחה?','letter-no-1029-children-guarantors-education'],
  ['מדוע חינוך ילדה למצוות לפני בת מצווה אינו רק הכנה לגיל החיוב?','igrot-kodesh-v30-p60-girl-education-shabbat-candle'],
  ['מדוע אין למחנך להתייאש גם מול הרגל עמוק התנגדות או קושי להסביר?','letter-no-72-educator-not-despair'],
  ['האם החסידות מבקשת לפרוש מן העולם או להתעניין בכל תחומי המציאות?','original-draft-aid-1272-chassidism-world-engagement'],
  ['מתי מוצע לדחות דיון מופשט ולתת קדימות לפעולה חינוכית מיידית?','original-draft-aid-1264-education-emergency-priority'],
  ['מדוע עזרה בבית אינה בהכרח תחליף לתשומת לב אישית לילדים כששוקלים לנהל חנות?','chabad-letter-1273740'],
  ['מהם שני הטעמים שניתנו למדיניות של הימנעות מגיוס כספים ישיר?','letter-aid-3566500-fundraising-policy-donor-capacity']
];
for(const [question,family] of batch048Checks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-048 evidence must answer ${question}`);
    assert(m.sources.some(e=>e.evidence_family_id===family),`${mode}: the intended batch-048 evidence family must support ${question}`);
    assert(m.sources.length<=(mode==='researcher'?25:6),`${mode}: the specific batch-048 query must stay within the mode's evidence budget`);
    if(family==='letter-aid-3566500-fundraising-policy-donor-capacity')assert(m.sources.length===1,`${mode}: the direct-fundraising-policy query must exclude unrelated charity, medical and meeting sources`);
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-048 claim needs a proposition-level citation`);
  }
}
const batch049Checks=[
  ['כיצד יום הילולא אמור לעבור מהנצחה היסטורית לפעולה יומיומית בהפצת יהדות?','public-letter-24-teves-5743-commemoration-to-action'],
  ['מדוע מי שקיבל יכולת להבין ולחדש אינו צריך להשאיר את הידע לקבוצה מצומצמת?','yud-shevat-5743-farbrengen-mission-and-public-knowledge'],
  ['כיצד הגיבו לגזירה על קריאת התורה בלי לסגת מן התורה?','beshallach-15-shevat-5743-steadfastness-song-noahide-outreach'],
  ['מה משמעות השלמת שליחותו של צדיק כשיום פטירתו חל ביום הולדתו?','terumah-6-adar-5743-moshe-life-completion-menorah-effort'],
  ['מדוע תענית אסתר המוקדמת בתשמ״ג הרחיבה את ההכנה לפורים לשלושה ימים?','taanis-esther-5743-threefold-preparation-unity'],
  ['מדוע מאמץ החינוך בפורים צריך להגיע גם לילדים שעדיין אינם בבתי ספר יהודיים?','purim-5743-blessing-education-pesach-preparation'],
  ['מה נדרש מילדי צבאות השם מעבר להנהגה האישית שלהם?','tzivos-hashem-16-adar-5743-children-steadfastness-peer-influence'],
  ['כיצד מתחלקת הנשמה בין גופים שונים בתחיית המתים לפי מכתב 209?','letter-no-209-resurrection-reincarnation-polar-time']
];
for(const [question,family] of batch049Checks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-049 evidence must answer ${question}`);
    assert(m.sources.some(e=>e.evidence_family_id===family),`${mode}: the intended batch-049 evidence family must support ${question}`);
    assert(m.sources.length<=(mode==='researcher'?25:6),`${mode}: the specific batch-049 query must stay within the mode's evidence budget`);
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-049 claim needs a proposition-level citation`);
  }
}

const batch050Checks=[
  ['מה נאמר על תרגום חסידות לשפות רבות עבור מי שאינם מבינים עברית קלאסית?','shabbos-ki-seitzei-14-elul-5745'],
  ['מה הקשר בין ספירת העומר להשלמת העולם ולזיכוך המידות?','erev-shavuos-5743-sefirah-completion'],
  ['מה הקשר בין הפצת המעיינות של חסידות למקומות המרוחקים ביותר לבין ההכנה לגאולה?','motzaei-tzav-13-nissan-5743-tzemach-tzedek-yahrzeit'],
  ['מה נדרש במציאות קשה המתוארת כמדבר?','shabbos-bamidbar-5-sivan-5745-life-in-desert'],
  ['מה הקשר בין י״ב תמוז, אחדות והכרת תודה על השחרור?','12-tammuz-5743-unity-and-gratitude'],
  ['מה נאמר על יום ההילולא של הרבי הקודם והוספה בתורה ובמצוות?','yechidus-eve-13-shevat-5744'],
  ['מה נאמר על יחידות קבוצתית אחרי פורים?','yechidus-eve-17-adar-ii-5744'],
  ['כיצד לשמר את השפעת המפגש לאחר החזרה הביתה?','yechidus-eve-25-nissan-5744']
];
for(const [question,family] of batch050Checks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-050 evidence must answer ${question}`);
    assert(m.sources.some(e=>e.evidence_family_id===family),`${mode}: intended batch-050 evidence family must support ${question}`);
    assert(m.sources.length<=(mode==='researcher'?24:6),`${mode}: batch-050 query must stay within the mode evidence budget`);
    const entailed=citationEntailment(m);
    assert.equal(entailed.length,m.claims.length,`${mode}: every batch-050 claim must be checked for citation entailment`);
    assert(entailed.every(c=>c.valid&&c.unsupported_source_numbers.length===0),`${mode}: batch-050 claims must cite only propositions that entail them`);
    if(mode==='researcher'){
      assert(m.research&&m.research.evidence_map.length===m.claims.length,`researcher: batch-050 must expose a claim-level evidence map`);
      assert.equal(m.research.cases.length,m.sources.length,`researcher: every retained source needs a case-level record`);
      assert.equal(m.research.witnesses.length,m.sources.length,`researcher: every retained source needs a witness record`);
      assert(m.presentation.detail_level==='witness_level',`researcher: batch-050 must use witness-level detail`);
    }else{
      assert(!m.research&&m.presentation.detail_level==='summary',`regular: batch-050 must retain the concise renderer`);
    }
  }
}
const unityQuestion='כיצד נשמרת אחדות יהודים אחרי מפגש משותף ופרידה לבתים?';
for(const mode of ['regular','researcher']){
  const m=buildAnswerModel(idx.entries,unityQuestion,{mode});
  assert(m.answerable,`${mode}: multi-event unity question must be answerable`);
  const unityFamilies=['yechidus-eve-25-nissan-5744','yechidus-eve-11-sivan-5744','yechidus-16-tammuz-5744'];
  assert(unityFamilies.filter(f=>m.sources.some(e=>e.evidence_family_id===f)).length>=2,`${mode}: unity synthesis must retain at least two distinct event families`);
  assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=2,`${mode}: unity synthesis must not collapse distinct events into one family`);
  assert(citationEntailment(m).every(c=>c.valid),`${mode}: every unity synthesis claim needs claim-level citation entailment`);
  if(mode==='researcher'){
    const translatedUnity=m.research.witnesses.filter(w=>unityFamilies.includes(w.family));
    assert(translatedUnity.length>=2,`researcher: at least two dated translated events must remain visible as separate families`);
    assert(translatedUnity.every(w=>w.witness_class==='derived'),`researcher: translated unity witnesses must remain derived, not independent originals`);
    assert(m.research.evidence_map.every(c=>c.source_numbers.length),`researcher: every unity claim needs a source map`);
    assert(m.research.witness_classes.derived>=2,`researcher: translated witnesses must be classified as derived, not independent originals`);
  }
}

const batch052Checks=[
  ['מה נאמר על השבת שלפני י״ב תמוז ועל לכתחילה אריבער?','shabbos-balak-7-tammuz-5744'],
  ['כיצד השבת מעלה את ענייני השבוע הקודם דרך ויכולו ועונג?','shabbos-yisro-17-shevat-5744'],
  ['מה ההבדל בין שבת שובה לשבת תשובה ומה הקשר לתשרי?','shabbos-haazinu-shabbos-shuvah-3-tishrei-5744-1st-farbrengen'],
  ['מדוע שני ימי ראש השנה נחשבים יום אחד ארוך?','shabbos-haazinu-shabbos-shuvah-3-tishrei-5744-2nd-farbrengen'],
  ['כיצד סעודת שבת והתוועדות שבת מבטאות אחדות יהודים?','shabbos-eikev-20-menachem-av-5744'],
  ['מה משמעות ג׳ תמוז כתחילת הגאולה וכיצד התרחבה הפצת החסידות?','third-day-tammuz-5742'],
  ['מה הקשר בין ערב יום הכיפורים, חמש התפילות ודרגת היחידה?','erev-yom-kippur-5746'],
  ['כיצד צער של יום הילולא אמור להפוך לשמחה ולפעולה?','chof-menachem-av-5742'],
  ['כיצד ברכה ליחיד הופכת לברכה של הציבור ומאחדת את הקהילה?','12-tammuz-5745'],
  ['מדוע זיכרון יום הגאולה מחייב מעשה והוספה בהפצת תורה?','13-tammuz-5742'],
  ['כיצד אחדות בפורים מתבטאת במפגש, משלוח מנות ומתנות לאביונים?','purim-5745'],
  ['מה נאמר על הרחבת הכלי לברכה באמצעות תוספת תורה ומצוות ביום ההילולא?','yechidus-eve-13-shevat-5744'],
  ['כיצד מבצע פורים נמשך אחרי החג להכנות לפסח ולמתן מצות לעניים?','yechidus-eve-17-adar-ii-5744'],
  ['כיצד לימוד רמב״ם משותף ותפילה בכיוון אחד מבטאים אחדות בין יהודים מרוחקים?','yechidus-eve-11-sivan-5744']
];
for(const [question,family] of batch052Checks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: inspected batch-052 evidence must answer ${question}`);
    assert(m.sources.some(e=>e.evidence_family_id===family),`${mode}: intended batch-052 family must support ${question}`);
    assert(m.sources.length<=(mode==='researcher'?25:6),`${mode}: batch-052 query must stay within the mode evidence budget`);
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-052 claim needs a proposition-level citation`);
    assert(citationEntailment(m).every(c=>c.valid),`${mode}: every batch-052 claim must pass citation entailment`);
    if(mode==='researcher'){
      assert(m.research&&m.research.evidence_map.length===m.claims.length,`researcher: batch-052 needs a claim-level evidence map`);
      assert.equal(m.research.cases.length,m.sources.length,`researcher: every batch-052 source needs a case record`);
      assert.equal(m.research.witnesses.length,m.sources.length,`researcher: every batch-052 source needs a witness record`);
      assert(m.presentation.detail_level==='witness_level',`researcher: batch-052 must expose witness-level detail`);
      const w=m.research.witnesses.find(x=>x.family===family);
      assert(w&&w.witness_class==='derived',`researcher: translated batch-052 witness must remain derived`);
    }else{
      assert(!m.research&&m.presentation.detail_level==='summary',`regular: batch-052 must retain concise rendering`);
    }
  }
}
const batch052SynthesisChecks=[
  ['כיצד מפגש משותף מחזק אחדות גם אחרי שחוזרים לבתים?',['shabbos-eikev-20-menachem-av-5744','purim-5745','yechidus-eve-11-sivan-5744']],
  ['כיצד יום הילולא קשור לתוספת תורה ומצוות ולשמחה?',['yechidus-eve-13-shevat-5744','chof-menachem-av-5742']]
];
for(const [question,families] of batch052SynthesisChecks){
  for(const mode of ['regular','researcher']){
    const m=buildAnswerModel(idx.entries,question,{mode});
    assert(m.answerable,`${mode}: batch-052 multi-source synthesis must be answerable`);
    assert(families.filter(f=>m.sources.some(e=>e.evidence_family_id===f)).length>=2,`${mode}: synthesis must retain at least two intended distinct event families`);
    assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=2,`${mode}: synthesis must not collapse distinct event families`);
    assert(citationEntailment(m).every(c=>c.valid),`${mode}: every synthesis claim needs claim-level citation entailment`);
    if(mode==='researcher'){
      assert(m.research.evidence_map.every(c=>c.source_numbers.length),`researcher: every synthesis claim needs a source map`);
      assert.equal(m.research.witnesses.length,m.sources.length,`researcher: every synthesis witness needs a record`);
    }
  }
}


const batch053DirectChecks=[
 ['מה מתואר במאמר כנשר יעיר קנו על רחמים שלמעלה ממידת הרחמים?',[5996841]],
 ['מהם שני הפירושים במאמר כימי צאתך לגבי הגאולה העתידה?',[5996844]],
 ['כיצד מתוארת דירה בתחתונים במאמר באתי לגני תש״ל?',[3140096]],
 ['מה נכתב בברכת ערב יום הכיפורים על תשובה אמיתית ותשובה עילאה?',[5989546]],
 ['מה מתועד ברשימה הפרטית על תענית תשעה באב והוראת רופא?',[5989548]],
 ['מה נאמר בהתוועדות מוצאי שבת שירה על המן ומתן תורה?',[5989569]],
 ['מה נאמר בברכה בעת מסירת האתרוגים על הוספת הדסים?',[5989549]],
 ['כיצד המאמר אתה אחד תשכ״ט מבאר את ההבחנה בין אחד ליחיד?',[5989601]],
 ['מה הקשר בין תפילת רבים ללימוד תורה ברבים?',[5996845,5996846]],
 ['כיצד מפגש משותף, תפילה ולימוד מחזקים אחדות יהודים?',[2515477,2514886]],
 ['מה הקשר בין דירה בתחתונים לבין לימוד תורה ומצוות?',[3140096,5989547]]
];
for(const [question,aids] of batch053DirectChecks){
 for(const mode of ['regular','researcher']){
  const m=buildAnswerModel(idx.entries,question,{mode});
  assert(m.answerable,`${mode}: batch-053 question must be answerable: ${question}`);
  for(const aid of aids)assert(m.sources.some(e=>String(e.aid)===String(aid)),`${mode}: batch-053 must cite AID ${aid} for ${question}`);
  assert(citationEntailment(m).every(c=>c.valid),`${mode}: batch-053 claim-level citation entailment must pass`);
  if(mode==='researcher'){
   assert(m.research.evidence_map.every(c=>c.source_numbers.length),`researcher: batch-053 every claim needs an evidence-map source`);
   assert.equal(m.research.witnesses.length,m.sources.length,`researcher: batch-053 every displayed source needs a witness record`);
  }else{
   assert(!m.research&&m.presentation.detail_level==='summary',`regular: batch-053 must retain concise rendering`);
  }
 }
}

const batch053IndexIdentityChecks=[5996841,5996843,5996844,5996845,5996846,3140096,5989601,5989546,5989547,5989548,5989569,5989549,2515477,2515007,2514886];
assert.equal(metrics.answer_eligible_unique_sources,598,'batch-054 answer-eligible source metric must reconcile to 598');
assert.equal(metrics.content_verified_unique_sources,586,'batch-053 content-verified metric must reconcile to 586');
assert.equal(metrics.answer_eligible_propositions,1857,'batch-054 source-grounded proposition count must reconcile to 1857');
for(const aid of batch053IndexIdentityChecks){
  const matches=idx.entries.filter(e=>String(e.aid)===String(aid));
  assert.equal(matches.length,1,`AID ${aid} must have exactly one item-shaped public-index entry`);
  assert.equal(matches[0].key,`aid:${aid}`,`AID ${aid} must use the preferred stable identity key`);
  assert.equal(idx.entries.some(e=>e.key===`url:${matches[0].source_url}`),false,`AID ${aid} must not create a duplicate URL-only provenance entry`);
}

const batch054DirectChecks=[
 ['מה מלמדת השיחה על ג׳ תמוז לגבי תחילת הגאולה וההעברה לגלות?',2512354,'shabbos-korach-3-tammuz-5745'],
 ['כיצד מתוארת חשיבות מעשיו של היחיד והמעבר לברכת הציבור בי״ב תמוז?',2512365,'12-tammuz-5745'],
 ['מדוע יש להתחיל בלימוד מאמרי הגאולה בנאום של ג׳ תמוז?',2512403,'15-tammuz-5745-discourse-study'],
 ['כיצד השבת מגלה את העונג שהיה נסתר בימי המעשה?',2512405,'shabbos-balak-17-tammuz-5745'],
 ['מה תכלית ההתוועדות בשבת מברכים וכיצד נבחנת הצלחתה?',2512413,'shabbos-pinchas-24-tammuz-5745'],
 ['מהי צדקה רוחנית ביום צום ומה הקשר לשבע מצוות בני נח?',2507435,'17-tammuz-5746-fast-and-spiritual-charity'],
 ['מדוע מסיימים מסכת תענית בט״ו באב?',2507446,'15-menachem-av-5746-siyum-taanis'],
 ['כיצד עבודת אלול מחברת חשבון נפש, תורה, תפילה וצדקה?',2507456,'elul-5746-torah-prayer-tzedakah-teshuvah'],
 ['מה הקשר בין ברכת שלום בי״ט כסלו להפצת חסידות?',2512084,'19-kislev-5746-benediction-peace-torah'],
 ['מה יישאר מהלקחים של ימי הצום בימות המשיח?',2512137,'10-teves-5746-fast-days-to-joy'],
 ['כיצד לימוד הלכה משותף מחזק אחדות אחרי פרידה?',2514886,'yechidus-eve-11-sivan-5744'],
 ['כיצד מתוארת התגברות על ספק ומכשולים בהשפעה על יהודים?',2515477,'yechidus-eve-13-shevat-5744'],
 ['מה מוצע לעשות במקום נסיעה לרבי בי״א ניסן וכיצד נשמרת האחדות?',2515007,'yechidus-eve-17-adar-ii-5744']
];
for(const [question,aid,family] of batch054DirectChecks){
 for(const mode of ['regular','researcher']){
  const m=buildAnswerModel(idx.entries,question,{mode});
  assert(m.answerable,`${mode}: batch-054 inspected evidence must answer ${question}`);
  assert(m.sources.some(e=>String(e.aid)===String(aid)),`${mode}: batch-054 must cite AID ${aid} for ${question}`);
  assert(m.sources.some(e=>e.evidence_family_id===family),`${mode}: batch-054 must retain family ${family}`);
  assert(m.sources.length<=(mode==='researcher'?25:6),`${mode}: batch-054 evidence budget must be respected`);
  assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-054 claim needs proposition-level citations`);
  assert(citationEntailment(m).every(c=>c.valid),`${mode}: batch-054 claim-level citation entailment must pass`);
  if(mode==='researcher'){
   assert(m.research&&m.research.evidence_map.length===m.claims.length,`researcher: batch-054 needs a claim-level evidence map`);
   assert.equal(m.research.cases.length,m.sources.length,`researcher: every batch-054 source needs a case record`);
   assert.equal(m.research.witnesses.length,m.sources.length,`researcher: every batch-054 source needs a witness record`);
   assert(m.presentation.detail_level==='witness_level',`researcher: batch-054 must expose witness-level detail`);
   const w=m.research.witnesses.find(x=>x.family===family);
   assert(w&&w.witness_class==='derived',`researcher: translated batch-054 witness must remain derived`);
  }else{
   assert(!m.research&&m.presentation.detail_level==='summary',`regular: batch-054 must retain concise rendering`);
  }
 }
}
const batch054SynthesisChecks=[
 ['כיצד מתוארת אחדות ישראל לאחר מפגש משותף גם כשהמשתתפים חוזרים לבתיהם?',['yechidus-eve-13-shevat-5744','yechidus-eve-11-sivan-5744','yechidus-eve-17-adar-ii-5744']],
 ['כיצד מועדי י״ב תמוז, י״ז תמוז וט״ו באב נקשרים לגאולה, לצדקה ולשמחה?',['12-tammuz-5745','17-tammuz-5746-fast-and-spiritual-charity','15-menachem-av-5746-siyum-taanis']],
 ['כיצד עבודת אלול והלקחים מימי הצום מחברים תורה, תפילה, צדקה ותשובה?',['elul-5746-torah-prayer-tzedakah-teshuvah','10-teves-5746-fast-days-to-joy','17-tammuz-5746-fast-and-spiritual-charity']]
];
for(const [question,families] of batch054SynthesisChecks){
 for(const mode of ['regular','researcher']){
  const m=buildAnswerModel(idx.entries,question,{mode});
  assert(m.answerable,`${mode}: batch-054 multi-source synthesis must be answerable`);
  assert(families.filter(f=>m.sources.some(e=>e.evidence_family_id===f)).length>=2,`${mode}: batch-054 synthesis must retain at least two intended families`);
  assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=2,`${mode}: batch-054 synthesis must not collapse distinct event families`);
  assert(m.claims.every(c=>c.source_numbers.length),`${mode}: batch-054 synthesis claims need source maps`);
  assert(citationEntailment(m).every(c=>c.valid),`${mode}: batch-054 synthesis claim citations must pass entailment`);
  assert(m.sources.length<=(mode==='researcher'?25:6),`${mode}: batch-054 synthesis evidence budget must be respected`);
  if(mode==='researcher'){
   assert(m.research&&m.research.evidence_map.length===m.claims.length,`researcher: batch-054 synthesis needs a claim-level evidence map`);
   assert.equal(m.research.witnesses.length,m.sources.length,`researcher: batch-054 synthesis needs a witness record for each source`);
   assert(m.research.witnesses.filter(w=>families.includes(w.family)).every(w=>w.witness_class==='derived'),`researcher: translated batch-054 witnesses must remain derived`);
  }else{
   assert(!m.research&&m.presentation.detail_level==='summary',`regular: batch-054 synthesis must retain concise rendering`);
  }
 }
}
const batch054IndexIdentityChecks=[2512354,2512403,2512405,2512413,2507435,2507446,2507456,2512084,2512137,2512365,2515477,2515007,2514886];
for(const aid of batch054IndexIdentityChecks){
 const matches=idx.entries.filter(e=>String(e.aid)===String(aid));
 assert.equal(matches.length,1,`AID ${aid} must have exactly one item-shaped public-index entry after batch 054`);
 assert.equal(matches[0].key,`aid:${aid}`,`AID ${aid} must use the preferred stable identity key`);
 assert.equal(idx.entries.some(e=>e.key===`url:${matches[0].source_url}`),false,`AID ${aid} must not create a duplicate URL-only entry`);
}
const batch054NewAids=[2512354,2512403,2512405,2512413,2507435,2507446,2507456,2512084,2512137];
for(const aid of batch054NewAids){
 const e=idx.entries.find(x=>String(x.aid)===String(aid));
 assert.equal(e.canonical_file,'data/items/sie-translated-talks-5745-5746-2026-11-12-054.json',`AID ${aid} must resolve to the batch-054 canonical item file`);
 assert.equal(e.response_propositions.length,2,`AID ${aid} must have two inspected propositions`);
}
const batch054EnrichedCounts={2512365:4,2515477:6,2515007:7,2514886:7};
for(const [aid,count] of Object.entries(batch054EnrichedCounts)){
 const e=idx.entries.find(x=>String(x.aid)===String(aid));
 assert(e.response_propositions.length>=count,`AID ${aid} must preserve prior propositions and include batch-054 enrichment`);
}




const batch056Required=[
 [2281850,3],[2278232,2],[2277888,2],[2277935,2],[2278439,3],
 [2279259,3],[2278430,3],[2294957,2],[2293270,3],[2279210,2],[2283000,3]
];
for(const [aid,minProps] of batch056Required){
 const e=idx.entries.find(x=>String(x.aid)===String(aid));
 assert(e&&e.has_content_evidence,`batch-056 source ${aid} must have inspected content evidence`);
 assert.equal(e.status,'Verified',`batch-056 source ${aid} must retain scoped publisher-text verification`);
 assert(e.response_propositions.length>=minProps,`batch-056 source ${aid} must expose its inspected propositions`);
 assert(e.proposition_source_locator&&e.verification_scope,`batch-056 source ${aid} must expose precise locator and scope`);
 assert.equal(e.proposition_origin,'source_grounded_paraphrase',`batch-056 source ${aid} must remain a source-grounded paraphrase`);
 assert.equal(e.proposition_verbatim,false,`batch-056 source ${aid} must not be represented as verbatim`);
 assert.equal(e.proposition_verification,'source_text_inspected',`batch-056 source ${aid} must retain text-inspection status`);
 assert.equal(e.context_status,'partial',`batch-056 source ${aid} must preserve partial context`);
}
const batch056Checks=[
 ['מה כתב הרבי על מנהגי אבלות לאחר פטירת הורה?',[2278430]],
 ['כיצד הוצעה שליחות חינוכית במרוקו ומה נדרש מהשליח?',[2277935,2278232]],
 ['מה כתב הרבי על איסוף מכתבי ומאמרי הרש״ב?',[2294957,2279210]],
 ['כיצד נוהגים בשבת במקום שבו היום נמשך יותר מ־24 שעות?',[2283000]]
];
for(const [question,aids] of batch056Checks){
 for(const mode of ['regular','researcher']){
  const m=buildAnswerModel(idx.entries,question,{mode});
  assert(m.answerable,`${mode}: batch-056 evidence must answer ${question}`);
  for(const aid of aids) assert(m.sources.some(e=>String(e.aid)===String(aid)),`${mode}: expected AID ${aid} for ${question}`);
  assert(m.claims.every(c=>c.source_numbers.length),`${mode}: each batch-056 claim needs proposition-level citation`);
  assert(m.sources.length<=(mode==='researcher'?10:5),`${mode}: batch-056 query must not be flooded with generic matches`);
  if(mode==='researcher'){
   assert(m.research&&m.research.evidence_map.length>0,`${mode}: batch-056 researcher mode must expose an evidence map`);
   assert(m.research.citation_entailment.every(x=>x.valid),`${mode}: batch-056 citations must pass claim-local entailment`);
   assert(m.research.context_boundary.every(x=>x.valid),`${mode}: batch-056 must preserve witness-local context boundaries`);
  }
 }
}
const letterSynthesisQuestion='מה עולה מהאיגרות על איסוף, הדפסה והפצה של כתבי חסידות?';
for(const mode of ['regular','researcher']){
 const m=buildAnswerModel(idx.entries,letterSynthesisQuestion,{mode});
 assert(m.answerable,`${mode}: letter-publication synthesis must be answerable from inspected correspondence`);
 assert(m.sources.length>=3,`${mode}: letter-publication synthesis must use at least three letters`);
 assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=3,`${mode}: letter-publication synthesis must use at least three independent Evidence Families`);
 assert(m.claims.every(c=>c.source_numbers.length),`${mode}: each letter-publication claim needs a citation`);
 if(mode==='researcher'){
  assert(m.research&&m.research.evidence_families>=3,`${mode}: synthesis must expose at least three Evidence Families`);
  assert.equal(m.research.witnesses.length,m.sources.length,`${mode}: researcher mode must expose provenance for every witness`);
  assert(m.research.evidence_map.length>0,`${mode}: researcher mode must expose a claim-to-witness map`);
  assert(m.research.citation_entailment.every(x=>x.valid),`${mode}: synthesis citations must pass entailment`);
  assert(m.research.context_boundary.every(x=>x.valid),`${mode}: synthesis must preserve context boundaries`);
 }else assert.equal(m.research,undefined,'regular mode must not include researcher-only evidence analysis');
}

console.log(`Content readiness: ${unique.size} usable sources; 450 real-corpus answer checks passed, including 10 batch-056 mode-specific checks and 39 item-identity checks`);
