/* Maaneh Ledorot evidence-grounded answer engine core. Precision > recall. */
const STOP=new Set('מה הרבי אמר אומר על של את עם או וגם לגבי האם לי יש היה היא הוא זה זו אני אנחנו מתוך בנושא בעניין רוצה לדעת כיצד אילו איזה מהו מהי מהם מהן מי מתי the a an of to and or on about what how did does is are rebbe say says said saying teach teaches taught teaching advise advises advised guidance'.split(' '));
// Normalize Hebrew clitic prefixes so "מפרה" and "באיגרת" match documented content.
const queryToken=s=>{if(!/^[א-ת]+$/.test(s))return s;let t=s.replace(/^[ובכלמש]ה(?=.{3,})/,'');if(t===s&&t.length>3&&/^[ובכלמשה]/.test(t))t=t.slice(1);return t;};
const TOPICS={
 חינוך:['חינוך','ילד','ילדים','תלמיד','מורה','education','child','children','school','teacher','chinuch','קינדער'],
 דאגה:['דאג','חרד','חרדה','פחד','בטחון','anxiety','worry','fear','bitachon'],
 בריאות:['בריאות','רפואה','רופא','health','medical','doctor','refuah'],
 מזוזה:['מזוז','mezuzah','mezuza'], נשים:['נשים','אשה','אם','woman','women','mother','פרוי','פרויען'],
 פרנסה:['פרנסה','עסק','livelihood','business','parnassa'], שליחות:['שליח','שליחות','shliach','shlichus','mission'],
 נישואין:['שלום בית','נישוא','חתונ','בעל','אשה','marriage','wedding','husband','wife','sholom bayis'],
 אמונה:['אמונה','בטחון','faith','belief','trust','emunah','bitachon']};
const norm=s=>String(s||'').toLowerCase().replace(/[?.,!״׳:'"()\[\]]/g,' ').replace(/\s+/g,' ').trim();
const arr=v=>Array.isArray(v)?v:(v==null||v===''?[]:[v]);
const text=v=>arr(v).map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' ');
const topicVocab=new Set(Object.values(TOPICS).flat().map(norm));
const contentWords=s=>norm(s).split(/\s+/).filter(x=>x.length>1&&!STOP.has(x));
const scriptOf=s=>/[א-ת]/.test(s)?'hebrew-script':/[a-z]/i.test(s)?'latin':'other';
const NEGATION=new Set(['לא','אין','אינו','אינה','אינם','אינן','בלי','אסור','never','not','no','without','prohibited']);
const tokenSet=s=>new Set(contentWords(s));
const jaccard=(a,b)=>{const A=tokenSet(a),B=tokenSet(b);if(!A.size||!B.size)return 0;let i=0;A.forEach(x=>{if(B.has(x))i++;});return i/(A.size+B.size-i);};
const negationSignature=s=>contentWords(s).some(x=>NEGATION.has(x));
// Latin query terms must match whole tokens/phrases: substring matching made
// `fear` incorrectly match `G-d-fearing`. Hebrew aliases intentionally include
// productive stems (for example דאג), so Hebrew keeps conservative substring matching.
const containsTerm=(body,term)=>{const b=norm(body),t=norm(term);if(!t)return false;if(/[a-z]/i.test(t)){if(t.includes(' '))return ` ${b} `.includes(` ${t} `);return b.split(/\s+/).includes(t);}return b.includes(t);};
// Intent markers describe the requested analysis, not facts that must occur in a
// source proposition. Keeping `pattern`/`דפוס` as a content qualifier made every
// pattern question fail even when multiple independent evidence families existed.
const isIntentFramingTerm=(term,intent)=>{
 const t=norm(term);
 if(intent==='pattern')return /^(?:pattern|patterns|recurring|usually|approach|approaches|דפוס|דפוסים|חוזר|חוזרת|חוזרים|בדרך|כלל|גישה|גישות|הדרכה|הדרכות|בהדרכה|בהדרכות)$/.test(t);
 if(intent==='comparative')return /^(?:compare|comparison|comparisons|difference|differences|versus|vs|between|השווה|השוו|השוואה|השוואת|הבדל|הבדלים|לעומת|בין)$/.test(t);
 if(intent==='historical')return /^(?:when|date|dates|period|periods|year|years|time|מתי|תאריך|תאריכים|תקופה|תקופות|שנה|שנים|כתב|כותב|דיבר|לימד|הדריך)$/.test(t);
 if(intent==='bibliographic')return /^(?:source|sources|bibliographic|bibliography|citation|citations|where|published|publication|מקור|מקורות|ביבליוגרפיה|ביבליוגרפי|איפה|פורסם|פרסום)$/.test(t);
 if(intent==='circumstances')return /^(?:under|circumstance|circumstances|condition|conditions|audience|recommended|recommend|when|באילו|נסיבות|תנאי|תנאים|קהל|למי|המליץ|המלצה|מתי)$/.test(t);
 return false;
};

export function understandQuestion(q){
 const original=String(q||''),query=norm(original),raw=query.split(/\s+/).map(queryToken).filter(x=>x.length>1&&!STOP.has(x));
 const topics=Object.entries(TOPICS).filter(([,vs])=>vs.some(v=>query.includes(norm(v)))).map(([k])=>k);
 const intent=/דפוס|חוזר|בדרך כלל|גישה|pattern|usually/.test(query)?'pattern':/הבדל|לעומת|השוו|השווא|compare|difference/.test(query)?'comparative':/מתי|תאריך|תקופה|שנה|when|date|period/.test(query)?'historical':/מקור|ביבליוגר|איפה פורסם|source|bibliograph/.test(query)?'bibliographic':/באילו נסיבות|נסיבות|מתי המליץ|תנאי|למי|circumstance|condition|audience/.test(query)?'circumstances':'guidance';
 const entities=(original.match(/(?:[A-Z][\w-]+(?:\s+[A-Z][\w-]+)*)|(?:[א-ת]{2,}(?:\s+[א-ת]{2,}){1,2})/g)||[]).map(norm).filter(x=>!STOP.has(x)).slice(0,8);
 const semanticRaw=raw.filter(t=>!isIntentFramingTerm(t,intent));
 const expanded=[...semanticRaw];topics.forEach(k=>expanded.push(...TOPICS[k]));
 const topicTokens=new Set(topics.flatMap(k=>(TOPICS[k]||[]).map(norm)));
 const isTopicToken=t=>topicTokens.has(t)||[...topicTokens].some(alias=>containsTerm(t,alias));
 return {query,query_script:scriptOf(query),topic:topics[0]||null,topics,intent,entities,subtopic:semanticRaw.filter(t=>!isTopicToken(t)).slice(0,8),terms:[...new Set(expanded.map(norm))]};
}
function evidenceText(e){return norm([text(e.response_propositions),text(e.question_or_problem),text(e.conditions_or_qualifications),text(e.documented_circumstances),text(e.audience)].join(' '));}
function metadataText(e){return norm([e.title,e.search_text,e.source_class,e.date,e.language,e.topic,e.subtopic].join(' '));}
function overlap(t,terms){return terms.reduce((n,x)=>n+(x&&containsTerm(t,x)?1:0),0);}
function familyKey(e){return e.evidence_family_id||e.aid||e.source_url||e.key;}
function propositionKey(p){return contentWords(p).sort().join(' ');}
function sameClaim(a,b){if(propositionKey(a)===propositionKey(b))return true;if(negationSignature(a)!==negationSignature(b))return false;return jaccard(a,b)>=0.72;}
function propositionSupportsQuery(p,u){const body=norm(p),raw=u.terms.filter(t=>!topicVocab.has(t)),topicTerms=u.topics.flatMap(t=>TOPICS[t]||[]).map(norm);const specific=overlap(body,raw),topical=overlap(body,topicTerms);if(u.topics.length&&topical===0)return false;return specific>0||topical>=2||(!raw.length&&topical>0);}
function intentEvidenceGate(e,u){
 if(u.intent==='circumstances'&&!text(e.documented_circumstances)&&!text(e.conditions_or_qualifications)&&!text(e.audience))return 'missing documented circumstances/conditions/audience';
 // Circumstances are not temporal evidence. A historical answer may only use a
 // witness with explicit date/period metadata; otherwise an undated case can be
 // presented misleadingly as an answer to "when".
 if(u.intent==='historical'&&!e.date)return 'missing documented date/period metadata';
 if(u.intent==='bibliographic'&&!e.source_url&&!e.provenance&&!e.witness_provenance&&!e.source_witness)return 'missing bibliographic provenance';
 return null;
}

export function propositionRelevance(e,u){
 if(!e?.has_content_evidence)return{score:0,support:'unknown_content',reasons:['no content evidence']};
 const body=evidenceText(e);if(!body)return{score:0,support:'unknown_content',reasons:['empty evidence body']};
 const gate=intentEvidenceGate(e,u);if(gate)return{score:0,support:'insufficient_intent_evidence',reasons:[gate]};
 const raw=u.subtopic.filter(t=>!topicVocab.has(t)),topicTerms=u.topics.flatMap(t=>TOPICS[t]||[]).map(norm),rawHit=overlap(body,raw),topicHit=overlap(body,topicTerms);
 // Specific qualifiers must be grounded in evidence text, not in publisher metadata.
 if(raw.length && raw.some(t=>!containsTerm(body,t)))return{score:0,support:'insufficient_specific_evidence',reasons:['question-specific qualifier absent from evidence']};
 const supportingProps=arr(e.response_propositions).filter(p=>propositionSupportsQuery(p,u));
 if(u.topics.length&&topicHit===0)return{score:0,support:'lexical_only',reasons:['topic absent from evidence']};
 if(!supportingProps.length&&u.intent==='guidance')return{score:1,support:'contextual_support',reasons:['no proposition entails guidance query']};
 if(raw.length&&rawHit===0&&topicHit<2)return{score:1,support:'contextual_support',reasons:['topic context without question-specific support']};
 let score=topicHit*2+rawHit*3+(e.status==='Verified'?2:0)+Math.min(4,supportingProps.length*2);
 if(u.intent==='circumstances')score+=3;if(u.intent==='guidance'&&supportingProps.length)score+=3;if(u.intent==='historical'&&e.date)score+=2;if(u.intent==='bibliographic'&&(e.source_url||e.provenance||e.witness_provenance))score+=2;
 return{score,support:score>=6?'direct_support':'contextual_support',reasons:[`topic=${topicHit}`,`specific=${rawHit}`,`supporting_propositions=${supportingProps.length}`],supportingProps};
}
export function retrieveEvidence(index,q,{limit=36,threshold=6}={}){const understanding=understandQuestion(q);const candidates=index.map(e=>({e,seed:overlap(metadataText(e),understanding.terms)+2*overlap(evidenceText(e),understanding.terms)})).filter(x=>x.seed>0).sort((a,b)=>b.seed-a.seed);const reranked=candidates.map(({e})=>({e,...propositionRelevance(e,understanding)})).filter(x=>x.support==='direct_support'&&x.score>=threshold).sort((a,b)=>b.score-a.score);/* Greedy diversity-aware reranking: each candidate must independently pass
   proposition-level relevance. Novelty cannot rescue a lexical-only result. */
const seen=new Set(),hits=[],remaining=reranked.slice();
const typeCount=new Map(),periodCount=new Map();
const sourceType=e=>norm(e.source_class||e.witness_type||'unknown');
const sourcePeriod=e=>{const m=String(e.date||'').match(/(?:18|19|20)\d{2}/);return m?String(Math.floor(Number(m[0])/10)*10):null;};
while(hits.length<limit&&remaining.length){
 let best=-1,bestUtility=-Infinity;
 for(let i=0;i<remaining.length;i++){
  const r=remaining[i],e=r.e,k=familyKey(e);if(seen.has(k))continue;
  const type=sourceType(e),period=sourcePeriod(e);
  const utility=r.score+(typeCount.has(type)?-Math.min(5,1.5*typeCount.get(type)):3)
   +(period?(periodCount.has(period)?-Math.min(2,0.5*periodCount.get(period)):1):0);
  if(utility>bestUtility){bestUtility=utility;best=i;}
 }
 if(best<0)break;
 const [r]=remaining.splice(best,1),e=r.e,k=familyKey(e),type=sourceType(e),period=sourcePeriod(e);
 seen.add(k);typeCount.set(type,(typeCount.get(type)||0)+1);
 if(period)periodCount.set(period,(periodCount.get(period)||0)+1);
 hits.push({...e,_relevance:r.score,_support:r.support,_supporting_propositions:r.supportingProps||[]});
}
return{understanding,hits};}
/* Preserve distinct source-grounded propositions and their circumstances.
   Round-robin extraction prevents a single verbose witness from monopolizing the
   answer budget. Only identical normalized propositions with identical documented
   context are grouped; lexical similarity is NOT semantic entailment. */
function synthesizeClaims(selected,u,limit){
 const grouped=new Map(),ordered=[];
 const perSource=selected.map(e=>(e._supporting_propositions?.length
  ?e._supporting_propositions:arr(e.response_propositions).filter(p=>propositionSupportsQuery(p,u)))
  .map(p=>String(p).trim()).filter(Boolean));
 const maxDepth=Math.max(0,...perSource.map(p=>p.length));
 for(let depth=0;depth<maxDepth;depth++){
  for(let sourceIndex=0;sourceIndex<selected.length;sourceIndex++){
   const p=perSource[sourceIndex][depth];if(!p)continue;
   const e=selected[sourceIndex];
   const contextKey=fields=>arr(fields).map(x=>norm(x)).filter(Boolean).sort().join('|');
   const key=JSON.stringify([norm(p),contextKey(e.documented_circumstances),
    contextKey(e.conditions_or_qualifications),contextKey(e.audience)]);
   let g=grouped.get(key);
   if(!g){g={text:p,source_numbers:[],families:new Set(),statuses:new Set(),
    contexts:new Set(),circumstances:new Set(),conditions:new Set(),
    audiences:new Set(),witnesses:[]};grouped.set(key,g);ordered.push(g);}
   g.source_numbers.push(sourceIndex+1);g.families.add(familyKey(e));
   g.statuses.add(e.status);g.contexts.add(e.context_status);
   arr(e.documented_circumstances).filter(Boolean).forEach(x=>g.circumstances.add(String(x)));
   arr(e.conditions_or_qualifications).filter(Boolean).forEach(x=>g.conditions.add(String(x)));
   arr(e.audience).filter(Boolean).forEach(x=>g.audiences.add(String(x)));
   g.witnesses.push({source_number:sourceIndex+1,family:familyKey(e),
    provenance:e.witness_provenance||e.source_witness||e.witness_type||null,
    verification_scope:e.verification_scope||null,status:e.status||null,
    context_status:e.context_status||'unknown',language:e.language||null});
  }
 }
 // A comparison is useful only when the displayed claim budget contains evidence
 // for every detected side. Reserve the first slots for one proposition per side;
 // otherwise a verbose first witness can consume the entire regular-mode budget.
 const prioritized=[];
 if(u.intent==='comparative')for(const topic of u.topics){
  const aliases=(TOPICS[topic]||[]).map(norm),match=ordered.find(g=>!prioritized.includes(g)&&aliases.some(alias=>containsTerm(g.text,alias)));
  if(match)prioritized.push(match);
 }
 const withinBudget=[...prioritized,...ordered.filter(g=>!prioritized.includes(g))].slice(0,limit);
 return withinBudget.map(g=>({text:g.text,
  source_numbers:[...new Set(g.source_numbers)],
  evidence_family_ids:[...g.families],verification_status:[...g.statuses],
  context_status:[...g.contexts],documented_circumstances:[...g.circumstances],
  conditions_or_qualifications:[...g.conditions],audiences:[...g.audiences],
  witnesses:g.witnesses}));
}
function findTensions(claims){const out=[];for(let i=0;i<claims.length;i++)for(let j=i+1;j<claims.length;j++){const a=claims[i],b=claims[j],similarity=jaccard(a.text,b.text);if(similarity>=0.45&&negationSignature(a.text)!==negationSignature(b.text)){out.push({claim_numbers:[i+1,j+1],similarity:Number(similarity.toFixed(2)),type:'possible_directional_tension',note:'Lexically related propositions differ in negation/direction; review witness context before synthesizing as consensus.'});}}return out;}
// Multiple witnesses on one topic do not by themselves establish a pattern.
// Keep only propositions that recur (exactly or with high lexical agreement)
// across independent evidence families. This conservative gate avoids turning
// unrelated education cases into a general rule attributed to the Rebbe.
function crossFamilyPatternEvidence(selected,u){
 const rows=selected.map((e,index)=>({e,index,family:familyKey(e),
  props:(e._supporting_propositions?.length?e._supporting_propositions:
   arr(e.response_propositions).filter(p=>propositionSupportsQuery(p,u))).map(String)}));
 const matched=new Map(),add=(index,p)=>{if(!matched.has(index))matched.set(index,new Set());matched.get(index).add(p);};
 for(let i=0;i<rows.length;i++)for(let j=i+1;j<rows.length;j++){
  const a=rows[i],b=rows[j];
  if(a.e._independent_witness===false||b.e._independent_witness===false||!a.family||a.family===b.family)continue;
  for(const pa of a.props)for(const pb of b.props)if(sameClaim(pa,pb)){add(a.index,pa);add(b.index,pb);}
 }
 return rows.filter(r=>matched.has(r.index)).map(r=>({...r.e,_supporting_propositions:[...matched.get(r.index)]}));
}
function classifyWitness(e){const s=norm([e.primary_secondary_status,e.source_class,e.witness_type].join(' '));return /primary|ראשוני|direct/.test(s)?'primary':/translation|תרגום|derived/.test(s)?'derived':/secondary|מאוחר|עיבוד/.test(s)?'secondary':'unspecified';}
function coverageFor(selected,u){const covered=[],missing=[];if(selected.length)covered.push('תוכן המענה');if(u.intent==='circumstances')(selected.some(e=>text(e.documented_circumstances)||text(e.conditions_or_qualifications)||text(e.audience))?covered:missing).push('נסיבות/תנאים/קהל');if(u.intent==='historical')(selected.some(e=>e.date)?covered:missing).push('תאריך/תקופה');if(u.intent==='bibliographic')(selected.some(e=>e.source_url||e.provenance||e.witness_provenance)?covered:missing).push('provenance ביבליוגרפי');if(u.intent==='pattern')(new Set(selected.map(familyKey)).size>=2?covered:missing).push('דפוס בין משפחות ראיות עצמאיות');return{covered,missing};}
const MODE_BUDGETS={regular:{sources:6,claims:5},researcher:{sources:24,claims:32}};
function presentationFor(mode){const budget=MODE_BUDGETS[mode];return{answer_style:mode==='researcher'?'extended_evidence_analysis':'concise_answer_first',detail_level:mode==='researcher'?'witness_level':'summary',source_limit:budget.sources,claim_limit:budget.claims};}
function groupSourceValues(selected,field){
 const groups=new Map();
 selected.forEach((e,i)=>arr(typeof field==='function'?field(e):e[field]).filter(Boolean).forEach(value=>{
  const label=String(value),key=norm(label);if(!key)return;
  if(!groups.has(key))groups.set(key,{value:label,source_numbers:[]});
  groups.get(key).source_numbers.push(i+1);
 }));
 return [...groups.values()];
}
function researcherAnalysis(selected,claims){
 const supportedBySource=selected.map((_,i)=>claims.map((claim,j)=>claim.source_numbers.includes(i+1)?j+1:null).filter(Boolean));
 return{
  cases:selected.map((e,i)=>({source_number:i+1,supported_claim_numbers:supportedBySource[i],evidence_family_id:familyKey(e)||null,date:e.date||null,audiences:arr(e.audience).filter(Boolean),documented_circumstances:arr(e.documented_circumstances).filter(Boolean),conditions_or_qualifications:arr(e.conditions_or_qualifications).filter(Boolean),source_class:e.source_class||null,witness_class:classifyWitness(e),provenance:e.witness_provenance||e.source_witness||e.witness_type||null,verification_scope:e.verification_scope||null,pipeline_status:e.status||null,context_status:e.context_status||'unknown',language:e.language||null})),
  distinctions:{periods:groupSourceValues(selected,'date'),audiences:groupSourceValues(selected,'audience'),circumstances:groupSourceValues(selected,'documented_circumstances'),conditions:groupSourceValues(selected,'conditions_or_qualifications'),source_classes:groupSourceValues(selected,'source_class'),context_statuses:groupSourceValues(selected,e=>e.context_status||'unknown')}
 };
}
function retainCitedSources(selected,claims){
 const used=new Set(claims.flatMap(claim=>claim.source_numbers)),oldToNew=new Map(),sources=[];
 selected.forEach((source,index)=>{const oldNumber=index+1;if(used.has(oldNumber)){oldToNew.set(oldNumber,sources.length+1);sources.push(source);}});
 const remap=number=>oldToNew.get(number);
 return{sources,claims:claims.map(claim=>({...claim,
  source_numbers:claim.source_numbers.map(remap).filter(Boolean),
  witnesses:arr(claim.witnesses).filter(w=>oldToNew.has(w.source_number)).map(w=>({...w,source_number:remap(w.source_number)}))
 }))};
}
export function buildAnswerModel(index,q,{mode='regular'}={}){
 const answerMode=mode==='researcher'?'researcher':'regular',presentation=presentationFor(answerMode),budget=MODE_BUDGETS[answerMode];
 const{understanding,hits}=retrieveEvidence(index,q),usable=hits.filter(e=>e._supporting_propositions?.length||arr(e.response_propositions).some(p=>propositionSupportsQuery(p,understanding))),families=new Set(usable.filter(e=>e._independent_witness!==false).map(familyKey).filter(Boolean));
 if(!usable.length)return{mode:answerMode,presentation,understanding,answerable:false,reason:'insufficient_evidence',claims:[],sources:[],answered_well:[],insufficient_evidence:[q]};
 if(understanding.intent==='pattern'&&families.size<2)return{mode:answerMode,presentation,understanding,answerable:false,reason:'single_evidence_family',claims:[],sources:usable.slice(0,2),answered_well:[],insufficient_evidence:['אין שתי משפחות ראיות עצמאיות לאחר dedup']};
 let answerEvidence=usable;
 if(understanding.intent==='pattern'){
  answerEvidence=crossFamilyPatternEvidence(usable,understanding);
  const recurringFamilies=new Set(answerEvidence.map(familyKey).filter(Boolean));
  if(recurringFamilies.size<2)return{mode:answerMode,presentation,understanding,answerable:false,reason:'no_cross_family_pattern',claims:[],sources:usable.slice(0,4),answered_well:['נמצאו כמה מקרים מתועדים בנושא'],insufficient_evidence:['לא נמצאה טענה חוזרת דומה בשתי משפחות ראיות עצמאיות; אין לייחס דפוס רוחבי.']};
 }
 const candidates=answerEvidence.slice(0,budget.sources),synthesized=synthesizeClaims(candidates,understanding,budget.claims),initialCoverage=coverageFor(candidates,understanding);
 if(!synthesized.length)return{mode:answerMode,presentation,understanding,answerable:false,reason:'no_entailed_propositions',claims:[],sources:candidates,answered_well:initialCoverage.covered,insufficient_evidence:[...initialCoverage.missing,q]};
 const retained=retainCitedSources(candidates,synthesized),selected=retained.sources,claims=retained.claims,coverage=coverageFor(selected,understanding);
 const base={mode:answerMode,presentation,understanding,answerable:true,reason:null,claims,sources:selected,answered_well:coverage.covered,insufficient_evidence:coverage.missing};
 if(answerMode==='researcher'){const witnessClasses=selected.reduce((a,e)=>(a[classifyWitness(e)]=(a[classifyWitness(e)]||0)+1,a),{});const selectedIndependentFamilies=new Set(selected.filter(e=>e._independent_witness!==false).map(familyKey).filter(Boolean)),analysis=researcherAnalysis(selected,claims);base.research={evidence_families:selectedIndependentFamilies.size,verified_sources:selected.filter(e=>e.status==='Verified').length,partial_context_sources:selected.filter(e=>e.context_status==='partial').length,periods:[...new Set(selected.map(e=>e.date).filter(Boolean))],audiences:[...new Set(selected.flatMap(e=>arr(e.audience)).filter(Boolean))],source_classes:[...new Set(selected.map(e=>e.source_class).filter(Boolean))],languages:[...new Set(selected.map(e=>e.language).filter(Boolean))],witness_classes:witnessClasses,pipeline_statuses:[...new Set(selected.map(e=>e.status).filter(Boolean))],coverage,tensions:findTensions(claims),evidence_map:claims.map((c,i)=>({claim_number:i+1,claim:c.text,source_numbers:c.source_numbers,evidence_family_ids:c.evidence_family_ids,documented_circumstances:c.documented_circumstances,conditions_or_qualifications:c.conditions_or_qualifications,audiences:c.audiences,witnesses:c.witnesses})),cases:analysis.cases,distinctions:analysis.distinctions,witnesses:selected.map(e=>({family:familyKey(e),provenance:e.witness_provenance||e.source_witness||e.witness_type||null,verification_scope:e.verification_scope||null,context_status:e.context_status||'unknown',language:e.language||null,witness_class:classifyWitness(e),primary_secondary_status:e.primary_secondary_status||null,duplicate_or_parallel_relations:e.duplicate_or_parallel_relations||[]}))};}
 return base;
}
