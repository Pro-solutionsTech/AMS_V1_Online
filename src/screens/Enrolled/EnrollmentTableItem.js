import React from "react";
import styles from "./EnrollmentTableItem.module.css";
import { Link } from "react-router-dom";

export default function EnrollmentTableItem({ item }) {
  function getDate(date) {
    const firstPart = date.toISOString().split("T")[0];
    const secondPart = date.toISOString().split("T")[1].slice(0, 5);

    return `${firstPart} ${secondPart}`;
  }
  return (
    <tr className={`${styles.smartTableItemContainer} ${styles.borderBottom}`}>
      <td>
        <Link to={`/enrollments/${item.id}`}>
          {item.lastName}, {item.firstName} {item.middleName}
        </Link>
   
      </td>
      <td>{item.studentNo}</td>
      <td>{item.grade}</td>
      <td>{item.section}</td>
      <td>{item.paymentScheme && item.paymentScheme.title}</td>
      <td>{getDate(item.updatedAt)}</td>
    </tr>
  );
}
