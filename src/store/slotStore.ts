import { create } from "zustand";
import type { Booking } from "@/models/models";

export interface DayGroup {
  date: Date;
  bookings: Booking[];
}

interface BookingStore {
  upcomingLessons: DayGroup[];
  setUpcomingLessons: (days: DayGroup[]) => void;
  allLessonsMat: Booking[][];
  setLessonList: (bookings: Booking[], index: number) => void;
}

export const useBookingStore = create<BookingStore>((set,get) => ({
  upcomingLessons: [],
  setUpcomingLessons: (groups) => set({ upcomingLessons: groups }),
  allLessonsMat: [],
  setLessonList: (bookings, index) => {
    const newMat = [...get().allLessonsMat];
    newMat[index] = bookings;
    set({ allLessonsMat: newMat });
  },
}));
