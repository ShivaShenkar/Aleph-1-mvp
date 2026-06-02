"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./layout.module.scss";
import {
  AuthRoleContext,
  AuthRoleSetterContext,
} from "@/lib/auth-context";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [role, setRole] = useState<"student" | "tutor">("student");
  const showToggle = pathname !== "/verify";

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
