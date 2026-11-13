// Functional regression for evidence-balanced, context-safe answer synthesis.
// Synthetic fixtures test engine behavior, not the truth of any Rebbe teaching.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const core=await readFile(new URL('../src/answer-engine.js',import.meta.url),'utf8');
const {buildAnswerModel}=await import('data:text/javascript;charset=utf-8,'+encodeURIComponent(core));
const make=(i,props,extra={})=>({
 id:'fixture-'+i,evidence_family_id:'family-'+i,status:'Verified',
 verification_scope:'synthetic publisher witness',proposition_source_locator:'fixture source '+i,response_proposition_locators:props.map((_,j)=>'fixture source '+i+' proposition '+(j+1)),has_content_evidence:true,
 source_class:['letter','talk','video','audio','response'][i%5],
 date:String(1960+i*5),language:'he',response_propositions:props,...extra
});
const corpus=Array.from({length:5},(_,i)=>make(i,Array.from({length:5},(_,j)=>
 'חינוך ילדים דורש התייחסות פרטנית לתחום '+(i+1)+' ולמקרה '+(j+1)+' במערכת הלימודים')));
const question='מה הרבי אמר על חינוך ילדים?';
const regular=buildAnswerModel(corpus,question);
const researcher=buildAnswerModel(corpus,question,{mode:'researcher'});
assert.equal(regular.answerable,true);
assert.equal(researcher.answerable,true);
assert.equal(regular.claims.length,5);
assert.equal(regular.sources.length,5);
assert.equal(researcher.claims.length,25);
assert.equal(regular.presentation.answer_style,'concise_answer_first');
assert.equal(regular.presentation.claim_limit,5);
assert.equal(researcher.presentation.answer_style,'extended_evidence_analysis');
assert.equal(researcher.presentation.claim_limit,32);
assert.equal(regular.research,undefined,'regular mode must not expose researcher analysis');
assert.equal(researcher.research.evidence_families,5);
assert.equal(new Set(researcher.sources.map(s=>s.source_class)).size,5);
assert.equal(new Set(regular.claims.slice(0,5).map(c=>c.source_numbers[0])).size,5,
 'first synthesis round must cover five different sources');
const sixSourceRegular=buildAnswerModel(Array.from({length:6},(_,i)=>make(i,[
 `חינוך ילדים דורש מענה מתועד למקרה ${i+1}`])),question);
const citedSources=new Set(sixSourceRegular.claims.flatMap(c=>c.source_numbers));
assert.equal(sixSourceRegular.sources.length,5,'uncited sixth source must be removed from a five-claim answer');
assert.equal(citedSources.size,5);
assert.ok(sixSourceRegular.sources.every((_,i)=>citedSources.has(i+1)),
 'every displayed source must support at least one displayed claim');
assert.ok(sixSourceRegular.claims.every(c=>c.source_numbers.every(n=>n>=1&&n<=sixSourceRegular.sources.length)),
 'claim citations must be remapped after uncited sources are removed');
const p='חינוך ילדים מחייב דוגמה אישית';
const same=buildAnswerModel([make(0,[p]),make(1,[p])],question);
assert.equal(same.claims.length,1);
assert.deepEqual(same.claims[0].source_numbers,[1,2]);
const different=buildAnswerModel([make(0,[p]),make(1,[p],{audience:['הורים']})],question);
assert.equal(different.claims.length,2,'distinct documented context must not collapse');
const opposed=buildAnswerModel([make(0,['חינוך ילדים מחייב דוגמה אישית']),make(1,['חינוך ילדים אינו מחייב דוגמה אישית'])],question);
assert.equal(opposed.claims.length,2,'negated claims must not collapse');
const metadataOnly=buildAnswerModel([make(0,[],{title:'חינוך ילדים',search_text:'חינוך ילדים'})],question);
assert.equal(metadataOnly.answerable,false,'metadata must not be treated as source evidence');
assert.equal(researcher.research.cases.length,5);
assert.deepEqual(researcher.research.cases[0].supported_claim_numbers,[1,6,11,16,21]);
assert.equal(researcher.research.distinctions.periods.length,5);
assert.deepEqual(researcher.research.distinctions.source_classes.find(x=>x.value==='letter').source_numbers,[1]);
assert.ok(researcher.research.cases.every(c=>c.verification_scope==='synthetic publisher witness'));
console.log('PASS: 5 concise regular / 25 researcher claims; 5 cases mapped to claims and comparison axes');


assert.ok(regular.claims.every(c=>c.witnesses.every(w=>w.proposition_source_locator)),'regular claim witnesses must retain source locators');
assert.ok(researcher.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)),'researcher claim map must retain proposition-level locators');
assert.equal(researcher.research.witnesses[0].proposition_source_locator,'fixture source 0');
const familyFixture=[make(20,['הדפסת ספרים בשנגחאי מתוארת כהנגשת תורה לקהילות רחוקות'],{evidence_family_id:'shanghai-family',proposition_source_locator:'Shanghai letter 1, section א'}),make(21,['הדפסת ספרים בשנגחאי מאפשרת לימוד גם לאחר שנים רבות'],{evidence_family_id:'shanghai-family',proposition_source_locator:'Shanghai letter 2, section ב'}),make(22,['הדפסת ספרים בשנגחאי מצריכה רשות מראש ותרגום נאמן'],{evidence_family_id:'shanghai-family',proposition_source_locator:'Shanghai letter 3, section ג'}),make(23,['הדפסת ספרים בשנגחאי מסייעת לחינוך קהילתי'],{evidence_family_id:'shanghai-family',source_class:'derived translation',parent_evidence_family_id:'shanghai-family',primary_secondary_status:'derived translation',proposition_source_locator:'Derived translation, paragraph 1'})];
const familyQuestion='מה נכתב על הדפסת ספרים בשנגחאי?';const familyRegular=buildAnswerModel(familyFixture,familyQuestion,{mode:'regular'});const familyResearcher=buildAnswerModel(familyFixture,familyQuestion,{mode:'researcher'});
assert.equal(familyRegular.sources.length,1,'regular mode must keep one item per family');assert.equal(familyResearcher.sources.length,4,'researcher mode may inspect distinct family members including a marked derived translation');assert.equal(familyResearcher.research.evidence_families,1,'multiple members and a translation still count as one independent family');assert.equal(familyResearcher.research.evidence_integrity.derived_non_independent,1,'derived translation remains non-independent');assert(familyResearcher.research.evidence_map.every(c=>c.witnesses.every(w=>w.proposition_source_locator)),'every researcher claim must expose its proposition locator');
const familyPattern=buildAnswerModel(familyFixture,'מה הדפוס החוזר באגרות על הדפסת ספרים בשנגחאי?',{mode:'researcher'});assert.equal(familyPattern.answerable,false,'one family with multiple member letters cannot establish a cross-family pattern');assert.equal(familyPattern.reason,'single_evidence_family');
