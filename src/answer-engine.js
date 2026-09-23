/* Maaneh Ledorot evidence-grounded answer engine core. Precision > recall. */
const STOP=new Set('מה הרבי אמר אומר על של את עם או וגם לגבי האם לי יש היה היא הוא זה זו אני אנחנו מתוך בנושא בעניין רוצה לדעת כיצד אילו איזה the a an of to and or on about what how did does is are'.split(' '));
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

export function understandQuestion(q){
 const original=String(q||''),query=norm(original),raw=query.split(/\s+/).filter(x=>x.length>1&&!STOP.has(x));
 const topics=Object.entries(TOPICS).filter(([,vs])=>vs.some(v=>query.includes(norm(v)))).map(([k])=>k);
 const intent=/דפוס|חוזר|בדרך כלל|גישה|pattern|usually/.test(query)?'pattern':/הבדל|לעומת|השוו|השווא|compare|difference/.test(query)?'comparative':/מתי|תאריך|תקופה|שנה|when|date|period/.test(query)?'historical':/מקור|ביבליוגר|איפה פורסם|source|bibliograph/.test(query)?'bibliographic':/באילו נסיבות|נסיבות|מתי המליץ|תנאי|למי|circumstance|condition|audience/.test(query)?'circumstances':'guidance';
 const entities=(original.match(/(?:[A-Z][\w-]+(?:\s+[A-Z][\w-]+)*)|(?:[א-ת]{2,}(?:\s+[א-ת]{2,}){1,2})/g)||[]).map(norm).filter(x=>!STOP.has(x)).slice(0,8);
 const expanded=[...raw];topics.forEach(k=>expanded.push(...TOPICS[k]));
 return {query,query_script:scriptOf(query),topic:topics[0]||null,topics,intent,entities,subtopic:raw.filter(t=>!topics.includes(t)).slice(0,8),terms:[...new Set(expanded.map(norm))]};
}
function evidenceText(e){return norm([text(e.response_propositions),text(e.question_or_problem),text(e.conditions_or_qualifications),text(e.documented_circumstances),text(e.audience)].join(' '));}
function metadataText(e){return norm([e.title,e.search_text,e.source_class,e.date,e.language,e.topic,e.subtopic].join(' '));}
function overlap(t,terms){return terms.reduce((n,x)=>n+(x&&t.includes(norm(x))?1:0),0);}
function familyKey(e){return e.evidence_family_id||e.aid||e.source_url||e.key;}
function propositionKey(p){return contentWords(p).sort().join(' ');}
function propositionSupportsQuery(p,u){const body=norm(p),raw=u.terms.filter(t=>!topicVocab.has(t)),topicTerms=u.topics.flatMap(t=>TOPICS[t]||[]).map(norm);const specific=overlap(body,raw),topical=overlap(body,topicTerms);if(u.topics.length&&topical===0)return false;return specific>0||topical>=2||(!raw.length&&topical>0);}
function intentEvidenceGate(e,u){
 if(u.intent==='circumstances'&&!text(e.documented_circumstances)&&!text(e.conditions_or_qualifications)&&!text(e.audience))return 'missing documented circumstances/conditions/audience';
 if(u.intent==='historical'&&!e.date&&!text(e.documented_circumstances))return 'missing documented date/period context';
 if(u.intent==='bibliographic'&&!e.source_url&&!e.provenance&&!e.witness_provenance&&!e.source_witness)return 'missing bibliographic provenance';
 return null;
}

export function propositionRelevance(e,u){
 if(!e?.has_content_evidence)return{score:0,support:'unknown_content',reasons:['no content evidence']};
 const body=evidenceText(e);if(!body)return{score:0,support:'unknown_content',reasons:['empty evidence body']};
 const gate=intentEvidenceGate(e,u);if(gate)return{score:0,support:'insufficient_intent_evidence',reasons:[gate]};
 const raw=u.terms.filter(t=>!topicVocab.has(t)),topicTerms=u.topics.flatMap(t=>TOPICS[t]||[]).map(norm),rawHit=overlap(body,raw),topicHit=overlap(body,topicTerms);
 const supportingProps=arr(e.response_propositions).filter(p=>propositionSupportsQuery(p,u));
 if(u.topics.length&&topicHit===0)return{score:0,support:'lexical_only',reasons:['topic absent from evidence']};
 if(!supportingProps.length&&u.intent==='guidance')return{score:1,support:'contextual_support',reasons:['no proposition entails guidance query']};
 if(raw.length&&rawHit===0&&topicHit<2)return{score:1,support:'contextual_support',reasons:['topic context without question-specific support']};
 let score=topicHit*2+rawHit*3+(e.status==='Verified'?2:0)+Math.min(4,supportingProps.length*2);
 if(u.intent==='circumstances')score+=3;if(u.intent==='guidance'&&supportingProps.length)score+=3;if(u.intent==='historical'&&e.date)score+=2;if(u.intent==='bibliographic'&&(e.source_url||e.provenance||e.witness_provenance))score+=2;
 return{score,support:score>=6?'direct_support':'contextual_support',reasons:[`topic=${topicHit}`,`specific=${rawHit}`,`supporting_propositions=${supportingProps.length}`],supportingProps};
}
export function retrieveEvidence(index,q,{limit=12,threshold=6}={}){const understanding=understandQuestion(q);const candidates=index.map(e=>({e,seed:overlap(metadataText(e),understanding.terms)+2*overlap(evidenceText(e),understanding.terms)})).filter(x=>x.seed>0).sort((a,b)=>b.seed-a.seed).slice(0,60);const reranked=candidates.map(({e})=>({e,...propositionRelevance(e,understanding)})).filter(x=>x.support==='direct_support'&&x.score>=threshold).sort((a,b)=>b.score-a.score);const seen=new Set(),hits=[];for(const r of reranked){const k=familyKey(r.e);if(seen.has(k))continue;seen.add(k);hits.push({...r.e,_relevance:r.score,_support:r.support,_supporting_propositions:r.supportingProps||[]});if(hits.length>=limit)break;}return{understanding,hits};}
function synthesizeClaims(selected,u,limit){const groups=[];for(let sourceIndex=0;sourceIndex<selected.length;sourceIndex++){const e=selected[sourceIndex],props=(e._supporting_propositions?.length?e._supporting_propositions:arr(e.response_propositions).filter(p=>propositionSupportsQuery(p,u)));for(const p of props){const key=propositionKey(p);if(!key)continue;let g=groups.find(x=>x.key===key);if(!g){g={key,text:String(p),source_numbers:[],families:new Set(),statuses:new Set(),contexts:new Set()};groups.push(g);}g.source_numbers.push(sourceIndex+1);g.families.add(familyKey(e));g.statuses.add(e.status);g.contexts.add(e.context_status);}}return groups.slice(0,limit).map(g=>({text:g.text,source_numbers:[...new Set(g.source_numbers)],evidence_family_ids:[...g.families],verification_status:[...g.statuses],context_status:[...g.contexts]}));}
function classifyWitness(e){const s=norm([e.primary_secondary_status,e.source_class,e.witness_type].join(' '));return /primary|ראשוני|direct/.test(s)?'primary':/translation|תרגום|derived/.test(s)?'derived':/secondary|מאוחר|עיבוד/.test(s)?'secondary':'unspecified';}
function coverageFor(selected,u){const covered=[],missing=[];if(selected.length)covered.push('תוכן המענה');if(u.intent==='circumstances')(selected.some(e=>text(e.documented_circumstances)||text(e.conditions_or_qualifications)||text(e.audience))?covered:missing).push('נסיבות/תנאים/קהל');if(u.intent==='historical')(selected.some(e=>e.date||text(e.documented_circumstances))?covered:missing).push('תאריך/תקופה');if(u.intent==='bibliographic')(selected.some(e=>e.source_url||e.provenance||e.witness_provenance)?covered:missing).push('provenance ביבליוגרפי');if(u.intent==='pattern')(new Set(selected.map(familyKey)).size>=2?covered:missing).push('דפוס בין משפחות ראיות עצמאיות');return{covered,missing};}
export function buildAnswerModel(index,q,{mode='regular'}={}){
 const{understanding,hits}=retrieveEvidence(index,q),usable=hits.filter(e=>e._supporting_propositions?.length||arr(e.response_propositions).some(p=>propositionSupportsQuery(p,understanding))),families=new Set(usable.map(familyKey));
 if(!usable.length)return{mode,understanding,answerable:false,reason:'insufficient_evidence',claims:[],sources:[],answered_well:[],insufficient_evidence:[q]};
 if(understanding.intent==='pattern'&&families.size<2)return{mode,understanding,answerable:false,reason:'single_evidence_family',claims:[],sources:usable.slice(0,2),answered_well:[],insufficient_evidence:['אין שתי משפחות ראיות עצמאיות לאחר dedup']};
 const cap=mode==='researcher'?8:4,selected=usable.slice(0,cap),claims=synthesizeClaims(selected,understanding,mode==='researcher'?16:6),coverage=coverageFor(selected,understanding);
 if(!claims.length)return{mode,understanding,answerable:false,reason:'no_entailed_propositions',claims:[],sources:selected,answered_well:coverage.covered,insufficient_evidence:[...coverage.missing,q]};
 const base={mode,understanding,answerable:true,reason:null,claims,sources:selected,answered_well:coverage.covered,insufficient_evidence:coverage.missing};
 if(mode==='researcher'){const witnessClasses=selected.reduce((a,e)=>(a[classifyWitness(e)]=(a[classifyWitness(e)]||0)+1,a),{});base.research={evidence_families:families.size,verified_sources:selected.filter(e=>e.status==='Verified').length,partial_context_sources:selected.filter(e=>e.context_status==='partial').length,periods:[...new Set(selected.map(e=>e.date).filter(Boolean))],audiences:[...new Set(selected.flatMap(e=>arr(e.audience)).filter(Boolean))],source_classes:[...new Set(selected.map(e=>e.source_class).filter(Boolean))],languages:[...new Set(selected.map(e=>e.language).filter(Boolean))],witness_classes:witnessClasses,pipeline_statuses:[...new Set(selected.map(e=>e.status).filter(Boolean))],coverage,witnesses:selected.map(e=>({family:familyKey(e),provenance:e.witness_provenance||e.source_witness||e.witness_type||null,verification_scope:e.verification_scope||null,context_status:e.context_status||'unknown',language:e.language||null,witness_class:classifyWitness(e),primary_secondary_status:e.primary_secondary_status||null,duplicate_or_parallel_relations:e.duplicate_or_parallel_relations||[]}))};}
 return base;
}