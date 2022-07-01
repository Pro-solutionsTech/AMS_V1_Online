import React from 'react';
// import { Link } from "react-router-dom"

import styles from './CollectionReportPerGradeComponent.module.css';
const CollectionReportPerGradeComponent = (props) => {
  return (
    <>
      <div className={styles.CollectionReportPerGradeComponent}>
        <h2>Collection Report - All Transactions</h2>
        <div className={`${styles.CollectionReportPerGradeComponentRow} ${styles.withLineInput}`}>
          <h4>Date:</h4>
          <div>
            <input type="text" />
          </div>
        </div>
        <div className={styles.CollectionReportPerGradeComponentRow}>
          <h4>Cashier ID:</h4>
          <p>Sample data</p>
        </div>
        <div className={styles.CollectionReportPerGradeComponentRow}>
          <h4>Full Name:</h4>
          <p>Sample data</p>
        </div>
        <div className={`${styles.CollectionReportPerGradeComponentRow} ${styles.withLineInput}`}>
          <h4>ECR Number Series:</h4>
          <div>
            <input type="text" />
            <span>to</span>
            <input type="text" />
          </div>
        </div>
        <div className={`${styles.CollectionReportPerGradeComponentRow} ${styles.withLineInput}`}>
          <h4>OR Number Series:</h4>
          <div>
            <input type="text" />
            <span>to</span>
            <input type="text" />
          </div>
        </div>
        <div className={styles.CollectionReportPerGradeComponentRow}>
          <h4>Number of Transactions:</h4>
          <p>Sample data</p>
        </div>
        <div className={`${styles.CollectionReportPerGradeComponentRow} ${styles.withButtons}`}>
          <button value="reset">Reset</button>
          <button value="Generate">Generate Report</button>
        </div>
      </div>
    </>
  )
}

export default CollectionReportPerGradeComponent;
