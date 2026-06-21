import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "aws-amplify/auth";
import { useAuthStore } from "@/store/authStore";
import TutorProfilePic from "@/components/ui/TutorProfilePic/TutorProfilePic";
import { LogOut } from "lucide-react";
import styles from "./ProfileArea.module.scss";

export default function ProfileArea() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  const handleLogout = async () => {
    try {
      await signOut();
      useAuthStore.getState().clearUser();
      navigate("/login");
    } catch {
      /* silent */
    }
  };

  return (
    <div className={styles.wrapper} ref={menuRef}>
      <div
        className={styles.avatar}
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        {user ? (
          <TutorProfilePic
            tutorId={user.userId}
            firstName={user.firstName}
            lastName={user.lastName}
          />
        ) : (
          <span className={styles.initials}>מ</span>
        )}
      </div>
      {menuOpen && (
        <div className={styles.dropdown}>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={18} />
            <span>התנתק</span>
          </button>
        </div>
      )}
    </div>
  );
}
