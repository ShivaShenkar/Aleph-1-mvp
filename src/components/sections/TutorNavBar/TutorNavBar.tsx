import { NavLink } from "react-router-dom";
import { House, Wallet, Bell, BarChart3, MessageSquare } from "lucide-react";
import styles from "./TutorNavBar.module.scss";
import ProfileArea from "./ProfileArea";

const navItems = [
  { to: "/tutor/payments", icon: Wallet, label: "תשלומים" },
  { to: "/tutor/notifications", icon: Bell, label: "התראות" },
  { to: "/tutor/analytics", icon: BarChart3, label: "סטטיסטיקות" },
  { to: "/tutor/messages", icon: MessageSquare, label: "הודעות" },
  { to: "/tutor", icon: House, label: "בית", end: true },
];

export default function TutorNavBar() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <ProfileArea />
        <nav className={styles.navPill}>
          <NavLink to="/tutor" className={styles.logoLink}>
            <img
              src="/svg/Aleph1-tiny-logo.svg"
              alt="אלף1"
              width={32}
              height={32}
            />
          </NavLink>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ""}`
              }
            >
              <item.icon size={28} />
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
