import assert from 'node:assert/strict';
import fs from 'node:fs';
import {buildAnswerModel,citationEntailment,normalizeEvidenceIntegrity,contextBoundary,retrieveCatalogMatches} from '../src/answer-engine-validated.js';
const p='חינוך ילדים מחייב הקשבה לפני החלטה';
const s={id:'fixture',title:'חינוך ילדים',evidence_family_id:'family-one',status:'Verified',verification_scope:'published wording inspected',has_content_evidence:true,source_witness:'test witness',response_propositions:[p],language:'he',context_status:'partial'};
assert.equal(citationEntailment({claims:[{text:p,source_numbers:[1]}],sources:[s]})[0].valid,true);
assert.equal(citationEntailment({claims:[{text:'חינוך ילדים לא מחייב הקשבה לפני החלטה',source_numbers:[1]}],sources:[s]})[0].valid,false);
assert.equal(citationEntailment({claims:[{text:'חינוך ילדים מחייב הקשבה אחרי החלטה',source_numbers:[1]}],sources:[s]})[0].valid,false);
const locator={...s,verification_scope:'bibliographic identity/locator only; full wording not inspected',context_status:'bibliographic_locator_verified_only'};
const [normalized]=normalizeEvidenceIntegrity([locator]);
assert.equal(normalized.has_content_evidence,false);
assert.deepEqual(normalized.response_propositions,[]);
assert.equal(buildAnswerModel([locator],'מה הרבי אמר על חינוך ילדים?').answerable,false);
const editorial={...s,proposition_origin:'editorial_summary_derived',proposition_verbatim:false};
const [normalizedEditorial]=normalizeEvidenceIntegrity([editorial]);
assert.equal(normalizedEditorial.status,'Verified','bibliographic verification status remains intact');
assert.equal(normalizedEditorial.has_content_evidence,false,'editorial summary is not answer evidence');
assert.deepEqual(normalizedEditorial.response_propositions,[]);
assert.equal(normalizedEditorial._content_evidence_status,'editorial_summary_only');
assert.ok(normalizedEditorial._evidence_integrity_issues.includes('editorial_summary_answer_evidence_blocked'));
const editorialModel=buildAnswerModel([editorial],'מה הרבי אמר על חינוך ילדים?');
assert.equal(editorialModel.answerable,false);
assert.equal(editorialModel.catalog_matches.length,1,'blocked summary remains available as a catalog lead');
assert.equal(editorialModel.catalog_matches[0].answer_evidence,false);
assert.equal('response_propositions' in editorialModel.catalog_matches[0],false,'catalog lead must not expose proposition text');
assert.equal('summary' in editorialModel.catalog_matches[0],false,'catalog lead must not expose editorial summary text');
assert.equal(retrieveCatalogMatches([{...editorial,title:'בריאות'}],'חינוך ילדים').length,1,
 'editorial discovery text may rank a lead without becoming answer evidence');
assert.equal(retrieveCatalogMatches([{...editorial,title:'בריאות',summary:'רפואה בלבד',response_propositions:[]}],'חינוך ילדים').length,0,
 'unrelated catalog records must not be shown');
const groundedParaphrase={...s,proposition_origin:'source_grounded_paraphrase',proposition_verbatim:false,
 proposition_verification:'source_text_inspected',proposition_source_locator:'published letter, paragraph 4'};
const [normalizedParaphrase]=normalizeEvidenceIntegrity([groundedParaphrase]);
assert.equal(normalizedParaphrase.has_content_evidence,true,'located source-grounded paraphrase remains answer evidence');
assert.equal(buildAnswerModel([groundedParaphrase],'מה הרבי אמר על חינוך ילדים?').answerable,true);
const unverifiedParaphrase={...groundedParaphrase,proposition_source_locator:null};
const [normalizedUnverified]=normalizeEvidenceIntegrity([unverifiedParaphrase]);
assert.equal(normalizedUnverified.has_content_evidence,false,'unlocated paraphrase is blocked');
assert.ok(normalizedUnverified._evidence_integrity_issues.includes('editorial_summary_answer_evidence_blocked'));
const derived=normalizeEvidenceIntegrity([{...s,source_class:'derived translation',parent_evidence_family_id:'original-family'}])[0];
assert.equal(derived._independent_witness,false);
assert.equal(derived.evidence_family_id,'original-family');
const model={claims:[{text:p,source_numbers:[1],audiences:['הורים']}],sources:[s]};
assert.equal(contextBoundary(model,citationEntailment(model))[0].valid,false);
const liveIndex=JSON.parse(fs.readFileSync(new URL('../data/public-search-index.json',import.meta.url),'utf8')).entries;
const educationModel=buildAnswerModel(liveIndex,'What did the Rebbe say about education?');
assert.equal(educationModel.answerable,true,'grounded education evidence should remain answerable');
assert.ok(new Set(educationModel.sources.map(x=>x.evidence_family_id)).size>=2,
 'education retrieval must include at least two independent evidence families');
assert.ok(educationModel.sources.some(x=>x.id==='chabad-letter-1273740'),
 'inspected parental-priority excerpt must be retrieved for education');
const anxietyModel=buildAnswerModel(liveIndex,'What did the Rebbe say about anxiety?');
assert.equal(anxietyModel.answerable,true,'inspected anxiety proposition should be answerable');
assert.ok(anxietyModel.sources.some(x=>x.id==='chabad-letter-1956800'));
assert.equal(anxietyModel.claims.length,1,'anxiety answer must exclude the education proposition from the same letter');
assert.match(anxietyModel.claims[0].text,/anxiety and worry/);
const educationPattern=buildAnswerModel(liveIndex,'What pattern did the Rebbe teach about education?',{mode:'researcher'});
assert.equal(educationPattern.understanding.intent,'pattern');
assert.deepEqual(educationPattern.understanding.subtopic,[],
 'pattern framing must not become a source-content qualifier');
assert.equal(educationPattern.answerable,true,
 'a pattern question is answerable when independently grounded families exist');
assert.ok(educationPattern.research.evidence_families>=2);
assert.ok(educationPattern.claims.length>=2);
const hebrewEducationPattern=buildAnswerModel(liveIndex,'איזה דפוס חוזר בהדרכות הרבי על חינוך?',{mode:'researcher'});
assert.equal(hebrewEducationPattern.answerable,true,'Hebrew pattern framing must be handled equivalently');
assert.deepEqual(hebrewEducationPattern.understanding.subtopic,[]);
const anxietyPattern=buildAnswerModel(liveIndex,'What pattern did the Rebbe teach about anxiety?',{mode:'researcher'});
assert.equal(anxietyPattern.answerable,false,'one family must never be presented as a recurring pattern');
assert.equal(anxietyPattern.reason,'single_evidence_family');
const historicalModel=buildAnswerModel(liveIndex,'When did the Rebbe teach about education?',{mode:'researcher'});
assert.equal(historicalModel.answerable,true,'date intent must not require the word when in source text');
assert.deepEqual(historicalModel.understanding.subtopic,[]);
assert.ok(historicalModel.answered_well.includes('תאריך/תקופה'));
assert.ok(historicalModel.sources.every(x=>Boolean(x.date)),
 'historical answers must exclude witnesses with circumstances but no date');
assert.equal(historicalModel.sources.some(x=>x.id==='chabad-letter-1273740'),false,
 'the undated parental-priority excerpt must not answer a when question');
const undatedHistorical=buildAnswerModel([{...groundedParaphrase,
 documented_circumstances:['A parent described a current education decision.']}],
 'When did the Rebbe teach about education?',{mode:'researcher'});
assert.equal(undatedHistorical.answerable,false,
 'non-temporal circumstances cannot substitute for date/period evidence');
const bibliographicModel=buildAnswerModel(liveIndex,'What is the source about education?',{mode:'researcher'});
assert.equal(bibliographicModel.answerable,true,'source intent must use provenance rather than require source in proposition text');
assert.ok(bibliographicModel.answered_well.includes('provenance ביבליוגרפי'));
const circumstancesModel=buildAnswerModel(liveIndex,'Under what circumstances did the Rebbe advise about anxiety?',{mode:'researcher'});
assert.equal(circumstancesModel.answerable,true,'circumstance intent must retrieve documented context');
assert.ok(circumstancesModel.answered_well.includes('נסיבות/תנאים/קהל'));
const comparativeModel=buildAnswerModel(liveIndex,'Compare the Rebbe guidance on education and anxiety',{mode:'researcher'});
assert.equal(comparativeModel.answerable,true,'comparison framing must not suppress independently supported sides');
assert.deepEqual(comparativeModel.comparative_coverage.missing_topics,[]);
assert.equal(comparativeModel.comparative_coverage.supported_topics.length,2);
const hebrewComparative=buildAnswerModel(liveIndex,'השווה בין חינוך וחרדה',{mode:'researcher'});
assert.equal(hebrewComparative.answerable,true,'Hebrew comparison framing must be handled equivalently');
console.log('PASS: exact citations, evidence scope, inspected paraphrases, intent-aware retrieval, safe catalog leads, derived family and context boundary');
