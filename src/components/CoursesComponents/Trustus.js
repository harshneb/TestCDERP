"use client";

import React from "react";
import styles from "@/styles/CoursesComponents/Trustus.module.css";
import Image from "next/image";

const TrustUs = () => {
  // Updated logo filenames
  const logoFilenames = [
    "airmeet.avif",
    "aruba.avif",
    "ask.avif",
    "bharatgri.avif",
    "bharatpe.avif",
    "capita.avif",
    "crisi.avif",
    "cummins.avif",
    "dream11.avif",
    "eatfit.avif",
    "exl.avif",
    "genius.avif",
    "godrej.avif",
    "hdfc.avif",
    "homelane.avif",
    "ibm.avif",
    "iss.avif",
    "jindal.avif",
    "john-deere.avif",
    "kelly.avif",
    "leapfinance.avif",
    "moneytap.avif",
    "monginis.avif",
    "paytm.avif",
    "pizza-hut.avif",
    "sharechat.avif",
    "swiggy.avif",
    "syntel.avif",
    "volkswagon.avif",
    "vyapar.avif",
    "weber.avif",
    "whitehat.avif",
    "zenser.avif",
    "BAJAJ.avif",
    "BIG.avif",
    "BOSTON.avif",
    "CAP.avif",
    "FIRST.avif",
    "GNS.avif",
    "INTE.avif",
    "ZELI.avif",
    "DCT.avif",
    "NA.avif",
    "KOHLER.avif",
  ];

  const logoPaths = logoFilenames.map((name) => `/Ourclients/${name}`);

  // Split into 3 equal groups for marquee rows
  const logos1 = logoPaths.slice(0, 15);
  const logos2 = logoPaths.slice(15, 30);
  const logos3 = logoPaths.slice(30);

  // Duplicate logos for smooth animation
  const duplicateLogos = (logos) => [...logos, ...logos];

  return (
    <div className={styles.containerItDs}>
      {/* Logos Marquee */}
      <div className={styles.logosItDs}>
        {[logos1, logos2, logos3].map((logos, idx) => (
          <div className={styles.marqueeItDs} key={idx}>
            <div className={styles.marqueeContentItDs}>
              {duplicateLogos(logos).map((src, index) => (
                <Image
                  key={index}
                  src={src}
                  alt={`Logo ${index}`}
                  width={100}
                  height={50}
                  className={styles.logoItDs}   
                  priority
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Information Section */}
      <div className={styles.infoItDs}>
        <div className={styles.containerItDsTitle}>
          <h2>Organisations Trust Us</h2>
        </div>
        <h2 className={styles.titleItDs}>
          <span className={styles.highlightSpan}>1000+</span> Organizations
          <br /> Trust Us With Their <br /> Openings
        </h2>
        <p className={styles.descriptionItDs}>
          <span className={styles.highlightSpan}>Organizations</span>, across
          the globe trust our students and their brilliant{" "}
          <span className={styles.highlightSpan}>technical skills</span> in Full
          Stack Development,{" "}
          <span className={styles.highlightSpan}>
            Data Science & Analytics with AI
          </span>
          , Java Full Stack Developer, Digital Marketing Course, AWS Cloud
          Technology, which results in them getting hired at excellent companies
          with impressive pay scales.
          <span className={styles.highlightSpan}>Connecting Dots ERP</span>,
          India’s fastest-growing{" "}
          <span className={styles.highlightSpan}>
            Software Training Institute
          </span>{" "}
          provides a range of IT Courses helping to shape the future of our
          students in every way possible. The Coding Courses provided by our
          Institute are highly valuable and worthy for the students.
        </p>
        <div className={styles.statisticsItDs}>
          <div className={styles.statItDs}>
            <span className={styles.numberItDs}>1000+</span>{" "}
            <span className={styles.labelItDs}>Hiring companies</span>
          </div>
          <div className={styles.statItDs}>
            <span className={styles.numberItDs}>100+</span>{" "}
            <span className={styles.labelItDs}>Students already placed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustUs;
