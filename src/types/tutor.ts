import type { LessonType } from "@/models/models";

export interface TutorProfile {
  userId: string;
  firstName: string;
  lastName: string;
  profilePic: string | null;
  bio: string | null;
  subjects: string[];
  lessonTypes: LessonType[];
  location: string | null;
  gender: "male" | "female" | null;
}
