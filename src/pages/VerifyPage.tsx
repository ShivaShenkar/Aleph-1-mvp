import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./(auth)/verify/verify.module.scss";
import { handleConfirmSignUp } from "@/lib/cognitoActions";

export default function VerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("אימייל חסר. נסה שוב מההתחלה.");
      return;
    }

    setPending(true);
    const result = await handleConfirmSignUp(email, code);

    if (result.success) {
      setConfirmed(true);
    } else {
      setError(result.message);
      setPending(false);
    }
  }

  if (confirmed) {
    return (
      <div className={styles.confirmed}>
        <h2 className={styles.confirmedTitle}>החשבון אומת!</h2>
        <p className={styles.confirmedText}>
          תוכל כעת להתחבר לפלטפורמה.
        </p>
        <button
          className={styles.confirmedBtn}
          onClick={() => navigate("/login")}
        >
          עבור להתחברות
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1 className={styles.title}>אימות חשבון</h1>
      <p className={styles.subtitle}>
        הזן את קוד האימות שנשלח לכתובת
        <br />
        <strong>{email}</strong>
      </p>

      <div className={styles.field}>
        <label htmlFor="code">קוד אימות</label>
        <input
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="000000"
          required
          autoFocus
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button className={styles.submit} type="submit" disabled={pending || !code}>
        {pending ? "מאמת..." : "אמת"}
      </button>
    </form>
  );
}
