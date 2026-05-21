import Image from "next/image";
import styles from "./Footer.module.scss";

const navColumns = [
  [
    { text: "אודות", href: "/about" },
    { text: "הפוך למורה", href: "/become-tutor" },
    { text: "נושאי לימוד", href: "/subjects" },
  ],
  [
    { text: "חפש שיעורים", href: "/search" },
    { text: "כניסה למערכת", href: "/login" },
    { text: "צור קשר", href: "/contact" },
  ],
  [
    { text: "מורים למתמטיקה", href: "/search" },
    { text: "מורים לאנגלית", href: "/search" },
    { text: "מורים להיסטוריה", href: "/search" },

  ],
  [
    { text: "מורים לעברית", href: "/search" },
    { text: "מורים לאזרחות", href: "/search" },
    { text: "מורים לתנ\"ך", href: "/search" },

  ],
  [
    { text: "תנאי שימוש", href: "/terms" },
    { text: "דיווח על שימוש לרעה", href: "/report" },
    { text: "הנחיות קהילה", href: "/guidelines" },

  ],
  [
      { text: "מדיניות פרטיות", href: "/privacy" },
  ],
];

const socialLinks = [
  { src: "/svg/mdi_linkedin.svg", alt: "LinkedIn", href: "https://linkedin.com" },
  { src: "/svg/mdi_instagram.svg", alt: "אינסטגרם", href: "https://instagram.com" },
  { src: "/svg/ic_baseline-tiktok.svg", alt: "טיקטוק", href: "https://tiktok.com" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.main}>
        <div className={styles.right}>
          <Image
            src="/svg/Aleph1-footer-logo-white.svg"
            alt="אלף1"
            width={61}
            height={59}
          />
          <span className={styles.email}>כתובת מייל: support@aleph1.com</span>
          <div className={styles.socials}>
            {socialLinks.map((s) => (
              <a
                key={s.alt}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
              >
                <Image src={s.src} alt={s.alt} width={26} height={26} />
              </a>
            ))}
          </div>
        </div>
        <div className={styles.nav}>
          {navColumns.flat().map((link) => (
            <a key={link.text} href={link.href}>{link.text}</a>
          ))}
        </div>
      </div>
      <div className={styles.copyright}>
        <p>© 2026 א1. כל הזכויות שמורות.</p>
      </div>
    </footer>
  );
}
