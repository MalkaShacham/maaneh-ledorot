/* Validation layer for the evidence-grounded answer engine.
   Comparative claims require proposition-level evidence for every detected side.
   Evidence-integrity normalization prevents unscoped Verified labels and derived
   translations from being counted as independent witnesses/families.
   Citation validation is claim-local: a citation may support only a proposition
   actually present in that witness, and contextual fields may not leak across witnesses. */
import {buildAnswerModel as buildCoreAnswerModel} from './answer-engine.js?v=20261031-volume13-batch021';

const TOPIC_ALIASES={
  'חינוך':['חינוך','ילד','ילדים','תלמיד','מורה','education','child','children','school','teacher','chinuch'],
  'דאגה':['דאג','חרד','חרדה','פחד','בטחון','anxiety','worry','fear','bitachon'],
  'בריאות':['בריאות','רפואה','רופא','health','medical','doctor','refuah'],
  'מזוזה':['מזוז','mezuzah','mezuza'], 'נשים':['נשים','אשה','אמא','אם המשפחה','woman','women','mother'],
  'פרנסה':['פרנסה','עסק','livelihood','business','parnassa'], 'שליחות':['שליח','שליחות','shliach','shlichus','mission'],
  'נישואין':['שלום בית','נישוא','חתונ','בעל','אשה','marriage','wedding','husband','wife','sholom bayis'],
  'שכחה וחלומות':['שכחה וחלומות','שכחה','חיזוק הזכרון','חלומות מטרידים','forgetfulness and dreams','memory and disturbing dreams'],
  'צדקה ולימוד':['צדקה מחליפה לימוד','צדקה מתוארת כמזככת','צדקה מגדילה את פירות העבודה','charity replace study','charity and study effort'],
  'תפקיד דתי ייחודי':['תפקיד ייחודי בענייני דת','תפקיד המסוים שנמסר','משימה שאחרים אינם יכולים למלא','unique religious role','task others cannot fulfill'],
  'הערות שוליים בספר':['הערות שוליים','הדפסה מחודשת','להדפיס מחדש ספר','לפרסם הערות שוליים','הערות השוליים שהותיר','פרסום מוקדם של ההערות','book marginalia','reprint a book for marginal notes'],
  'עקירת שיניים וחוות דעת':['עקירת שיניים','חוות דעת נוספת','לעקור את כל השיניים','מומחים נוספים','dental extraction second opinion','extract all teeth'],
  'חזרה בחסידות וזיכרון':['לשפר זיכרון','לחזור על חסידות','חזרה בחסידות','חזרה מרובה','כוח הזיכרון','review chassidus memory','repetition and memory'],
  'מקווה בלי המתנה לשלום':['בניית מקווה','לקדם בניית מקווה','מקדמים בניית מקווה','להמתין לשלום','אין לעכב בגללה פעולות אחרות','לקידום מקווה','מקווה בקיבוץ מפלסים','mikveh without waiting for peace'],
  'נוסח תפילה באיחוד בתי כנסת':['נוסח התפילה באיחוד בתי כנסת','איחוד בתי כנסת','התאחדות שני בתי כנסיות','שני בתי כנסת','נוסח האריז״ל','נוסח האריזל','synagogue union prayer rite'],
  'עולים ממרוקו ושפת ההתוועדות':['עולים ממרוקו','אינם מבינים יידיש','אין מבינים אידית','התוועדויות בעברית','התוועדויות תכופות בעברית','moroccan immigrants hebrew farbrengen'],
  'עזיבת פרנסה לפעילות':['לעזוב מקור פרנסה','יעזוב ענין שפרנסתו','פעילות חב״ד ופרנסה','quit livelihood for chabad work'],
  'אהבת התורה':['אהבת התורה','אהבת ההשגה השכלית','הישג השכלי','הנאת הלומד','love of torah','intellectual satisfaction'],
  'אהבת ה׳':['אהבת ה׳','אהבת המקום','גדולת הבורא','ביטול ולשפלות','love of god','love of g-d'],
  'מסחר ולימוד יום שלם':['עיסוק במסחר בזמן לימוד','מסחר בזמן לימוד בישיבה','ישיבה עד הצהריים','לימוד כל היום','חסרון בהתרכזות','business during yeshiva study','full-day yeshiva study'],
  'אותיות מצבה':['אותיות בולטות במצבה','אותיות שקועות במצבה','אותיות המצבה','raised tombstone letters','sunken tombstone letters'],
  'סניף תלמוד תורה ומחנה יום':['סניף תלמוד תורה שאינו מצליח','לסגור סניף תלמוד תורה','חיסול הסניף','מחנה יום','בסיס לרכישת תלמידים','failing talmud torah branch','day camp student recruitment'],
  'הגדלת כיתות ולימוד אישי':['להגדיל משתתפים בכיתות','להגדיל את מספר המשתתפים','כיתות לימוד','לימוד אישי','הלימוד האישי','בלי להזניח לימוד אישי','פוטר','פוטרת','increase class participants','personal study obligation'],
  'כיסוי ראש והשפעה עקיפה':['כיסוי ראש כששכנוע ישיר לא מצליח','כיסוי ראש והשפעה עקיפה','להשפיע בעקיפין על כיסוי ראש','כיסוי הראש','השפעה ישירה','בעקיפין','hair covering indirect influence'],
  'רופאים מומחים והתאמת לימוד':['טיפול רופאים מומחים והתקשה בלימוד','רופאים מומחים והתקשה בלימוד','רופאים מומחים','לשמוע להנחיותיהם','לימוד לגירסא','לימוד בקיאותי','expert doctors study adjustment'],
  'בית מרקחת ושם כפר חב״ד':['בית מרקחת ושם כפר חב״ד','פתיחת בית מרקחת בכפר חב״ד','השם שפריר','כפר חב״ד א׳ וב׳','kfar chabad pharmacy and name'],
  'סניף נשי חב״ד מונטריאול':['סניף נשי חב״ד במונטריאול','סניף מונטריאול של אגודת נשי','סניף מונטריאול','נשי ובנות חב״ד','הרחבת הפעילות','פעילות הסניף','להתרחב','montreal nshei chabad branch'],
  'בית רבקה סדר בוקר':['בית רבקה לימודי חול','בית רבקה להתחיל את היום','בית רבקה מחצית הראשונה','להתחיל את היום בלימודי חול','לימודי חול בחצי יום הראשון','לימודי חול','beis rivka morning secular studies'],
  'כתבי יד משה יצחק מיאס':['כתבי היד של החסיד משה יצחק מיאס','משה יצחק מיאס','כתבי יד','מיאס','moshe yitzchak mias manuscripts'],
  'מניין דירות חדשות כפר חב״ד':['המניין ליד הדירות החדשות','מנין ליד הדירות החדשות','מקום תפילה ליד הדירות החדשות','דירות החדשות','מניין','מנין','new housing minyan kfar chabad'],
  'משמרות שבועות כפר חב״ד':['תכנית המשמרות בחג השבועות בכפר חב״ד','משמרות אמירת תהלים ולימוד חסידות','משמרות','shavuot shifts kfar chabad'],
  'הפצת ספרים':['מימון','הדפס','הוצאה לאור','הפצת ספר','הדפסת ספר','פרסום הספר','פרסומים תורניים','publication','publishing','printing','book'],
  'אמונה':['אמונה','בטחון','faith','belief','trust','emunah','bitachon']
};
const norm=s=>String(s||'').toLowerCase().replace(/[?.,!״׳:'"()\[\]]/g,' ').replace(/\s+/g,' ').trim();
const arr=v=>Array.isArray(v)?v:(v==null||v===''?[]:[v]);
const propositionText=e=>norm(arr(e?._supporting_propositions).concat(arr(e?.response_propositions)).join(' '));
const topicSupported=(claims,topic)=>{const aliases=TOPIC_ALIASES[topic]||[topic];return claims.some(claim=>{const body=norm(claim?.text);return aliases.some(a=>body.includes(norm(a)));});};
const isDerived=e=>/translation|תרגום|derived/.test(norm([e?.primary_secondary_status,e?.source_class,e?.witness_type].join(' ')));
// An index entry establishes the letter's identity/locator, not what the Rebbe said.
const isLocatorOnly=e=>/bibliographic_locator_verified_only|identity\/locator|bibliographic identity|index[- ]first|metadata[_ -]and[_ -]locator[_ -]only/.test(norm([e?.context_status,e?.verification_scope,e?.rights_status].join(' ')));
// Non-verbatim text is answer evidence only when it is an explicit source-grounded
// paraphrase whose source text was inspected and whose location was recorded.
const isInspectedSourceParaphrase=e=>e?.proposition_origin==='source_grounded_paraphrase'&&e?.proposition_verbatim===false&&e?.proposition_verification==='source_text_inspected'&&Boolean(e?.proposition_source_locator);
// Editorial summaries and unverified paraphrases remain discovery aids only.
const isEditorialSummaryOnly=e=>e?.proposition_origin==='editorial_summary_derived'||(e?.proposition_verbatim===false&&!isInspectedSourceParaphrase(e));
const tokens=s=>new Set(norm(s).split(/\s+/).filter(x=>x.length>1));
const overlapRatio=(a,b)=>{const A=tokens(a),B=tokens(b);if(!A.size||!B.size)return 0;let n=0;A.forEach(x=>{if(B.has(x))n++;});return n/Math.min(A.size,B.size);};
const CATALOG_STOP=new Set('מה הרבי אמר אומר על של את עם או וגם לגבי האם לי יש היה היא הוא זה זו אני אנחנו בנושא בעניין רוצה לדעת the a an of to and or on about what how did does is are rebbe say says said'.split(' '));

/* Catalog matches are discovery leads, never answer evidence. Ranking may use
   publisher metadata or an editorial summary, but the returned object deliberately
   omits summaries and propositions so downstream renderers cannot quote them. */
export function retrieveCatalogMatches(index=[],q,{limit=6}={}){
  const query=norm(q),raw=query.split(/\s+/).filter(t=>t.length>1&&!CATALOG_STOP.has(t));
  const topicAliases=Object.values(TOPIC_ALIASES).filter(group=>group.some(a=>query.includes(norm(a)))).flat().map(norm);
  const terms=[...new Set([...raw,...topicAliases])];if(!terms.length)return[];
  const score=e=>{const metadata=norm([e.title,e.source_class,e.date,e.language,arr(e.publisher_terms).join(' '),arr(e.research_terms).join(' '),JSON.stringify(e.locator||'')].join(' '));const discovery=norm([metadata,e.summary,arr(e.response_propositions).join(' ')].join(' '));const hits=terms.filter(t=>discovery.includes(t));return{value:hits.length*2+terms.filter(t=>metadata.includes(t)).length+(e.status==='Verified'?1:0),hits};};
  const seen=new Set();return index.map(e=>({e,...score(e)})).filter(x=>x.hits.length>0).sort((a,b)=>b.value-a.value).filter(x=>{const k=x.e.source_url||x.e.key||x.e.id;if(!k||seen.has(k))return false;seen.add(k);return true;}).slice(0,limit).map(({e,hits})=>({
    key:e.key||e.id||null,title:e.title||e.id||'רשומה ללא כותרת',source_url:e.source_url||null,
    source_class:e.source_class||null,date:e.date||null,language:e.language||null,
    status:e.status||null,canonical_status:e.canonical_status||null,context_status:e.context_status||'unknown',
    verification_scope:e.verification_scope||null,locator:e.locator||null,
    matched_terms:hits,match_basis:'catalog_metadata_or_editorial_summary',
    answer_evidence:false,content_claims_excluded:true
  }));
}

export function normalizeEvidenceIntegrity(index=[]){
  return index.map(source=>{const e={...source},issues=[];if(e.status==='Verified'&&!e.verification_scope){e.status='Linked';e._reported_status='Verified';issues.push('verified_without_scope_demoted');}if(isLocatorOnly(e)){if(e.has_content_evidence||arr(e.response_propositions).length)issues.push('locator_only_content_blocked');e.has_content_evidence=false;e.response_propositions=[];e._supporting_propositions=[];}if(isEditorialSummaryOnly(e)){if(e.has_content_evidence||arr(e.response_propositions).length)issues.push('editorial_summary_answer_evidence_blocked');e._content_evidence_status='editorial_summary_only';e.has_content_evidence=false;e.response_propositions=[];e._supporting_propositions=[];}if(isDerived(e)){const parent=e.parent_evidence_family_id||e.derived_from_evidence_family_id||e.translation_of_evidence_family_id||null;if(parent)e.evidence_family_id=parent;else issues.push('derived_witness_parent_family_unknown');e._independent_witness=false;}else e._independent_witness=true;if(issues.length)e._evidence_integrity_issues=issues;return e;});
}

/* The core engine copies source proposition wording into a claim (no paraphrase).
   Therefore a citation must match that proposition exactly after harmless formatting
   normalization. Lexical overlap is NOT semantic entailment; do not accept it here. */
export function citationEntailment(model){
  const sources=model?.sources||[];
  return (model?.claims||[]).map((claim,claimIndex)=>{
    const asserted=arr(claim.source_numbers);
    const entailed=asserted.filter(n=>{const e=sources[n-1];if(!e)return false;const props=arr(e._supporting_propositions).concat(arr(e.response_propositions));return props.some(p=>norm(claim.text)===norm(typeof p==='string'?p:JSON.stringify(p)));});
    return {claim_number:claimIndex+1,asserted_source_numbers:asserted,entailed_source_numbers:entailed,unsupported_source_numbers:asserted.filter(n=>!entailed.includes(n)),valid:entailed.length>0&&entailed.length===asserted.length};
  });
}

/* Context is witness-local and value-local. Every circumstance, qualification and audience
   value attached to a synthesized claim must occur on at least one witness that independently
   entails that claim. Merely having some value in the same field is not enough. */
export function contextBoundary(model,entailment){
  const sources=model?.sources||[];
  return (model?.claims||[]).map((claim,i)=>{
    const supporting=new Set(entailment[i]?.entailed_source_numbers||[]);
    const local=[...supporting].map(n=>sources[n-1]).filter(Boolean);
    const missingValues=(claimField,sourceField=claimField)=>arr(claim[claimField]).filter(Boolean).filter(value=>!local.some(e=>arr(e[sourceField]).filter(Boolean).some(v=>norm(v)===norm(value))));
    const missing={
      documented_circumstances:missingValues('documented_circumstances'),
      conditions_or_qualifications:missingValues('conditions_or_qualifications'),
      audiences:missingValues('audiences','audience')
    };
    const leaks=Object.entries(missing).filter(([,values])=>values.length).map(([field])=>field);
    return {claim_number:i+1,valid:leaks.length===0,possible_context_leakage:leaks,unsupported_context_values:missing};
  });
}

export function comparativeCoverage(model){if(model?.understanding?.intent!=='comparative')return null;const requested=[...new Set(model.understanding.topics||[])];if(requested.length<2)return {enforceable:false,requested_topics:requested,supported_topics:[],missing_topics:[],reason:'comparison_sides_not_fully_parsed'};const claims=model.claims||[],supported=requested.filter(t=>topicSupported(claims,t)),missing=requested.filter(t=>!supported.includes(t));return {enforceable:true,requested_topics:requested,supported_topics:supported,missing_topics:missing,scope:'displayed_claims'};}

export function buildAnswerModel(index,q,options={}){
  const normalized=normalizeEvidenceIntegrity(index);let model=buildCoreAnswerModel(normalized,q,options);
  model.catalog_matches=retrieveCatalogMatches(index,q);
  const integrityIssues=(model.sources||[]).flatMap((e,i)=>arr(e._evidence_integrity_issues).map(issue=>({source_number:i+1,issue,reported_status:e._reported_status||null})));
  const entailment=citationEntailment(model),boundaries=contextBoundary(model,entailment);
  const citationFailures=entailment.filter(x=>!x.valid),contextFailures=boundaries.filter(x=>!x.valid);
  model.citation_entailment=entailment;model.context_boundary=boundaries;
  if(citationFailures.length||contextFailures.length){model={...model,answerable:false,reason:citationFailures.length?'citation_entailment_failed':'context_boundary_failed',claims:[],answered_well:[],insufficient_evidence:[...(model.insufficient_evidence||[]),...(citationFailures.length?['לפחות citation אחד אינו נתמך ישירות ב-proposition של ה-witness המצוטט.']:[]),...(contextFailures.length?['זוהתה אפשרות לזליגת הקשר בין witnesses; אין להציג את הטענה עד לבירור.']:[])]};}
  if(options.mode==='researcher'){model.research=model.research||{};model.research.evidence_integrity={issues:integrityIssues,independent_witnesses:(model.sources||[]).filter(e=>e._independent_witness!==false).length,derived_non_independent:(model.sources||[]).filter(e=>e._independent_witness===false).length};model.research.citation_entailment=entailment;model.research.context_boundary=boundaries;}
  const coverage=comparativeCoverage(model);if(!coverage)return model;model.comparative_coverage=coverage;
  if(!coverage.enforceable)return {...model,answerable:false,reason:'comparative_sides_unresolved',claims:[],answered_well:[],insufficient_evidence:[...(model.insufficient_evidence||[]),'לא ניתן לזהות בביטחון את שני צדי ההשוואה; אין להסיק הבדל.']};
  if(coverage.missing_topics.length)return {...model,answerable:false,reason:'comparative_missing_side',claims:[],answered_well:coverage.supported_topics.map(t=>`נמצאו ראיות לצד: ${t}`),insufficient_evidence:[...(model.insufficient_evidence||[]),...coverage.missing_topics.map(t=>`אין די ראיות ברמת proposition לצד: ${t}`)]};
  if(options.mode==='researcher'){model.research=model.research||{};model.research.comparative_coverage=coverage;}return model;
}

