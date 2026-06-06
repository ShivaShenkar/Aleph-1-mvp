import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signOut } from "aws-amplify/auth";
import { useAuthStore } from "@/store/authStore";
import styles from "./StudentNavBar.module.scss";

export default function UserMenu() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      useAuthStore.getState().clearUser();
      navigate("/login");
    } catch {
      // silently fail
    }
  };

  return (
    <div className={styles.userMenu}>
      <button className={styles.logoutBtn} onClick={handleLogout}>
        <span>התנתק</span>
        <LogOut size={18} />
      </button>
    </div>
  );
}
