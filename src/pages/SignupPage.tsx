import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import styles from "@/styles/signup.module.scss";
import { useAuthRole } from "@/lib/auth-context";
import { handleSignUp } from "@/lib/cognitoActions";

function getAge(birthdate: string): number {
  const today = new Date();
  const birth = new Date(birthdate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

const MIN_AGE: Record<string, number> = {
  tutor: 17,
  student: 13,
};

const PASSWORD_RULES = [
  { test: (p: string) => p.length >= 8, label: "לפחות 8 תווים" },
  { test: (p: string) => /[A-Z]/.test(p), label: "אות גדולה אחת" },
  { test: (p: string) => /[a-z]/.test(p), label: "אות קטנה אחת" },
  { test: (p: string) => /[0-9]/.test(p), label: "ספרה אחת" },
  { test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p), label: "תו מיוחד אחד" },
];

export default function SignupPage() {
  const navigate = useNavigate();
  const role = useAuthRole();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const passwordValid = PASSWORD_RULES.every((r) => r.test(password));
  const passwordsMatch = password === confirm;
  const canSubmit = passwordValid && passwordsMatch && !pending;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);
    const birthdate = form.get("birthdate") as string;
    const age = getAge(birthdate);
    const minAge = MIN_AGE[role];

    if (age < minAge) {
      const label = role === "tutor" ? "מורה" : "תלמיד";
      setError(`עליך להיות בן ${minAge} לפחות כדי להירשם כ${label}`);
      return;
    }

    setPending(true);
    form.set("role", role);
    const result = await handleSignUp(form);

    if (result.success) {
      navigate(`/verify?email=${encodeURIComponent(form.get("email") as string)}`);
    } else {
      setError(result.message);
      setPending(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1 className={styles.title}>הירשם</h1>

      <div className={styles.nameRow}>
        <div className={styles.field}>
          <label htmlFor="firstName">שם פרטי</label>
          <input id="firstName" name="firstName" type="text" required />
        </div>
        <div className={styles.field}>
          <label htmlFor="lastName">שם משפחה</label>
          <input id="lastName" name="lastName" type="text" required />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="email">אימייל</label>
        <input id="email" name="email" type="email" required />
      </div>

      <div className={styles.field}>
        <label htmlFor="birthdate">תאריך לידה</label>
        <input id="birthdate" name="birthdate" type="date" required />
      </div>

      <div className={styles.field}>
        <label htmlFor="password">סיסמה</label>
        <div className={styles.passwordWrapper}>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className={styles.eyeBtn}
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <ul className={styles.checklist}>
          {PASSWORD_RULES.map((rule, i) => {
            const passed = rule.test(password);
            return (
              <li key={i} className={`${styles.checkItem} ${passed ? styles.valid : styles.invalid}`}>
                {passed ? "✓" : "✗"} {rule.label}
              </li>
            );
          })}
        </ul>
      </div>

      <div className={styles.field}>
        <label htmlFor="confirm">אימות סיסמה</label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          required
          minLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button className={styles.submit} type="submit" disabled={!canSubmit}>
        {pending ? "נרשם..." : "הירשם"}
      </button>
    </form>
  );
}
