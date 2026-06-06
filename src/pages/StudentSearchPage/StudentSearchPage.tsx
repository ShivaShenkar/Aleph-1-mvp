import { useState } from "react";
import { Search } from "lucide-react";
import StudentNavBar from "@/components/sections/StudentNavBar/StudentNavBar";
import Heading from "@/components/ui/Heading/Heading";
import SubjectGrid from "@/components/sections/student-search/SubjectGrid/SubjectGrid";
import { subjects } from "@/lib/subjects";
import styles from "./StudentSearchPage.module.scss";

export default function StudentSearchPage() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <>
      <StudentNavBar />
      <main className={styles.page}>
        <div className={styles.headings}>
          <Heading level="h1" underline>
            נושאי לימוד
          </Heading>
        </div>

        <div className={styles.searchBar}>
          <Search size={24} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="חפש את המקצוע שאתה צריך"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        <div className={styles.gridWrapper}>
          <SubjectGrid subjects={subjects} searchValue={searchValue} />
        </div>
      </main>
    </>
  );
}
