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
            to={`/transactions/${transaction.id}`}
            style={transaction.is_reversal ? { color: "red" } : {}}
          >
            {transaction.ecr_no ? transaction.ecr_no : "NOT SET"}
          </Link>
        ) : (
          <Link
            to={`/transactions/${transaction.id}`}
            style={transaction.is_reversal ? { color: "red" } : {}}
          >
            {transaction.ecr_no ? transaction.ecr_no : "NOT SET"}
          </Link>
        )}
      </td>
      <td>{transaction.or_no ? transaction.or_no : "NOT SET"}</td>
      <td>{transaction.created_at.split("T")[0]}</td>
      <td>{transaction.student_no ? transaction.student_no : "N/A"}</td>
      <td>
        {transaction.last_name
          ? `${transaction.last_name}, ${transaction.first_name} ${transaction.middle_name}`
          : transaction.receive_from}
      </td>
      <td>{transaction.last_name ? "Student" : "Non Student"}</td>
      <td>
        {transaction.is_reversal
          ? formatToCurrency(-Math.abs(transaction.amount))
          : formatToCurrency(transaction.amount)}
      </td>
    </tr>
  );
}
