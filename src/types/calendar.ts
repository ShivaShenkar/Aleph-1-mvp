export interface CalendarBlock {
  id: string;
  source: "saved" | "new";
  weekStart: string; // ISO date of the Sunday this block belongs to
  day: number; // 1-7 (1=Sun)
  startHour: number; // half-hour index from midnight
  endHour: number;
  title: string;
  price: number;
  durationMinutes: number;
  location: "online" | "in-person";
  subject: string | null;
  maxStudents: number;
  registeredCount: number;
}

export interface SavedSlot {
  id: string;
  weekStart: string;
  day: number;
  startHour: number;
  endHour: number;
  title: string;
  price: number;
  durationMinutes: number;
  location: "online" | "in-person";
  subject: string | null;
  maxStudents: number;
  registeredCount: number;
}
