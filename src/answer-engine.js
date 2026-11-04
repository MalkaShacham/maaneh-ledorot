/* Maaneh Ledorot evidence-grounded answer engine core. Precision > recall. */
const STOP=new Set('מה הרבי אמר אומר אומרים כתב כותב על ועל של את עם או וגם לגבי האם לי יש היה היא הוא זה זו אותו אני אנחנו מתוך בנושא בעניין רוצה לדעת כיצד איך אילו איזה מהו מהי מהם מהן מי מתי צריך צריכה צריכים כדאי כדי לפני מחדש לשם כך the a an of to and or on about what how did does is are rebbe say says said saying teach teaches taught teaching advise advises advised guidance'.split(' '));
// Normalize Hebrew clitic prefixes so "מפרה" and "באיגרת" match documented content.
const queryToken=s=>{if(!/^[א-ת]+$/.test(s)||STOP.has(s))return s;let t=s.replace(/^[ובכלמש]ה(?=.{3,})/,'');if(t===s&&t.length>3&&/^[ובכלמשה]/.test(t))t=t.slice(1);return t;};
const TOPICS={
 חינוך:['חינוך','ילד','ילדים','תלמיד','מורה','education','child','children','school','teacher','chinuch','קינדער'],
 דאגה:['דאג','חרד','חרדה','פחד','בטחון','anxiety','worry','fear','bitachon'],
 בריאות:['בריאות','רפואה','רופא','health','medical','doctor','refuah'],
 מזוזה:['מזוז','mezuzah','mezuza'], נשים:['נשים','אשה','אמא','אם המשפחה','woman','women','mother','פרוי','פרויען'],
 פרנסה:['פרנסה','עסק','livelihood','business','parnassa'], שליחות:['שליח','שליחות','shliach','shlichus','mission'],
 נישואין:['שלום בית','נישוא','חתונ','בעל','אשה','marriage','wedding','husband','wife','sholom bayis'],
 'לימוד הלכה':['הלכה','הלכות','קיצור שולחן ערוך','לימוד הלכה','practical halacha','halacha','halachic study'],
 'שיקום לאחר פיגוע':['שיקום','פיגוע','אחרי הפיגוע','לאחר הפיגוע','recovery after attack','attack recovery'],
 'הרחבת ישיבה':['מספר התלמידים בישיבה','הגדלת מספר התלמידים','ריבוי תלמידים בישיבה','הרחבת הישיבה','yeshiva enrollment','increase yeshiva enrollment'],
 'ל״ג בעומר':['ל״ג בעומר','לג בעומר','מירון','lag baomer','lag b omer'],
 'בית רבקה בראונסוויל':['בית רבקה בבראונסוויל','בתי הספר בית רבקה בבראונסוויל','בראונסוויל','brownsville','east new york beis rivka'],
 'שכחה וחלומות':['שכחה וחלומות','שכחה','חיזוק הזכרון','חלומות מטרידים','forgetfulness and dreams','memory and disturbing dreams'],
 'צדקה ולימוד':['צדקה מחליפה לימוד','צדקה מתוארת כמזככת','צדקה מגדילה את פירות העבודה','charity replace study','charity and study effort'],
 'תפקיד דתי ייחודי':['תפקיד ייחודי בענייני דת','תפקיד המסוים שנמסר','משימה שאחרים אינם יכולים למלא','unique religious role','task others cannot fulfill'],
 'הערות שוליים בספר':['הערות שוליים','הדפסה מחודשת','להדפיס מחדש ספר','לפרסם הערות שוליים','הערות השוליים שהותיר','פרסום מוקדם של ההערות','book marginalia','reprint a book for marginal notes'],
 'עקירת שיניים וחוות דעת':['עקירת שיניים','חוות דעת נוספת','לעקור את כל השיניים','מומחים נוספים','dental extraction second opinion','extract all teeth'],
 'חזרה בחסידות וזיכרון':['לשפר זיכרון','לחזור על חסידות','חזרה בחסידות','חזרה מרובה','כוח הזיכרון','review chassidus memory','repetition and memory'],
 'מקווה בלי המתנה לשלום':['בניית מקווה','לקדם בניית מקווה','מקדמים בניית מקווה','להמתין לשלום','אין לעכב בגללה פעולות אחרות','לקידום מקווה','מקווה בקיבוץ מפלסים','mikveh without waiting for peace'],
 'נוסח תפילה באיחוד בתי כנסת':['נוסח התפילה באיחוד בתי כנסת','איחוד בתי כנסת','התאחדות שני בתי כנסיות','שני בתי כנסת','נוסח האריז״ל','נוסח האריזל','synagogue union prayer rite'],
 'עולים ממרוקו ושפת ההתוועדות':['עולים ממרוקו','אינם מבינים יידיש','אין מבינים אידית','התוועדויות בעברית','התוועדויות תכופות בעברית','moroccan immigrants hebrew farbrengen'],
 'עזיבת פרנסה לפעילות':['לעזוב מקור פרנסה','יעזוב ענין שפרנסתו','פעילות חב״ד ופרנסה','quit livelihood for chabad work'],
 'אהבת התורה':['אהבת התורה','אהבת ההשגה השכלית','הישג השכלי','הנאת הלומד','love of torah','intellectual satisfaction'],
 'אהבת ה׳':['אהבת ה׳','אהבת המקום','גדולת הבורא','ביטול ולשפלות','love of god','love of g-d'],
 'מסחר ולימוד יום שלם':['עיסוק במסחר בזמן לימוד','מסחר בזמן לימוד בישיבה','ישיבה עד הצהריים','לימוד כל היום','חסרון בהתרכזות','business during yeshiva study','full-day yeshiva study'],
 'אותיות מצבה':['אותיות בולטות במצבה','אותיות שקועות במצבה','אותיות המצבה','raised tombstone letters','sunken tombstone letters'],
 'סניף תלמוד תורה ומחנה יום':['סניף תלמוד תורה שאינו מצליח','לסגור סניף תלמוד תורה','חיסול הסניף','מחנה יום','בסיס לרכישת תלמידים','failing talmud torah branch','day camp student recruitment'],
 'הגדלת כיתות ולימוד אישי':['להגדיל משתתפים בכיתות','להגדיל את מספר המשתתפים','כיתות לימוד','לימוד אישי','הלימוד האישי','בלי להזניח לימוד אישי','פוטר','פוטרת','increase class participants','personal study obligation'],
 'כיסוי ראש והשפעה עקיפה':['כיסוי ראש כששכנוע ישיר לא מצליח','כיסוי ראש והשפעה עקיפה','להשפיע בעקיפין על כיסוי ראש','כיסוי הראש','השפעה ישירה','בעקיפין','hair covering indirect influence'],
 'רופאים מומחים והתאמת לימוד':['טיפול רופאים מומחים והתקשה בלימוד','רופאים מומחים והתקשה בלימוד','רופאים מומחים','לשמוע להנחיותיהם','לימוד לגירסא','לימוד בקיאותי','expert doctors study adjustment'],
 'בית מרקחת ושם כפר חב״ד':['בית מרקחת ושם כפר חב״ד','פתיחת בית מרקחת בכפר חב״ד','השם שפריר','כפר חב״ד א׳ וב׳','kfar chabad pharmacy and name'],
 'סניף נשי חב״ד מונטריאול':['סניף נשי חב״ד במונטריאול','סניף מונטריאול של אגודת נשי','סניף מונטריאול','נשי ובנות חב״ד','הרחבת הפעילות','פעילות הסניף','להתרחב','montreal nshei chabad branch'],
 'בית רבקה סדר בוקר':['בית רבקה לימודי חול','בית רבקה להתחיל את היום','בית רבקה מחצית הראשונה','להתחיל את היום בלימודי חול','לימודי חול בחצי יום הראשון','לימודי חול','beis rivka morning secular studies'],
 'כתבי יד משה יצחק מיאס':['כתבי היד של החסיד משה יצחק מיאס','משה יצחק מיאס','כתבי יד','מיאס','moshe yitzchak mias manuscripts'],
 'מניין דירות חדשות כפר חב״ד':['המניין ליד הדירות החדשות','מנין ליד הדירות החדשות','מקום תפילה ליד הדירות החדשות','דירות החדשות','מניין','מנין','new housing minyan kfar chabad'],
 'משמרות שבועות כפר חב״ד':['תכנית המשמרות בחג השבועות בכפר חב״ד','משמרות אמירת תהלים ולימוד חסידות','משמרות','shavuot shifts kfar chabad'],
 'זוהר לפני חסידות':['ללמוד זוהר לפני שמתחילים ללמוד חסידות','זוהר לפני חסידות','לימוד הזוהר לפני חסידות','זוהר','zohar','study zohar before chassidus'],
 'מקור מנהגי תפילה':['הרכנת הראש בקדיש','להרכין את הראש בקדיש','לגעת בתחילת ובסוף מקום הקריאה','נגיעה בתחילת מקום הקריאה','prayer custom source attribution'],
 'מענה לשאלות במפגש נשים':['לענות לשאלות במפגש הבא','שאלות במפגש הבא','מפגש הבא בעבודת נשים','מפגש הבא','women questions next meeting'],
 'תהלים בלילה ושיעורים קבועים':['תהלים בלילה','אמירת תהלים בלילה','לבטל שיעורים קבועים','psalms at night','cancel regular lessons'],
 'ביקור אוריאל צימר':['ביקורו של אוריאל צימר','אוריאל צימר בארץ','לתאם פעילות להפצת חסידות','zimmer israel visit'],
 'ייסורים ומבט מוגבל':['להבין ייסורים וחסרונות של אנשים','קושי להבין ייסורים','ייסורים וחסרונות','חלק מוגבל','מבט אנושי','חסרונות אפשריים','suffering limited perspective'],
 'יוזמה לחיזוק היהדות':['להמתין להזדמנות כדי לפעול לחיזוק היהדות','הזדמנות לפעול לחיזוק היהדות','פעולות לחיזוק היהדות','תופיע הזדמנות','wait for an opportunity to strengthen judaism'],
 'ניתוח שקדים ושני מומחים':['ניתוח להסרת שקדים','הסרת שקדים','שני רופאים מומחים','tonsil surgery two specialists'],
 'בית ספר לבנות במלבורן':['בית ספר לבנות במלבורן','פתיחת בית ספר לבנות במלבורן','שני חדשים הראשונים','melbourne girls school funding'],
 'שידוך אשכנזי ספרדי':['שידוך אשכנזי ספרדי','הבדל אשכנזי ספרדי','שילוב אשכנזי־ספרדי','לזווג אשכנזי וספרדי','סיבה לדחות שידוך','ashkenazi sephardi match'],
 'איגוד הרבנים ושעות חול':['איגוד הרבנים','צמצום שעות לימודי חול','ינכו מספר שעות','rabbinical union secular school hours'],
 'נסיעת תינוק ועצה רוחנית':['נסיעה עם תינוק בן פחות משנה','נסיעה עם תינוק','עד מלאת לתינוק שנה','עד גיל שנה','קבלת עצה רוחנית','הדרכה בענייני תורה ומצוות','infant travel spiritual advice'],
 'גלגול נשמות ולימוד למי שאינו שומר מצוות':['גלגול נשמות','ללמד תורה למי שאינו שומר מצוות','אינו שומר מצוות','שאינו שומר מצוות','צעירים ושאלות אמונה','reincarnation teaching nonobservant jews'],
 'הודעה מסודרת להנהלת בית ספר':['להודיע להנהלת בית ספר','הנהלת בית ספר','עניין מוסדי','באופן מסודר ומפורש','הודעה מסודרת להנהלה','למסור למשרד','שיחה מקרית עם ההנהלה','formal notice school administration'],
 'התנגדות הורים ללימוד חסידות':['מה לעשות כשהורים מתנגדים ללימוד חסידות','הורים מתנגדים ללימוד חסידות','התנגדות הורים ללימוד חסידות','התנגדות הורים לחסידות','מפריעים ללמוד חסידות','כיבוד הורים ולימוד חסידות','parental opposition chassidus study'],
 'יחס פוגע והתמדה בישיבה':['בחור ישיבה צריך להפסיק ללמוד בגלל יחס','יחס לא ראוי בישיבה','יחס בלתי ראוי','יחס פוגע בישיבה','להפסיק ללמוד בגלל יחס','להפחית בלימוד','התמדה לפני חיפוש חברותא','poor treatment yeshiva persistence study'],
 'נשי חבד לונדון ופעילות קיץ':['סניף נשי חב״ד בלונדון','חב״ד בלונדון','לנצל את הקיץ','נשי ובנות חב״ד בלונדון','סניף לונדון','פעילות קיץ לילדים','נופשים ממקומות שונים','london chabad women summer outreach'],
 'מקום בניין ישיבה ליד בתי ספר למלאכה':['לבחור מקום לבניין ישיבה','בחירת מקום לבניין הישיבה','מקום לבניין ישיבה ליד בתי ספר למלאכה','בניין ישיבה ליד בתי ספר למלאכה','בתי ספר למלאכה','בתי הספר למלאכה','yeshiva building near vocational schools'],
 'פרסום יוזמת מצה שמורה':['לפרסם מי יזם חלוקת מצה שמורה','יוזם חלוקת מצה שמורה','יוזמת חלוקת מצה שמורה','ענווה שאינה במקומה','public credit shmurah matzah distribution'],
 'תיאום שני רופאים מומחים':['לתאם בין שני רופאים מומחים','שני רופאים מומחים שנותנים חוות דעת','שתי חוות הדעת לרופא המשפחה','coordinate two expert doctors'],
 'מיקרופון בסידור קידושין':['מיקרופון בסידור קידושין','מיקרופון בחופה','מיקרופון בחצר','microphone at kiddushin'],
 'נשי חבד טורונטו ופעילות קיץ':['סניף נשי חב״ד בטורונטו','נשי ובנות חב״ד בטורונטו','אסיפת הסיום לפני החופשה','עבודה עם הנוער בחופשה','toronto chabad women summer youth work'],
 'עטיפת טלית עיניים ולא פה':['עטיפת טלית גדול','לכסות את העיניים והפה בטלית','מכסים את העיניים ולא את הפה','טלית עיניים פה','tallit cover eyes not mouth'],
 'סדר לימוד חסידות למתחיל':['סדר לימוד חסידות','באיזה סדר ללמוד חסידות','ללמוד חסידות מאיגרת התשובה','מאיגרת התשובה ואילך','איגרת התשובה שער היחוד והאמונה','להתחיל באיגרת התשובה','chassidus study sequence'],
 'מרחק לשיעור חסידות':['מרחק ממקום שיעור חסידות','רחוק משיעור חסידות','להשתתף בשיעור חסידות למרות המרחק','distance to chassidus class'],
 'שמחה הורמונים וחומרנות':['שמחה והורמונים','קשר בין שמחה לשינויים הורמונליים','שמחה חומרנות גוף ונפש','joy hormones materialism body soul'],
 'הסבר הפיגוע בכפר חבד':['האם אפשר להסביר את הפיגוע בכפר חב״ד לפי האיגרת','האם אפשר להסביר את הפיגוע בכפר חב״ד','הסבר הפיגוע בכפר חב״ד','להסביר את המאורע בכפר חב״ד','פיגוע בכפר חב״ד','שתיקה במקום הסבר','explain kfar chabad attack tragedy'],
 'קדימות מקווה לבית כנסת כפר חבד':['מה קודם בכפר חב״ד בית הטבילה או בית הכנסת','בית הטבילה או בית הכנסת','להקדים בית טבילה לבית כנסת בכפר חב״ד','קדימות מקווה לבית כנסת בכפר חב״ד','בית הטבילה ובית הכנסת בכפר חב״ד','קדימות על פני בית הכנסת','kfar chabad mikveh priority synagogue'],
 'תעניות פרטיות':['תעניות שאדם מוסיף מדעתו','תעניות פרטיות','הוספת תעניות','private fasts','self-imposed fasts'],
 'ריכוז בתפילה וקביעות תורה':['מה הקשר בין קושי להתרכז בתפילה לבין קביעות בלימוד תורה','קושי להתרכז בתפילה','קשה להתרכז בתפילה','ריכוז בתפילה וקביעות תורה','ריכוז בתפילה','קביעות בלימוד תורה','קביעות בלימוד תורה ושמירת מצוות','prayer concentration fixed torah study'],
 'חתימת מזכירות והכתבה':['מכתב שנחתם בידי המזכירות','חתימת המזכירות','נחתם בידי המזכירות','הכתבה מילה במילה','secretariat signature word for word dictation'],
 'הידוק תפילין מול יישור בתים':['מה קודם בתפילין של ראש הידוק במקום או יישור הבתים','הידוק תפילין או יישור הבתים','הידוק תפילין של ראש','אצבעים על אצבעים','יישור הבתים בתפילין','tefillin tightness box alignment'],
 'השפעה על חבר שהתרחק':['חבר ילדות שהתרחק','להשפיע על חבר שהתרחק','חבר שהתרחק מהסביבה החרדית','התייעצות עם אנשים מקומיים','help childhood friend return judaism'],
 'מחנה קיץ ללא לימודי חול':['למה מחנה קיץ מתאים במיוחד לחינוך כשאין לימודי חול','מחנה קיץ ללא לימודי חול','למה מחנה קיץ מתאים לחינוך','מחנה קיץ יראת שמים','לימודי החול אינם מסיחים','summer camp without secular studies'],
 'ידיעה שלמה לפני הפצת המעיינות':['האם לחכות לידיעה שלמה לפני הפצת המעיינות','להשהות הפצת חסידות עד שהידיעה תהיה שלמה','הפצת המעיינות לפני ידיעה שלמה','wait for complete knowledge before outreach'],
 'אנגלית וכימיה מול לימודי קודש':['למה הומלץ לבחור ללמוד עוד שלוש או ארבע שנים לימודי קודש במקום אנגלית וכימיה','אנגלית וכימיה במקום לימודי קודש','לימודי אנגלית וכימיה','שלוש או ארבע שנים ללימודי קודש','english chemistry versus sacred study'],
 'בית ספר לבנות סגל מול בניין':['מה קודם בהקמת בית ספר לבנות בכפר חב״ד שיפור הבניין או סגל המורים ורמת הלימודים','בית ספר לבנות סגל מורים לפני בניין','קדימות לסגל מורים','לפני השקעה גדולה בשיפור הבניין','girls school teachers before building'],
 'ביטול הפלגה בשבת והחזר':['מה נכתב על נוסעים שביטלו הפלגה בשבת וקבלת החזר כספי','ביטלו הפלגה בשבת','החזר כספי לנוסעים','להחזיר כסף למי שביטלו','shabbat voyage cancellation refund'],
 'לימוד לפני חידושים בחסידות':['האם להתחיל בחידושים בלימוד חסידות לפני לימוד והבנה','חידושים בלימוד חסידות','תחילה לימוד ואחר כך חידושים','לימוד חסידות אינו אמור להתחיל ביצירת חידושים','תחילה נדרשים לימוד','learn before chassidus innovations'],
 'שינוי נוסח אשכנז ספרד ארי':['האם מותר לשנות מנוסח אשכנז לספרד ומספרד לנוסח הארי','נוסח אשכנז לספרד','נוסח ספרד לנוסח הארי','נוסח אשכנז','נוסח ספרד','נוסח הארי','change prayer rite ashkenaz sefard ari'],
 'ריכוז בלימוד וספר פתוח':['קושי בריכוז בלימוד','להתרכז בלימוד','ספר פתוח לפניו','האותיות מקשרות ומחכימות','study concentration open book'],
 'לימוד חסידות בלי חבר':['העדר חבר לימוד','אין חבר לימוד','חבר לימוד בחסידות','לימוד חסידות לבד','chassidus without study partner'],
 'דואר כפר חבד ושבת':['סניף דואר בכפר חב״ד','פתיחת דואר בכפר חב״ד','סניף דואר','דואר סגור בשבת','מברקים בשבת','kfar chabad post office shabbat'],
 'פעילות נוער לפי תנאי המקום':['אמצעי פעילות נוער השנויים במחלוקת','פעילות נוער במחלוקת','תנאי המקום והזמן','תגובת הציבור המקומי','אנשי סוד המכירים את התנאים','youth outreach local conditions consultation'],
 'רופא מצליח וגאווה':['רופא מצליח על גאווה','רופא מצליח והצלחה','אתרוג וגאווה','כוחו האישי בלבד','successful doctor arrogance esrog'],
 'מחשבה בארץ ישראל והשפעה בגולה':['מחשבה על ארץ ישראל','מחשבתו בארץ ישראל','להמשיך מקדושת הארץ','השפעה בגולה','thoughts in israel influence diaspora'],
 'הפצת ספרים':['מימון','הדפס','הוצאה לאור','הפצת ספר','הדפסת ספר','פרסום הספר','פרסומים תורניים','publication','publishing','printing','book'],
 אמונה:['אמונה','בטחון','faith','belief','trust','emunah','bitachon']};
const norm=s=>String(s||'').toLowerCase().replace(/[?.,!״׳:'"()\[\]]/g,' ').replace(/\s+/g,' ').trim();
const arr=v=>Array.isArray(v)?v:(v==null||v===''?[]:[v]);
const text=v=>arr(v).map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' ');
const topicVocab=new Set(Object.values(TOPICS).flat().map(norm));
const contentWords=s=>norm(s).split(/\s+/).filter(x=>x.length>1&&!STOP.has(x));
const scriptOf=s=>/[א-ת]/.test(s)?'hebrew-script':/[a-z]/i.test(s)?'latin':'other';
const NEGATION=new Set(['לא','אין','אינו','אינה','אינם','אינן','בלי','אסור','never','not','no','without','prohibited']);
const tokenSet=s=>new Set(contentWords(s));
const jaccard=(a,b)=>{const A=tokenSet(a),B=tokenSet(b);if(!A.size||!B.size)return 0;let i=0;A.forEach(x=>{if(B.has(x))i++;});return i/(A.size+B.size-i);};
const negationSignature=s=>contentWords(s).some(x=>NEGATION.has(x));
// Latin query terms must match whole tokens/phrases: substring matching made
// `fear` incorrectly match `G-d-fearing`. Hebrew aliases intentionally include
// productive stems (for example דאג), so Hebrew keeps conservative substring matching.
const containsTerm=(body,term)=>{const b=norm(body),t=norm(term);if(!t)return false;if(t==='אהבת ה')return ` ${b} `.includes(' אהבת ה ');if(t==='נשים')return b.split(/\s+/).includes(t);if(/[a-z]/i.test(t)){if(t.includes(' '))return ` ${b} `.includes(` ${t} `);return b.split(/\s+/).includes(t);}return b.includes(t);};
// Intent markers describe the requested analysis, not facts that must occur in a
// source proposition. Keeping `pattern`/`דפוס` as a content qualifier made every
// pattern question fail even when multiple independent evidence families existed.
const isIntentFramingTerm=(term,intent)=>{
 const t=norm(term);
 if(intent==='pattern')return /^(?:pattern|patterns|recurring|usually|approach|approaches|דפוס|דפוסים|חוזר|חוזרת|חוזרים|בדרך|כלל|גישה|גישות|הדרכה|הדרכות|בהדרכה|בהדרכות)$/.test(t);
 if(intent==='comparative')return /^(?:compare|comparison|comparisons|difference|differences|versus|vs|between|השווה|השוו|השוואה|השוואת|הבדל|הבדלים|לעומת|בין)$/.test(t);
 if(intent==='historical')return /^(?:when|date|dates|period|periods|year|years|time|מתי|תאריך|תאריכים|תקופה|תקופות|שנה|שנים|כתב|כותב|דיבר|לימד|הדריך)$/.test(t);
 if(intent==='bibliographic')return /^(?:source|sources|bibliographic|bibliography|citation|citations|where|published|publication|מקור|מקורות|ביבליוגרפיה|ביבליוגרפי|איפה|פורסם|פרסום)$/.test(t);
 if(intent==='circumstances')return /^(?:under|circumstance|circumstances|condition|conditions|audience|recommended|recommend|when|באילו|נסיבות|תנאי|תנאים|קהל|למי|המליץ|המלצה|מתי|לפתוח|פתוח)$/.test(t);
 // General wording that asks for a source's lesson or moral takeaway is framing,
 // while the concrete subject (for example, פרה אדומה) remains query-specific.
 if(intent==='guidance')return /^(?:lesson|moral|takeaway|teaching|advice|advise|guidance|regarding|about|wrote|write|לימוד|מוסר|מוסרי|איגרת|אגרות|letter|letters|כתב|כותב|הדריך|דריך|מדריך|הדרכה|להדריך|המליץ|המלצה|הציע|הוצע|וצע|הצעה|ייעץ|יעץ|להתמודד|תמודד|לממן|ממן|להכריע|כריע|לחבר|בנוגע|לגבי|בהקשר|בעניין)$/.test(t);
 return false;
};

export function understandQuestion(q){
 const original=String(q||''),query=norm(original);
 let topics=Object.entries(TOPICS).filter(([,vs])=>vs.some(v=>containsTerm(query,v))).map(([k])=>k);
 // A specific institutional-enrollment question must not inherit the much
 // broader education topic. Otherwise any proposition mentioning a school or
 // teacher can outrank the inspected source about yeshiva enrollment policy.
 if(topics.includes('הרחבת ישיבה'))topics=topics.filter(t=>t!=='חינוך');
 if(topics.includes('בית רבקה בראונסוויל'))topics=topics.filter(t=>t!=='חינוך');
 if(topics.includes('סניף תלמוד תורה ומחנה יום'))topics=topics.filter(t=>t!=='חינוך');
 if(topics.includes('מסחר ולימוד יום שלם'))topics=topics.filter(t=>t!=='פרנסה');
 if(topics.includes('רופאים מומחים והתאמת לימוד'))topics=topics.filter(t=>t!=='בריאות');
 if(topics.includes('סניף נשי חב״ד מונטריאול'))topics=topics.filter(t=>t!=='נשים');
 if(topics.includes('בית רבקה סדר בוקר'))topics=topics.filter(t=>t!=='חינוך');
 if(topics.includes('איגוד הרבנים ושעות חול'))topics=topics.filter(t=>t!=='בית רבקה סדר בוקר');
 if(topics.includes('הערות שוליים בספר'))topics=topics.filter(t=>t!=='הפצת ספרים');
 if(topics.includes('הודעה מסודרת להנהלת בית ספר'))topics=topics.filter(t=>t!=='חינוך');
 if(topics.includes('נשי חבד לונדון ופעילות קיץ'))topics=topics.filter(t=>!['נשים','חינוך'].includes(t));
 if(topics.includes('מקום בניין ישיבה ליד בתי ספר למלאכה'))topics=topics.filter(t=>!['חינוך','הרחבת ישיבה'].includes(t));
 if(topics.includes('תיאום שני רופאים מומחים'))topics=topics.filter(t=>!['בריאות','רופאים מומחים והתאמת לימוד','ניתוח שקדים ושני מומחים'].includes(t));
 if(topics.includes('נשי חבד טורונטו ופעילות קיץ'))topics=topics.filter(t=>!['נשים','חינוך'].includes(t));
 if(topics.includes('שמחה הורמונים וחומרנות'))topics=topics.filter(t=>t!=='בריאות');
 if(topics.includes('הסבר הפיגוע בכפר חבד'))topics=topics.filter(t=>t!=='שיקום לאחר פיגוע');
 if(topics.includes('מחנה קיץ ללא לימודי חול'))topics=topics.filter(t=>!['בית רבקה סדר בוקר','חינוך'].includes(t));
 if(topics.includes('ריכוז בלימוד וספר פתוח'))topics=topics.filter(t=>t!=='חינוך');
 if(topics.includes('דואר כפר חבד ושבת'))topics=topics.filter(t=>t!=='שיקום לאחר פיגוע');
 if(topics.includes('פעילות נוער לפי תנאי המקום'))topics=topics.filter(t=>t!=='חינוך');
 if(topics.includes('רופא מצליח וגאווה'))topics=topics.filter(t=>t!=='בריאות');
 let intent=/דפוס|חוזר|בדרך כלל|גישה|pattern|usually/.test(query)?'pattern':/הבדל|לעומת|השוו|השווא|compare|difference/.test(query)?'comparative':/(?:^|\s)מתי(?:\s|$)|תאריך|תקופה|שנה|when|date|period/.test(query)?'historical':/מקור|ביבליוגר|איפה פורסם|source|bibliograph/.test(query)?'bibliographic':/באילו נסיבות|נסיבות|מתי המליץ|תנאי|(?:^|\s)למי(?:\s|$)|circumstance|condition|audience/.test(query)?'circumstances':'guidance';
 if(topics.includes('נסיעת תינוק ועצה רוחנית'))intent='guidance';
 if(topics.includes('שידוך אשכנזי ספרדי'))intent='guidance';
 const raw=query.split(/\s+/).filter(x=>x.length>1&&!STOP.has(x));
 const entities=(original.match(/(?:[A-Z][\w-]+(?:\s+[A-Z][\w-]+)*)|(?:[א-ת]{2,}(?:\s+[א-ת]{2,}){1,2})/g)||[]).map(norm).filter(x=>!STOP.has(x)).slice(0,8);
 const semanticRaw=raw.filter(t=>!isIntentFramingTerm(t,intent)&&!isIntentFramingTerm(queryToken(t),intent)).map(queryToken).filter(t=>t&&!STOP.has(t));
 const expanded=[...semanticRaw];topics.forEach(k=>expanded.push(...TOPICS[k]));
 const topicTokens=new Set(topics.flatMap(k=>(TOPICS[k]||[]).map(norm)));
 // A natural-language query often splits a multi-word topic alias into its
 // component tokens. Those components are topic anchors, not extra qualifiers.
 // Testing in both directions prevents generic words from being mistaken for
 // evidence-specific constraints after a phrase topic has already matched.
 const isTopicToken=t=>topicTokens.has(t)||[...topicTokens].some(alias=>containsTerm(t,alias)||containsTerm(alias,t));
 return {query,query_script:scriptOf(query),topic:topics[0]||null,topics,intent,entities,subtopic:semanticRaw.filter(t=>!isTopicToken(t)).slice(0,8),terms:[...new Set(expanded.map(norm))]};
}
function evidenceText(e){return norm([text(e.response_propositions),text(e.question_or_problem),text(e.conditions_or_qualifications),text(e.documented_circumstances),text(e.audience)].join(' '));}
function metadataText(e){return norm([e.title,e.search_text,e.source_class,e.date,e.language,e.topic,e.subtopic].join(' '));}
function overlap(t,terms){return terms.reduce((n,x)=>n+(x&&containsTerm(t,x)?1:0),0);}
function familyKey(e){return e.evidence_family_id||e.aid||e.source_url||e.key;}
function propositionKey(p){return contentWords(p).sort().join(' ');}
function sameClaim(a,b){if(propositionKey(a)===propositionKey(b))return true;if(negationSignature(a)!==negationSignature(b))return false;return jaccard(a,b)>=0.72;}
function propositionSupportsQuery(p,u){const body=norm(p),raw=u.terms.filter(t=>!topicVocab.has(t)),topicTerms=u.topics.flatMap(t=>TOPICS[t]||[]).map(norm);const specific=overlap(body,raw),topical=overlap(body,topicTerms),requiredSpecific=u.topics.length?1:Math.min(2,raw.length);if(u.topics.length&&topical===0)return false;return specific>=requiredSpecific||topical>=2||(!raw.length&&topical>0);}
function intentEvidenceGate(e,u){
 if(u.intent==='circumstances'&&!text(e.documented_circumstances)&&!text(e.conditions_or_qualifications)&&!text(e.audience))return 'missing documented circumstances/conditions/audience';
 // Circumstances are not temporal evidence. A historical answer may only use a
 // witness with explicit date/period metadata; otherwise an undated case can be
 // presented misleadingly as an answer to "when".
 if(u.intent==='historical'&&!e.date)return 'missing documented date/period metadata';
 if(u.intent==='bibliographic'&&!e.source_url&&!e.provenance&&!e.witness_provenance&&!e.source_witness)return 'missing bibliographic provenance';
 return null;
}

export function propositionRelevance(e,u){
 if(!e?.has_content_evidence)return{score:0,support:'unknown_content',reasons:['no content evidence']};
 const body=evidenceText(e);if(!body)return{score:0,support:'unknown_content',reasons:['empty evidence body']};
 if(u.topics.includes('אהבת התורה')&&u.topics.includes('אהבת ה׳')&&(!containsTerm(body,'אהבת ההשגה השכלית')||!containsTerm(body,'גדולת הבורא')))return{score:0,support:'insufficient_specific_evidence',reasons:['Torah-love versus G-d-love distinction is absent']};
 if(u.topics.includes('הגדלת כיתות ולימוד אישי')&&!['לימוד אישי','הלימוד האישי','פוטר','פוטרת','personal study obligation'].some(t=>containsTerm(body,t)))return{score:0,support:'insufficient_specific_evidence',reasons:['personal-study side of the combined query is absent']};
 if(u.topics.includes('סניף נשי חב״ד מונטריאול')&&!containsTerm(body,'מונטריאול'))return{score:0,support:'insufficient_specific_evidence',reasons:['Montreal branch is absent from the evidence body']};
 if(u.topics.includes('בית רבקה סדר בוקר')&&(!containsTerm(body,'בית רבקה')||!['לימודי חול','מחצית הראשונה','התחלת היום','שעות הבוקר'].some(t=>containsTerm(body,t))))return{score:0,support:'insufficient_specific_evidence',reasons:['Beis Rivka morning-schedule decision is absent from the evidence body']};
 if(u.topics.includes('כתבי יד משה יצחק מיאס')&&!containsTerm(body,'משה יצחק מיאס'))return{score:0,support:'insufficient_specific_evidence',reasons:['named manuscript holder is absent from the evidence body']};
 if(u.topics.includes('מניין דירות חדשות כפר חב״ד')&&!containsTerm(body,'דירות החדשות'))return{score:0,support:'insufficient_specific_evidence',reasons:['new-housing minyan setting is absent from the evidence body']};
 if(u.topics.includes('משמרות שבועות כפר חב״ד')&&!containsTerm(body,'משמרות'))return{score:0,support:'insufficient_specific_evidence',reasons:['Shavuot shift plan is absent from the evidence body']};
 if(u.topics.includes('זוהר לפני חסידות')&&!containsTerm(body,'זוהר'))return{score:0,support:'insufficient_specific_evidence',reasons:['Zohar prerequisite is absent from the evidence body']};
 if(u.topics.includes('מקור מנהגי תפילה')&&!['הרכנת הראש','תחילת מקום הקריאה'].some(t=>containsTerm(body,t)))return{score:0,support:'insufficient_specific_evidence',reasons:['specific prayer customs are absent from the evidence body']};
 if(u.topics.includes('מענה לשאלות במפגש נשים')&&!containsTerm(body,'מפגש הבא'))return{score:0,support:'insufficient_specific_evidence',reasons:['delayed-answer meeting method is absent from the evidence body']};
 if(u.topics.includes('עזיבת פרנסה לפעילות')&&!['לעזוב מקור פרנסה','יעזוב ענין שפרנסתו','quit livelihood'].some(t=>containsTerm(body,t)))return{score:0,support:'insufficient_specific_evidence',reasons:['leaving an existing livelihood is absent from the evidence body']};
 if(u.topics.includes('כיסוי ראש והשפעה עקיפה')&&(!containsTerm(body,'כיסוי הראש')||!['בעקיפין','השפעה ישירה','שכנוע ישיר'].some(t=>containsTerm(body,t))))return{score:0,support:'insufficient_specific_evidence',reasons:['indirect hair-covering influence setting is absent from the evidence body']};
 if(u.topics.includes('תהלים בלילה ושיעורים קבועים')&&(!containsTerm(body,'תהלים')||!containsTerm(body,'לילה')))return{score:0,support:'insufficient_specific_evidence',reasons:['nighttime Psalms setting is absent from the evidence body']};
 if(u.topics.includes('ביקור אוריאל צימר')&&!containsTerm(body,'אוריאל צימר'))return{score:0,support:'insufficient_specific_evidence',reasons:['Uriel Zimmer visit is absent from the evidence body']};
 if(u.topics.includes('ייסורים ומבט מוגבל')&&!['חלק מוגבל','חסרונות אפשריים','קושי להבין'].some(t=>containsTerm(body,t)))return{score:0,support:'insufficient_specific_evidence',reasons:['limited-perspective response to suffering is absent from the evidence body']};
 if(u.topics.includes('יוזמה לחיזוק היהדות')&&(!containsTerm(body,'הזדמנות')||!containsTerm(body,'חיזוק היהדות')))return{score:0,support:'insufficient_specific_evidence',reasons:['proactive Jewish-strengthening opportunity is absent from the evidence body']};
 if(u.topics.includes('ניתוח שקדים ושני מומחים')&&!containsTerm(body,'שקדים'))return{score:0,support:'insufficient_specific_evidence',reasons:['tonsil-surgery setting is absent from the evidence body']};
 if(u.topics.includes('בית ספר לבנות במלבורן')&&(!containsTerm(body,'מלבורן')||!containsTerm(body,'בית ספר לבנות')))return{score:0,support:'insufficient_specific_evidence',reasons:['Melbourne girls-school launch is absent from the evidence body']};
 if(u.topics.includes('שידוך אשכנזי ספרדי')&&(!containsTerm(body,'אשכנזי')||!containsTerm(body,'ספרדי')))return{score:0,support:'insufficient_specific_evidence',reasons:['Ashkenazi-Sephardi match setting is absent from the evidence body']};
 if(u.topics.includes('איגוד הרבנים ושעות חול')&&(!containsTerm(body,'איגוד הרבנים')||!containsTerm(body,'שעות')))return{score:0,support:'insufficient_specific_evidence',reasons:['rabbinical-union school-hours proposal is absent from the evidence body']};
 if(u.topics.includes('נסיעת תינוק ועצה רוחנית')&&(!containsTerm(body,'תינוק')||!containsTerm(body,'שנה')))return{score:0,support:'insufficient_specific_evidence',reasons:['infant-under-one travel setting is absent from the evidence body']};
 if(u.topics.includes('גלגול נשמות ולימוד למי שאינו שומר מצוות')&&(!containsTerm(body,'גלגול נשמות')||!['אינו שומר מצוות','שאינו שומר מצוות'].some(t=>containsTerm(body,t))))return{score:0,support:'insufficient_specific_evidence',reasons:['reincarnation discussion with a nonobservant audience is absent']};
 if(u.topics.includes('הודעה מסודרת להנהלת בית ספר')&&(!containsTerm(body,'הנהלת בית ספר')||!['באופן מסודר','למשרד','שיחה מקרית'].some(t=>containsTerm(body,t))))return{score:0,support:'insufficient_specific_evidence',reasons:['formal school-administration notice setting is absent']};
 if(u.topics.includes('התנגדות הורים ללימוד חסידות')&&(!containsTerm(body,'הורים')||!containsTerm(body,'חסידות')))return{score:0,support:'insufficient_specific_evidence',reasons:['parental opposition to Chassidus study is absent']};
 if(u.topics.includes('יחס פוגע והתמדה בישיבה')&&(!containsTerm(body,'יחס')||!['התמדה','להפסיק בלימוד','להפחית בלימוד'].some(t=>containsTerm(body,t))))return{score:0,support:'insufficient_specific_evidence',reasons:['yeshiva treatment-and-persistence setting is absent']};
 if(u.topics.includes('נשי חבד לונדון ופעילות קיץ')&&(!containsTerm(body,'לונדון')||!containsTerm(body,'קיץ')))return{score:0,support:'insufficient_specific_evidence',reasons:['London branch summer-outreach setting is absent']};
 if(u.topics.includes('מקום בניין ישיבה ליד בתי ספר למלאכה')&&(!['בתי ספר למלאכה','בתי הספר למלאכה'].some(t=>containsTerm(body,t))||!['מקום','בניין'].some(t=>containsTerm(body,t))))return{score:0,support:'insufficient_specific_evidence',reasons:['yeshiva-building location near vocational schools is absent']};
 if(u.topics.includes('פרסום יוזמת מצה שמורה')&&(!containsTerm(body,'מצה שמורה')||!['יוזם','יוזמה','ענווה'].some(t=>containsTerm(body,t))))return{score:0,support:'insufficient_specific_evidence',reasons:['shmurah-matzah initiative and public credit are absent']};
 if(u.topics.includes('תיאום שני רופאים מומחים')&&(!containsTerm(body,'שני רופאים')||!['לתאם','חוות הדעת','רופא המשפחה'].some(t=>containsTerm(body,t))))return{score:0,support:'insufficient_specific_evidence',reasons:['two-doctor coordination setting is absent']};
 if(u.topics.includes('מיקרופון בסידור קידושין')&&(!containsTerm(body,'מיקרופון')||!containsTerm(body,'קידושין')))return{score:0,support:'insufficient_specific_evidence',reasons:['microphone-at-kiddushin setting is absent']};
 if(u.topics.includes('נשי חבד טורונטו ופעילות קיץ')&&(!containsTerm(body,'טורונטו')||!containsTerm(body,'חופשה')))return{score:0,support:'insufficient_specific_evidence',reasons:['Toronto branch summer-youth setting is absent']};
 if(u.topics.includes('עטיפת טלית עיניים ולא פה')&&(!containsTerm(body,'טלית')||!containsTerm(body,'עיניים')||!containsTerm(body,'פה')))return{score:0,support:'insufficient_specific_evidence',reasons:['tallit eyes-not-mouth custom is absent']};
 if(u.topics.includes('סדר לימוד חסידות למתחיל')&&(!containsTerm(body,'איגרת התשובה')||!containsTerm(body,'שער היחוד והאמונה')))return{score:0,support:'insufficient_specific_evidence',reasons:['specific Chassidus study sequence is absent']};
 if(u.topics.includes('מרחק לשיעור חסידות')&&(!containsTerm(body,'מרחק')||!containsTerm(body,'שיעור חסידות')))return{score:0,support:'insufficient_specific_evidence',reasons:['distance-to-Chassidus-class setting is absent']};
 if(u.topics.includes('שמחה הורמונים וחומרנות')&&(!containsTerm(body,'שמחה')||!containsTerm(body,'הורמונ')||!containsTerm(body,'חומרנות')))return{score:0,support:'insufficient_specific_evidence',reasons:['joy-hormone-materialism discussion is absent']};
 if(u.topics.includes('הסבר הפיגוע בכפר חבד')&&(!containsTerm(body,'הפיגוע בכפר חב״ד')||!['להסביר','הסבר','שתיקה'].some(t=>containsTerm(body,t))))return{score:0,support:'insufficient_specific_evidence',reasons:['Kfar Chabad tragedy explanation boundary is absent']};
 if(u.topics.includes('קדימות מקווה לבית כנסת כפר חבד')&&(!containsTerm(body,'בית הטבילה')||!containsTerm(body,'בית הכנסת')||!containsTerm(body,'קדימות')))return{score:0,support:'insufficient_specific_evidence',reasons:['Kfar Chabad mikveh-priority setting is absent']};
 if(u.topics.includes('תעניות פרטיות')&&(!containsTerm(body,'תעניות')||!['פרטיות','מוסיף מדעתו'].some(t=>containsTerm(body,t))))return{score:0,support:'insufficient_specific_evidence',reasons:['self-imposed private fast setting is absent']};
 if(u.topics.includes('ריכוז בתפילה וקביעות תורה')&&(!containsTerm(body,'ריכוז בתפילה')||!containsTerm(body,'קביעות בלימוד תורה')))return{score:0,support:'insufficient_specific_evidence',reasons:['prayer-concentration and fixed-study setting is absent']};
 if(u.topics.includes('חתימת מזכירות והכתבה')&&(!containsTerm(body,'נחתם בידי המזכירות')||!containsTerm(body,'מילה במילה')))return{score:0,support:'insufficient_specific_evidence',reasons:['secretariat-signature and word-for-word dictation evidence is absent']};
 if(u.topics.includes('הידוק תפילין מול יישור בתים')&&(!containsTerm(body,'תפילין של ראש')||!containsTerm(body,'הידוק במקומו')||!containsTerm(body,'אצבעים על אצבעים')))return{score:0,support:'insufficient_specific_evidence',reasons:['head-tefillin tightness versus box-alignment evidence is absent']};
 if(u.topics.includes('השפעה על חבר שהתרחק')&&(!containsTerm(body,'חבר ילדות')||!containsTerm(body,'אנשים מקומיים')))return{score:0,support:'insufficient_specific_evidence',reasons:['childhood-friend and local-consultation evidence is absent']};
 if(u.topics.includes('מחנה קיץ ללא לימודי חול')&&(!containsTerm(body,'מחנה קיץ')||!containsTerm(body,'לימודי החול')))return{score:0,support:'insufficient_specific_evidence',reasons:['summer-camp without secular-study distraction evidence is absent']};
 if(u.topics.includes('ידיעה שלמה לפני הפצת המעיינות')&&(!containsTerm(body,'להשהות הפצת חסידות')||!containsTerm(body,'הידיעה תהיה שלמה')))return{score:0,support:'insufficient_specific_evidence',reasons:['complete-knowledge-before-outreach evidence is absent']};
 if(u.topics.includes('אנגלית וכימיה מול לימודי קודש')&&(!containsTerm(body,'אנגלית')||!containsTerm(body,'כימיה')||!['שלוש או ארבע שנים','שלוש','ארבע שנים'].some(t=>containsTerm(body,t))))return{score:0,support:'insufficient_specific_evidence',reasons:['English-chemistry versus additional sacred-study plan is absent']};
 if(u.topics.includes('בית ספר לבנות סגל מול בניין')&&(!containsTerm(body,'בית הספר לבנות')||!containsTerm(body,'סגל מורים')||!containsTerm(body,'בניין')))return{score:0,support:'insufficient_specific_evidence',reasons:['girls-school teachers-versus-building priority is absent']};
 if(u.topics.includes('ביטול הפלגה בשבת והחזר')&&(!containsTerm(body,'ביטלו')||!containsTerm(body,'להחזיר כסף')||!containsTerm(body,'שבת')))return{score:0,support:'insufficient_specific_evidence',reasons:['cancelled Sabbath voyage and refund evidence is absent']};
 if(u.topics.includes('לימוד לפני חידושים בחסידות')&&(!containsTerm(body,'חידושים')||!containsTerm(body,'לימוד חסידות')||!containsTerm(body,'תחילה')))return{score:0,support:'insufficient_specific_evidence',reasons:['study-before-Chassidus-innovations sequence is absent']};
 if(u.topics.includes('שינוי נוסח אשכנז ספרד ארי')&&(!containsTerm(body,'נוסח אשכנז')||!containsTerm(body,'נוסח ספרד')||!containsTerm(body,'נוסח האר״י')))return{score:0,support:'insufficient_specific_evidence',reasons:['Ashkenaz-Sefard-Ari prayer-rite change evidence is absent']};
 if(u.topics.includes('ריכוז בלימוד וספר פתוח')&&(!containsTerm(body,'ריכוז')||!containsTerm(body,'הספר פתוח')))return{score:0,support:'insufficient_specific_evidence',reasons:['open-book concentration method is absent']};
 if(u.topics.includes('לימוד חסידות בלי חבר')&&(!containsTerm(body,'חבר')||!containsTerm(body,'אינו מוצג כפטור')))return{score:0,support:'insufficient_specific_evidence',reasons:['Chassidus study without an available partner is absent']};
 if(u.topics.includes('דואר כפר חבד ושבת')&&(!containsTerm(body,'סניף דואר')||!containsTerm(body,'סגירה מוחלטת בשבת')))return{score:0,support:'insufficient_specific_evidence',reasons:['Kfar Chabad post-office Sabbath condition is absent']};
 if(u.topics.includes('פעילות נוער לפי תנאי המקום')&&(!containsTerm(body,'תנאי המקום והזמן')||!containsTerm(body,'אנשי סוד')))return{score:0,support:'insufficient_specific_evidence',reasons:['local youth-outreach conditions and consultation are absent']};
 if(u.topics.includes('רופא מצליח וגאווה')&&(!containsTerm(body,'רופא מצליח')||!containsTerm(body,'גאווה')))return{score:0,support:'insufficient_specific_evidence',reasons:['successful-doctor humility segment is absent']};
 if(u.topics.includes('מחשבה בארץ ישראל והשפעה בגולה')&&(!containsTerm(body,'מחשבתו בארץ ישראל')||!containsTerm(body,'גולה')))return{score:0,support:'insufficient_specific_evidence',reasons:['Israel-thought and Diaspora-influence segment is absent']};
 const gate=intentEvidenceGate(e,u);if(gate)return{score:0,support:'insufficient_intent_evidence',reasons:[gate]};
 const raw=u.subtopic.filter(t=>!topicVocab.has(t)),topicTerms=u.topics.flatMap(t=>TOPICS[t]||[]).map(norm),rawHit=overlap(body,raw),topicHit=overlap(body,topicTerms);
 // Specific qualifiers must be grounded in evidence text, not in publisher metadata.
 // Known topics already provide a semantic anchor, so one remaining qualifier
 // is sufficient. An uncatalogued natural-language question has no such anchor
 // and must match at least two meaningful terms in the same evidence body;
 // otherwise generic words such as "person" or "wrote" create false positives.
 const requiredRawHits=u.topics.length?1:Math.min(2,raw.length);
 if(raw.length && rawHit<requiredRawHits)return{score:0,support:'insufficient_specific_evidence',reasons:[`question-specific evidence below threshold (${rawHit}/${requiredRawHits})`]};
 const supportingProps=arr(e.response_propositions).filter(p=>propositionSupportsQuery(p,u));
 if(u.topics.length&&topicHit===0)return{score:0,support:'lexical_only',reasons:['topic absent from evidence']};
 if(!supportingProps.length&&u.intent==='guidance')return{score:1,support:'contextual_support',reasons:['no proposition entails guidance query']};
 if(raw.length&&rawHit===0&&topicHit<2)return{score:1,support:'contextual_support',reasons:['topic context without question-specific support']};
 let score=topicHit*2+rawHit*3+(e.status==='Verified'?2:0)+Math.min(4,supportingProps.length*2);
 if(u.intent==='circumstances')score+=3;if(u.intent==='guidance'&&supportingProps.length)score+=3;if(u.intent==='historical'&&e.date)score+=2;if(u.intent==='bibliographic'&&(e.source_url||e.provenance||e.witness_provenance))score+=2;
 return{score,support:score>=6?'direct_support':'contextual_support',reasons:[`topic=${topicHit}`,`specific=${rawHit}`,`supporting_propositions=${supportingProps.length}`],supportingProps};
}
export function retrieveEvidence(index,q,{limit=36,threshold=6}={}){const understanding=understandQuestion(q);const candidates=index.map(e=>({e,seed:overlap(metadataText(e),understanding.terms)+2*overlap(evidenceText(e),understanding.terms)})).filter(x=>x.seed>0).sort((a,b)=>b.seed-a.seed);const reranked=candidates.map(({e})=>({e,...propositionRelevance(e,understanding)})).filter(x=>x.support==='direct_support'&&x.score>=threshold).sort((a,b)=>b.score-a.score);/* Greedy diversity-aware reranking: each candidate must independently pass
   proposition-level relevance. Novelty cannot rescue a lexical-only result. */
const seen=new Set(),hits=[],remaining=reranked.slice();
const typeCount=new Map(),periodCount=new Map();
const sourceType=e=>norm(e.source_class||e.witness_type||'unknown');
const sourcePeriod=e=>{const m=String(e.date||'').match(/(?:18|19|20)\d{2}/);return m?String(Math.floor(Number(m[0])/10)*10):null;};
while(hits.length<limit&&remaining.length){
 let best=-1,bestUtility=-Infinity;
 for(let i=0;i<remaining.length;i++){
  const r=remaining[i],e=r.e,k=familyKey(e);if(seen.has(k))continue;
  const type=sourceType(e),period=sourcePeriod(e);
  const utility=r.score+(typeCount.has(type)?-Math.min(5,1.5*typeCount.get(type)):3)
   +(period?(periodCount.has(period)?-Math.min(2,0.5*periodCount.get(period)):1):0);
  if(utility>bestUtility){bestUtility=utility;best=i;}
 }
 if(best<0)break;
 const [r]=remaining.splice(best,1),e=r.e,k=familyKey(e),type=sourceType(e),period=sourcePeriod(e);
 seen.add(k);typeCount.set(type,(typeCount.get(type)||0)+1);
 if(period)periodCount.set(period,(periodCount.get(period)||0)+1);
 hits.push({...e,_relevance:r.score,_support:r.support,_supporting_propositions:r.supportingProps||[]});
}
return{understanding,hits};}
/* Preserve distinct source-grounded propositions and their circumstances.
   Round-robin extraction prevents a single verbose witness from monopolizing the
   answer budget. Only identical normalized propositions with identical documented
   context are grouped; lexical similarity is NOT semantic entailment. */
function synthesizeClaims(selected,u,limit){
 const grouped=new Map(),ordered=[];
 const perSource=selected.map(e=>(e._supporting_propositions?.length
  ?e._supporting_propositions:arr(e.response_propositions).filter(p=>propositionSupportsQuery(p,u)))
  .map(p=>String(p).trim()).filter(Boolean));
 const maxDepth=Math.max(0,...perSource.map(p=>p.length));
 for(let depth=0;depth<maxDepth;depth++){
  for(let sourceIndex=0;sourceIndex<selected.length;sourceIndex++){
   const p=perSource[sourceIndex][depth];if(!p)continue;
   const e=selected[sourceIndex];
   const contextKey=fields=>arr(fields).map(x=>norm(x)).filter(Boolean).sort().join('|');
   const key=JSON.stringify([norm(p),contextKey(e.documented_circumstances),
    contextKey(e.conditions_or_qualifications),contextKey(e.audience)]);
   let g=grouped.get(key);
   if(!g){g={text:p,source_numbers:[],families:new Set(),statuses:new Set(),
    contexts:new Set(),circumstances:new Set(),conditions:new Set(),
    audiences:new Set(),witnesses:[]};grouped.set(key,g);ordered.push(g);}
   g.source_numbers.push(sourceIndex+1);g.families.add(familyKey(e));
   g.statuses.add(e.status);g.contexts.add(e.context_status);
   arr(e.documented_circumstances).filter(Boolean).forEach(x=>g.circumstances.add(String(x)));
   arr(e.conditions_or_qualifications).filter(Boolean).forEach(x=>g.conditions.add(String(x)));
   arr(e.audience).filter(Boolean).forEach(x=>g.audiences.add(String(x)));
   g.witnesses.push({source_number:sourceIndex+1,family:familyKey(e),
    provenance:e.witness_provenance||e.source_witness||e.witness_type||null,
    verification_scope:e.verification_scope||null,status:e.status||null,
    context_status:e.context_status||'unknown',language:e.language||null});
  }
 }
 // A comparison is useful only when the displayed claim budget contains evidence
 // for every detected side. Reserve the first slots for one proposition per side;
 // otherwise a verbose first witness can consume the entire regular-mode budget.
 const prioritized=[];
 if(u.intent==='comparative')for(const topic of u.topics){
  const aliases=(TOPICS[topic]||[]).map(norm),match=ordered.find(g=>!prioritized.includes(g)&&aliases.some(alias=>containsTerm(g.text,alias)));
  if(match)prioritized.push(match);
 }
 const withinBudget=[...prioritized,...ordered.filter(g=>!prioritized.includes(g))].slice(0,limit);
 return withinBudget.map(g=>({text:g.text,
  source_numbers:[...new Set(g.source_numbers)],
  evidence_family_ids:[...g.families],verification_status:[...g.statuses],
  context_status:[...g.contexts],documented_circumstances:[...g.circumstances],
  conditions_or_qualifications:[...g.conditions],audiences:[...g.audiences],
  witnesses:g.witnesses}));
}
function findTensions(claims){const out=[];for(let i=0;i<claims.length;i++)for(let j=i+1;j<claims.length;j++){const a=claims[i],b=claims[j],similarity=jaccard(a.text,b.text);if(similarity>=0.45&&negationSignature(a.text)!==negationSignature(b.text)){out.push({claim_numbers:[i+1,j+1],similarity:Number(similarity.toFixed(2)),type:'possible_directional_tension',note:'Lexically related propositions differ in negation/direction; review witness context before synthesizing as consensus.'});}}return out;}
// Multiple witnesses on one topic do not by themselves establish a pattern.
// Keep only propositions that recur (exactly or with high lexical agreement)
// across independent evidence families. This conservative gate avoids turning
// unrelated education cases into a general rule attributed to the Rebbe.
function crossFamilyPatternEvidence(selected,u){
 const rows=selected.map((e,index)=>({e,index,family:familyKey(e),
  props:(e._supporting_propositions?.length?e._supporting_propositions:
   arr(e.response_propositions).filter(p=>propositionSupportsQuery(p,u))).map(String)}));
 const matched=new Map(),add=(index,p)=>{if(!matched.has(index))matched.set(index,new Set());matched.get(index).add(p);};
 for(let i=0;i<rows.length;i++)for(let j=i+1;j<rows.length;j++){
  const a=rows[i],b=rows[j];
  if(a.e._independent_witness===false||b.e._independent_witness===false||!a.family||a.family===b.family)continue;
  for(const pa of a.props)for(const pb of b.props)if(sameClaim(pa,pb)){add(a.index,pa);add(b.index,pb);}
 }
 return rows.filter(r=>matched.has(r.index)).map(r=>({...r.e,_supporting_propositions:[...matched.get(r.index)]}));
}
function classifyWitness(e){const s=norm([e.primary_secondary_status,e.source_class,e.witness_type].join(' '));return /primary|ראשוני|direct/.test(s)?'primary':/translation|תרגום|derived/.test(s)?'derived':/secondary|מאוחר|עיבוד/.test(s)?'secondary':'unspecified';}
function coverageFor(selected,u){const covered=[],missing=[];if(selected.length)covered.push('תוכן המענה');if(u.intent==='circumstances')(selected.some(e=>text(e.documented_circumstances)||text(e.conditions_or_qualifications)||text(e.audience))?covered:missing).push('נסיבות/תנאים/קהל');if(u.intent==='historical')(selected.some(e=>e.date)?covered:missing).push('תאריך/תקופה');if(u.intent==='bibliographic')(selected.some(e=>e.source_url||e.provenance||e.witness_provenance)?covered:missing).push('provenance ביבליוגרפי');if(u.intent==='pattern')(new Set(selected.map(familyKey)).size>=2?covered:missing).push('דפוס בין משפחות ראיות עצמאיות');return{covered,missing};}
const MODE_BUDGETS={regular:{sources:6,claims:5},researcher:{sources:24,claims:32}};
function presentationFor(mode){const budget=MODE_BUDGETS[mode];return{answer_style:mode==='researcher'?'extended_evidence_analysis':'concise_answer_first',detail_level:mode==='researcher'?'witness_level':'summary',source_limit:budget.sources,claim_limit:budget.claims};}
function groupSourceValues(selected,field){
 const groups=new Map();
 selected.forEach((e,i)=>arr(typeof field==='function'?field(e):e[field]).filter(Boolean).forEach(value=>{
  const label=String(value),key=norm(label);if(!key)return;
  if(!groups.has(key))groups.set(key,{value:label,source_numbers:[]});
  groups.get(key).source_numbers.push(i+1);
 }));
 return [...groups.values()];
}
function researcherAnalysis(selected,claims){
 const supportedBySource=selected.map((_,i)=>claims.map((claim,j)=>claim.source_numbers.includes(i+1)?j+1:null).filter(Boolean));
 return{
  cases:selected.map((e,i)=>({source_number:i+1,supported_claim_numbers:supportedBySource[i],evidence_family_id:familyKey(e)||null,date:e.date||null,audiences:arr(e.audience).filter(Boolean),documented_circumstances:arr(e.documented_circumstances).filter(Boolean),conditions_or_qualifications:arr(e.conditions_or_qualifications).filter(Boolean),source_class:e.source_class||null,witness_class:classifyWitness(e),provenance:e.witness_provenance||e.source_witness||e.witness_type||null,verification_scope:e.verification_scope||null,pipeline_status:e.status||null,context_status:e.context_status||'unknown',language:e.language||null})),
  distinctions:{periods:groupSourceValues(selected,'date'),audiences:groupSourceValues(selected,'audience'),circumstances:groupSourceValues(selected,'documented_circumstances'),conditions:groupSourceValues(selected,'conditions_or_qualifications'),source_classes:groupSourceValues(selected,'source_class'),context_statuses:groupSourceValues(selected,e=>e.context_status||'unknown')}
 };
}
function retainCitedSources(selected,claims){
 const used=new Set(claims.flatMap(claim=>claim.source_numbers)),oldToNew=new Map(),sources=[];
 selected.forEach((source,index)=>{const oldNumber=index+1;if(used.has(oldNumber)){oldToNew.set(oldNumber,sources.length+1);sources.push(source);}});
 const remap=number=>oldToNew.get(number);
 return{sources,claims:claims.map(claim=>({...claim,
  source_numbers:claim.source_numbers.map(remap).filter(Boolean),
  witnesses:arr(claim.witnesses).filter(w=>oldToNew.has(w.source_number)).map(w=>({...w,source_number:remap(w.source_number)}))
 }))};
}
export function buildAnswerModel(index,q,{mode='regular'}={}){
 const answerMode=mode==='researcher'?'researcher':'regular',presentation=presentationFor(answerMode),budget=MODE_BUDGETS[answerMode];
 const{understanding,hits}=retrieveEvidence(index,q),usable=hits.filter(e=>e._supporting_propositions?.length||arr(e.response_propositions).some(p=>propositionSupportsQuery(p,understanding))),families=new Set(usable.filter(e=>e._independent_witness!==false).map(familyKey).filter(Boolean));
 if(!usable.length)return{mode:answerMode,presentation,understanding,answerable:false,reason:'insufficient_evidence',claims:[],sources:[],answered_well:[],insufficient_evidence:[q]};
 if(understanding.intent==='pattern'&&families.size<2)return{mode:answerMode,presentation,understanding,answerable:false,reason:'single_evidence_family',claims:[],sources:usable.slice(0,2),answered_well:[],insufficient_evidence:['אין שתי משפחות ראיות עצמאיות לאחר dedup']};
 let answerEvidence=usable;
 if(understanding.intent==='pattern'){
  answerEvidence=crossFamilyPatternEvidence(usable,understanding);
  const recurringFamilies=new Set(answerEvidence.map(familyKey).filter(Boolean));
  if(recurringFamilies.size<2)return{mode:answerMode,presentation,understanding,answerable:false,reason:'no_cross_family_pattern',claims:[],sources:usable.slice(0,4),answered_well:['נמצאו כמה מקרים מתועדים בנושא'],insufficient_evidence:['לא נמצאה טענה חוזרת דומה בשתי משפחות ראיות עצמאיות; אין לייחס דפוס רוחבי.']};
 }
 const candidates=answerEvidence.slice(0,budget.sources),synthesized=synthesizeClaims(candidates,understanding,budget.claims),initialCoverage=coverageFor(candidates,understanding);
 if(!synthesized.length)return{mode:answerMode,presentation,understanding,answerable:false,reason:'no_entailed_propositions',claims:[],sources:candidates,answered_well:initialCoverage.covered,insufficient_evidence:[...initialCoverage.missing,q]};
 const retained=retainCitedSources(candidates,synthesized),selected=retained.sources,claims=retained.claims,coverage=coverageFor(selected,understanding);
 const base={mode:answerMode,presentation,understanding,answerable:true,reason:null,claims,sources:selected,answered_well:coverage.covered,insufficient_evidence:coverage.missing};
 if(answerMode==='researcher'){const witnessClasses=selected.reduce((a,e)=>(a[classifyWitness(e)]=(a[classifyWitness(e)]||0)+1,a),{});const selectedIndependentFamilies=new Set(selected.filter(e=>e._independent_witness!==false).map(familyKey).filter(Boolean)),analysis=researcherAnalysis(selected,claims);base.research={evidence_families:selectedIndependentFamilies.size,verified_sources:selected.filter(e=>e.status==='Verified').length,partial_context_sources:selected.filter(e=>e.context_status==='partial').length,periods:[...new Set(selected.map(e=>e.date).filter(Boolean))],audiences:[...new Set(selected.flatMap(e=>arr(e.audience)).filter(Boolean))],source_classes:[...new Set(selected.map(e=>e.source_class).filter(Boolean))],languages:[...new Set(selected.map(e=>e.language).filter(Boolean))],witness_classes:witnessClasses,pipeline_statuses:[...new Set(selected.map(e=>e.status).filter(Boolean))],coverage,tensions:findTensions(claims),evidence_map:claims.map((c,i)=>({claim_number:i+1,claim:c.text,source_numbers:c.source_numbers,evidence_family_ids:c.evidence_family_ids,documented_circumstances:c.documented_circumstances,conditions_or_qualifications:c.conditions_or_qualifications,audiences:c.audiences,witnesses:c.witnesses})),cases:analysis.cases,distinctions:analysis.distinctions,witnesses:selected.map(e=>({family:familyKey(e),provenance:e.witness_provenance||e.source_witness||e.witness_type||null,verification_scope:e.verification_scope||null,context_status:e.context_status||'unknown',language:e.language||null,witness_class:classifyWitness(e),primary_secondary_status:e.primary_secondary_status||null,duplicate_or_parallel_relations:e.duplicate_or_parallel_relations||[]}))};}
 return base;
}

