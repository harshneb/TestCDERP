// components/HomePage/Certificate.js (Updated Certificate)
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "@/styles/HomePage/Certificate.module.css";
import { Button } from "react-bootstrap";
import dynamic from "next/dynamic";

// Dynamically import Btnform to prevent SSR-related issues
const Btnform = dynamic(() => import("@/components/HomePage/Btnform"), {
  ssr: false,
});

// Certificate now directly receives the 'data' prop
const Certificate = ({ data }) => {
  const [showForm, setShowForm] = useState(false);
  const handleButtonClick = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);

  // Simplified loading/error handling as data is passed directly
  if (!data) {
    return (
      <div /* Add loading/error styling */>
        <p>No certificate data available (check masterData.js or prop passing).</p>
      </div>
    );
  }

  return (
    <div className={styles.certificateSection}>
      <h2 className={styles.certificateTitle}>Certificate</h2>
      <div className={styles.titleUnderline}></div>
      <div className={styles.certificateContent}>
        <div className={styles.certificateImage}>
          <Image
            src={data.image} // Use data from props
            alt={data.alt || `${data.courseTitle} Certificate`} // Use data from props
            width={500}
            height={300}
            layout="intrinsic"
          />
        </div>
        <div className={styles.certificateText}>
          <h2>Congratulations on Completing Your Training!</h2>
          <h4 className={styles.certificateSubtitle}>
            {data.courseTitle} {/* Use data from props */}
          </h4>
          <p>{data.completionText}</p> {/* Use data from props */}
          <p>{data.description}</p> {/* Use data from props */}
          <div
            className="mb-3 btnContainer"
          >
            <Button className={styles.outlineBtn} onClick={handleButtonClick}>
              Get your Certificate
            </Button>
          </div>
          {showForm && <Btnform onClose={handleCloseForm} />}
        </div>
      </div>
    </div>
  );
};

export default Certificate;