import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { fetchAuthSession } from "aws-amplify/auth";
import { getUrl } from "aws-amplify/storage";
import TutorForm from "@/components/sections/tutor-setup/TutorForm/TutorForm";
import TutorPreview from "@/components/sections/tutor-setup/TutorPreview/TutorPreview";
import { type LessonType } from "@/models/models";
import styles from "./TutorProfileEditPage.module.scss";

export default function TutorProfileEditPage() {
  const currentUser = useAuthStore((s) => s.user);

  const [gender, setGender] = useState<"male" | "female" | null>(currentUser?.gender as "male" | "female" | null ?? null);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const [location, setLocation] = useState(currentUser?.location ?? "");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(currentUser?.subjects ?? []);
  const [bio, setBio] = useState(currentUser?.bio ?? "");
  const [lessonTypes, setLessonTypes] = useState<LessonType[]>(currentUser?.lessonTypes ?? []);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser?.profilePic) return;
    const key = currentUser.profilePic.startsWith("/")
      ? currentUser.profilePic.slice(1)
      : currentUser.profilePic;
    getUrl({ key, options: { accessLevel: "protected" } })
      .then((result) => setProfilePicPreview(result.url.toString()))
      .catch(() => {});
  }, [currentUser?.profilePic]);

  const handleProfilePic = useCallback((file: File) => {
    setProfilePic(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleAddSubject = useCallback((slug: string) => {
    setSelectedSubjects((prev) => {
      if (prev.includes(slug) || prev.length >= 4) return prev;
      return [...prev, slug];
    });
  }, []);

  const handleRemoveSubject = useCallback((slug: string) => {
    setSelectedSubjects((prev) => prev.filter((s) => s !== slug));
  }, []);

  const handleAddLesson = useCallback(() => {
    setLessonTypes((prev) => {
      if (prev.length >= 4) return prev;
      const newLesson: LessonType = {
        LessonId: crypto.randomUUID(),
        tutorId: String(currentUser?.userId),
        title: "",
        maxStudents: 1,
        durationMinutes: 60,
        price: 0,
        location: "online",
      };
      return [...prev, newLesson];
    });
  }, [currentUser]);

  const handleUpdateLesson = useCallback(
    (id: string, field: keyof LessonType, value: string | number) => {
      setLessonTypes((prev) =>
        prev.map((lt) => {
          if (lt.LessonId !== id) return lt;
          const clamped = field === "maxStudents"
            ? Math.min(Math.max(1, value as number), 10)
            : value;
          return { ...lt, [field]: clamped };
        })
      );
    },
    []
  );

  const handleRemoveLesson = useCallback((id: string) => {
    setLessonTypes((prev) => prev.filter((lt) => lt.LessonId !== id));
  }, []);

  const handleSubmit = useCallback(async () => {
    function validate(): boolean {
      const errs: Record<string, string> = {};
      if (!location) errs.location = "נא לבחור מיקום";
      if (selectedSubjects.length === 0) errs.subjects = "נא לבחור לפחות מקצוע אחד";
      if (bio.trim().length < 20) errs.bio = "התיאור חייב להכיל לפחות 20 תווים";
      if (lessonTypes.length === 0) {
        errs.lessonTypes = "נא להוסיף לפחות סוג שיעור אחד";
      } else if (lessonTypes.some((lt) => !lt.title.trim())) {
        errs.lessonTypes = "יש למלא שם לכל סוג שיעור";
      }
      setFormErrors(errs);
      return Object.keys(errs).length === 0;
    }

    setSubmitting(true);
    if (!validate()) return setSubmitting(false);

    const session = await fetchAuthSession();
    const sub = session.tokens?.idToken?.payload?.sub;
    const existingPic = profilePic ? `/profiles/${sub}.jpg` : (currentUser?.profilePic ?? "");

    async function uploadToCloud(): Promise<boolean> {
      try {
        const token = session.tokens?.idToken;
        if (!token || !sub) return false;

        if (profilePic) {
          const photoResponse = await fetch(`${import.meta.env.VITE_API_GATEWAY_URL}/upload-tutor-photo`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": profilePic.type,
            },
            body: profilePic,
          });
          if (!photoResponse.ok) return false;
        }

        const payload = {
          gender,
          location,
          subjects: selectedSubjects,
          bio,
          lessonTypes,
          profilePicPath: existingPic,
        };

        const response = await fetch(
          `${import.meta.env.VITE_API_GATEWAY_URL}/tutor-setup`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        return response.ok;
      } catch (error) {
        console.error("Upload failed:", error);
        return false;
      }
    }

    const success = await uploadToCloud();
    setSubmitting(false);
    if (success) {
      setFormErrors({});
      setSuccessMessage("הפרופיל עודכן בהצלחה");
      useAuthStore.getState().updateUserSetupData({
        isSetupComplete: true,
        profilePic: existingPic,
        location,
        gender: (currentUser?.gender as "male" | "female") ?? "male",
        subjects: selectedSubjects,
        bio,
      });
    } else {
      alert("העלאה נכשלה, אנא נסה שנית");
    }
  }, [gender, location, selectedSubjects, bio, lessonTypes, profilePic, currentUser]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.formPanel}>
          {successMessage && (
            <div className={styles.successBanner}>{successMessage}</div>
          )}
          <TutorForm
            title="עריכת פרטי פרופיל"
            showGender={false}
            profilePicRequired={false}
            gender={gender}
            onGenderChange={setGender}
            profilePicPreview={profilePicPreview}
            onProfilePicChange={handleProfilePic}
            location={location}
            onLocationChange={setLocation}
            selectedSubjects={selectedSubjects}
            onAddSubject={handleAddSubject}
            onRemoveSubject={handleRemoveSubject}
            bio={bio}
            onBioChange={setBio}
            formErrors={formErrors}
            lessonTypes={lessonTypes}
            onAddLesson={handleAddLesson}
            onUpdateLesson={handleUpdateLesson}
            onRemoveLesson={handleRemoveLesson}
            submitting={submitting}
            onSubmit={handleSubmit}
          />
        </div>
        <div className={styles.previewPanel}>
          <TutorPreview
            gender={gender}
            profilePicPreview={profilePicPreview}
            location={location}
            selectedSubjects={selectedSubjects}
            bio={bio}
            lessonTypes={lessonTypes}
          />
        </div>
      </div>
    </div>
  );
}
