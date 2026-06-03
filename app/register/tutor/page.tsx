"use client";

import { useState } from "react";
import { signUp } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import NextLink from "next/link";

import '@/utils/amplifyConfig'; // וודא שההגדרות של אמזון נטענות לפני השימוש בפונקציות Auth

export default function TutorRegisterPage() {
  const missingConfig = !process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || !process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;

  if (missingConfig) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>הגדרות מערכת חסרות</h2>
          <p style={{ color: "red", textAlign: "center" }}>Auth UserPool not configured. יש להגדיר את משתני הסביבה `NEXT_PUBLIC_COGNITO_USER_POOL_ID` ו-`NEXT_PUBLIC_COGNITO_CLIENT_ID` בקובץ <strong>.env.local</strong> ואז להפעיל מחדש את השרת.</p>
          <div style={styles.footerLink}>
            <p><NextLink href="/register">חזור לבחירה</NextLink></p>
          </div>
        </div>
      </div>
    );
  }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("הסיסמאות אינן תואמות.");
      return;
    }

    // validate birthdate and age >= 17
    if (!birthdate) {
      setError("יש להזין תאריך לידה.");
      return;
    }

    const birth = new Date(birthdate);
    if (isNaN(birth.getTime())) {
      setError("תאריך לידה לא תקין.");
      return;
    }

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    if (age < 17) {
      setError("הרשמה בתור מורה הינה מגיל 17 בלבד.");
      return;
    }

    setLoading(true);

    try {
      const role = "tutor";
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: email,
        password: password,
        options: {
          userAttributes: {
            email: email,
            birthdate: birthdate,
            "custom:role": role,
          },
        },
      });

      console.log("הרשמה כמורה הצליחה:", userId);
      setSuccess(true);

      const displayName = email.split("@")[0]; // שימוש בחלק הראשון של האימייל כ-display name

      try{
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            email,
            name: displayName,
            role,
          }),
        });

        if (!response.ok) {
            console.error("Error saving user to DynamoDB:");
            }
            else{
            console.log("User saved to DynamoDB successfully");
            }
    }catch (dbErr) {
            console.error("Error saving user to DynamoDB:", dbErr);
        }

      
      if (nextStep?.signUpStep === "CONFIRM_SIGN_UP") {

        alert("You have been signed up. Please check your email for a verification code");
        // העברה לעמוד האימות החדש יחד עם המייל של המשתמש ב-URL
        router.push(`/confirm-signup?email=${encodeURIComponent(email)}`);
        
      }

    } catch (err: any) {
      console.error("שגיאת הרשמה:", err);
      if (err.name === "UsernameExistsException") {
        setError("משתמש עם אימייל זה כבר קיים במערכת.");
      } else if (err.name === "InvalidPasswordException") {
        setError(formatPasswordError(err.message));
      } else {
        setError(err.message || "אירעה שגיאה בתהליך ההרשמה.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>הרשמה כמורה</h2>

        {error && <p style={{ color: "red", textAlign: "center", marginBottom: "15px" }}>{error}</p>}
        {success && <p style={{ color: "green", textAlign: "center", marginBottom: "15px" }}>ההרשמה בוצעה בהצלחה! בדוק את המייל לקוד אימות.</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="email">אימייל:</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading || success} style={styles.input} />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="birthdate">תאריך לידה:</label>
            <input type="date" id="birthdate" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} required disabled={loading || success} style={styles.input} />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password">סיסמה:</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading || success} style={styles.input} />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="confirmPassword">אימות סיסמה:</label>
            <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={loading || success} style={styles.input} />
          </div>

          <button type="submit" disabled={loading || success} style={styles.button}>{loading ? "מבצע הרשמה..." : "הרשם כמורה"}</button>
        </form>

        <div style={styles.footerLink}>
          <p><NextLink href="/register">חזור לבחירה</NextLink></p>
        </div>
      </div>
    </div>
  );
}

function formatPasswordError(message: string) {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("length")) {
    return "הסיסמה אינה עומדת בדרישות האבטחה: היא קצרה מדי. יש לבחור סיסמה ארוכה יותר.";
  }

  if (normalizedMessage.includes("uppercase")) {
    return "הסיסמה אינה עומדת בדרישות האבטחה: יש לכלול לפחות אות גדולה אחת.";
  }

  if (normalizedMessage.includes("lowercase")) {
    return "הסיסמה אינה עומדת בדרישות האבטחה: יש לכלול לפחות אות קטנה אחת.";
  }

  if (normalizedMessage.includes("number") || normalizedMessage.includes("digit")) {
    return "הסיסמה אינה עומדת בדרישות האבטחה: יש לכלול לפחות מספר אחד.";
  }

  if (normalizedMessage.includes("symbol") || normalizedMessage.includes("special")) {
    return "הסיסמה אינה עומדת בדרישות האבטחה: יש לכלול לפחות תו מיוחד אחד.";
  }

  return `הסיסמה אינה עומדת בדרישות האבטחה: ${message}`;
}

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f5f5f5", direction: "rtl" as const },
  card: { padding: "30px", borderRadius: "8px", backgroundColor: "#fff", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", width: "380px" },
  title: { textAlign: "center" as const, marginBottom: "20px", color: "#333" },
  form: { display: "flex", flexDirection: "column" as const, gap: "15px" },
  inputGroup: { display: "flex", flexDirection: "column" as const, gap: "5px" },
  input: { padding: "10px", borderRadius: "4px", border: "1px solid #ccc", width: "100%" },
  button: { padding: "10px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" as const },
  footerLink: { marginTop: "20px", textAlign: "center" as const, fontSize: "14px", color: "#555" }
};
