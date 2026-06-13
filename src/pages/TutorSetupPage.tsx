import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import TutorForm from "@/components/sections/tutor-setup/TutorForm/TutorForm";
import TutorPreview from "@/components/sections/tutor-setup/TutorPreview/TutorPreview";
import styles from "./TutorSetupPage.module.scss";
import { fetchAuthSession } from "aws-amplify/auth";
import { type LessonType } from "@/models/models";

export default function TutorSetupPage() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.user);

  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [lessonTypes, setLessonTypes] = useState<LessonType[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
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
      if (!profilePic) errs.profilePic = "נא להעלות תמונת פרופיל";
      if (!gender) errs.gender = "נא לבחור מין";
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
    if (!validate()||!profilePic) return setSubmitting(false);

    const session = await fetchAuthSession();
    const sub = session.tokens?.idToken?.payload?.sub;
    const profilePicPath = sub ? `/profiles/${sub}.jpg` : "";

    async function uploadToCloud(): Promise<boolean> {
      try { 
        
        const token = session.tokens?.idToken;
        
        if (!token || !sub||!profilePic) return false;

        const photoResponse = await fetch(`${import.meta.env.VITE_API_GATEWAY_URL}/upload-tutor-photo`,
        {
          method:"POST",
          headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": profilePic.type
          },  
          body: profilePic
        });
        if(!photoResponse.ok)
          return false;
        
        const payload = {
          gender,
          location,
          subjects: selectedSubjects,
          bio,
          lessonTypes,
          profilePicPath
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
      } 
      catch (error) {
        console.error("Upload failed:", error);
        return false;
      }
    }

    setSubmitting(false);
    const success = await uploadToCloud();
    if (success) {
      setFormErrors({});
      

      useAuthStore.getState().updateUserSetupData({
        isSetupComplete: true,
        profilePic: profilePicPath,
        location,
        gender: gender!,
        subjects: selectedSubjects,
        bio,
      });
      navigate("/tutor");
    } else {
      alert("העלאה נכשלה, אנא נסה שנית");
    }
  }, [gender, location, selectedSubjects, bio, lessonTypes, profilePic, navigate]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.formPanel}>
          <TutorForm
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
