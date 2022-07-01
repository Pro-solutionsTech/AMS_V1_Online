import React from "react";
import styles from "./TransactionReversalInfoComponent.module.css";
import Moment from 'react-moment';

const TransactionReversalInfoComponent = ({ reversal }) => {

  return (
    <>
      <div className={styles.TransactionReversalInfoComponent}>
        <h3 className={styles.TransactionReversalInfoTitle}>
          Reversal Information
        </h3>
        <div className={styles.smartFields}>
          <div className={styles.smartField}>
            <div className={styles.smartFieldLabel}>Cashier Initials</div>
            <div className={styles.smartFieldValue}>{reversal.initial}</div>
          </div>
          <div className={styles.smartField}>
            <div className={styles.smartFieldLabel}>Date</div>
            <div className={styles.smartFieldValue}> <Moment format='MMM DD, YYYY'>{reversal.created_at}</Moment></div>

          </div>
          <div className={`${styles.smartField} ${styles.spanAll}`}>
            <div className={styles.smartFieldLabel}>Reason for Reversal</div>
            <div className={styles.smartFieldValue}>{reversal.reason}</div>
          </div>

        </div>
      </div>
    </>
  );
};

export default TransactionReversalInfoComponent;
