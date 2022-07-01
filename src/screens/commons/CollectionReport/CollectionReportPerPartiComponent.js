import React from 'react';
// import { Link } from "react-router-dom"

import styles from './CollectionReportPerPartiComponent.module.css';
const CollectionReportPerPartiComponent = (props) => {
  return (
    <>
      <div className={styles.CollectionReportPerPartiComponent}>
        <h2>Collection Report - Per Particular</h2>
        <div className={`${styles.CollectionReportPerPartiComponentRow} ${styles.withLineInput}`}>
          <h4>Process Date:</h4>
          <div>
            <input type="text" />
          </div>
        </div>
        <div className={styles.CollectionReportPerPartiComponentRow}>
          <h4>Cashier ID:</h4>
          <p>Sample data</p>
        </div>
        <div className={styles.CollectionReportPerPartiComponentRow}>
          <h4>Full Name:</h4>
          <p>Sample data</p>
        </div>
        <div className={`${styles.CollectionReportPerPartiComponentRow} ${styles.withLineInput}`}>
          <h4>Submitted to:</h4>
          <div>
            <input type="text" />
          </div>
        </div>
        <div className={`${styles.CollectionReportPerPartiComponentRow} ${styles.withLineInput}`}>
          <h4>Date:</h4>
          <div>
            <input type="text" />
          </div>
        </div>
        <div className={`${styles.CollectionReportPerPartiComponentRow} ${styles.withLineInput}`}>
          <h4>OR Number Used:</h4>
          <div>
            <input type="text" />
          </div>
        </div>
        <div className={`${styles.CollectionReportPerPartiComponentRow} ${styles.withLineInput}`}>
          <h4>ECR Number Used:</h4>
          <div>
            <input type="text" />
          </div>
        </div>
        <div className={styles.CollectionReportPerPartiComponentRow}>
          <h4>Number of Transactions:</h4>
          <p>Sample data</p>
        </div>
        <div className={`${styles.CollectionReportPerPartiComponentRow} ${styles.withButtons}`}>
          <button value="reset">Reset</button>
          <button value="Generate">Generate Report</button>
        </div>
      </div>

    </>
  )
}

export default CollectionReportPerPartiComponent;