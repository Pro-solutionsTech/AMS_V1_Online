import React from "react";
import styles from "./PrintReceipt.module.css";
import Moment from "react-moment";
import { formatToCurrency } from "../../repository/base";

export default function PrintReceipt({
  idNumber,
  date,
  studentName,
  ecr,
  gradeAndSection,
  balance,
  particulars,
  totalDue,
  payment,
  change,
}) {
  return (
    <div style={{ position: "absolute", left: "-9999em" }}>
      <pre id="receipt" className={styles.receiptContainer}>
        <div className={styles.receiptContent}>
          <div className={styles.receiptHeader}></div>

          <div className={styles.receiptInfo}>
            <div className={styles.receiptInfoRow}>
              <p>{idNumber}</p>
              <p>
                <Moment format="DD-MMMM-YYYY / h:mm A">{date}</Moment>
              </p>
            </div>

            <div className={styles.receiptInfoRow}>
              <p>{studentName}</p>
              <p>{ecr}</p>
            </div>

            <div className={styles.receiptInfoRow}>
              <p>{gradeAndSection}</p>
              <p>{formatToCurrency(Number(balance))}</p>
            </div>
          </div>

          <div className={`${styles.receiptPayment} ${styles.marginTop}`}>
            {particulars.map((particular) => (
              <div
                key={particular.particular.id}
                className={styles.receiptPaymentParticular}
              >
                <p>{particular.particular.name}</p>
                <p>{formatToCurrency(Number(particular.amount))}</p>
              </div>
            ))}

            <div
              className={`${styles.receiptPaymentParticular} ${styles.marginTop}`}
            >
              <p>TOTAL DUE</p>
              <p>{formatToCurrency(Number(totalDue))}</p>
            </div>

            <div className={styles.receiptPaymentParticular}>
              <p>PAYMENT</p>
              <p>{formatToCurrency(Number(payment))}</p>
            </div>

            <div
              className={`${styles.receiptPaymentParticular} ${styles.marginTop}`}
            >
              <p>CHANGE</p>
              <p>{formatToCurrency(Number(change))}</p>
            </div>
          </div>

          <div className={styles.receiptFooter}></div>
        </div>
      </pre>
    </div>
  );
}
