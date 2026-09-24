/* Validation layer for the evidence-grounded answer engine.
   Comparative claims require proposition-level evidence for every detected side.
   Evidence-integrity normalization prevents unscoped Verified labels and derived
   translations from being counted as independent witnesses/families. */
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
const isDerived=e=>/translation|תרגום|derived/.test(norm([e?.primary_secondary_status,e?.source_class,e?.witness_type].join(' ')));

/* Canonical evidence invariants are enforced at query time as a last safety barrier.
   The source record is not mutated: a normalized copy is passed to the core engine.
   - "Verified" without an explicit verification_scope is demoted to Linked.
   - a derived/translation witness inherits its parent Evidence Family when that
     relation is known, so it cannot manufacture source diversity.
   - an orphan derived witness remains usable as derived evidence but is explicitly
     marked non-independent for researcher inspection. */
export function normalizeEvidenceIntegrity(index=[]){
  return index.map(source=>{
    const e={...source};
    const issues=[];
    if(e.status==='Verified'&&!e.verification_scope){
      e.status='Linked';
      e._reported_status='Verified';
      issues.push('verified_without_scope_demoted');
    }
    if(isDerived(e)){
      const parent=e.parent_evidence_family_id||e.derived_from_evidence_family_id||e.translation_of_evidence_family_id||null;
      if(parent)e.evidence_family_id=parent;
      else issues.push('derived_witness_parent_family_unknown');
      e._independent_witness=false;
    }else e._independent_witness=true;
    if(issues.length)e._evidence_integrity_issues=issues;
    return e;
  });
}

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
  const normalized=normalizeEvidenceIntegrity(index);
  const model=buildCoreAnswerModel(normalized,q,options);
  const integrityIssues=(model.sources||[]).flatMap((e,i)=>arr(e._evidence_integrity_issues).map(issue=>({source_number:i+1,issue,reported_status:e._reported_status||null})));
  if(options.mode==='researcher'){
    model.research=model.research||{};
    model.research.evidence_integrity={issues:integrityIssues,independent_witnesses:(model.sources||[]).filter(e=>e._independent_witness!==false).length,derived_non_independent:(model.sources||[]).filter(e=>e._independent_witness===false).length};
  }
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
