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
