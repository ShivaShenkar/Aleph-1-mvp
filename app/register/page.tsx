"use client";

import NextLink from "next/link";

export default function RegisterSelectorPage() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>הירשם ל-Aleph1</h2>
        <p style={{ textAlign: "center", marginBottom: "20px" }}>בחר כיצד ברצונך להירשם:</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <NextLink href="/register/student" style={styles.linkButton}>הירשם כתלמיד</NextLink>
          <NextLink href="/register/tutor" style={styles.linkButton}>הירשם כמורה</NextLink>
        </div>

        <div style={styles.footerLink}>
          <p>כבר יש לך חשבון? <NextLink href="/login" style={{ color: "#0070f3" }}>התחבר כאן</NextLink></p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f5f5f5", direction: "rtl" as const },
  card: { padding: "30px", borderRadius: "8px", backgroundColor: "#fff", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", width: "380px" },
  title: { textAlign: "center" as const, marginBottom: "10px", color: "#333" },
  linkButton: { display: "inline-block", padding: "12px 16px", textAlign: "center" as const, backgroundColor: "#0070f3", color: "#fff", borderRadius: "6px", textDecoration: "none", fontWeight: "600" },
  footerLink: { marginTop: "20px", textAlign: "center" as const, fontSize: "14px", color: "#555" }
};