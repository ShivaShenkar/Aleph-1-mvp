"use client";

import { useState, useEffect, Suspense } from "react";
import { confirmSignUp } from "aws-amplify/auth"; // ייבוא הפונקציה מאמזון
import { useRouter, useSearchParams } from "next/navigation";
import '@/utils/amplifyConfig'; // טעינת הגדרות קוגניטו

function ConfirmSignUpContent() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // שליפת האימייל מתוך ה-URL כדי שהמשתמש לא יצטרך להקליד אותו שוב
  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // הקוד שלך מיושם כאן:
      await confirmSignUp({
        username: email,
        confirmationCode: code,
      });

      alert("החשבון אומת בהצלחה! כעת ניתן להתחבר.");
      router.push("/login"); // העברה אוטומטית לעמוד ההתחברות
    } catch (err: any) {
      console.error("שגיאה באימות הקוד:", err);
      if (err.name === "CodeMismatchException") {
        setError("קוד האימות שגוי, אנא נסה שנית.");
      } else if (err.name === "ExpiredCodeException") {
        setError("פג תוקפו של הקוד. יש לבקש קוד חדש.");
      } else {
        setError(err.message || "אירעה שגיאה בזמן אימות החשבון.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>אימות חשבון</h2>
        <p style={styles.subtitle}>הזן את קוד האימות בן 6 הספרות שנשלח לכתובת: <br /><strong>{email}</strong></p>

        {error && <p style={{ color: "red", textAlign: "center", marginBottom: "15px" }}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* שדה אימייל נסתר או גלוי לקריאה בלבד, כדי שקוגניטו יידע למי לאמת */}
          <div style={styles.inputGroup}>
            <label htmlFor="email">אימייל:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading || !!searchParams.get("email")}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="code">קוד אימות:</label>
            <input
              type="text"
              id="code"
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              disabled={loading}
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "מאמת..." : "אשר חשבון"}
          </button>
        </form>
      </div>
    </div>
  );
}

// מעטפת Suspense חובה ב-Next.js כשמשתמשים ב-useSearchParams בעמודי Client
export default function ConfirmSignUpPage() {
  return (
    <Suspense fallback={<div>טוען...</div>}>
      <ConfirmSignUpContent />
    </Suspense>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f5f5f5", direction: "rtl" as const },
  card: { padding: "30px", borderRadius: "8px", backgroundColor: "#fff", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", width: "350px" },
  title: { textAlign: "center" as const, marginBottom: "10px", color: "#333" },
  subtitle: { textAlign: "center" as const, fontSize: "14px", color: "#666", marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column" as const, gap: "15px" },
  inputGroup: { display: "flex", flexDirection: "column" as const, gap: "5px" },
  input: { padding: "10px", borderRadius: "4px", border: "1px solid #ccc", width: "100%", textAlign: "center" as const },
  button: { padding: "10px", backgroundColor: "#0070f3", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" as const }
};