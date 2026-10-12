import assert from 'node:assert/strict';
import {propositionRelevance,understandQuestion} from '../src/answer-engine.js';
const source=(body)=>({has_content_evidence:true,status:'Verified',response_propositions:[body],documented_circumstances:body,source_url:'https://example.org/source'});
const q=understandQuestion('חינוך ילדים קשב');
assert.equal(propositionRelevance(source('חינוך ילדים והוראה כללית'),q).support,'insufficient_specific_evidence');
assert.notEqual(propositionRelevance(source('חינוך ילדים קשב והוראה'),q).support,'insufficient_specific_evidence');
assert.equal(propositionRelevance({...source('חינוך ילדים'),title:'קשב'},q).support,'insufficient_specific_evidence');
console.log('Question specificity evidence gate: 3 checks passed');
