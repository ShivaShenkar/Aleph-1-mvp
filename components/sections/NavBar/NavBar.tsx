import Image from "next/image";
import styles from "./NavBar.module.scss";
import Link from "@/components/ui/Link/Link";
import Button from "@/components/ui/Button/Button";
import NextLink from 'next/link';
import SubjectsDropdown from "./SubjectsDropdown/SubjectsDropdown";

export default function NavBar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <div className={styles.logoAndLinks}>
          <div className={styles.logo}>
            <NextLink href="/">
              <Image
                src="/svg/Aleph1-tiny-logo.svg"
                alt="אלף1"
                width={45}
                height={43}
              />
            </NextLink>
          </div>
          <div className={styles.links}>
            <Link href="/about" text="אודות" />
            <SubjectsDropdown />
            <Link href="/become-tutor" text="הפוך למורה" />            
          </div>
        </div>
        <div className={styles.buttons}>
          <Button variant="secondary" text="התחברות" />
          <Button variant="primary" text="התחל עכשיו" />
        </div>
      </div>
    </nav>
  );
}
