export enum LocationType {
  ISRAEL = 'ISRAEL',
  DIASPORA = 'DIASPORA'
}

export enum TrackingMode {
  DAILY = 'DAILY', // Rishon, Sheni, etc.
  WEEKLY = 'WEEKLY' // Completed whole Parasha
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark'
}

export interface Aliyah {
  id: number;
  name: string; // e.g., "ראשון", "שני"
  dayOfWeek: number; // 0 = Sunday, 1 = Monday...
}

export interface Parasha {
  name: string;
  englishName: string;
  description: string;
  date?: Date; // Date of the Shabbat
  fullRef?: string; // e.g. "Genesis 44:18-47:27"
  aliyot?: Record<string, string>; // Map of "1" -> "Genesis 44:18-44:30"
}

export interface UserProgress {
  [parashaName: string]: {
    daily: boolean[]; // Array of booleans for each Aliyah
    weekly: boolean; // Boolean for full parasha
  };
}

export interface AppSettings {
  location: LocationType;
  mode: TrackingMode;
  notificationsEnabled: boolean;
  notificationTime: string; // "HH:MM" format
  theme: Theme;
}