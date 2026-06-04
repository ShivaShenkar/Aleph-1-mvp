"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation"; // <-- הוספנו את usePathname
// 1. הוספנו כאן את getCurrentUser 👇
import { fetchUserAttributes, signOut, getCurrentUser } from "aws-amplify/auth";

import styles from "./NavBar.module.scss";
import Link from "@/components/ui/Link/Link";
import Button from "@/components/ui/Button/Button";
import '@/utils/amplifyConfig';


export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname(); // <-- כאן אנחנו מקבלים את הנתיב הנוכחי כדי לדעת באיזה עמוד אנחנו נמצאים
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // בדיקה אם יש משתמש מחובר כדי להציג את האייקון
  useEffect(() => {
    fetchUserAttributes()
      .then((attributes) => {
        if(attributes.email) {
          setUserEmail(attributes.email);
          return;
        }
        setUserEmail(attributes.username || "משתמש מחובר");
      })
      .catch(() => {
        console.log("אין משתמש מחובר");
        setUserEmail(null);
      });
  }, []);

  // פונקציית התנתקות
  const handleSignOut = async () => {
    try {
      await signOut();
      setUserEmail(null);
      setIsMenuOpen(false);
      window.location.href = "/login";
      router.push("/login");
    } catch (error) {
      console.error("שגיאה בתהליך ההתנתקות:", error);
    }
  };

  // 🔥 2. הפונקציה החדשה לניתוב חכם בלחיצה על "כניסה למערכת"
  const handleDashboardRedirect = async () => {
    try {
      const cognitoUser = await getCurrentUser();
      if (cognitoUser) {
        const response = await fetch(`/api/user/profile?userId=${cognitoUser.userId}`);
        if (response.ok) {
          const profile = await response.json();
          // ניתוב מורה לדשבורד מורים, וסטודנט לדשבורד סטודנטים
          if (profile.role === "tutor") {
            router.push("/dashboard/tutor");
          } else {
            router.push("/dashboard");
          }
        } else {
          router.push("/dashboard"); // גיבוי
        }
      }
    } catch (err) {
      // אם הוא לא מחובר בכלל, נשלח אותו להתחבר
      router.push("/login");
    }
  };

  return (
    <nav className={styles.nav} style={localStyles.navDirection}>
      <div className={styles.inner}>
        
        {/* חלק ימני: לוגו, אייקון פרופיל וקישורים */}
        <div className={styles.logoAndLinks} style={localStyles.rightArea}>
          
          {/* 1. לוגו א1 */}
          <div className={styles.logo}>
            <NextLink href="/">
              <Image
                src="/svg/Aleph1-tiny-logo.svg"
                alt="אלף1"
                width={45}
                height={43}
              />
            </NextLink>
          </div>

          {/* 2. רכיב פרופיל - מופיע רק אם המשתמש מחובר */}
          {userEmail && (
            <div style={localStyles.profileContainer}>
              <div 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                style={localStyles.avatar}
                title="פרופיל משתמש"
              >
                👤
              </div>

              {/* החלונית הקטנה עם הפרטים (Dropdown) */}
              {isMenuOpen && (
                <div style={localStyles.dropdown}>
                  <div style={localStyles.dropdownHeader}>
                    <span style={localStyles.emailLabel}>מחובר כעת:</span>
                    <span style={localStyles.emailText}>{userEmail}</span>
                  </div>
                  <hr style={localStyles.divider} />
                  
                  {/* 🔥 הוספנו פה כפתור מהיר בתוך התפריט של הפרופיל שיוביל לדשבורד הנכון */}
                  <button onClick={handleDashboardRedirect} style={localStyles.dashboardMenuButton}>
                    🖥️ אזור אישי (דשבורד)
                  </button>

                  <hr style={localStyles.divider} />
                  <button onClick={handleSignOut} style={localStyles.logoutButton}>
                    התנתק 🚪
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 3. קישורי הניווט הרגילים */}
          <div className={styles.links}>
            <Link href="/about" text="אודות" />
            <Link href="/subjects" text="נושאי לימוד" /> 
            <Link href="/become-tutor" text="הפוך למורה" />   
          </div>
        </div>

        {/* חלק שמאלי: כפתורי התחברות/הרשמה או כפתור כניסה דינמי */}
        <div className={styles.buttons}>
          {userEmail ? (
            // הוספנו תנאי: הכפתור יוצג רק אם אנחנו *לא* בתוך עמודי ה-dashboard
            !pathname.startsWith("/dashboard") ? (
              <button onClick={handleDashboardRedirect} style={localStyles.navLoginButton}>
                🚪 כניסה למערכת
              </button>
            ) : null // אם אנחנו בדשבורד, לא יורנדר כלום כאן (הכפתור ייעלם)
          ) : (
            // אם הוא לא מחובר, נציג את כפתורי ברירת המחדל שלך
            <>
              <NextLink href="/login" passHref style={{ textDecoration: "none" }}>
                <Button variant="secondary" text="התחברות" />
              </NextLink>

              <NextLink href="/register" passHref style={{ textDecoration: "none" }}>
                <Button variant="primary" text="התחל עכשיו" />
              </NextLink>
            </>
          )}

        </div>

      </div>
    </nav>
  );
}

// עיצובים מקומיים - הוספתי פה את הסטייל לכפתורים החדשים שתואם לעיצוב שלך
const localStyles = {
  navDirection: {
    direction: "rtl" as const,
  },
  rightArea: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  profileContainer: {
    position: "relative" as const,
    display: "inline-block",
  },
  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    backgroundColor: "#4A90E2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    cursor: "pointer",
    userSelect: "none" as const,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  dropdown: {
    position: "absolute" as const,
    top: "48px",
    right: "0",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    borderRadius: "8px",
    padding: "15px",
    width: "220px",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    border: "1px solid #eee",
  },
  dropdownHeader: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "2px",
  },
  emailLabel: {
    fontSize: "12px",
    color: "#666",
  },
  emailText: {
    fontSize: "13px",
    fontWeight: "bold" as const,
    color: "#333",
    wordBreak: "break-all" as const,
  },
  dashboardMenuButton: {
    backgroundColor: "#1D2D50",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "8px",
    fontSize: "13px",
    fontWeight: "bold" as const,
    cursor: "pointer",
    textAlign: "center" as const,
  },
  navLoginButton: {
    padding: "10px 20px",
    backgroundColor: "#1D2D50",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold" as const,
    cursor: "pointer",
    fontSize: "14px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  divider: {
    border: "0",
    borderTop: "1px solid #eee",
    margin: "5px 0",
  },
  logoutButton: {
    backgroundColor: "#FF4D4D",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "8px",
    fontSize: "14px",
    fontWeight: "bold" as const,
    cursor: "pointer",
    transition: "background-color 0.2s",
    textAlign: "center" as const,
  },
};