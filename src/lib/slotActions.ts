import type { Booking } from "@/models/models";
import type { DayGroup } from "@/store/slotStore";
import { useSlotStore } from "@/store/slotStore";
import { useAuthStore } from "@/store/authStore";

function groupByNearestDays(bookings: Booking[]): DayGroup[] {
  const sorted = [...bookings].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  const groups: DayGroup[] = [];
  const seen = new Set<string>();

  for (const booking of sorted) {
    const d = new Date(booking.startTime);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!seen.has(key)) {
      seen.add(key);
      groups.push({ date: d, bookings: [] });
    }
    groups[groups.length - 1].bookings.push(booking);
    if (groups.length === 3) break;
  }

  return groups;
}

export async function homePageLoad() {
  // Fetch user data
   await useAuthStore.getState().fetchUser();

  // TODO: Replace with actual AWS API Gateway call
  // const response = await fetch('/api/student/slots');
  // const bookings: Booking[] = await response.json();

  const bookings: Booking[] = [];

  const groups = groupByNearestDays(bookings);
  useSlotStore.getState().setUpcomingLessons(groups);
}

export async function fetchAllLessons() {
  // TODO: Replace with actual AWS API Gateway call
  // const response = await fetch('/api/student/lessons');
  // const bookings: Booking[] = await response.json();

  const bookings: Booking[] = [];

  useSlotStore.getState().setAllBookings(bookings);
}
