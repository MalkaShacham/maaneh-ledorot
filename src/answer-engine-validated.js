/* Validation layer for the evidence-grounded answer engine.
   Comparative claims require proposition-level evidence for every detected side.
   Absence of evidence on one side is never converted into evidence of difference. */
import {buildAnswerModel as buildCoreAnswerModel} from './answer-engine.js';

const TOPIC_ALIASES={
  'חינוך':['חינוך','ילד','ילדים','תלמיד','מורה','education','child','children','school','teacher','chinuch'],
  'דאגה':['דאג','חרד','חרדה','פחד','בטחון','anxiety','worry','fear','bitachon'],
  'בריאות':['בריאות','רפואה','רופא','health','medical','doctor','refuah'],
  'מזוזה':['מזוז','mezuzah','mezuza'],
  'נשים':['נשים','אשה','אם','woman','women','mother'],
  'פרנסה':['פרנסה','עסק','livelihood','business','parnassa'],
  'שליחות':['שליח','שליחות','shliach','shlichus','mission'],
  'נישואין':['שלום בית','נישוא','חתונ','בעל','אשה','marriage','wedding','husband','wife','sholom bayis'],
  'אמונה':['אמונה','בטחון','faith','belief','trust','emunah','bitachon']
};
const norm=s=>String(s||'').toLowerCase().replace(/[?.,!״׳:'"()\[\]]/g,' ').replace(/\s+/g,' ').trim();
const arr=v=>Array.isArray(v)?v:(v==null||v===''?[]:[v]);
const propositionText=e=>norm(arr(e?._supporting_propositions).concat(arr(e?.response_propositions)).join(' '));
const topicSupported=(sources,topic)=>{
  const aliases=TOPIC_ALIASES[topic]||[topic];
  return sources.some(e=>{const body=propositionText(e);return aliases.some(a=>body.includes(norm(a)));});
};

export function comparativeCoverage(model){
  if(model?.understanding?.intent!=='comparative')return null;
  const requested=[...new Set(model.understanding.topics||[])];
  /* We can enforce bilateral coverage only when the question parser has identified
     at least two requested semantic sides. Unknown sides remain an explicit parser gap,
     never a licence to infer a comparison. */
  if(requested.length<2)return {enforceable:false,requested_topics:requested,supported_topics:[],missing_topics:[],reason:'comparison_sides_not_fully_parsed'};
  const sources=model.sources||[];
  const supported=requested.filter(t=>topicSupported(sources,t));
  const missing=requested.filter(t=>!supported.includes(t));
  return {enforceable:true,requested_topics:requested,supported_topics:supported,missing_topics:missing};
}

export function buildAnswerModel(index,q,options={}){
  const model=buildCoreAnswerModel(index,q,options);
  const coverage=comparativeCoverage(model);
  if(!coverage)return model;
  model.comparative_coverage=coverage;
  if(!coverage.enforceable){
    /* Conservative failure: the engine may describe retrieved evidence, but must not
       assert a difference until both requested sides are structurally identified. */
    return {...model,answerable:false,reason:'comparative_sides_unresolved',claims:[],answered_well:[],insufficient_evidence:[...(model.insufficient_evidence||[]),'לא ניתן לזהות בביטחון את שני צדי ההשוואה; אין להסיק הבדל.']};
  }
  if(coverage.missing_topics.length){
    return {...model,answerable:false,reason:'comparative_missing_side',claims:[],answered_well:coverage.supported_topics.map(t=>`נמצאו ראיות לצד: ${t}`),insufficient_evidence:[...(model.insufficient_evidence||[]),...coverage.missing_topics.map(t=>`אין די ראיות ברמת proposition לצד: ${t}`)]};
  }
  if(options.mode==='researcher'){
    model.research=model.research||{};
    model.research.comparative_coverage=coverage;
  }
  return model;
}
