# מענה לדורות — Breadth-First Ingestion

עודכן: 17.09.2026

מטרת השלב הנוכחי: להרחיב במהירות את היקף הקורפוס בלי לערבב בין "נאסף" לבין "אומת".

## עקרון עבודה

איסוף רחב קודם; אימות מדורג אחר כך.

רשומה יכולה להיכנס ל-staging גם כאשר עדיין אין witness ישיר, כל עוד נשמרים מקור הגילוי, URL, locator, מצב הקשר, מצב זכויות והחסמים לאימות. אין לקדם אותה ל-canonical item-level בלי לעמוד בכללי PROJECT_CANON.md.

## מסלולים

1. Discovery/Bulk collection — קליטה רחבה ממקורות חוקיים ונגישים.
2. Normalization — נרמול תאריכים, מזהים, כרכים, מספרי איגרות וסוגי מקור.
3. Deduplication — איתור מועמדים לכפילויות לפי מזהים, ציטוטים, תאריכים, fingerprint וקישורים מערכתיים.
4. Promotion queue — בחירת פריטים בעלי provenance מספיק לקידום ל-Discovered/Indexed canonical item.
5. Verification — בדיקה מול witness ישיר/מוסמך וקידום ל-Linked/Verified לפי הראיות.

## הפרדה מחייבת

- `data/staging/` — חומר שנאסף אך טרם עבר קידום קנוני.
- `data/items/` — רשומות קנוניות ברמת הפריט.
- `data/access-requests.json` — חסמי גישה והרשאות.

נתוני staging אינם נספרים כ-item-level canonical counts ואינם מוצגים כידע מאומת.

## שדות מינימום ב-staging

`staging_id`, `discovery_source`, `source_url`, `source_class`, `collection_status`, `verification_status`, `context_status`, `rights_status`, `ingested_at`.

## מדיניות קידום

לקידום מ-staging ל-item canonical נדרשים לפחות:
- מקור מדויק ויציב;
- זיהוי פריט סביר שאינו רק טענה כללית על קורפוס;
- provenance בסיסי;
- סימון ברור של הקשר חסר;
- בדיקת כפילויות ראשונית;
- שמירה על מגבלות זכויות.

`Verified` נשאר שלב נפרד ומאוחר ואינו נדרש לצורך עצם הקליטה הרחבה.

## סדר עדיפויות לקליטה רחבה

1. מענות בכתב ותשורות עם locator/scan provenance.
2. אגרות עם מספר/כרך/עמוד ברורים.
3. יחידויות/אודיו/וידאו עם event identifiers.
4. שיחות ומאמרים עם מהדורה/תאריך ברורים.
5. מקורות ארכיוניים עם finding aids או item IDs.

## בקרות

- אין להמציא טקסט חסר.
- OCR נשמר כ-derived/unverified.
- תרגום AI של צד שלישי אינו witness.
- "לא פורסם" או "ייחודי" נשמר רק כטענת המקור עד אימות עצמאי.
- כל batch מקבל manifest וספירת רשומות.
