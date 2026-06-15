import { useState, useCallback } from "react";
import { Link as RouterLink } from "react-router-dom";
import styles from "./SubjectsDropdown.module.scss";
import Link from "@/components/ui/Link/Link";

const subjects = [
  { name: "מתמטיקה", slug: "math" },
  { name: "אנגלית", slug: "english" },
  { name: "היסטוריה", slug: "history" },
  { name: "עברית", slug: "hebrew" },
  { name: "אזרחות", slug: "civics" },
  { name: "תנ״ך", slug: "bible" },
];

export default function SubjectsDropdown() {
  const [open, setOpen] = useState(false);

  const handleClick = ()=>{
    setOpen(!open);
    console.log("clicked, open:", open);
  }

  const handleMouseLeave = useCallback(()=>{
    setOpen(false);
    console.log("mouse left");
  },[]);
  return (
    <div
      className={styles.wrapper}
      onMouseLeave={handleMouseLeave}
    >
      <Link href="#" text="נושאי לימוד" onClick={handleClick} />
      {/* <button type="button" className={styles.trigger} onClick={handleClick}>
        נושאי לימוד
      </button> */}
      <div className={`${styles.dropdown}${open ? ` ${styles.dropdownOpen}` : ""}`}>
          {subjects.map((s) => (
            <RouterLink key={s.slug} to={`/subjects/${s.slug}`} className={styles.item}>
              {s.name}
            </RouterLink>
          ))}
      </div>
    </div>
  );
}
