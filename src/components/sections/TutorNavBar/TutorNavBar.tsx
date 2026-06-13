import { NavLink, Link } from "react-router-dom";
import { House, Calendar, History, Landmark } from "lucide-react";
import styles from "./TutorNavBar.module.scss";
import ProfileArea from "./ProfileArea";

const navItems = [
  { to: "/tutor", icon: House, label: "בית", end: true },
  { to: "/tutor/calendar", icon: Calendar, label: "לוח זמנים" },
  { to: "/tutor/history", icon: History, label: "היסטוריה" },
  { to: "/tutor/payments", icon: Landmark, label: "תשלומים" },
];

export default function TutorNavBar() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.right}>
          <Link to="/tutor" className={styles.logo}>
            <img
              src="/svg/Aleph1-tiny-logo.svg"
              alt="אלף1"
              width={45}
              height={43}
            />
            <span className={styles.logoText}>למורה</span>
          </Link>
        </div>
        <nav className={styles.pill}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${styles.pillItem} ${isActive ? styles.pillActive : ""}`
              }
            >
              <item.icon size={28} />
            </NavLink>
          ))}
        </nav>
        <div className={styles.left}>
          <ProfileArea />
        </div>
      </div>
    </header>
  );
}
