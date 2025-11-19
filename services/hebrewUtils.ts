
// Utility to convert numbers to Hebrew Gematria
export const toHebrewNumeral = (num: number): string => {
  if (num <= 0) return '';

  const ones = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
  const tens = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
  const hundredsMap = ['', 'ק', 'ר', 'ש', 'ת']; // 100-400

  // Special cases for 15 and 16
  if (num === 15) return 'טו';
  if (num === 16) return 'טז';
  
  let result = '';

  // Handle Hundreds (including > 400)
  // Example: 786 -> 400 (Tav) + 300 (Shin) -> 'תש'
  while (num >= 400) {
    result += 'ת';
    num -= 400;
  }

  if (num >= 100) {
    const h = Math.floor(num / 100);
    result += hundredsMap[h] || '';
    num %= 100;
  }

  // Special check again for 15/16 if they appear after hundreds (e.g. 715 -> תשטו)
  if (num === 15) return result + 'טו';
  if (num === 16) return result + 'טז';

  // Tens
  const t = Math.floor(num / 10);
  if (t > 0) {
    result += tens[t];
    num %= 10;
  }

  // Ones
  if (num > 0) {
    result += ones[num];
  }

  return result;
};

// Helper to add Geresh or Gershayim correctly
export const formatGematria = (num: number): string => {
    const letters = toHebrewNumeral(num);
    if (letters.length === 1) {
        return letters + "'";
    } else if (letters.length > 1) {
        return letters.slice(0, -1) + '"' + letters.slice(-1);
    }
    return letters;
};

export const BOOK_NAMES: Record<string, string> = {
  'Genesis': 'בראשית',
  'Exodus': 'שמות',
  'Leviticus': 'ויקרא',
  'Numbers': 'במדבר',
  'Deuteronomy': 'דברים'
};

// Converts "Genesis 44:18-47:27" to "בראשית מד, יח - מז, כז"
export const formatBibleRef = (ref: string | undefined): string => {
  if (!ref) return '';

  // Split into Book and Numbers part
  const lastSpaceIndex = ref.lastIndexOf(' ');
  if (lastSpaceIndex === -1) return ref;

  const bookEnglish = ref.substring(0, lastSpaceIndex).trim();
  const rangePart = ref.substring(lastSpaceIndex + 1).trim();
  
  const bookHebrew = BOOK_NAMES[bookEnglish] || bookEnglish;

  // Split range by '-'
  const [start, end] = rangePart.split('-');
  
  if (!start) return ref;

  const formatCV = (cvString: string): string => {
    const [chapter, verse] = cvString.split(':');
    if (!verse) return formatGematria(parseInt(chapter)); 
    return `${formatGematria(parseInt(chapter))}, ${formatGematria(parseInt(verse))}`;
  };

  const startHebrew = formatCV(start);
  
  let endHebrew = '';
  if (end) {
    if (end.includes(':')) {
       endHebrew = formatCV(end);
    } else {
       endHebrew = formatGematria(parseInt(end));
    }
  }

  if (!endHebrew) return `${bookHebrew} פרק ${startHebrew}`;

  return `${bookHebrew} פרק ${startHebrew} - ${endHebrew}`;
};

export const formatAliyahRef = (ref: string | undefined): string => {
    if (!ref) return '';
    const formatted = formatBibleRef(ref);
    const firstSpace = formatted.indexOf(' ');
    return formatted.substring(firstSpace + 1);
};

const MONTH_MAP: Record<string, string> = {
    'Tishrei': 'תשרי',
    'Cheshvan': 'חשוון',
    'Kislev': 'כסלו',
    'Tevet': 'טבת',
    "Sh'vat": 'שבט',
    'Adar': 'אדר',
    'Adar I': 'אדר א׳',
    'Adar II': 'אדר ב׳',
    'Nisan': 'ניסן',
    'Iyyar': 'אייר',
    'Sivan': 'סיוון',
    'Tamuz': 'תמוז',
    'Av': 'אב',
    'Elul': 'אלול'
};

// Converts "4 Tevet 5785" to "ד' טבת ה'תשפ"ה"
export const formatHebrewDate = (hebcalDate: string | undefined): string => {
    if (!hebcalDate) return '';

    // Split "4 Tevet 5785"
    const parts = hebcalDate.split(' ');
    if (parts.length < 3) return hebcalDate; // Fallback

    const dayStr = parts[0];
    const yearStr = parts[parts.length - 1];
    // Month might be multi-word like "Adar I" or "Adar II"
    const monthStr = parts.slice(1, parts.length - 1).join(' ');

    const day = parseInt(dayStr);
    const year = parseInt(yearStr);

    const dayHeb = formatGematria(day);
    const monthHeb = MONTH_MAP[monthStr] || monthStr;
    
    // Year handling:
    // 5786 -> 786 -> תשפו
    // We need to handle the 5000 properly. 
    // Standard practice: 5786 is represented as 786.
    // 5000 is represented by the 'He' (ה') at the start usually, or omitted.
    // The user wants ה'תשפ"ו.
    
    const shortYear = year % 1000; 
    const yearHebLetters = toHebrewNumeral(shortYear);
    const yearHeb = "ה'" + yearHebLetters;

    // Add Geresh/Gershayim to year
    const finalYear = yearHeb.length > 1 
        ? yearHeb.slice(0, -1) + '"' + yearHeb.slice(-1)
        : yearHeb + "'";

    return `${dayHeb} ${monthHeb} ${finalYear}`;
};
