# מענה לדורות — המשך פיתוח לאחר אבחון התקיעות

אובחן ותוקן ב־13.10.2026. PROJECT_CANON.md ממשיך להיות מקור האמת.

ביומני 6–12 באוקטובר נשמרו 170 ריצות תחזוקה ללא שינוי חיובי
במספר הרשומות המאומתות, הקנוניות או המאונדקסות. ריצת התחזוקה אינה
מכילה איסוף או בדיקת תוכן. הצלחת GitHub Actions אומרת שהקוד הסתיים,
ולא שהמאגר גדל. גם תור קידום ריק אינו אומר שתוכן הקורפוס הושלם.

## הפעולה הנדרשת בכל ריצת פיתוח

1. בדיקת תוכן בפועל מול עד ישיר או מוסמך, בעדיפות לאצווה של 8–15 פריטים
   או יותר. `data/content-review-queue.json` הוא תור ניווט למקורות מקוונים
   קיימים שעדיין אין להם תוכן כשיר לתשובה; הוא אינו ראיה לתוכן.
2. הרחבת מקורות חדשים נגישים, כולל סריקות המשתמשת, עברית, יידיש,
   אנגלית ומגוון סוגי תיעוד. באצוות מפתחות היקף האימות נשאר ביבליוגרפי.
3. העשרת זהויות קיימות במקום יצירת כפילות. תרגום ותמצית של אותו עד
   מקבלים אותה Evidence Family ואינם נספרים כמקור עצמאי נוסף.
4. רישום `response_propositions` לא-מילוליות, `proposition_origin`,
   `proposition_verbatim:false`, `proposition_verification:source_text_inspected`,
   `proposition_source_locator`, היקף אימות, provenance וגבולות הקשר.
   טיוטה, קטע ממכתב או תרגום מוסמך נשארים מסומנים בהתאם.
5. אם מקור חסום, תיעוד החסם וניסיון מקור אחר באותה ריצה. אין לחזור
   ללא צורך על crawler שכבר ידוע כחסום ב-runner.
6. reconciliation, בדיקות, commit ופרסום. התקדמות נמדדת גם במספר
   `answer_eligible_unique_sources` ובמספר תמציות המקור הבדוקות,
   נוסף לספירות איסוף ואימות. תחזוקה ללא שינוי מדווחת ככזו.

אין להרפות מרף הראיות כדי לעמוד ביעד אצווה. אין להעתיק נוסח מוגן
בהיקף נרחב. אין להציג פירוש או תמצית מחקר כציטוט של הרבי.

## בדיקות

`python scripts/reconcile_metrics.py` ולאחריו בדיקות האיכות הקיימות
ו־`node scripts/test_content_readiness.mjs`. הבדיקה החדשה משווה את מדד
המוכנות לסינון שמשמש בפועל בדפדפן, ובודקת תשובות בעברית בשני מצבים
על הקורפוס האמיתי. מעבר בדיקות מבניות אינו אישור שהתוכן מכסה כל נושא.

אצוות התיקון הראשונה מתועדת ב־`data/content-reviews/2026-10-13-recovery-batch.json`:
14 עדי מקור נבדקו; 10 זהויות נוספו ו־4 זהויות הורחבו במקום. המוכנות
לתשובות עלתה מ־3 ל־17 מקורות. זהו שיפור ראשוני בלבד, והפער מול אלפי
הזהויות הביבליוגרפיות עדיין גדול.
 
## 2026-11-12 — Content batch 056

- Reviewed 11 item bodies: 10 new English translated letters from the Chabad.org/TheRebbe.org Sichos in English Collection, plus an in-place enrichment of existing AID 2283000.
- Added 25 non-verbatim, source-grounded propositions to the ten new letter identities and 3 propositions to AID 2283000. All use `source_grounded_paraphrase`, `proposition_verbatim=false`, `proposition_verification=source_text_inspected`, item-level locators, provenance, partial-context boundaries and explicit translation limitations.
- New letters cover maamad/outreach, educational shlichus in Morocco, Yud-Tes Kislev dissemination, institutional support, yahrzeit practices, mourning customs, Rebbe Rashab manuscript collection, and relief efforts for survivors in Europe. The Rebbe Rashab manuscript letters and the two Morocco mission letters are linked as related but distinct dated responses; translations are not counted as independent witnesses.
- Five attempted Hebrew/Yiddish candidates were not usable: three publisher shells without body text and two Yechidus pages exposing media/metadata but no transcript. They were recorded as blocked; ten accessible English letter bodies were used as alternatives. No runner-side HTTP 403 crawler was retried.
- Reconciliation commit: `10c6d451b3207c25eb184cfcc2800372678a0001` (github-actions[bot]); merge commit: `bb9c6a9841ba21c9e536a5a90067cc81eb297e22`.
- Reconciled metrics: answer-eligible unique sources **609 → 620**; content-verified unique sources **606 → 617**; answer-eligible propositions **1,889 → 1,917**. Canonical unique item keys **9,787 → 9,797**; verified unique item keys **8,467 → 8,478**. Review queue **1,069 → 1,068**; AID 2283000 was removed from the pending queue.
- `.github/workflows/answer-quality-gate.yml` is configured to run `test_content_readiness.mjs` on the changed main paths. The latest saved structural report says `passed=true` with 31 regression cases, but it is not bound to merge commit `bb9c6a9`; the run result for the new batch-specific assertions is therefore **not verified**. Do not describe those tests as passed until a commit-bound run result is available.
- Live GitHub Pages publication could not be independently verified through the available public-page reader in this run. Main contains the updated index loader and reconciled search index/metrics. No schedule, audience or permissions were changed.
- Post-reconciliation editorial correction: Letter 416 (AID 2278439) now names Merkos L’Inyonei Chinuch as the organization, not a person. The correction is in commit `bcf8cb8`; the public search index was refreshed by `github-actions[bot]` in `da53a97`.


## 2026-11-12 — Batch 057: inspected Hebrew correspondence and retrieval repair

- Opened and inspected 12 public, item-level Hebrew correspondence pages published by Kehot on Chabad.org/TheRebbe.org. Added 12 new AID-backed source identities in `data/items/content-research-batch-057-2026-11-12.json`, each with its own Evidence Family, 25 non-verbatim `source_grounded_paraphrase` propositions, `proposition_verification=source_text_inspected`, body-line locators, provenance, scope, circumstances and limitations.
- New AIDs: 5071138, 5071116, 5071054, 5100064, 5100033, 5100203, 5357571, 5054525, 5413358, 5054491, 4812649, 5071118. The page for AID 5413358 has inconsistent volume metadata (breadcrumb XXII; lower metadata Volume 18); its volume field was deliberately left blank.
- One existing identity, `igrot-kodesh-v13-דתמג`, received a researcher/model cross-reference to AID 5100064 because both mention mezuzot in different contexts. This adds no proposition and does not merge Evidence Families. The relationship explicitly warns against treating the two letters as one ruling.
- Deduplication checked stable AIDs/URLs against item-path names, bulk-indexed inventories, recent research/verified batches and relevant volume indexes. No matching AID was found. Each dated letter remains a separate Evidence Family; any later translation, scan or reprint of that letter must join the same family.
- AID 4666220 returned an inaccessible/internal-error page rather than inspectable body text. A Yiddish-audio candidate (AID 3798080) exposed an audio link and Hebrew-transcript link, but the transcript body was not available through the public reader; neither was used for propositions. An English translated letter (AID 2277347) was inspected but not promoted because its original-language identity/family mapping was unresolved; it was not counted as an independent witness. The blocked candidates were replaced in this run by the 12 inspectable Hebrew pages.
- The known HTTP 403 acquisition crawler was not rerun. No full copyrighted text was copied.
- The prior quality-gate run 43272913490 failed at `test_content_readiness.mjs:315`: the specific batch-024 mezuzah-entry question retrieved too many generic mezuzah sources. The core engine now has a narrow entry-timing topic and a proposition-level gate requiring mezuzah + entry + immediate/day-thirty timing; the test suite also adds three cross-Evidence-Family synthesis checks in regular and researcher modes.
- Expected after reconciliation (not asserted until the workflow reports it): `answer_eligible_unique_sources` 620 → 632; `content_verified_unique_sources` 617 → 629; `answer_eligible_propositions` 1917 → 1942.
- The hourly workflow remains on cron `7 * * * *`; audience, permissions and automation schedule were not changed.


### Follow-up quality-gate repair — 2026-11-12

- Reconciliation after batch 057 confirmed `answer_eligible_unique_sources=632`, `content_verified_unique_sources=629`, and `answer_eligible_propositions=1942`.
- The next quality-gate run (43282923148) passed question-specific retrieval, synthesis, citation integrity, evidence-contract and workflow-write-safety checks, then failed at `test_content_readiness.mjs:92` on the yeshiva-enrollment question. The new AID 4812649 letter documents declining enrollment and persistence, but does not state a recruitment plan; it must not substitute for letter ד׳שיט, which explicitly calls for recruiting suitable students and gives a numerical target.
- Retrieval was tightened with source-language aliases from the actual recruitment propositions and a proposition-level gate requiring explicit expansion/recruitment action or target. A regression now excludes AID 4812649 from the specific recruitment-plan answer while retaining it for questions about declining enrollment and perseverance.
- The first batch-024 mezuzah precision fix passed the separate question-specific retrieval step in run 43282923148. The current follow-up commit is intended to clear the remaining yeshiva-enrollment regression and then exercise the new batch-057 multi-source checks.


### Module-parse correction — 2026-11-12

- Quality-gate run 43283882013 passed the question-specific retrieval and answer-synthesis steps, then failed citation-integrity startup because the newly appended `הרחבת ישיבה` alias in `TOPIC_ALIASES` lacked a separating comma. This was a code syntax error, not a content-verification failure.
- Added the missing comma, bumped both browser cache-busters to the v3 engine revision, and retained the source-specific enrollment gate. No source records, proposition counts or verification statuses changed in this correction.


## 2026-11-12 — Batch 060: Hebrew/Yiddish correspondence and comparison retrieval

- Inspected **9 item-level source bodies**: 8 existing AID identities were enriched in place (4666213, 4666214, 4666218, 4666219, 4666234, 4666235, 4666266, 4666272) and one new Hebrew identity was added (4731128, letter רמא*). Added **25 non-verbatim, source-grounded propositions** with `proposition_origin=source_grounded_paraphrase`, `proposition_verbatim=false`, `proposition_verification=source_text_inspected`, locators, provenance, scope, circumstances and limitations.
- The new AID 4731128 page was inspected at body lines 288–312 and publisher-note lines 314–316. The note identifies it as an enclosed letter mentioned in the preceding letter, copied from handwriting for secretarial typing, and undated in that copy. The bracketed date is therefore approximate. It is cross-referenced to AID 4666280 but remains a distinct text identity and Evidence Family.
- AIDs 4666218 and 4666219 each appeared three times in `bulk-indexed-2026-09-24-002.json` from different staging origins. One record per AID was promoted; the three staging copies are one identity and one Evidence Family, not independent witnesses. No translation or reprint was counted as an independent witness.
- Source text covers a Yiddish/Hebrew request and return of a Sukkot-talk copy (4666213); the Chanukah analogy and book dispatch in 4666214; health, publication distribution, Chassidic explanation and tefillin outreach in 4666218; Tehillim and the Kollel Chabad Beirut update in 4666219; Rosh Chodesh tefillin timing in 4666234; the blessing for tefillin shel rosh in 4666235; Kehot operations in Shanghai in 4666266; and further astronomical/chronological and halachic notes in 4666272.
- Blocked/excluded this run: AID 4666220 still exposed an internal-error/shell rather than body text; AID 4666211 and AIDs 4666265/6267/6268/6270 did not yield inspectable bodies through the public reader/search path; AID 4666280 exposed only a shell; Yechidus AIDs 553673 and 553692 exposed media/metadata but no inspectable transcript. Accessible letters from the same volume were used as alternatives. The known 12-reference HTTP 403 acquisition crawler was **not** rerun, and no access control was bypassed.
- Retrieval was extended with explicit topics for “העתק שיחות סוכות” and “מחלקת קה״ת בשנגהי”. The quality suite now checks the two-source comparison in regular and researcher modes, including two distinct Evidence Families, claim-local citations, context boundaries and the researcher evidence map.
- Before reconciliation: `answer_eligible_unique_sources=645`, `content_verified_unique_sources=642`, `answer_eligible_propositions=1974`, `canonical_unique_item_keys=8951`, `verified_unique_item_keys=7632`, `canonical_json_files=421`, review queue 1,068. Expected after reconciliation: **652**, **645**, **1,999**, **8,952**, **7,635**, **422**, and queue 1,062 respectively. These are expected values, not yet confirmed values.
- The branch is prepared for merge to main. Reconciliation, commit-bound Actions results and GitHub Pages publication remain unverified until their post-merge evidence is available. The stored quality report is not a substitute for a commit-bound run. No schedule, audience or permissions were changed.


### Batch 060 reconciliation and duplicate follow-up (2026-11-12)

- PR #9 was squash-merged to main as `a805dd59c0ff4fd36b8196b2ddd7c0e9c023abe1`.
- The reconciliation job committed refreshed `data/public-metrics.json`, `data/public-search-index.json`, `data/content-review-queue.json` and `data/project-state.json` in bot commit `6cc3d7e63c9c5aa5f62c4b927351171755275f44`. First reconciled values: answer-eligible unique sources **652** (645 before), content-verified unique sources **649** (642 before), answer-eligible propositions **1,999** (1,974 before), canonical unique keys **8,953**, verified unique keys **7,635**, canonical JSON files **422**, queue **1,063**.
- The first reconciliation exposed an additional metadata-only duplicate for AID 4666214 in `bulk-indexed-2026-09-24-002.json` and another in `bulk-indexed-2026-09-24-003.json`. Both have now been linked to `chabad-letter-4666214` by the same AID, letter number, publisher URL and `same_evidence_family` relation. Neither is an independent witness. A second reconciliation is pending; expected final canonical unique keys **8,952** and queue **1,062**, with answer-readiness counts unchanged.
- The stored structural report `data/evaluation/latest-quality-gate.json` says `passed=true`, 31 regression cases, no structural failures or warnings, but explicitly states it is a structural gate only and does not establish semantic relevance or claim-level entailment. The report is not bound to the merge commit. The commit-bound Actions run details for `node scripts/test_content_readiness.mjs` are not exposed by the available GitHub connector, so no pass/fail claim is made.
- The repository-side public search index SHA changed during reconciliation. The live GitHub Pages URL could not be independently opened by the available page reader; repository artifact refresh is confirmed, live deployment is not.


### Batch 061 content review and reconciliation (2026-11-13)

- PR #10 was squash-merged to main as `31810e4871cfc6b7797bbecd99c04284dfce9c82`. The reconciliation workflow then committed refreshed public metrics, project state, review queue and search index in bot commit `176028b8f9d16081dd013ed03783057e433f67df`.
- Nine publisher bodies/excerpts were inspected. One genuinely new Hebrew source identity was added: AID 5100285, with two non-verbatim, source-grounded propositions about dividing Chumash/Chok L'Yisrael study across the workday and the letter's specific timing/alternative-study qualifications. Existing AID 4666231 gained one proposition for the closing request to pray for the writer's mother's health. Total propositions added: **3**.
- Five existing identities were enriched or normalized: AID 4666231 gained content; AIDs 4666211, 4666215, 4666216 and 4666232 had stable locators and metadata aliases linked to their existing Evidence Families. These aliases are not independent witnesses and translations/reprints are not counted separately.
- AID 4754587 was inspected as a partial publisher excerpt. Reconciliation showed that this stable AID already existed in the corpus, so the candidate file created during the batch was deleted rather than counted as a second source. The exact pre-existing item path was not exposed by the available file API; no new Evidence Family was created. Its existing topic alias is exercised by the bounded family-planning regression, with explicit historical-context and no-medical-advice limits.
- Before reconciliation: answer-eligible unique sources **652**, content-verified unique sources **649**, answer-eligible propositions **1,999**, canonical unique keys **8,953**, verified unique keys **7,635**, canonical JSON files **422**, review queue **1,063**. After the first reconciliation: **653**, **650**, **2,002**, **8,950**, **7,633**, **424**, and **1,060** respectively. PR #11 was squash-merged as `c5193ccadfb95aa9292e842fc12a5652037e8bf0`, removing the duplicate AID 4754587 candidate. The second reconciliation committed in bot commit `0f134c1f330a60cd0ac4fd29247f9a3bc1568fa8`, confirming canonical JSON files **423**; answer-readiness counts remained **653**, **650**, **2,002**, with canonical unique keys **8,950**, verified unique keys **7,633**, and queue **1,060**.
- Retrieval now includes the narrow topic `לימוד יומי תחת עומס עבודה`, with a cross-letter comparison between AIDs 5100285 and 5357571. Regression cases were added for regular and researcher modes, proposition-level citations, two Evidence Families, entailment and context boundaries. The existing `מניעת הריון בסיכון רפואי` topic is exercised against the pre-existing AID 4754587 identity.
- This batch adds Hebrew correspondence. No new English/Yiddish witness or non-letter document type was admitted because a suitable accessible body was not verified in this run; existing English/Yiddish material remains separate and translations are not independent evidence.
- The current `data/acquisition/latest.json` still records `no_candidates` and zero attempts; the earlier 12-reference HTTP 403 blocker is documented in the prior recovery record. The blocked crawler was not rerun. Manual public web inspection was used instead; no access controls were bypassed and no full copyrighted text was copied.
- The structural report `data/evaluation/latest-quality-gate.json` is dated 2026-11-12 and is not bound to this commit. The available GitHub connector returned no commit status or commit-bound workflow run details, so execution of `node scripts/test_content_readiness.mjs` is **not independently verified** and no pass claim is made. The GitHub Pages URL and its public data files were inaccessible to the available page reader; repository artifact refresh is confirmed, live publication is **not independently verified**.
- No automation schedule, audience or repository permissions were changed.
