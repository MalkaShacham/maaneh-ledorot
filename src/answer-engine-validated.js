/* Validation layer for the evidence-grounded answer engine.
   Comparative claims require proposition-level evidence for every detected side.
   Evidence-integrity normalization prevents unscoped Verified labels and derived
   translations from being counted as independent witnesses/families.
   Citation validation is claim-local: a citation may support only a proposition
   actually present in that witness, and contextual fields may not leak across witnesses. */
import {buildAnswerModel as buildCoreAnswerModel} from './answer-engine.js?v=20261111-volume13-batch042';

const TOPIC_ALIASES={
  'חינוך':['חינוך','ילד','ילדים','תלמיד','מורה','education','child','children','school','teacher','chinuch'],
  'דאגה':['דאג','חרד','חרדה','פחד','בטחון','anxiety','worry','fear','bitachon'],
  'בריאות':['בריאות','רפואה','רופא','health','medical','doctor','refuah'],
  'מזוזה':['מזוז','mezuzah','mezuza'], 'נשים':['נשים','אשה','אמא','אם המשפחה','woman','women','mother'],
  'פרנסה':['פרנסה','עסק','livelihood','business','parnassa'], 'שליחות':['שליח','שליחות','shliach','shlichus','mission'],
  'נישואין':['שלום בית','נישוא','חתונ','בעל','אשה','marriage','wedding','husband','wife','sholom bayis'],
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
 'הגדלת כיתות ולימוד אישי':['להגדיל משתתפים בכיתות','להגדיל את מספר המשתתפים','כיתות לימוד','לימוד אישי','הלימוד האישי','בלי להזניח לימוד אישי','increase class participants','personal study obligation'],
  'כיסוי ראש והשפעה עקיפה':['כיסוי ראש כששכנוע ישיר לא מצליח','כיסוי ראש והשפעה עקיפה','להשפיע בעקיפין על כיסוי ראש','כיסוי הראש','השפעה ישירה','בעקיפין','hair covering indirect influence'],
  'רופאים מומחים והתאמת לימוד':['טיפול רופאים מומחים והתקשה בלימוד','רופאים מומחים והתקשה בלימוד','רופאים מומחים','לשמוע להנחיותיהם','לימוד לגירסא','לימוד בקיאותי','expert doctors study adjustment'],
  'בית מרקחת ושם כפר חב״ד':['בית מרקחת ושם כפר חב״ד','פתיחת בית מרקחת בכפר חב״ד','השם שפריר','כפר חב״ד א׳ וב׳','kfar chabad pharmacy and name'],
  'סניף נשי חב״ד מונטריאול':['סניף נשי חב״ד במונטריאול','סניף מונטריאול של אגודת נשי','סניף מונטריאול','הרחבת הפעילות','פעילות הסניף','להתרחב','montreal nshei chabad branch'],
  'בית רבקה סדר בוקר':['בית רבקה לימודי חול','בית רבקה להתחיל את היום','בית רבקה מחצית הראשונה','להתחיל את היום בלימודי חול','לימודי חול בחצי יום הראשון','לימודי חול','beis rivka morning secular studies'],
  'כתבי יד משה יצחק מיאס':['כתבי היד של החסיד משה יצחק מיאס','משה יצחק מיאס','כתבי יד','מיאס','moshe yitzchak mias manuscripts'],
  'מניין דירות חדשות כפר חב״ד':['המניין ליד הדירות החדשות','מנין ליד הדירות החדשות','מקום תפילה ליד הדירות החדשות','דירות החדשות','מניין','מנין','new housing minyan kfar chabad'],
  'משמרות שבועות כפר חב״ד':['תכנית המשמרות בחג השבועות בכפר חב״ד','משמרות אמירת תהלים ולימוד חסידות','משמרות','shavuot shifts kfar chabad'],
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
  'ריכוז בתפילה וקביעות תורה':['מה הקשר בין קושי להתרכז בתפילה לבין קביעות בלימוד תורה','קושי להתרכז בתפילה','קשה להתרכז בתפילה','ריכוז בתפילה וקביעות תורה','קביעות בלימוד תורה ושמירת מצוות','prayer concentration fixed torah study'],
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
  'אוניות ישראליות ושבת':['אוניות ישראליות בשבת','אונייה ישראלית','הפלגת אוניות בשבת','להעמיד אונייה בנמל בשבת','הפעלה אוטומטית של אונייה','israeli ships shabbat'],
  'בדיקה חוזרת לקביעת טיפול':['בדיקה חוזרת לקביעת טיפול','בדיקה נוספת','בדיקה נוספת מיד אחרי בדיקה','רופא מומחה דורש בדיקה נוספת','repeat test treatment planning'],
  'השלמת מקווה במונטווידאו':['השלמת המקווה במונטווידאו','מקווה במונטווידאו','מונטווידאו','אחריות הקהילה להשלמת מקווה','montevideo mikveh completion'],
  'משל קטר דיזל בעבודת השם':['תאונת קטר דיזל בעבודת השם','קטר דיזל','משל קטר דיזל','משל קטר הדיזל','קטר וקרונות בעבודת האדם','diesel locomotive spiritual metaphor'],
  'שליחות חינוכית למרוקו':['נסיעה למרוקו לעבוד בחינוך','נסיעתו למרוקו','שליחות חינוכית למרוקו','תלמיד תומכי תמימים במרוקו','morocco education emissary'],
  'סתימת פתח בצינור מתכת':['סתימת פתח בצינור מתכת','סתימת חלון בצינור','צינור מתכת','צינור מתכת בתוך הסתימה','sealed opening metal tube'],
  'מחלוקת הנהלה על משמעת תלמידים':['מחלוקת הנהלה על ענישת תלמידים','משמעת תלמידים בהנהלת מוסד','אסיפת כל חברי ההנהלה','הכרעה ברוב דעות','student discipline board majority'],
  'בחירת מדריך לפי הצלחה בתלמידים':['בחירת מדריך לישיבת אחי תמימים','לקיחת מדריך','הצלחתו עם התלמידים','counselor student success'],
  'השפעה על יחיד וציבור':['להשפיע על יחיד וקשה על ציבור','להשפיע על יחידים וקשה לפעול על ציבור','קל להשפיע על יחידים וקשה לפעול על ציבור','יחיד וציבור','השפעה ציבורית','יחיד עשוי להשפיע על רבים','individual and public outreach'],
  'משפט מחיצה בבית כנסת':['משפט מחיצה בבית הכנסת','סכסוך מחיצה','מומחים למשפט המחיצה','synagogue mechitza litigation'],
  'התוועדות לשינוי מעשי ולימוד':['התוועדות לשינוי מעשי','התעוררות מהתוועדות','דחיית לימוד','להוסיף בכמות הלימוד','farbrengen practical change study delay'],
  'ברית הסטודנטים יבנה והשפעה':['ברית הסטודנטים הדתיים יבנה','בוגר ברית הסטודנטים','השפעה על צעירים בתחילת דרכם','yavneh student network influence'],
  'מערכות אונייה ואוטומציה בשבת':['אילו מערכות באונייה אינן אוטומטיות','אילו מערכות באונייה אינן יכולות לפעול באוטומציה מלאה','מערכות אונייה אינן אוטומטיות','אוטומציה מלאה במשך שבת','מכונות ההנעה','לאוטומציה','מערכות האנרגיה','היגוי','מערכות הרדיו','שירותי הנוסעים','ship systems full automation shabbat'],
  'מכתב צים ויומני אונייה':['למה מכתב צים אינו מספיק','מכתב חברת צים','יומני האונייה','חילוף משמרות כל ארבע שעות','zim letter ship logs'],
  'שליח כדוגמה חיה':['שליח לשמש דוגמה חיה','לשמש דוגמה חיה','דוגמה חיה בהתנהגותו','אחריות מי שנבחר למשלחת','emissary living example conduct'],
  'תלמידי חופש במרוקו':['להגדיל תלמידים בימי החופש במרוקו','תלמידים בימי החופש','להרחיב את האכסניה','מדריכים מבני המקום במרוקו','morocco vacation students local staff'],
  'דברי התעוררות ומעשה':['מתי דברי התעוררות נעשים דברים בטלים','דברי התעוררות בלי מעשה','דברי התעוררות','פעולות שיבואו אחריו','תכליתם','לא המדרש עיקר אלא המעשה','arousal words without action'],
  'קירוב לתורה והשלמת חתת':['לקרב אנשים לתורה ולא את התורה לאנשים','קירוב אנשים לתורה','לשנות את התורה כדי להתאימה','סדר השלמת שיעורי חת״ת','השלמת שיעורי חת״ת','השיעור המוקדם קודם','bring people to torah chitas order'],
  'מקצוע לימוד כערוץ אמונה':['כיצד יכולה מורה לנצל גם מקצוע שאינו דתי לחינוך לאמונה','מקצוע שאינו דתי לחינוך לאמונה','כל מקצוע כערוץ לאמונה','הסבר מתאים לגיל התלמידים','teacher every subject faith age appropriate'],
  'מקור מנהגי פורים':['כיצד הבחין בין מקורות שונים למנהגי פורים','מקורות שונים למנהגי פורים','מקורות מנהגי פורים','משנה ראשונה ומשנה אחרונה','מנהג מסברא או ממה ששמע וראה','purim custom provenance source types'],
  'מימון מותנה להשלמת מקווה':['מה היו התנאים להצעת גיוס הכסף להשלמת המקווה בכפר חב״ד','גיוס כסף להשלמת המקווה','אלפיים לירות לאחר גמר הבנין','התחייבות מותנית להשלמת המקווה','conditional mikveh fundraising after completion'],
  'עזיבת משרה ותיקון תלונות':['מה נכתב למי שביקש לעזוב משרה במוסד חב״ד בגלל תלונות','משרה במוסד חב״ד בגלל תלונות','לעזוב משרה במוסד חב״ד','לשחררו מתפקידו','החלק שלו בתלונות','role release own part complaints'],
  'מניעה מהתוועדות והגברת הרצון':['מה לעשות כשהתנגדות מונעת השתתפות בהתוועדות','מניעה מהשתתפות בהתוועדות','הסתר על רצון דקדושה','להגביר את הרצון ואת לימוד התורה','blocked farbrengen intensify desire'],
  'קייטנה התחלה מאוחרת':['כיצד להשלים פיגור בהכנת קייטנה שהתחילה מאוחר','הקייטנה התחילה מאוחר','להכפיל את ההשתדלות בקייטנה','קשר עם תלמידים בימי החופש','late summer camp doubled effort'],
  'קבלת תלמידות למרות מחסור מקום':['האם לדחות תלמידות בקיץ בגלל מחסור במקום','אין מקום לקבל עוד תלמידות','פתרון מקום לתלמידות החופש','תלמידות הקיץ יישארו במוסד','summer girls admission space solution'],
  'הסכמה בכתב למשרת הוראה':['האם אפשר לחזור מהסכמה בכתב למשרת הוראה','הסכמה בכתב למשרה','לחזור מהסכמתו','הסכמת מנהל המוסד','written teaching job commitment'],
  'התחלת לימוד חסידות מותאמת':['איך מתחילים ללמוד חסידות כשקשה להבין','מתחיל בלימוד חסידות','קבלת עול ויגיעה בלימוד חסידות','סדר הלימוד תלוי בידיעותיו ובכשרונותיו','beginning chassidus personalized guidance'],
  'ריכוז בלימוד וספר פתוח':['קושי בריכוז בלימוד','להתרכז בלימוד','המחשבה משוטטת בזמן לימוד ותפילה','ספר פתוח לפניו','האותיות מקשרות ומחכימות','study concentration open book'],
  'לימוד חסידות בלי חבר':['העדר חבר לימוד','אין חבר לימוד','חבר לימוד בחסידות','לימוד חסידות לבד','chassidus without study partner'],
  'דואר כפר חבד ושבת':['סניף דואר בכפר חב״ד','פתיחת דואר בכפר חב״ד','סניף דואר','דואר סגור בשבת','מברקים בשבת','kfar chabad post office shabbat'],
  'פעילות נוער לפי תנאי המקום':['אמצעי פעילות נוער השנויים במחלוקת','פעילות נוער במחלוקת','תנאי המקום והזמן','תגובת הציבור המקומי','אנשי סוד המכירים את התנאים','youth outreach local conditions consultation'],
  'רופא מצליח וגאווה':['רופא מצליח על גאווה','רופא מצליח והצלחה','אתרוג וגאווה','כוחו האישי בלבד','successful doctor arrogance esrog'],
  'מחשבה בארץ ישראל והשפעה בגולה':['מחשבה על ארץ ישראל','מחשבתו בארץ ישראל','להמשיך מקדושת הארץ','השפעה בגולה','thoughts in israel influence diaspora'],
 'סמינר כפר חבד בחירת מורות':['כיצד לבחור מורות לסמינר בכפר חב״ד','בחירת מורות לסמינר','סגל מורות לסמינר','יראת שמים והתנהגות המורות','kfar chabad seminary teacher selection'],
 'פעולה מול אנחות':['פעולה אחת טובה מאלף אנחות','פעולה מעשית במקום אנחות','אלף אנחות','action instead of sighs'],
 'תעניות פרטיות ובריאות העבודה':['למה נדחו תעניות פרטיות בקיץ','תעניות פרטיות בקיץ','תענית שמבטלת מתורה ועבודה','להחליף תענית בהפצת תורה','private fast health study outreach'],
 'מגביות חופפות ותזמון':['לא לערוך מגביות חופפות','מגביות חופפות','הכרזה על מגבית אחרת באותו זמן','לפגוע בשתי המגבות','מגבית סמוכה להנחת אבן הפינה','מכתב אינו תחליף לביקור בגיוס','overlapping fundraising timing visit'],
 'נוער ברחובות בימי החופש':['בני נוער המסתובבים ברחובות בחופש','נוער ברחובות בימי החופש','בני נוער המסתובבים ללא מטרה ברחובות','קבוצות מתאימות ולהעניק לפעילות תוכן','לארגן קבוצות לנוער בחופש','summer youth street groups'],
 'קביעות חסידות ותוספת משנה חיים':['למה קביעות בלימוד חסידות אינה מספיקה','קביעות קיימת בלימוד חסידות מוצגת כבלתי מספקת','עקרון העלייה בקודש מחייב תוספת מתמשכת','לימוד חסידות לשנות את היום הבא','fixed chassidus study transform next day'],
 'זכירת חסדים מול קשיי חיים':['לחזק אמונה וביטחון מול קשיי חיים באמצעות זכירת חסדים','זכירת חסדים מול קשיי חיים','להביט בעזרה שכבר קיבלה ובילדים','gratitude hardship faith trust'],
 'לחץ ציבורי באוניות שבת':['לחץ כלכלי מצד נוסעים','מים חשמל מטבח וקירור','אוניות ישראליות בשבת'],
 'מכירת בניין ישיבה בעת קושי':['מכירת בניין הישיבה','לא למכור בניין ישיבה','צמצום מוסד חינוך'],
 'קונגרס קהילות לפעולה':['קונגרס הקהילות','מפגש עם עסקנים','אי השתתפות'],
 'משרת חזן בנוסח האריזל':['משרת חזן לימים הנוראים','בית כנסת בנוסח האריזל','סדר הסליחות'],
 'תוצאות חלשות אינן מפסיקות עבודה':['התוצאות אינן כדבעי','מחשבות המחלישות את העבודה','עבודה מתוך שמחה'],
 'מעבר מלוד לארצות הברית בתנאי':['תומכי תמימים לוד','שנה של התנהגות ראויה','ראש השנה תשי״ח'],
 'בית ספר לנערות אגאדיר בחופש':['אגאדיר','איחוד כיתות באגאדיר','לימודים סדירים בחופש באגאדיר'],
 'אמון בהבטחות לפני מכתב התעוררות':['הבטחות הבת','הבטיחה','אמון מלא בהבטחות','אחריות לקיום ההבטחה'],
 'נער במרוקו לימוד מול פרנסת האב':['בן שבע עשרה','מרוקו','פרנסת האב'],
 'נסיעה כשליחות מצווה לאחר תאונה':['תאונת דרכים','שליחות מצווה','סידור תהילים ותניא'],
 'שמינית שבשמינית מול גסות הרוח':['שמינית שבשמינית','גסות הרוח','מעלת התורה'],
 'מקווה בית תפילה ועירוב בכפר חבד':['העירוב','גמר העירוב','השלמת העירוב'],
 'הגהת ספר תורה ואהבת ישראל':['הגהת','ספרי תורה','אות יתרה','אות חסרה'],
 'ועד רוחני כפר חבד דוגמה חיה':['חברי הוועד הרוחני','ועד הרוחני בכפר חב״ד','חברי הועד הרוחני','kfar chabad spiritual committee living example'],
 'ברונא בלי חבר לימוד':['לעזוב את ברונא','ישיבת תומכי תמימים בברונא','תלמידים צעירים ממרוקו','brunoy without study partner'],
 'נסיעה לעבודה ושיעורי חתת':['נסיעה למקום העבודה ובחזרה','נסיעה לעבודה וחזרה','חת״ת בזמן הנסיעה','chitas work commute'],
 'דברי התעוררות בימים נוראים':['לא לייגע את השומעים','שקלא וטריא ושיחה','ראש השנה וביום הכיפורים בלי לייגע','high holidays talks without tiring listeners'],
 'מעשה בראשית וקבלה מגושמת':['הספר מעשה בראשית','להפשיטם מגשמיות','פירוש מילולי של מושגי קבלה','maaseh bereshit kabbalah abstraction'],
 'מלבורן בית ספר בלי להמתין לבניין':['בלי להמתין לבניין ייעודי','להמתין לבניין ייעודי לפני פתיחת','חדר פנוי בבניין הישיבה','עזרת נשים בעלת כניסה נפרדת','melbourne girls school without waiting for building'],
 'מלבורן מוסדות אחרים ומרות חבד':['חב״די לבנות במלבורן למרות מוסדות','למרות מוסדות אחרים במלבורן','מוסד לבנות במרות חב״ד','melbourne girls school despite other institutions'],
 'קדיש אזור זמן מקום הפטירה':['סיום אחד עשר חודשי קדיש','זמן מקום הפטירה','פטירה בוונקובר','kaddish time zone place of death'],
 'זריעה רחבה בהשפעה מסופקת':['ספק בהצלחת ההשפעה','אי ודאות בהצלחה','לזרוע הרבה גרעינים','השפעה על אברכים','wide sowing despite uncertain outreach'],
 'חינוך נשים ספרדיות ושיתוף מתנדבות':['חינוך נשים ובנות ספרדיות','חינוך הבנות אצל הספרדים','לשתף נשים רבות בפעילות','sephardic women education volunteers'],
 'פעילות נשי חבד עם מגבלה רפואית':['פעילות נשי ובנות חב״ד עם מגבלה רפואית','מגבלה רפואית המונעת עלייה במדרגות','מגבלה הרפואית','להימנע מעלייה במדרגות','להתייעץ עם הרופא על פעילות','health bounded volunteering avoid stairs'],
 'שליח ציבור פירוש המלות לפני ימים נוראים':['שליח ציבור ללמוד פירוש המלות','לעבור על פירוש המלות לפני ראש השנה','פירוש המלות והפיוטים','פיוטים שאינם שגורים','high holiday prayer leader review meaning'],
 'מדריך גן ישראל השפעה לטווח ארוך':['השפעת מדריך גן ישראל','שינוי בילד לאורך שבועות חודשים ושנים','מדריך שמשנה את עצמו','gan israel counselor long term influence'],
 'משרת רבנות וסייגי עצמאות':['משרת רבנות','תנאים לקבל משרת רבנות','עצמאות בענייני יראת שמים','לא להשתמש בשם כהכשר','rabbinic position religious autonomy safeguards'],
 'לימוד חסידות יומי ומקווה רפואי':['זמן קצר בכל יום ללימוד חסידות','טבילה במקווה ומצב בריאותי','אטם רטוב באוזן','daily chassidus mikveh medical consultation'],
 'שנים מקרא מול חומש יומי וציצית מכונה':['שנים מקרא אינו מחליף חומש יומי','חומש עם רש״י בכל יום','ציצית שנטוותה במכונה','shnayim mikra daily chumash machine tzitzit'],
 'חזרה מלב או מתוך הכתב':['לחזור מאמרים בעל פה או בפנים','דברים היוצאים מן הלב','חזרה מתוך הכתב','review talks by heart or from text'],
 'נגלה אינו פוטר מחסידות':['לימוד נגלה פוטר מלימוד חסידות','עיסוק נרחב בנגלה','נגלה אינו פוטר מחסידות','revealed torah does not exempt chassidus'],
  'חיפוש והצלת ספרים וכתבי יד':['לחפש ספרים וכתבי יד','להציל ספרים מכליה','ספרים וכתבי יד של חסידות חב״ד','search rescue books manuscripts'],
  'ביקור השלוחים חרישה זריעה והמשך':['ביקור השלוחים חרישה וזריעה','אחרי ביקור השלוחים','אדם אחד או שניים שירכזו','אחריות משותפת אינה מביאה לפעולה','emissary visit plowing sowing followup'],
  'שיחות לנוער וספרות חסידית':['חוברת שיחות לנוער','ספרות לנוער בארץ','תורת נשיאי חב״ד לנוער','youth talks booklet chassidic literature'],
  'עבודת חינוך זכות ולא כורח':['עבודה במוסד חינוכי ככורח לפרנסה','עבודת חינוך זכות ולא כורח','ביסוס הגדלת והרחבת המוסד','education work privilege not forced livelihood'],
  'שמש מאיר את בית הכנסת':['שמש בבית הכנסת','השמש','להאיר את בית הכנסת','מקום מואר מבחינה רוחנית','חוזה עבודה עם בית הכנסת','synagogue shamash illuminate contract'],
  'בית ספר עיקרי יהדות והלכות יום יום':['עיקרי היהדות','הלכות יום יום ומנהגים','בית ספר חרדי לא רק ללמד תורה','religious school basic judaism daily law'],
  'ישיבה עדיפה על חזרה הביתה':['יראת שמים בבית מאשר בישיבה','להישאר בישיבה','לימוד בחברת חברים','remain in yeshiva instead of home'],
  'שמירת עיניים ולשון הדרכה אישית':['שמירת העיניים והלשון','פרק מ״א בתניא','הותאמה ההדרכה','לאופי השואל ולסביבתו','תלויה באופי השואל ובסביבתו','eyes speech personalized guidance tanya 41'],
  'כישורי חינוך והסטת רושם שלילי':['כישורים להדרכה ולחינוך','התאמה להדרכה וחינוך','רושם שלילי מהסביבה','מחשבה טובה פרק מא','educational aptitude redirect negative impressions'],
  'נוסח אדמו״ר הזקן וקשר תפילין':['נוסח התפילה שקבע אדמו״ר הזקן','נוסח אדמו״ר הזקן וקשר תפילין','קשר של תפילין ונוסח התפילה','alter rebbe prayer rite tefillin knot'],
  'תלונות מחלישות ופעולה ישירה':['תלונות על חוסר הצלחה','התלונות מחלישות','לא להתווכח עם היצר','פעולה ישירה בתורה ובמצוות','discouragement direct positive action'],
  'פסקי דינים תוספת סדר דפוס':['פסקי דינים תוספת סדר דפוס','פסקי דינים','סדר דפוס','שורות שהוסיף סדר הדפוס','כתב יד מעתיק בלי השורות','typesetter interpolation piskei din manuscript'],
  'תניא מקומי וחסידות בסעודה שלישית':['שיעור תניא מקומי','להחליף התוועדות בשיחה מוסרית','חסידות בסעודה שלישית','שבת מסוגלת ללימוד פנימיות התורה','local tanya class shabbat chassidus farbrengen'],
  'אונייה התפלת מים בשבת':['התפלת מי ים','התפלת מי ים בשבת','התפלת מי ים באונייה','מים מתוקים באונייה','נוסעים משפיעים על מלאכות האונייה','ship desalination passengers shabbat'],
  'תומכי תמימים קריאת סיוע':['גירעון ישיבות תומכי תמימים','תרומה מיידית לתומכי תמימים','קריאת סיוע לישיבות','קריאת סיוע מיידית','ישיבות תומכי תמימים','tomchei temimim emergency financial appeal'],
  'צעירי אגודת ישראל דוגמה חיה':['ועידת צעירי אגודת ישראל','צעירי אגודת ישראל','צעירים דוגמה חיה בבית ומחוצה לו','משבר הדור הצעיר','young agudath israel living example'],
  'מסורת מוסמכת ללימוד פנימיות התורה':['מסירה מרב לרב בפנימיות התורה','מסירה מרב לרב','מרב לרב','מסורת מוסמכת מרב לרב','מעיינות הבעש״ט ואדמו״ר הזקן','סדר לימוד בנגלה ובחסידות','authorized chain inner torah study'],
  'סכסוך לפרנסה דין תורה ולא קללה':['סכסוך לפרנסה דין תורה','סכסוך הנוגע לפרנסה','בוררות מוסכמת או דין תורה','לשון פוגענית בחודש אלול','livelihood dispute rabbinic adjudication not abuse'],
 'הפצת ספרים':['מימון','הדפס','הוצאה לאור','הפצת ספר','הדפסת ספר','פרסום הספר','פרסומים תורניים','publication','publishing','printing','book'],
  'אמונה':['אמונה','בטחון','faith','belief','trust','emunah','bitachon']
};
const norm=s=>String(s||'').toLowerCase().replace(/[?.,!״׳:'"()\[\]]/g,' ').replace(/\s+/g,' ').trim();
const arr=v=>Array.isArray(v)?v:(v==null||v===''?[]:[v]);
const propositionText=e=>norm(arr(e?._supporting_propositions).concat(arr(e?.response_propositions)).join(' '));
const topicSupported=(claims,topic)=>{const aliases=TOPIC_ALIASES[topic]||[topic];return claims.some(claim=>{const body=norm(claim?.text);return aliases.some(a=>body.includes(norm(a)));});};
const isDerived=e=>/translation|תרגום|derived/.test(norm([e?.primary_secondary_status,e?.source_class,e?.witness_type].join(' ')));
// An index entry establishes the letter's identity/locator, not what the Rebbe said.
const isLocatorOnly=e=>/bibliographic_locator_verified_only|identity\/locator|bibliographic identity|index[- ]first|metadata[_ -]and[_ -]locator[_ -]only/.test(norm([e?.context_status,e?.verification_scope,e?.rights_status].join(' ')));
// Non-verbatim text is answer evidence only when it is an explicit source-grounded
// paraphrase whose source text was inspected and whose location was recorded.
const isInspectedSourceParaphrase=e=>e?.proposition_origin==='source_grounded_paraphrase'&&e?.proposition_verbatim===false&&e?.proposition_verification==='source_text_inspected'&&Boolean(e?.proposition_source_locator);
// Editorial summaries and unverified paraphrases remain discovery aids only.
const isEditorialSummaryOnly=e=>e?.proposition_origin==='editorial_summary_derived'||(e?.proposition_verbatim===false&&!isInspectedSourceParaphrase(e));
const tokens=s=>new Set(norm(s).split(/\s+/).filter(x=>x.length>1));
const overlapRatio=(a,b)=>{const A=tokens(a),B=tokens(b);if(!A.size||!B.size)return 0;let n=0;A.forEach(x=>{if(B.has(x))n++;});return n/Math.min(A.size,B.size);};
const CATALOG_STOP=new Set('מה הרבי אמר אומר על של את עם או וגם לגבי האם לי יש היה היא הוא זה זו אני אנחנו בנושא בעניין רוצה לדעת the a an of to and or on about what how did does is are rebbe say says said'.split(' '));

/* Catalog matches are discovery leads, never answer evidence. Ranking may use
   publisher metadata or an editorial summary, but the returned object deliberately
   omits summaries and propositions so downstream renderers cannot quote them. */
export function retrieveCatalogMatches(index=[],q,{limit=6}={}){
  const query=norm(q),raw=query.split(/\s+/).filter(t=>t.length>1&&!CATALOG_STOP.has(t));
  const topicAliases=Object.values(TOPIC_ALIASES).filter(group=>group.some(a=>query.includes(norm(a)))).flat().map(norm);
  const terms=[...new Set([...raw,...topicAliases])];if(!terms.length)return[];
  const score=e=>{const metadata=norm([e.title,e.source_class,e.date,e.language,arr(e.publisher_terms).join(' '),arr(e.research_terms).join(' '),JSON.stringify(e.locator||'')].join(' '));const discovery=norm([metadata,e.summary,arr(e.response_propositions).join(' ')].join(' '));const hits=terms.filter(t=>discovery.includes(t));return{value:hits.length*2+terms.filter(t=>metadata.includes(t)).length+(e.status==='Verified'?1:0),hits};};
  const seen=new Set();return index.map(e=>({e,...score(e)})).filter(x=>x.hits.length>0).sort((a,b)=>b.value-a.value).filter(x=>{const k=x.e.source_url||x.e.key||x.e.id;if(!k||seen.has(k))return false;seen.add(k);return true;}).slice(0,limit).map(({e,hits})=>({
    key:e.key||e.id||null,title:e.title||e.id||'רשומה ללא כותרת',source_url:e.source_url||null,
    source_class:e.source_class||null,date:e.date||null,language:e.language||null,
    status:e.status||null,canonical_status:e.canonical_status||null,context_status:e.context_status||'unknown',
    verification_scope:e.verification_scope||null,locator:e.locator||null,
    matched_terms:hits,match_basis:'catalog_metadata_or_editorial_summary',
    answer_evidence:false,content_claims_excluded:true
  }));
}

export function normalizeEvidenceIntegrity(index=[]){
  return index.map(source=>{const e={...source},issues=[];if(e.status==='Verified'&&!e.verification_scope){e.status='Linked';e._reported_status='Verified';issues.push('verified_without_scope_demoted');}if(isLocatorOnly(e)){if(e.has_content_evidence||arr(e.response_propositions).length)issues.push('locator_only_content_blocked');e.has_content_evidence=false;e.response_propositions=[];e._supporting_propositions=[];}if(isEditorialSummaryOnly(e)){if(e.has_content_evidence||arr(e.response_propositions).length)issues.push('editorial_summary_answer_evidence_blocked');e._content_evidence_status='editorial_summary_only';e.has_content_evidence=false;e.response_propositions=[];e._supporting_propositions=[];}if(isDerived(e)){const parent=e.parent_evidence_family_id||e.derived_from_evidence_family_id||e.translation_of_evidence_family_id||null;if(parent)e.evidence_family_id=parent;else issues.push('derived_witness_parent_family_unknown');e._independent_witness=false;}else e._independent_witness=true;if(issues.length)e._evidence_integrity_issues=issues;return e;});
}

/* The core engine copies source proposition wording into a claim (no paraphrase).
   Therefore a citation must match that proposition exactly after harmless formatting
   normalization. Lexical overlap is NOT semantic entailment; do not accept it here. */
export function citationEntailment(model){
  const sources=model?.sources||[];
  return (model?.claims||[]).map((claim,claimIndex)=>{
    const asserted=arr(claim.source_numbers);
    const entailed=asserted.filter(n=>{const e=sources[n-1];if(!e)return false;const props=arr(e._supporting_propositions).concat(arr(e.response_propositions));return props.some(p=>norm(claim.text)===norm(typeof p==='string'?p:JSON.stringify(p)));});
    return {claim_number:claimIndex+1,asserted_source_numbers:asserted,entailed_source_numbers:entailed,unsupported_source_numbers:asserted.filter(n=>!entailed.includes(n)),valid:entailed.length>0&&entailed.length===asserted.length};
  });
}

/* Context is witness-local and value-local. Every circumstance, qualification and audience
   value attached to a synthesized claim must occur on at least one witness that independently
   entails that claim. Merely having some value in the same field is not enough. */
export function contextBoundary(model,entailment){
  const sources=model?.sources||[];
  return (model?.claims||[]).map((claim,i)=>{
    const supporting=new Set(entailment[i]?.entailed_source_numbers||[]);
    const local=[...supporting].map(n=>sources[n-1]).filter(Boolean);
    const missingValues=(claimField,sourceField=claimField)=>arr(claim[claimField]).filter(Boolean).filter(value=>!local.some(e=>arr(e[sourceField]).filter(Boolean).some(v=>norm(v)===norm(value))));
    const missing={
      documented_circumstances:missingValues('documented_circumstances'),
      conditions_or_qualifications:missingValues('conditions_or_qualifications'),
      audiences:missingValues('audiences','audience')
    };
    const leaks=Object.entries(missing).filter(([,values])=>values.length).map(([field])=>field);
    return {claim_number:i+1,valid:leaks.length===0,possible_context_leakage:leaks,unsupported_context_values:missing};
  });
}

export function comparativeCoverage(model){if(model?.understanding?.intent!=='comparative')return null;const requested=[...new Set(model.understanding.topics||[])];if(requested.length<2)return {enforceable:false,requested_topics:requested,supported_topics:[],missing_topics:[],reason:'comparison_sides_not_fully_parsed'};const claims=model.claims||[],supported=requested.filter(t=>topicSupported(claims,t)),missing=requested.filter(t=>!supported.includes(t));return {enforceable:true,requested_topics:requested,supported_topics:supported,missing_topics:missing,scope:'displayed_claims'};}

export function buildAnswerModel(index,q,options={}){
  const normalized=normalizeEvidenceIntegrity(index);let model=buildCoreAnswerModel(normalized,q,options);
  model.catalog_matches=retrieveCatalogMatches(index,q);
  const integrityIssues=(model.sources||[]).flatMap((e,i)=>arr(e._evidence_integrity_issues).map(issue=>({source_number:i+1,issue,reported_status:e._reported_status||null})));
  const entailment=citationEntailment(model),boundaries=contextBoundary(model,entailment);
  const citationFailures=entailment.filter(x=>!x.valid),contextFailures=boundaries.filter(x=>!x.valid);
  model.citation_entailment=entailment;model.context_boundary=boundaries;
  if(citationFailures.length||contextFailures.length){model={...model,answerable:false,reason:citationFailures.length?'citation_entailment_failed':'context_boundary_failed',claims:[],answered_well:[],insufficient_evidence:[...(model.insufficient_evidence||[]),...(citationFailures.length?['לפחות citation אחד אינו נתמך ישירות ב-proposition של ה-witness המצוטט.']:[]),...(contextFailures.length?['זוהתה אפשרות לזליגת הקשר בין witnesses; אין להציג את הטענה עד לבירור.']:[])]};}
  if(options.mode==='researcher'){model.research=model.research||{};model.research.evidence_integrity={issues:integrityIssues,independent_witnesses:(model.sources||[]).filter(e=>e._independent_witness!==false).length,derived_non_independent:(model.sources||[]).filter(e=>e._independent_witness===false).length};model.research.citation_entailment=entailment;model.research.context_boundary=boundaries;}
  const coverage=comparativeCoverage(model);if(!coverage)return model;model.comparative_coverage=coverage;
  if(!coverage.enforceable)return {...model,answerable:false,reason:'comparative_sides_unresolved',claims:[],answered_well:[],insufficient_evidence:[...(model.insufficient_evidence||[]),'לא ניתן לזהות בביטחון את שני צדי ההשוואה; אין להסיק הבדל.']};
  if(coverage.missing_topics.length)return {...model,answerable:false,reason:'comparative_missing_side',claims:[],answered_well:coverage.supported_topics.map(t=>`נמצאו ראיות לצד: ${t}`),insufficient_evidence:[...(model.insufficient_evidence||[]),...coverage.missing_topics.map(t=>`אין די ראיות ברמת proposition לצד: ${t}`)]};
  if(options.mode==='researcher'){model.research=model.research||{};model.research.comparative_coverage=coverage;}return model;
}

