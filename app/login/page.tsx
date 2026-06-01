"use client";

import {getCurrentUser} from "aws-amplify/auth";
import { useState, useEffect } from "react";
import { signIn } from "aws-amplify/auth"; // מייבא את פונקציית ההתחברות של אמזון
import { useRouter } from "next/navigation";

import '@/utils/amplifyConfig';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  useEffect(() => {
    // בדיקה האם יש משתמש שכבר מחובר במערכת
    getCurrentUser()
      .then(() => {
        // אם הצלחנו לקבל משתמש, נעביר אותו ישר לדשבורד
        router.push("/dashboard");
      })
      .catch(() => {
        // אם אין משתמש מחובר (נזרקת שגיאה ב-catch), נשארים בעמוד הלוגין כרגיל
      });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // קריאה לקוגניטו לביצוע התחברות
      const { isSignedIn, nextStep } = await signIn({
        username: email, // קוגניטו דורש את המייל תחת השדה 'username' אם הגדרת זיהוי לפי מייל
        password: password,
      });

      if (isSignedIn) {
        console.log("התחברת בהצלחה!");
        router.push("/dashboard"); // העבר את המשתמש חזרה לעמוד הבית (או לעמוד פרופיל/דשבורד)
      }
    } catch (err: any) {
      console.error("שגיאת התחברות:", err);
      // תרגום שגיאות נפוצות לעברית למשתמש
      if (err.name === 'UserNotConfirmedException') {
        setError("החשבון טרם אומת. יש לבדוק את תיבת המייל ולוודא הרשמה.");
      } else if (err.name === 'NotAuthorizedException') {
        setError("אימייל או סיסמה שגויים.");
      } else {
        setError(err.message || "אירעה שגיאה בתהליך ההתחברות.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>התחברות ל-Aleph1</h2>
        
        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="email">אימייל:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password">סיסמה:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={styles.input}
            />
          </div>
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "מתחבר..." : "התחבר"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f5f5f5", direction: "rtl" as const },
  card: { padding: "30px", borderRadius: "8px", backgroundColor: "#fff", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", width: "350px" },
  title: { textAlign: "center" as const, marginBottom: "20px", color: "#333" },
  form: { display: "flex", flexDirection: "column" as const, gap: "15px" },
  inputGroup: { display: "flex", flexDirection: "column" as const, gap: "5px" },
  input: { padding: "10px", borderRadius: "4px", border: "1px solid #ccc", width: "100%" },
  button: { padding: "10px", backgroundColor: "#0070f3", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" as const, opacity: 1 }
};