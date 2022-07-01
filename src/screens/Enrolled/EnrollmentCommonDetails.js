import React from "react";
import styles from "./ProcessPayment.module.css";

export default function Enrolled({ enrollment }) {
  return (
    <div>
      <div className={styles.smartFields}>
        <h2 className={styles.spanAll}>Student Finances</h2>
        <div className={styles.smartField}>
          <div className={styles.smartFieldLabel}>Student ID</div>
          <div className={styles.smartFieldValue}>{enrollment.studentNo}</div>
        </div>
        <div className={styles.smartField}>
          <div className={styles.smartFieldLabel}>Last Name</div>
          <div className={styles.smartFieldValue}>{enrollment.lastName}</div>
        </div>
        <div className={styles.smartField}>
          <div className={styles.smartFieldLabel}>First Name</div>
          <div className={styles.smartFieldValue}>{enrollment.firstName}</div>
        </div>
        <div className={styles.smartField}>
          <div className={styles.smartFieldLabel}>Middle Name</div>
          <div className={styles.smartFieldValue}>{enrollment.middleName}</div>
        </div>
        <div className={styles.smartField}>
          <div className={styles.smartFieldLabel}>Grade / Year</div>
          <div className={styles.smartFieldValue}>{enrollment.grade}</div>
        </div>
        <div className={styles.smartField}>
          <div className={styles.smartFieldLabel}>Section</div>
          <div className={styles.smartFieldValue}>{enrollment.section}</div>
        </div>

        <div className={styles.smartField}>
          <div className={styles.smartFieldLabel}>Gender</div>
          <div className={styles.smartFieldValue}>{enrollment.gender}</div>
        </div>
        <div className={styles.smartField}>
          <div className={styles.smartFieldLabel}>Birthdate</div>
          <div className={styles.smartFieldValue}>{enrollment.birth_date}</div>
        </div>
        <div className={styles.smartField}>
          <div className={styles.smartFieldLabel}>Age</div>
          <div className={styles.smartFieldValue}>{enrollment.age}</div>
        </div>
        <div className={styles.smartField}>
          <div className={styles.smartFieldLabel}>Contact Number</div>
          <div className={styles.smartFieldValue}>{enrollment.contact_no}</div>
        </div>
        <div className={`${styles.smartField} ${styles.span2}`}>
          <div className={styles.smartFieldLabel}>Address</div>
          <div className={styles.smartFieldValue}>{enrollment.address}</div>
        </div>
        <div className={styles.smartField}>
          <div className={styles.smartFieldLabel}>Curriculum</div>
          <div className={styles.smartFieldValue}>{enrollment.curriculum}</div>
        </div>
        <div className={styles.smartField}>
          <div className={styles.smartFieldLabel}>Payment Scheme</div>
          <div className={styles.smartFieldValue}>{enrollment.paymentScheme.title} </div>
        </div>
      </div>
    </div>
  );
}
