import { Outlet } from "react-router-dom";
import TutorNavBar from "@/components/sections/TutorNavBar/TutorNavBar";
import styles from "@/styles/tutor.module.scss";

export default function TutorPage() {
  return (
    <main className={styles.layout}>
      <TutorNavBar />
      <div className={styles.content}>
        <Outlet />
      </div>
    </main>
  );
}
