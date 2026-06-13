import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "aws-amplify/auth";
import { getUrl } from "aws-amplify/storage";
import { useAuthStore } from "@/store/authStore";
import { LogOut } from "lucide-react";
import styles from "./ProfileArea.module.scss";

export default function ProfileArea() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileUrl, setProfileUrl] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user?.profilePic) {
      setProfileUrl(null);
      return;
    }
    const key = user.profilePic.startsWith("/")
      ? user.profilePic.slice(1)
      : user.profilePic;
    getUrl({ key, options: { accessLevel: "protected" } })
      .then((result) => setProfileUrl(result.url.toString()))
      .catch(() => setProfileUrl(null));
  }, [user?.profilePic]);

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
      <div
        className={styles.avatar}
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        {profileUrl ? (
          <img
            src={profileUrl}
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
