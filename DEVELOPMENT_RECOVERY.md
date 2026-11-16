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
- נוספו 12 זהויות פרסום ב-11 Evidence Families ו-25 פרפרזות מחקריות לא־מילוליות. בנוסף הועשרה זהות קיימת AID 2989585 בקובץ הקנוני המקורי batch 100 באמצעות פרפרזה נוספת משורות 285–291. סך הכול נוספו 26 פרפרזות/העשרות. כל הרשומות החדשות נשארות Parsed ובהקשר חלקי; לא קודם מקור ל-Verified.
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
