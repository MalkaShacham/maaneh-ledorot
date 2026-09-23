# מענה לדורות — Answer Engine Specification

## מטרת המנוע
המנוע אינו מנוע "מצא מילה" ואינו רשימת קישורים. הוא חייב לענות לשאלה מתוך ראיות קנוניות רלוונטיות, כאשר precision קודמת ל-recall. אם אין די ראיות — זו תוצאה תקינה ויש לומר זאת.

## 1. Question understanding
לכל שאלה יש לחלץ, בלי להמציא פרטים שלא נאמרו:
- `topic`
- `subtopic`
- `intent` — למשל guidance / historical / comparative / bibliographic / factual / pattern
- `entities`
- `circumstance_constraints` — זמן, קהל, מצב, מקום, סוג פנייה אם צוינו
- `requested_granularity`

הרחבות רב־לשוניות משמשות ל-retrieval בלבד ואינן משנות את משמעות השאלה.

## 2. Candidate retrieval + proposition reranking
שלב ראשון רשאי להשתמש ב-title, taxonomy, metadata, summary ושדות חיפוש רב־לשוניים כדי לייצר מועמדים. שלב שני חייב לבצע reranking ברמת התוכן/ה-proposition ולא ברמת token בלבד.

מקור מתקבל רק אם לפחות proposition מתועד בו תומך ישירות בשאלה או בתת־שאלה מזוהה. הופעת מילה בכותרת, שם אדם, תאריך או metadata אינה מספיקה.

### Relevance gate
- `direct_support`: תמיכה ישירה בשאלה — מתקבל.
- `contextual_support`: רקע רלוונטי אך אינו עונה — יכול להופיע במצב חוקר כרקע מסומן, לא כראיה לטענה.
- `lexical_only`: התאמה מילולית בלבד — נדחה.
- `unknown_content`: כותרת/אודיו ללא proposition או תקציר תוכני — אין לסנתז ממנו תוכן.

כאשר אין לפחות מקור אחד עם `direct_support`, אין תשובה תוכנית. כאשר נטענת מגמה/דפוס, נדרשות לפחות שתי Evidence Families עצמאיות; תרגום, פרסום חוזר או witness כפול אינם corroboration עצמאי.

## 3. Source-grounded proposition
לכל מקור כשיר יש לייצג, ככל שמתועד בלבד:
- `documented_circumstances`
- `question_or_problem` — רק אם ידוע
- `response_propositions`
- `conditions_or_qualifications`
- `topic`
- `subtopic`
- `audience`
- `period/date`
- `source_language`
- `context_completeness`
- `verification_status`
- `verification_scope`
- `witness_provenance`
- `evidence_family_id`
- `duplicate_or_parallel_relations`
- `primary_secondary_status`

שדה חסר נשאר חסר. אין reconstruction של פנייה נכנסת, נסיבות, זהות או כוונה.

## 4. Regular mode — answer first
הפלט מתחיל בתשובה קצרה ובהירה, לא ברשימת מקורות. זו סינתזה של המערכת ולכן אין לנסח אותה כאילו היא ציטוט של הרבי.

כל טענה מהותית מקבלת הפניה ממוספרת `[1]`, `[2]` וכו'. כל מספר חייב להפנות למקור שתומך באותה טענה. לאחר הסינתזה תופיע רשימת מקורות ממוספרת תואמת ובה: provenance, תאריך/כותרת, שפת מקור, סטטוס אימות, context completeness וקישור ישיר כאשר מותר.

אם יש מקור יחיד: `נמצא כרגע מקור רלוונטי יחיד; אין להסיק ממנו דפוס רחב.`

אם אין די ראיות: `המאגר הקנוני הנוכחי אינו מכיל די ראיות רלוונטיות כדי לענות בביטחון על השאלה.` ניתן לציין אילו חלקים חסרים, בלי למלא אותם.

## 5. Researcher mode — evidence analysis
מצב חוקר הוא מוצר מחקרי שונה, לא CSS נוסף. הוא מתחיל בסקירה מסונתזת מורחבת ואז מוסיף, רק כאשר הנתונים מאפשרים:
1. פירוק לטענות/תת־נושאים.
2. evidence map בין טענה למקורות.
3. הבחנות בין תקופות, קהלים, נסיבות וסוגי מקור.
4. דפוסים חוזרים לצד חריגים, מתחים או הבדלים.
5. מקורות בכיוונים שונים בלי לשטח אותם לקונצנזוס.
6. provenance ברמת witness ו-scope של האימות.
7. Pipeline status: Discovered / Indexed / Parsed / Linked / Verified.
8. context completeness.
9. שפת המקור; תרגום מסומן `derived` ואינו witness עצמאי.
10. Evidence Family, מקבילות וכפילויות.
11. primary source לעומת later publication / editorial processing / translation.
12. `answered_well` ו-`insufficient_evidence` — אילו חלקים בשאלה נענו ואילו לא.
13. רשימת מקורות רחבה יותר מן המצב הרגיל.

## 6. Citation entailment
Citation אינו קישוט. לפני הצגה יש לבדוק: אילו מילים בטענה נתמכות בפועל במקור? אם המקור תומך רק בחלק, יש לצמצם את הטענה או להוסיף מקור מתאים. מקור contextual בלבד אינו citation לטענה תוכנית.

## 7. Dedup לפני synthesis
Dedup נעשה לפני ספירת תמיכה ולפני ניסוח דפוס:
`item → witness → event → Evidence Family`.
שני URL-ים לאותו פרסום, תרגום של אותו מקור, או פרסום מאוחר של אותו witness אינם שתי ראיות עצמאיות.

## 8. Evaluation gate
כל שינוי במענה נבדק מול `data/evaluation/answer-quality-regression.json` בשני המצבים. בדיקות החובה: relevance, answerability, citation entailment, source diversity, hallucination, researcher-depth differential.

כשל קריטי הוא אחד מאלה:
- מקור lexical-only מוצג כראיה.
- synthesis מתאר תוכן שאינו קיים ב-proposition/summary מאומת.
- citation אינו תומך בטענה.
- תרגום/כפילות נספרים כ-corroboration.
- מצב חוקר משכפל את המצב הרגיל ללא עומק ראייתי נוסף.
- המערכת ממציאה הקשר כדי להפוך מקור חלקי לתשובה מלאה.

## 9. Current implementation gap
ה-Alpha הנוכחי משתמש עדיין ב-token/substring scoring על `search_text`, title ו-summary. הוא שלב candidate retrieval בלבד ואינו עומד עדיין ב-relevance gate וב-proposition reranking המוגדרים כאן. מצב חוקר הנוכחי חושף metadata טכני בלבד ולכן אינו עומד בדרישת researcher-depth differential. אלה פערי היישום בעדיפות העליונה.
