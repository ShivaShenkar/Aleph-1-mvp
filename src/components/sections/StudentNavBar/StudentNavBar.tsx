import { useState, useRef, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import styles from "./StudentNavBar.module.scss";
import { House, Search, CalendarDays } from "lucide-react";
import StudentIcon from "./StudentIcon";
import UserMenu from "./UserMenu";

export default function StudentNavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuAreaRef.current &&
        !menuAreaRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <RouterLink to="/student" className={styles.logo}>
          <img
            src="/svg/Aleph1-tiny-logo.svg"
            alt="אלף1"
            width={45}
            height={43}
          />
        </RouterLink>

        <div className={styles.navLinks}>
          <RouterLink to="/student" className={styles.navItem}>
            <span>דף הבית</span>
            <House size={24} />
          </RouterLink>
          <RouterLink to="/student/search" className={styles.navItem}>
            <span>חיפוש מורה</span>
            <Search size={24} />
          </RouterLink>
          <RouterLink to="/student/lessons" className={styles.navItem}>
            <span>השיעורים שלי</span>
            <CalendarDays size={24} />
          </RouterLink>
        </div>

        <div className={styles.studentIconArea} ref={menuAreaRef}>
          <div
            className={styles.studentIconWrapper}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <StudentIcon />
          </div>
          {menuOpen && <UserMenu />}
        </div>
      </div>
    </nav>
  );
}
