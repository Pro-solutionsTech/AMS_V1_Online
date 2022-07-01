
import React from 'react';
import { useState } from 'react';
import stylesP from "../Enrolled/PrintReceipt.module.css";
import styles from './NonStudent.module.css';
import { useSelector } from "react-redux";
const NonStudentReversal = ({
  transactionOne,
  incometransaction,
  isReversed
}) => {
  const user = useSelector((state) => state.user);

  const middleInitial = `${user.middle_name}`
    ? `${user.middle_name == null ? "" : user.middle_name}`
    : "";
  const firstName = `${user.first_name}`
    ? `${user.first_name == null ? "" : user.first_name}`
    : "";
  const lastName = `${user.last_name}`
    ? `${user.last_name == null ? "" : user.last_name}`
    : "";
  const cashierFullName = `${firstName} ${middleInitial.charAt(
    0
  )}. ${lastName}`;

  console.log(incometransaction)
  return (
    <div >
      <div className={styles.NonStudentComponent}>
        {isReversed && <h3 style={{ color: 'red' }}>REVERSED</h3>}

        <h2>Non-Student</h2>



        <div
          className={`${styles.NonstudentComponentRow} ${styles.withLineInput}`}
        >
          <h4>Title:</h4>
          <div>
            {incometransaction ? incometransaction.title : "N/A"}
          </div>
        </div>

        <div
          className={`${styles.NonstudentComponentRow} ${styles.withLineInput}`}
        >
          <h4>Description:</h4>
          <div>
            {incometransaction ? incometransaction.description : "N/A"}
          </div>
        </div>
        <div
          className={`${styles.NonstudentComponentRow} ${styles.withLineInput}`}
        >
          <h4>Type:</h4>
          <div>
            <label>Income</label>
          </div>
        </div>
        <div
          className={`${styles.NonstudentComponentRow} ${styles.withLineInput}`}
        >
          <h4>Receive from:</h4>
          <div>
            {incometransaction ? incometransaction.receive_from : "N/A"}
          </div>
        </div>
        <div
          className={`${styles.NonstudentComponentRow} ${styles.withLineInput}`}
        >
          <h4>Add to:</h4>
          <div>
            {incometransaction ? incometransaction.finance_account : "N/A"}
          </div>
        </div>
        <div
          className={`${styles.NonstudentComponentRow} ${styles.withLineInput}`}
        >
          <h4>Amount (₱):</h4>
          <div>
            {incometransaction ? incometransaction.amount : "N/A"}
          </div>
        </div>
        <div
          className={`${styles.NonstudentComponentRow} ${styles.withLineInput}`}
        >
          <h4>Date:</h4>
          <div
          >
            {incometransaction ? incometransaction.date : "N/A"}

          </div>
        </div>
        <div
          className={`${styles.NonstudentComponentRow} ${styles.withLineInput}`}
        >
          <h4>Category</h4>
          <div>
            {incometransaction ? incometransaction.finance_category : "N/A"}
          </div>
        </div>
        <div
          className={`${styles.NonstudentComponentRow} ${styles.withLineInput}`}
        >
          <h4>ECR Number Series:</h4>
          <div>
            {transactionOne ? transactionOne.ecr_no : "N/A"}
          </div>
        </div>
        <div
          className={`${styles.NonstudentComponentRow} ${styles.withLineInput}`}
        >
          <h4>OR Number Series:</h4>
          <div>
            {transactionOne ? transactionOne.or_no : "N/A"}
          </div>
        </div>

        <div
          className={`${styles.NonstudentComponentRow} ${styles.withButtons}`}
        >
        </div>
      </div>

      <div style={{ position: "absolute", left: "-9999em" }}>
        <pre id="receipt" className={styles.receiptContainer}>
          <div className={styles.receiptContent}>
            <div className={styles.receiptHeader}></div>

            <div className={styles.receiptInfo}>
              <div className={styles.receiptInfoRow}>
                <p></p>
                <p>
                  {incometransaction ? incometransaction.date : "N/A"}
                </p>
              </div>

              <div className={styles.receiptInfoRow}>
                <p>{incometransaction ? incometransaction.receive_from : "N/A"}</p>
                <p> {transactionOne ? transactionOne.ecr_no : "N/A"}</p>
              </div>

              <div className={styles.receiptInfoRow}>
                <p></p>
                <p> {transactionOne ? transactionOne.or_no : "N/A"}</p> {/*balance*/}
              </div>
            </div>

            <div className={`${styles.receiptPayment} ${styles.marginTop}`}>
              <div className={styles.receiptPaymentParticular}>
                <p>
                  {incometransaction ? incometransaction.finance_category : "N/A"}
                </p>
                <p> {incometransaction ? incometransaction.amount : "N/A"}</p>
              </div>

              <div
                className={`${styles.receiptPaymentParticular} ${styles.marginTop}`}
              >

              </div>

              <div className={styles.receiptPaymentParticular}>


              </div>

              <div
                className={`${styles.receiptPaymentParticular} ${styles.marginTop}`}
              >


              </div>
            </div>

            <div className={styles.receiptFooter}></div>
          </div>
        </pre>
      </div>
    </div>
  )
}

export default NonStudentReversal;