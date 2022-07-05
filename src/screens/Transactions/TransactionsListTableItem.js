import React from "react";
import styles from "./TransactionsListTableItem.module.css";
import { Link } from "react-router-dom";
import { formatToCurrency } from "../../repository/base";

export default function TransactionsListTableItem({ transaction }) {
  return (
    
    <tr
      style={transaction.is_reversal ? { color: "red" } : {}}
      className={`${styles.smartTableItemContainer} ${styles.borderBottom}`}
    >
      <td>
        {transaction.receive_from ? (
          <Link
            to={`/transactions/${transaction.ecr_no}`}
            style={transaction.is_reversal ? { color: "red" } : {}}
          >
            {transaction.ecr_no ? transaction.ecr_no : "NOT SET"}
          </Link>
        ) : (
          <Link
            to={`/transactions/${transaction.ecr_no}`}
            style={transaction.is_reversal ? { color: "red" } : {}}
          >
            {transaction.ecr_no ? transaction.ecr_no : "NOT SET"}
          </Link>
        )}
      </td>
      <td>{transaction.or_no ? transaction.or_no : "NOT SET"}</td>
      <td>{transaction.created_at.split("T")[0]}</td>
      <td>{transaction.student_payment !== null  ? `${transaction.student_payment.enrollment.student.student_no}` : "N/A"}</td>
      <td>
        { transaction.student_payment !== null 
          ? `${transaction.student_payment.enrollment.student.get_full_name}`
          : transaction.receive_from}
      </td>
      <td>{transaction.student_payment !== null && transaction.student_payment.enrollment.student.get_full_name
          ? "Student" : "Non Student"}</td>
      <td>
        {transaction.is_reversal
          ? formatToCurrency(-Math.abs(parseFloat(transaction.amount)))
          : formatToCurrency(parseFloat(transaction.amount))}
      </td>
      {/* <td>
        {transaction.is_reversal
          ? formatToCurrency(-Math.abs(transaction.amount))
          : formatToCurrency(transaction.amount)}
      </td> */}
    </tr>
  );
}
