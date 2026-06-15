import { create } from "zustand";
import { fetchAuthSession } from "aws-amplify/auth";
import type { Booking } from "@/models/models";
import type { CalendarBlock, SavedSlot } from "@/types/calendar";

const STORAGE_KEY = "aleph1-bookings";

function loadCachedData(): { tutorSlots: SavedSlot[] } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveCachedData(tutorSlots: SavedSlot[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tutorSlots }));
  } catch {
    /* localStorage unavailable */
  }
}

export function clearCachedBookings(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* localStorage unavailable */
  }
}

export interface DayGroup {
  date: Date;
  bookings: Booking[];
}

interface BookingStore {
  upcomingLessons: DayGroup[];
  setUpcomingLessons: (days: DayGroup[]) => void;
  allLessonsMat: Booking[][];
  setLessonList: (bookings: Booking[], index: number) => void;
  tutorSlots: SavedSlot[];
  tutorSlotsLoaded: boolean;
  tutorSlotsLoading: boolean;
  fetchTutorSlots: () => Promise<void>;
  applyTutorSlotChanges: (added: CalendarBlock[], deletedIds: string[]) => void;
}

const cached = loadCachedData();

export const useBookingStore = create<BookingStore>((set, get) => ({
  upcomingLessons: [],
  setUpcomingLessons: (groups) => set({ upcomingLessons: groups }),
  allLessonsMat: [],
  setLessonList: (bookings, index) => {
    const newMat = [...get().allLessonsMat];
    newMat[index] = bookings;
    set({ allLessonsMat: newMat });
  },
  tutorSlots: cached?.tutorSlots ?? [],
  tutorSlotsLoaded: cached !== null,
  tutorSlotsLoading: false,
  fetchTutorSlots: async () => {
    const { tutorSlotsLoaded } = get();
    if (tutorSlotsLoaded) return;
    set({ tutorSlotsLoading: true });
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken;
      if (!session || !token) {
        set({ tutorSlotsLoading: false, tutorSlotsLoaded: true });
        return;
      }
      const response = await fetch(
        `${import.meta.env.VITE_API_GATEWAY_URL}/get-bookings`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        set({ tutorSlotsLoading: false, tutorSlotsLoaded: true });
        return;
      }
      const raw = await response.json();
      const mapped: SavedSlot[] = raw.map(
        ({ BookingId: id, TutorId: _t, createdAt: _c, ...rest }: Record<string, unknown>) => ({ id, ...rest } as SavedSlot),
      );
      set({ tutorSlots: mapped, tutorSlotsLoading: false, tutorSlotsLoaded: true });
      saveCachedData(mapped);
    } catch {
      set({ tutorSlotsLoading: false, tutorSlotsLoaded: true });
    }
  },
  applyTutorSlotChanges: (added, deletedIds) => {
    const { tutorSlots } = get();
    const newSlots: SavedSlot[] = added.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ source, ...rest }) => rest,
    );
    const remaining = tutorSlots.filter((s) => !deletedIds.includes(s.id));
    const updated = [...remaining, ...newSlots];
    set({ tutorSlots: updated });
    saveCachedData(updated);
  },
}));
