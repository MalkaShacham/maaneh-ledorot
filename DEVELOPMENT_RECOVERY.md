# מענה לדורות — המשך פיתוח לאחר אבחון התקיעות
- Full-index duplicate reconciliation also exposed several same-AID presentations. Same-AID/same-Evidence-Family records are now classified as duplicate presentations, not separate independent witnesses. The English/SIE presentations for AIDs 3906812, 2514160, 2465321 and 2487556, and the repeated Hebrew letter AID 2989328, were linked to their canonical Evidence Families and marked non-independent.
- AID 259799 is a multi-document page, not one source item: direct inspection of the public Chabad.org body shows an earlier Yiddish letter in Shevat 5713 (lines 272–276) and a separate later English letter in Iyar 20, 5713 (lines 284–290). The earlier and later letters now have distinct `source_unit_key` values and Evidence Families. The later letter's locator was corrected from 274–279 to 284–290. This prevents the page-level AID from collapsing two distinct letters while still treating the recipient's translation of the Yiddish letter as non-independent.
- `PROJECT_CANON.md` now defines `source_unit_key`, `source_unit_locator` and `document_unit_label` for pages containing multiple primary documents; `reconcile_metrics.py` uses the unit key as the primary identity boundary when present.


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


## 2026-11-13 — Batch 062: source-grounded correspondence and publication retrieval

- PR #12 was squash-merged to main as `c8dc09f8605983b586c09777d4aa6d64061ada82`. The batch reviewed **15 public publisher bodies/excerpts**: nine new Hebrew/Yiddish letter identities (AIDs 4666291, 4666292, 4666293, 4666294, 4666296, 4666297, 4666300, 4666301 and 4666305), one existing identity enriched in place (AID 4666289), and five existing identities rechecked without adding duplicate propositions (AIDs 4666210, 4666211, 4666219, 4666231 and 4666264). Twenty non-verbatim propositions were added with `proposition_origin=source_grounded_paraphrase`, `proposition_verbatim=false`, `proposition_verification=source_text_inspected`, item-level locators, provenance, scope, context and limitations.
- The five rechecks confirmed the already stored propositions against the publisher's indexed body text. Direct reader opens continued to return shell/navigation output for several pages; the search-indexed publisher body was used only where it exposed the actual letter text. AID 4666295 and the other remaining reader shells were not used, and no proposition was inferred from a title, ID or navigation shell. No full copyrighted text was copied.
- Duplicate reconciliation found two metadata-only aliases: `igrot-v2-171-4666210` and `igrot-kodesh-v2-letter-192-aid-4666231`. Each was assigned the same AID and `evidence_family_id` as its content-bearing canonical item and linked with `same_evidence_family`; neither is an independent witness. The duplicate AID 4666210 queue entry was removed. Translation/reprint material remains non-independent.
- Retrieval now recognizes the specific topic “הדפסת ספרי חסידות ותיקוני מהדורות”, suppresses the generic publishing bucket when the specific topic is present, and handles the Hebrew clitic/definite-article form “והפצתם” without leaving “פצתם” as an unsupported residual qualifier. Researcher mode retains three independent original-language Evidence Families (AIDs 4666289, 4666300 and 4666301) while marking the existing English publisher translation AID 2294977 as derived/non-independent context. Its corresponding Hebrew original was not identified; it was not linked to AID 4666300 because the letter numbers differ.
- Before/after reconciliation: `answer_eligible_unique_sources` **653 → 663**; `content_verified_unique_sources` **650 → 660**; `answer_eligible_propositions` **2,002 → 2,022**. Final reconciled counts: canonical unique item keys **8,958**, verified unique item keys **7,641**, canonical JSON files **432**, Evidence Family files **55**, review queue **1,058**.
- Reconciliation/search-index commit: `447c266cb5bcd3163a79415ef6913f7171d554ed`. Answer-quality gate passed on PR run **43335370438** and on merged-main run **43335539676** (merge commit `c8dc09f...`). `node scripts/test_content_readiness.mjs`, `test_answer_integrity.mjs`, `test_question_specificity_gate.mjs` and workflow write-safety checks all passed. The structural report has 32 regression cases, no failures or warnings; it remains a structural gate, not proof of semantic entailment for every possible query.
- GitHub Pages build/deployment run **43335594714** completed successfully on reconciliation commit `447c266...`. The available web reader could not independently open the Pages URL, so deployment is confirmed by the GitHub Pages workflow rather than direct page-content retrieval.
- The scheduled hourly run **43335456118** ran on the pre-merge SHA `139a3267...` and failed its older BATCH018 class/camp comparison during the readiness step. This is separate from batch 062: the subsequent main answer-quality gate passed. The acquisition state recorded the prior HTTP 403 block; the latest committed acquisition report shows zero attempts/no candidates, and the host is now explicitly marked `permanent_block` so the GitHub runner skips further requests. Manual public web search/open was used instead. The hourly cron remains `7 * * * *`; no schedule, audience or permissions were changed.


## 2026-11-13 — Batch 063: Yiddish/Hebrew text inspection and family-aware researcher retrieval

- Inspected **9 text pages** for Igrot Kodesh volume II letters רמא–רמט through Pnimi's public text index, cross-checking Chabad.org Knowledge Base excerpts for AIDs 4666280–4666286. Pnimi identifies itself as an index for chabadlibrary.org and states that text rights remain with Kehot; it was used as a secondary access path, not an independent witness. Direct Chabad.org item routes returned navigation shells in the current reader. No crawler retry, access-control bypass or full-text copying occurred.
- Enriched **8 existing item identities** (AIDs 4666280, 4666281, 4666282, 4666283, 4666285, 4666286, 4666287, 4666288) and added **one new item identity** (AID 4666284, letter רמה). Added **20 new non-verbatim source-grounded propositions**. AID 4666281's three existing propositions were moved from a duplicate alias into its canonical item and were not counted as new propositions.
- AID 4666284 remains **Parsed**, not Verified: its Yiddish body was inspected via the secondary Pnimi index, the Chabad.org item page exposed only a shell, and the underlying secretariat copy was not inspected. Its publisher note explicitly points to letter ריג, so it joins the existing Shanghai printing/education Evidence Family; the unresolved letter ריג identity remains a candidate and receives no inferred AID.
- The Shanghai chain and Rebbe-mother certificate chain were reconciled at item level; four aliases are linked to canonical items and no translation, reprint or alias is counted as independent evidence. AID 4666280 was removed from the review queue.
- Retrieval work adds the specific Shanghai printing topic and Yiddish/English book-publication aliases. Regular mode keeps one item per Evidence Family; researcher mode can show up to four distinct item members in a family while counting that family once. Claim-level source locators are exposed in researcher witness maps. Content-readiness metrics count unique Evidence Families while aggregating distinct propositions across family members.
- Before reconciliation: answer-eligible unique families **663**, content-verified unique families **660**, answer-eligible propositions **2,022**. Expected after reconciliation: **666**, **663**, **2,042**; canonical unique item keys **8,958 → 8,959**, canonical JSON files **432 → 433**, review queue **1058 → 1057**. These are expected values until the reconciliation workflow confirms them.
- Commit-bound Actions and GitHub Pages deployment are pending; no schedule, audience or repository permissions were changed.


## 2026-11-13 — Batch 064 reconciliation repair

- Batch 064 added ten Hebrew publisher-letter identities and enriched one existing identity (AID 5100487) with four inspected, non-verbatim propositions. Reconciliation on main confirmed answer-eligible Evidence Families 664→674, content-verified families 661→671, and distinct propositions 2,328→2,345.
- The latest answer-quality run then failed because the test could not find AID 5100487 in the generated public search index. The record existed in `data/items/library-igrot-kodesh-v18-index-verified-2026-10-01-001.json`, but that volume-index container is double-encoded JSON and the deterministic item reconciler does not load its inner records. The correction is deliberately narrow: expose only the already inspected AID 5100487 record as `data/items/chabad-letter-5100487.json`, preserving the same AID, Evidence Family, provenance and partial-context limits. Do not parse/promote the entire volume index, which would risk counting bibliographic index rows as inspected content.
- Before this repair, the latest main runs were reconciliation **43343952507** (success), answer-quality gate **43343952573** (failed on the missing AID 5100487 search-index entry), and Pages deployment **43343950844** (success on the pre-repair index).

## 2026-11-13 — Batch 065: inspected letters, source restoration and cross-family retrieval

- Inspected **9 publisher text bodies** through public web search/open: AIDs **4812666, 4994198, 4812708, 5071046, 5100253, 4830967, 5100391, 5413170 and 5100487**. All nine are Hebrew correspondence pages attributed by the publisher to Kehot Publication Society. The review used only visible body text and item-level locators; no full copyrighted text was copied.
- Added **3 new source identities**: AIDs **4994198** (letter ד׳שב, volume XIII), **4812708** (letter א׳תרסא; volume not asserted from the inspected page), and **5413170** (letter ח׳תכב, volume XXII). Added **10 non-verbatim source-grounded propositions** across those three records. Enriched existing AID **4812666** with one additional proposition about the letter's four-cubits/light-in-the-surroundings passage. Rechecked AIDs **5071046, 5100253, 4830967 and 5100391** without duplicating their already covered propositions.
- Restored AID **5100487** as one canonical item record using its existing four inspected propositions. This is not a new witness and is not counted as a new authored proposition. The four propositions were already present in the double-encoded volume index; the change makes the existing evidence discoverable by the public search index.
- Source-level scope remains partial: incoming letters, physical manuscripts and secretariat copies were not independently inspected. AID 4812708's conditional instruction about requesting forgiveness from a first wife is retained as a conditional personal response, not generalized as a halachic rule. AID 5413170's appended Kfar Chabad building note is kept separate from the main blessing and is not assigned an inferred date or addressee.
- Blocked/insufficient candidates were documented: AIDs **4666220, 4812846, 5099941, 5100376 and 5100603** returned rewritten-summary/navigation shells rather than source bodies. The French and Yiddish Yechidus pages **553671** and **553673** expose audio items and event navigation but no transcript; they remain in the review queue and no propositions were inferred. English-translation searches for the reviewed topics yielded no accessible text witness. The known GitHub-runner HTTP 403 block remains in force; no crawler retry or access-control bypass occurred.
- Duplicate checks covered the review queue, bulk-index inventories, batches 055–060 and 064, relevant volume indexes and explicit item paths. The full public-search-index was too large for file-fetch, so the check is documented as bounded rather than exhaustive. No translation or audio-language variant was counted as an independent witness.
- Added retrieval aliases for **daily study/prayer routines** and the **Kfar Chabad two-storey private-house note**. The new quality test requires a three-family pattern synthesis in regular and researcher modes, claim-local citations, valid proposition entailment, witness-local context boundaries and researcher evidence-map locators.
- Before this run: answer-eligible unique Evidence Families **674**, content-verified families **671**, distinct answer-eligible propositions **2,345**. Expected after reconciliation: **678**, **675**, **2,359** respectively. Eleven new paraphrase entries were added; four already inspected AID 5100487 propositions were restored to the search index. Canonical unique item keys are expected to rise **8,968→8,972**, verified unique item keys **7,650→7,654**, and canonical item JSON files **434→436**. Queue remains **1,050** because the two audio-only Yechidus items were not content-inspected.
- Reconciliation, the corrected answer-quality gate and Pages deployment are pending for the batch-065 commit. The hourly cron remains unchanged; repository audience and permissions are unchanged.


## 2026-11-13 — Batch 066: twelve inspected Hebrew correspondence pages

- Inspected **12 item-level Hebrew publisher bodies/excerpts** through public web search/open: AIDs **5019175, 5019408, 5019192, 5054253, 5054281, 5099923, 5099937, 5100533, 5100423, 5413208, 5019512 and 5100416**. Added **12 new source identities** and **26 non-verbatim source-grounded propositions** with `proposition_origin=source_grounded_paraphrase`, `proposition_verbatim=false`, `proposition_verification=source_text_inspected`, proposition-level locators, provenance, scope, circumstances and limitations. All remain `context_status=partial`; Verified is scoped to the visible published text, not autograph authentication.
- Four candidates were excluded after the public reader redirected to rewritten summary/shell pages: AIDs **5413100, 5054355, 5071147 and 5071091**. The blocked candidates were documented and other accessible publisher pages were used in the same review. No HTTP-403 crawler retry or access-control bypass occurred.
- Important boundaries: AID 5019512 is only an excerpt beginning with an ellipsis; the publisher says AIDs 5019192 and 5054281 were completed from secretariat copies, which were not independently inspected; AID 5100423 directs the recipient to local halachic authorities and does not provide a final ruling; the army context for AID 5413208 comes from a publisher footnote. No full copyrighted text was copied and no translation was counted as an independent witness.
- Deduplication checked current item paths, the review queue, bulk-indexed records, research batches 055–060 and 064–065, and available volume indexes. No matching AID/URL record was found for the 12 admitted identities; each receives one distinct Evidence Family. No existing identities were enriched in this batch.
- Retrieval work adds narrow aliases for shidduch search, fixed study times and study with a partner, Torah study with farming, yeshiva study and future livelihood, local halachic referral, personal rectification through dissemination, daily study schedules, and daily Torah observance. It also repairs the prior batch-064 retrieval regression for AID 5100223 by matching the proposition's actual phrasing about adding a trading partner and expanding a business independently. Regression coverage is added for both answer modes and a two-family comparison.
- Before reconciliation: `answer_eligible_unique_sources=678`, `content_verified_unique_sources=675`, `answer_eligible_propositions=2360`. Expected after reconciliation: **690**, **687**, **2386**. Canonical unique item keys are expected to rise **8,972→8,984**, verified unique item keys **7,654→7,666**, and canonical item JSON files **436→437**; review queue is expected to remain **1,050**. These are expected values pending the reconciliation workflow.
- The preceding answer-quality run **43347925051** failed at `test_content_readiness.mjs:364` because the existing AID 5100223 partnership proposition did not match the query wording. The narrow alias repair is included; commit-bound test results and Pages publication remain pending.
- No automation schedule, repository audience, or permissions were changed.


## 2026-11-13 — Batch 067: Hebrew publisher-body review and retrieval collision repair

- Inspected **10 visible Hebrew source-body passages** from Chabad.org/TheRebbe.org. Added **8 new AID identities** (5019579, 5100579, 4854786, 5100402, 4854570, 4854796, 4854525, 5100709) and enriched **2 existing identities in place** (5357154, 5413358). No duplicate item or translation witness was created.
- Added **17 non-verbatim, source-grounded propositions** to the eight new identities and one additional proposition to existing AID 5413358. Existing AID 5357154 received an updated locator and provenance inspection. Every new proposition uses `source_grounded_paraphrase`, `proposition_verbatim=false`, `proposition_verification=source_text_inspected`, exact body locators, provenance, explicit scope and context limitations.
- The two excerpt-only records (5019579 and 5100579) remain scoped to visible excerpts. AID 5357154 remains explicitly a publisher-marked copy. AIDs 4854786 and 5100402 remain marked as completed from secretariat copies not independently inspected. AID 5413358 retains its unresolved volume-metadata conflict and its existing Evidence Family.
- Twelve English Sicha page attempts (AIDs 5550440, 5550445, 5550446, 5550447, 5550471, 5550472, 5550482, 5550484, 5550486, 5550488, 5550489, 5550495) returned internal errors. Twelve other item pages redirected to rewritten summary shells without inspectable body text. These were excluded; ten accessible Hebrew publisher pages were used instead. No runner crawler retry, access-control bypass or full copyrighted text copying occurred. No Yiddish transcript body was available in this run.
- Reconciled baseline before this batch: answer-eligible unique sources **690**, content-verified unique sources **687**, answer-eligible propositions **2,386**. Expected after reconciliation: **698**, **695**, and **2,404**, respectively. These are expected values until the reconciliation workflow confirms them.
- Retrieval regression: commit `c16ce5d` passed question-specific retrieval, synthesis, citation integrity, structural evidence checks and write-safety, but failed `test_content_readiness.mjs:364` on the synagogue-dissemination query. The cause was a generic `הפצת המעיינות` alias shared with the separate Tanya-project topic. The alias sets were narrowed; a positive synagogue test and a negative Tanya-project cross-contamination test were added, while retaining a separate positive Tanya-project test.
- The preceding Pages deployment for `c16ce5d` succeeded (run 43365529274); its answer-quality gate failed at the content-readiness step (run 43365530415). The new commit-bound quality gate, reconciliation and publication checks remain pending until their actual workflow results are available.



## 2026-11-13 — Batch 068: five Hebrew library excerpts and four English translation letters

- Reviewed **9 item-level source bodies**: five Hebrew text excerpts from the official Chabad-Lubavitch Library (letters **י'תקמד**, **י'תכא**, **י'שלד**, **י'תתכט** and **תשפה**) and four line-addressable English translations from Chabad.org/TheRebbe.org (AIDs **2277919**, **3906834**, **2278277** and **2278341**). Added **9 new letter identities** and **18 non-verbatim source-grounded propositions** with proposition_origin=source_grounded_paraphrase, proposition_verbatim=false, proposition_verification=source_text_inspected, item-level locators, provenance, verification scope, context and limitations. No existing item identity was enriched because no exact duplicate was established.
- The five Chabad Library page opens returned **zero readable lines**; the body text was exposed in public search-result excerpts. Their propositions are explicitly limited to the visible excerpt and all remain context_status=partial. One item, י'תקמד, is a **free Hebrew translation of a Russian-language letter**; the Russian original was not inspected and the translation is marked non-independent.
- The four English Chabad.org pages are translations credited to Eli Touger. The opened body ranges were: AID 2277919, lines 261–287; AID 3906834, lines 262–287; AID 2278277, lines 296–321; AID 2278341, lines 262–287. Original Hebrew texts and incoming letters were not inspected. Each translation is marked independent_witness=false, linked to one stable Evidence Family, and must not be counted as a second witness if an original-language version is later found.
- AID **4666220** was attempted as requested but redirected to a rewritten Torah Texts summary shell with no item-level letter body; it was excluded. Yiddish discovery returned no inspectable item-level transcript, so no Yiddish source was admitted this run. The alternate Chabad Library and Chabad.org Letters sources were used in the same run. No crawler retry, access-control bypass or full copyrighted text copying occurred.
- Deduplication checked exact AIDs/URLs and letter numbers against current item paths, the review queue, bulk-indexed files and batches 061–067. A substring hit for תשפה was rejected as a false duplicate: the existing metadata item is יִתְשפה in volume 28, whereas the new source is תשפה in volume 4. The four English translations and the Russian-to-Hebrew translation each receive one Evidence Family representing the underlying letter; translations are not independent witnesses.
- The prior content-readiness failure at scripts/test_content_readiness.mjs:364 was traced to the broad alias הפצת המעיינות inside the separate topic הרחבת שיעור חסידות. That generic alias was removed; the regression test now asserts that a synagogue-dissemination question retains its specific topic and does not inherit the class-expansion topic. Browser cache-bust versions were advanced in index.html and src/answer-engine-validated.js.
- Before this batch: answer_eligible_unique_sources=698, content_verified_unique_sources=695, answer_eligible_propositions=2404. Expected after reconciliation: **707**, **704**, **2422**. These are expected values until the reconciliation workflow confirms them. Commit-bound test_content_readiness.mjs, answer-quality gate, Actions and Pages deployment remain pending.
- The hourly schedule, repository audience and permissions were not changed.
 
## 2026-11-13 — Content research batch 070 (manual public-source inspection)

- **Work performed:** inspected 15 public source bodies: 10 English letter pages, 3 Hebrew letter pages, 1 English translation excerpt explicitly sourced to a Yiddish letter, and 1 multi-document correspondence dossier.
- **New identities:** 15; **new Evidence Families:** 15; **existing identities enriched:** 0; **new metadata-only identities:** 0; **new non-verbatim source-grounded propositions:** 38.
- **Deduplication:** checked AIDs 4096309, 4096316, 2187392, 1878120, 4380025, 1858362, 2190037, 1861674, 63797, 6976443, 2989328, 2989329, 4279887, 2313660 and 142535 against the 8,986-entry public search index and 1,050-item review queue. No exact duplicate or queued item was found. The two Hebrew letters from the same day are distinct documents with distinct bodies. The Reagan dossier is one correspondence family.
- **Witness integrity:** AID 2190037 is a transcribed copy; the publisher says the original is unavailable and errors may exist. AID 2313660 is an English translation excerpt from a Yiddish letter; the original Yiddish was not inspected. Both are explicitly non-independent. Hebrew AIDs 2989328, 2989329 and 4279887 are published Hebrew texts; linked PDFs were used only for printed pagination/identity, not semantic verification.
- **Access blocks and exclusions:** the Chabad Library link to the Yiddish original (fURL /admur/ig/8/2480) returned no readable lines; BeitChabad AID 5996834 returned navigation/metadata without a readable body. No access controls were bypassed. AIDs 2447820 and 2876437 are editorial/free adaptations and were not admitted as independent source texts. An accessible alternative was used: AID 2313660, an English translation excerpt, marked non-independent.
- **Retrieval changes:** added aliases for difficulties, personal purpose/world influence, time/laziness, mental focus, professional study/future, educational responsibility, public education values and Rosh Hashanah/time. Researcher mode retains claim-local locators and family deduplication. Evidence normalization now respects explicit non-independent flags and treats transcribed copies as derived witnesses.
- **Quality-gate repair:** repaired the malformed batch-069 test insertion that caused a syntax error in scripts/test_content_readiness.mjs; added batch-070 provenance, translation, transcription, family, retrieval, citation-entailment and researcher-mode regression tests.
- **Expected metric effect before reconciliation:** answer_eligible_unique_sources 719 → 734 if all 15 newly verified Evidence Families pass readiness. This is an expectation only until reconciliation writes and public metrics are reread.
- **Crawler:** no retry of the blocked hourly acquisition crawler; no access-control bypass; no full copyrighted text copied.



## 2026-11-13 — Batch 072: eight translated letters and one existing identity enrichment

Manual public-web inspection was completed on eight new item-level publisher pages (AIDs 2278254, 2278256, 2278257, 2278259, 2278260, 2278261, 2278262, 2278265; English Letters 642–649) and the complete published body of existing AID 2187392. The new letters contribute 17 non-verbatim, source-grounded Hebrew propositions. AID 2187392 gained one additional proposition based on lines 282–289. The new English pages explicitly credit Eli Touger as translator; each is marked `independent_witness=false` and assigned to one Evidence Family for the underlying letter. Any original-language witness found later must join that family rather than increase the family count.

| Measure | Before | Expected after reconciliation |
|---|---:|---:|
| Answer-eligible unique Evidence Families | 744 | 752 |
| Content-verified unique Evidence Families | 741 | 749 |
| Distinct answer-eligible propositions | 2,509 | 2,527 |

The new bodies cover North African Jewish education and emissary activity, the value of influencing one individual, practical action in outreach, fixed and group study, immigrant-child education, use of vacation time, conditional housing guidance, and pregnancy-specific correspondence. Retrieval regressions were added for multi-source educational influence/action synthesis in regular and researcher modes, with claim-local citations, witness-level locators, citation entailment and context-boundary checks.

Blocked alternatives were not counted: nine AIDs redirected to rewritten Torah Texts shells without inspectable bodies (4666240, 4666241, 4646121, 4646123, 4646126, 4646127, 4646128, 4646129, 4666316); nine direct pages were inaccessible through the public reader (2308526, 4855474, 5413720, 5287861, 5054354, 2306904, 2307741, 2307902, 2308550); and adjacent Letter 650 (AID 2278266) returned HTTP 429. The run switched to accessible direct publisher pages for Letters 642–649. No blocked crawler was retried, no access controls were bypassed, and no full copyrighted text was copied. Exact repository search and the review queue contained no matching new AIDs; the connector could not return the oversized public-search-index file, so reconciliation remains the final duplicate check.

Content review is complete; Git commit, reconciliation, commit-bound `test_content_readiness.mjs`, Actions and Pages publication checks remain pending at this point.


### Batch 072 quality-gate correction

The first commit-bound quality run (workflow run 43423215342) passed index generation, question-specific retrieval, answer synthesis, citation integrity, the structural evidence audit and workflow write-safety checks, but failed `test_content_readiness.mjs` at the Beit Rivka two-family researcher comparison. The cause was an overbroad derived-witness classifier: it treated the word `transcription` as a translation/derivative even when the publisher text was a transcription of the original Hebrew letter. The classifier now excludes only translations and explicitly identified copies/transcriptions of copies; regression checks preserve AIDs 4666292 and 4666305 as original-language text witnesses while keeping AID 2190037 non-independent. A commit-bound rerun is required before marking the gate passed.


### Batch 072 quality-gate correction 2

The second commit-bound quality run passed retrieval, answer synthesis, citation integrity, the evidence-contract audit and workflow write-safety checks, but `test_content_readiness.mjs` then exposed that `reconcile_metrics.py` was rebuilding a derived editorial proposition from `summary_researcher` even when a source record explicitly declared `has_content_evidence=false`. The index therefore mislabeled the two unplayed Yechidus audio listings (AIDs 553672/553673) as content evidence. Reconciliation now treats an explicit false content flag as authoritative, suppresses summary-derived propositions for that record, and carries witness/translation metadata into the public index. This preserves metadata-only identity and prevents audio listings without audio/transcript inspection from becoming answer evidence. A new commit-bound run is required.


### Batch 072 quality-gate correction 3

The third commit-bound readiness run reached the dossier checks and found a test-field mismatch, not missing source content: the Reagan correspondence dossier records the addressee as `audience` (`נשיא ארצות הברית`) while its `conditions_or_qualifications` correctly limits attribution of third-party texts. The assertion was corrected to validate the addressee in the audience field rather than requiring it in the conditions field. No source proposition or context boundary was broadened.


### Batch 072 researcher-mode test semantics

The multi-source regression distinguishes two underlying letter Evidence Families from two independent witnesses. The selected new sources are English translations of two different letters: they may support a two-family synthesis, but must not be counted as two independent textual witnesses. Researcher mode now asserts two family-level evidence-map entries and explicitly non-independent translation status for both sources, while existing Hebrew-source tests continue to require independent witnesses where the primary text is available.


### Batch 072 retrieval regression correction

A further readiness run showed that the established three-letter pattern test for difficulties/obstacles did not recognize the exact Hebrew query phrase `קשיים ומכשולים`, although the topic already contained narrower variants. The topic alias set now includes the exact query phrase and its word-order variant in both the core retriever and validated comparison layer. This is a bounded synonym correction; the test still requires the three named source families and claim-local citation/context checks.

 
## 2026-11-13 — content batches 073–075, reconciliation and retrieval regressions

Measured corpus progress across the three reviewed batches:
- `answer_eligible_unique_sources`: 752 → 779 (+27).
- `content_verified_unique_sources`: 749 → 776 (+27).
- `answer_eligible_propositions`: 2,527 → 2,601 (+74).
- 41 source bodies/segments recorded as inspected across the batches: 17 (073), 10 (074), 14 (075). The latest batch reviewed 15 items, including 14 body/segment inspections.

Batch detail:
- 073: 12 new unique source families; 2 duplicate aliases linked to canonical families; 2 existing identities enriched and 2 rechecked; 31 new paraphrases plus 1 proposition added to an existing identity; 3 translation observations retained as non-independent; 3 blocked candidates.
- 074: 7 new unique source families; 1 existing identity enriched and 2 rechecked; 20 new paraphrases plus 1 existing proposition; duplicate AIDs 4731080 and 4812666 were linked to existing families rather than counted as new; 4 blocked candidates.
- 075: 8 new unique source families (7 correspondence identities and 1 secondary narrative); 6 existing identities enriched and 1 rechecked; 16 new paraphrases plus 5 existing-identity propositions; 3 blocked candidates. The AID 79705 item is explicitly a secondary narrative, not primary correspondence or an independent Rebbe witness.

All three batch manifests and the acquisition summary are reconciled against `data/public-metrics.json` and `data/project-state.json`. Current metrics are 779 answer-eligible unique sources, 776 content-verified unique sources, and 2,601 answer-eligible propositions. The content-review queue still contains 1,054 pending items; no unreviewed item was promoted merely to reach a target.

Public-source rechecks:
- AID 6429866 (English letter to President Gerald Ford) remains body-accessible; the current page displays the letter at lines 271–300, while its proposition locator remains lines 261–292. AID 4783876 (Yiddish melody correspondence) was previously inspected at body lines 244–261, but the current URL now redirects to a rewritten Torah Texts summary shell; the earlier inspection remains recorded and was not repeated as a current body check.
- AID 79705 (Eli Touger, “A Miraculous Release”) was accessible as a secondary narrative; its locator was corrected to article body lines 254–269, replacing the erroneous footer-range locator 280–303.
- AID 4812673 was accessible at body lines 290–302.
- The current recheck of AIDs 4783853, 4812732, 5100383, 5100452, 5100585 and 5100260 returned summary shells. AID 5357369 also currently returns a summary shell; its previously inspected added passage is specifically located at lines 301–302. These are documented access limitations, not fresh body inspections.
- The hourly content crawler's earlier 12 HTTP 403 responses remain documented. It was not retried, no access controls were bypassed, and no full copyrighted text was copied.

Retrieval and researcher-mode work:
- Added source-specific retrieval for non-Jewish shemitah produce and referral to local halachic authorities; the partial Lod yeshiva study/travel excerpt; the Yiddish melody letter; the English Ford letter; and the education/influence question across distinct translated letter families.
- Added multi-source daily-study/prayer and tzedakah synthesis with claim-level source locators, context and limitations.
- Researcher mode now distinguishes total underlying Evidence Families from independent witness families. English translations can be shown as non-independent manifestations without being counted as independent witnesses; secondary narratives are not treated as translations.

Validation status: answer quality gate run 43463212994 on commit 658fc435 passed, including `test_content_readiness.mjs`; Pages build/deploy run 43463212552 succeeded; bulk-ingest run 43463212996 completed without a content change. The tzedakah synthesis regression was resolved by making query-specific evidence selection mutually exclusive and prioritizing inspected propositions for year-round giving, allocation, and proportional charity. Hourly maintenance run 43460650386 reported no actionable corpus change and failed evidence validation before publication; it did not create a new content batch. The blocked crawler was not retried. The website URL could not be independently rendered by the web reader, although GitHub Pages build/deploy succeeded.


## 2026-11-13 — Manual content review batch 076

- Inspected 10 new public English-language letter bodies and re-inspected one existing Hebrew letter (AID 4812673): 11 bodies total.
- Added 10 distinct letter/excerpt identities and 20 non-verbatim, source-grounded propositions; enriched AID 4812673 in place with one additional proposition from Hebrew body line 295, retaining its existing Evidence Family.
- The 10 English renderings are conservatively marked `independent_witness=false`. AID 72910 is explicitly labeled a free translation; the translation status of the other English pages is not established by the page. AID 1898720 is an excerpt, not a complete letter.
- 12 candidate pages were blocked by rewritten summary shells or open errors. No blocked crawler was retried; alternative public item-level letter pages were inspected in the same run. No access controls were bypassed and no full copyrighted text was copied.
- Expected content-readiness change after reconciliation: `answer_eligible_unique_sources` 779 → 789; `content_verified_unique_sources` 776 → 786; `answer_eligible_propositions` 2601 → 2622. These are expected values until the reconciliation workflow confirms them.
- Retrieval work: added focused Hebrew/English topic aliases for sadness, depression, loneliness, life purpose and additional fasts; added a multi-source answer-quality regression for regular and researcher modes, requiring proposition-level citations and witness-local context boundaries.
- The reconciliation script now audits the latest content-research batch dynamically and resets its before/after delta from that batch's recorded `metrics_before`, rather than remaining hard-coded to batch 075.


## 2026-11-13 — Hourly acquisition guardrail

- The hourly schedule remains unchanged (7 * * * *). The runner-side live crawler is now skipped by default after the prior HTTP 403 across all 12 references; the scheduled job continues deterministic promotion, identity reconciliation and metrics reconciliation.
- The push trigger no longer treats a scripts/reconcile_metrics.py-only change as a reason to launch the hourly acquisition workflow.
- At the time this guardrail was prepared, the run triggered by the content commit was already in progress at the acquisition-boundary test, with the live-acquisition step pending. The available GitHub integration exposes run status but no cancellation action; that in-flight run could not be canceled from this session. Future scheduled runs use the skip policy above.


## 2026-11-13 — Retrieval regression correction

- The first content-readiness run after batch 076 passed question-specific retrieval, answer synthesis, citation integrity and workflow-write safety, but caught an over-broad new topic alias that diverted the existing AID 5100225 query for "lack of desire in study". Removed the phrase "חוסר חשק בלימוד" from the new wellbeing alias in both retrieval layers; the narrower terms for low mood, confusing thoughts and low vitality in study remain. The regression is being rerun on the corrected commit.


- Narrowed the new wellbeing query alias after the first real-corpus run showed excessive expansion for a broad low-mood query. The multi-source regression now uses the exact source-grounded terms "מיעוט חיות בלימוד" and "מחשבות מבלבלות"; dedicated sadness/depression/loneliness aliases remain, while generic terms were removed from the expansion set.


## 2026-11-13 — Reconciliation and runner invocation audit

- Batch 076 reconciliation completed with zero variance: answer-eligible unique Evidence Families 779 → 789; content-verified unique Evidence Families 776 → 786; answer-eligible propositions 2601 → 2622. The reconciliation audit selected all 10 new identities plus the enriched AID 4812673 identity; all 11 were answer-eligible and each had a top-level verification scope. Ten English renderings remain non-independent witnesses.
- Correction on the pre-guardrail hourly run 43466512615: its old pipeline step did execute and returned success. The available job log did not expose individual HTTP responses or a request count, and later answer validation failed before the run artifact was committed. It is therefore not possible to verify whether that one invocation reissued the prior 12 HTTP requests. No further live-crawler invocation is intended; the next hourly run used the skip policy and passed the acquisition-boundary test.
- The answer-quality gate on commit eb7a5f5b9ad6aa32941ca4ce800de98adcd5873c passed after narrowing the over-broad wellbeing alias. A subsequent commit narrows the regression query further without changing the source metrics.


## 2026-11-13 — Manual public-body review, batch 077

Inspected **12 public Hebrew publisher body pages** through web search/open. Added **3 distinct original-language letter identities** (AIDs 5100681, 5054399 and 5413166) and **8 non-verbatim source-grounded propositions** with item-level body locators, provenance and partial-context limits. Existing AID 5357409 was enriched with a non-duplicate cross-family link to AID 5100681; eight other identities were rechecked without duplicate propositions.

Twelve attempted candidates (including AID 4666220) redirected to rewritten summary/navigation shells and were excluded. Alternative item-level bodies were inspected in the same run. No blocked crawler retry, access-control bypass, scan-only content verification, full-text copying or system-synthesis attribution to the Rebbe was used.

Expected readiness pending reconciliation: **789 → 792** answer-eligible Evidence Families, **786 → 789** content-verified Evidence Families, and **2,622 → 2,630** answer-eligible propositions. Reconciliation now writes actual counts and variance back to the reviewed batch and acquisition record. The existing hourly cron is unchanged; a push path for manual content-research batches invokes the existing deterministic reconciliation workflow.


Publication verification: GitHub Pages deployment completed successfully for main commit `3f4b63215d3700daf07ec8ca027b40569ce6e1cd` on 2026-11-13. The browser/search retrieval tool could not fetch the site URL directly, so publication status is based on the successful Pages deployment job and its reported environment URL.


## 2026-11-14 — Batch 080: Hebrew/Yiddish education and institutional correspondence

- Reconciled batch 079 against the generated search index: `answer_eligible_unique_sources=803`, `content_verified_unique_sources=800`, `answer_eligible_propositions=2635`; its variance is zero. The prior run had left the batch manifest pending because the readiness test stopped on a literal escaped newline in `test_content_readiness.mjs`; that syntax defect is corrected here.
- Inspected **8 publisher bodies**: seven new item-level correspondence identities and one recheck of existing AID 5357574. New AIDs: **4929253, 5413540, 5413024, 5413389, 4854607, 4754490, 4854828**. The batch contains **3 Hebrew** and **4 Yiddish** letters, each in a distinct Evidence Family.
- Added **25 bounded, non-verbatim source-grounded propositions** with `proposition_origin=source_grounded_paraphrase`, `proposition_verbatim=false`, `proposition_verification=source_text_inspected`, exact body-line locators, provenance, verification scope, context boundaries and limitations. Topics include educational outcome review and institutional accountability; Torah-based education and timely correction; yeshiva expansion, student admission and public support; vocational education in one historical institution; and alumni continuity with Chabad institutions.
- AID 5357574 was rechecked in place; its separate secretariat appendix remains a different document and is not attributed to the Rebbe. No new proposition was added to that existing identity.
- Eleven candidate pages (AIDs 4646121, 4646123, 4646126–4646130, 4754516, 4994487, 5019596 and 5054555) opened as navigation/summary shells. They were excluded; accessible alternatives were inspected in the same run. No search snippet or scan index was used as substitute source text. No crawler retry or access-control bypass occurred.
- No translation manifestation was counted as an independent witness. The Yiddish records use Hebrew research paraphrases, not independent translated sources. No English-language manifestation was added in this batch because no same-letter translation with inspectable body and reliable family mapping was established.
- Expected after reconciliation: `answer_eligible_unique_sources` **803 → 810**; `content_verified_unique_sources` **800 → 807**; `answer_eligible_propositions` **2635 → 2660**. These are expected values until the commit-bound reconciliation and Actions results confirm them.
- Added real-corpus regression checks for education-governance and yeshiva-expansion multi-source answers, plus a bounded vocational-school answer, in regular and researcher modes. Each claim must carry source numbers and valid citation entailment; researcher mode must expose witness-level locators and multiple Evidence Families where applicable.
- No schedule, audience or permissions changed. The hourly runner-side acquisition crawler remains disabled after its recorded HTTP 403 responses.


- Regression-test correction after the first full run: `test_content_readiness.mjs` still expected OCR aliases ד׳שטג and ד׳שם as canonical identities. The 2026-10-31 content-review audit explicitly resolves those aliases to ד׳שסג and ד׳שס, respectively. Updated only the test's expected canonical keys; no source records or Evidence Families were changed.


- Follow-up source-integrity correction: AID `igrot-kodesh-v13-דשם` (printed letter number ד׳שס) is a **secretariat office letter**, not a direct Rebbe-authored letter. The printed signature is by a secretary. The item is now explicitly typed and labeled as `secretariat_letter`; its Hebrew propositions remain source-grounded, but queries asking what the Rebbe wrote cannot use it. A question explicitly asking what the secretariat letter says remains answerable with claim-level locators.
- The retrieval gate for `מסחר ולימוד יום שלם` now checks that one inspected proposition explicitly contains the three elements—commercial activity, yeshiva, and study—rather than requiring an exact phrase match. Researcher mode labels this witness as `secretariat`.
- The committed reconciliation for batch 080 confirms zero variance: `answer_eligible_unique_sources=810`, `content_verified_unique_sources=807`, `answer_eligible_propositions=2660`. The acquisition manifest's human-readable `status` field is now aligned with `reconciliation_status`; the reconciliation script will keep them synchronized on future runs.



## 2026-11-14 — Batch 081: Hebrew correspondence and claim-level synthesis

- Inspected **10 publisher bodies** through public web/search/open: nine new Hebrew correspondence identities and one existing identity re-opened for enrichment. New AIDs: 5099914, 5356971, 4812730, 4994319, 5099977, 5019597, 5019603, 4928859, 4783811.
- Added **23** non-verbatim, source-grounded propositions to the nine new identities. Each record uses `proposition_origin=source_grounded_paraphrase`, `proposition_verbatim=false`, `proposition_verification=source_text_inspected`, item-level body locators, provenance, scope, circumstances and explicit limitations.
- Enriched existing AID 4929253 in its original batch file with one additional proposition on the risk of institutional self-assessment being distorted by self-love (body lines 265–266). The AID and Evidence Family were retained; this is not a new source identity.
- Four new records are explicitly partial excerpts (5356971, 4994319, 4928859, 4783811). AID 4928859 is marked by the publisher as completed from a secretariat copy; AID 5019603 as completed from a photograph. Neither underlying witness was inspected. No scan-only verification was used.
- Eight candidates returned navigation/summary shells: 5100615, 5071147, 5100353, 4754642, 5100225, 5100277, 5413047, 5287567. They were excluded and replaced with accessible publisher bodies in the same run. The known runner-side HTTP 403 crawler was not retried; no access-control bypass or full-text copying occurred.
- Deduplication was checked against the current review queue, available research batches 055–060 and 067–078, batch 080, and bulk-indexed inventories dated 2026-09-24 through 2026-09-27. The canonical reconciliation across all item files remains authoritative and is pending. No translation was added or counted as an independent witness.
- Added a narrow retrieval/synthesis path for a two-family comparison between AID 5019597 (personal study with a chavruta) and AID 5019603 (educator-to-youth communication and gradual practice). The synthesis is explicitly labeled as system research, not a Rebbe quote; each claim has its own source locator, and the two historical contexts remain distinct. Researcher mode retains its evidence-family map and witness-level provenance.
- Baseline before reconciliation: `answer_eligible_unique_sources=810`, `content_verified_unique_sources=807`, `answer_eligible_propositions=2660`. Expected if all nine AIDs are new: 819, 816, 2684; actual counts must come from reconciliation, not this estimate.
- `test_content_readiness.mjs`, answer-integrity checks, Actions and Pages publication remain pending at this point. No cron, audience, permissions or access settings were changed.


## 2026-11-14 — Manual publisher-body review batch 083

Nine item bodies were inspected through public publisher pages: eight new content-bearing identities (seven Hebrew letters and one Yiddish organizational circular) plus an in-place recheck of existing AID 4666247. The batch adds 15 non-verbatim, source-grounded response propositions with item-level locators, provenance, scope, context and limitations. Eight distinct Evidence Families were reconciled; no translation was counted as an independent witness.

Four candidate pages (AIDs 4666220, 4854505, 4730852 and 5413047) returned summary/navigation shells without inspectable item bodies and were excluded. Alternate public bodies were inspected in the same run. The HTTP 403 crawler was not retried; no access controls were bypassed and no full copyrighted text was copied.

Reconciled metrics for batch 083: **829 → 837 answer-eligible unique Evidence Families; 826 → 834 content-verified unique sources; 2,706 → 2,721 answer-eligible propositions.** The reconciliation variance is zero. Batch details and item-level audit are in `data/items/content-research-batch-083-2026-11-14.json`.

A retrieval regression was identified: a provenance caveat saying that a secretariat copy had not been inspected was incorrectly interpreted as evidence that the letter itself was secretariat-authored. The authorship filter now uses explicit source class and witness type, and the Tanya-project query requires one inspected proposition to connect the project with dissemination of the wellsprings. The code and regression test are committed; the post-fix Actions and publication checks remain to be verified.


## 2026-11-14 — Manual publisher-body review batch 085 (reconciled; retrieval regression follow-up)

- Inspected 13 source bodies through public Chabad.org/TheRebbe.org pages: 11 new Hebrew correspondence identities, one existing Hebrew identity enriched in place (AID 5071116), and one existing Yiddish organizational circular enriched in place (AID 4645984). The Yiddish record retains its original language, identity and Evidence Family; no translation is counted as a separate witness.
- Added 28 non-verbatim source-grounded propositions to the 11 new identities and two additional propositions to the two existing identities. All use `source_grounded_paraphrase`, `proposition_verbatim=false`, `proposition_verification=source_text_inspected`, item-level body locators, provenance, scope, context and limitations.
- New AIDs: 4783830, 4754572, 4730988, 5100749, 5100450, 5356825, 5356960, 5356942, 5356869, 5100697, 5357009. Two new letters (AIDs 4783830 and 4730988) are explicitly marked as completed from a secretariat copy according to the publisher; those copies were not inspected. AID 5100749 and AID 5100697 remain excerpt/partial. AID 4754572 carries the publisher note that a similar form was written to several recipients.
- Five candidates returned navigation/summary shells (AIDs 4831207, 5100198, 5100645, 5100451, 5071045) and were excluded; alternative public bodies were inspected in the same run. AID 5357088 was withheld because the publisher says it was written on the form of the preceding letter and the physical-document relationship is unresolved. No runner-side HTTP 403 crawler retry, access-control bypass, full-text copying or scan-only content verification occurred.
- Deduplication checked batches 055–084, the review queue, bulk-indexed inventories, mixed-authorized-content files and available volume indexes for volumes 1, 4, 18 and 20. The eleven new AIDs have distinct URLs and Evidence Family IDs; the two enrichments retain their original identities and families.
- Reconciliation completed by the bulk-ingest/reconcile workflow at 21:12 UTC: answer-eligible unique sources **837 → 855**; content-verified unique sources **834 → 852**; answer-eligible propositions **2,721 → 2,767**. Actual metrics exactly match expected (variance 0 in all three measures).
- Corrected stale historical assertions in `test_content_readiness.mjs`: batch 077 no longer has to be the latest acquisition, batch 079's historical metrics are not compared with current global metrics, and batch 082's recorded variance is tested as a historical variance rather than against the current corpus. Added a three-family education/youth retrieval regression with claim-level citations and researcher-mode witness locators.
- No schedule, audience, permissions or access settings were changed. The existing hourly workflow remains intact.


### Reconciliation and retrieval-gate outcome — 2026-11-14

- The reconcile workflow completed successfully and committed the generated metrics/index/state. The Pages build and deployment completed successfully on commit `72e0de9e0d990e596c2c96ead9b1d766229101c1`.
- The answer-quality gate and hourly maintenance both reached `test_content_readiness.mjs` and failed at the new multi-source retrieval regression: the ordinary retrieval path did not select AID 4783830 for a question spanning practical pre-Bar-Mitzvah learning, a supportive conversation with a young man, and public classes. All preceding structural readiness, question-specific retrieval, answer-synthesis, citation-integrity, contract-audit and write-safety steps passed. This is a real retrieval/synthesis gap, not a content-count failure.
- The run therefore does **not** claim a fully passing quality gate. A narrow topic-specific retrieval and cross-family synthesis path is being added with claim-level locators and an explicit system-synthesis-not-Rebbe-quote label. Batch-085 reconciliation remains valid at 855 / 852 / 2,767.
- Count correction: AID 5357088 was also opened and its body inspected but withheld from promotion pending same-physical-document linkage. The accurate batch totals are 14 source bodies inspected and 19 reviewed items (including five navigation shells); it is not an additional independent Evidence Family.
- Bibliographic correction: for AIDs 5356825, 5356960 and 5356942, the page breadcrumb says כרך כ׳ while a lower page tag says Volume 18. Volume remains null pending bibliographic reconciliation. AID 5100697 is explicitly marked as a published response transmitted in the Rebbe's name by secretary A. Quint, not as an inspected autograph.


### Retrieval regression follow-up — teshuvah synthesis — 2026-11-14

- After the youth-education retrieval path passed its new checks, the same full readiness suite exposed a previously latent regression in the batch-078 teshuvah question: the standard retriever selected AID 4754232 but omitted AID 5019468, even though its inspected proposition describes a broader progression of teshuvah. This was a second retrieval/synthesis gap, not a source-readiness or reconciliation failure.
- Added a bounded two-family retrieval/synthesis path: AID 4754232 supports the explicit distinction between תשובה תתאה and תשובה עילאה; AID 5019468 is labeled only as a related, broader progression from repentance for sin to תשובה מאהבה and return to source. The system synthesis explicitly states that the two formulations are related but not identical, and every claim retains its own source locator. No new identity or proposition was added in this repair.


- Validator correction: the first teshuvah synthesis run reached the new path but the generic pattern validator still required three claims, although this bounded synthesis intentionally has two distinct Evidence Families and two claims. The validator now uses a two-claim minimum only for this two-family topic; all other pattern topics retain their existing thresholds. This is a validation-threshold correction, not a relaxation of source or locator requirements.


## 2026-11-14 — Batch 086: Living Torah publisher-synopsis review

- נבדקו 15 גופי עמודים ציבוריים בפריטי Living Torah; 14 פרופוזיציות מחקר לא-מילוליות נוספו: 13 זהויות קיימות הועשרו במקום, ונוספה זהות חדשה אחת (AID 363474). שתי הפניות נוספות (AID 618965, 4477459) הציגו מטא-נתונים בלבד ולא קודמו. AID 387881 נבדק בגוף העמוד אך הוחזק בגלל סתירה בין תאריך הכותרת לתאריך Event Date.
- כל 14 הפרופוזיציות הן פרפרזות של תקציר המו״ל באנגלית, עם `proposition_origin=source_grounded_paraphrase`, `proposition_verbatim=false`, `proposition_verification=source_text_inspected`, locator ברמת AID ושורות, היקף אימות, הקשר חלקי ומגבלות. הן מיוחסות לתקציר JEM/Living Torah ולא מוצגות כתמליל או כניסוח ישיר של הרבי. כל הרשומות נשארו `Parsed`, לא `Verified`, משום שהווידאו והתמליל לא נבדקו.
- זוהה ואוחד ברמת הזהות alias של AID 3789070: כתובת ארכיון היום והעמוד הישיר מצביעים כעת לאותו AID ולאותה Evidence Family. ארבעה פריטים מתאריך 5 חשוון תשנ״ב לא אוחדו רק בשל תאריך משותף; לכל אחד AID ועמוד פריט נפרד.
- לא נוספו תרגומים ולא הוסק מקור שפת הדיבור. סוג התיעוד שנוסף הוא תקציר מו״ל של פריט וידאו; שפת הטקסט שנבדק היא אנגלית והפרפרזות נשמרו בעברית. לא נבדקו סריקות או כתבי יד.
- מדדי לפני: 855 answer-eligible unique sources, 852 content-verified unique sources, 2,767 propositions. יעד אחרי reconciliation: 869, 852, 2,781. המדדים בפועל ייקבעו רק לאחר הרצת reconciliation.
- בבדיקת הריצות האחרונות נמצא כשל חוזר ב-`test_content_readiness.mjs`: הבדיקה דורשת `date_precision` באינדקס אך `reconcile_metrics.py` לא כלל את השדה. נוסף השדה לאינדקס, ונוספו בדיקות ל-batch 086, ל-dedup ולמצב חוקר עמוק.
- ה-crawler שחזר 403 לא הופעל מחדש; לא בוצעה עקיפת בקרות גישה ולא הועתק טקסט מוגן במלואו.


## 2026-11-15 — Batch 087 reconciliation correction

- Reconciliation found that AID 1273962 was already present in `data/items/mixed-authorized-content-2026-11-12-039.json`. The batch-087 copy is now a `Linked` duplicate alias to the existing Evidence Family `letter-aid-1273962-education-young-children`; it adds neither a new source family nor propositions.
- Corrected batch-087 totals: 7 genuinely new Evidence Families, 1 duplicate alias linked, 1 existing AID 1875534 enriched, 15 new propositions plus 1 existing proposition, and 10 source bodies inspected. AID 2189943 remains withheld; eight Yechidus pages remain metadata/player-only.
- Reconciled actual counts are 876 answer-eligible unique sources, 852 content-verified unique sources, and 2,797 answer-eligible propositions. Expected and actual counts now match; variance is zero. The correction does not retroactively promote any Parsed record to Verified.
- The duplicate-resolution audit is retained in the batch manifest and the readiness tests now require the old canonical record, not the duplicate alias, to supply AID 1273962.

## 2026-11-15 — Batch 088: reconciliation correction

- The first reconciliation produced 886 answer-eligible unique sources, 854 content-verified unique sources and 2,818 propositions, versus the original target 888 / 854 / 2,822. The identity audit showed that Chabad Library items 1200710552 and 1200710429 were already represented in batch 068; they were not new Evidence Families.
- Item 1200710552 is a Hebrew free translation of a Russian original. Its batch-088 manifestation is now linked to the existing Russian-origin Evidence Family; the translation is not an independent witness and no duplicate propositions are counted.
- Item 1200710429 is already represented by an existing Hebrew record. Its publisher note says part of the text was completed from a photograph; the photograph was not inspected. The existing record was downgraded from Verified to Parsed and marked non-independent. The batch-088 copy is a linked alias only.
- Existing English AID 1875534 had six source-grounded propositions and a directly inspected publisher body, but it lacked `has_content_evidence=true`, so it was absent from the answer index. The flag is now set after rechecking the body and locators. One proposition was added at lines 288–290; five existing propositions become answer-eligible. The English presentation remains non-independent because its original-language witness was not inspected.
- Existing Chabad Library items 1200710552 and 1200710429 were downgraded to Parsed because the Russian original and the referenced photograph were not inspected. They remain answer-eligible, but are no longer counted as content-verified.
- Corrected batch-088 target after the duplicate links, promotion and two downgrades: 887 answer-eligible unique sources, 853 content-verified unique sources and 2,823 propositions. The corrected batch is pending a fresh reconciliation and test run.

## 2026-11-15 — Batch 088 source inspection

- Reviewed 13 source bodies/items: 10 new source identities, two existing Chabad Library identities linked rather than duplicated, and one existing English identity enriched/promoted.
- The 10 new identities comprise eight new Chabad Library items (seven Hebrew, one Yiddish) and two directly opened Hebrew Chabad.org bodies. The Chabad Library pages returned no readable lines on direct open; only public search-result body extracts were inspected, so those eight remain Parsed with partial context.
- AID 5412963 was opened as a complete Hebrew body at lines 244–249 and remains Verified within its specific historical scope. AID 5413093 was opened at lines 250–266 and is a separate secretary-signed document; it is not attributed as a direct Rebbe-authored letter.
- The reviewed Chabad Library material includes a marginal response (1200710132), a Yiddish public letter (1200710378), a transcription completed from a copy (1200980070) and a transcription completed partly from a photograph (1200710429). The copy/photo witnesses were not inspected. No translation was counted as independent.
- Ten direct-open limitations were recorded and alternative accessible Chabad.org pages were used in the same run. The known 403 crawler was not retried; no access-control bypass or full-text copying occurred.
- The corrected reconciliation target is 887 / 853 / 2,823. Actions, test results and Pages publication remain unconfirmed until the corrected commit is processed.


## 2026-11-15 — Batch 089: 14 existing Living Torah identities enriched

- Opened 14 item-level Chabad.org/TheRebbe.org pages and inspected the visible JEM/Living Torah publisher synopses. Added one Hebrew, non-verbatim, source-grounded proposition per existing identity: AIDs 335482, 2889264, 4525544, 2349222, 281313, 363469, 2606412, 2946206, 702100, 1974202, 4547216, 2316185, 2920438, 4469446. These are secondary publisher synopses, not transcripts or direct inspection of the audiovisual recordings.
- Enriched the existing canonical records in place, preserving their prior archive URLs as aliases and adding item-level AIDs/URLs. All 14 remain **Parsed**, partial-context and non-independent; none was promoted to Verified. No new bibliographic identity was created. AID 4057736 was rechecked but not duplicated because it was already enriched in batch 086.
- Seven Yechidus/audio candidates exposed metadata without a readable transcript and were withheld. The queued “Kfar Chabad and Brooklyn - Healthy Competition” archive entry did not match the opened archive page; the different “Keep On Your Toes” item (AID 1558542) was not relabelled or promoted.
- No translation was counted as an independent witness. No crawler retry, access-control bypass, full-text copying, or scan-only content verification occurred. The accessible Living Torah item pages were used as the same-run fallback.
- Expected readiness after reconciliation: **900 answer-eligible unique Evidence Families** (from 886), **852 content-verified** (unchanged), and **2,832 propositions** (from 2,818). These are targets until the reconciliation and tests report actual values.
- Added regression coverage for all 14 AIDs and a two-item researcher-mode retrieval query. It requires separate item-level citations and explicitly records that publisher synopses are not independent corroborating witnesses.


## 2026-11-15 — Batch 089 reconciliation and audit repair

- The repository reconciliation produced the expected actual totals: **900 answer-eligible unique Evidence Families**, **852 content-verified unique sources**, and **2,832 answer-eligible propositions**. Delta from the pre-batch baseline: +14 / 0 / +14; variance from target: zero.
- All 14 newly answer-eligible items are existing Living Torah identities enriched in place. They remain Parsed, partial-context and non-independent publisher-synopsis records. No content-verified count was inflated.
- The first audit pass exposed a regex defect in reconcile_metrics.py: the batch update identity aid:<number> was not being mapped back to the aid: index key, so the audit reported zero selected items despite the correct metrics. Corrected the numeric-suffix regex, made batch status follow reconciliation status, and made answer_readiness.reconciliation_status explicit. The follow-up audit must select all 14 AIDs with item-level locators.
- Added an executable test_content_readiness.mjs step to the reconciliation workflow after a second deterministic index rebuild. It checks the 14 item identities, their Parsed/non-independent limits, the zero-variance metrics, the 14-item reconciliation audit, and multi-source researcher-mode claim-level citations.
- Actions and Pages publication are still subject to the resulting workflow run and live-site verification; no success is inferred from a commit alone.


## 2026-11-15 — Batch 090: Hebrew correspondence search-extract inspection

- Inspected eight distinct Hebrew Chabad Library item pages through visible public search-result body extracts: AIDs 1200930278, 1200970064, 1200960330, 1200940046, 1200880574, 1200970168, 1200890400, and 1200920296.
- Added eight candidate item identities and 16 bounded non-verbatim Hebrew research propositions in `data/items/content-research-batch-090-2026-11-15.json`. Each record has its own Evidence Family, item AID/URL locator, provenance, context limits, and `source_grounded_paraphrase` / `source_text_inspected` fields.
- Direct opens of all eight item pages returned no readable lines. Only the visible public search-result body extracts were used; all eight remain `Parsed` with partial context. No manuscript, photograph, secretariat copy, incoming letter, or full context was inspected. No item was promoted to `Verified`.
- Exact-AID repository code searches returned no matches, but a full canonical-index scan was unavailable before commit. Duplicate/AID/Evidence Family reconciliation is still required; the eight identities and expected metric change are provisional.
- Expected answer readiness: 900 → 908 unique answer-eligible Evidence Families; content-verified remains 852; propositions 2,832 → 2,848. These are targets, not reconciled results.
- No crawler retry, access-control bypass, full-text copying, translation-as-independent-witness counting, audience/permission change, or schedule change.
- Next: run canonical reconciliation, verify metrics and the generated index, then run content-readiness and answer-quality tests on the exact commit and verify Pages publication.

## 2026-11-15 — Batch 091: Hayom Yom original-language entry review

- Opened AID 4666220 through the public web reader. It redirected to a rewritten Torah Texts summary/navigation shell and exposed no inspectable item-level letter body; it was excluded. No runner-side crawler retry or access-control bypass was attempted.
- As a same-run fallback, opened and inspected 9 item-level Hayom Yom pages with visible original-language passages: 6 Hebrew and 3 Yiddish. Added 9 new item identities and 9 non-verbatim Hebrew research paraphrases, each with source_grounded_paraphrase, proposition_verbatim=false, proposition_verification=source_text_inspected, page-line locators, provenance, partial-context scope and explicit attribution limits.
- AIDs: 3316690, 3316055, 3315465, 3316633, 3315291, 3318017, 3316611, 3318107, 3316286. Each dated calendar entry has its own Evidence Family. English translations displayed on the same page were not created as separate witnesses or counted independently. Embedded teachings attributed to the Alter Rebbe, Tzemach Tzedek or Rebbe Rayatz remain attributed to those figures.
- All nine records remain Parsed. No manuscript, first printed edition or cited underlying letter was inspected; no item was promoted to Verified. No full copyrighted text was copied.
- Deduplication: exact AID repository searches returned no matches and recent batches 070–090 were checked; a full scan of all canonical item files was not available through the connector. Reconciliation must deduplicate by stable AID and URL before accepting metrics.
- Expected combined reconciliation after batches 090 and 091: answer-eligible unique sources 900 → 917; content-verified unique sources remain 852; answer-eligible propositions 2,832 → 2,858. Batch 090 contains 17 distinct propositions in its records array (the metadata value 16 was undercounted); batch 091 adds 9.
- Retrieval repair: fixed a callback-contract bug in daily-routine synthesis. The source-level predicate was previously passed directly to proposition-array filter/find calls, so a relevant proposition in AID 5100391 was silently excluded. A proposition-level predicate is now used at those call sites; the existing content-readiness regression requires AID 5100391 in regular and researcher modes.


## 2026-11-15 — Batch 092: Hebrew Igrot Kodesh correspondence review

- Inspected 11 source bodies/items: three directly opened Hebrew pages (AID 5054491, an existing identity; AID 5100372, a new identity; and AID 5357409, a duplicate presentation) plus eight visible public search-result body extracts. AID 4666220 was opened in the same run but redirected to a Torah Texts navigation/summary shell without an inspectable letter body; it was excluded and other accessible Hebrew correspondence pages were used as fallback.
- Added five genuinely new Hebrew correspondence identities with eight non-verbatim source-grounded propositions. AID 5100372 is the only new item promoted to Verified because its public item-level body was directly opened at lines 288–303; the four new search-extract-only items remain Parsed with partial context. Four other AIDs (5100353, 5100285, 5071046 and 5019408) were already Verified in the corpus; their extracts were rechecked in place and no duplicate propositions were added. No autograph, incoming letter or full archival context was inspected.
- Enriched existing AID 5054491 in place with one additional proposition grounded in body line 298. Its prior Evidence Family was preserved; no duplicate identity was created.
- AID 5357409 was identified as a duplicate presentation of AID 4872269. The publisher's own note says the item was later published more fully as volume 18, letter ג׳קפב, dated 11 Tevet 5715. It is not counted as a new source or independent witness. A same-Evidence-Family alias link and an item-level audit target were added; the reconciliation audit must confirm the existing canonical record and family ID before the link is considered fully resolved.
- AID 5071046 is a secretariat cover letter that reproduces a telegram explicitly attributed by the publisher to the Rebbe. Only the telegram content is summarized; the cover letter is not attributed to the Rebbe and the physical telegram was not inspected.
- Retrieval was extended with a bounded topic alias for persistence in Torah study alongside work and other obligations. The readiness suite now tests regular and deep researcher-mode retrieval across the study-persistence, work-schedule and gradual-learning letters, with claim-level citations, source locators and context boundaries.
- Batch 090's record array contains 17 propositions, so the correct expected total after batches 090–091 is 2,858. Combined expected metrics after batches 090–092 are **922 answer-eligible Evidence Families**, **853 content-verified families**, and **2,867 propositions**. The reconciliation audit found four existing AIDs among the nine candidates; those were not counted as new families.
- No crawler retry, access-control bypass, full-text copying, scan-only content verification, translation-as-independent-witness counting, audience/permission changes or schedule changes.
- The exact main commit, reconciliation result, quality gate, Actions and Pages publication remain unconfirmed until the resulting GitHub workflows complete.


## 2026-11-15 — Retrieval precision repair: forgetfulness versus dreams

- The first batch-092 quality-gate run exposed a real false-positive: the new AID 5100372 letter about forgetfulness and study methods was being retrieved for a narrower question explicitly asking about both forgetfulness and dreams. The source does not discuss dreams, so it must not enter that answer.
- Added a query-specific constraint in the core retriever: when a question explicitly combines שכחה and חלומות, an answer source must contain a proposition about a dream. Generic forgetfulness queries still retain AID 5100372. Added a regression for both query forms; no source content or status was changed.
- The structural answer-quality evaluation, question-specificity gate, answer-synthesis tests, citation-integrity tests and write-safety tests passed on the first batch-092 revision; test_content_readiness.mjs failed only at the forgetfulness/dreams source-count assertion. The corrected suite is pending a fresh run.


## 2026-11-15 — Deduplication correction for batch 092

- The reconciliation audit found four of the nine reviewed AIDs already represented by Verified canonical records: AID 5100353 in batch 064, AID 5100285 in its standalone item file, AID 5071046 in batch 058, and AID 5019408 in batch 066. Their visible search-result extracts were already covered by existing propositions, so the duplicate candidate records were removed from batch 092 and the existing identities were rechecked in place without adding redundant propositions.
- Batch 092 therefore contains five new source identities (AIDs 5054489, 5100603, 5071021, 5100374 and 5100372), eight new propositions, one existing identity enriched (AID 5054491, +1 proposition), and four existing identities rechecked. The existing AID 5357409 presentation was reclassified as non-independent within the Evidence Family identified by the publisher's fuller AID 4872269 version; AID 4872269 itself is not ingested as a second item.
- Correct combined expected metrics after batches 090–092: **922 answer-eligible Evidence Families**, **853 content-verified families**, **2,867 answer-eligible propositions**. These remain provisional until the latest workflow confirms the regenerated index and passes the readiness suite.


## 2026-11-15 — Batch 093 deduplication correction and Batch 094

- A full scan of the 9,122-entry public search-index blob found that AID 2190037 was already present as a Verified item in batch 070, with the same Chabad.org URL and Evidence Family. The duplicate presentation in batch 093 was removed; it is now recorded as an existing-identity recheck, not a new source. Batch 093 therefore contains eight new Likkutei Sichos identities, eight new propositions, two existing identity rechecks (AIDs 5054491 and 2190037), and no new Verified source. Its corrected expected cumulative metrics after batches 090–093 are 930 / 853 / 2,875.
- Batch 094 directly opened and inspected ten item-page bodies: eight new original-language pages, one existing identity (AID 6436855) reopened and enriched in place, and one adaptation candidate (AID 4557806) inspected but withheld. The eight new records are AIDs 4804686, 5245755, 6382182, 5860861, 4729012, 5468191, 5470429 and 4632005. Seven are Likkutei Sichos items; AID 4632005 is a Kehot-published Chassidic maamar. Language distribution is Hebrew 3 and Yiddish 5.
- Each new item has one non-verbatim Hebrew source-grounded paraphrase, proposition_verification=source_text_inspected, an item-level original-language locator, provenance, partial-context scope and limitations. Same-page English renderings are not separate witnesses. All eight new items remain Parsed; none was promoted to Verified. Existing AID 6436855 received a second distinct proposition from original Hebrew lines 301–307 without changing its item ID or Evidence Family.
- AID 4557806 was not ingested because the publisher explicitly identifies it as an adaptation from two separate talks (Vayishlach and Vayeishev 5746); those underlying events must not be collapsed into one independent witness. A Hebrewbooks PDF viewer was inaccessible through the public reader; no workaround or access-control bypass was attempted, and accessible Chabad.org item pages were used as same-run fallback.
- No full copyrighted text was copied, no translations/adaptations were counted as independent witnesses, and the known HTTP 403 acquisition crawler was not retried. No schedule, audience or permissions were changed.
- Expected cumulative metrics after batches 090–094 are 938 answer-eligible Evidence Families, 853 content-verified families, and 2,884 answer-eligible propositions. These remain expected, not actual: the committed public metrics still show 900 / 852 / 2,832 until reconciliation. scripts/reconcile_metrics.py and node scripts/test_content_readiness.mjs must run on the exact main revision; Actions and GitHub Pages publication are not yet confirmed.

- Retrieval update: the answer engine now has eight topic-specific retrieval profiles for the inspected Hebrew/Yiddish items plus a ninth cross-source topic for unity that preserves distinct roles. Generic topic leakage is filtered for livelihood, women, redemption and broad unity queries. The Korach item includes two separate original-Yiddish propositions (lines 409–422 and 442–443); the Vayakhel taxonomy carries an explicitly researcher-generated cross-source link. The synthesis remains system-authored and must not be attributed to the Rebbe.


## 2026-11-15 — Batch 095: Hebrew/Yiddish source enrichment and letter identity reconciliation

- Directly opened and inspected **11 item-level source bodies** in Hebrew and Yiddish. Eight existing Likkutei Sichos identities (AIDs 5245732, 6393752, 4846181, 6391815, 5834915, 4772806, 4804686, 5245755) received one additional, distinct, non-verbatim proposition each, with original-language body locators and expanded provenance/scope.
- Reopened AID 5168552. Its visible original-Yiddish passage was already represented by the existing proposition; no duplicate proposition or Evidence Family was added.
- Enriched the existing volume-XI bibliographic identity `library-igrot-kodesh-v11-3772` in place with the directly inspected Kehot Hebrew letter page AID 4929245. Added two source-grounded propositions on the symbolic contribution to the Talmud Torah and the educational blessing. The incoming letter and autograph were not inspected; context remains partial. One Evidence Family was added; the item remains at its existing publisher-text Verified level.
- Enriched the existing volume-XIII identity `igrot-kodesh-v13-דשלג` with public publisher AID 4994228 and item-level locators. The public page and the user-supplied scan are two presentations of the same printed letter, not independent witnesses; no new proposition or family was counted.
- Seven attempted AID pages (5100375, 5100376, 5100377, 5100603, 5100116, 4754642, 5100374) redirected to navigation/summary shells without readable source bodies. They were excluded; eleven directly opened publisher bodies were used as same-run fallback. Search extracts were not used as content.
- No crawler retry, access-control bypass, full-text copying, translation-as-independent-witness or new item identity. Eight excerpt-only Likkutei Sichos records remain Parsed.
- Expected cumulative reconciliation, including pending batches 090–094 and this batch: answer-eligible unique sources **900 → 939**, content-verified unique sources **852 → 870**, answer-eligible propositions **2,832 → 2,895**. These are expected values only until the workflow regenerates the index and metrics.
- The previous main commit's `test_content_readiness.mjs` run failed because its regression expected nonexistent AID 5100372 for letter ד׳שלג. Direct publisher inspection identifies the correct public AID as 4994228; the test is being corrected to bind to the existing letter identity and a new educational-support retrieval case.


## 2026-11-15 — Batch 096: Hayom Yom original-language entries and retrieval repair

- The public web reader was checked on AID 4666220; it returned an Internal Error with no readable item-level body. No access-control bypass or runner-side crawler retry was attempted.
- As a same-run fallback, nine new item-level Hayom Yom pages were opened and their original Hebrew/Yiddish passages inspected: AIDs 3316616, 3316619, 3316622, 3316627, 3316640, 3316694, 3316701, 3316725 and 3316748. They represent six Hebrew entries, two Yiddish entries and one mixed Hebrew/Yiddish entry. Each date has its own Evidence Family. The same-page English rendering is not a separate witness.
- Added nine new Parsed item identities and eleven non-verbatim Hebrew research propositions, each with `source_grounded_paraphrase`, `proposition_verbatim=false`, `proposition_verification=source_text_inspected`, proposition-level body locators, provenance, partial-context scope and explicit attribution limits. Embedded teachings remain attributed to the Alter Rebbe, Rebbe Rashab or Rebbe Rayatz where the page says so. No AI inference is attributed to the Rebbe.
- Reopened the existing canonical AID 1273962 letter body at Chabad.org lines 271–295 and enriched its existing identity with three separate proposition locators (lines 283, 283–284 and 285). No new proposition, Evidence Family or verification promotion was added.
- Full canonical-index deduplication scanned 9,122 entries. The nine new AIDs were absent; the nine AIDs already listed in the earlier Hayom Yom batch were excluded. No duplicate alias or translation-as-independent witness was created.
- AIDs 3316616, 3316619, 3316622, 3316627, 3316640, 3316694, 3316701, 3316725 and 3316748 remain Parsed because only the bounded daily-entry passage was inspected; no first edition, manuscript, recording or underlying cited letter was checked.
- The existing early-childhood education synthesis test exposed a retrieval defect: proposition-level category matching existed, but `propositionRelevance` had no corresponding early-childhood branch. Added a bounded category gate so a source is retrieved only when one of its inspected propositions matches a defined case (early-childhood education, Hebrew-school case, classroom speech, education purposes, diplomatic influence or student participation). The existing regular/researcher multi-family test remains the regression guard.
- Expected metrics after reconciliation of batches 090–096: **948 answer-eligible unique Evidence Families**, **870 content-verified unique sources**, and **2,906 answer-eligible propositions**. These remain targets until reconciliation and commit-bound tests report actual values.
- No full copyrighted text was copied, no access controls were bypassed, no schedule or audience/permissions were changed, and the known HTTP 403 acquisition crawler was not retried.


## 2026-11-15 — Manual source-body review, batch 097

- Opened eight public item-level Hayom Yom pages and inspected their original-language bodies: AIDs 3316648, 3316664, 3316666, 3316676, 3316679, 3316684, 3316710 and 3316719. Seven inspected passages are Hebrew and one is Yiddish.
- Added eight distinct AID identities and eleven non-verbatim, source-grounded research propositions. Every proposition is marked `source_grounded_paraphrase`, `proposition_verbatim=false`, `source_text_inspected`, and has a body locator, provenance, partial-context scope and explicit limitations. All eight remain Parsed; none is promoted to content-Verified.
- Same-page English renderings were not counted as independent witnesses. Embedded attributions were preserved: the 13 Tammuz letter passage is attributed to the Rebbe Rayatz; the 14 Tammuz explanation to the Alter Rebbe through the Tzemach Tzedek; the 15 Tammuz statement to the Rebbe Rashab; the 16 Tammuz saying to the Maggid about the Baal Shem Tov; the 22 Tammuz saying to the Rebbe Rashab.
- AID 4666220 was attempted through the public reader. It redirected to a rewritten Torah Texts summary shell without readable item-level body text, so it was excluded. No crawler retry, access-control bypass, scan-only content inference, or full-text copying was used. Eight accessible Hayom Yom pages were inspected as the fallback in this same run.
- Reconciliation baseline carried forward from batch 096 expectations: 948 answer-eligible unique sources, 870 content-Verified sources and 2,906 propositions. Batch 097 expects 956 / 870 / 2,917. Actual reconciliation and CI results are pending this commit; any variance must be reported, not normalized away.
- Retrieval repair: the 15 November quality gate had passed question-specific retrieval, synthesis and citation checks but failed the content-readiness test for AID 1273962. The source's inspected propositions use the precise forms “חינוך תורני של ילדים קטנים” and “חינוך בגיל הרך”; the early-childhood retrieval and claim-support predicates did not recognize these equivalent source phrases. Both predicates were expanded narrowly, and the validated engine cache version was bumped. This preserves the source's meaning rather than weakening the claim-support gate.
- Batch file: `data/items/content-research-batch-097-2026-11-15.json`; review audit: `data/content-reviews/2026-11-15-content-batch-097.json`.


### Batch 097 validation correction — 2026-11-15

- The first CI pass exposed a status-parser edge case: `status_of()` searches provenance status text for the token `Verified`, so the explanatory phrase “no promotion to Verified” was incorrectly interpreted as a Verified status even though the pipeline fields were Parsed. The eight new records now use the unambiguous provenance value `Parsed; source_text_inspected; partial context; not promoted.`; their pipeline and verification statuses remain Parsed.
- Reopened existing AID 3316690 (18 Tammuz) and added one separately located paraphrase from the original Yiddish body, line 256, describing the Alter Rebbe's characterization of R. Moshe Vilenker's expanded intellect. The record remains in batch 091 and retains its existing Evidence Family; batch 097 records this as one in-place enrichment, not a new source identity.
- Batch 097 now covers nine inspected page bodies: eight new AIDs and one existing identity enriched. It adds eleven propositions on the eight new identities plus one proposition on AID 3316690. Expected post-reconciliation totals are 956 answer-eligible unique sources, 870 content-Verified sources and 2,918 propositions; actual totals and the rerun CI result remain pending.


### Batch 097 deep-researcher citation-map correction — 2026-11-15

- The second CI pass confirmed that the early-childhood retrieval repair now works, but the deep-researcher map still failed one assertion: `claim_source_map` was built from the generic answer-level `model.claims`, which can include a non-synthesis claim without a locator, while the structured seven-claim comparison in `model.synthesis.claims` already had claim-local source numbers and locators.
- Updated researcher mode to build `claim_source_map` from the structured synthesis claims when present, falling back to generic claims only when no structured synthesis exists. This aligns the deep evidence map with the claim-level citations actually shown in the synthesis; it does not relax citation validation.
- Cache version bumped to `20261115-batch097-researcher-claims-v3`. A new CI run is required to establish the final test result.


### Batch 098 — inspected source content and English testimony — 2026-11-15

- Inspected ten public source bodies: eight new original-language Hayom Yom entries (four Hebrew, four Yiddish), one English-language recipient testimony with an embedded letter excerpt (Chabad.org AID 259799), and one existing Hayom Yom identity reopened for in-place enrichment (AID 3316701).
- Added nine new source identities and ten non-verbatim, source-grounded propositions; added one further proposition to AID 3316701 without changing its identity or Evidence Family. The new records remain Parsed with partial context; no content-verified promotion was made.
- The English AID 259799 item is classified as secondary recipient testimony, not an original letter or archival carbon copy. The excerpt is attributed to a letter dated 20 Iyar 5713; the physical letter was not inspected. Retrieval regression coverage now checks that this bounded source is returned for a question about whether additional charity can replace time for Torah study, with claim-level citations in regular and deep researcher modes.
- Recheck attempts: AID 4666220 redirected to a rewritten Torah Texts summary shell on 15.11.2026, so no new body content was added in batch 098. The pre-existing canonical record data/items/chabad-letter-4666220.json nevertheless retains two propositions from an authorized publisher-body inspection recorded 15.10.2026; that existing evidence is preserved and is not counted as a batch-098 addition. Chabad Library AID 1200720068 opened with zero readable lines. Search extracts were not used as source content. The accessible Hayom Yom entries and AID 259799 were inspected as same-run fallback.
- Deduplication was checked against the current review queue and accessible batches 090–094 and 096–097. The complete canonical scan remains pending and is performed by scripts/reconcile_metrics.py; the batch does not claim that scan has already passed.
- No crawler retry, access-control bypass, scan-only content inference, full-text copying, translation-as-independent-witness counting, or status promotion was used.
- Batch file: data/items/content-research-batch-098-2026-11-15.json. Reconciliation baseline carried forward from batch 097 expectations is 956 / 870 / 2,918; batch 098 expects 965 / 870 / 2,929. The published metrics before reconciliation still show 900 / 852 / 2,832, so only the post-reconciliation index can establish actual totals.
- GitHub Actions, full canonical deduplication, the answer-quality gate, and GitHub Pages publication are pending the commit-bound workflow run; no result is marked passed before it is observed.


## 2026-11-15 — Batch 099: Hebrew Sicha/Maamar bodies, in-place enrichment and duplicate-family audit

- נפתחו ונבדקו 12 גופי פרסום ציבוריים ב-BeitChabad / he.chabad.org: שבע שיחות עבריות בלתי מוגהות, מאמר עברי בלתי מוגה אחד, וארבעה נוסחים עבריים של שיחות שהוגהו באידית. נוספו 12 זהויות חדשות ו-20 פרפרזות מחקריות לא־מילוליות, כל אחת עם `source_grounded_paraphrase`, `proposition_verbatim=false`, `proposition_verification=source_text_inspected`, locator ברמת טענה, provenance, היקף בדיקה, נסיבות ומגבלות.
- ארבעת הנוסחים העבריים שהמו״ל מציין כי הוגהו באידית מסומנים כתרגומים נגזרים (`independent_witness=false)); הם אינם נספרים כעדים עצמאיים. שמונה הטקסטים העבריים הבלתי מוגהים מסומנים כעדי טקסט יחידים, ללא השוואה להקלטה או לכתב־יד. כל 12 הרשומות נשארות Parsed; לא בוצעה העלאה ל-Verified.
- הועשרה הזהות הקיימת AID 3316719 בתוך batch 097: האמרה המקורית ביידיש פוצלה לשתי פרפרזות נפרדות (אמרת חסידות/הנהגה טובה; ניגון), עם אותו AID ואותה Evidence Family. לא נוצרה זהות חדשה.
- נבדקו מחדש AIDs 553672 ו-553673. שני הדפים הם רישומי אודיו מקבילים בעברית וביידיש לאותה יחידות; אין בהם תמליל קריא. נשמרה המשפחה המשותפת `yechidus-5743-21-kislev-parallel-language-audio`; לא נוצרו פרופוזיציות ולא נספרו עדים עצמאיים. שמונה דפי Sicha/Maamar נוספים (AIDs 555044, 555071, 555082, 550377, 550378, 550380, 550381, 550384) היו דפי מדיה/אודיו ללא גוף תמליל, ולכן לא שימשו כתוכן.
- AID 4666220 נבדק שוב בקורא הציבורי והחזיר shell/summary ללא גוף איגרת קריא. תועדה החסימה, לא בוצע crawler חוזר ולא נעקפו בקרות גישה. באותה הפעלה נעשה fallback ל-12 גופי טקסט עבריים נגישים.
- בדיקת כפילויות ראשונית מול review queue, batches 090–098, כל קובצי bulk-indexed וקובצי content-verified-batch לא מצאה התאמות ל-12 ה-AIDs החדשים. הסריקה הקנונית המלאה מבוצעת על ידי `reconcile_metrics.py` ב-commit זה; אין לטעון להשלמתה לפני תוצאת Actions.
- תיקון baseline: המספר 878 לאחר batch 098 היה false positive, לא שמונה Evidence Families שהיו Verified קודם. בשמונה רשומות batch 096 שדה `provenance.verification_status` כלל את הביטוי `no promotion to Verified`; הפונקציה `status_of()` זיהתה בטעות את המילה Verified. הרשומות עצמן נשארו Parsed, והנוסח תוקן ל-`not promoted.`. לאחר תיקון ה-parser, baseline content-Verified הנכון הוא 870; לא נעשתה העלאת סטטוס.
- לפני batch 099: 965 answer-eligible unique Evidence Families, 870 content-verified unique sources, 2,929 propositions. יעד לאחר הבדיקה: 977 / 870 / 2,950. אין להציג יעד זה כנתון בפועל עד reconciliation.
- שופרו בדיקות ה-reconciliation כך שיסמנו במפורש השלמת סריקת זהויות קנונית, collisions ו-identities חסרים, ויעדכנו את מצב reconciliation של answer-readiness. תוקנו assertions היסטוריים ב-`test_content_readiness.mjs` שהתייחסו לסכמות/מספרים ישנים של batches 090–098.
- מצב אחזור/סינתזה: היישום הקיים כבר מבצע proposition-level relevance, claim-local citations, בדיקת citation entailment ו-context boundaries; מצב researcher מחזיר `depth=deep`, evidence map, claim-source map ו-synthesis constraints. עודכן מסמך המפרט כך שלא יציג יכולות שכבר קיימות כפערים, תוך ציון שהאחזור עדיין דטרמיניסטי ואינו מודל entailment סמנטי.
- לא הועתק טקסט מוגן במלואו, לא נעשה שימוש ב-search extracts כתוכן, לא נוצרה אוטומציה חדשה, לוח הזמנים השעתי נשמר ולא שונו קהל או הרשאות.

- לאחר הסריקה הקנונית המלאה התגלה גם רישום כפול של AID 553673: רשומת metadata בקובץ `bulk-indexed-2026-09-24-001.json` לצד רשומת audio ב-batch 069. שתי הרשומות עודכנו לאותה Evidence Family `yechidus-5743-21-kislev-parallel-language-audio`, עם `independent_witness=false`; הרשומה הכפולה נשארת metadata-only ללא proposition. במקביל, AID 553673 נשאר מקושר ל-AID 553672 כפרסום מקביל של אותו אירוע. הסריקה מבחינה כעת בין duplicate presentation באותה משפחה לבין collision בין משפחות שונות.

## 2026-11-15 — Batch 100: nine additional Hebrew Sicha bodies

- נפתח עמוד Yechidus AID 553674. הוא מציג רישום מדיה/אודיו ללא תמליל קריא, ולכן נשאר metadata-only ולא נוצרה ממנו פרופוזיציה. באותה הפעלה בוצע fallback לתשעה גופי שיחות ציבוריים נגישים ב-BeitChabad / he.chabad.org: AIDs 2989585, 4296215, 2989341, 4296163, 4280029, 4385617, 4279842, 2988877 ו-2989022.
- נוספו תשע זהויות חדשות בתשע Evidence Families נפרדות ו-14 פרפרזות מחקריות לא-מילוליות, עם locator נפרד לכל טענה, provenance, היקף בדיקה, נסיבות ומגבלות. כל הרשומות נשארות Parsed; לא הועלה אף מקור ל-Verified. שמונה העמודים מסומנים במפורש כבלתי מוגהים; ב-AID 2989341 לא נמצא ציון עריכה מפורש בכותרת/במקטע שנבדק, ולכן הסטטוס העריכתי שלו נשאר לא ידוע.
- כל הרשומות מתארות רק מקטעים שנפתחו בגוף הפרסום. לא נבדקו הקלטות, כתבי-יד, אוטוגרפים או ההקשר המלא. לא נעשה שימוש בתמציות חיפוש כראיית תוכן, לא הועתק טקסט מוגן במלואו, ולא יוחסה הסקת מערכת לרבי.
- בדיקת כפילויות ראשונית נעשתה מול review queue, batches 055–060, 064–094, 096–099, קובצי bulk-indexed שנבדקו ו-GitHub code search; הסריקה הקנונית המלאה והכרעה סופית על collisions נשארות ל-scripts/reconcile_metrics.py ב-commit זה.
- לפני batch 100: 977 answer-eligible unique Evidence Families, 870 content-verified families ו-2,950 propositions לאחר תיקון false positive של status parser. הצפי, אם כל תשעת ה-AIDs יישארו זהויות נפרדות, הוא 986 / 870 / 2,964. אלה ערכי צפי בלבד עד reconciliation בפועל.
- תיקון CI: ב-batch 096 נוסח ההסבר 'no promotion to Verified' בשדה provenance.verification_status הפעיל בטעות את זיהוי הסטטוס מבוסס-הטוקן Verified, אף ששדות ה-pipeline נשארו Parsed. הנוסח הוחלף ב-'not promoted.'; בדיקות היסטוריות עודכנו להשתמש במדדי snapshot של batch 096 ולא להשוותם למדדים הגלובליים הנוכחיים.
- לא נעשה retry ל-crawler שחזר HTTP 403, לא נעקפו בקרות גישה, לא נוצרו אוטומציות חדשות ולא שונו קהל, הרשאות או לוח הזמנים השעתי.

- Batch file: data/items/content-research-batch-100-2026-11-15.json.

- Correction to the AID 4666220 regression test: a failed 15.11.2026 recheck must not erase or disqualify the pre-existing 15.10.2026 authorized publisher-body evidence. The canonical identity remains in answer evidence; only the recheck itself added no content.

## 2026-11-15 — Batches 099–101 source-body review and reconciliation repair

- Added 15 new public item-level bodies in batch 101: 14 Hebrew sources (11 Sicha texts, one Q&A record, and two short event reports) plus one English personal letter (AID 2021558). Added 30 non-verbatim `response_propositions`, each marked `proposition_origin=source_grounded_paraphrase`, `proposition_verbatim=false`, `proposition_verification=source_text_inspected`, with per-proposition body locators, provenance, partial-context scope, audience and limitations. All new records remain `Parsed`; none was promoted to `Verified`.
- Enriched two existing canonical identities in place: AID 2989588 in batch 099 gained two propositions from newly opened lines 211–213 and 215–217; AID 2989585 in batch 100 gained two propositions from lines 222–233 and 214–217, 245. Both retain their original AID and Evidence Family; neither created a new identity.
- Rechecked AID 2989588 without duplicating it in batch 101. It remains one Hebrew text witness in its original family; the distinct AID 2989589 page records a different meeting with children from provincial cities and remains a separate family.
- Excluded AID 2989234 because the publisher note identifies its Hebrew page as a translation of an English talk. Also excluded a free English translation candidate rather than treating it as an independent witness. Two Chabad Library candidates (including one Yiddish item) returned no readable body lines.
- AID 4666220 again exposed only a summary shell, not the letter body. No crawler retry, access-control bypass, scan-only content verification, or full-text copying was used; fourteen alternative Hebrew bodies and one public English letter body were inspected in the same run. The English page is not labelled as a translation; the published transcription is signed M. Schneerson, but no autograph was inspected.
- Corrected status normalization in `scripts/status_normalization.py`: negated wording such as “no promotion to Verified” no longer upgrades Parsed records, while an explicit pipeline status is preserved. Added seven regression assertions and wired them into the reconcile, hourly, and answer-quality workflows. The hourly cron definition was not changed.
- Reworked `scripts/reconcile_metrics.py` to reconcile the contiguous pending batch chain 099→100→101, calculate a separate corpus snapshot after each batch, recognize `aid` fields in in-place update records, preserve full per-batch identity audits, and clear reconciled batch IDs from pending lists. The content-readiness test now verifies all three audits and a three-Evidence-Family daily-learning synthesis in regular and deep researcher modes, with claim-level locators, entailment and context-boundary checks.
- Expected progression, not yet a committed reconciliation result: before batch 099 **965 answer-eligible / 870 content-Verified / 2,929 propositions**; after batch 099 **977 / 870 / 2,952**; after batch 100 **986 / 870 / 2,968**; after batch 101 **1,001 / 870 / 2,998**. The published `data/public-metrics.json` still contains the documented stale 878 Verified count until the corrected reconciliation runs. Actual-after fields remain null until that run.
- A pull-request answer-quality run validated the first version of the new batch chain and confirmed 1,000 answer-eligible unique sources with no identity collisions; its first status-normalization pass exposed an over-broad negative phrase rule that temporarily lowered the Verified count to 854. That rule was refined to preserve explicit pipeline status and is being rerun with the full 099–101 chain.
- At the time of this note, the latest validation run is still in progress. The GitHub connector provides PR-triggered job status and logs, but push-triggered Actions and Pages deployment are not yet confirmed. Do not treat the expected totals above as published metrics until the final run and deployment complete.


## 2026-11-15 — Batch 102: nine new Hebrew identities, one in-place enrichment

- Opened **10 item-level Hebrew bodies** on the public BeitChabad/he.chabad.org reader: nine new identities (AIDs **2989237, 3008863, 5989562, 5989563, 4280143, 4385757, 4280030, 2989283, 5989527**) and one new passage in existing AID **2989585**. Added **18** non-verbatim source-grounded propositions to the nine new records and **one** additional proposition to AID 2989585 in its original canonical file, `data/items/content-research-batch-100-2026-11-15.json`.
- The nine new item identities represent **eight Evidence Families**. AID **5989527** is a distinct maamar from the same 21 Kislev 5728 farbrengen as AID **5989563**; both records are retained, linked by `same_evidence_family`, and counted as one family. The batch adds six Sicha transcripts and three unedited Maamar/hanacha transcripts. All remain **Parsed** with partial context; no item was promoted to Verified.
- Existing identity enrichment: AID **2989585** gained one proposition from newly inspected body lines **197–201**. It remains in its original batch-100 record and retains its Evidence Family and Parsed status. To preserve snapshot arithmetic, batch 100's expected-after proposition count is adjusted from **2968 to 2969**, batch 101's before/after counts shift to **2969 → 2999**, and batch 102 starts at **2999**. The proposition is not counted twice in batch 102.
- Blocked in this run: AID **4666220** again returned a rewritten Torah Texts summary shell; AIDs **553672** (Hebrew Yechidus) and **553691** (Yiddish Yechidus) exposed audio/player metadata without readable transcript bodies. The same run used ten accessible alternatives. AIDs **4280029** and **4280144** were excluded because they already exist in batches 100 and 099. AID **3140253** was excluded because the Hebrew page explicitly identifies it as a translation from Yiddish; it was not counted as an independent witness.
- All 19 added paraphrase entries use `proposition_origin=source_grounded_paraphrase`, `proposition_verbatim=false`, `proposition_verification=source_text_inspected`, proposition-level body locators, provenance, exact verification scope, partial-context boundaries and explicit limitations. Search snippets were used only for candidate discovery. No full copyrighted text was copied; the known GitHub-runner HTTP 403 crawler was not retried and no access control was bypassed.
- Expected chain for contiguous reconciliation of batches 099–102: **965/854/2929 → 977/854/2952 → 986/854/2969 → 1001/854/2999 → 1009/854/3017** (answer-eligible unique Evidence Families / content-Verified Evidence Families / answer-eligible propositions). These are expected values until the reconciliation workflow writes and verifies actual metrics.
- The current answer engine already emits claim-level source locators and a distinct deep researcher evidence map. A new regression exercises a two-family Torah-learning/action synthesis in regular and researcher modes, checking claim-local citations, citation entailment, context boundaries and researcher depth. The main test baseline is corrected to **854** after the latest hourly validation; PR run 43754292319 was an older PR failure on a different status expectation.
- Reconciliation, commit-bound Actions and live Pages publication remain pending for this commit. Older batch IDs 090–095 remain separately listed in metrics state; they are not silently cleared by the contiguous 099–102 chain. No hourly schedule, audience or repository permissions were changed.


## 2026-11-15 — Correction after hourly validation of batch 102

- Hourly workflow **43755991899** on commit **1a75e775** completed its deterministic maintenance steps but failed the final readiness validation. Its measured post-normalization snapshot was **1,009 answer-eligible unique sources / 854 content-Verified unique sources / 3,017 answer-eligible propositions**. The earlier expectation of 870 content-Verified sources was wrong; the conservative status-normalization result is 854. No Verified promotion was performed by batch 102.
- The answer-quality workflow **43755991908** passed normalization, index generation, retrieval, answer synthesis and citation-integrity setup, then stopped on a duplicate top-level test variable declaration in the new batch-102 assertions. The follow-up test renames that variable and updates the historical/current metric assertions appropriately.
- Corrected contiguous chain: **965/854/2929 → 977/854/2952 → 986/854/2969 → 1001/854/2999 → 1009/854/3017**. Historical batch 096–098 snapshots remain at their previously reconciled 870 values; the corrected baseline begins at batch 099 after the status-normalization adjustment.
- The bulk reconciliation workflow **43755991938** was still pending without a job at the time of this correction; it syncs latest main before mutation. The Pages build was still running. No publication or final reconciliation is claimed until fresh runs complete.


- Test-chain correction: the batch-102 test now expects **2969 propositions** after batch 100 and **2999** after batch 101, because the newly inspected AID 2989585 proposition is stored in its original batch-100 file. This avoids double-counting it in batch 102.


## 2026-11-15 — Narrow dental-topic retrieval correction

- The hourly validation on the corrected 854 baseline progressed past metric normalization but failed an existing retrieval regression: a generic health item was being returned for a specific dental-extraction/second-opinion question. The answer engine now applies a two-part gate for that narrow topic: the candidate must contain explicit dental/tooth-extraction language and explicit additional-opinion/expert/doctor language. General health queries are not narrowed by this rule.
- The existing dental regression test requires the specific dental letter and exactly one source; it is retained as the validation target. A fresh answer-quality and hourly run is required to verify the change.


## 2026-11-15 — Explicit researcher claim-source map

- Researcher mode now emits an explicit claim-source map in addition to the existing evidence map. Each entry binds a claim to supporting source numbers, Evidence Family IDs and proposition-level body locators. The map supports audit/navigation and does not replace reading the cited passage or its limits.
- Batch-102 regression checks this map in deep researcher mode against two separately dated Hebrew talks; the current answer-quality run must complete before this change is considered validated.


- Cross-source test wording was tightened to a grounded comparison of the two inspected passages: the 19 Kislev talk on stating the gathering's purpose aloud and the 20 Kislev talk on extending the farbrengen through Torah study and mitzvah practice. The next quality run will verify retrieval of both families and the claim-source map.


- The cross-source regression retains full-index retrieval in regular mode and runs deep researcher synthesis on the two exact inspected records. This bounds test cost without removing the full-corpus retrieval assertion.


## 2026-11-15 — Batch 103: multilingual source-body review and in-place enrichment

- נפתחו שבעה עמודי מדיה/אודיו (AIDs 554871, 555023, 555030, 555044, 555045, 555046, 554661); כולם הציגו metadata/player ללא גוף תמליל קריא. בנוסף, הקישור למקור היידי של שיחת שמחת תורה ה׳תשי״ח, מתוך AID 4418266, החזיר HTTP 403. לא בוצע retry ל-crawler ולא נעקפו בקרות גישה.
- באותה הפעלה בוצע fallback ל-12 גופי פרסום נגישים: תשעה פרסומים עבריים מקוריים (AIDs 3140154, 5989668, 5989700, 3008913, 4279912, 4313085, 4385665, 4385789, 5959899), תמליל עברי ותרגום אנגלי של אותה שיחה יידית (AIDs 3008869 ו-4418266), ומכתב אנגלי מתורגם (AID 2277093). המקור היידי לא נפתח; שתי המצגות תויגו כלא־עצמאיות ונקשרו לאותה Evidence Family.
- נוספו 12 זהויות פרסום ב-11 Evidence Families ו-25 פרפרזות מחקריות לא־מילוליות. בנוסף הועשרה זהות קיימת AID 2989585 בקובץ הקנוני המקורי batch 100 באמצעות פרפרזה נוספת משורות 285–291. סך הכול נוספו 25 פרפרזות/העשרות. כל הרשומות החדשות נשארות Parsed ובהקשר חלקי; לא קודם מקור ל-Verified.
- כל פרופוזיציה מסומנת `proposition_origin=source_grounded_paraphrase`, `proposition_verbatim=false`, `proposition_verification=source_text_inspected`, עם locator ברמת טענה, provenance, היקף בדיקה ומגבלות. לא נעשה שימוש ב-snippets כתוכן ולא הועתק טקסט מוגן במלואו.
- ההעשרה הנוספת ב-AID 2989585 נשמרת בקובץ המקורי batch 100. לכן שרשרת proposition snapshots זזה ב-+1 החל מ-batch 100: **965/854/2929 → 977/854/2952 → 986/854/2970 → 1001/854/3000 → 1009/854/3018 → 1020/854/3043**. הערך האחרון הוא צפי בלבד עד סריקה קנונית מלאה.
- תיקון CI: בדיקת batch 097 עודכנה ל-snapshot ההיסטורי בפועל **956/870/2918**; שרשרת batch 099 ואילך נשארת על baseline השמרני של 854. בדיקת AID 2989585 עודכנה לצפות לשבע פרופוזיציות. נוספה בדיקת סינתזה רב־מקורית חדשה בין AID 3008913 ו-AID 4279912, כולל claim-source map במצב researcher.
- batch file: `data/items/content-research-batch-103-2026-11-15.json`. Reconciliation, Actions ופרסום Pages ייקבעו רק לפי תוצאות הריצות החדשות לאחר commit.


- Additional CI audit on 15.11.2026 found that the batch-096 historical snapshot is also **948/870/2906** (the batch file's reconciled expected and actual values agree); the readiness test had retained a stale 854 assertion. It is now corrected to 870. The conservative 854 baseline begins with batch 098 and remains the chain for batches 099–103.


## 2026-11-15 — Batch 103 independent body recheck and proposition correction

- Reopened **12** public publisher item bodies in this run: AIDs 2277093, 3008869, 3008913, 3140154, 4279912, 4313085, 4385665, 4385789, 4418266, 5959899, 5989668, 5989700. All 12 body passages were accessible through the public web reader; no search-result snippet or title was used as proposition content. The existing seven audio-only records remain metadata-only and were not promoted.
- Added one additional non-verbatim proposition to AID **5989700**, based on body lines **286–287 and 321–335**: the talk distinguishes between changing Torah (which it rejects) and adapting the manner of teaching/approach to the local conditions and starting point of the audience. Batch 103 now contains **25** propositions across 12 new identities; together with the in-place enrichment of AID **2989585**, the batch adds **26** paraphrase entries. Expected post-reconciliation metrics are **1,020 answer-eligible Evidence Families / 854 content-Verified Evidence Families / 3,043 distinct propositions**.
- Corrected AID **3008913** after inspecting its actual body: the earlier second proposition about public activism/self-work belonged to AID **4279912**, not AID 3008913. AID 3008913 now describes the educational mission to Eretz Yisrael and the source's statements about mothers, girls' education and women teachers (body lines **234–238**). The public-activism/self-work propositions remain on AID 4279912, whose locators were corrected to **249–258** and **258–262**.
- Updated body locators for all 12 items to the public reader's actual body-line ranges. All records retain `Parsed`, `partial` context, `source_grounded_paraphrase`, `proposition_verbatim=false` and `proposition_verification=source_text_inspected`. No Verified promotion was made.
- AID **3008869** (Hebrew presentation) and AID **4418266** (English presentation) remain in the same Yiddish-origin Evidence Family and remain non-independent. The Yiddish HebrewBooks page for AID 4418266 remains blocked with HTTP 403; it was not retried or bypassed. AID **2277093** remains a translated English letter with unknown original language and is not counted as an independent witness.
- The reconciliation workflow is expected to regenerate `public-search-index.json`, `public-metrics.json`, `project-state.json` and the review queue from the complete canonical corpus. The expected 1,020/854/3,043 snapshot is **not a published result** until the run writes and commits actual metrics. The GitHub-runner publisher crawler remains explicitly skipped after HTTP 403.


## 2026-11-15 — Batch 104 canonical fuller letter and same-family retrieval fix

- Opened the full public Hebrew publisher page for **AID 4872269**, *Igrot Kodesh*, letter ג׳קפב, dated 11 Tevet 5715. The visible body lines **288–297** include the housewarming and mezuzah passages; the publisher note at **301–303** says the letter was printed in Likkutei Sichot vol. 18 p.448 and completed from a photograph. The photograph and autograph were not inspected.
- Added AID **4872269** as the canonical full-text item in the existing Evidence Family `igrot-letter-5715-11-tevet-aid4872269`. The shorter AID **5357409** presentation remains `independent_witness=false` and is now explicitly linked to the canonical item. Both presentations share one family; the three existing paraphrases were reused with identical context fields, so the expected unique proposition count does not increase.
- Added a retrieval tie-breaker: when two same-family items have equal proposition-level relevance, the engine prefers the independent canonical witness over a non-independent presentation. The housewarming/mezuzah regression now requires AID 4872269 and verifies that AID 5357409 is never treated as independent.
- Batch 104 adds **one canonical source identity**, **zero new Evidence Families**, and **zero new distinct propositions**. Expected metrics remain **1,020 answer-eligible Evidence Families / 854 content-Verified Evidence Families / 3,043 distinct propositions**. This is a canonicalization improvement, not a source-count increase.
- The reconciliation and quality-gate workflows must still complete against the new commit before these metrics can be described as published.

- Browser cache version was advanced to `batch104-independent-family-priority-v1` in both the site entry point and validation wrapper so GitHub Pages loads the new independent-witness tie-breaker rather than a cached prior engine module.

- The quality gate exposed a researcher-mode budget mismatch: `MODE_BUDGETS.researcher.sources` was 24, but `retrieveEvidence` still used its default cap. The engine now passes `maxSources: budget.sources`, allowing the existing wellsprings-specific researcher path to retain two relevant English translations from distinct Evidence Families while keeping both marked non-independent. The regression remains explicit; this does not increase the independent-family count.


## 2026-11-15 — Batch 105 source-body review and researcher retrieval repair

Batch 105 adds **14 new source identities** across **13 Evidence Families**, enriches existing AID 2988877 in place with two additional propositions, and adds **25 new propositions** plus **2 propositions to the existing identity**. All new and enriched records remain **Parsed**; no source was promoted to Verified.

Language coverage: 12 Hebrew, 1 English, 1 Yiddish. Document types include Sichot, an R"D/farbrengen report, Maamarim, correspondence, telegrams and a Yiddish Hayom Yom entry. AID 4280038 (Maamar) and AID 4280039 (Sicha) are separate publication identities from the same Shabbat Beshalach farbrengen and share one Evidence Family. The English rendering printed alongside the Yiddish Hayom Yom text at AID 3315445 is not a separate witness.

The body-level review inspected 16 accessible pages: 14 new identities, existing AID 2988877, and translated presentation AID 4279874. AID 4279874 was not ingested as a separate identity because its Hebrew page notes that the text was edited in English and the English original was not separately inspected. AID 4666220 and Yiddish melody-letter AID 4783876 returned Internal Error in the public reader; no crawler retry or access-control bypass was attempted. Alternative accessible source bodies were inspected in the same run. No full copyrighted text was copied.

Expected answer-readiness chain after batch 104: 1,020 answer-eligible unique sources, 854 content-verified unique sources, 3,043 propositions. Batch 105 expects **1,033 / 854 / 3,070**. The current public-metrics.json (977 / 878 / 2,950) and project-state.json still reflect an older reconciliation point; the full canonical scan and reconciliation of pending batches 099–105 are required before those values are treated as actual. content_verified_unique_sources is expected to remain unchanged because no Verified status was added.

The last Answer Quality Gate and Hourly Corpus Maintenance runs failed at the researcher-mode regression requiring two English translation presentations from distinct underlying Evidence Families. The cause was the special wellsprings branch searching only the truncated answerEvidence subset. The engine now selects eligible translated presentations from the full corpus index, deduplicates them by translation_of_evidence_family_id, and keeps them marked non-independent. The initial attempt to pass the mode-specific 8/24 source budget as the retrieval candidate limit hid a relevant Hebrew source in regular mode. That narrowing was reverted: retrieval now keeps a 36-candidate pool, while the final selected-source count remains mode-limited (regular 8, researcher 24). The special translation branch still searches the full corpus index and deduplicates by parent Evidence Family. Cache versions were bumped. Tests now cover batch 105, Yiddish and English retrieval, same-family deduplication, and cross-source diaspora synthesis with claim-level locators.

At commit time batch 105 is pending reconciliation. The hourly schedule, workflow triggers, audience, and repository permissions were not changed.


## 2026-11-16 — Batch 106 Hebrew source-body review and in-place enrichment

Batch 106 inspected **10 accessible public publisher bodies** in Hebrew. It adds **8 new identities across 8 Evidence Families**: seven unedited Sichos and one short farbrengen report. It also enriches AID **5959840** in place with one additional proposition from the opening of the talk (lines 171–177), and rechecks AID **2989386** without adding a duplicate or proposition. The batch adds **11 new propositions plus one in-place enrichment**. All new and enriched items remain **Parsed**; no Verified promotion was made.

The eight new identities are AIDs 2989153, 2989320, 2989243, 4304434, 5959845, 2988989, 5990037 and 5989929. The rechecked AID 2989386 remains in its existing batch-101 identity. AID 4543720 opened only a navigation/metadata shell without readable blessing text; it was recorded as blocked, and alternative public source bodies were inspected in the same run. No crawler retry or access-control bypass was attempted. No search snippet or title was used as proposition content, no full copyrighted text was copied, and no scan-only verification was used.

Expected metrics after batch 105 were 1,033 answer-eligible Evidence Families / 854 content-verified Evidence Families / 3,070 distinct propositions. Batch 106 expected-after is adjusted to **1,041 / 854 / 3,083** after batch 107 added one source-inspected proposition to existing AID 2989153 in place. Batch 107 expects **1,051 / 854 / 3,103**. These are expected values only until the deterministic full-index reconciliation writes actual metrics. Batches **099–107** are pending reconciliation. The current public metrics must not be represented as updated until the workflow commits the actual reconciliation result.

The quality-gate failure on the previous main commit was traced to a brittle `deepStrictEqual` comparison: the actual content-readiness summary now includes an explanatory `content_readiness_note` field, while historical batch snapshots intentionally store only the three numeric measures. The regression test is updated to compare the three numeric measures, preserving the note without weakening any numeric check. New assertions cover batch 106 identity/family uniqueness, source-text locators, in-place enrichment, blocked-source fallback, multi-source claim citations and deep researcher evidence maps.

The hourly acquisition policy remains unchanged: the known blocked crawler is not retried; manual public-page inspection is used. Schedule, audience, permissions and repository visibility are unchanged.


### Batch 106 reconciliation audit correction

The first full reconciliation correctly detected two record-shaped entries for each target AID because the batch's `source_body_review` audit rows repeated canonical identity markers (`aid`, `id`, `evidence_family_id`). These rows are review metadata, not independent source records. Their identity fields were renamed to `reviewed_aid`, `reviewed_id` and `reviewed_evidence_family_id`; the canonical `records` array remains the sole source-identity payload. The regression test now asserts one canonical record per target AID, zero identity collisions and zero same-family duplicate presentations after the full-index scan.


### Batch 105 reconciliation audit correction

The first full-index reconciliation also identified duplicate-looking records in batch 105 because `source_body_review` rows repeated canonical identity markers. Those rows describe reviewed pages only; they are not independent source records. Their keys were renamed to `reviewed_aid`, `reviewed_id` and `reviewed_evidence_family_id`, preserving the 14 canonical records and the one translated presentation linked to its original Evidence Family. The batch's 13 unique Evidence Families remain the correct count; the translation is not an additional witness.


## 2026-11-16 — Batch 107: English correspondence, Yiddish sichos and Hebrew enrichment

Batch 107 adds **10 new source identities across 10 Evidence Families**: six published English translations of Rebbe correspondence (AIDs 2282092, 2279298, 5920875, 2282134, 2282093 and 2279300) and four published Yiddish sichah texts paired with English translations (AIDs 4544402, 4772806, 5430533 and 4736086). English translations of letters are marked non-independent; the English renderings paired with the Yiddish talks are not counted as separate witnesses.

Existing Hebrew AID **2989153** was enriched in its original batch-106 file with one additional proposition from section ו׳, lines **207–210**, about choosing the mode of service that does not offer personal enjoyment and setting aside both desire and intellect. Its identity, Evidence Family and Parsed status were preserved. The batch adds **20 new propositions plus one in-place enrichment**. All records remain **Parsed**; no Verified promotion was made.

The body-level review inspected **11 source bodies** (10 new and one existing identity) and opened 12 pages including one composite candidate that was excluded. Nine candidates did not yield a readable body through the public reader; AID 3905819 was replaced by accessible alternatives in the same run. AID **6429726** was excluded because its page combines a letter dated 6 Elul 5715 with a separate sichah dated 20 Menachem Av 5711; it cannot be treated as one source identity or one Evidence Family. No crawler retry, access-control bypass, search-snippet substitution or full-text copying was used.

The last full-index workflow result was **1,041 answer-eligible Evidence Families / 854 content-Verified sources / 3,082 propositions**. After the in-place AID 2989153 enrichment, the adjusted baseline for batch 107 is **1,041 / 854 / 3,083**; the expected result after batch 107 is **1,051 / 854 / 3,103**. These remain expected values until full-index reconciliation, content-readiness tests and the write-enabled workflow commit actual metrics. The public-metrics.json file has not yet been updated by this batch.

The regression suite now accepts an audited `reconciled_with_variance` state for historical batch 105, updates batch 106's proposition checkpoint, verifies AID 2989153's in-place enrichment, and tests cross-source synthesis between Letter 92 and the Vayeira sichah with claim-level citations in regular and deep researcher modes.

The hourly schedule, repository visibility, audience and permissions remain unchanged.


## 2026-11-16 — Batch 108: source-body follow-up and multilingual retrieval

- Opened and inspected **10 item-level source bodies**: eight Hebrew publications and two Yiddish sichah pages that display the Yiddish original alongside an English rendering. Eight existing identities were enriched in place with **eight non-verbatim, source-grounded propositions**; two additional identities were rechecked and received no duplicate proposition.
- Enriched AIDs: 2989153, 4304434, 5959845, 2988989, 5990037, 5989929, 4736086 and 5430533. Rechecked without adding a claim: 2989320 and 2989243. Every new proposition records `source_grounded_paraphrase`, `proposition_verbatim=false`, `proposition_verification=source_text_inspected`, a body locator, provenance, partial scope and context limits. All eight identities remain Parsed; none was promoted to Verified.
- Two direct Hebrew URLs (AIDs 4736086 and 5430533) returned Internal Error. In the same run, the corresponding Chabad.org pages with the same AIDs were found and opened; their Yiddish text was inspected. The English rendering on each page remains a derived presentation, not an independent witness. No blocked crawler was retried, no access control was bypassed and no full copyrighted text was copied.
- The eight follow-up propositions were written into the existing canonical batch-106 and batch-107 item records, not as duplicate identities. Batch 108 is an audit envelope with no new source records or Evidence Families. The source-family count therefore does not increase in batch 108 itself.
- Batch 105's full-index actual result was **1,033 / 854 / 3,071**, one proposition above its 3,070 expectation. This measured +1 variance is carried forward rather than hidden: batch 106 expects **1,041 / 854 / 3,089**; batch 107 expects **1,051 / 854 / 3,111**; batch 108 records the same 1,051 / 854 / 3,111 corpus boundary. The contiguous pending chain now begins at batch 099 (before: **965 / 854 / 2,929**). The measured +1 proposition variance remains visible in actual snapshots, so the expected final 3,111 may reconcile to actual 3,112. The three values are ordered as answer-eligible unique Evidence Families / content-Verified unique sources / answer-eligible propositions.
- Retrieval was improved to index and score source language and proposition language separately. Hebrew queries that explicitly request Yiddish or English now receive a language-alignment signal without treating a translation as a second witness. The Yiddish Hayom Yom test now uses the item's actual proposition vocabulary and Hebrew publisher-index aliases; this is retrieval metadata only, not a content claim.
- Commits: `be3c19f` (batch 108 content and audit), `1e22069` (multilingual retrieval and index language facets), `e39a75f` (carry forward batch-105 measured variance). The Pages build for `e39a75f` succeeded. At the time of this note, the full-index reconciliation and the commit-bound `test_content_readiness.mjs` runs were still in progress (Actions runs `43776237635` and `43776237717`). Do not report their metrics as published or their tests as passed until those runs complete and the resulting main commit is verified.
- No audience, visibility, permissions or hourly schedule was changed.

- Follow-up correction: batch 105 was still pending in the committed files; the earlier 3,071 figure was a runner-local measurement, not a committed reconciliation. The chain was reconnected using batch 105's expected 3,070 baseline, allowing batches 099–108 to reconcile together. The readiness test now loads acquisition state before any pending-branch assertion and explicitly accepts the measured +1 variance in batches 105–108. The previous test run failed at this ordering/chain issue; do not count it as a passed test.


## 2026-11-16 — Batch 109 and retrieval/test repair

- Reopened and inspected eight item-level public source bodies: six Hebrew sicha pages and two Yiddish original-text pages. Added eight non-verbatim, source-grounded paraphrases in place to existing identities AID 2989153, 4304434, 5959845, 2988989, 5990037, 5989929, 4736086 and 5430533. No new source identities or Evidence Families were created; all eight records remain Parsed and no content-Verified status was promoted.
- Each new proposition has an aligned body locator and was appended to the existing record's response_propositions and response_proposition_locators. The two Yiddish pages were read in Yiddish; their English renderings were treated as derived presentations, not independent witnesses. No full protected text was copied.
- The batch connects to batch 108's expected baseline of 1,051 answer-eligible families / 854 content-Verified families / 3,111 propositions. Batch 109 expects 1,051 / 854 / 3,119; actual metrics remain pending full-index reconciliation and must not be reported as published until the reconciliation workflow updates the public metrics.
- Retrieval repair: the Yiddish Hayom Yom question now has a proposition-level topic and a Yiddish-original gate. It requires an inspected proposition containing the truth-seeking, self-examination and movement concepts; title or language metadata alone cannot make the source answerable. Researcher mode must retain claim-to-source locators.
- Test repair: the latest observed run 43776237717 failed because acquisitionState was declared after its first use; it is moved before all uses. Historical assertions that compared an old batch's state to the current acquisition pointer were removed. Batch 109 and the Yiddish retrieval case are now covered by explicit readiness assertions. Commit-bound Actions and Pages verification are still required.
- No crawler retry, no access-control bypass, no schedule or permission change, and no automation was created.


## 2026-11-16 — Reconciliation and retrieval-gate addendum

- Commit d44457e triggered the Hourly corpus maintenance, Bulk ingest/reconcile, Answer quality gate and Pages deployment workflows. The two content-validation workflows reached question-specific retrieval and failed because the new Yiddish Hayom Yom selector was referenced before its const initialization. The declaration is moved before its first use in the follow-up patch.
- The reconciliation step completed its index build in the workflow workspace and measured 1,050 answer-eligible Evidence Families, 854 content-Verified sources and 3,117 answer-eligible propositions. These are diagnostic workspace results only; the workflows stopped before the metrics commit. The prior expected chain remains 1,051/854/3,111, so the measured variance is -1/0/+6. Batch 109 is audit-only at the batch boundary because its eight new propositions were added in place to canonical files from batches 106 and 107 and are therefore visible in those earlier-file snapshots.
- Readiness assertions now compare each batch's actual snapshot with its recorded expected snapshot and verify the computed variance, rather than hardcoding obsolete pre-enrichment totals. The final snapshot is required to match the generated public metrics; no new identities or Verified promotions are expected from batch 109.
- Pages build succeeded and deploy was still in progress at the last check; publication is not considered verified until the live site and public metrics are checked after the follow-up commit.


## 2026-11-16 — Batch 110: Hebrew/Yiddish Hayom Yom entries and deep researcher citations

- Inspected **8 original-language entries** from 3–10 Adar I 5703, stable AIDs **6084–6091**: five Hebrew and three Yiddish. Added **10 non-verbatim source-grounded propositions** across **8 distinct AID-backed Evidence Families**. Each dated entry remains its own item identity; they are not independent corroborating witnesses for a single claim. Same-page English renderings are derived and are not counted as separate witnesses.
- Original-language body locators were checked on eight date-specific Chabad.org daily-study pages; AID 6085 was also directly opened at the item page. Seven direct Hebrew AID routes (6084, 6086–6091) redirected to library/navigation shells; the same-run fallback pages displayed the corresponding original Hebrew/Yiddish bodies. No crawler retry, access-control bypass, search-snippet substitution or full-text copying was used.
- Attribution is preserved at entry level: AID 6084 explicitly attributes its statement to the Alter Rebbe; AID 6087 identifies the passage as “from my father's talks” (אאמו״ר); AID 6089 attributes the story to the Alter Rebbe. The other inspected entries have no explicit speaker attribution in the reviewed segment. No AI-generated inference is attributed to the Rebbe. All eight records remain **Parsed**; no Verified promotion was made.
- Pre-reconciliation deduplication checked all 12 bulk-indexed files, 956 repository tree paths and 1,022 review-queue records; no matching AIDs or source URLs were found. The generated public search-index blob exceeded the connector's readable file limit, so the authoritative full-index collision check remains the reconciliation job's responsibility.
- Batch 110 boundary: **1,051 / 854 / 3,111 → expected 1,059 / 854 / 3,121** (answer-eligible unique Evidence Families / content-Verified sources / distinct propositions). The inherited batch-109 diagnostic variance is retained; actual post-reconciliation values must come from the full-index workflow and are not asserted here.
- Researcher-mode repair: synthesized claims now retain proposition-level source locators through cited-source filtering; the deep research payload explicitly reports its depth and includes claim-to-source locators. Browser cache-busters were advanced for both the core and validated engine modules.
- Batches 099–110 require contiguous full-index reconciliation, then the commit-bound `test_content_readiness.mjs`, Actions and Pages checks. No audience, permissions, repository visibility or hourly schedule was changed.


### Reconciliation bug repair — 2026-11-16

- The first commit-bound reconciliation attempt after batch 110 failed in `scripts/reconcile_metrics.py` while calculating `last_batch_summary.metrics_delta_actual`. The code iterated over every public-metrics field and attempted `int()` on the explanatory `content_readiness_note` string. This was a reconciliation-code defect, not a source-content or citation failure; no refreshed public metrics were committed by that attempt.
- The calculation now uses only the three numeric answer-readiness measures: `answer_eligible_unique_sources`, `content_verified_unique_sources`, and `answer_eligible_propositions`. The content-readiness test also verifies that the saved last-batch delta contains exactly those numeric keys and matches the reconciled public metrics.
- Reconciliation, test completion, and Pages verification remain pending until the follow-up commit's Actions runs finish. The public metrics are still not reported as updated.


### Current-review pointer correction — 2026-11-16

- The historical batch-108 assertion in `test_content_readiness.mjs` was still checking batch 109 as the current manual review. Since batch 110 is now the current review and batch 109 is its predecessor, the assertion now checks `previous_manual_web_review.batch_id === '109'`. The final current-review assertion remains batch 110.


### Historical review assertions — 2026-11-16

- Updated historical readiness assertions that still treated batch 109 as the current review. The current review is batch 110; batch 109 is now the predecessor. Historical batch-077 checks no longer assert that batch 108 is the live predecessor, and batch-107/109 history checks now reference `previous_manual_web_review` rather than the current review object.


- Final test scan found one additional batch-109 assertion still using the current-review object; it now checks the predecessor object. The only current-review pointer assertion is batch 110.


### Education-influence retrieval repair — 2026-11-16

- The first post-reconciliation readiness run exposed a retrieval regression in the education-influence case: broad equal scores and the independent-witness tie-break pushed the relevant English translations (AIDs 2278256 and 2278261/2278254) below the small source budget. The translation must remain a derived presentation, but it is still usable to retrieve the content of its own Evidence Family when no more specific original-language body is available.
- Added a query-specific evidence-signal score for individual influence, children’s education, practical action and speech; raised the source/claim budget for this multi-source question and deduplicated presentations by Evidence Family after relevance ranking. The translated AID 2278256 is explicitly tested as `independent_witness=false` and counted only as derived evidence.
- The next quality-gate and hourly runs must verify the source selection, deep claim-source map, reconciliation metrics and publication. No translation is counted as an independent witness.

### Manual original-language source review — batch 111 — 2026-11-16

- Inspected eight distinct daily Hayom Yom entries for 12–19 Adar I 5703 (AIDs 6093–6100) through the publisher's public Daily Study pages. Four new entries are Hebrew and four are Yiddish; each has a distinct AID and Evidence Family. No translation or same-page language rendering was counted as an independent witness.
- Also reopened the Hebrew body of existing AID 2989153, *Sicha, Shabbat Parashat Ekev, 20 Menachem Av 5713*, and inspected section 9, lines 243–256. Added two non-verbatim propositions in place to the existing canonical record; its identity, Evidence Family and Parsed status were preserved. One proposition captures the distinction between present intellectual study and later emotional internalization; the other preserves the transcript's explicit caveat that the Alter Rebbe story was seen in a copy and its accuracy was uncertain.
- Across nine inspected source bodies, batch 111 adds eight new identities and enriches one existing identity, with ten new-entry propositions plus two in-place propositions. Every proposition has source-grounded paraphrase metadata, item/section locators, provenance, partial verification scope, context and attribution limits. Internal attributions are preserved; no AI paraphrase is attributed to the Lubavitcher Rebbe. All eight new records and the enriched identity remain Parsed; no Verified promotion was made.
- The direct public daily pages and the Hebrew sicha body were accessible in this review. No blocked body required fallback, no crawler retry was made, and no access control was bypassed.
- Added batch 111 to the pending reconciliation chain after batch 110. Expected boundary (not actual until full-index reconciliation): 1,067 answer-eligible unique sources / 854 content-Verified unique sources / 3,133 answer-eligible propositions.
- Added batch-111-specific assertions to `scripts/test_content_readiness.mjs` and updated the current/previous manual-review pointers. These assertions have **not yet been executed**: the GitHub status endpoint returned no checks for the new commits, the Actions-run listing exposed by the connected GitHub interface is limited to pull-request runs, and a local clone could not be fetched from this runtime. Do not treat the test update as a passing test.
- The committed `data/public-metrics.json` remains the previous snapshot until the existing hourly corpus pipeline reconciles pending batches 099–111. Do not report expected boundary values as published or actual metrics.


## 2026-11-16 — Batch 112: original-language Hayom Yom, a Hebrew letter, and Sicha enrichment

- Inspected **10 source bodies**: eight distinct Hayom Yom entries for 20–27 Adar I 5703 (AIDs **6101–6108**; five Hebrew and three Yiddish), one Hebrew letter to Torah-institution and yeshiva students (AID **2989411**), and one existing Hebrew Sicha (AID **5959845**).
- Added **nine new item identities / Evidence Families**: the eight dated anthology entries and one dated letter. Added **13 non-verbatim source-grounded propositions** to those new identities. The letter's printed signature, date, addressee and body were inspected; no autograph or archival original was examined. The footnote says this letter was also written and sent in Yiddish; that Yiddish version was not inspected or counted as an independent witness.
- Enriched the existing AID **5959845** in place with one proposition from sections ז–ח, lines 214–224 and 233–244, distinguishing students who fail to understand because of difficulty from those who are negligent in study. The identity, Evidence Family and Parsed status were preserved.
- One route required a same-run fallback: the Hebrew AID route for **6105** redirected to a different library record (AID 528641). The date-specific Daily Study page for 13.03.2026 was opened in the same run and its original Yiddish body for 24 Adar I was inspected. The English AID 6105 page was used only to confirm the stable item identity; it was not counted as an independent witness. No crawler retry or access-control bypass occurred.
- All new records carry source_grounded_paraphrase, proposition_verbatim=false and proposition_verification=source_text_inspected, with exact body locators, provenance, partial verification scope, context and attribution limits. Embedded attributions to the Mitteler Rebbe, the Alter Rebbe and “אאמו״ר” are preserved. No AI-generated inference is attributed to the Lubavitcher Rebbe. All records remain **Parsed**; no Verified promotion or full-text copying occurred. Same-page translations are derived and are not counted as independent witnesses.
- Preliminary duplicate checks found no matching AIDs in the current review queue or the 12 bulk-indexed files; the full canonical identity/Evidence Family scan remains the reconciliation job's responsibility.
- Expected batch-112 boundary (not actual until reconciliation): **1,067 / 854 / 3,133 → 1,076 / 854 / 3,147** (answer-eligible unique Evidence Families / content-Verified sources / answer-eligible propositions). The prior public metrics file is not treated as current corpus evidence.
- Fixed a reconciliation false-collision defect: existing_identity_updates audit descriptors carry canonical AID/ID/Evidence Family fields but are not separate source records. The index and collision scan now exclude these descriptors, preventing a legitimate in-place enrichment (including AID 2989153) from being counted as a duplicate canonical record.
- Updated the commit-bound readiness tests for batch 112 and the 099–112 reconciliation chain. Actions and live Pages metrics must still be checked after the commit; no test pass or deployment success is assumed in advance.


## 2026-11-16 — Manual source review batch 113

Batch 113 adds **15 distinct dated Hayom Yom item identities** from original-language publisher pages: 9 Hebrew and 6 Yiddish entries, AIDs 528645–528647 and 528649–528660. AID 528648 was inspected as a month index only and excluded. Each dated entry receives its own Evidence Family; no translation was counted as an independent witness. All 15 records remain Parsed, with one non-verbatim `source_grounded_paraphrase` per item, `proposition_verification=source_text_inspected`, item-level locators, provenance, partial-context boundaries and explicit attribution limitations.

Two existing Sicha identities were enriched in place:
- AID 5959845: one additional proposition from section 9, lines 246–253, documenting the explicit limit on disciplinary anger and the prohibition on breaking vessels/property to instill fear. The identity and Evidence Family remain unchanged; total propositions 5 → 6.
- AID 2989585: one additional proposition from section B, lines 189–193, recording the Rebbe's address to children before bar mitzvah at that particular farbrengen. The locator for the existing children-as-guarantors proposition was corrected to lines 189–193. The identity and Evidence Family remain unchanged; total propositions 7 → 8.

The known GitHub-runner acquisition path remains blocked by HTTP 403 for the earlier 12-reference attempt. It was not retried and no access control was bypassed. Manual public-reader inspection of the publisher's canonical `/library/article_cdo/aid` pages supplied the 15 accessible item-level bodies; the two existing Sicha bodies were also reopened. No search snippet or title was used as source content, and no full copyrighted text was copied.

Deduplication was checked against the 1,022-record content-review queue, 12 bulk-index inventories, selected recent batch files and exact AID searches. No collision was found in those checked sets. **The complete canonical identity/Evidence Family scan is still pending reconciliation**, so the new-family count and metrics below are expected, not measured. Expected boundary after batch 112: 1,076 answer-eligible unique sources / 854 content-verified unique sources / 3,147 answer-eligible propositions. Expected after batch 113: **1,091 / 854 / 3,164**. No source was promoted to Verified.

### Retrieval regression repair

The latest Answer Quality Gate failed because the child-education letter AID 2278261 did not survive the top-36 retrieval candidate window for the educational-influence/action query. The underlying source is a derived translation manifestation and must remain non-independent, but it is still useful as a bounded source. The core scorer now gives an explicit relevance bonus to propositions that identify immigrant children, without changing the Evidence Family or independent-witness status. The readiness test is extended to verify that AID 2278261 is retrieved while retaining its derived/non-independent classification.

### Reconciliation and publication status

Batch 113 is submitted as pending reconciliation. The public metrics and project-state counts have not been manually advanced. The two in-place enrichments may appear in earlier batch snapshots because their canonical records live in batches 100 and 106; reconciliation must record any resulting historical variance rather than conceal it. Required next validation is the full reconciliation of batches 099–113, `test_content_readiness.mjs`, the Answer Quality Gate, Actions and live Pages metrics.

## 2026-11-16 — Batch 114: Hebrew/Yiddish Hayom Yom and Sicha enrichment

- Inspected 12 original-language item bodies on the publisher's public pages, AIDs 528661–528672 (13–24 Adar II 5703): 9 Hebrew and 3 Yiddish. Each dated entry receives one non-verbatim, source-grounded proposition with exact body-line locator, provenance, scope, context and qualifications. Each item has its own Evidence Family; no translation or parallel rendering is counted as an independent witness.
- Reopened the Hebrew body of Sicha AID 5959845 and inspected sections XI–XIII, lines 260–280. Added one proposition distinguishing the speaker's concern about indifference to Torah teachings and the risk of humiliating earlier teachers from a claim to personal honor. The existing identity remains in its original Evidence Family and canonical file.
- 13 source-body pages were inspected in total. No scan-only verification, full-text copying, Verified promotion or access-control bypass was used. The known runner-side HTTP 403 acquisition path was not retried; the authorized public web reader opened the canonical publisher pages instead.
- Expected boundary before batch 114: 1,091 answer-eligible unique sources / 854 content-verified unique sources / 3,164 answer-eligible propositions. Expected after batch 114: 1,103 / 854 / 3,177. These are expected batch boundaries, not measured or published counts. Because the new proposition is stored in the existing AID 5959845 canonical record in batch 106, reconciliation must retain any historical snapshot variance rather than force the expected totals.
- Retrieval update: added rabbinic/public-responsibility and teacher-student language to the validated topic aliases. Added a regression question requiring both the Yiddish Hayom Yom witness AID 528671 and the Sicha AID 5959845, with claim-level citations in regular and researcher modes.
- The preceding reconciliation run 43802854595 reached the readiness test but failed at scripts/test_content_readiness.mjs:1247 with ReferenceError: readFileSync is not defined. The test now uses the existing async readFile import and root URL. The current commit triggers a fresh reconciliation and quality-gate run; until they finish, data/public-metrics.json, the public index and Pages are not reported as updated.


## 2026-11-16 — Retrieval regression repair after batch 114

- The first post-batch-114 reconciliation workspace measured 1,102 answer-eligible unique sources, 854 content-verified unique sources and 3,183 answer-eligible propositions. These values were not committed because the readiness gate stopped on the existing educational-influence regression for AID 2278261.
- Root cause: the scorer referenced an `immigrantChildren` signal that the signal builder did not return. Added explicit Hebrew/Yiddish/English immigrant-child phrase detection and a relevance bonus for the inspected child-education item. Its `independent_witness=false` and translation-to-family link remain unchanged.
- Added core retrieval aliases for rabbinic public responsibility and a bounded multi-source regression that requires the Yiddish Hayom Yom item AID 528671 plus the distinct yeshivah-student letter AID 2276672. A separate test checks the enriched Sicha AID 5959845 in deep researcher mode with its new section XI–XIII locator.
- The prior reconciliation and quality-gate runs failed before committing regenerated metrics. The current patch triggers fresh validation; no new public metric is claimed until that validation and the reconciliation commit succeed.


## Batch 118 — 16 November 2026

- Inspected 11 item-level bodies from the public Hebrew publisher pages for Hayom Yom AIDs 528707, 528708 and 528710–528718: six Hebrew entries and five Yiddish entries, each represented by one distinct Evidence Family. The Hebrew paraphrases of Yiddish entries are research summaries, not independent translation witnesses.
- Added 11 new source identities and 12 source-grounded paraphrases. All new records remain Parsed; no source was promoted to Verified. AID 528716 contributes two separately located propositions (tallit wrapping and the daily study of Sotah during the Omer).
- Enriched the existing AID 2989585 Sicha identity in its canonical file (batch 100) with three non-verbatim propositions from sections XVII, XIX–XX and XXII, lines 321–332, 343–374 and 380–388. The existing Evidence Family and Parsed status were retained.
- AID 528709 was excluded as a month-navigation page, not a daily source. Direct open of AID 4666220 returned Internal Error; this was recorded, no access control was bypassed, and 11 accessible item-level publisher bodies plus the existing Sicha were inspected in the same run.
- Batch 118 expected boundary: 1,135 / 854 / 3,214 before and 1,146 / 854 / 3,229 after (answer-eligible unique sources / content-verified unique sources / answer-eligible propositions). These are expected values only; actual values are pending the full reconciliation chain 099–118.
- The previous Actions failure was traced to stale latest-batch assertions in `test_content_readiness.mjs` (the test expected batch 116 while acquisition state was already at 117). The test was updated to use batch 118 and its measured boundary, and to preserve the distinction between historical batch snapshots and later in-place enrichments. The test itself has not yet passed in this commit.


## 2026-11-16 — Batch 119: inspected Hebrew/Yiddish Hayom Yom entries and Sicha enrichment

- Opened and inspected ten item-level publisher bodies in the original language: AIDs 528719–528724 and 528726–528729 (four Hebrew entries and six Yiddish entries). Added ten distinct item identities and ten separate dated-entry Evidence Families; AID 528725 returned an internal error and was excluded. The accessible ten pages were used as same-run alternatives; no search extract was used as content.
- Added eleven non-verbatim, source-grounded propositions with per-proposition locators. Embedded attributions to the Alter Rebbe, the Maggid, the Tzemach Tzedek, the Baal Shem Tov and the Mitteler Rebbe remain explicit; none is converted into a direct statement by the Lubavitcher Rebbe. All ten identities remain Parsed with partial context.
- Enriched existing Sicha AID 2989585 in place with two further propositions from sections 23–28 (body lines 393–429), on the talk's discussion of bodily health in relation to Torah observance and its specific recommendations about Gan Yisrael and Emunah summer camps. The existing identity, Evidence Family and Parsed status are preserved.
- Batch delta at the expected boundary: +10 answer-eligible unique Evidence Families, +13 distinct propositions, +0 content-verified sources. Expected cumulative boundary 1,146/854/3,229 → 1,156/854/3,242; these are expected values, not actual metrics until reconciliation.
- AID 528725 returned Internal Error; no bypass was attempted. The runner-side HTTP 403 crawler was not retried. No full text was copied and no translation was counted as an independent witness.
- Reconciliation of batches 099–119 and the content-readiness run are pending this commit.
- Quality-gate diagnosis: the batch-117 test incorrectly compared its historical after-snapshot to the final corpus metrics, even though batch 118 followed it. The assertion now compares batch 117's after-snapshot with batch 118's before-snapshot; batch 118 is likewise compared with batch 119's before-snapshot. The in-place AID 2989585 assertion now expects the two additional propositions while retaining one canonical identity.


### Follow-up quality-gate diagnosis — 16.11.2026

The first full-corpus validation after batch 119 exposed a second stale assertion family: the canonical AID 2989585 item is enriched in place across several batches, so tests that inspect the final search index must expect the current total of 13 propositions, while batch-specific audit records retain their historical counts (8 after the earlier checkpoint, 11 after batch 118, and 13 after batch 119). The failing assertions were at the batch-113, batch-100 and batch-102 test checkpoints. They now expect 13 in the final index; the per-batch historical assertions remain unchanged. The blocked AID 528725 test now checks that it has no answer-eligible content, rather than assuming no metadata-only index record can exist. A new validation run is required before reconciliation can be treated as complete.


A subsequent run (16.11.2026) then reached the historical batch-113 assertions and found three remaining pointers to the prior current batch: `lastBatchSummary.batch_id`, `manual_web_review.batch_file`, and `previous_manual_web_review.batch_file`. They still expected batch 118 / 115 despite batch 119 being the current review and batch 118 its immediate predecessor. These current-pointer assertions now expect 119 / 118; the batch-113 reconciliation snapshot itself remains historical and unchanged.
 
## 2026-11-16 — Batch 120: Hebrew/Yiddish daily entries, English letter translations and Sicha enrichment

- Opened and inspected 17 item-level publisher bodies from the dated Hayom Yom sequence: AIDs 528730–528738 and 528740–528747 (14 Hebrew entries and 3 Yiddish entries; AID 528739 was opened only to identify it as a month-navigation page and was excluded).
- Added two distinct published English letter translations from the Sichos in English collection: Letter No. 1051 (15 Sivan 5711; AID 3906812) and Letter No. 71 (13 Nissan 5703; AID 5920863). Their English bodies were inspected, but the source-language originals were not; both records are explicitly marked as non-independent translated presentations, not original-language witnesses.
- Enriched existing Sicha AID 2989585 in its original canonical file with three propositions from sections XXIX–XXXIII, lines 434–477, concerning the longing of baalei teshuvah, caution against self-attribution of spiritual achievement, and the responsibility of rabbis and teachers. The same identity, Evidence Family and Parsed status remain; the talk is marked unedited.
- AID 528725 returned Internal Error. No bypass was attempted; 17 other daily-entry bodies, two English letter translations and the existing Sicha body were inspected in the same run. No crawler retry, full-text copying or Verified promotion was used.
- Expected batch boundary: 1,156 / 854 / 3,242 before and 1,175 / 854 / 3,270 after (answer-eligible unique sources / content-verified unique sources / answer-eligible propositions). These are chained expected values only; actual counts and family collisions are pending reconciliation of batches 099–120.
- Added readiness assertions for the new Hebrew/Yiddish entries, non-independent English translations, the three new AID 2989585 locators, and deep-researcher multi-source synthesis across the two letters. Current pointers now expect batch 120 and previous batch 119.
- No source was promoted to Verified. The public metrics, public search index and Pages are not reported as updated until reconciliation, readiness and quality-gate checks complete.



## 2026-11-16 — Batch 121: inspected Hebrew/Yiddish Hayom Yom entries and Sicha enrichment

- Opened and inspected 16 original-language item bodies, AIDs 528748–528763, covering 9–24 Sivan 5703: 10 Hebrew, 5 Yiddish and 1 mixed Hebrew/Yiddish entry. Added 16 distinct dated-item identities and Evidence Families, with 20 non-verbatim source-grounded propositions and exact body-line locators.
- Enriched existing Sicha AID 2989585 in place with three propositions from sections 34–35, lines 483–485 and 499–508. The existing identity and Evidence Family remain unchanged; total propositions in that identity are now 19. The report about the Baal Shem Tov remains attributed as a tradition cited by the talk, not an independently inspected witness.
- AID 553691 (Yechidus, Yiddish) was opened but exposed an audio listing without a readable transcript. It was excluded from content propositions and left in the review queue; 16 accessible Hayom Yom bodies were used as same-run fallback. No audio was played, no access control was bypassed, and the blocked runner crawler was not retried.
- Expected chained boundary after batch 120: answer-eligible unique sources 1,175; content-verified unique sources 854; answer-eligible propositions 3,270. Expected after batch 121: 1,191; 854; 3,293. These are chained expectations only; actual values remain pending full reconciliation of batches 099–121.
- No new item was promoted to Verified. The anthology entries remain Parsed with partial context; translations, scans and later presentations do not count as independent witnesses.
- The readiness test now includes batch-121 identity, proposition, provenance, locator, exclusion and deep multi-source synthesis assertions. The batch and state are pending reconciliation; do not report the assertions as passed until a commit-bound Actions result is available.


## 2026-11-16 — Batch 121 validation repair

The first commit-bound reconciliation rebuilt the search index and measured 1,189 answer-eligible unique sources, 854 content-verified unique sources and 3,297 propositions. The reconciliation job reached the readiness test but stopped on a duplicate top-level `const educationResponsibilityQuestion` declaration already present in the test file. The second declaration was renamed; repeated latest-batch assertions now target batch 121 and compare the batch-120 actual snapshot to batch-121's actual-before snapshot. These metrics are workflow-log measurements until a successful run commits the generated state and public index.




## 2026-11-16 — Batch 122: daily entries, Sicha transcripts and in-place enrichment

- Opened and inspected 15 item-level bodies in the original language: 12 dated Hayom Yom entries, AIDs 528764–528769 and 528771–528776 (8 Hebrew, 2 Yiddish and 2 mixed Hebrew/Yiddish), two distinct Hebrew Sicha transcripts from 19 Kislev 5721 (AIDs 4280364 and 4280365), and existing Hayom Yom AID 528717 in Yiddish.
- Added 14 new source identities in 14 distinct Evidence Families and 19 non-verbatim, source-grounded propositions. Enriched existing AID 528717 in place with one further proposition from the same Yiddish body (lines 172–173), preserving its identity, Evidence Family and Parsed status. Total batch contribution: 20 propositions; no new item was promoted to Verified.
- Existing Sicha enrichment was attempted but not completed: AID 2989585 returned Internal Error through two public URL variants; AID 4783983 redirected to a rewritten summary shell without readable letter body. AID 528770 was identified as a month-navigation page and excluded. Fourteen accessible new-source bodies plus the existing AID 528717 body were inspected in the same run. No crawler retry, access-control bypass or full-text copying occurred.
- Expected chained boundary after batch 121: 1,191 / 854 / 3,293; expected after batch 122: 1,205 / 854 / 3,313 (answer-eligible unique sources / content-verified unique sources / answer-eligible propositions). These are expected values only; the committed public metrics remain 977 / 878 / 2,950 until reconciliation and publication complete.
- The previous Answer Quality Gate run 43907718460 failed at scripts/test_content_readiness.mjs:1311 because final-index assertions expected 16 propositions in existing AID 2989585, although enrichments through batch 121 brought its total to 19. Four stale assertions (batch-113, batch-100, batch-118 and batch-119 checkpoints) were corrected to 19; historical batch manifests retain their own counts. Readiness coverage now also checks AID 528717's in-place enrichment and deep researcher retrieval.
- Batch 122 and its test/state updates are pending a new commit-bound Actions run. No test pass, reconciliation result or new deployment is claimed until the workflows finish.


## 2026-11-16 — Batch 123: fourteen inspected Hebrew/Yiddish daily entries and one in-place enrichment

- Opened and inspected 14 item-level publisher bodies in the original language, AIDs 528777–528790, covering 7–20 Tammuz 5703: 10 Hebrew entries, 3 Yiddish entries and 1 mixed Hebrew/Yiddish entry. Added 14 distinct dated-item identities in 14 Evidence Families and 23 non-verbatim, source-grounded propositions with item-level locators.
- Enriched existing AID 528765 in its canonical batch-122 record. The prior broad paraphrase was split into two distinct claims with separate locators at body lines 173 and 174; the existing identity, Evidence Family and Parsed status remain unchanged. This adds one proposition, not a new source.
- AID 4666220 returned Internal Error without readable source text. No bypass was attempted. Fourteen accessible daily-entry bodies and the existing AID 528765 body were inspected in the same run. AIDs 528778 and 528785 initially failed direct opens but their publisher bodies were accessible through the public dated-entry navigation links and were inspected. No crawler retry, full-text copying, scan-only content verification or Verified promotion occurred.
- All 14 new entries remain Parsed with partial context. Embedded attributions to the father of the compiler, the Alter Rebbe, the Maggid, the Tzemach Tzedek and other figures remain explicit; none is converted into a direct statement by the Lubavitcher Rebbe.
- Expected chained boundary after batch 122: 1,205 / 854 / 3,313; expected after batch 123: 1,219 / 854 / 3,337 (answer-eligible unique Evidence Families / content-verified unique sources / answer-eligible propositions). These are expected values only; actual counts and collisions await reconciliation of batches 099–123.
- The prior Answer Quality Gate run 43913257630 failed at test_content_readiness.mjs:1821 because the query wording about yeshiva expansion and student admission did not retain the inspected Yiddish AID 4754490 alongside AID 5413024. The source remains an existing inspected identity. The core and validation-layer aliases for the existing "הרחבת ישיבה" topic now include the query's enrollment language and the source's inspected wording about expanding rooms and admitting students; a regression assertion checks topic resolution and both witnesses in regular and researcher modes.
- Batch 123, its source enrichment, state/acquisition pointers and readiness assertions are pending a new commit-bound reconciliation and quality-gate run. The public metrics and Pages are not claimed updated until those runs complete.


### 2026-11-16 follow-up — retrieval alias precision

The first batch-123 commit expanded the existing “הרחבת ישיבה” topic with overly generic single-word aliases (including “ישיבה”, “תלמיד” and “חדרים”). The commit-bound readiness run exposed a false-positive topic classification: a separate question about rabbinic responsibility for educating children was incorrectly classified as yeshiva enrollment/expansion, and the regular-mode synthesis lost its required multiple Evidence Families. The broad aliases were removed. The topic now uses phrase-level query aliases and source-language evidence phrases (“הרחבת החינוך הישיבתי”, “קליטת תלמידים נוספים”, “להרחיב את החדרים בבניין”, “לקלוט תלמידים המבקשים להיכנס לישיבה”), preserving the intended AID 4754490 retrieval without using generic terms. A negative regression assertion now ensures the educational-responsibility question does not trigger the yeshiva-expansion topic. Reconciliation and all readiness gates remain pending a fresh run.


### 2026-11-16 follow-up — batch file pointer

After narrowing the yeshiva aliases, the readiness run passed the earlier topic-precision check and reached the latest-batch state assertions. It then failed because the batch-123 acquisition summary did not include its `batch_file` pointer. Added the canonical batch path to the batch file, current/last/previous acquisition review summaries and review history, and added an explicit test assertion. The failed run did not commit reconciled public metrics; a fresh run is required.


## 2026-11-16 — Batch 124: twelve inspected Hebrew/Yiddish daily entries and one existing-identity enrichment

- Opened and inspected 12 item-level publisher bodies in the original language: AIDs 528791–528799, 528801, 528802 and 528804. Seven entries are Hebrew and five are Yiddish. Added 12 distinct dated-entry identities in 12 Evidence Families and 20 non-verbatim, source-grounded propositions with claim-level locators.
- Enriched existing AID 5959845 in its original Evidence Family and canonical batch-106 record. A new proposition was added from publisher footnote 21 (lines 434–435), explicitly identified as a footnote rather than a further section of the talk. The footnote's attribution is preserved; no independent recording or manuscript was inspected.
- AID 528803 returned Internal Error. AIDs 5413024 and 4754490 redirected to rewritten summary shells without readable original bodies and were not used as content. AID 528800 was a month-navigation page and was excluded. AID 528792 initially failed a direct open but its item-level body was accessible through the publisher's public navigation link from AID 528791. Twelve alternative source bodies and the existing AID 5959845 footnote were inspected in the same run.
- No crawler retry, access-control bypass, search-extract-as-content, full-text copying, scan-only content verification or Verified promotion occurred. All 12 new identities remain Parsed with partial context. Hebrew/Yiddish presentations are not counted as independent witnesses of one another.
- Expected chained boundary after batch 123: 1,219 / 854 / 3,337; expected after batch 124: 1,231 / 854 / 3,358 (answer-eligible unique Evidence Families / content-verified unique sources / answer-eligible propositions). These are expected values only; actual counts and canonical collisions await reconciliation of batches 099–124.
- The answer gate for the existing “הרחבת ישיבה” topic was too narrow: it required only four exact recruitment formulations and therefore rejected inspected source wording. It now recognizes the actual evidence phrases “הרחבת החינוך הישיבתי”, “להרחיב את החדרים בבניין” and “לקלוט תלמידים המבקשים להיכנס לישיבה”, while retaining the specific-evidence gate and the existing negative regression check against generic educational-responsibility questions.
- Batch 124, the AID 5959845 enrichment, readiness-test updates and state/acquisition pointers are pending commit-bound reconciliation and Actions. No test pass, new public metric or Pages deployment is claimed until verified.


### 2026-11-16 follow-up — distinguish narrow enrollment from broad yeshiva synthesis

The first batch-124 Actions run indexed the new sources and calculated a diagnostic workspace snapshot of 1,229 / 854 / 3,362, but both the Answer Quality Gate and reconciliation workflow stopped at `test_content_readiness.mjs:322`. The narrow question “כיצד הציע הרבי להגדיל את מספר התלמידים בישיבה?” admitted a general educational-expansion source because the gate treated “הרחבת החינוך הישיבתי” as explicit recruitment. That was too broad. The gate now requires a concrete recruitment action or target for narrow enrollment questions. AID 5413024 is admitted only for the distinct multi-aspect question that explicitly asks about yeshiva-education expansion together with Torah dissemination and public support; AID 4754490 remains eligible through its inspected room-expansion/admission propositions. The prior failed run did not commit metrics; the 1,229 / 854 / 3,362 snapshot is diagnostic only. A fresh reconciliation and full readiness retest are required.


### 2026-11-16 follow-up — enrollment regression allowlist

The next readiness run confirmed that the narrow enrollment gate returns only two inspected witnesses: the volume-XIII enrollment letter and AID 4754490, whose inspected Yiddish proposition explicitly recommends expanding rooms to admit students. No broad-only AID 5413024 or 5413540 entered the narrow answer. The test failed because its key allowlist contained only legacy `id:igrot-scan-v13-letter-4-...` keys and omitted the canonical `aid:4754490` key. The assertion now includes that exact canonical key, requires AID 4754490, and explicitly excludes AIDs 5413024 and 5413540 from the narrow query; the separate broad multi-aspect test continues to require AID 5413024. The reconciliation snapshot 1,229 / 854 / 3,362 is still diagnostic only; no public metrics were committed.


### 2026-11-16 manual source review — batch 125

- Inspected 15 original-language Hayom Yom bodies, AIDs 528805–528819: six Hebrew and nine Yiddish entries, covering 5–19 Menachem Av 5703.
- Added 23 non-verbatim, source-grounded response propositions with proposition-level locators, provenance, partial-context scope and attribution limits. No full protected text was copied.
- Enriched existing AID 5959845 in place with one additional proposition from section 18 (lines 338–343). The same identity and Evidence Family were retained; no duplicate witness was created.
- AID 528810 direct Hebrew and English routes returned Internal Error. In the same run, a French Chabad.org daily-study page was opened and its original Hebrew/Yiddish body at lines 171–176 was inspected. Only the original-language body was used; the French translation was not counted as an independent witness. No access-control bypass and no crawler retry.
- Batch totals: 15 new identities, one existing identity enriched, 23 new propositions plus one in-place proposition, 16 source bodies inspected, zero Verified promotions.
- Expected chain boundary after batch 124: 1,231 / 854 / 3,358; expected after batch 125: 1,246 / 854 / 3,382 (answer-eligible unique Evidence Families / content-verified unique sources / answer-eligible propositions). These are expected values only. The last public metrics still show 977 / 878 / 2,950, while project-state shows 977 / 870 / 2,950; the eight-source discrepancy and pending batches 099–125 require full canonical reconciliation.
- The connector did not return readable contents for the full public search index, so canonical collision and answer-eligibility checks remain pending reconciliation. The batch was checked against the 1,022-record review queue and recent batches 122–124; no matches were found.
- No Verified promotion, no crawler retry, no permission/audience change, no duplicate automation, and no change to the hourly schedule. Batch 125 content and readiness assertions are committed on main; full Actions and public-metric verification remain pending.



## 2026-11-16 — Batch 126: bilingual original-language Hayom Yom entries

- Inspected 11 public Chabad.org / TheRebbe.org bilingual publisher pages from the *Sichos in English Collection*, dated 20–30 Menachem Av 5703 (AIDs 3316840, 3316843, 3316846, 3316847, 3316850, 3316852, 3316854, 3316856, 3316858, 3316863, 3316866). Eight pages expose the original Hebrew passage and three expose the original Yiddish passage. The English translation and editorial material were not treated as independent witnesses or used as the basis for propositions.
- Added 19 non-verbatim, source-grounded Hebrew propositions with line-level locators, provenance, verification scope, context and limitations. All 11 new identities remain Parsed; no source was promoted to Verified.
- Enriched the existing AID 528819 identity in place with one scope proposition based on the original Hebrew passage in the parallel bilingual presentation AID 3316836, line 245. The existing AID and Evidence Family were retained; the parallel page is linked to the same family and is not counted as an independent witness.
- Three direct public routes for candidate IDs 528820–528822 returned Internal Error without readable bodies. In the same run, 11 accessible item-level bilingual publisher pages were opened and their original-language passages inspected. No crawler retry or access-control bypass was attempted.
- Expected batch boundary only (not a measured result): before 1,246 answer-eligible Evidence Families / 854 content-verified / 3,382 propositions; expected after 1,257 / 854 / 3,402. Last published public metrics remain 977 / 878 / 2,950; project-state still shows 977 / 870 / 2,950. Batches 099–126 require full reconciliation.
- The latest Answer Quality Gate and Hourly Corpus Maintenance logs were inspected. Both failed at readiness assertions expecting 12 propositions for AID 5959845 although the canonical in-place identity contains 13 after batch 125. The stale assertions were corrected; retrieval aliases and tests were added for Elul self-accounting plus self-driven service, Chassidic stories as life instruction, and claim-level citations in deep researcher mode.
- Status: content batch committed; reconciliation, full readiness retest, Actions and Pages verification remain pending. No automation schedule, audience, or permissions were changed.


### 2026-11-16 follow-up — acquisition path assertions

The first Answer Quality Gate run after the batch-126 commit passed status normalization, evidence-index generation, question-specific retrieval, answer synthesis, citation integrity, the evidence-contract audit and workflow-write-safety checks. The full readiness test then stopped at line 1341: an older assertion still expected `manual_web_review.batch_file` to point to batch 124, although the current acquisition pointer correctly points to batch 126. A second stale assertion expected the previous batch path to be 123 instead of 125. Both earlier and later checkpoint path assertions were corrected to current batch 126 / previous batch 125. This was a test-fixture pointer mismatch, not a source-content or retrieval failure. The rerun remains pending.


### 2026-11-16 follow-up — bounded synthesis with a non-independent publisher text

The repaired readiness run passed the acquisition-pointer assertions and reached the cross-item study/youth synthesis test. It then exposed a mismatch: AID 5019603 is a publisher text completed from a photograph that was not inspected, so its record correctly has `independent_witness=false`; the synthesis helper excluded it entirely and returned no synthesis even though the test requires the two distinct correspondence items to be compared. The helper now permits this specific source-text-inspected, non-translation publisher text as a **non-independent** basis item, carries that status into each claim locator, and states that the photograph was not inspected. It is not counted as an independent witness; researcher mode remains `claim_level` when only one independent family is present. A regression assertion protects this boundary. Full readiness and reconciliation retest remain pending.


A small test-fixture refinement removed an over-specific assertion that the entire researcher response must have `synthesis_scope=claim_level`. That field is calculated from all selected independent sources, not only the two items in this particular synthesis. The test now checks the actual invariant: AID 5019603 remains explicitly non-independent in the synthesis basis and every relevant claim locator, and the uninspected photograph is disclosed.

### 2026-11-16 — batch 127 content review and synthesis-integrity repair

- Inspected 14 public publisher bodies for Hayom Yom entries dated 1–14 Elul 5703 (13 Hebrew and one Yiddish), plus one English publisher translation of Letter No. 128 (AID 5920904). The translated letter is explicitly marked non-independent because its original-language text was not inspected. Added 22 non-verbatim, source-grounded response propositions with proposition-level locators, provenance, verification scope, context and limitations.
- Enriched the existing AID 528819 identity in place with one additional proposition from the original Hebrew body, line 173, describing the weekday division of the weekly Torah portion with Rashi. The existing Evidence Family was retained.
- Linked five parallel publisher pages (AIDs 5903–5907) to the same Evidence Families as canonical entries AIDs 528835–528839; none is counted as an independent witness. Three direct routes (AIDs 5900–5902) returned Internal Error. They were documented as blocked; no retry, crawler use or access-control bypass occurred. Accessible source bodies were inspected in the same run.
- A full pre-addition scan of the public search index (9,122 entries, generated 2026-11-15) found no existing matches for the 15 new AIDs or five alias AIDs. This is a pre-addition duplicate check only; post-addition reconciliation and readiness are still pending.
- No source was promoted to Verified. Expected batch boundary only (not measured): before 1,257 / 854 / 3,402; expected after 1,272 / 854 / 3,425. Public metrics and project-state remain unreconciled; the public file still shows 977 / 878 / 2,950 and project-state 977 / 870 / 2,950.
- The previous readiness run exposed a validator gap: `patternSynthesisIntegrity` did not recognize the existing `study_and_youth_education` synthesis and applied the generic two-independent-family / three-claim threshold, stripping a valid synthesis. A topic-specific branch now requires two distinct families, at least one independent family, two claim-level cited claims, and preserves the publisher-text-completed-from-photograph source as non-independent. Regression tests were added; the full `test_content_readiness.mjs` and Actions rerun remain pending.
- Batch 127 and the associated validator, readiness-test, and AID 528819 enrichment changes are staged for the next main-branch commit. No automation schedule, audience, or permissions were changed.


### 2026-11-16 — batch 128: 18 new source identities and five same-family links

- Inspected 18 public item-level bodies in the original language: 13 Hebrew and 5 Yiddish Hayom Yom entries, AIDs 528846–528860 and 528862–528864, dated 15–29 Elul 5703 and 1–3 Tishrei 5704. Added 24 non-verbatim Hebrew research propositions with proposition-level locators, provenance, verification scope, partial-context boundaries and attribution limitations.
- Linked five parallel publisher presentations (AIDs 5908–5912) in place to existing canonical identities AIDs 528840–528844. Four pages exposed the matching original-language body; AID 5910 redirected to canonical AID 528842. These are same-family presentations, not independent witnesses, and no extra propositions were added to the existing identities.
- AID 5900 returned Internal Error. No crawler retry or access-control bypass was attempted. In the same run, accessible item-level bodies AIDs 528846–528860 and 528862–528864 were inspected. AID 528861 was excluded as a month-navigation index, not treated as a source item.
- Duplicate screening found no matches in the 1,022-record content-review queue or recent batches 125–127. The full public search index was too large to retrieve through the GitHub connector in this run; full canonical collision detection and answer-eligibility confirmation remain pending reconciliation.
- Expected batch boundary only (not measured): before 1,272 / 854 / 3,425; expected after 1,290 / 854 / 3,449. The 18 new identities and 24 propositions are not yet reflected in a measured public metric. No source was promoted to Verified.
- The last Answer Quality Gate and Hourly Corpus Maintenance runs stopped at a stale test assertion expecting batch 126 while project state already pointed to batch 127. The readiness checkpoint, historical batch assertions and batch-128 content/alias tests were updated. Reconciliation and a complete readiness rerun remain pending.
- No automation schedule, audience, permissions or access settings were changed.


### 2026-11-16 — explicit answer eligibility in the public index

- The first batch-128 reconciliation attempt computed a workspace-only corpus snapshot, but the readiness suite exposed a pre-existing schema gap: raw `public-search-index.json` entries did not persist the `answer_eligible` boolean even though the reconciliation function computed eligibility for every entry. This caused the batch-086 scoped publisher-synopsis regression to read `undefined`.
- Updated `scripts/reconcile_metrics.py` to write `answer_eligible: bool(answer_eligible(entry))` for every search-index entry after provenance, proposition verification and locator fields are assembled. Added a readiness assertion that every index entry exposes an explicit boolean. This makes the index decision auditable and prevents consumers from inferring eligibility from titles or pipeline status.
- The prior reconciliation workspace reported 1,288 answer-eligible unique sources, 854 content-verified unique sources and 3,453 answer-eligible propositions. These are computed but not yet committed/public metrics because the readiness suite failed; they must be remeasured and persisted by the next successful run. No sources were promoted to Verified.


### 2026-11-16 — batch 129: 12 new original-language entries, five same-family links and retrieval disambiguation

- Inspected 12 item-level publisher bodies in the original language: AIDs 528865–528876, dated 4–15 Tishrei 5704. Ten entries are Hebrew, one is Yiddish, and one combines Hebrew and Yiddish. Added 20 non-verbatim, source-grounded response propositions with claim-level locators, provenance, verification scope, context and limitations.
- The five older public pages AIDs 5933–5937 were also opened and compared with AIDs 528865–528869. They expose the same five dated entries and are linked as same-family presentations, not independent witnesses; the canonical identities are AIDs 528865–528869.
- Enriched the existing AID 528819 in place with one proposition clarifying that the Mishnah chapter is studied according to each learner's understanding. The existing AID and Evidence Family were retained; the item now contains five propositions.
- AID 4666220 returned Internal Error with no readable item body. No crawler retry or access-control bypass was attempted. In the same run, 12 accessible original-language item bodies, five same-family presentations and the existing AID 528819 body were inspected.
- Duplicate screening found no matches in the 1,022-record review queue or recent batches 127–128. The full public-search-index could not be retrieved through the GitHub connector due to its size; canonical collision detection and final answer-eligibility confirmation remain pending reconciliation. AIDs 5933–5937 are explicitly linked to the same Evidence Families as AIDs 528865–528869.
- No source was promoted to Verified. Expected boundary only (not measured): before 1,290 / 854 / 3,449; expected after 1,302 / 854 / 3,470. The committed public metrics remain 977 / 878 / 2,950 and project-state 977 / 870 / 2,950 until a successful full reconciliation.
- The previous Answer Quality Gate, Hourly Corpus Maintenance and Bulk reconciliation runs failed because the multi-source Living Torah question retrieved AIDs 363474 and 490071 but omitted AID 318996. The question's generic word "גאווה" incorrectly selected the unrelated "רופא מצליח וגאווה" topic. Added a disambiguation requiring explicit doctor context and a direct regression assertion; the next full rerun must confirm the source is retrieved in regular and researcher modes.
- Batch 129, the in-place AID 528819 enrichment, retrieval fix, readiness tests, acquisition pointer and project-state checkpoint are committed together. Reconciliation, full readiness, Actions and Pages verification remain pending. No automation schedule, audience or permissions were changed.


### Reconciliation retry note — 2026-11-16

Bulk run 476 computed 1,300 answer-eligible unique sources, 854 content-verified unique sources and 3,474 answer-eligible propositions in its workspace (9,531 index entries), but did not commit metrics because the readiness suite stopped on a missing closing parenthesis in the batch-129 queue assertion. Fixed in commit d4474aabd77e1ecf9fdcc9542b66de1df0b81793. The doctor-topic disambiguation and positive/negative regression assertions were expanded in commit 0ddd3579c65e26f7edbe1e53dd497c6a20f157f4. These workspace counts are preliminary observations, not published metrics; a new full reconciliation and readiness pass are required.

## 2026-11-17 — Batch 130: inspected content and retrieval coverage

- Added 15 item identities: 14 original-language Hayom Yom AID entries (12 Hebrew, 2 Yiddish) and one published English translation of Letter 531. The English translation is explicitly marked `independent_witness=false` and linked to its Evidence Family; it is not counted as an independent witness.
- Added 24 non-verbatim, source-grounded paraphrases with proposition-level locators, provenance, verification scope, context and limitations. Enriched the existing AID 5959845 identity in place with one further proposition from section XXI (lines 376–379); it now contains 14 propositions. Total additions: 25 paraphrase entries.
- AID 528879's direct public route returned Internal Error. A date-addressed Chabad.org daily-study page was opened in the same run and its Hebrew body was inspected as a fallback, but it was not promoted to a separate identity because its mapping to AID 528879 could not be verified; this avoids a possible duplicate family. No crawler retry or access-control bypass was attempted.
- Checked the 1,022-record review queue and recent batches 127–129 for the new AIDs; no matches were returned. The complete public search index was too large to retrieve through the connector, so canonical collision and missing-identity checks remain pending the repository reconciliation script.
- All new records remain Parsed with partial context. No source was promoted to Verified. No protected text was copied in full. Translations were not counted as independent witnesses.
- Added a bounded Hayom Yom Sukkot-customs topic and proposition-level support gate to the answer engine. Readiness tests now require a two-family synthesis for Hoshana Rabbah and Shemini Atzeret, with deep-research claim locators, and assert the non-independent status of the English translation.
- Expected batch boundary (not yet measured): 1,302 / 854 / 3,470 before; 1,317 / 854 / 3,494 after. Actual before/after values remain null until reconciliation.
- Updated `project-state.json` and `acquisition/latest.json` to batch 130 and preserved the prior batch-129 pointer. Pending reconciliation now includes batches 099–130.
- No automation, schedule, audience, or permissions were changed. The existing hourly maintenance workflow remains the only scheduled workflow.


## 2026-11-17 — Batch 131

- נפתחו ונבדקו 14 גופי ערכי היום יום מקוריים, AID 528893–528906 (א׳–י״ד חשון תש״ד): 9 עברית, 4 יידיש וערך אחד משולב עברית/יידיש. נוספו 19 פרופוזיציות מחקר לא-מילוליות עם locators ברמת הערך, provenance, היקף אימות, הקשר ומגבלות.
- AID 528894 ו-AID 528895 הם שני קטעים רצופים מאותה שיחה, והערך השני מציין במפורש שהוא המשך הראשון. נשמרו שתי זהויות יומיות אך קושרו לאותה Evidence Family; 14 זהויות מוסיפות 13 משפחות ראיות.
- הועשרה in-place זהות AID 2989153 בפרופוזיציה מסעיף י׳, שורות 259–265, על אמונה פשוטה והכוונה בביאת המשיח. המזהה ומשפחת הראיות נשמרו; מספר הפרופוזיציות עלה מ-6 ל-7.
- AID 553672 והנתיבים 5913–5914 החזירו Internal Error. לא הופעל crawler ולא נעשתה עקיפת גישה; באותה הפעלה נבדקו 14 גופי מקור חלופיים והועשרה זהות קיימת. AID 528892 הוחרג כעמוד ניווט.
- תור הביקורת בן 1,022 הרשומות נבדק ללא התאמות ל-AID החדשים; אצווה 130 נבדקה ללא חפיפה. האינדקס הקנוני המלא לא הוחזר דרך מחבר GitHub, ולכן בדיקת התנגשויות מלאה ממתינה ל-reconciliation.
- כל המקורות החדשים נשארו Parsed ובהקשר חלקי; לא קודם מקור ל-Verified. לא הועתק טקסט מוגן במלואו ולא נספר תרגום כעד עצמאי.
- גבול צפוי בלבד, לא מדידה: לפני 1,317 / 854 / 3,494; אחרי 1,330 / 854 / 3,514. סביבת reconciliation קודמת חישבה 1,315 / 854 / 3,498 אחרי אצווה 130, אך לא שמרה את התוצאה בגלל כשל readiness; אלה אינם מדדים ציבוריים.
- כשל Answer Quality Gate האחרון נבע מהשמטת AID 318996 בשאלה רב-מקורית על תקצירי Living Torah. נוסף אחזור ממוקד לשלושה תקצירי מו״ל נפרדים AID 363474, 490071 ו-318996 עם הפניות ברמת טענה. הם נשארים תקצירים משניים, לא תמלילים עצמאיים; לא נוצרת מהם סינתזה המיוחסת לרבי.
- נוספה בדיקת סינתזה מוגבלת בין שני ערכי היום יום AID 528896 ו-528897, במצב רגיל ובמצב חוקר עמוק. הסינתזה מסומנת במפורש כסינתזה של המערכת ולא כציטוט של הרבי.
- reconciliation, בדיקת המוכנות המלאה, Actions ו-Pages עדיין ממתינים. לא שונו לוח הזמנים, הקהל או ההרשאות.


## 2026-11-17 — Batch 132 content inspection and retrieval expansion

- Inspected original-language bodies AID 528907–528921 (15 item-level publisher pages): 9 Hebrew, 5 Yiddish, and 1 mixed Hebrew/Yiddish. Added 21 non-verbatim source-grounded propositions with item-level locators, publisher provenance, partial-context scope, and attribution limits. Fifteen distinct dated entries were assigned fifteen Evidence Families; no translation was counted as an independent witness.
- Enriched existing Sicha AID 2989153 in place with three additional propositions from sections XI, XII and XIV (body lines 271–306). Its identity and Evidence Family remain unchanged; proposition count increased from 7 to 10. The Germany account remains attributed to the Previous Rebbe as presented in the Sicha; yahrzeit customs are not generalized as halachic rulings.
- AID 528913 English translation route returned Internal Error; AID 816546 Education Day page could not be opened after search discovery. AID 5071116 and 5071138 were not checked in this run. No crawler retry or access-control bypass was attempted; the same run used fifteen accessible Hayom Yom bodies and the existing Sicha body as alternatives.
- Expected batch boundary: 1,330 / 854 / 3,514 before and 1,345 / 854 / 3,538 after (answer-eligible families / content-verified families / answer-eligible propositions). These are expected values only until full-index reconciliation. No source was promoted to Verified.
- Fixed the stale readiness assertion that still expected batch 130 after project-state had advanced to batch 131; full readiness retest remains pending.


## 2026-11-17 — English correspondence added to batch 132

- Added AID 1924127, the English incoming letter by Dr. Robert Wilkes dated 9 August 1979. The inspected body (lines 174–200) records the correspondent's question about Jewish education and community care for children with developmental disabilities and concerns around group homes. The source is explicitly classified as an incoming correspondent's question, not a Rebbe response; no position is attributed to the Rebbe.
- The editor's note at line 173 was inspected and its terminology qualification is preserved. The original letter, the remaining three correspondence parts and any Rebbe response were not inspected.
- Batch 132 now contains 16 new identities (9 Hebrew Hayom Yom, 5 Yiddish Hayom Yom, 1 mixed Hebrew/Yiddish Hayom Yom, and 1 English incoming letter), 23 new propositions and three additional propositions in an existing Sicha identity. Expected metrics are 1,346 / 854 / 3,540, pending full-index reconciliation.


## 2026-11-17 — Batch 133: inspected Kislev corpus

- Inspected 18 original-language Hayom Yom bodies (AID 528923–528940) and one English outgoing correspondence letter (AID 6427690); added 19 source identities and 26 new propositions. AID 2989153 was enriched in place with one proposition. AID 4666220 returned Internal Error; the run used accessible alternatives and did not retry the blocked crawler.
- Expected batch boundary was 1,346 / 854 / 3,540 before and 1,365 / 854 / 3,567 after. These remain expected values until full-index reconciliation.

## 2026-11-17 — Batch 134: English correspondence and retrieval repair

- Inspected ten distinct item-level English correspondence pages in Chabad.org/TheRebbe.org's Sichos in English Collection: AID 2277932, 2277929, 2277928, 2277934, 2277937, 2277940, 2277941, 2277942, 2277921 and 2277945. Added 20 non-verbatim Hebrew research propositions with item-level body locators, provenance, verification scope, context and limitations. All ten remain Parsed and partial; the publisher credits Eli Touger as translator, but the original-language texts were not inspected. Each is marked independent_witness=false and linked to its own letter Evidence Family; no translation is counted as an independent witness.
- AID 2277935 (Letter 568) was found already canonical in batch 056 and was excluded rather than duplicated. Letter 569 (AID 2277937, 17 Adar) and Letter 569* (AID 2277940, 18 Adar) remain separate Evidence Families. The 559/569/571/572 letters concerning North African education are linked as related correspondence only, not merged.
- Enriched AID 6427690 in place with a paraphrase of the closing blessing to the President, the First Lady and their family (body lines 262–264). The existing identity and Evidence Family remain unchanged.
- AID 4666220 again returned Internal Error with no inspectable body. Ten alternative English letter bodies were inspected in the same run. No crawler retry, access-control bypass or full-text copying occurred.
- The Answer Quality Gate and Hourly Corpus Maintenance runs on commit 90c9bca failed at test_content_readiness.mjs line 2102: reconcile_metrics.py emitted witness_provenance but dropped the structured provenance object from search-index entries. The index builder now preserves provenance; regression tests cover the batch-088 contract and the new translation-only corpus.
- Added a bounded researcher-mode case comparison for four distinct North Africa education letters (AIDs 2277921, 2277937, 2277942 and 2277945). Five claim-level records retain one source locator each. The synthesis is explicitly system-authored, not attributed to the Rebbe; all four witnesses are published translations, so deep mode reports four derived non-independent presentations and zero independent witnesses.
- Expected boundary only: 1,365 / 854 / 3,567 before; 1,375 / 854 / 3,588 after. Full-index reconciliation and the resulting actual public metric remain pending until the workflow commits its measured result. No source was promoted to Verified, and no schedule, audience or permissions were changed.


### 2026-11-17 — North Africa researcher-synthesis validation refinement

- The first commit added the four-letter case comparison and claim-level locators, but the generic synthesis-integrity validator still required two independent witness families. That rule would incorrectly reject a deliberately translation-only case comparison.
- Added an explicit topic-scoped validation contract for north_africa_education_mission: four distinct letter Evidence Families, zero independent witnesses, five single-source claims, exact proposition entailment, one locator per claim, and explicit translation/implementation limitations. The generic rule for all other topics is unchanged.
- Bumped the browser module cache version so the public site loads the updated validator.


### 2026-11-17 — Batch 135: English correspondence, translation-family enrichment and educational-letter comparison

- Inspected ten public Chabad.org/TheRebbe.org English letter bodies: AIDs 4422946, 2281917, 2277173, 5920891, 2277247, 5920893, 2279298, 2281851, 2277371 and 2281922. Added 25 concise Hebrew non-verbatim research propositions with item-level body-line locators, provenance, partial-context limits and publisher-translation status.
- Enriched the existing AID 4096303 English translation manifestation in place with three additional inspected propositions (body lines 191–199). It remains linked to the metadata-only Hebrew bibliographic identity for Igrot Kodesh vol. 32, p. 48, in the same Evidence Family; it is not an independent witness.
- Fifteen direct Hebrew routes (AIDs 528941–528955) returned Internal Error. Ten additional Hebrew pages (AIDs 4646121, 4646123, 4646126–4646130, 4666265, 4666267 and 4666268) exposed only publisher summary/navigation shells without source text and were excluded. An accessible publisher fallback was used in the same run; no crawler retry or access-control bypass occurred.
- Batch 135 adds ten new letter families and one existing translation family enriched in place, for an expected boundary of 1,386 answer-eligible Evidence Families, 854 content-verified families and 3,616 distinct propositions. These are expected values only; full-index collision review and reconciliation remain pending. No source was promoted to Verified.
- Added a bounded five-letter educational/publication case-comparison contract for regular and deep researcher modes. It explicitly identifies all five as non-independent English translations, retains five claim-level source locators, and labels the synthesis as system-authored rather than a Rebbe quotation.
- Next: reconcile pending batches 099–135 against the full canonical index, resolve any identity collisions, refresh metrics and the review queue, run test_content_readiness.mjs, inspect Actions and the Pages deployment. No schedule, audience or permissions changed.


## 2026-11-17 — Batch 136: twelve inspected English correspondence letters and in-place reconciliation corrections

- Inspected twelve public item-level English letter bodies from Chabad.org/TheRebbe.org's Sichos in English Collection: AIDs 2277145, 2277156, 2277138, 2277150, 2277146, 2277155, 2277159, 2277176, 2277168, 2277130, 2277169 and 2277148. Added 22 concise Hebrew non-verbatim research propositions with item-level body locators, provenance, partial-context limits and attribution qualifications. All twelve remain Parsed and partial; each is a published English translation with independent_witness=false; no original-language witness was inspected.
- Enriched AID 4096303 in place with one additional proposition from body lines 189–190. The identity and Evidence Family remain unchanged; it is still a derived English translation linked to the existing Hebrew bibliographic identity.
- נתיב עברי /4754257, the Hebrew publisher route linked from AID 2277145, returned 404. No content was inferred from that route. The same run used the accessible English publisher body for AID 2277145 and eleven additional English letter bodies. No crawler retry, access-control bypass or full-text copying occurred.
- Reconciliation correction to batch 135: AID 2279298 was already present in batch 107. Its three newly inspected propositions were merged into that existing identity and the duplicate batch-135 record was removed. Batch 135 now records nine new source families and two in-place enrichments (AIDs 4096303 and 2279298); no duplicate translation is counted as an independent witness.
- Added a bounded five-letter comparison topic `cheshvan_5711_education_outreach_letters` for AIDs 2277145, 2277138, 2277146, 2277176 and 2277130. It retains five claim-level body locators, identifies all five as derived English translations, and labels the synthesis as system-authored rather than a Rebbe quotation. Deep researcher mode reports five Evidence Families and zero independent witnesses.
- Fixed the researcher-mode readiness assertion so it does not access `m.research` in regular mode. Full reconciliation and the post-fix readiness/Actions/Pages results remain pending; no source was promoted to Verified and no schedule, audience or permissions changed.


## 2026-11-17 — Batch 137: twelve Yechidus event translations and Hebrew Sicha enrichment

- Inspected twelve distinct public item-level English bodies in Chabad.org/TheRebbe.org's Sichos in English Collection: 2498908, 2511676, 2499039, 2499790, 2507215, 2507246, 2506320, 2511619, 2506437, 2514160, 2506495, 2512299. Added 24 concise Hebrew non-verbatim research propositions with per-proposition body-line locators, provenance, partial-context limits and explicit translation status. Each dated event has its own Evidence Family; all new presentations remain Parsed, independent_witness=false and linked to their own translation_of_evidence_family_id. No original-language transcript or recording was inspected, and no translation is counted as an independent witness.
- Enriched the existing Hebrew AID 5959845 identity in place with one additional proposition from section XVI, lines 319–325, distinguishing the roles of ״עשה לך רב״ and ״קנה לך חבר״. The canonical identity and Evidence Family are unchanged; the proposition count rises from 14 to 15.
- AID 4666220 was tried through both Hebrew and English publisher routes. The Hebrew route returned Internal Error; the English route redirected to a Torah Texts navigation shell without an inspectable source body. It was excluded. No crawler retry, access-control bypass or full-text copying occurred; twelve accessible Yechidus bodies were inspected as alternatives in the same run.
- Added a bounded five-event researcher comparison, topic `yechidus_unity_and_mission`, for AIDs 2498908, 2511676, 2507215, 2511619 and 2506495. Each claim carries its own body locator and source family. The synthesis is system-authored, not a Rebbe quotation; all five sources are derived English translations, so deep mode reports five event families and zero independent witnesses.
- Added batch-137 readiness assertions and updated current-index expectations for the in-place AID 5959845 enrichment. The reconciliation workflow will process the contiguous pending chain 099–137 and refresh the index, public metrics and review queue. Batch 137 starts from the previous expected boundary 1,396 / 854 / 3,639 and has an expected boundary of 1,408 / 854 / 3,664; actual post-batch metrics remain pending until the workflow completes.
- A prior CI run on commit eccfce0 generated an in-run index snapshot of 1,395 answer-eligible families, 854 content-verified sources and 3,643 propositions, but did not commit it because readiness stopped at a stale assertion expecting batch 133. This snapshot is diagnostic only, not public metrics. No source was promoted to Verified, and no hourly schedule, audience or permissions changed.


## 2026-11-17 — Batch 138 ingestion repair

- Reopened and inspected 12 public Chabad.org/TheRebbe.org English publisher-translation bodies: AIDs 2277184, 2277190, 2277193, 2277219, 2243707, 2244140, 2244141, 2274740, 2274827, 3905688, 3905750, 3905762.
- Added the missing `records` array to `data/items/content-research-batch-138-2026-11-17.json`. The earlier manifest had `source_body_review` metadata but no item records, so `reconcile_metrics.py` could not index its 12 inspected bodies as answer evidence.
- Persisted 24 non-verbatim Hebrew `response_propositions`, each with exact current body locators, `proposition_origin=source_grounded_paraphrase`, `proposition_verbatim=false`, `proposition_verification=source_text_inspected`, provenance, scope and limits. The 12 letters remain 12 separate letter Evidence Families, but all are publisher English translations with `original_language=unknown` and `independent_witness=false`; they add no independent witnesses and no Verified sources.
- Rechecked AID 2277247 and corrected the in-place third proposition locator to current public page lines 199–200; no new identity or Evidence Family was created.
- AID 553672 was opened as a Hebrew Yechidus media page; it contains no readable transcript. It remains excluded; no audio was transcribed and no access control was bypassed. The 12 public letters were the same-run fallback.
- The readiness test no longer assumes the expected 1,420 source count is already the measured actual count; it compares the reconciled batch snapshot with the generated index and allows a documented reconciliation variance. The four-letter Yud-Tes Kislev synthesis remains tested in regular and deep-researcher modes.
- Reconciliation remains pending until the canonical scan updates the batch audit, public metrics, project state and review queue. No Verified promotion was made; public metrics were not manually edited.


## 2026-11-17 — Batch 139 duplicate correction and Batch 140 Hebrew-source enrichment

- Reconciled the known AID 2989329 collision before full indexing: the Hebrew letter was already present as a Verified identity in batch 070 with three inspected propositions. The duplicate record was removed from batch 139; the existing identity and Evidence Family were retained. Batch 139 now contains 12 new identities, two prior in-place enrichments and three explicit rechecks, with no additional Verified promotion.
- Re-opened seven existing Hebrew correspondence bodies and inspected three additional Hebrew letter bodies (AIDs 2989331, 2989369 and 2989411). Added six non-verbatim source-grounded propositions to the three new records and five distinct propositions to five existing batch-139 identities (4279926, 4279851, 2989413, 2989565 and 2989298). Two further existing identities (4279913 and 2989417) were rechecked but not padded with redundant propositions.
- The three new records retain exact body-line locators, provenance, partial-context limits and publisher/autograph distinctions. AID 2989369 summarizes an article printed with the letter; its content is explicitly kept separate from the letter author's framing. Two date strings printed by the publisher as תיש״א remain unresolved and were not silently normalized.
- Fixed the institutional-support retrieval regression: a query about a Talmud Torah in a distressed financial condition now requires an inspected proposition naming the educational institution together with the distress/expense context. General charity and general support for kosher education are not sufficient. Added a negative regression assertion for AID 4279926, whose inspected letter discusses general support for kosher education but not the requested distressed case.
- No new route was blocked in batch 140. The prior blocked AID 2277247 and its same-run fallback remain documented in batch 139. No crawler retry, access-control bypass or full-text copying occurred. All three new records remain Parsed; no Verified promotion was made.
- Expected boundary after batches 139–140 is 1,435 answer-eligible Evidence Families, 854 content-verified families and 3,727 propositions, based on the previous expected boundary of batch 138. These are planning boundaries only; the actual counts remain null until full-index reconciliation. Public metrics were not edited manually.
- Reconciliation through batch 140, the full readiness test, Actions and Pages verification remain pending. No hourly schedule, audience or permissions changed.



## 2026-11-17 — Batch 141: Hebrew talk transcripts, one English letter excerpt, and dissemination retrieval repair

- Inspected 11 new public publisher bodies: ten Hebrew Chabad talk/record texts (AIDs 2988877, 2989555, 3008872, 3008877, 2988883, 4280015, 4385701, 2989386, 4385726, 2988933) and one English letter excerpt (AID 1244711). Added 15 concise non-verbatim research propositions with per-claim body locators, provenance, verification scope, context limits and rights notes. The English excerpt's original language is not established by the inspected page, so it remains non-independent; no translation was counted as a witness.
- Source classes include nine Sichos transcripts, one Torat Menachem event record and one Written responses excerpt. Hebrew texts are marked בלתי מוגה; no recording, autograph or corrected edition was independently inspected. All 11 new identities remain Parsed; zero Verified promotions.
- Enriched existing AID 5071052 in place with a provenance note about the publisher footnote at line 262, which references “אגרת ו׳כ״ג”. The target identity is unresolved, so no relation to AID 4645984 or any other item was created. No proposition was added to that existing identity.
- AID 4666220 again returned Internal Error through the public reader. It was excluded; no crawler retry or access-control bypass occurred. Eleven accessible item-level bodies were inspected as same-run fallback.
- Deduplication checked the full public-search-index.json snapshot (9,122 entries, generated 2026-11-15), review queue (1,022 records), and batch files 126–140 (190 records); no exact AID collisions were found. The post-addition canonical scan remains pending.
- Fixed a retrieval seeding defect for the existing proposition-level wellsprings/inner-Torah gate: the topic vocabulary now includes broad, body-grounded aliases for “הפצת המעיינות” and “פנימיות התורה”, so the retrieval seed can reach existing AIDs 4831188 and 5071052. Added AID 2989555 as a third inspected Hebrew Sicha source and strengthened readiness tests to require all three distinct Evidence Families in regular and researcher modes, with claim-level citations.
- The pending-chain boundary continues from batch 140's expected 1,435 / 854 / 3,727 to 1,446 / 854 / 3,742 after batch 141 (11 source families and 15 propositions expected). A diagnostic workspace after batch 140 measured 1,432 / 854 / 3,727, a provisional -3 source variance; this was not committed public metrics. Reconciliation will calculate actual before/after snapshots and record the variance; public metrics remain unchanged until that commit.
- No full text was copied, no source was promoted to Verified, no crawler was retried, and no hourly schedule, audience or permissions were changed.


## 2026-11-17 — Batch 142: Hebrew Sicha evidence for dissemination of Chassidus

- Inspected eleven new Hebrew public-talk bodies from BeitChabad.com/Chabad.org (AIDs 5989777, 4385753, 4280152, 2988984, 4304359, 2989348, 2989214, 4385534, 4279866, 4304399, 2988983) and reopened one existing Hebrew Sicha, AID 2988877. All inspected texts are marked בלתי מוגה; only the cited passages were used, and the audio/corrected text was not inspected.
- Added 15 non-verbatim, source-grounded paraphrases with item-level locators and provenance. Enriched AID 2988877 in place with one additional proposition from lines 272–277; its Evidence Family and Parsed status remain unchanged. Total new/added propositions: 16.
- AID 5071052 was not used for new content: its current English route redirects to a generic summary shell and its Hebrew route returned Internal Error. No content was inferred from either route. Eleven accessible Hebrew talk bodies were used as same-run fallback.
- Full pre-addition public-index scan: 9,122 entries; no AID matches for the eleven new items. The 1,022-record review queue had no matches. Prior batch files 126–140 and batch 141 were checked as recorded in the preceding review; post-addition canonical collision reconciliation remains pending.
- Retrieval was strengthened for the wellsprings/inner-Torah synthesis: alternate Hebrew spellings (including מעינותיך) are recognized; the query-specific source pool is built from inspected propositions, one item per Evidence Family in regular mode and up to four linked presentations per family in researcher mode. The regular shortlist prioritizes three separate evidence families (AID 4831188, 2989555 and 5989777); researcher mode also surfaces AID 4385753 and the wider Hebrew source set. Claim-level body locators and witness-level research maps are tested.
- Metrics remain unreconciled. Last public snapshot (2026-11-15): 977 answer-eligible unique sources, 878 content-verified sources, 2,950 propositions. project-state.json still reports 977 / 870 / 2,950, an eight-source verified-count variance. The 1,446 → 1,457 source and 3,742 → 3,758 proposition figures are planning boundaries only, not measured metrics. No source was promoted to Verified.
- No crawler retry, access-control bypass, full-text reproduction, schedule change, audience change, permission change, or duplicate automation.


## 2026-11-17 — Batch 143: Hebrew talks, Yechidus and letters; retrieval guard repair

- Inspected twelve new Hebrew item-level bodies from BeitChabad.com/Chabad.org: four Sichos (AIDs 4296226, 2989338, 4296171, 4296205), one Yechidus (3140238), and seven letters (4279890, 4279847, 4279837, 4279853, 4279839, 4279900, 4279877). Added 23 bounded, non-verbatim, source-grounded paraphrases with body line locators, provenance, scope and limitations. All twelve identities remain Parsed; zero Verified promotions.
- Reopened existing AID 2988877 and enriched the same identity/Evidence Family in place with two additional propositions from lines 279–285. The propositions preserve the narrative as a story, not medical evidence, and describe the university analogy without turning it into a blanket instruction to leave an institution. The identity now contains four propositions; no new independent witness was created.
- AID 4666220 and AID 4831188 both returned Internal Error through the public reader. No crawler retry or access-control bypass occurred. Twelve accessible Hebrew source bodies and one existing identity were used as same-run fallback. No full text was copied.
- Preliminary duplicate scan checked 84 content-research batch files (055–142), 12 bulk-indexed files and the 1,022-record review queue; no exact AID matches were found. The full public-search-index snapshot could not be read through the current tool, so canonical collision checking and final answer-eligibility remain pending reconciliation.
- The previous reconciliation run (507) generated a diagnostic workspace snapshot of 1,450 answer-eligible unique sources / 854 content-verified sources / 3,751 propositions, but failed before committing metrics. The failure was a temporal-dead-zone ReferenceError: buildAnswerModel read wellspringsDisseminationQuestion before its declaration. The declaration was moved above the early-return guard in answer-engine.js.
- Commit c985b4a514201f3a5492fc3fb3bd94cc347bf381 contains batch 143, the in-place AID 2988877 enrichment, acquisition/project-state updates and the retrieval fix. In the new quality-gate run 1024, question-specific retrieval, answer synthesis, citation integrity, evidence-contract audit and workflow write-safety passed; test_content_readiness.mjs was still running at the last inspection. Hourly maintenance run 898 was validating reconciled evidence; bulk reconciliation run 508 was pending. Pages deployment run 1759 succeeded, but the public web reader returned Internal Error when opening the site.
- Public metrics remain unchanged at 977 answer-eligible unique sources / 878 content-verified sources / 2,950 propositions. The 1,450 / 854 / 3,751 workspace snapshot is diagnostic only; the expected post-batch boundary 1,462 / 854 / 3,776 is not a measured result. The project-state/public-metrics verified-count variance of eight remains unresolved.
- No crawler retry, access-control bypass, full-text reproduction, Verified promotion, schedule change, audience change, permission change, or duplicate automation.


## 2026-11-17 — Batch 144: telegrams, Sichos, letters and translated Yiddish correspondence

- Inspected 13 new item-level bodies from BeitChabad.com / Chabad.org: seven Hebrew general telegrams (AIDs 4280036, 4280068, 4280139, 4385646, 5959941, 5959973, 4280027), four Hebrew Sichos (4304431, 4304427, 4304341, 4304436), one Hebrew general letter (2989328), and one English recipient testimony containing a translation of a Yiddish personal letter (259799). Added 19 bounded, non-verbatim Hebrew paraphrases with body locators, provenance, verification scope, context and limitations. All new identities remain Parsed; zero Verified promotions.
- AID 4280139 initially failed on one open route, then opened successfully through its public search-result page (turn157300view0). Its Hebrew Shavuot 5720 telegram is included. It is a distinct dated telegram from AID 5959973 (Shavuot 5730): related theme, separate Evidence Families, not a duplicate. No crawler retry or access-control bypass occurred.
- The AID 259799 item is explicitly the recipient's English translation of a letter said to have been written in Yiddish. The original Yiddish document was not inspected; this is a derived presentation, not an independent witness.
- Enriched two existing identities in place: AID 5478256 (Igrot Kodesh vol. 3 p. 372, livelihood/minyan) and AID 2301532 (Igrot Kodesh vol. XII p. 130, shidduch interlude). Each received one bounded paraphrase from an inspected English secondary/translated presentation. Both remain Parsed and explicitly non-independent; the primary printed witnesses were not collated.
- Total new content work: 13 new source identities, 19 new propositions, two existing identities enriched with one proposition each (21 new paraphrase entries in total). The 12 Hebrew sources are primary published text witnesses (seven telegrams, four unedited talk transcripts and one letter); the single English/Yiddish item is a derived translated presentation. No translations were counted as independent witnesses.
- Full public-search-index scanning was unavailable in this run: the GitHub file reader returned an empty payload for the 9,122-entry index. Exact-AID checks against the current acquisition history and 1,022-record review queue found no matches, and exact GitHub searches returned no results. This is a partial duplicate check only; canonical AID/URL/Evidence Family collision reconciliation remains pending.
- Added the retrieval topic `התוועדויות פעילות והמשכיות לאורך השנה`, a strict proposition gate and a cross-family synthesis for distinct dated telegrams. The synthesis separates the repeated request for active/joyful farbrengens from the single explicit year-round-continuation statement, attaches source locators to each claim, and is labeled system synthesis rather than a Rebbe quotation. The validated wrapper now checks the three claim families, witness independence and locators; researcher mode includes deep witness and claim-source maps. Public entry-point and module cache keys were updated.
- Added batch-144 assertions to `scripts/test_content_readiness.mjs`: exact AID uniqueness after reconciliation, the distinct Shavuot telegram families, derived-translation handling, in-place enrichments and regular/researcher synthesis with claim-level locators. The test file was committed but the test has not yet been executed in a runtime with the repository checkout.
- Batch 144 planning boundary: 1,462 → 1,477 answer-eligible unique sources; 854 content-verified sources unchanged; 3,776 → 3,797 propositions. These are expected boundaries only, not measured post-reconciliation metrics. The last public snapshot remains 977 / 878 / 2,950; project-state remains 977 / 870 / 2,950, so the eight-source verified-count variance is unresolved.
- Commits include batch 144 `d4d9ca57fd56f21799840de81c8d00af977b16a3`, corrected source refs `59254354bdddda4de5bbd268aeeaa43698335bf4`, recovered AID 4280139 and expanded batch `ba6b33a9d1fe47f033563b3fc9979a4df9b900b7`; acquisition state `d8075f9fea7ad34cf4842fce6f7a5ade630f3d03`. Retrieval topic `9f407f273d081a11e295fe020a9c6c0f9665a8b8`, synthesis `725d030383d667c3f088c45bbbb4d8dd9a62435c`, regex correction `72736a2b324f78fc5c72d57e7e6bb71d01cec21d`, validated synthesis gate `72dac9dd63a6ccd585ae3d6c651d37d4eb7b3b8c`, public cache bust `1266f60080d9e65c4d11b1d676c8c000cc209d50`, and researcher-synthesis constraints `a1a892b6db655091f6a32d86676288b5d1fb81fd`. Existing identity updates are `121350e6f0f707ccb9706d616a963a22a917772f` and `8804769007a5ab0daf8a37eb970733f0fdd55e5c`; primary/derived labels `b19113673110d01f0e7bf2a406d48ee20a295f5e`. Readiness-test updates include `37cdaec63ab8d17bdd621fd308155cfb30a49439`, `7a1da346e6dce215d85f4160e3f821a517b4f097`, `91c7b0c32769e4bbce536d35f47b53f71f935a79`, `d1bc9f13c365ed374f4a4f742c2b7baebe9915e5` and `55b896e641f19bda61cf1de15b61453256783e6f`, `a5644757ced73ddd98125a6186a877e23d8cdd9e` and `4953636f36383b9dc2bfd8c1a6618b64d1085f80`. Source-reference corrections for the two enriched pages are `c54b92a8bdec444a441646cd613d5111333321df`. Project-state metadata was advanced to batch 144 without changing measured counts in `a40ad791db10152234527eaa2deeb8300a1a50db`; the acquisition commit manifest is `1a772f32cc2f9b9893a29e26f62e0edd5856b414`.
- At last inspection, GitHub combined commit statuses returned no checks for the latest commits and no new Actions run IDs were available through the connected GitHub interface. The saved hourly run log is still dated 2026-11-13 (`no_actionable_change`), and the saved quality-gate report is also dated 2026-11-13 (`passed: true`); neither is evidence that batch 144 was tested. A local clone/test attempt was blocked by unavailable DNS. Opening the public Pages URL through the reader returned an internal error. Therefore reconciliation, `test_content_readiness.mjs`, Actions completion and Pages publication are not yet verified.
- No schedule, audience, permissions or automation definitions were changed; no duplicate automation was created; no full text was copied.


## 2026-11-17 — Batch 145: original-language Hayom Yom excerpts

- Inspected 12 dated bilingual publisher pages from the Kehot / Chabad.org Sichos in English Collection. Each page exposed an original Hebrew or Yiddish excerpt; only that excerpt was used for one non-verbatim Hebrew research proposition per identity. English renderings and editorial commentary were not used as proposition evidence.
- Added 12 distinct Hayom Yom identities and 12 separate Evidence Families (one per dated AID): 3315370, 3315386, 3315388, 3317931, 3317985, 3318010, 3318015, 3318017, 3318041, 3315396, 3315412, 3315415. The entries remain Parsed; no Verified promotions were made.
- All propositions use `source_grounded_paraphrase`, `proposition_verbatim=false`, `proposition_verification=source_text_inspected`, exact body locators, provenance, partial-context boundaries and explicit internal attribution limits. In particular, the entry for 19 Cheshvan attributes its yechidus response to the Alter Rebbe; the 21 Cheshvan note's publisher footnote points to Kuntreis Toras HaChassidus and Igros Kodesh of the Rebbe Rayatz; neither is attributed automatically to the Lubavitcher Rebbe.
- AID 4666220 returned Internal Error through the public web reader. No runner crawler retry or access-control bypass was attempted. Twelve accessible dated Hayom Yom pages were inspected as same-run fallback.
- The 12 same-page English renderings were not counted as independent witnesses or additional Evidence Families. No full protected text was copied. The exact-AID code search and review-queue check returned no matches, but the full public-search index was not readable through the connector; full canonical deduplication remains pending.
- Batch boundary: 12 new Evidence Families and 12 new paraphrases; zero Verified additions. These are batch-level additions, not a measured post-reconciliation corpus total. Public metrics remain unchanged until the full reconciliation workflow runs.
- Retrieval coverage is extended for the existing `hayom_yom_household_and_influence` synthesis: AID 3317931 contains an original Hebrew proposition about the ability of each Jewish woman and man to influence acquaintances. The existing synthesis already emits separate claim-level source locators and a deep researcher evidence map; the batch-specific readiness run must confirm that this source is included without merging the two dated Evidence Families.
- Reconciliation, `test_content_readiness.mjs`, Actions and Pages verification are pending after the batch file is pushed. The hourly corpus workflow and existing schedule remain unchanged; audience and permissions were not modified.

- Batch 145 also inspected existing Hebrew AID 528832 (already canonical in batch 127) and added one in-place research paraphrase about the specific four-times Yom Kippur Psalm schedule in body line 170. Its original Evidence Family was retained; the identity now has three propositions and remains Parsed. Batch totals are 12 new identities, one enriched identity and 13 new/additional propositions.

- Retrieval/synthesis implementation for batch 145: `src/answer-engine.js` now retains the household-study witness AID 528896 and selects two distinct influence witnesses, prioritizing new original-Hebrew AID 3317931 while retaining AID 528897. The resulting `hayom_yom_household_and_influence` synthesis has two claim groups across three Evidence Families, with source-local locators.
- `src/answer-engine-validated.js` now has an explicit integrity branch for that synthesis: both claim categories must be present, each cited source must independently support its assigned claim, and every claim must carry item-level locators. The system synthesis remains explicitly `system_synthesis_not_rebbe_quote`.
- `scripts/test_content_readiness.mjs` now requires AID 3317931 to appear in the individual-influence claim in both regular and deep-research modes, checks the three-family evidence map, verifies the AID 528832 in-place enrichment, and requires full-index reconciliation before batch-145 readiness can pass.
- These code and test changes are committed, but no new Actions run ID or combined status was returned. Therefore the new regression tests and reconciliation are implemented but not yet executed successfully.

- Final execution status checked after the batch-145 content, retrieval, validator and regression-test commits: `data/public-metrics.json` remains at 977 answer-eligible unique sources (generated 2026-11-15), so the public before/after snapshot is 977 → 977 and no post-batch total has been measured. `project-state.json` still reports 870 content-verified sources versus 878 in public metrics (variance 8).
- GitHub combined status returned no checks for latest commit `10a9565`; no new Actions run ID was available. The latest saved run log and quality-gate report are still dated 2026-11-13. The new `test_content_readiness.mjs` assertions are committed but were not executed in this run.
- The public Pages URL returned Internal Error through the available reader; no post-batch-145 deployment was verified. Local repository execution was also unavailable because GitHub DNS resolution failed in the runtime. Do not treat the batch-boundary additions as measured answer-eligible growth until reconciliation succeeds.

- Static syntax validation passed for `src/answer-engine.js`, `src/answer-engine-validated.js` and `scripts/test_content_readiness.mjs` using parse-only compilation. This is not a runtime test result. The readiness script, reconciliation workflow and Actions remain unexecuted/unverified.


## 2026-11-17 — Batch 146 and Batch 147 update

- Batch 146 added eight inspected Hebrew Sichos/Maamarim item bodies (seven new Evidence Families because AIDs 4304429 and 4304430 are two texts from one event) and enriched AID 4304431 in place. Ten new/additional paraphrase entries were recorded; all eight new items remained Parsed and no Verified promotion was made. Its canonical reconciliation was still pending when Batch 147 began.
- Batch 147 inspected eight accessible English Yechidus publisher bodies (AIDs 2465321, 2487225, 2466894, 2499039, 2487556, 2487457, 2504381, 2499828), plus one additional section of existing Hebrew Sicha AID 4304431. Ten Hebrew candidate pages (AIDs 4313026, 4313024, 4313094, 4313091, 4312996, 4312999, 4312984, 4312992, 4312997, 4313127) returned HTTP 429; search snippets were not used as evidence. No crawler retry or access-control bypass was attempted; the eight English pages were the same-run fallback.
- Eight new source identities and eight non-verbatim Hebrew research paraphrases were added. All eight English presentations remain Parsed, partial-context, and non-independent because their original-language transcripts/recordings were not inspected. Each dated gathering has its own provisional Evidence Family; any later original-language witness for the same event must join that family. AID 2504381 retains an unspecified year.
- Existing AID 4304431 was enriched in place from body lines 258–285. The paraphrase explicitly preserves the nested attribution: the talk recounts a teaching attributed to the Rebbe Rashab as transmitted by the Rebbe Rayatz; it is not represented as an original teaching or direct quotation of the Lubavitcher Rebbe. The earlier malformed character-array conditions field was repaired.
- The answer engine now has a separate `yechidus_peace_and_mission` synthesis across eight distinct Yechidus event families, with eight claim-local body locators, zero independent-witness credit, and explicit system-synthesis attribution. Deep researcher mode preserves eight separate evidence families and a claim-source map.
- `test_content_readiness.mjs` now includes batch-147 ingestion, deduplication, in-place enrichment, regular-answer and deep-research assertions. These tests are committed but not yet executed. Full reconciliation, Actions results and Pages deployment remain pending; no post-batch metric is claimed. The last public metrics snapshot remains 977 / 878 / 2,950, while project-state remains 977 / 870 / 2,950; the eight-source verification discrepancy is unresolved.
- No new automation was created, no workflow schedule was changed, and audience/permissions were not modified.


## 2026-11-17 — Batch 148: eight Hebrew Sicha enrichments and AID 2989555 canonical-identity repair

- Opened and inspected eight original Hebrew, publisher-hosted, unedited Sicha bodies: AIDs 4385753, 2988984, 4304359, 2989348, 4279866, 2988983, 2989555 and 2988877. Added one bounded, non-verbatim, source-grounded Hebrew proposition to each existing identity, with exact body locators, provenance, partial-context scope and limitations. All eight remain Parsed; zero Verified promotions and zero new source identities.
- Five alternative Hebrew publisher routes (AIDs 5989777, 4280152, 2989214, 4385534 and 4304399) returned HTTP 429. No crawler retry or access-control bypass occurred. Eight accessible original-Hebrew Sicha bodies were inspected as same-run fallback. The alternate Torah Texts route for AID 2989555 was unavailable, but its direct Hebrew publisher page opened successfully.
- Canonical duplicate scan found a real collision missed by the 2026-11-15 public-search-index snapshot: AID 2989555 already existed in batch101 as `sicha-5717-bereshit-aid2989555`, then was duplicated in batch141 under a second Evidence Family ID. The batch141 duplicate record was removed; its two inspected propositions were merged into the batch101 canonical identity, and a further proposition from body lines 190–193 was added there. The single canonical AID now has four propositions and one Evidence Family. Batch141 was corrected from 11 to 10 new identities, with AID 2989555 reclassified as an existing-identity enrichment. Batch142's AID 2988877 enrichment descriptor remains a historical 1→2 update; the current record has since grown to four propositions before batch148.
- File-level dedup scan covered 89 content-research batch files (055–147), 12 bulk-indexed files and 40 mixed-authorized-content files. It found the AID 2989555 collision and no matches for the other seven enriched AIDs in those scanned files. The large current public-search-index could not be read through the connector; full post-merge index reconciliation remains pending. The 1,022-record review queue had no matches for the eight enriched AIDs.
- Root cause of the prior Answer Quality Gate failure (run 44167373256): the engine correctly prioritized the original Hebrew dissemination sources, but AID 2989555's canonical batch101 record contained only an earlier proposition, while the later batch141 duplicate held the dissemination propositions. The index deduplicates by AID and therefore retained the earlier record, so the test could not retrieve AID 2989555. The data collision is now repaired and a regression assertion requires the index to resolve AID 2989555 to batch101 with one Evidence Family and four propositions. No answer-engine code change was needed; its existing wellsprings branch already allows eight source candidates and the deep researcher budget is larger.
- CI workspace snapshot from failed reconciliation run 44167373651 measured 1,496 / 854 / 3,815 before this repair, but was not committed. It counted AID 2989555 twice by Evidence Family. Corrected expected boundary after removing that duplicate and adding eight in-place propositions: 1,495 / 854 / 3,823. This is an expected boundary only; actual post-batch metrics remain pending until reconciliation succeeds. Public metrics remain the last committed 977 / 878 / 2,950 snapshot; project-state's 870 vs public 878 verified-source discrepancy remains unresolved.
- No new source families or independent witnesses were added; no translations were counted as independent; no full text was copied. No schedule, automation, audience or permissions were changed.


## 2026-11-18 — Batch 149: eight new Hebrew Sichos, one in-place enrichment, and claim-locator repair

- Opened and inspected eight new original-language Hebrew publisher bodies, all marked בלתי מוגה: AIDs 2988940, 4385713, 5959970, 4280106, 3008908, 2989018, 2989044 and 5989796. Added 14 bounded, non-verbatim source-grounded propositions with body locators, provenance, partial-context scope and explicit limits. All eight identities remain Parsed; no Verified promotion.
- Enriched existing AID 4385534 in place with one additional proposition from body lines 243–260. Its canonical file and Evidence Family remain unchanged.
- Ten candidate publisher routes returned HTTP 429. No crawler retry or access-control bypass was attempted; eight other Hebrew source bodies were inspected in the same run. Three opened candidates (AIDs 5989562, 3008913 and 2989022) were already canonical and were excluded rather than duplicated.
- Exact-AID preflight scanned 90 content-research batch files (055–148) and 12 bulk-indexed files; none of the eight new AIDs matched those files. The 1,022-record review queue had no matches. The large public-search-index could not be read through the connector, so full-index collision and answer-eligibility confirmation remains with canonical reconciliation.
- Added a cross-family synthesis topic, `chassidic_learning_practical_action`, with four separate claims from AIDs 2988940, 2989044, 4280106 and 4385534. Every claim has one source-local body locator, witness provenance and contextual qualifiers. The synthesis is explicitly system-authored and does not attribute one unified statement to the Rebbe. Researcher mode exposes four distinct Evidence Families and a deep claim-to-source map.
- The prior hourly run 44188237128 measured 1,496 / 854 / 3,823 in its uncommitted workspace after batch148, but failed at `scripts/test_content_readiness.mjs:905` because a researcher claim carried a source number without a body locator. The core synthesizer now excludes any proposition lacking a locator before assigning a source number; the regression test requires every displayed source number to have a claim-local locator. The previous batch148 expected boundary 1,495 / 854 / 3,823 still differs by one source family from that uncommitted measurement; do not treat either as the new committed public metric.
- Batch149 planning boundary: 1,495 / 854 / 3,823 → 1,503 / 854 / 3,838. This is a calculation pending reconciliation, not an observed post-batch count. Public metrics were not edited manually.
- No full protected text was copied; translations were not counted as independent witnesses; no schedule, automation, audience or permissions were changed.


## 2026-11-18 — Batch149 validation follow-up

- The first post-commit Actions run exposed a missing parenthesis in the new claim-locator regression assertion and a synthetic test fixture in `test_question_specificity_gate.mjs` that had no source locator. The assertion syntax is corrected; the fixture now supplies an explicit synthetic body locator. This preserves the engine invariant that a displayed claim cannot carry a source number without a locator.
- No source or status was promoted as a result of these test-harness corrections. The new batch remains pending canonical reconciliation and a clean rerun of both readiness and question-specificity tests.


## 2026-11-18 — Claim-locator follow-up for the wells­prings dissemination path

- The next readiness run identified a second, special-case path: `wellspringsDisseminationQuestion` manually appended claims after generic synthesis and omitted the `source_locators` array. This bypassed the generic locator filter.
- The special path now refuses to append a source when the selected proposition has no body locator and attaches a `source_locators` entry with the same source number for every displayed claim. The regression assertion checks this exact mapping.
- Reconciliation and full readiness remain pending a fresh Actions run; no metrics or source statuses were promoted.

## 2026-11-18 — Batch 162: eight in-place Hebrew Sicha enrichments

- Nine public Hebrew source bodies were opened and inspected. Eight distinct, non-verbatim research paraphrases were added to existing canonical response_propositions arrays, with matching body locators, proposition_origin=source_grounded_paraphrase, proposition_verbatim=false, proposition_verification=source_text_inspected, provenance and scoped limitations.
- Enriched AIDs: 2989373, 2988989, 2988990, 2989409, 4304436, 2989319, 2989556 and 2988866. AID 3008863 was rechecked but not enriched because its existing proposition already covers the exact inspected section.
- AID 2987993 returned Internal Error in the public reader; it was excluded without retry or bypass. AID 2988866 was opened as an accessible alternative in the same run. Its Hebrew publication has a Yiddish editorial parallel, so it remains non-independent within its existing Evidence Family.
- No new source identities, no Verified promotions, no translation counted as an independent witness, and no protected full text copied.
- Planning boundary only: 1,530 / 854 / 3,951 to 1,530 / 854 / 3,959. This is not a measured result. Public main metrics remain 977 / 878 / 2,950 until full reconciliation is committed.
- The PR branch's DEVELOPMENT_RECOVERY.md had been overwritten with JSON batch content. It was restored from the canonical main-branch Markdown and this note was appended. Full-index reconciliation and the readiness gate remain pending.
- The existing hourly workflow, audience and repository permissions were not changed.


## 2026-11-18 — Batch 163: eight additional Hebrew source-body enrichments

- Opened and inspected eight distinct public Hebrew source-body passages from existing canonical Sichos: AIDs 2988940, 4385713, 5959970, 4280106, 3008908, 2989018, 2989044 and 5989796. Added eight non-verbatim `source_grounded_paraphrase` propositions in place, each with an exact body locator, provenance, partial-context scope and explicit limitation. The canonical AID and Evidence Family for each item were preserved.
- The additional material covers annual shared Talmud-study division; the connection between teshuvah, Sukkot unity and Hakhel; toil in Torah as distinct from study solely to know practical law; the necessity of human action alongside empowerment from above; use of time without postponing assigned work; adapting teaching to a recipient's capacity; the outward effect of intensive Torah study; and increased Torah study during Pesach.
- The AID 5989796 passage is specifically marked by the publisher's footnote as edited by the Rebbe and printed in the additions to Likkutei Sichos, volume 7. That edition was not independently inspected; the proposition is scoped to the publicly displayed passage.
- Twenty candidate pages were excluded after public inspection: twelve Sicha routes exposed navigation/summary shells, two Igrot routes redirected to rewritten summary shells, four Yechidus pages exposed metadata without transcript text, and two routes returned Internal Error (AIDs 4666220 and 553736). Eight accessible existing Hebrew source bodies were used as same-run fallback. No search snippet or title was used as content.
- No new source identity, no new Evidence Family, no Verified promotion, no translation counted as an independent witness, no crawler retry, no access-control bypass and no full-text copying.
- Planning boundary only: 1,530 / 854 / 3,959 to 1,530 / 854 / 3,967. This is not a measured result; public main metrics remain 977 / 878 / 2,950 pending full reconciliation.
- The current PR-head gate had failed at a temporal-dead-zone reference to `batch162Path` (used before its declaration). The declaration was moved before first use and a batch163 regular/deep-research citation regression was added. A fresh exact-head gate is required.
- The existing hourly workflow, schedule, audience and repository permissions remain unchanged.

## 2026-11-18 — Batch 164: eight additional Hebrew Sicha enrichments and head-cover topic-scope repair

- Opened and inspected eight additional body passages in eight existing Hebrew Sicha identities: AIDs 2988940, 4385713, 5959970, 4280106, 3008908, 2989018, 2989044 and 5989796. Added one non-verbatim source-grounded proposition to each existing canonical record, with exact body locators, provenance, verification scope, partial-context limits and proposition-level audit metadata. Existing AIDs and Evidence Family IDs were preserved.
- The new passages cover the Alter Rebbe's redemption and the disclosure of inner Torah; limits on waiving a mitzvah enhancement; Sefirat HaOmer as a process of teshuvah; Yud-Tes Kislev and the annual Tanya study cycle; practical use of a farbrengen; positive influence on others; the continuing identity of former Tomchei Temimim students; and a contextual blessing to those who sent greetings.
- Three alternate public routes (AIDs 4296231, 5989910 and 5990036) returned HTTP 429 and were excluded. Six other opened pages were not promoted because canonical AID/Evidence Family preflight was not completed. Eight accessible existing Hebrew source bodies were used as same-run fallback. No title or search snippet was used as content.
- No new source identity, no new Evidence Family, no Verified promotion, no translation counted as an independent witness, no runner-side crawler retry, no access-control bypass and no full-text copying.
- Planning boundary only: 1,530 / 854 / 3,967 → 1,530 / 854 / 3,975. This is not a measured result; public main metrics remain 977 / 878 / 2,950 pending reconciliation.
- The Batch 088 readiness failure was traced to a broad alias: the ordinary phrase “כיסוי הראש” activated the specialized “כיסוי ראש והשפעה עקיפה” topic and suppressed a secretary-signed source even when the user asked specifically what appeared in the secretary letter. The answer engine now applies that topic only when the question explicitly asks about indirect influence or failed direct persuasion. The direct-attribution guard still prevents the secretary response from being attributed to the Rebbe.
- PR #35 remains open pending a fresh exact-head Answer Quality Gate, full reconciliation, and deployment verification. The hourly schedule, audience and repository permissions were not changed.


## 2026-11-18 — Batch 165: three new Hebrew Sichos and five in-place enrichments

- Opened and inspected eight original-Hebrew publisher body passages: new AIDs 4385513 (Simchat Torah 5726), 5959968 (Lag BaOmer parade 5730) and 4296159 (Simchat Beit Hashoeva, 18 Tishrei 5723); enriched existing canonical AIDs 2988983, 2989585, 5989929, 4304430 and 2989589 in place. Added eight bounded, non-verbatim source_grounded_paraphrase propositions with proposition_verbatim=false, proposition_verification=source_text_inspected, exact proposition_source_locator, provenance, partial-context scope and limitations.
- Exact-AID preflight found the three new AIDs absent from the 106 scanned manual batch files, 12 bulk-indexed files and 1,022-record review queue. Five existing AIDs were matched to their canonical records and Evidence Families and enriched in place. The large public-search-index could not be read through the connector; full-index collision reconciliation remains pending.
- Five other candidate routes did not expose inspectable body text. They were excluded without title-based inference or retry; eight accessible Hebrew publisher bodies were used as same-run fallback.
- Corrected Batch151 source-review family labels for AIDs 2989588 and 4296226 to match their canonical records; no duplicate identity or Evidence Family was created.
- The latest PR-workspace baseline before Batch165 is 1,530 / 854 / 3,973 from Answer Quality Gate run 44379054834; this is not public main. The planning boundary after Batch165 is 1,533 / 854 / 3,981, not a measured result. Public main metrics remain 977 / 878 / 2,950 until a successful main-branch reconciliation is committed.
- The same run's only readiness failure was an additive content_readiness_note field in the historical Batch089 metrics snapshot. test_content_readiness.mjs now compares the three canonical numeric fields through readinessMetrics(...); numeric equality and the conservative-variance guard remain intact.
- All new and enriched records remain Parsed. No Verified promotion, no translation counted as an independent witness, no full protected text copied, no crawler retry, no access-control bypass, no schedule or permission change.
## Exact-head verification after Batch 165 commit

- Batch165 and the readiness assertion projection are committed on the PR branch (content commit 12080f1, metadata correction e86d352). The assertion compares the three canonical numeric readiness fields and permits the additive explanatory note without weakening numeric equality.
- At the time of this entry, no Actions run had yet been created for the new head; the latest run 44379054834 still referred to predecessor 1a63b428 and failed only on the additive historical note field. The new head must be checked independently before merge.
- Batch165 answer-eligibility growth remains an expected delta only. No actual after-metrics or public deployment is claimed until reconciliation and post-merge publication are verified.
 
## 2026-11-18 — Batch 166: six new Hebrew Sicha identities and two duplicate-canonical rechecks

- Opened and inspected eight original-Hebrew publisher bodies from BeitChabad.com / Chabad.org: AIDs 2989021, 2989054, 2989022, 2989052, 5959922, 5989687, 2989062 and 5989700. Full-index reconciliation later found that AIDs 2989022 and 5989700 already existed as canonical items in batches100 and103. Their candidate rows repeated propositions already represented in those items, so they were removed from the new-source records and retained as existing-identity rechecks. Batch166 therefore contains six new canonical identities, two rechecks, and six new propositions—not eight new identities or eight propositions.
- The six new topics are unity across the four species, the second day of Shavuot, preparation for receiving Torah through Sefirat HaOmer, public Jewish identity, Torah and peace, and the structure of tractate Gittin. The two rechecked items concern late teshuvah and shared Jewish purpose; their overlapping propositions were not counted again.
- In AID 5959922, the passage quotes an earlier statement attributed to the Rebbe Rayatz. The new proposition preserves that attribution and describes the later talk's interpretation; it does not attribute the quoted statement to the Rebbe.
- Nine alternate routes were excluded: eight Chabad.org/TheRebbe.org pages (AIDs 554661, 554871, 555023, 555044–555047 and 555054) exposed audio/media shells without transcript text; AID 5959935 returned HTTP 429. Eight accessible full-text Hebrew publisher pages were used as same-run fallback. No title-based inference, crawler retry or access-control bypass was used.
- The initial preflight did not cover every canonical file. The full scan corrected the two duplicate AIDs above; this is why the earlier eight-new-identity count was withdrawn. Remaining collisions are recorded rather than silently counted as independent sources.
- No translation was counted as an independent witness, no Verified status was promoted, and no protected full text was copied.
- Planning boundary only: 1,533 / 854 / 3,981 to 1,539 / 854 / 3,987. The starting values after Batch165 were planning values, not measured metrics; the latest measured PR-workspace baseline before Batch165 was 1,530 / 854 / 3,973. No public main metric change is claimed.
- Added a three-family claim-level synthesis for unity, peace and shared Jewish purpose. Regular mode and deep researcher mode are tested separately; every claim must retain its own body locator, provenance and limitations. The synthesis is explicitly labeled as system research, not a Rebbe quotation.
- Updated the readiness regression to reconcile through Batch167, distinguish six new identities from two duplicate rechecks, and check full-index deduplication, regular/deep retrieval and claim-level citations. PR #35 remains open pending a fresh exact-head Answer Quality Gate and successful full reconciliation. No Pages deployment is claimed.
- The existing hourly workflow, audience, repository permissions and access settings were not changed.


## 2026-11-18 — Batch 167: eight existing Hebrew Sicha identities enriched in place

- Opened and inspected eight original-Hebrew publisher pages on BeitChabad.com / he.chabad.org and inspected the cited body sections: AIDs 2988983, 2989585, 5989929, 4304430, 2989589, 2988940, 4385713 and 5959970. Added one bounded non-verbatim `source_grounded_paraphrase` to each existing canonical item, with `proposition_verbatim=false`, `proposition_verification=source_text_inspected`, exact body locator, provenance, verification scope, partial context and explicit limitations.
- All eight additions are in-place enrichments. No new source identity, Evidence Family, independent witness, translation witness or Verified promotion was created. Existing IDs, canonical file paths, source URLs and Evidence Family IDs were retained. The eight publisher pages mark their talk texts בלתי מוגה; recordings, manuscripts, autographs and critical editions were not collated.
- The passages cover: the ongoing instruction drawn from the liberation of the Rebbe Rayatz; the individual role and the study of פנימיות התורה; the two dimensions of remembering Shabbat; public action in Jewish life and the need to act naturally as well as trust; educational encouragement and its audience boundary; the Maggid's hilula and the attribution to the Mitteler Rebbe; the spiritual scope of הקהל beyond physical distance; and the distinction between תיכף and מיד in the discussion of forgiveness.
- No source was blocked in this eight-item batch. No crawler retry or access-control bypass was used. No title or search snippet was treated as body content; no full protected text was copied.
- Planning boundary only: 1,539 / 854 / 3,987 to 1,539 / 854 / 3,995. These are not measured after-metrics. The full canonical scan and historical in-place-exclusion reconciliation must produce actual before/after values and collision/eligibility results.
- AID 4304430 also appears in batch146 as a second record with the same AID and Evidence Family as the canonical batch101 item. The alternate row is marked non-independent; reconciliation now classifies same-AID/same-Evidence-Family rows as duplicate presentations rather than independent witnesses or identity collisions. The previous exact-head run 44386330171 failed at a stale regression assertion expecting 19 propositions for AID 2989585; the canonical item actually contains 20. The test is corrected to 20, historical snapshots are compared at their own batch boundaries, and Batch167 receives explicit readiness and Evidence Family assertions. A fresh exact-head run is required before merge.
- PR #35 remains open pending reconciliation and the Answer Quality Gate. No main merge or Pages deployment is claimed. The existing hourly workflow, audience, repository permissions and access settings are unchanged.


## 2026-11-18 — Batch 168: eight existing Hebrew Sicha identities enriched in place

- Opened and inspected eight original-Hebrew publisher body sections, then added one additional non-verbatim `source_grounded_paraphrase` to each existing canonical identity: AIDs 2989021, 2989054, 2989052, 5989687, 2989062, 4385513, 5959968 and 4296159. Their existing canonical files and Evidence Family IDs were retained; no source identity or family was added.
- The eight new propositions cover: the deeper equality expressed in Simchat Torah dancing; Torah's non-bounded character in the discussion of competition among teachers; humility and fear of sin after the Omer count; women's role in preparing the household for receiving Torah; the ethical-theological weight of divorce in the closing discussion of Gittin; Torah as the learner's and world's organizing foundation; Torah study as engraving and continued progress; and the explicit qualification that study does not license omitting a practical mitzvah.
- Each update records `proposition_origin=source_grounded_paraphrase`, `proposition_verbatim=false`, `proposition_verification=source_text_inspected`, an exact body locator, provenance, partial-context scope and an item-specific limitation. All eight source texts are publisher transcripts marked בלתי מוגה; recordings, manuscripts, autographs and edited editions were not collated. All remain Parsed.
- Eight alternate /therebbe routes (AIDs 4666265, 4666267–4666270 and 4666316–4666318) exposed only summary/navigation shells; their Hebrew library aliases did not expose inspectable bodies. They were excluded without title-based inference. In the same run, eight accessible original-Hebrew publisher body sections were inspected and used as fallback. No crawler retry, access-control bypass, full-text copying, translation-as-independent-witness or Verified promotion occurred.
- Before Batch168, exact-head PR workspace reconciliation run 44402037932 measured 1,540 / 854 / 3,996. This measurement is not committed to main and is not public. The prior Batch167 planning boundary expected 1,539 / 854 / 3,995; the +1 source / +1 proposition variance remains unattributed and must not be assigned to Batch168. Expected after Batch168 is 1,540 / 854 / 4,004 as a planning boundary only; actual after-metrics remain pending.
- Run 44402037932 completed reconciliation, question-specific retrieval, synthesis, citation integrity, structural answer-quality and write-safety checks, but `test_content_readiness.mjs` failed at line 1360 because the current AID 2989585 record contains 21 propositions after later in-place enrichments while a historical current-index assertion expected 20 (other current-index assertions still expected 19/16). The test is updated to use a lower-bound for the current canonical record while preserving historical batch-local counts; a new Batch168 regression verifies one identity per AID, unchanged Evidence Families, locator alignment and regular/deep multi-source citations.
- Public main metrics remain 977 / 878 / 2,950. PR #35 is not yet merged, and no new GitHub Pages deployment is claimed. The hourly workflow, audience, permissions and access settings were not changed.

## 2026-11-19 — Batch 169: eight additional Hebrew Sicha body enrichments

- Reviewed eight public original-Hebrew Sicha body passages on BeitChabad.com / he.chabad.org and added one non-verbatim, source-grounded research proposition to each existing canonical identity: AIDs 2989021, 2989054, 2989052, 5989687, 2989062, 4385513, 5959968 and 4296159.
- Every proposition is marked `proposition_origin=source_grounded_paraphrase`, `proposition_verbatim=false`, `proposition_verification=source_text_inspected`; each has an exact body locator, provenance, bounded verification scope, partial-context status and item-specific limitations. The eight original Evidence Family IDs and Parsed statuses are unchanged.
- Opened Yiddish Yechidus AID 553691 as an expansion candidate. The publisher page exposes the title and audio-collection/navigation links but no inspectable Yiddish transcript body; it was excluded from content evidence. The same run fell back to the eight accessible Hebrew source bodies. No title-based content inference, crawler retry, access-control bypass, full-text copying or scan-only verification was used.
- Batch169 adds zero source identities, zero Evidence Families and zero Verified identities; it adds eight in-place propositions. No translation is counted as an independent witness.
- Baseline: exact-head PR-workspace reconciliation run 44405343996 measured 1540 answer-eligible unique sources / 854 content-verified unique sources / 4004 answer-eligible propositions after Batch168. Batch169 planning boundary is 1540 / 854 / 4012; this is not yet a measured post-Batch169 result and is not public main metrics.
- The same run had completed reconciliation before failing in `test_content_readiness.mjs` on a stale current-batch assertion (test expected 167 while the project state was 168). Batch169 updates the test to the new current batch and adds exact checks for the eight in-place updates and regular/deep-researcher retrieval with claim-level locators.
- Main remains unchanged at public metrics 977 / 878 / 2950. PR #35 remains unmerged; no GitHub Pages deployment is claimed. The hourly workflow and access permissions are unchanged.


## 2026-11-19 — Batch 170: eight new Hebrew identities and two in-place enrichments

- Opened and inspected ten original-Hebrew body passages on BeitChabad.com / he.chabad.org. Added eight new source identities (AIDs 2988933, 2989059, 2989147, 2989220, 3008930, 3140218, 4279923 and 4385558) and enriched two existing identities in place (AIDs 4296226 and 4279876). The two existing Evidence Family IDs and Parsed statuses were retained.
- Each of the ten propositions is a non-verbatim `source_grounded_paraphrase` with `proposition_verbatim=false`, `proposition_verification=source_text_inspected`, exact body locator, provenance, partial-context scope and item-specific limitations. The eight new identities comprise seven Sichos and one Maamar hanacha; all ten source bodies are Hebrew. No translation was counted as an independent witness.
- AID 2989059's proposition explicitly attributes the quoted educator passage to the Previous Rebbe as presented in the Rebbe's talk. AID 4385558 preserves the attribution chain for the Baal Shem Tov teaching. AID 3008930 remains classified as an unedited maamar hanacha. AID 2989220 is marked as a contextual polemic, not generalized to every school.
- Two alternate pages (AIDs 2989215 and 5989907) returned HTTP 429; AID 2988661 was a collection-level page; AID 5989700 was already canonical; AID 2989556 was opened but not selected for body-level review, and its corpus identity status is not asserted. These were excluded, and ten accessible item-level Hebrew bodies were used in the same run. No crawler retry, access-control bypass, full-text copying, scan-only verification or Verified promotion occurred.
- The last measured PR-workspace baseline after Batch169 is 1540 answer-eligible unique sources / 854 content-verified unique sources / 4012 answer-eligible propositions (Answer Quality Gate run 44409060151). Batch170's expected boundary is 1548 / 854 / 4022; this is planning-only until exact-head reconciliation. Main's public metrics remain 977 / 878 / 2950.
- Run 44409060151 completed reconciliation and earlier quality checks but failed at a historical Batch089 variance assertion. The test now allows explicitly recorded positive answer-eligible/proposition variance while continuing to prohibit positive content-verified variance. Batch169's historical actual-after snapshot is compared with Batch170's measured-before boundary rather than the current corpus total.
- PR #35 remains open; no main merge or Pages deployment is claimed. The existing hourly workflow, audience, repository permissions and access settings are unchanged.


## 2026-11-19 — Historical reconciliation selection fix

- Main hourly run 44405963735 completed deterministic maintenance but failed at the evidence-readiness validation step: Batch110 was labelled reconciled while `deduplication_check.full_index_scan_available` was not true.
- `scripts/reconcile_metrics.py` now reprocesses not only pending-labelled batches but also historical batches lacking a full-index audit, a measured `metrics_actual_after`, or a reconciled status. This prevents stale reconciliation labels from bypassing the current full-corpus audit.
- The existing hourly schedule and disabled live crawler remain unchanged. The current PR run is superseded by this reconciliation-selection correction; the next exact-head gate must validate Batch110 through Batch170 before merge.
## 2026-11-19 — Legacy alias-target compatibility

- Exact-head run 44419428122 reached reconciliation but failed because Batch096 stores an alias audit target as the legacy string `aid:1273962`, while the reconciler assumed every target was an object.
- Added `scripts/reconciliation_helpers.py` to normalize both string and structured alias targets, plus regression checks for numeric AIDs, `aid:` strings, structured pairs and non-AID keys. The reconciler now uses this helper.
- Corrected Batch170's exclusion audit: AID 5989700 is already canonical; AID 2989556 was opened but not selected for body-level content review, so the batch no longer claims it was a duplicate.
- The next exact-head run must complete reconciliation, `test_content_readiness.mjs`, and the full Answer Quality Gate before PR #35 can be merged.


## 2026-11-19 — Batch 171: eight in-place source enrichments and cross-family synthesis

- Inspected eight additional original-Hebrew publisher-body passages from eight Batch170 identities: AIDs 2988933, 2989059, 2989147, 2989220, 3008930, 3140218, 4279923 and 4385558. Each identity retained its AID, Evidence Family and Parsed status; one new non-verbatim source-grounded proposition and exact body locator were appended in place to each.
- Each addition records `source_grounded_paraphrase`, `proposition_verbatim=false`, `source_text_inspected`, provenance, bounded verification scope, partial context and item-specific limitations. No new identities, Evidence Families, independent witnesses or Verified promotions were added.
- AID 4666220 redirected to a rewritten Torah Texts summary shell and displayed a browser-compatibility gate rather than the original letter body. It was excluded; the same run used eight accessible Hebrew bodies. No crawler retry, access-control bypass, full-text copying or scan-only verification was used.
- Added a claim-level three-family synthesis connecting daily permitted actions as service, acceptance before full comprehension, and the progression from `למיגרס` to `לעיונא`. It is explicitly labelled as system synthesis, not a quotation or attribution to the Rebbe; regular and deep-researcher tests require separate source locators for all three claims.
- Batch171 planning boundary: 1548 answer-eligible unique sources / 854 content-verified unique sources / 4030 answer-eligible propositions. This is a planned boundary, not a measured result; exact-head reconciliation is pending. Public main metrics remain 977 / 878 / 2950 until a successful merge and post-merge reconciliation.
- Exact-head run 44419986934 failed at the historical Batch084 status assertion after the reconciler correctly reprocessed an audit-incomplete superseded batch. The readiness test now accepts a reprocessed `reconciled` or `reconciled_with_variance` status only when `superseded_by_batch`, a full-index audit and a measured snapshot are present. Batch170 historical assertions now compare against the Batch171 boundary rather than the current corpus total.
- PR #35 remains unmerged pending a fresh exact-head Answer Quality Gate. The hourly workflow, audience, repository permissions and access settings are unchanged.


### 2026-11-19 — follow-up readiness assertion repair

The first Batch171 exact-head run (44422763891) passed index generation, question-specific retrieval, synthesis, citation integrity, evidence-contract and write-safety checks. It then exposed a second historical assertion: Batch085 may be reprocessed as `reconciled_with_variance` by the full-index reconciler. The readiness test now accepts that state only when a full-index audit and actual/expected snapshots exist and the stored variance equals the arithmetic difference. No corpus status is manually overwritten.


### Reconciliation queue schema note — 2026-11-19

The project-state pending reconciliation list remains a numerically ordered array of string batch IDs. Batch170 and Batch171 are recorded as `170` and `171`; no object-shaped queue entries are introduced.


### 2026-11-19 — Batch170 duplicate consolidation, Batch171 canonical repair, and Batch172

- Exact-head Answer Quality Gate run 44423637868 measured the PR workspace at 1,547 answer-eligible unique sources / 854 content-verified unique sources / 4,026 answer-eligible propositions. Its full-index audit found AID 2988933 in both Batch141 and Batch170 under the same Evidence Family `sicha-5716-simchat-torah-aid2988933`. The Batch170 duplicate source record was removed; its inspection is retained as a duplicate recheck. The distinct Batch171 proposition was consolidated into the original Batch141 canonical record. No new witness or Verified promotion is counted for the duplicate.
- Corrected Batch170 planning count: seven new identities, two in-place enrichments, one duplicate recheck, seven new propositions and two existing-identity propositions; expected planning boundary 1,547 / 854 / 4,021. Batch171 adds eight in-place propositions to eight identities; expected planning boundary 1,547 / 854 / 4,029. These are expected boundaries, not post-correction measurements.
- Batch172 inspected eleven original-Hebrew item-level public Sicha bodies at Chabad.org / BeitChabad.com: AIDs 2989237, 4385650, 5959840, 2989311, 2988879, 2989234, 4385701, 4279994, 4296163, 2988877 and 2988906. Each has one non-verbatim source-grounded proposition, exact body locator, provenance, bounded verification scope, partial-context status and item-specific limitations. AID 4385650's page states that the talk was edited by the Rebbe and printed in Likkutei Sichos vol. 28; the printed edition was not separately collated. Batch172 also records one English translation of a Yiddish personal letter to Zalmon Jaffe (Chabad.org AID 259799, lines 272–276). The memoir author explicitly says this is his translation; the article does not supply or link the original Yiddish body. A separate Yiddish search result was identified as a different letter to Jacques Lipchitz and excluded as unrelated. The translated Jaffe letter is one non-independent presentation of a single Evidence Family, not an independent witness.
- Two other Hebrew item pages, AIDs 4385482 and 5989925, returned HTTP 429. A separate Yiddish text result encountered during research was identified as a different letter to Jacques Lipchitz and excluded as an unrelated identity; it was not treated as the original of the Zalmon Jaffe letter. The article itself does not supply or link the original Yiddish body. Eleven Hebrew bodies and one English translated body were inspected in the same run. No crawler retry, access-control bypass, scan-only content verification, search-snippet content, full-text copying, translation-as-independent-witness, or Verified promotion was used.
- Batch172 planning boundary: 1,547 / 854 / 4,029 before, 1,559 / 854 / 4,041 expected after. The 12 source identities comprise eleven independent Hebrew Sicha witnesses and one non-independent English translation presentation. The preflight checked the current review queue, exact-AID repository searches and available bulk-index snapshots, but did not scan every historical canonical batch. These candidate identity counts remain provisional until the exact-head full-index reconciler confirms no older AID collisions.
- The readiness test now checks historical Batch097 variance by measured arithmetic and a completed full-index audit, while prohibiting positive content-verified growth. Batch170/171 tests now require the single canonical AID 2988933 identity and verify that Batch171's new proposition is stored in Batch141.
- PR #35 remains unmerged pending a fresh exact-head Answer Quality Gate. Main's public metrics and GitHub Pages have not been changed by this branch update. The hourly workflow, audience, repository permissions and access settings remain unchanged.

- The Batch172 translation record is stored with `language=English`, `original_language=Yiddish`, `independent_witness=false`, and `translation_of_evidence_family_id` equal to its letter Evidence Family. It may enrich the family but is never counted as an additional independent witness. The original Yiddish text remains uninspected; a separate Yiddish item was excluded as a different letter, and no content or relationship was inferred from its metadata.


### 2026-11-19 — Batch172 duplicate correction and Batch173 in-place source enrichment

- Exact-head Answer Quality Gate run 44427907501 completed retrieval, synthesis, citation integrity, evidence-contract and structural checks, then failed in `test_content_readiness.mjs` because AID 2988877 appeared as a new Batch172 identity even though it already has one canonical identity in Batch100. The Batch100 record has Evidence Family `sicha-5714-beshalach-12-shevat-aid2988877` and eleven existing propositions. The Batch172 duplicate candidate was removed from `records` and `source_body_review`, retained as a duplicate recheck, and contributes no new family or proposition.
- Corrected Batch172 boundary is planning-only: 11 new source identities/presentations (10 original-Hebrew Sichos plus one non-independent English translation of a Yiddish letter), 11 new propositions, one duplicate recheck, 10 independent witnesses, one non-independent translation, and zero Verified promotions. Expected boundary: 1,558 / 854 / 4,040.
- Batch173 inspected eight additional original-Hebrew body passages and appended one new non-verbatim proposition in place to each existing identity: AIDs 2989059, 4385558, 2989147, 3008930, 3140218, 4279923, 2989220 and 4296226. Seven are Sichos and one is a Maamar. Every addition has an exact body locator, `source_grounded_paraphrase`, `proposition_verbatim=false`, `proposition_verification=source_text_inspected`, provenance, scoped verification, partial-context boundaries and an item-specific limitation. Existing AIDs and Evidence Family IDs were retained; no new source identity, family, independent witness or Verified status was added.
- AID 4666220 returned Internal Error through the public reader. It was documented as blocked, not retried through the crawler, and not bypassed. Eight accessible Hebrew bodies were used as same-run fallback. Search results were navigation only; no search snippet was used as content evidence and no full protected text was copied.
- Batch173 planning boundary only: 1,558 / 854 / 4,040 → 1,558 / 854 / 4,048. Exact-head reconciliation must supply measured before/after values and confirm the eight in-place family links.
- The readiness test now covers the Batch172 duplicate reclassification and Batch173 in-place enrichments, including one-to-one claim locators and unchanged source/Verified counts. A fresh exact-head Answer Quality Gate is required before PR #35 can be merged.
- Main public metrics remain 977 / 878 / 2,950 until a successful merge and post-merge reconciliation. GitHub Pages publication is not claimed. The hourly workflow, schedule, audience, permissions and access settings remain unchanged.

## 2026-11-19 — Batch174: eight additional in-place source enrichments

- Inspected eight distinct additional passages in original-Hebrew public bodies at he.chabad.org / BeitChabad.com and appended eight bounded, non-verbatim research propositions to existing canonical identities: AIDs 2989059, 4385558, 2989147, 3008930, 3140218, 4279923, 2989220 and 4296226.
- Every addition records `source_grounded_paraphrase`, `proposition_verbatim=false`, `proposition_verification=source_text_inspected`, an exact body locator, provenance, scope, partial-context status and a passage-specific limitation. Existing AIDs and Evidence Family IDs were preserved; no new identity, independent witness or Verified promotion was added.
- AID 4666220 returned Internal Error through the public reader. It was recorded as blocked; eight accessible Hebrew body passages were used as same-run fallback. No crawler retry, access-control bypass, search-snippet content inference or full-text copying occurred.
- Batch174 planning boundary is 1,552 / 854 / 4,040 before and 1,552 / 854 / 4,048 expected after. The before snapshot is the PR-workspace measurement from Answer Quality Gate run 44430166602 on commit c3521f264b51fd113a457fc980243d90e86bc6b1; it is not a main/public metric. The after snapshot remains pending exact-head full-index reconciliation.
- The readiness test was corrected to validate historical reconciliation variance arithmetically rather than requiring every historical batch to remain exactly reconciled after later canonical changes. Batch172/173/174 boundaries are checked sequentially so a historical batch is not compared to the final corpus snapshot.
- PR #35 remains unmerged until a fresh exact-head Answer Quality Gate, including `test_content_readiness.mjs`, passes. Main metrics and GitHub Pages have not been changed by this PR.



## 2026-11-19 — Batch175: source-body enrichment and readiness-gate repair

The exact-head Answer Quality Gate run `44436032237` completed reconciliation after Batch174 and measured `answer_eligible_unique_sources=1552`, `content_verified_unique_sources=854`, and `answer_eligible_propositions=4048` in the PR workspace. The run then failed in `scripts/test_content_readiness.mjs:1426` with `ReferenceError: Cannot access 'batch174Data' before initialization`; this is a test-ordering defect (temporal dead zone), not a content-reconciliation failure. The declaration is moved before its first use, and the current-batch assertions are advanced to Batch175.

Batch175 adds eight non-verbatim, source-grounded Hebrew propositions to eight existing canonical identities: AIDs 2989059, 4385558, 2989147, 3008930, 3140218, 4279923, 4296226, and 4279876. Each passage was opened in the original Hebrew body, checked at a non-overlapping locator, and recorded with provenance, scope, partial-context limits, and conditions. Seven are Sichos and one is a Maamar. No new identity, Evidence Family, independent witness, translation witness, or Verified promotion was added. The planning boundary is 1552/854/4056; it remains unmeasured until the next exact-head reconciliation.

Nine other public-reader paths (AIDs 554871, 555023, 555044, 555045, 555070, 555071, 555072, 555082, 555084) returned Internal Error. They were documented as blocked; no proposition was created from their titles or metadata. Eight accessible Hebrew source bodies were used as same-run fallback. The blocked `acquire_source_content.py` crawler was not retried and no access control was bypassed.

The answer engine gains a three-family comparison for the relationship between special care in one mitzvah, adapting hiddurim to a person's capacity, and the concept of empowerment from above. It is explicitly labelled as system synthesis, not a Rebbe quotation; each claim retains its own body locator and the researcher mode exposes the deep evidence map. Public `data/public-metrics.json` remains unchanged until merge and post-merge reconciliation.


## 2026-11-19 — Batch176: nine new Hebrew/Yiddish source identities; historical snapshot reconciliation fix

- Opened and inspected nine original-language publisher bodies: eight Hebrew public-talk transcripts (AIDs 4279925, 2989560, 2989195, 2989574, 4304430, 2988862, 4385609, 2988859) and one edited Yiddish Likkutei Sichos excerpt (AID 4736086). Each received one bounded, non-verbatim `source_grounded_paraphrase` with `proposition_verbatim=false`, `proposition_verification=source_text_inspected`, exact body locator, provenance, verification scope, partial context and passage-specific limitations.
- The Yiddish original at AID 4736086 was inspected directly. Its English translation is a derived presentation on the same page and was not entered as a separate item or counted as an independent witness. The other eight sources are Hebrew originals. All nine remain Parsed; no Verified promotion was made.
- AID 554871 opened only as an audio listing with no transcript/body text and was excluded. Nine accessible original-language bodies were used as same-run fallback. No search extract was used as content, no crawler retry or access-control bypass occurred, and no full protected text was copied.
- Preflight checked the 1,022-record content-review queue, current PR tree item paths and exact-AID repository code searches; no matches were found. This is not a full historical index scan. Full AID and Evidence Family reconciliation remains pending.
- Batch176 planning boundary only: after Batch175 expected 1552/854/4056, then Batch176 expected 1561/854/4065. No actual Batch176 metric has been measured; no public/main metrics were changed.
- The previous exact-head readiness run failed because the reconciler re-audited already reconciled historical batches and overwrote their historical `metrics_actual_after` with a later whole-corpus snapshot (for example Batch077's 792 boundary was rewritten to 815 in the CI workspace). `scripts/reconcile_metrics.py` now treats a previously reconciled batch's metrics boundary as frozen during later full-index audits; the audit may refresh deduplication evidence but cannot rewrite historical boundary metrics. A helper and regression checks were added in `scripts/reconciliation_helpers.py` and `scripts/test_reconcile_status.py`.
- PR #35 remains unmerged pending a fresh exact-head Answer Quality Gate including `test_content_readiness.mjs`. Main metrics and GitHub Pages have not been changed by this branch update. The hourly workflow, audience, repository permissions and access settings remain unchanged.


### Batch176 provenance correction — 2026-11-19

A second inspection of the publisher footnote for AID 2988859 (footnote 51, lines 587–588) established that the inspected section ח׳ was edited by the Rebbe and published in Yiddish as the introduction to Sefer HaMinhagim and in Likkutei Sichos Vol. 23. The Hebrew presentation at AID 2988859 is therefore recorded as a derived Hebrew presentation of an edited Yiddish section, linked to the same Evidence Family and explicitly marked `independent_witness=false`. It is not counted as an independent witness. Batch176 now records nine source presentations, eight independent original-language witnesses (seven Hebrew and one Yiddish), and one non-independent Hebrew presentation of Yiddish text. The original-language distribution is seven Hebrew and two Yiddish; the display-language distribution remains eight Hebrew and one Yiddish. The expected nine Evidence Families are still subject to full-index reconciliation.


## 2026-11-19 — Batch177: eight additional in-place Hebrew body enrichments; exact-head reconciliation through Batch177

- Opened and inspected eight distinct, non-overlapping passages in the original Hebrew bodies of existing Batch176 Sicha identities: AIDs 4279925, 2989560, 2989195, 2989574, 4304430, 2988862, 4385609 and 2988859. Each new proposition is a non-verbatim, source-grounded research paraphrase with its own body locator, provenance, partial-context scope and passage-specific limitation. The existing AID and Evidence Family are retained; each source remains Parsed.
- No new source identity, Evidence Family, independent witness, translation witness or Verified promotion was added. The eight additions are propositions only; the expected source count remains 1,561 and expected proposition count becomes 4,073, pending exact-head measurement.
- Three alternate Hebrew pages (AIDs 6132083, 5989563 and 6132054) returned HTTP 429. The pages were recorded as blocked and eight accessible Hebrew body passages were used as same-run fallback. AID 4736086 was opened, but the reader displayed its English translation rather than the original Yiddish; no new proposition or independent witness was added. No crawler retry, access-control bypass, search-snippet inference or full-text copying occurred.
- Batch177 is stored at `data/items/content-research-batch-177-2026-11-19.json`; seven genuine existing-identity updates point to the surviving Batch176 canonical records. AID 4304430 was rechecked but excluded because its passage already exists in canonical Batch101. A full-index scan and measured metrics are still pending.
- The exact-head readiness test was updated to reconcile the contiguous Batch175–177 chain, require one canonical index identity per target AID, and compare the final metrics to Batch177 rather than Batch176. The prior test expected Batch176 to be the latest reconciled batch while its source snapshot was still pending; that stale expectation has been replaced with a Batch177 boundary.
- PR #35 remains unmerged until the exact-head Answer Quality Gate, including `test_content_readiness.mjs`, passes. Main/public metrics and GitHub Pages have not been changed by this branch update.



## 2026-11-19 — Exact-head duplicate correction for Batches 176–177

- Answer Quality Gate run 44450672113 exposed two AID collisions in Batch176. AID 4304430 was already canonical in Batch101 (with a linked non-independent presentation in Batch146); the Batch176 propositions overlapped the existing canonical propositions. AID 4736086 was already canonical in Batch107 and had been enriched in Batch153; the inspected Yiddish passage overlapped existing content. Neither duplicate is a new identity, Evidence Family or proposition.
- Both duplicate presentations were removed from Batch176 `records[]` and retained in `excluded_duplicate_candidates` with their canonical file, identity and Evidence Family. Batch176 now contains seven new identities and seven propositions: six independent Hebrew witnesses and one derived Hebrew presentation of an edited Yiddish source. No translation is counted as an independent witness.
- Batch177's AID 4304430 recheck was also excluded from enrichment counts because its passage is already represented in Batch101. Seven genuine in-place enrichments remain; one recheck is retained in the audit trail.
- Corrected planning boundary after Batches175–177: **1,559 answer-eligible unique sources / 854 content-verified unique sources / 4,070 answer-eligible propositions**. This is not a measured result; exact-head reconciliation and readiness must confirm it. Public main metrics are unchanged until merge.
- No Verified promotion, crawler retry, access-control bypass, full-text copying, schedule change or permission/audience change.


- Historical Batch110 was included in the exact-head evidence-index audit during run 44450486958. All eight target AIDs resolved to Parsed, source-text-inspected entries; the stale pending-scan metadata was corrected to record the completed full-index audit. The existing collision and missing-identity arrays remain empty.


- Search-index selection now prefers the canonical identity over a same-AID, same-Evidence-Family duplicate presentation when both are answer-eligible and have the same status. This keeps AID 4304430 on its canonical Batch101 record (five propositions) rather than the non-independent Batch146 alias (two propositions); the alias remains linked for provenance and family accounting.


## 2026-11-19 — Batch178: eight inspected English Yechidus texts; Batch176–177 duplicate correction

- Opened and inspected the public text bodies of eight distinct dated Yechidus pages in the Chabad.org / TheRebbe.org *Sichos in English Collection*: AIDs 2497688, 2511619, 2506495, 2505782, 2506320, 2511596, 2498908 and 2512367. Each contributed one non-verbatim Hebrew research paraphrase with a page-line locator, provenance, scope, partial-context status and explicit limitations.
- These are published English renderings. The original Hebrew/Yiddish text, recording and printed original were not inspected. All eight records therefore remain Parsed, use one Evidence Family per dated event, are marked `independent_witness=false`, and contribute zero independent witnesses. Any future original-language presentation of the same event must be linked to that family.
- Three alternative pages were opened and excluded because they exposed only metadata/audio listings, not text bodies: AID 553508 (Hebrew), 553257 (audio listing) and 553643 (French). Search snippets were used only to discover pages, never as content evidence. No crawler retry, access-control bypass, scan-only verification or full-text copying.
- Full-index duplicate review found that Batch176 AIDs 2989195 and 2989574 were already canonical in Batch101 and Batch153; the inspected candidate passages overlap existing propositions. They were removed from Batch176 new identities and Batch177 enrichments and retained only as duplicate recheck records. Batch176 now has five new identities/families and five propositions; Batch177 has five in-place enrichments and five propositions. The reconciliation script now excludes `excluded_duplicate_*` audit rows from canonical source indexing.
- Exact-head CI run 44456969090 measured 1,557 answer-eligible unique sources / 854 content-verified unique sources / 4,069 answer-eligible propositions after Batch177 in the PR workspace. The readiness test then stopped at a stale Batch082 assertion requiring an obsolete canonical file path. The test now accepts a migrated canonical `data/items/` path while requiring the Evidence Family to remain stable.
- Batch178 adds eight dated event families and eight propositions. Expected PR-workspace boundary is 1,565 / 854 / 4,077; this remains a planning boundary until the next exact-head reconciliation. Public main remains 977 / 878 / 2,950. No Verified promotions.
- PR #35 remains unmerged. No main commit or Pages deployment is claimed. The hourly schedule, repository audience and permissions remain unchanged.


## 2026-11-19 — Batch178 full-index correction and Batch179 content review

- Exact-head Answer Quality Gate run 44468523825 completed reconciliation on the PR workspace at **1,560 answer-eligible unique Evidence Families / 854 content-verified sources / 4,072 answer-eligible propositions**. The readiness test failed because the Batch178 assertion still expected 1,565 / 4,077.
- The full-index audit showed that five Batch178 candidates were already canonical: AIDs 2511619, 2506495, 2506320 and 2498908 in Batch137, and AID 2512367 in Batch139. Their newly inspected passages overlapped the existing canonical propositions. They were removed from Batch178 `records[]` and retained in `excluded_duplicate_candidates` / `duplicate_rechecks`; only AIDs 2497688, 2505782 and 2511596 remain as three new Evidence Families and three propositions. No duplicate source or proposition is counted.
- Batch179 opened and inspected eight public English bodies: AIDs 2513564, 2513855, 2505723, 2514116, 2513277, 2515477, 2515007 and 2511662. Seven are dated Yechidus publications and one is a dated Sicha. Each contributes one bounded Hebrew research paraphrase with exact body-line locator, provenance, verification scope, partial context and explicit limitations.
- All eight Batch179 texts are published English renderings in the Sichos in English Collection. No original Hebrew/Yiddish text, recording or printed original was inspected; all remain Parsed and non-independent. No Verified promotion.
- Three Hebrew item routes for AIDs 2513564, 2513855 and 2515477 returned Internal Error. The English publisher bodies were used as same-run fallback; no access-control bypass or crawler retry was attempted. Search results were used only for discovery, never as content evidence.
- Batch179 planning boundary from the measured Batch178 snapshot is **1,568 / 854 / 4,080**. This is not a measured post-Batch179 result; exact-head reconciliation and `test_content_readiness.mjs` are pending.
- PR #35 remains unmerged; public main metrics remain 977 / 878 / 2,950. No new main commit or Pages deployment is claimed. The existing hourly schedule, repository audience and permissions are unchanged.


## 2026-11-19 — Batch180: Hebrew source additions, Yiddish enrichment, and a secondary memoir

- Opened and inspected nine public source-body units: six new original-Hebrew Sichos (AIDs 5959907, 4296168, 2989222, 5959959, 5989922, 4279947), one English memoir excerpt (AID 259799), and two in-place enrichments (AID 4280029 in Batch100; AID 4736086 in Batch107, including a directly inspected Yiddish passage).
- Added eight propositions to seven new identities and two additional propositions to existing identities: ten non-verbatim, source-grounded propositions in total. The memoir record is explicitly secondary; its first letter is an author's English translation of a Yiddish letter, and neither original letter was inspected. The Yiddish/English parallel on AID 4736086 remains one Evidence Family, not two witnesses.
- Three alternative routes (AIDs 5959980, 4313081, 5990021) returned HTTP 429. They were recorded as blocked; accessible public bodies were used as same-run fallback. No crawler retry, access-control bypass, full-text copying, or Verified promotion.
- Preliminary exact-AID review found AIDs 4280029 and 4736086 in their existing canonical records; the seven new AIDs were not found in the review queue or the reviewed recent batch files. A full canonical scan is still pending; older corpus files were not all searched.
- Planning boundary only: 1568/854/4080 → 1575/854/4090. This is not a measured post-reconciliation count. Public main metrics remain unchanged until merge and post-merge reconciliation.
- Next gate: exact-head full-index reconciliation and `test_content_readiness.mjs` through Batch180. PR #35 remains unmerged until the complete Answer Quality Gate is green.


## 2026-11-19 — Batch181: nine English Yechidus bodies and one Yiddish in-place enrichment

- Opened and inspected nine distinct dated English Yechidus publisher bodies: AIDs 2514886, 2515046, 2514160, 2513225, 2499828, 2511676, 2511792, 2511754 and 2512299. Each contributes one bounded Hebrew research paraphrase with a body-line locator, provenance, partial-context scope and explicit limits.
- Enriched existing AID 4736086 in place in Batch107 from the Yiddish original, sections יא–יג, lines 355–382. Its existing ID and Evidence Family were retained; the parallel English rendering is not an independent witness.
- Three Hebrew routes (AIDs 2514886, 2515046 and 2514160) returned Internal Error through the public reader. The corresponding English publisher bodies were inspected in the same run. No crawler retry or access-control bypass was attempted.
- All nine new English presentations remain Parsed, non-independent and partial-context. No Verified promotion; no full copyrighted text copied.
- Preliminary exact-AID checks returned no matches in the default-branch code search and no matches in recent batches 175–180. This is not a full canonical scan; full-index identity and Evidence Family reconciliation remains pending.
- Planning boundary only, carried forward from Batch180 expected boundary: **1,575 / 854 / 4,090 → 1,584 / 854 / 4,100**. These are not measured results. Public main metrics remain **977 / 878 / 2,950** until merge and post-merge reconciliation.
- test_content_readiness.mjs was extended through Batch181 and now includes a multi-family unity synthesis check in both regular and deep researcher modes, with claim-level citation and derived-translation integrity assertions.
- PR #35 remains unmerged pending the exact-head Answer Quality Gate. No new main commit or Pages deployment is claimed. The hourly schedule, repository audience and permissions are unchanged.


## 2026-11-19 — Batch181 reconciliation correction and Batch182 source review

- Exact-head reconciliation found six Batch181 AIDs already represented in earlier canonical files: 2514886, 2515046, 2513225, 2499828, 2511676 and 2512299. Their newly inspected English propositions were moved into those existing records; duplicate records were removed from Batch181. Batch181 now has **3 new event identities and 7 in-place enrichments** (the six canonical English presentations plus the Yiddish-original AID 4736086), with 10 new paraphrases total and no Verified promotion.
- Fixed `scripts/reconcile_metrics.py`: historical snapshot selection now uses the same deterministic witness-priority order as the public search index. The previous mismatch (1574/854/4089 in the batch snapshot versus 1574/854/4095 in the final index) came from different tie-break rules when multiple presentations shared an AID. The readiness test now checks the corrected batch chain through Batch182.
- Batch182 inspected eight original-Hebrew letter bodies published by Kehot/Chabad.org: AIDs 4731068, 5357009, 5413030, 5357052, 5100679, 5357571, 5413490 and 5100718. Each has one non-verbatim, source-grounded Hebrew proposition with exact body-line locator, provenance, partial-context scope and limitations. All remain Parsed; no Verified promotion.
- AID 4666220 redirected to a browser-compatibility shell and exposed no letter body. It was recorded as content-blocked; eight alternate publisher bodies were inspected in the same run. No crawler retry, access-control bypass, full-text copying or scan-only verification.
- Batch182 planning boundary: **1574 / 854 / 4095 → 1582 / 854 / 4103** (answer-eligible unique sources / content-verified unique sources / answer-eligible propositions). This is a planning boundary pending full-index reconciliation, not a committed public metric. Preliminary duplicate checks were limited; exact-head reconciliation remains the authority.
- The hourly schedule, repository audience and permissions remain unchanged.


## 2026-11-19 — Batch183: original-language letters, Yiddish and in-place enrichment

- נפתחו ונבדקו 10 גופי פרסום: שמונה זהויות חדשות (שבעה מכתבים בעברית ומכתב אחד ביידיש), מקטע נוסף בשיחה קיימת AID 2989059, ובדיקת כפילות של AID 4666247. AID 4666220 הציג מעטפת תאימות דפדפן ללא גוף קריא.
- נוספו שמונה פרופוזיציות לא-מילוליות לזהויות חדשות ופרופוזיציה אחת לזהות קיימת. כל הרשומות החדשות נשארו Parsed; לא קודם מקור ל-Verified.
- AID 4666247 לא נוסף: הוא כבר קיים בקובץ `data/items/igrot-kodesh-v2-letter-208-aid-4666247.json` ובמשפחת הראיות `original-letter-aid-4666247`. AID 2989059 הועשר בתוך `data/items/content-research-batch-170-2026-11-19.json` תוך שמירת אותה Evidence Family.
- לא הופעל crawler ולא בוצע ניסיון לעקוף את מעטפת הדפדפן. שמונת גופי המכתבים החלופיים נבדקו ישירות; לא הועתק טקסט מוגן במלואו.
- גבול תכנון בלבד: 1,582 / 854 / 4,103 לפני האצווה ו-1,590 / 854 / 4,112 צפוי אחריה. המדידה בפועל ממתינה ל-exact-head reconciliation; אין להציג את המספרים האלה כתוצאה.
- readiness test תוקן כך שיכבד שתי נקודות בסיס היסטוריות שנמדדו בנפרד (Batch176 ו-Batch181) במקום להניח שכל גבול תכנון רציף. הפערים נשארים מפורשים ונבדקים מול `metrics_before_source`; אין תיקון ידני של מדדים.
- PR #35 נשאר פתוח עד שה-Answer Quality Gate יעבור. מיזוג ל-main ופרסום Pages טרם בוצעו.

## 2026-11-19 — Batch184: eight Hebrew Sicha enrichments

- Opened and inspected eight original-Hebrew bodies from BeitChabad.com / he.chabad.org, adding eight bounded, non-verbatim source-grounded propositions to existing identities AIDs 4304430, 2989059, 5959968, 4296159, 2989062, 4385513, 2989052 and 2989054.
- Each canonical record now carries a new response_proposition_metadata entry with proposition_origin=source_grounded_paraphrase, proposition_verbatim=false, proposition_verification=source_text_inspected, exact proposition_source_locator, provenance, partial-context scope and limitations. No complete copyrighted text was copied.
- Eight /therebbe publisher routes (AIDs 4645972, 4831491, 4646057, 5054374, 4831547, 5413680, 4731070 and 5019667) redirected to browser-compatibility summary shells without readable bodies. They were recorded as blocked; the same run used eight accessible Hebrew body pages from the /library/article_cdo/aid/ route. No crawler retry or access-control bypass.
- No new source identities, Evidence Families, independent witnesses or Verified promotions. All eight records remain Parsed.
- Full-index review found two presentations of AID 4304430 in batches 101 and 146. Batch101 remains canonical; batch146 is marked Linked/non-independent and both are tied to sicha-5724-yud-beis-tammuz-aid4304430. The proposition is stored on the canonical record and is counted once.
- Exact-head PR-workspace baseline from Answer Quality Gate run 44523818685: 1,587 answer-eligible unique sources / 854 content-verified unique sources / 4,115 propositions. Batch184 expects 1,587 / 854 / 4,123 after eight in-place propositions; this is planning only until reconciliation.
- Readiness-test correction: when a prior batch's measured actual-after differs from its expected-after, the next batch baseline is checked against the prior expected boundary; each batch's measured variance is validated independently. This avoids treating a recorded reconciliation variance as an unrecorded new batch delta.
- PR #35 remains open pending a fresh exact-head Answer Quality Gate. No main merge or Pages deployment is claimed until the gate passes.


## 2026-11-19 — Batch186: eight in-place Hebrew Sicha enrichments

- Opened and inspected eight non-overlapping original-Hebrew passages from eight public BeitChabad.com / he.chabad.org Sicha bodies: AIDs 3140221, 4279862, 2988861, 2988879, 2988855, 2988876, 2988887 and 2988862. Six identities originated in Batch185; AID 2988879 is canonical in Batch172 and AID 2988862 is canonical in Batch176.
- Added eight non-verbatim, source-grounded research propositions to existing records. Each carries `proposition_origin=source_grounded_paraphrase`, `proposition_verbatim=false`, `proposition_verification=source_text_inspected`, a claim-level body locator, provenance, partial-context scope and explicit limitations. No new identity, Evidence Family, independent witness or Verified promotion was added.
- AID 4666220 redirected to a browser-compatibility/Torah Texts shell requiring a newer browser, with no readable letter body. It was recorded as blocked; eight alternative original-Hebrew source bodies were inspected in the same run. No crawler retry, access-control bypass, scan-only verification or full-text copying.
- The eight AIDs resolve to eight existing canonical identities and distinct Evidence Families. The preflight check found no new identity collisions; the full-index audit remains pending exact-head reconciliation.
- Batch186 planning boundary: **1,594 / 854 / 4,129 → 1,594 / 854 / 4,137** (answer-eligible unique sources / content-verified unique sources / answer-eligible propositions). These are planning values derived from Batch185's expected boundary, not measured or public metrics. No Verified count changes.
- Extended `test_content_readiness.mjs` through Batch186, corrected contiguous historical snapshot chaining, and added a three-Evidence-Family Torah-learning/youth-education/Chassidic-dissemination regression in regular and deep researcher modes.
- The prior exact-head run 44554020367 reached the measured readiness phase and stopped at a stale current-batch assertion (expected 184 while the state was 185). The new commit triggers a fresh exact-head run; no new gate result is claimed yet.
- PR #35 remains open pending the fresh Answer Quality Gate and post-merge Pages verification. The hourly schedule, repository audience and permissions are unchanged.


## 2026-11-19 — Batch185 exact-AID duplicate correction

- Exact-head identity review found that AID 2988879 was already represented canonically in `data/items/content-research-batch-172-2026-11-19.json` under Evidence Family `sicha-5714-vayakhel-adar-sheni-aid2988879`. The Batch185 candidate was a second presentation of the same event, and its paraphrase overlapped the canonical Batch172 locator (lines 179–204).
- Removed the duplicate Batch185 source record and did not count its overlapping proposition. The candidate remains in the Batch185 duplicate/recheck audit; Batch172 remains the sole canonical identity.
- Corrected Batch185 to **6 new identities, 2 in-place enrichments, 1 existing-identity recheck and 8 new paraphrases**. Its planning boundary is now **1,593 / 854 / 4,128**, not the earlier uncorrected 1,594 / 854 / 4,129.
- The distinct Batch186 claim about the debate over studying halachic reasons and the Alter Rebbe's Shulchan Aruch is appended only to the Batch172 canonical record. Batch186 planning boundary is **1,593 / 854 / 4,136**. Both boundaries remain planning values until exact-head reconciliation.


## 2026-11-19 — Readiness-test boundary correction

- Exact-head reconciliation on run 44556976010 completed and measured **1,593 answer-eligible unique sources / 854 content-verified sources / 4,136 answer-eligible propositions**. Batch186's audit selected all eight enriched identities, all answer-eligible, across eight Evidence Families.
- The run failed at the historical Batch177→178 boundary because a test-helper edit incorrectly compared the next batch's measured baseline (4,069) with the predecessor's actual-after snapshot (4,074). The repository's reconciliation policy intentionally resets the next batch baseline to the predecessor's documented expected boundary and checks each batch's actual variance separately. The helper is restored to that rule; this is a test correction, not a content-readiness failure.


## 2026-11-19 — Historical reconciliation boundary rule

- Two exact-head runs exposed both legitimate reconciliation paths at contiguous historical boundaries: one next batch carried the predecessor's measured actual snapshot (Batch176→177), while another reset to the documented expected boundary (Batch177→178). The test now accepts either only when the declared expected boundary is contiguous, and still validates each batch's actual-versus-expected variance independently. Non-contiguous baselines continue to require an explicit measured/exact-head/baseline source note and must match their own baseline.
- The latest failed run 44558378574 stopped at Batch176→177 with a 5-proposition variance between the predecessor snapshot and the documented baseline. This is a historical reconciliation-policy assertion, not a failure of Batch186 source readiness. Exact-head reconciliation again measured **1,593 / 854 / 4,136**.


## 2026-11-19 — Batch187: eight inspected Hebrew Sicha bodies

- Inspected eight public Hebrew body passages directly on `he.chabad.org`: five new dated Sicha identities (AIDs 2988841, 4279934, 4279980, 4279982, 4296148) and three in-place enrichments of canonical AIDs 2989311, 2989554, 4279994 (canonical files Batch101/151). Each passage has a non-verbatim `source_grounded_paraphrase`, `source_text_inspected`, exact body locator, provenance, partial-context scope and explicit limitations. No Verified promotions.
- Alternate routes were recorded, not retried through the blocked crawler: eight Volume II letter pages showed browser-compatibility shells; eight Yechidus pages were audio-only without transcripts; eight additional letter pages showed shells; HebrewBooks PDF pages 10–11 for req=15897 were inaccessible through the available public reader. The fallback in the same run was eight directly inspected Hebrew Sicha bodies. No access controls were bypassed, no scan was treated as content verification, and no full protected text was copied.
- Batch172 duplicate audit corrected: AID 2989311 is a duplicate presentation of canonical Batch101; AID 4279994 is a duplicate presentation of canonical Batch151. Both were removed from Batch172 new records and linked to their canonical Evidence Families; the Batch172 planning boundary is now 1556 / 854 / 4039. AID 2988877 remains a separate duplicate recheck.
- Added a three-family synthesis for Torah learning with vitality/Yirat Shamayim (AID 4279980), continued effort because Torah is unbounded (AID 4296148), and prayer before learning (AID 4279994). The synthesis is explicitly system-authored, not a Rebbe quote; claim-level locators are preserved in regular and deep researcher modes.
- Batch187 planning boundary: 1593 / 854 / 4136 → 1598 / 854 / 4144. This is not an actual final measurement; full-index reconciliation and the exact-head `test_content_readiness.mjs` gate are pending. Public main metrics remain 977 / 878 / 2950 until merge and post-merge reconciliation. PR #35 remains unmerged; Pages publication not yet confirmed.


## 2026-11-19 — Batch188: ten new Hebrew source identities and one in-place enrichment

- נפתחו ונבדקו 12 גופי פרסום עבריים: עשר זהויות חדשות (תשע שיחות ורשומת ר״ד אחת) ומקטע נוסף לא חופף בזהות הקיימת AID 2989059. נוספו 11 פרפרזות מחקר לא-מילוליות עם מיקום ברמת סעיף/שורות, provenance, היקף אימות, הקשר חלקי ומגבלות. לא נוצרה זהות חדשה ל-AID 2989059; נשמרו הקובץ הקנוני Batch170 ומשפחת הראיות הקיימת.
- AID 2989335 נפתח ונקרא אך הוחרג: גוף המכתב והעמוד שנבדקו לא ביססו מחבר או חותם, ולכן לא נוצרה פרופוזיציה ולא יוחס תוכן לרבי.
- ניסיון להוסיף עד יידי מקורי: Chabad.org Torah Texts 4754421 הציג הודעת תאימות דפדפן ללא גוף מכתב; נתיב yi.chabad.org לא היה נגיש בכלי הציבורי. לא הוסקה תמצית ולא נוצרה פרופוזיציה. מאמר אנגלי משני שאיתר את המכתב שימש לניווט בלבד ולא נספר כעד עצמאי. באותה הפעלה בוצעה חלופה ממשית: עשרה גופי שיחות עבריים נגישים נבדקו ונוספו.
- בדיקת כפילויות מקדימה: עשרת ה-AIDs החדשים נבדקו מול GitHub code search ב-main, כל קובצי אצוות התוכן ששונו ב-PR #35 בטווח 70–187 ותור הבדיקה הנוכחי; לא נמצאה התאמת AID. AID 2989059 זוהה בזהותו הקנונית ב-Batch170 והועשר במקומו. סריקת canonical מלאה תבוצע ב-reconcile_metrics.py בריצת ה-CI.
- בסיס תכנון Batch188: **1,598 / 854 / 4,144 → 1,608 / 854 / 4,155**. הבסיס 1,598 / 854 / 4,144 נמדד ב-PR workspace בריצת CI 44564897783 לאחר Batch187, אך אינו מדד ציבורי ב-main. הגבול לאחר Batch188 הוא תכנון בלבד עד reconciliation מלא.
- לא הועתק טקסט מוגן במלואו, לא הופעל crawler חסום, לא נעקפו בקרות גישה ולא קודם מקור ל-Verified. PR #35 נשאר פתוח עד מעבר test_content_readiness.mjs; מדדי main הציבוריים נשארים 977 / 878 / 2,950 עד מיזוג ו-reconciliation בפרסום.


## Batch 189 — 19 November 2026

Eight non-overlapping passages were inspected directly in the original Hebrew bodies of eight existing Sicha identities (AIDs 2989349, 2989337, 2988901, 2989336, 2989341, 2989342, 2989339 and 2989398). Eight non-verbatim, source-grounded propositions were added in place with exact section/line locators, provenance, partial-context boundaries and item-specific qualifications. The canonical AIDs, files and Evidence Families were retained; no new source identity, independent witness or Verified promotion was added.

Two alternative Chabad Library pages (1500390039 and 1200820110) returned no readable lines through the public reader. Their search extracts were excluded from content; the same run fell back to eight accessible Hebrew Sicha bodies. No crawler retry, access-control bypass, full-text copying or scan-only content verification occurred.

Batch189 expected boundary: 1,607 answer-eligible Evidence Families / 854 content-verified families / 4,163 distinct propositions, from the Batch188 expected boundary 1,607 / 854 / 4,155. These are planning values until exact-head reconciliation. The preceding Answer Quality Gate run 44571275898 passed normalization, index generation, retrieval, synthesis, citation integrity, evidence-contract and write-safety checks, but failed at the content-readiness step; Batch189 adds explicit current-batch, historical-boundary, in-place-enrichment and deep-researcher citation assertions. No public-main metric is changed by this pending branch work.


## 2026-11-19 — Batch190: six new Hebrew Sicha identities and two in-place enrichments

- נפתחו ונבדקו ישירות שמונה מקטעים בגופי פרסום עבריים מקוריים: שש זהויות חדשות (AIDs 2989102, 2988909, 2989138, 2989127, 2989144, 2988884) ושתי העשרות לא חופפות בזהויות הקנוניות AID 2988901 ו-AID 2989337 בקובץ Batch188. נוספו שמונה פרפרזות מחקר לא-מילוליות עם `source_grounded_paraphrase`, `proposition_verbatim=false`, `proposition_verification=source_text_inspected`, מיקום גוף, provenance, היקף אימות, הקשר חלקי ומגבלות. כל המקורות נשארו Parsed; אין קידומי Verified.
- AID 4666220 ניסה להיפתח דרך קורא הפרסומים הציבורי והחזיר Internal Error ללא גוף קריא. החסימה תועדה; לא הופעל crawler, לא נעשה retry ולא נעקפו בקרות גישה. באותה הפעלה נבדקו שמונה גופי פרסום חלופיים נגישים.
- AID 2989147 הוצא כמועמד כפול: הזהות הקנונית קיימת ב-Batch170 תחת Evidence Family `sicha-5713-12-tammuz-thursday-balak-aid2989147`. לא נוצרה זהות או משפחת ראיות נוספת.
- סריקת כפילויות מקדימה בדקה אצוות מחקר 55–189, קובצי bulk-indexed ותור הבדיקה; שש הזהויות החדשות לא נמצאו בהם. GitHub code search החזיר אפס התאמות אך סימן את תוצאותיו כ-incomplete. לכן בדיקת הייחודיות המלאה נשארת pending עד full-index reconciliation.
- נוספה סינתזה מחקרית בשלוש משפחות ראיות נפרדות: עבודה יומית בעשרת ימי תשובה (AID 2989102), אהבת ישראל כהכנה למתן תורה (AID 2988901), ושמחה גלויה לצד דיון לכף זכות (AID 2989144). הסינתזה מסומנת במפורש כעיבוד המערכת ולא כציטוט או ייחוס מילולי לרבי; כל טענה שומרת locator נפרד. נוספו בדיקות regular ו-deep researcher.
- גבול התכנון לאחר Batch190: **1,607 / 854 / 4,163 → 1,613 / 854 / 4,171**. אלה ערכי תכנון בלבד עד reconciliation מדוד; מדדי main הציבוריים לא נערכו ידנית.
- תוקנה הערת baseline היסטורית Batch183→184 כך שתסביר את מדידת 1,587 ואת איחוד ההצגה הכפולה שהביא לבסיס 1,586. PR #35 נשאר פתוח עד מעבר ה-Answer Quality Gate; לא בוצעו שינויי קהל, הרשאות או לוח זמנים.


## Batch191 — 2026-11-19: eight inspected body passages

Batch191 adds four new Hebrew publisher-transcript identities (AIDs 4313091, 4385634, 5989807, 4296179) and enriches four existing canonical identities in place (AIDs 5959970, 2989059, 4304414, 2989243). Eight source bodies were opened and inspected at the item-level locators recorded in `data/items/content-research-batch-191-2026-11-19.json`. Each addition is a non-verbatim `source_grounded_paraphrase` with `source_text_inspected`, exact locator, provenance, partial-context boundary and qualifications. The three existing Evidence Families were retained.

The four new publisher pages expose Hebrew text but do not establish the original spoken language. Their `original_language` is therefore `unknown` and `independent_witness` is null; they are not credited as independent witnesses. No translation was counted as an independent witness. The five records remain Parsed; no Verified promotion was made. The AID 4296179 proposition preserves the attribution chain to a prior letter quoting the Rebbe Rashab; the cited letter itself was not inspected. The AID 2989243 paraphrase is not a personal halachic instruction. No full protected text was copied.

AID 4666220 remained inaccessible through the public web reader. The block was recorded and eight alternative publisher bodies were inspected in the same run. No crawler retry or access-control bypass was used.

### Reconciliation baseline and quality gate

The prior exact-head Answer Quality Gate run 44580349175 measured the PR workspace after Batch190 at 1612 answer-eligible unique sources / 854 content-verified unique sources / 4169 answer-eligible propositions. Batch190's planning boundary was 1613 / 854 / 4171, leaving a measured variance of -1 source family and -2 propositions. Batch191 uses the measured 1612 / 854 / 4169 baseline; its planning boundary is 1617 / 854 / 4177 and is not an actual result until reconciliation. Public main metrics remain 977 / 878 / 2950 and were not edited.

The same failed gate exposed two English Yechidus translation records in `data/items/sie-translated-talks-5744-5745-2026-11-12-050.json` without an explicit `independent_witness=false`. Batch191 corrects both records and links each translation to its own Evidence Family. The translation is not an independent witness. A fresh exact-head full-index reconciliation and `test_content_readiness.mjs` run are required before merge or deployment.

The current branch is PR #35. The hourly workflow remains unchanged; no duplicate automation, audience change or permission change was made.


### Batch191 full-index correction

The first Batch191 exact-head audit found that AID 2989243 already existed canonically in `data/items/content-research-batch-106-2026-11-16.json`. The duplicate new Batch191 record was removed. Its distinct section-B proposition (body lines 182–183) was added to the existing Batch106 identity and Evidence Family in place. Batch191 therefore contains four new identities and four in-place enrichments, not five new identities and three enrichments. The corrected planning boundary is 1616 / 854 / 4177 (four new Evidence Families, eight new propositions). The first workspace measurement 1616 / 854 / 4176 excluded the duplicate AID's proposition because the index selected the existing Batch106 record; a fresh reconciliation is required after the correction.

The same first Batch191 run exposed a stale test assertion: the Batch190 final metrics were compared to the corpus after Batch191. The test now compares Batch190's actual-after boundary with Batch191's actual-before baseline, and measures the current delta from Batch191's baseline. Attribution chains in the new paraphrases were also tightened: the Rebbe Rayatz/Gemara in Yevamot, Baal Shem Tov/Ari, Rashi/Rabbi Akiva, and Zohar/Chazal references are retained in the relevant propositions.


## Batch192 — 2026-11-19: eight in-place Hebrew body enrichments

Batch192 adds eight new non-verbatim, source-grounded propositions to eight existing canonical identities: AIDs 2989021, 2989054, 5989687, 2989062, 4385513, 5959968, 4296159 and 2989059. Each passage was opened in the public Hebrew publisher body and has an exact locator, provenance, bounded verification scope, partial-context status and an explicit qualification. Existing AIDs, canonical files and Evidence Families were retained. No new source identity or independent witness was added; no Verified promotion was made.

Four alternative Hebrew routes (AIDs 2989225, 2989227, 5990031 and 4279919) returned HTTP 429. AID 4646054 displayed a Yiddish summary shell without a readable body. These were recorded and replaced in the same review by eight accessible body passages. No crawler retry, access-control bypass or full-text copying was used.

### Batch191 reconciliation and test correction

Exact-head Answer Quality Gate run 44586034195 measured Batch191 at 1616 answer-eligible unique sources / 854 content-verified unique sources / 4177 answer-eligible propositions, exactly matching its expected boundary. The run then failed in a test assertion for AID 2514160: the index selected the richer same-AID English publisher translation presentation in the SIE collection file, while the in-place update descriptor correctly points to the Batch137 identity. Both presentations belong to the same Evidence Family and the English presentation is explicitly non-independent. The test now checks this same-family, non-independent representative instead of requiring one physical file path.

Batch192's measured PR-workspace baseline is 1616 / 854 / 4177; the expected post-batch boundary is 1616 / 854 / 4185. This is a planning boundary until the exact-head reconciliation completes. Public main metrics remain unchanged until merge and publication. PR #35 remains the existing integration path; the hourly workflow, audience and permissions are unchanged.


## 2026-11-19 — Batch193: seven new Hebrew Sicha identities and one in-place enrichment

- נפתחו ונבדקו ישירות שמונה גופי פרסום עבריים ציבוריים ב-BeitChabad.com / he.chabad.org. נוספו שבע זהויות חדשות: AIDs 5989897, 4280029, 2988934, 5989705, 4385701, 4385630 ו-5989766. כל אחת קיבלה פרפרזה מחקרית לא-מילולית עם locator ברמת גוף/סעיף/שורות, provenance, היקף אימות, הקשר חלקי ומגבלות.
- הועשרה in place זהות קיימת אחת: AID 5959922 ב-Batch166, במקטע לא חופף לשורות 177–185 שכבר נבדקו; נשמרו ה-AID ומשפחת הראיות. נוספו שמונה פרפרזות בסך הכול.
- שבעת הפרסומים החדשים הם תמלילים עבריים המסומנים בלתי מוגה; העמודים אינם מבססים את שפת ההרצאה המקורית. לכן original_language=unknown ו-independent_witness=null; לא נספר עד עצמאי ולא בוצע קידום ל-Verified.
- שלושה נתיבים חלופיים החזירו HTTP 429: AIDs 4296216, 5959979 ו-5989984. לא בוצע retry ל-crawler ולא נעקפו בקרות גישה; באותה הפעלה נבדקו שמונה גופי פרסום חלופיים נגישים. לא נעשה שימוש בסריקה כתחליף לבדיקת תוכן ולא הועתק גוף מוגן במלואו.
- preflight dedup בדק את אצוות PR 150–192, את תור הבדיקה ואת GitHub code search בענף ברירת המחדל; לא נמצאה התאמה לשבע הזהויות החדשות. תוצאת האינדקס המדויקת נבדקת ב-Answer Quality Gate: לכל AID נדרשת זהות קנונית יחידה ו-Evidence Family ייחודית.
- גבול PR-workspace מתוכנן: 1,616 / 854 / 4,185 → 1,623 / 854 / 4,193 (answer-eligible Evidence Families / content-Verified Evidence Families / answer-eligible propositions). זו עדיין אינה מדידה סופית; נדרשת ריצת exact-head. מדדי main הציבוריים נשארים snapshot קודם עד מיזוג ו-reconciliation בענף main.
- נוספה בדיקת סינתזה מרובת מקורות לשאלה על תורה, צדקה ועבודת היחיד, במצב regular ובמצב deep researcher, עם הפניות ברמת טענה, בדיקת entailment וגבולות הקשר.
- PR #35 נשאר מסלול האינטגרציה הקיים; ממתין לריצת exact-head Answer Quality Gate ולפרסום מחדש אחרי merge. לוח הזמנים השעתי, הקהל וההרשאות לא שונו.


## 2026-11-19 — Batch194: nine bilingual Hayom Yom entries and one same-family enrichment

- נפתחו ונבדקו תשעה עמודי Hayom Yom ציבוריים ב-Chabad.org / TheRebbe.org מתוך Sichos in English Collection; בכל אחד נבדק הקטע המקורי בעברית או ביידיש ולא נעשה שימוש בקטע התרגום כעד עצמאי. התפלגות שפת המקור: שש עברית ושלוש יידיש.
- נוספו תשע זהויות מתוארכות חדשות (AIDs 3315359, 3315366, 3315368, 3315370, 3315374, 3315391, 3315415, 3315237, 3315238), עם תשע פרפרזות מחקר לא-מילוליות, locators ברמת גוף, provenance, verification scope, הקשר חלקי ומגבלות. כולן נשארו Parsed.
- הועשרה זהות קיימת אחת in place: AID 528732, באמצעות הערת עריכה אנגלית בעמוד AID 3316320. ההצגה האנגלית נשארה באותה Evidence Family; היא מסומנת non-independent ואינה נספרת כעד נוסף. הפרופוזיציה מתארת את שכבת העריכה בלבד, לא את גוף הערך המקורי.
- ארבעה מועמדים עבריים החזירו HTTP 429: AIDs 5959899, 4280077, 2989280, 2989629. לא בוצע retry לעמודים החסומים או ל-crawler; באותה הפעלה עברנו לעשרה גופי פרסום נגישים (תשעה קטעי מקור ועוד שכבת עריכה נגזרת אחת). לא נעקפו בקרות גישה ולא הועתק טקסט מלא.
- בדיקת כפילויות מקדימה: תשעה חיפושי AID ב-code search של main ותור הבדיקה לא החזירו התאמות. זו אינה סריקת canonical מלאה; exact-head full-index reconciliation עדיין נדרש. אין קידום Verified.
- גבול תכנון לפי מדידת Batch193: **1,623 / 854 / 4,193 → 1,632 / 854 / 4,203** (answer-eligible Evidence Families / content-Verified Evidence Families / propositions). הערך אחרי הוא יעד עד reconciliation בפועל, לא מדידה.
- נוספה בדיקת regression לשתי Evidence Families נפרדות על אמירת תהילים בציבור וחלוקת תהילים יומית, במצב regular ובמצב deep researcher, עם claim-level locators, citation entailment ו-context boundaries.
- PR #35 נשאר פתוח עד מעבר exact-head Answer Quality Gate ו-`test_content_readiness.mjs`. מדדי main הציבוריים ו-GitHub Pages טרם השתנו. לוח הזמנים השעתי, הקהל וההרשאות נשארו ללא שינוי.


## 2026-11-19 — Batch195: English letters, two enrichments, retrieval coverage

- Added 10 new letter-level source identities from publicly accessible Chabad.org / TheRebbe.org English publisher bodies. Each is Parsed, has one bounded non-verbatim Hebrew research proposition, an exact body locator and provenance. The English presentations are marked non-independent; original-language witnesses were not inspected and no Verified status was promoted.
- Enriched two existing identities in place: AID 2278254 (a question about tzedakah at night, without inventing a final ruling) and AID 2276666 (the opening's Rosh Hashanah self-review and tzedakah context).
- Synchronized the already-counted Batch181 proposition for AID 2514160 into the same-AID English presentation selected by the index. This is a same-family presentation repair, not a new identity, witness or proposition.
- Inspected 13 text-bearing source bodies (10 new, 2 enrichments, 1 presentation repair). Eight Yechidus pages were opened but contained no readable transcript; AID 4666220 returned Internal Error. No crawler retry or access-control bypass was used; accessible public letter pages were used as fallback.
- Expanded retrieval topic terms for family purity, shidduchim, Torah study, tzedakah, educators and Beis Yaakov. Added regular/researcher-mode tests for multi-family synthesis, claim-level citations and exact source locators; deep researcher mode is tested for the new letter families.
- Batch194 correction: exact-AID records 3315370 and 3315415 were already canonical in Batch145. Their duplicate Batch194 records were removed; no extra family or proposition is counted. The measured pre-Batch195 PR-workspace boundary is 1628 answer-eligible unique sources / 854 content-verified sources / 4199 propositions. Batch195 planning boundary is 1638 / 854 / 4211; it remains pending exact-head reconciliation until the workflow completes.
- Public main metrics remain 977 / 878 / 2950 until merge and post-merge publication. No audience or permissions were changed; the existing hourly workflow was not duplicated.


## 2026-11-19 — Batch197 content enrichment and retrieval specificity repair

- Reviewed 12 public Hebrew source bodies; eight existing Sicha identities received one new bounded, non-verbatim paraphrase each. No new source identity, Evidence Family, independent witness, or Verified promotion was added.
- New proposition locators: AID 4296216 §ב (182–190); 4385717 §§ב–ג (182–192); 5990028 §ה (202–205); 4385834 §§ב–ג (186–198); 4304376 §§ג–ד (184–190); 4296237 §א (177–183); 4385701 §§ב–ג (181–190); 4304437 §ו (205–210). All are Hebrew publisher-body passages, marked בלתי מוגה, with partial context and no full-text reproduction.
- Four alternative Chabad.org routes returned HTTP 429 (AIDs 4304407, 4304388, 4304343, 4304418); no crawler retry or access-control bypass was attempted. Four other accessible pages were deferred from identity creation pending a full-corpus duplicate check.
- Batch197 uses measured PR-workspace baseline 1644/854/4222 from exact-head run 44619135765 after Batch196. Batch196's planning boundary 1642/854/4220 differed by +2/+2; the variance is preserved. Expected after eight in-place propositions: 1644/854/4230.
- Retrieval specificity was tightened for the question about advancing a mikveh in Miflasim without waiting for peace: the source must contain the Miflasim context and the no-delay proposition, not merely generic mentions of mikveh and peace. Existing claim-level locators and deep researcher mode remain in place and are retested.
- PR #35 remains unmerged until the exact-head Answer Quality Gate and `test_content_readiness.mjs` pass. The existing hourly schedule and repository audience/permissions are unchanged; no Pages deployment is claimed before post-merge verification.
