"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./verify.module.scss";
import { confirmSignUp } from "@/lib/services/auth";

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
    const result = await confirmSignUp(email, code);

    if (result.success) {
      setConfirmed(true);
    } else {
      setError(result.error);
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
          onClick={() => router.push("/login")}
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

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyForm />
    </Suspense>
  );
}
