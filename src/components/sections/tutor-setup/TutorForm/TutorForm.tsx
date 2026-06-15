import { useRef, useState } from "react";
import { Mars, Venus, LoaderCircle } from "lucide-react";
import { subjects } from "@/lib/subjects";
import { israeliCities } from "@/components/sections/tutor-setup/locations";
import { type LessonType } from "@/models/models";
import styles from "./TutorForm.module.scss";

interface TutorFormProps {
  title?: string;
  showGender?: boolean;
  profilePicRequired?: boolean;
  gender: "male" | "female" | null;
  onGenderChange: (g: "male" | "female") => void;
  profilePicPreview: string | null;
  onProfilePicChange: (file: File) => void;
  location: string;
  onLocationChange: (loc: string) => void;
  selectedSubjects: string[];
  onAddSubject: (slug: string) => void;
  onRemoveSubject: (slug: string) => void;
  bio: string;
  onBioChange: (text: string) => void;
  formErrors: Record<string, string>;
  lessonTypes: LessonType[];
  onAddLesson: () => void;
  onUpdateLesson: (id: string, field: keyof LessonType, value: string | number) => void;
  onRemoveLesson: (id: string) => void;
  onSubmit: () => void;
  submitting: boolean;
}

export default function TutorForm({
  title = "השלמת פרטי פרופיל",
  showGender = true,
  profilePicRequired = true,
  gender,
  onGenderChange,
  profilePicPreview,
  onProfilePicChange,
  location,
  onLocationChange,
  selectedSubjects,
  onAddSubject,
  onRemoveSubject,
  bio,
  onBioChange,
  formErrors,
  lessonTypes,
  onAddLesson,
  onUpdateLesson,
  onRemoveLesson,
  onSubmit,
  submitting,
}: TutorFormProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
  const availableSubjects = subjects.filter(
    (s) => !selectedSubjects.includes(s.slug)
  );

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onProfilePicChange(file);
  }

  function subjectColor(slug: string) {
    return subjects.find((s) => s.slug === slug)?.color || "#ccc";
  }

  function subjectName(slug: string) {
    return subjects.find((s) => s.slug === slug)?.name || slug;
  }

  return (
    <div className={styles.form}>
      <h1 className={styles.title}>{title}</h1>

      <div className={styles.fields}>
        {/* Gender */}
        {showGender && (
          <div className={styles.field}>
            <label className={styles.label}>מין *</label>
            <div className={styles.genderRow}>
              <button
                type="button"
                className={`${styles.genderCard} ${gender === "male" ? styles.genderActiveMale : ""}`}
                onClick={() => onGenderChange("male")}
              >
                <Mars size={40} />
                <span>זכר</span>
              </button>
              <button
                type="button"
                className={`${styles.genderCard} ${gender === "female" ? styles.genderActiveFemale : ""}`}
                onClick={() => onGenderChange("female")}
              >
                <Venus size={40} />
                <span>נקבה</span>
              </button>
            </div>
            {formErrors.gender && <span className={styles.fieldError}>{formErrors.gender}</span>}
          </div>
        )}

        {/* Profile Pic */}
        <div className={styles.field}>
          <label className={styles.label}>תמונת פרופיל{profilePicRequired ? '*' : ''}</label>
          <button
            type="button"
            className={styles.uploadBox}
            onClick={() => fileRef.current?.click()}
          >
            {profilePicPreview ? (
              <img src={profilePicPreview} alt="" className={styles.uploadPreview} />
            ) : (
              <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".jpg,.jpeg"
            onChange={handleFile}
            className={styles.hiddenInput}
          />
          {formErrors.profilePic && <span className={styles.fieldError}>{formErrors.profilePic}</span>}
        </div>

        {/* Location */}
        <div className={styles.field}>
          <label className={styles.label}>מיקום*</label>
          <div className={styles.selectWrapper}>
            <select
              className={styles.select}
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
            >
              <option value="">בחר עיר</option>
              {israeliCities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <svg className={styles.selectArrow} width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M7 10l5 5 5-5" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {formErrors.location && <span className={styles.fieldError}>{formErrors.location}</span>}
        </div>

        {/* Subjects */}
        <div className={styles.field}>
          <label className={styles.label}>מקצועות לימוד*</label>
          <div className={styles.selectWrapper}>
            <button
              type="button"
              className={styles.selectTrigger}
              onClick={() => setSubjectDropdownOpen(!subjectDropdownOpen)}
            >
              {selectedSubjects.length === 0
                ? "בחר מקצוע"
                : `נבחרו ${selectedSubjects.length} מקצועות`}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7 10l5 5 5-5" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {subjectDropdownOpen && (
              <div className={styles.dropdown}>
                {availableSubjects.length === 0 ? (
                  <div className={styles.dropdownEmpty}>כל המקצועות נבחרו</div>
                ) : (
                  availableSubjects.map((s) => (
                    <button
                      key={s.slug}
                      type="button"
                      className={styles.dropdownItem}
                      onClick={() => {
                        onAddSubject(s.slug);
                        setSubjectDropdownOpen(false);
                      }}
                    >
                      {s.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          {selectedSubjects.length > 0 && (
            <div className={styles.badges}>
              {selectedSubjects.map((slug) => (
                <span
                  key={slug}
                  className={styles.badge}
                  style={{ backgroundColor: subjectColor(slug) }}
                >
                  {subjectName(slug)}
                  <button
                    type="button"
                    className={styles.badgeRemove}
                    onClick={() => onRemoveSubject(slug)}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
          {formErrors.subjects && <span className={styles.fieldError}>{formErrors.subjects}</span>}
        </div>

        {/* Bio */}
        <div className={styles.field}>
          <label className={styles.label}>תיאור אישי *</label>
          <textarea
            className={styles.textarea}
            rows={5}
            placeholder="ספר על עצמך, הניסיון וההתמחויות שלך..."
            value={bio}
            onChange={(e) => onBioChange(e.target.value)}
          />
          {formErrors.bio && <span className={styles.fieldError}>{formErrors.bio}</span>}
        </div>

        {/* Add Lessons */}
        <div className={styles.field}>
          <label className={styles.lessonsLabel}>הוסף שיעורים</label>
          <div className={styles.lessonsArea}>
            {lessonTypes.length < 4 && (
              <button
                type="button"
                className={styles.addLessonBtn}
                onClick={onAddLesson}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#03045e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            )}
            {lessonTypes.map((lt) => (
              <div key={lt.LessonId} className={styles.lessonCard}>
                <button
                  type="button"
                  className={styles.lessonRemove}
                  onClick={() => onRemoveLesson(lt.LessonId)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f8f9fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
                <div className={styles.lessonField}>
                  <input
                    className={styles.lessonInput}
                    placeholder="שם השיעור"
                    value={lt.title}
                    onChange={(e) => onUpdateLesson(lt.LessonId, "title", e.target.value)}
                  />
                </div>
                <div className={styles.lessonRow}>
                  <span className={styles.lessonFieldLabel}>מס' משתתפים:</span>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    className={styles.lessonInputSmall}
                    value={lt.maxStudents || ""}
                    onChange={(e) => onUpdateLesson(lt.LessonId, "maxStudents", Number(e.target.value))}
                  />
                </div>
                <div className={styles.lessonRow}>
                  <span className={styles.lessonFieldLabel}>זמן השיעור:</span>
                  <select
                    className={styles.lessonSelect}
                    value={lt.durationMinutes}
                    onChange={(e) => onUpdateLesson(lt.LessonId, "durationMinutes", Number(e.target.value))}
                  >
                    {(() => {
                      const options: number[] = [];
                      for (let m = 30; m <= 180; m += 15) options.push(m);
                      return options;
                    })().map((m) => (
                      <option key={m} value={m}>
                        {m >= 60
                          ? `${Math.floor(m / 60)} שע'${m % 60 > 0 ? ` ${m % 60} דק'` : ""}`
                          : `${m} דק'`}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.lessonRow}>
                  <span className={styles.lessonFieldLabel}>מחיר:</span>
                  <input
                    type="number"
                    min={0}
                    className={styles.lessonInputSmall}
                    value={lt.price || ""}
                    onChange={(e) => onUpdateLesson(lt.LessonId, "price", Number(e.target.value))}
                  />
                  <span className={styles.lessonUnit}>₪</span>
                </div>
                <div className={styles.lessonRow}>
                  <span className={styles.lessonFieldLabel}>מיקום:</span>
                  <div className={styles.locationToggle}>
                    <button
                      type="button"
                      className={`${styles.locationBtn} ${lt.location === "online" ? styles.locationActive : ""}`}
                      onClick={() => onUpdateLesson(lt.LessonId, "location", "online")}
                    >
                      אונליין
                    </button>
                    <button
                      type="button"
                      className={`${styles.locationBtn} ${lt.location === "in-person" ? styles.locationActive : ""}`}
                      onClick={() => onUpdateLesson(lt.LessonId, "location", "in-person")}
                    >
                      פרונטלי
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {formErrors.lessonTypes && <span className={styles.fieldError}>{formErrors.lessonTypes}</span>}
        </div>

        {/* Submit */}
        <button type="button" className={styles.submitBtn} onClick={onSubmit} disabled={submitting}>
          {submitting ? <LoaderCircle size={24} className={styles.spinner} /> : "אישור"}
        </button>
      </div>
    </div>
  );
}
