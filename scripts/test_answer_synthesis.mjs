// Functional regression for evidence-balanced, context-safe answer synthesis.
// Synthetic fixtures test engine behavior, not the truth of any Rebbe teaching.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const core=await readFile(new URL('../src/answer-engine.js',import.meta.url),'utf8');
const {buildAnswerModel}=await import('data:text/javascript;charset=utf-8,'+encodeURIComponent(core));
const make=(i,props,extra={})=>({
 id:'fixture-'+i,evidence_family_id:'family-'+i,status:'Verified',
 verification_scope:'synthetic publisher witness',has_content_evidence:true,
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
assert.equal(regular.claims.length,12);
assert.equal(researcher.claims.length,25);
assert.equal(researcher.research.evidence_families,5);
assert.equal(new Set(researcher.sources.map(s=>s.source_class)).size,5);
assert.equal(new Set(regular.claims.slice(0,5).map(c=>c.source_numbers[0])).size,5,
 'first synthesis round must cover five different sources');
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
console.log('PASS: 12 regular / 25 researcher claims; 5 families; source balance, context, citations and metadata gate');
