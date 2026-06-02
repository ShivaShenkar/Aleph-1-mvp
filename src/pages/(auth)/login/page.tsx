"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./login.module.scss";
import { signIn } from "@/lib/auth";
import { handleSignIn } from "@/lib/cognitoActions";
import { useAuthRole } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const role = useAuthRole() || "student";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setPending(true);

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    form.set("role", role); 
    const result = await handleSignIn(form);

    if (result.success) {
      router.push(`/${role}`);
    } else if (result.isVerified === false) {
      router.push(`/verify?email=${encodeURIComponent(email)}`);
    } else {
      setError(result.message || "שגיאה בהתחברות");
      setPending(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1 className={styles.title}>התחבר</h1>

      <div className={styles.field}>
        <label htmlFor="email">אימייל</label>
        <input id="email" name="email" type="email" required dir="rtl" />
      </div>

      <div className={styles.field}>
        <label htmlFor="password">סיסמה</label>
        <input id="password" name="password" type="password" required dir="rtl" />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button className={styles.submit} type="submit" disabled={pending}>
        {pending ? "מתחבר..." : "התחבר"}
      </button>

      <p className={styles.footer}>
        אין לך חשבון?{" "}
        <Link href="/signup" className={styles.link}>
          הירשם
        </Link>
      </p>
    </form>
  );
}
