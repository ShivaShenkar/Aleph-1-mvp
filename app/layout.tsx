import type { Metadata } from "next";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  title: "אלף1 - פלטפורמת שיעורים פרטיים",
  description: "פלטפורמת שיעורים פרטיים - מצא מורים, קבע שיעורים ולמד",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">  
      <body>{children}</body>
    </html>
  );
}
