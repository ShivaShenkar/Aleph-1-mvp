import { Link as RouterLink } from "react-router-dom";
import styles from "./NavBar.module.scss";
import Link from "@/components/ui/Link/Link";
import Button from "@/components/ui/Button/Button";
import SubjectsDropdown from "./SubjectsDropdown/SubjectsDropdown";

export default function NavBar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <div className={styles.logoAndLinks}>
          <div className={styles.logo}>
            <RouterLink to="/">
              <img
                src="/svg/Aleph1-tiny-logo.svg"
                alt="אלף1"
                style={{width: '45px', height: '43px'}}
              />
            </RouterLink>
          </div>
          <div className={styles.links}>
            <Link href="/about" text="אודות" />
            <SubjectsDropdown />
            <Link href="/become-tutor" text="הפוך למורה" />            
          </div>
        </div>
        <div className={styles.buttons}>
          <Button redirect="/login" variant="secondary" text="התחברות" />
          <Button redirect="/signup" variant="primary" text="התחל עכשיו" />
        </div>
      </div>
    </nav>
  );
}
