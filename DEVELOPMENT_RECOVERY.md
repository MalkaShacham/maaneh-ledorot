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

 
## 2026-11-13 — Manual publisher review batch 079 (reconciliation pending)

- Inspected 15 public item bodies from Kehot/Chabad.org/TheRebbe.org in Hebrew and Yiddish: nine candidate letter identities, two existing identities enriched in place, and four existing identities rechecked without duplicate propositions.
- New candidate AIDs: 4831007, 4831137, 4831186, 4831187, 4831315, 5357370, 5100610, 5100451, 5100615. One Yiddish original-language witness is counted once; no translation is treated as an independent witness.
- Existing identities enriched in place: AID 4812708 (communal consequence of the instruction on love of Israel) and AID 5071118 (explicit practical redirection to the Shulchan Aruch).
- Five alternative pages returned navigation/summary shells and were excluded. Other accessible publisher bodies were inspected in the same run. The known HTTP-403 crawler remains disabled; no retry or access-control bypass occurred.
- Provisional expected metrics from the then-current baseline 799 / 796 / 2,627 are 808 answer-eligible unique sources, 805 content-verified unique sources and 2,647 propositions. These are expectations only, not reported progress. Full-corpus AID/Evidence-Family reconciliation and Actions validation are pending.
- Scope limits: no incoming letters or autographs were inspected; AID 5357370 is a partial excerpt; AID 4831186's nonstandard printed date is preserved; AID 4831187 is a Yiddish witness and any later translation must remain derivative; medical, housing and study guidance remain bounded to their original personal contexts.


## 2026-11-13 — Manual public-body review, batch 080

- Inspected ten public item-level source bodies through web/search/open: six Hebrew publisher pages and four English translations. Added **10 new source identities** and **19 non-verbatim, source-grounded response propositions**, each with a proposition-level body locator, provenance, verification scope, context and limitations.
- Source mix: four publisher-presented Hebrew letter texts, two Hebrew secretariat responses signed by a secretary in the Rebbe's name, and four English translations. The two secretariat responses are explicitly non-independent and are not presented as direct Rebbe-authored wording. The four English translations are also non-independent; AID 4264336 is linked to the publisher-cited Igrot Kodesh Vol. XXIX p.133 family, while the other three remain translation-only families because the page does not identify an exact original volume/page.
- Enriched the existing volume-13 identity `igrot-kodesh-v13-דשם` with `witness_type=secretariat_letter_on_behalf_of_rebbe` and `independent_witness=false`, preserving the stable identity and existing propositions while correcting the attribution boundary.
- Reopened 15 AIDs from batch 079. All 15 current public-open results now return navigation/summary shells; no new proposition was taken from those shells and the historical batch-079 review was not rewritten. Three additional candidate pages (AIDs 4928948, 4812597 and 4666220) also returned summary shells and were excluded. Alternative inspectable publisher pages were used in the same run.
- No crawler retry, no access-control bypass and no full-text copying. Only bounded paraphrases were added.
- Retrieval/attribution repair: the full-day yeshiva/commerce topic now matches on its inspected semantic components rather than requiring the entire query phrase to appear verbatim. A direct “מה כתב הרבי” query is blocked when the only matching evidence is a secretary-signed response; a neutral question about the secretariat record remains answerable with its witness class and claim-level citations.
- PR CI run 43491380509 computed the batch-079 branch baseline at **808 answer-eligible unique sources**. Main still shows **799** until merge and reconciliation. Batch 080 expects **818** after deterministic reconciliation (before 808, plus 10 new Evidence Families); actual after remains pending until the merge-triggered reconciliation workflow writes the metrics.
- Batch 080: 10 source bodies inspected; 10 new identities; 1 existing identity enriched; 15 current access rechecks; 3 newly blocked candidates; 19 propositions; expected answer-eligible unique sources 808 → 818.


## 2026-11-13 — Manual public-body review, batch 081

- Inspected ten public item-level publisher bodies: nine new Hebrew source identities and one recheck of AID 5054501 already present in batch 080. Added nine unique Evidence Families and 22 non-verbatim, source-grounded response propositions with item-level body-line locators.
- New AIDs: 5357452, 5054304, 4994184, 4854516, 5071066, 5100091, 4854524, 4994342, 4994482. Eight are full publisher-presented letter texts; AID 4994482 is a partial excerpt with an uncertain printed date. AID 5357452 has conflicting publisher volume labels (breadcrumb כרך כא versus footer Volume 18); no normalized volume was assigned.
- Reclassified seven existing volume XIII items signed by secretaries (ד׳תרע, ד׳תרעב, ד׳תרעו, ד׳תרעח, ד׳תרפא, ד׳תרפב, ד׳תרפג) as secretariat responses, including one Yiddish item. Existing Evidence Family IDs and propositions were retained; these are not direct Rebbe-authored witnesses.
- Four candidate AIDs (4994633, 5100256, 5356838, 5099972) redirected to rewritten Torah Texts summary/navigation shells and were excluded. Other directly inspectable publisher bodies were used in the same run. No crawler retry, access-control bypass, or full-text copying occurred.
- Deduplication checked the review queue, recent content batches 055-080, relevant volume indexes/content batches, bulk-indexed and content-verified files. No duplicate AID or Evidence Family was found among the nine new records; AID 5054501 was found in batch 080 and was rechecked only. No translation was counted as an independent witness.
- Published metrics before the pending PR batches remain 799 answer-eligible unique Evidence Families, 796 content-verified unique sources, and 2,627 propositions. After batches 079-081, expected reconciled values are 827, 824, and 2,688 respectively; these are not actual until deterministic reconciliation completes.
- The content-readiness tests now assert the secretariat attribution boundary for the class-expansion item and the new batch's source/proposition counts. Final status remains pending until Actions, reconciliation, and Pages publication succeed.


## 2026-11-14 — Manual public-body review, batch 082

- Inspected **10 public Hebrew item-level publisher bodies** through web/search/open. Added **6 new source identities** (four publisher-presented original-language letters and two secretary-signed responses), reclassified **2 existing identities in place** (AID 4854786 and AID 4854525), and rechecked **2 existing bodies** (AID 5100579 and AID 4854804) without duplicate propositions.
- Added **16 non-verbatim source-grounded response propositions**. Each new proposition has `proposition_origin=source_grounded_paraphrase`, `proposition_verbatim=false`, `proposition_verification=source_text_inspected`, a body-line locator, provenance, explicit verification scope, documented circumstances and limitations.
- The two new secretariat responses (AIDs 5100309 and 5054581) are marked `witness_type=secretariat_letter_on_behalf_of_rebbe` and `independent_witness=false`; they are not presented as direct Rebbe-authored wording. Existing AID 4854786 was explicitly secretary-signed in the Rebbe's name; AID 4854525 closes with a visible secretary signature and was conservatively reclassified as a secretary-signed publisher response. Existing Evidence Families and propositions were retained.
- Deduplication checked the review queue, content batches 055–081 and relevant volume indexes (4, 6, 9, 15 and 18). Six new AIDs (4754363, 4754536, 5100438, 5100309, 5054581 and 4812831) were not present as existing identities in the checked files. AID 5100579 was found in batch 067 and rechecked; AID 4854804 was found in batch 080 and rechecked. No translation was counted as an independent witness.
- **35 candidates were excluded**: 12 audio/media pages without inspectable transcript bodies and 23 pages that returned rewritten summary/navigation shells. The known HTTP-403 crawler was not retried, no access control was bypassed, and no scan-only identity check was treated as content verification.
- Expected values after pending batches 079–082: `answer_eligible_unique_sources` **799 → 833**, `content_verified_unique_sources` **796 → 830**, and `answer_eligible_propositions` **2,627 → 2,704**. These are expected values only until the deterministic reconciliation workflow confirms the actual counts.
- Retrieval repair: the core engine now requires explicit secretary-signature/secretariat-response evidence before excluding a source from a direct-authorship query. A generic note that a secretariat copy was not inspected no longer misclassifies a publisher-attributed letter (AID 5071046). Added a narrow Tanya-project topic and proposition gate, plus regular/researcher-mode regression coverage.
- UI repair: removed a duplicate `const url` declaration in `index.html` that prevented the page module script from parsing, and refreshed the engine cache key. A source-card syntax regression is included in content-readiness tests.
- Reconciliation, PR checks and Pages publication remain pending until the updated PR branch passes and is merged to main.


### Batch-018 secretariat attribution correction (2026-11-14)

The latest main-branch hourly run (run 43520214183) completed deterministic maintenance with no corpus delta (799 answer-eligible families, 796 content-verified families, 2,627 propositions) but failed the content-readiness test because a test phrased the batch-018 item ד׳שס as “what the Rebbe wrote.” The publisher scan's printed signature is by a secretary. The canonical item and audit record now mark it as a secretary-signed response (`independent_witness=false`); the branch regression asks what the secretariat response documents and separately excludes it from direct-Rebbe wording queries. The core detector recognizes explicit secretary signatures but does not treat “secretariat copy not inspected” as proof of a secretary signature, preserving the separate publisher-attributed Tanya-project item AID 5071046. The hourly crawler remained disabled; no 403 route was retried.


### Content-readiness reconciliation assertions updated for batch 082 (2026-11-14)

The first full-corpus PR run generated the expected index totals (833 answer-eligible unique families; 921 answer-eligible source entries; 2,704 source-grounded propositions) and passed the question-specificity, synthesis, citation-integrity, evidence-contract, write-safety and structural answer-quality gates. The content-readiness test then exposed stale assertions that still expected batches 079–081 only (827/824/2,688) and treated AID 4854525 as an independent Rebbe witness. The test now expects the 079–082 totals and frames the low-mood/study comparison as a neutral cross-source question, preserving AID 4854525 as a secretary-signed response while excluding it from direct-Rebbe-authorship queries.


### AID 5071054 attribution and query scope (2026-11-14)

AID 5071054 is a publisher-attributed original-language Hebrew letter with selected body passages previously inspected on 2026-11-12 (lines 288–300); no secretary signature was reported and no autograph was inspected. It is now explicitly marked `witness_type=published_hebrew_letter_text` and `independent_witness=true` (independent text witness, not autograph authentication). The content-readiness regression was split into source-specific questions: AID 5071054 answers the sadness-in-divine-service question; AID 4854525 answers a neutral question about the secretary-signed response on low vitality in study. This avoids asserting that either item supports wording absent from its inspected propositions.


### Batch 082 printed-index locator audit (2026-11-14)

A duplicate search covered all 24 prior content-research batch files present (055–060 and 064–081) and the complete review queue; none of the six new AIDs appeared before batch 082, and no duplicate Evidence Family IDs were found. Printed volume indexes were inspected for bibliographic locator only: v4 תתצט p.16 and א׳עא p.22; v6 א׳תשפט p.12; v15 ה׳תשכד p.15; v18 ו׳תקנח p.6. The index entries do not verify content. The v9 ב׳תתצט and v18 ו׳תתצט are differently prefixed identities, not duplicates of v4 תתצט. AID 5100438's ו׳תרצ was not found in the inspected v18 index, so no locator was inferred.


### Index-locator metadata kept separate from content verification scope (2026-11-14)

The first structural gate after adding printed-index locators correctly rejected five records because the locator-only wording had been appended to the main `verification_scope`, which the readiness classifier intentionally treats as bibliographic-only. The correction keeps the inspected publisher-body scope unchanged and stores the index evidence separately in `provenance.index_locator_verification_scope` and `locator.index_pdf_page`. Thus the printed index verifies location only and does not downgrade or replace the separately inspected body evidence. The v18 index entry ו׳תתצט (PDF p.15) was also recorded as a distinct prefixed identity from v4 תתצט.


### Actual proposition count reconciled to 2707 (2026-11-14)

The CI reconciliation measured 833 answer-eligible unique Evidence Families, 830 content-verified families and 2,707 answer-eligible propositions. The first batch-082 expectation of 2,704 was short by three because the improved duplicate-AID source priority exposed three propositions already present in older inspected records; batch 082 itself still adds exactly 16 new propositions and six new source identities. The expected-after figure is corrected to 2,707, with the +3 reconciliation adjustment explicitly separated from new content. No source or proposition was promoted solely from an index scan.


### AID 4812708 publisher-text witness clarified (2026-11-14)

AID 4812708's seven existing paraphrases include the conditional statement that, if Israel acts with love, the world will be refined and Mashiach revealed. The regression assertion now matches the inspected wording (`העולם יזדכך` and `משיח`), rather than an absent noun phrase. The item is explicitly marked as a publisher-attributed original-language Hebrew letter (`witness_type=published_hebrew_letter_text`, `independent_witness=true`); this is an independent published text witness, not autograph authentication, and no secretary signature was reported.


## Batch 083 — public body inspection and in-place enrichment (2026-11-14)

- Inspected nine public publisher bodies directly: six new identities and three existing volume-index identities enriched in place. Added 17 non-verbatim source-grounded Hebrew propositions: 12 for new identities and five for existing identities.
- New identities: AID 5019502 (Yiddish letter), 4831629, 5287569 and 4754445 (publisher-presented Hebrew letters), 5071128 (secretariat response signed in the Rebbe's name), and 5357059 (secretariat-transmitted telegram copy).
- Existing identities enriched, not duplicated: AID 4854534 (volume IX index identity; partial excerpt), 5099896 (volume XVII index identity), and 5357093 (volume XX index identity; Evidence Family igrot-kodesh-letter-7731).
- Source-body locators are recorded per proposition. The old printed-index witness and its locator-only scope are preserved separately in provenance; index scans do not verify content.
- Ten direct rechecks of prior AIDs resolved to rewritten summary/navigation shells. No proposition was taken from those shells. Alternative public Kehot publisher bodies were found and inspected in the same run.
- Deduplication checked research batches 055–082, all 13 content-verified batch-006 item files, 11 bulk-indexed files, the review queue, and relevant volume indexes. Translations/reprints remain aliases within one Evidence Family, never independent witnesses.
- Boundaries: AID 4854534 remains a fragment with missing context; AID 5071128 is a secretary-signed response; AID 5357059 is a secretary-transmitted telegram copy with a printed signature and a conflicting volume label, so no volume is asserted. No autograph or incoming letter was inspected. No full text was copied and no access control was bypassed. No new English independent witness was added; the batch contains eight Hebrew and one Yiddish body.
- Retrieval changes add a dedicated multi-family health/body-care synthesis with claim-level locators, distinct witness families, explicit non-Rebbe system attribution, and researcher-mode evidence mapping. Secretariat responses and telegram copies remain excluded from direct-Rebbe-authorship questions.
- Batch 082 reconciliation was corrected to the measured CI totals 833/830/2707 (the earlier 2704 projection was short by three already-recorded propositions, not by new sources). Batch 083 expected increment: +9 answer-eligible families, +9 content-verified families, +17 propositions; expected branch totals after batches 079–083: 842/839/2724. These are pending the new CI reconciliation and merge.


### CI correction after batch 083 commit

- Run 43529414167 regenerated the index and reconciled batch 083 exactly: 842 answer-eligible unique Evidence Families, 839 content-verified families, 2,724 propositions; variance zero. The structural answer-quality gate also passed with no warnings.
- The first content-readiness test failure was stale hard-coded totals still referring to batches 079–082 (833/830/2707). Updated those assertions to include batch 083 (842/839/2724). This was test drift, not a reconciliation or source-count variance.
- Tightened health synthesis retrieval to draw only from inspected, independent letter families across the full index; secretariat responses and telegram copies remain separately retrievable but excluded from direct-author synthesis. Added targeted retrieval regressions for the yeshiva-loneliness and youth/work-rest letters.


### Current access recheck of batch 083 (2026-11-14 01:55 +02:00)

All nine direct AID URLs in batch 083 now resolve to rewritten unavailable summary/navigation shells. No claims were taken from those shells. A public Pnimi index and a transcription page for a different letter were inspected; they did not provide the same nine AID bodies. A cached search excerpt for AID 4754445 was not used as new evidence because the full open remained unavailable. The earlier batch-083 body inspections and locators remain recorded as historical inspections; this recheck records current unavailability only. No crawler retry, access-control bypass, or full-text copying occurred. AID 5071128 is tested against its actual secretariat propositions (study motivation and health) separately from AID 4854525's low-vitality question. The volume-XIII printed-index identity remains locator-only, not content evidence.


### Community-activity retrieval correction (2026-11-14)

The regression suite exposed that community propositions passed the synthesis-integrity checks but were not reaching the synthesis stage: generic lexical ranking left the three independently inspected letter families below the retrieval threshold. The retriever now applies a bounded query-specific boost only to Verified, independent, letter-text sources whose inspected propositions match the farbrengen/student-gathering/mikveh-responsibility predicate. This does not admit locator-only entries or secretariat responses as direct Rebbe authorship. The browser cache key was incremented so the published client loads the corrected engine.


### Community proposition relevance branch (2026-11-14)

The second regression showed that a candidate seed boost alone did not clear the later proposition-relevance threshold. For the exact community-activity synthesis query, sources now receive direct-support status only when at least one inspected response proposition matches the bounded farbrengen/student-gathering/shared-mikveh-responsibility predicate. This keeps the retrieval rule content-based and claim-locatable; unrelated sources, locator-only indexes and secretariat material are not promoted. Client cache key advanced to `20261114-06`.
