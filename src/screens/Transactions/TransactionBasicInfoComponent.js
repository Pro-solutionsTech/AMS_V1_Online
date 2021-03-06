import React from "react";
// import { Link } from "react-router-dom"

import styles from "./TransactionBasicInfoComponent.module.css";
const TransactionBasicInfoComponent = ({ enrollment }) => {
  return (
    <>
      <div className={styles.TransactionBasicInfoComponent}>
        <h3 className={styles.TransactionBasicInfoTitle}>Basic Information</h3>
        <div className={styles.smartFields}>
          <div className={styles.smartField}>
            <div className={styles.smartFieldLabel}>Student ID</div>
            <div className={styles.smartFieldValue}>
              {enrollment ? enrollment.studentNo : "N/A"}
            </div>
          </div>
          <div className={styles.smartField}>
            <div className={styles.smartFieldLabel}>Last Name</div>
            <div className={styles.smartFieldValue}>
              {enrollment ? enrollment.lastName : "N/A"}
            </div>
          </div>
          <div className={styles.smartField}>
            <div className={styles.smartFieldLabel}>First Name</div>
            <div className={styles.smartFieldValue}>
              {enrollment ? enrollment.firstName : "N/A"}
            </div>
          </div>
          <div className={styles.smartField}>
            <div className={styles.smartFieldLabel}>Middle Name</div>
            <div className={styles.smartFieldValue}>
              {enrollment ? enrollment.middleName : "N/A"}
            </div>
          </div>
          <div className={styles.smartField}>
            <div className={styles.smartFieldLabel}>Grade Level</div>
            <div className={styles.smartFieldValue}>
              {enrollment ? enrollment.grade : "N/A"}
            </div>
          </div>
          <div className={styles.smartField}>
            <div className={styles.smartFieldLabel}>Section</div>
            <div className={styles.smartFieldValue}>
              {enrollment ? enrollment.section : "N/A"}
            </div>
          </div>
          <div className={styles.smartField}>
            <div className={styles.smartFieldLabel}>Payment Method</div>
            <div className={styles.smartFieldValue}>Cash on Hand</div>
          </div>
          <div className={styles.smartField}></div>
          <div className={styles.smartField}>
            <div className={styles.smartFieldLabel}>Finance Account</div>
            <div className={styles.smartFieldValue}>Cash on Hand</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionBasicInfoComponent;
