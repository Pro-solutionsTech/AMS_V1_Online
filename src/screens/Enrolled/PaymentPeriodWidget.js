import react from "react";
import styles from "./PaymentPeriodWidget.module.css";
import { formatToCurrency } from '../../repository/base';

export default function PaymentPeriodWidget({
  paymentPeriods,
  enrollment,
  transactions,
  paidParticulars,
}) {
  const studentsPaymentPeriods = paymentPeriods.filter(
    (paymentPeriod) =>
      paymentPeriod.payment_scheme_id === enrollment.paymentScheme.id
  );

  const studentsPaidParticulars = [];

  paidParticulars.map((paidParticular) => {
    if (paidParticular.student_id === enrollment.id) {
      studentsPaidParticulars.push(paidParticular.student_payment_id);
    }
  });

  const studentsTransactions = [];

  transactions.map((transaction) => {
    if (studentsPaidParticulars.includes(transaction.student_payment_id)) {
      studentsTransactions.push(transaction);
    }
  });

  let totalTransactionsAmount = studentsTransactions
    .map((transaction) => {
      return parseFloat(transaction.amount);
    })
    .reduce((previous, current) => previous + current, 0);

  return (
    <>
      <div className={styles.periodDetailsContainer}>
        <div className={styles.periodDetailsHeader}>
          <h3 className={styles.smartTableTitle}>Payment Periods</h3>
        </div>
        <table className={styles.smartTable}>
          <thead
            className={`${styles.smartTableHeader} ${styles.smartTableHeaderWithColor}`}
          >
            <tr>
              <th>TITLE</th>
              <th>DUE DATE</th>
              <th>AMOUNT(₱)</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody className={styles.smartTableBody}>
            {studentsPaymentPeriods.map((paymentPeriod) => {
              let paymentPeriodStatus = "Not Paid";
              if (totalTransactionsAmount > 0) {
                if (totalTransactionsAmount - paymentPeriod.amount >= 0) {
                  paymentPeriodStatus = "Fully Paid";
                } else {
                  paymentPeriodStatus = "Partially Paid";
                }
                totalTransactionsAmount -= paymentPeriod.amount;
              }
              return (
                <tr key={paymentPeriod.id}>
                  <td>{paymentPeriod.name}</td>
                  <td>{paymentPeriod.due_date}</td>
                  <td>{formatToCurrency(paymentPeriod.amount)}</td>
                  <td>{paymentPeriodStatus}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
