/* Conservative, witness-local question specificity filter.
 * An alias is a retrieval equivalence, NEVER a quotation or an inferred teaching.
 * Only recognized focus concepts are enforced: unknown query words must not
 * silently become a brittle, universal lexical gate.
 */
const normalize = value => String(value ?? '').toLowerCase()
  .replace(/[?.,!״׳:'"()[\]]/g, ' ').replace(/\s+/g, ' ').trim();
const asArray = value => Array.isArray(value) ? value : value == null ? [] : [value];
const FOCUS_GROUPS = [
  ['קשב','adhd','attention deficit','הפרעת קשב','קשיי קשב'],
  ['שינה','sleep','sleeping','נדודי שינה'],
  ['התמכרות','addiction','addicted','מכור']
];
const contains = (body, phrase) => {
  const escaped = normalize(phrase).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  // Latin tokens need word boundaries; Hebrew morphological prefixes are allowed.
  return /[a-z]/i.test(phrase)
    ? new RegExp('(?:^|[^a-z])'+escaped+'(?:$|[^a-z])','i').test(body)
    : body.includes(normalize(phrase));
};
export function extractSpecificFocus(question, topicTerms=[]) {
  const q=normalize(question);
  const excluded=new Set(topicTerms.map(normalize));
  return FOCUS_GROUPS.filter(group =>
    !group.every(term=>excluded.has(normalize(term))) &&
    group.some(alias=>contains(q,alias))
  ).map(group=>group[0]);
}
export function hasDocumentedFocus(source, focusTerms=[]) {
  if (!focusTerms.length) return true;
  // Titles, tags, keywords, editorial search text and dates are NOT evidence.
  const content=normalize([
    ...asArray(source?.response_propositions),
    ...asArray(source?.question_or_problem),
    ...asArray(source?.documented_circumstances),
    ...asArray(source?.conditions_or_qualifications),
    ...asArray(source?.audience)
  ].join(' '));
  if (!content) return false;
  // All independent specific constraints must be documented on this witness.
  return focusTerms.every(term=>{
    const group=FOCUS_GROUPS.find(g=>g.includes(normalize(term)));
    return (group||[term]).some(alias=>contains(content,alias));
  });
}
