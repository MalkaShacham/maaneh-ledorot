/* Maaneh Ledorot evidence-grounded answer engine core.
 * Pure module: no DOM dependencies. Precision is preferred to recall.
 */
const STOP = new Set('מה הרבי אמר אומר על של את עם או וגם לגבי האם לי יש היה היא הוא זה זו אני אנחנו מתוך בנושא בעניין רוצה לדעת כיצד אילו איזה'.split(' '));
const TOPICS={
  חינוך:['חינוך','ילד','ילדים','תלמיד','מורה','education','child','children','school','teacher'],
  דאגה:['דאג','חרד','חרדה','פחד','בטחון','anxiety','worry','fear','bitachon'],
  בריאות:['בריאות','רפואה','רופא','health','medical','doctor'],
  מזוזה:['מזוז','mezuzah','mezuza'],נשים:['נשים','אשה','אם','woman','women','mother'],
  פרנסה:['פרנסה','עסק','livelihood','business','parnassa'],שליחות:['שליח','שליחות','shliach','shlichus','mission'],
  נישואין:['שלום בית','נישוא','חתונ','בעל','אשה','marriage','wedding','husband','wife'],אמונה:['אמונה','בטחון','faith','belief','trust']
};
const norm=s=>String(s||'').toLowerCase().replace(/[?.,!״׳:'"()\[\]]/g,' ').replace(/\s+/g,' ').trim();
const arr=v=>Array.isArray(v)?v:(v==null||v===''?[]:[v]);
const text=v=>arr(v).map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' ');
const topicVocab=new Set(Object.values(TOPICS).flat().map(norm));
const contentWords=s=>norm(s).split(/\s+/).filter(x=>x.length>1&&!STOP.has(x));

export function understandQuestion(q){
  const query=norm(q), raw=query.split(/\s+/).filter(x=>x.length>1&&!STOP.has(x));
  const topics=Object.entries(TOPICS).filter(([,vs])=>vs.some(v=>query.includes(norm(v)))).map(([k])=>k);
  const intent=/דפוס|חוזר|בדרך כלל|גישה/.test(query)?'pattern':/הבדל|לעומת|השוו|השווא/.test(query)?'comparative':/מתי|תאריך|תקופה|שנה/.test(query)?'historical':/מקור|ביבליוגר|איפה פורסם/.test(query)?'bibliographic':/באילו נסיבות|נסיבות|מתי המליץ|תנאי|למי/.test(query)?'circumstances':'guidance';
  const entities=raw.filter(t=>/^[A-Z][\w-]+$/.test(t));
  const expanded=[...raw]; topics.forEach(k=>expanded.push(...TOPICS[k]));
  return {query,topic:topics[0]||null,topics,intent,entities,subtopic:raw.filter(t=>!topics.includes(t)).slice(0,8),terms:[...new Set(expanded.map(norm))]};
}
function evidenceText(e){return norm([text(e.response_propositions),text(e.question_or_problem),text(e.conditions_or_qualifications),text(e.documented_circumstances),text(e.audience)].join(' '));}
function metadataText(e){return norm([e.title,e.search_text,e.source_class,e.date,e.language,e.topic,e.subtopic].join(' '));}
function overlap(t,terms){return terms.reduce((n,x)=>n+(x&&t.includes(norm(x))?1:0),0);}
function familyKey(e){return e.evidence_family_id||e.aid||e.source_url||e.key;}
function propositionKey(p){return contentWords(p).sort().join(' ');}
function propositionSupportsQuery(p,u){
  const body=norm(p), raw=u.terms.filter(t=>!topicVocab.has(t)), topicTerms=u.topics.flatMap(t=>TOPICS[t]||[]).map(norm);
  const specific=overlap(body,raw), topical=overlap(body,topicTerms);
  if(u.topics.length&&topical===0) return false;
  return specific>0||topical>=2||(!raw.length&&topical>0);
}

export function propositionRelevance(e,u){
  if(!e?.has_content_evidence) return {score:0,support:'unknown_content',reasons:['no content evidence']};
  const body=evidenceText(e); if(!body) return {score:0,support:'unknown_content',reasons:['empty evidence body']};
  const raw=u.terms.filter(t=>!topicVocab.has(t));
  const topicTerms=u.topics.flatMap(t=>TOPICS[t]||[]).map(norm);
  const rawHit=overlap(body,raw), topicHit=overlap(body,topicTerms);
  const supportingProps=arr(e.response_propositions).filter(p=>propositionSupportsQuery(p,u));
  if(u.topics.length&&topicHit===0) return {score:0,support:'lexical_only',reasons:['topic absent from evidence']};
  if(!supportingProps.length&&u.intent==='guidance') return {score:1,support:'contextual_support',reasons:['no proposition entails guidance query']};
  if(raw.length&&rawHit===0&&topicHit<2) return {score:1,support:'contextual_support',reasons:['topic context without question-specific support']};
  let score=topicHit*2+rawHit*3+(e.status==='Verified'?2:0)+Math.min(4,supportingProps.length*2);
  if(u.intent==='circumstances'&&text(e.documented_circumstances)) score+=3;
  if(u.intent==='guidance'&&supportingProps.length) score+=3;
  if(u.intent==='historical'&&e.date) score+=2;
  if(u.intent==='bibliographic'&&(e.source_url||e.provenance)) score+=2;
  return {score,support:score>=6?'direct_support':'contextual_support',reasons:[`topic=${topicHit}`,`specific=${rawHit}`,`supporting_propositions=${supportingProps.length}`],supportingProps};
}

export function retrieveEvidence(index,q,{limit=12,threshold=6}={}){
  const understanding=understandQuestion(q);
  const candidates=index.map(e=>({e,seed:overlap(metadataText(e),understanding.terms)+2*overlap(evidenceText(e),understanding.terms)})).filter(x=>x.seed>0).sort((a,b)=>b.seed-a.seed).slice(0,60);
  const reranked=candidates.map(({e})=>({e,...propositionRelevance(e,understanding)})).filter(x=>x.support==='direct_support'&&x.score>=threshold).sort((a,b)=>b.score-a.score);
  const seen=new Set(), hits=[]; for(const r of reranked){const k=familyKey(r.e);if(seen.has(k))continue;seen.add(k);hits.push({...r.e,_relevance:r.score,_support:r.support,_supporting_propositions:r.supportingProps||[]});if(hits.length>=limit)break;}
  return {understanding,hits};
}

function synthesizeClaims(selected,u,limit){
  const groups=[];
  for(let sourceIndex=0;sourceIndex<selected.length;sourceIndex++){
    const e=selected[sourceIndex];
    const props=(e._supporting_propositions?.length?e._supporting_propositions:arr(e.response_propositions).filter(p=>propositionSupportsQuery(p,u)));
    for(const p of props){
      const key=propositionKey(p); if(!key) continue;
      let g=groups.find(x=>x.key===key);
      if(!g){g={key,text:String(p),source_numbers:[],families:new Set(),statuses:new Set(),contexts:new Set()};groups.push(g);}
      g.source_numbers.push(sourceIndex+1);g.families.add(familyKey(e));g.statuses.add(e.status);g.contexts.add(e.context_status);
    }
  }
  return groups.slice(0,limit).map(g=>({text:g.text,source_numbers:[...new Set(g.source_numbers)],evidence_family_ids:[...g.families],verification_status:[...g.statuses],context_status:[...g.contexts]}));
}

export function buildAnswerModel(index,q,{mode='regular'}={}){
  const {understanding,hits}=retrieveEvidence(index,q);
  const usable=hits.filter(e=>e._supporting_propositions?.length||arr(e.response_propositions).some(p=>propositionSupportsQuery(p,understanding)));
  const families=new Set(usable.map(familyKey));
  if(!usable.length) return {mode,understanding,answerable:false,reason:'insufficient_evidence',claims:[],sources:[],answered_well:[],insufficient_evidence:[q]};
  if(understanding.intent==='pattern'&&families.size<2) return {mode,understanding,answerable:false,reason:'single_evidence_family',claims:[],sources:usable.slice(0,2),answered_well:[],insufficient_evidence:['אין שתי משפחות ראיות עצמאיות לאחר dedup']};
  const cap=mode==='researcher'?8:4, selected=usable.slice(0,cap);
  const claims=synthesizeClaims(selected,understanding,mode==='researcher'?16:6);
  if(!claims.length) return {mode,understanding,answerable:false,reason:'no_entailed_propositions',claims:[],sources:selected,answered_well:[],insufficient_evidence:[q]};
  const base={mode,understanding,answerable:true,reason:null,claims,sources:selected,answered_well:[understanding.topic||understanding.query],insufficient_evidence:[]};
  if(mode==='researcher') base.research={evidence_families:families.size,verified_sources:selected.filter(e=>e.status==='Verified').length,partial_context_sources:selected.filter(e=>e.context_status==='partial').length,periods:[...new Set(selected.map(e=>e.date).filter(Boolean))],audiences:[...new Set(selected.flatMap(e=>arr(e.audience)).filter(Boolean))],source_classes:[...new Set(selected.map(e=>e.source_class).filter(Boolean))],languages:[...new Set(selected.map(e=>e.language).filter(Boolean))],witnesses:selected.map(e=>({family:familyKey(e),provenance:e.witness_provenance||e.source_witness||e.witness_type||null,verification_scope:e.verification_scope||null,primary_secondary_status:e.primary_secondary_status||null,duplicate_or_parallel_relations:e.duplicate_or_parallel_relations||[]}))};
  return base;
}
