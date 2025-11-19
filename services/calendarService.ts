
import { Aliyah, Parasha, LocationType, UserProgress } from '../types';
import { ISRAEL_CALENDAR, DIASPORA_CALENDAR, RawParashaEvent } from './calendarData';

const PARASHA_DESCRIPTIONS: Record<string, string> = {
  'בראשית': 'בריאת העולם, אדם וחוה, קין והבל, עשרה דורות מאדם ועד נח.',
  'נח': 'המבול, התיבה, ברית הקשת בענן, מגדל בבל.',
  'לך-לך': 'ציווי ה׳ לאברהם, ירידה למצרים, ברית בין הבתרים, ברית מילה.',
  'וירא': 'ביקור המלאכים, סדום ועמורה, עקדת יצחק.',
  'חיי שרה': 'מות שרה, רכישת מערת המכפלה, שידוך יצחק ורבקה.',
  'תולדות': 'לידת יעקב ועשו, מכירת הבכורה, יצחק בגרר, הברכות.',
  'ויצא': 'חלום יעקב, לבן הארמי, נישואי לאה ורחל, לידת השבטים, הבריחה מלבן.',
  'וישלח': 'המפגש עם עשו, מאבק עם המלאך, דינה ושכם, מות רחל ויצחק.',
  'וישב': 'חלומות יוסף, מכירת יוסף, יהודה ותמר, יוסף בבית פוטיפר.',
  'מקץ': 'חלומות פרעה, יוסף המשביר, ירידת האחים למצרים.',
  'ויגש': 'התגלות יוסף לאחיו, יעקב יורד למצרים, ההתיישבות בגושן.',
  'ויחי': 'ברכת יעקב לבניו, מות יעקב ויוסף.',
  'שמות': 'שיעבוד מצרים, משה בתיבה, הסנה הבוער, מכות מצרים (דם עד ערוב).',
  'וארא': 'מכות מצרים (דבר עד ברד).',
  'בא': 'מכות מצרים (ארבה עד בכורות), יציאת מצרים.',
  'בשלח': 'קריעת ים סוף, שירת הים, המן, מלחמת עמלק.',
  'יתרו': 'ביקור יתרו, מעמד הר סיני, עשרת הדיברות.',
  'משפטים': 'דיני עבד עברי, נזיקין, שומרים, חגים.',
  'תרומה': 'ציווי על מלאכת המשכן, הארון, המנורה, השולחן.',
  'תצוה': 'בגדי כהונה, קידוש הכהנים, מזבח הקטורת.',
  'כי תשא': 'מחצית השקל, כיור, חטא העגל, י"ג מידות.',
  'ויקהל': 'הקהלת העם, בניית המשכן וכליו.',
  'פקודי': 'סיכום מלאכת המשכן, השראת השכינה.',
  'ויקרא': 'דיני הקורבנות: עולה, מנחה, שלמים, חטאת ואשם.',
  'צו': 'תורת הקורבנות לכהנים, שבעת ימי המילואים.',
  'שמיני': 'יום השמיני למילואים, מות נדב ואביהוא, מאכלות אסורים.',
  'תזריע': 'טומאת יולדת, נגעי צרעת באדם, בבגד.',
  'מצורע': 'טהרת המצורע, צרעת הבית, טומאת הזב והזבה.',
  'אחרי מות': 'עבודת יום הכיפורים, איסורי עריות.',
  'קדשים': 'מצוות בין אדם לחברו, "ואהבת לרעך כמוך", איסורי כלאיים.',
  'אמור': 'דיני כהנים, מועדי ישראל, פרשת המקלל.',
  'בהר': 'שמיטה, יובל, גאולת קרקעות, איסור ריבית.',
  'בחוקתי': 'הברכות והקללות, דיני ערכין ומעשרות.',
  'במדבר': 'מפקד בני ישראל, סדר המחנות, תפקידי הלויים.',
  'נשא': 'פרשת סוטה, נזיר, ברכת כהנים, קורבנות הנשיאים.',
  'בהעלותך': 'מנורת הזהב, פסח שני, המתאוננים, חטא מרים.',
  'שלח-לך': 'חטא המרגלים, פרשת ציצית, חלה.',
  'קרח': 'מחלוקת קרח ועדתו, מטה אהרון, מתנות כהונה.',
  'חוקת': 'פרה אדומה, מות מרים ואהרון, נחש הנחושת.',
  'בלק': 'בלק ובלעם, אתונו של בלעם, חטא בעל פעור.',
  'פינחס': 'קנאת פינחס, המפקד השני, בנות צלפחד, המועדים.',
  'מטות': 'נדרים, מלחמת מדין, בני גד ובני ראובן.',
  'מסעי': 'מסעות בני ישראל, גבולות הארץ, ערי מקלט.',
  'דברים': 'תוכחת משה, חטא המרגלים, כיבוש עבר הירדן.',
  'ואתחנן': 'תפילת משה, עשרת הדיברות (חוזר), שמע ישראל.',
  'עקב': 'שכר המצוות, שבעת המינים, ברכת המזון.',
  'ראה': 'ברכה וקללה, מקום המקדש, מאכלות אסורים, מועדים.',
  'שופטים': 'מינוי שופטים, דיני מלך, ערי מקלט, יציאה למלחמה.',
  'כי-תצא': 'אשת יפת תואר, בן סורר ומורה, השבת אבידה, שלוח הקן.',
  'כי-תבוא': 'ביכורים, הברכות והקללות בהר עיבל וגריזים.',
  'נצבים': 'הברית עם ישראל, "לא בשמים היא", הבחירה בחיים.',
  'וילך': 'העברת ההנהגה ליהושע, מצוות הקהל, כתיבת התורה.',
  'האזינו': 'שירת האזינו.',
  'וזאת הברכה': 'ברכת משה לשבטים, מות משה.',
};

export const ALIYOT: Aliyah[] = [
  { id: 0, name: 'ראשון', dayOfWeek: 0 },
  { id: 1, name: 'שני', dayOfWeek: 1 },
  { id: 2, name: 'שלישי', dayOfWeek: 2 },
  { id: 3, name: 'רביעי', dayOfWeek: 3 },
  { id: 4, name: 'חמישי', dayOfWeek: 4 },
  { id: 5, name: 'שישי', dayOfWeek: 5 },
  { id: 6, name: 'שביעי / מפטיר', dayOfWeek: 6 },
];

export const getTodayAliyahIndex = (): number => {
  const day = new Date().getDay(); // 0 is Sunday
  return day;
};

// Helper to normalize strings for description lookup
const normalizeParashaTitle = (title: string): string => {
  // Raw title format: "פָּרָשַׁת וַיִּגַּשׁ" or "פָּרָשַׁת לֶךְ־לְךָ"
  
  // 1. Remove "פרשת " prefix FIRST (sometimes it has nikud)
  let cleanName = title.replace('פרשת ', '').replace('פָּרָשַׁת ', '').trim();

  // 2. Replace Maqaf (Hebrew hyphen \u05BE) with standard hyphen (-) BEFORE stripping nikud
  // because the nikud range includes 05BE in some regex implementations, or we just want to be safe.
  cleanName = cleanName.replace(/\u05BE/g, '-');

  // 3. Remove nikud (vowel points and cantillation)
  // Range 0591-05C7 covers most marks.
  cleanName = cleanName.replace(/[\u0591-\u05C7]/g, ''); 

  // 4. Trim again just in case
  cleanName = cleanName.trim();

  return cleanName;
};

// Helper to get Chumash name (English) from fullRef or other indicators
export const getChumashFromParasha = (parasha: Parasha): string => {
  if (parasha.fullRef) {
    const bookName = parasha.fullRef.split(' ')[0];
    return bookName;
  }
  return 'Genesis';
};

const mapEventToParasha = (ev: RawParashaEvent): Parasha => {
    const cleanName = normalizeParashaTitle(ev.hebrew);
    
    // Basic description fallback if not found in our map
    // Also handle double parashas (e.g., "תזריע-מצרע")
    let desc = PARASHA_DESCRIPTIONS[cleanName];
    
    if (!desc) {
        // Try finding exact match first
        // If not, check for hyphens (double parasha) - now looking for standard hyphen
        if (cleanName.includes('-') || cleanName.includes(' ')) {
           // Try direct look up first for hyphenated/spaced keys
           if (PARASHA_DESCRIPTIONS[cleanName]) {
               desc = PARASHA_DESCRIPTIONS[cleanName];
           } else {
               // Split by hyphen or space to find combined descriptions
               const parts = cleanName.split(/[- ]/);
               const desc1 = PARASHA_DESCRIPTIONS[parts[0]] || '';
               const desc2 = PARASHA_DESCRIPTIONS[parts[1]] || '';
               if (desc1 || desc2) {
                  desc = `${desc1} ${desc2}`.trim();
               }
           }
        }
    }

    return {
      name: cleanName,
      englishName: ev.title, 
      description: desc || 'פרשת השבוע', 
      date: new Date(ev.date),
      // Store original hebrew date string attached to the object for display
      hdate: ev.hdate, 
      fullRef: ev.leyning?.torah,
      aliyot: ev.leyning as unknown as Record<string, string>
    } as Parasha; 
};

export const getParashaSchedule = (location: LocationType): { current: Parasha, all: Parasha[] } => {
  // 1. Select Data Source
  const rawData = location === LocationType.ISRAEL ? ISRAEL_CALENDAR : DIASPORA_CALENDAR;
  
  // 2. Determine "Today" (Reset time to start of day for comparison)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 3. Find Upcoming/Current Parasha
  let currentIndex = rawData.findIndex(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0,0,0,0);
      return eventDate >= today;
  });

  if (currentIndex === -1) {
      currentIndex = rawData.length - 1;
  }

  const currentEvent = rawData[currentIndex];
  const currentParasha = mapEventToParasha(currentEvent);

  // 4. Determine "Yearly Tracker" Range
  // A Jewish year (Torah cycle) starts with Bereshit.

  // Search backwards for Bereshit
  let startIndex = currentIndex;
  while (startIndex > 0) {
      const pName = normalizeParashaTitle(rawData[startIndex].hebrew);
      if (pName === 'בראשית') {
          break;
      }
      startIndex--;
  }
  
  // Search forwards for next Bereshit (to find end of current cycle)
  let endIndex = currentIndex + 1;
  while (endIndex < rawData.length) {
      const pName = normalizeParashaTitle(rawData[endIndex].hebrew);
      if (pName === 'בראשית') {
          break; // Stop BEFORE the next Bereshit
      }
      endIndex++;
  }

  // Slice the array for the current year view
  const currentYearEvents = rawData.slice(startIndex, endIndex);
  const allParashot = currentYearEvents.map(mapEventToParasha);

  return {
    current: currentParasha,
    all: allParashot
  };
};

export interface CompletionStatus {
  bookCompleted: string | null;
  torahCompleted: boolean;
}

// Check if a book (Chumash) is completed
export const checkCompletion = (
  allParashot: Parasha[],
  progress: UserProgress,
  modifiedParashaName: string
): CompletionStatus => {
  // 1. Find which book the modified parasha belongs to
  const targetParasha = allParashot.find(p => p.name === modifiedParashaName);
  if (!targetParasha) return { bookCompleted: null, torahCompleted: false };
  
  const bookName = getChumashFromParasha(targetParasha);
  
  // 2. Filter all parashot belonging to this book in the current year
  const bookParashot = allParashot.filter(p => getChumashFromParasha(p) === bookName);
  
  // 3. Check if all are done
  const isBookDone = bookParashot.every(p => {
    const userP = progress[p.name];
    return userP?.weekly || (userP?.daily?.every(Boolean) ?? false);
  });

  // 4. Check if ALL parashot in the year are done
  const isTorahDone = allParashot.every(p => {
    const userP = progress[p.name];
    return userP?.weekly || (userP?.daily?.every(Boolean) ?? false);
  });

  return {
    bookCompleted: isBookDone ? bookName : null,
    torahCompleted: isTorahDone
  };
};
