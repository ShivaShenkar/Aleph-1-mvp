import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "aws-amplify/auth";
import { useAuthStore } from "@/store/authStore";
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

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`
    : "מ";

  return (
    <div className={styles.wrapper} ref={menuRef}>
      <span className={styles.label}>למורה</span>
      <div
        className={styles.avatar}
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        {user?.profilePic ? (
          <img
            src={user.profilePic}
            alt=""
            className={styles.avatarImg}
          />
        ) : (
          <span className={styles.initials}>{initials}</span>
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
