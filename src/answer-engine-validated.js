/* Validation layer for the evidence-grounded answer engine.
   Comparative claims require proposition-level evidence for every detected side.
   Evidence-integrity normalization prevents unscoped Verified labels and derived
   translations from being counted as independent witnesses/families.
   Citation validation is claim-local: a citation may support only a proposition
   actually present in that witness, and contextual fields may not leak across witnesses. */
import {buildAnswerModel as buildCoreAnswerModel} from './answer-engine.js';

const TOPIC_ALIASES={
  'חינוך':['חינוך','ילד','ילדים','תלמיד','מורה','education','child','children','school','teacher','chinuch'],
  'דאגה':['דאג','חרד','חרדה','פחד','בטחון','anxiety','worry','fear','bitachon'],
  'בריאות':['בריאות','רפואה','רופא','health','medical','doctor','refuah'],
  'מזוזה':['מזוז','mezuzah','mezuza'], 'נשים':['נשים','אשה','אם','woman','women','mother'],
  'פרנסה':['פרנסה','עסק','livelihood','business','parnassa'], 'שליחות':['שליח','שליחות','shliach','shlichus','mission'],
  'נישואין':['שלום בית','נישוא','חתונ','בעל','אשה','marriage','wedding','husband','wife','sholom bayis'],
  'אמונה':['אמונה','בטחון','faith','belief','trust','emunah','bitachon']
};
const norm=s=>String(s||'').toLowerCase().replace(/[?.,!״׳:'"()\[\]]/g,' ').replace(/\s+/g,' ').trim();
const arr=v=>Array.isArray(v)?v:(v==null||v===''?[]:[v]);
const propositionText=e=>norm(arr(e?._supporting_propositions).concat(arr(e?.response_propositions)).join(' '));
const topicSupported=(sources,topic)=>{const aliases=TOPIC_ALIASES[topic]||[topic];return sources.some(e=>{const body=propositionText(e);return aliases.some(a=>body.includes(norm(a)));});};
const isDerived=e=>/translation|תרגום|derived/.test(norm([e?.primary_secondary_status,e?.source_class,e?.witness_type].join(' ')));
const tokens=s=>new Set(norm(s).split(/\s+/).filter(x=>x.length>1));
const overlapRatio=(a,b)=>{const A=tokens(a),B=tokens(b);if(!A.size||!B.size)return 0;let n=0;A.forEach(x=>{if(B.has(x))n++;});return n/Math.min(A.size,B.size);};

export function normalizeEvidenceIntegrity(index=[]){
  return index.map(source=>{const e={...source},issues=[];if(e.status==='Verified'&&!e.verification_scope){e.status='Linked';e._reported_status='Verified';issues.push('verified_without_scope_demoted');}if(isDerived(e)){const parent=e.parent_evidence_family_id||e.derived_from_evidence_family_id||e.translation_of_evidence_family_id||null;if(parent)e.evidence_family_id=parent;else issues.push('derived_witness_parent_family_unknown');e._independent_witness=false;}else e._independent_witness=true;if(issues.length)e._evidence_integrity_issues=issues;return e;});
}

/* Returns only source numbers whose own proposition text entails the synthesized claim.
   This deliberately ignores title/search metadata and context fields. */
export function citationEntailment(model){
  const sources=model?.sources||[];
  return (model?.claims||[]).map((claim,claimIndex)=>{
    const asserted=arr(claim.source_numbers);
    const entailed=asserted.filter(n=>{const e=sources[n-1];if(!e)return false;const props=arr(e._supporting_propositions).concat(arr(e.response_propositions));return props.some(p=>overlapRatio(claim.text,p)>=0.72);});
    return {claim_number:claimIndex+1,asserted_source_numbers:asserted,entailed_source_numbers:entailed,unsupported_source_numbers:asserted.filter(n=>!entailed.includes(n)),valid:entailed.length>0&&entailed.length===asserted.length};
  });
}

/* Context is witness-local. A date/audience/condition/circumstance may be shown beside a
   claim only if at least one entailing witness itself carries that field. */
export function contextBoundary(model,entailment){
  const sources=model?.sources||[];
  return (model?.claims||[]).map((claim,i)=>{const supporting=new Set(entailment[i]?.entailed_source_numbers||[]);const local=[...supporting].map(n=>sources[n-1]).filter(Boolean);const has=(field)=>local.some(e=>arr(e[field]).filter(Boolean).length>0);const leaks=[];if(arr(claim.documented_circumstances).length&&!has('documented_circumstances'))leaks.push('documented_circumstances');if(arr(claim.conditions_or_qualifications).length&&!has('conditions_or_qualifications'))leaks.push('conditions_or_qualifications');if(arr(claim.audiences).length&&!local.some(e=>arr(e.audience).filter(Boolean).length))leaks.push('audience');return {claim_number:i+1,valid:leaks.length===0,possible_context_leakage:leaks};});
}

export function comparativeCoverage(model){if(model?.understanding?.intent!=='comparative')return null;const requested=[...new Set(model.understanding.topics||[])];if(requested.length<2)return {enforceable:false,requested_topics:requested,supported_topics:[],missing_topics:[],reason:'comparison_sides_not_fully_parsed'};const sources=model.sources||[],supported=requested.filter(t=>topicSupported(sources,t)),missing=requested.filter(t=>!supported.includes(t));return {enforceable:true,requested_topics:requested,supported_topics:supported,missing_topics:missing};}

export function buildAnswerModel(index,q,options={}){
  const normalized=normalizeEvidenceIntegrity(index);let model=buildCoreAnswerModel(normalized,q,options);
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
