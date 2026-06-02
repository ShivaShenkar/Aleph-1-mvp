import { useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./(auth)/layout.module.scss";
import {
  AuthRoleContext,
  AuthRoleSetterContext,
} from "@/lib/auth-context.ts";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const [role, setRole] = useState<"student" | "tutor">("student");
  const showToggle = location.pathname !== "/verify";

  return (
    <AuthRoleContext.Provider value={role}>
      <AuthRoleSetterContext.Provider value={setRole}>
        <div className={styles.page}>
          <div className={styles.card}>
            {showToggle && (
              <div className={styles.toggle}>
                <button
                  className={`${styles.toggleBtn} ${
                    role === "student" ? styles.active : ""
                  }`}
                  onClick={() => setRole("student")}
                >
                  תלמיד
                </button>
                <button
                  className={`${styles.toggleBtn} ${
                    role === "tutor" ? styles.active : ""
                  }`}
                  onClick={() => setRole("tutor")}
                >
                  מורה
                </button>
              </div>
            )}
            {children}
          </div>
        </div>
      </AuthRoleSetterContext.Provider>
    </AuthRoleContext.Provider>
  );
}
