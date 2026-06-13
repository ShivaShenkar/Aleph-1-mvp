import type { Booking } from "@/models/models";
import type { DayGroup } from "@/store/bookingStore";
import { useBookingStore } from "@/store/bookingStore";

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
  // TODO: Replace with actual AWS API Gateway call
  // const response = await fetch('/api/student/slots');
  // const bookings: Booking[] = await response.json();

  const bookings: Booking[] = [];

  const groups = groupByNearestDays(bookings);
  useBookingStore.getState().setUpcomingLessons(groups);
}

export async function fetchAllLessons() {
  // TODO: Replace with actual AWS API Gateway call
  // const response = await fetch('/api/student/lessons');
  // const bookings: Booking[] = await response.json();

  const bookings: Booking[] = [];

  if (bookings.length === 0) return;

  const sorted = [...bookings].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  const now = new Date();
  let splitIdx = -1;
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (new Date(sorted[i].startTime) <= now) {
      splitIdx = i;
      break;
    }
  }

  const center = splitIdx === -1 ? 0 : splitIdx;
  const PAGE_SIZE = 10;
  const pages: Booking[][] = [];

  const centerStart = Math.max(0, center - 5);
  pages.push(sorted.slice(centerStart, centerStart + PAGE_SIZE));

  let pastIdx = centerStart - PAGE_SIZE;
  while (pastIdx >= 0) {
    pages.unshift(sorted.slice(pastIdx, pastIdx + PAGE_SIZE));
    pastIdx -= PAGE_SIZE;
  }

  let futureIdx = centerStart + PAGE_SIZE;
  while (futureIdx < sorted.length) {
    pages.push(sorted.slice(futureIdx, futureIdx + PAGE_SIZE));
    futureIdx += PAGE_SIZE;
  }

  const store = useBookingStore.getState();
  pages.forEach((page, index) => {
    store.setLessonList(page, index);
  });
}
