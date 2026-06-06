export interface Subject {
  slug: string;
  name: string;
  color: string;
}

export const subjects: Subject[] = [
  { slug: "history", name: "היסטוריה", color: "#FF8C61" },
  { slug: "english", name: "אנגלית", color: "#9B5DE5" },
  { slug: "math", name: "מתמטיקה", color: "#00B4D8" },
  { slug: "bible", name: "תנ״ך", color: "#FEE440" },
  { slug: "civics", name: "אזרחות", color: "#F15BB5" },
  { slug: "hebrew", name: "עברית", color: "#CAFF8A" },
  { slug: "arabic", name: "ערבית", color: "#CAFF8A" },
  { slug: "computer_science", name: "מדעי המחשב", color: "#9B5DE5" },
  { slug: "biology", name: "ביולוגיה", color: "#00F5D4" },
  { slug: "chemistry", name: "כימיה", color: "#FEE440" },
  { slug: "geography", name: "גיאוגרפיה", color: "#00B4D8" },
  { slug: "physics", name: "פיזיקה", color: "#F15BB5" },
  { slug: "sciences", name: "מדעים", color: "#00F5D4" },
  { slug: "french", name: "צרפתית", color: "#FF8C61" },
  { slug: "moreshet_israel", name: "מורשת ישראל", color: "#CAFF8A" },
];
