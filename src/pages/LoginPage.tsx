import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchAuthSession } from "aws-amplify/auth";
import styles from "@/styles/login.module.scss";
import { handleSignIn } from "@/lib/cognitoActions";
import { useAuthRole } from "@/lib/auth-context";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const role = useAuthRole() || "student";

  useEffect(() => {
    (async () => {
      try {
        await fetchAuthSession();
        const [status] = await useAuthStore.getState().fetchUser();
        if (status === 200) {
          const user = useAuthStore.getState().user;
          const targetRole = user?.roles.includes("tutor") ? "tutor" : "student";
          navigate(`/${targetRole}`, { replace: true });
          return;
        }
      } catch {
        /* no valid session — show form */
      }
      setCheckingSession(false);
    })();
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setPending(true);

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    form.set("role", role); 
    const result = await handleSignIn(form);

    if (result.success) {
      const [status,message] = await useAuthStore.getState().fetchUser();
      if (status!=200) {
        result.success=false;
        result.message=message;
      }
      else{
        navigate(`/${role}`);
      }
    } else if (result.isVerified === false) {
      navigate(`/verify?email=${encodeURIComponent(email)}`);
    } if(!result.success) {
      setError(result.message || "שגיאה בהתחברות");
      setPending(false);
    }
  }

  if (checkingSession) {
    return <div className={styles.loading}>טוען...</div>;
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
        <Link to="/signup" className={styles.link}>
          הירשם
        </Link>
      </p>
    </form>
  );
}
