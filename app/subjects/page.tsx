"use client";

import NavBar from "@/components/sections/NavBar/NavBar";
import Footer from "@/components/sections/Footer/Footer";
import SubjectsGallery from "@/components/sections/studentHomePage/subjectsGallery";

export default function SubjectsPageRoute() {
  return (
    <>
      <NavBar />
      <main style={styles.mainContainer}>
        <SubjectsGallery />
      </main>
      <Footer />
    </>
  );
}

const styles = {
  mainContainer: {
    padding: "40px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
    minHeight: "80vh",
  },
};