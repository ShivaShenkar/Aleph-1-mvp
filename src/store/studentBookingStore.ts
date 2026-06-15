import { create } from "zustand";
import { fetchAuthSession } from "aws-amplify/auth";
import type { StudentSlot } from "@/models/models";

const STORAGE_KEY = "aleph1-student-bookings";

function loadCached(): StudentSlot[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCache(slots: StudentSlot[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slots));
  } catch {
    /* localStorage unavailable */
  }
}

function computeSlotDate(weekStart: string, day: number, halfHourIndex: number): Date {
  const base = new Date(weekStart);
  base.setDate(base.getDate() + (day - 1));
  const totalMinutes = halfHourIndex * 30;
  base.setHours(Math.floor(totalMinutes / 60), totalMinutes % 60, 0, 0);
  return base;
}

function mapApiItem(item: Record<string, unknown>): StudentSlot {
  const weekStart = item.weekStart as string;
  const day = item.day as number;
  const startHour = item.startHour as number;
  const endHour = item.endHour as number;

  return {
    bookingId: (item.BookingId ?? item.bookingId) as string,
    studentId: (item.StudentId ?? item.studentId) as string,
    tutorId: item.tutorId as string,
    tutorName: (item.tutorName as string) ?? "",
    subject: (item.subject as string) ?? "",
    maxStudents: (item.maxStudents as number) ?? 1,
    durationMinutes: item.durationMinutes as number,
    location: (item.location as "online" | "in-person") ?? "online",
    price: item.price as number,
    title: item.title as string,
    startTime: computeSlotDate(weekStart, day, startHour),
    endTime: computeSlotDate(weekStart, day, endHour),
    tutorLatencyMinutes: 0,
    isPayed: false,
    isCanceled: false,
    createdAt: item.createdAt ? new Date(item.createdAt as string) : new Date(),
  };
}

interface StudentBookingStore {
  bookings: StudentSlot[];
  loading: boolean;
  loaded: boolean;
  fetchStudentBookings: () => Promise<void>;
}

export const useStudentBookingStore = create<StudentBookingStore>((set) => ({
  bookings: loadCached(),
  loading: false,
  loaded: false,
  fetchStudentBookings: async () => {
    set({ loading: true });
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken;
      if (!token) {
        set({ loading: false, loaded: true });
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_GATEWAY_URL}/student-bookings`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.ok) {
        const raw: Record<string, unknown>[] = await res.json();
        const mapped = raw.map(mapApiItem);
        set({ bookings: mapped, loading: false, loaded: true });
        saveCache(mapped);
      } else {
        set({ loading: false, loaded: true });
      }
    } catch {
      set({ loading: false, loaded: true });
    }
  },
}));
