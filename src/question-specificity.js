/* Conservative question-specific evidence gate.
 * Designed for integration before proposition synthesis. Never uses titles,
 * publisher tags or search metadata as evidence of a specific circumstance.
 * Aliases are retrieval equivalences, not proof of a claim.
 */
const normalize = value => String(value ?? '').toLowerCase()
  .replace(/[?.,!״׳:'"()[\]]/g, ' ').replace(/\s+/g, ' ').trim();
const asArray = value => Array.isArray(value) ? value : value == null ? [] : [value];
const FILLER = new Set(('מה הרבי אמר אומר הדריך הדרכה כתב הציע בנוגע נוגע לגבי על של את עם או וגם '+
 'מליובאוויטש קשיי כיצד מהם מהן מהו האם כאשר מתוך בנושא בעניין '+
 'the a an of to and or on about what how did does is are').split(' '));
const EQUIVALENCES = [
 ['קשב','adhd','attention','attention deficit','הפרעת קשב'],
 ['שינה','sleep'],
 ['התמכרות','addiction']
];
export function extractSpecificFocus(question, topicTerms=[]) {
 const excluded = new Set([...FILLER,...topicTerms.map(normalize)]);
 return [...new Set(normalize(question).split(/\s+/)
  .filter(term=>term.length>1&&!excluded.has(term)))];
}
export function hasDocumentedFocus(source, focusTerms=[]) {
 if (!focusTerms.length) return true;
 // This is witness-local content. Metadata cannot satisfy a specificity test.
 const content = normalize([
   ...asArray(source?.response_propositions),
   ...asArray(source?.question_or_problem),
   ...asArray(source?.documented_circumstances),
   ...asArray(source?.conditions_or_qualifications),
   ...asArray(source?.audience)
 ].join(' '));
 if (!content) return false;
 return focusTerms.some(term => {
   const t=normalize(term);
   const group=EQUIVALENCES.find(xs=>xs.some(x=>normalize(x)===t));
   return (group||[t]).some(alias=>content.includes(normalize(alias)));
 });
}
