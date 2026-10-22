import assert from 'node:assert/strict';
import {buildAnswerModel,propositionRelevance,understandQuestion} from '../src/answer-engine.js';
const source=(body)=>({has_content_evidence:true,status:'Verified',response_propositions:[body],documented_circumstances:body,source_url:'https://example.org/source'});
const q=understandQuestion('חינוך ילדים קשב');
assert.equal(propositionRelevance(source('חינוך ילדים והוראה כללית'),q).support,'insufficient_specific_evidence');
assert.notEqual(propositionRelevance(source('חינוך ילדים קשב והוראה'),q).support,'insufficient_specific_evidence');
assert.equal(propositionRelevance({...source('חינוך ילדים'),title:'קשב'},q).support,'insufficient_specific_evidence');
const englishQuestion='What did the Rebbe say about education?';
assert.deepEqual(understandQuestion(englishQuestion).subtopic,[],
 'speaker and reporting words must not become evidence requirements');
assert.equal(buildAnswerModel([source('education for children and teachers')],englishQuestion).answerable,true,
 'English question framing must not block cross-language topic retrieval');
assert.equal(buildAnswerModel([source('education for children and teachers')],
 'What did the Rebbe say about education and ADHD?').answerable,false,
 'a real question-specific qualifier must still require content evidence');
const naturalHebrewQuestion='מהו הלימוד המוסרי מפרה אדומה באיגרת?';
assert.deepEqual(understandQuestion(naturalHebrewQuestion).subtopic,
 ['פרה','אדומה'],
 'Hebrew articles and prepositions must not turn ordinary question phrasing into unsupported qualifiers');
assert.equal(buildAnswerModel([source('האיגרת מציגה לימוד מוסרי על פרה אדומה')],naturalHebrewQuestion).answerable,true,
 'a natural Hebrew question with prefixes must retrieve a proposition that directly supports its terms');
const naturalGuidanceQuestion='מה הרבי הדריך בנוגע לחינוך ילדים?';
assert.deepEqual(understandQuestion(naturalGuidanceQuestion).subtopic,[],
 'common Hebrew guidance verbs and connective phrasing must not become evidence requirements');
assert.equal(buildAnswerModel([source('חינוך ילדים דורש תשומת לב חינוכית כבר בגיל הרך')],naturalGuidanceQuestion).answerable,true,
 'a natural Hebrew guidance question must retrieve direct education evidence');
console.log('Question specificity evidence gate: 10 checks passed');
