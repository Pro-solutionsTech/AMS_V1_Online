import React from "react";
import { formatToCurrency } from '../../repository/base';
// import { Link } from "react-router-dom"

import styles from "./TransactionTransactionInfoComponent.module.css";
const TransactionTransactionInfoComponent = ({
  transaction,
  paidParticulars,
  particulars,
  isReversed,
  additionalFee,
  lateFees
}) => {
  return transaction && (
    <>
      <div className={styles.TransactionTransactionInfoComponent}>
        <div className={styles.flex}>
          <h3 className={styles.TransactionTransactionInfoComponentTitle}>
            Transaction Information
          </h3>

          {isReversed && <h3 style={{color: 'red'}}>REVERSED</h3>}
        </div>
        <div className={styles.smartFields}>
          <div className={styles.smartField}>
            <div className={styles.smartFieldLabel}>OR Number</div>
            <div className={styles.smartFieldValue}>
              {transaction ? transaction.or_no : "N/A"}
            </div>
          </div>
          <div className={styles.smartField}>
            <div className={styles.smartFieldLabel}>Total Amount (₱)</div>
            <div className={styles.smartFieldValue}>
              {formatToCurrency(Number(transaction.amount))}
            </div>
          </div>
          <div className={styles.smartField}>
            <div className={styles.smartFieldLabel}>Date</div>
            <div className={styles.smartFieldValue}>
              {/* {transaction ? transaction.created_at.split("T")[0] : "N/A"} */}
              {transaction ? new Date(transaction.created_at).toString() : "N/A"}
            </div>
          </div>
        </div>
        {!transaction.is_reversal && (
          <table className={styles.smartTable}>
            <thead
              className={`${styles.smartTableHeader} ${styles.smartTableHeaderWithColor}`}
            >
              <tr>
                <th>PARTICULAR</th>
                <th>AMOUNT (₱)</th>
              </tr>
            </thead>
            <tbody className={styles.smartTableBody}>
              {paidParticulars
                ? paidParticulars.map((paidParticular) => {
                  return (
                    <tr key={paidParticular.id}>
                      <td>
                        {
                          particulars.filter(
                            (particular) =>
                              particular.id === paidParticular.particular_id
                          )[0].name
                        }
                      </td>
                      <td>{formatToCurrency(paidParticular.amount)}</td>
                    </tr>
                  );
                })
                : "N/A"}
              
              {additionalFee && additionalFee.map(fee => (
                <tr key={fee.id}>
                  <td>{fee.name}</td>
                  <td>{formatToCurrency(fee.amount)}</td>
                </tr>
              ))}

              {lateFees && lateFees.map(fee => (
                <tr key={fee.id}>
                  <td>{fee.book_title}</td>
                  <td>{formatToCurrency(fee.late_fee)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default TransactionTransactionInfoComponent;
