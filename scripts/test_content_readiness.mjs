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
const publicationQuestion='מה עולה מהאיגרות על מימון והפצת ספרי חסידות?';
for(const mode of ['regular','researcher']){
  const m=buildAnswerModel(idx.entries,publicationQuestion,{mode});
  assert(m.answerable,`${mode}: inspected publication evidence must answer the natural-language query`);
  assert(m.sources.length>=3,`${mode}: publication synthesis must use at least three independent evidence families`);
  assert(new Set(m.sources.map(e=>e.evidence_family_id)).size>=3,`${mode}: translations or duplicate witnesses must not inflate publication synthesis`);
  assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every publication claim needs a proposition-level citation`);
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
  assert(m.sources.length<=2,`${mode}: generic study or forgetfulness evidence must not flood the combined query`);
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
    assert(m.sources.length<=(mode==='researcher'?8:4),`${mode}: the specific batch-022 query must not be flooded by generic evidence`);
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
    assert(m.sources.length<=(mode==='researcher'?8:4),`${mode}: the specific batch-023 query must not be flooded by generic evidence`);
    assert(m.claims.every(c=>c.source_numbers.length),`${mode}: every batch-023 claim needs a proposition-level citation`);
  }
}
console.log(`Content readiness: ${unique.size} usable sources; sixty-seven real-corpus answer checks passed`);

