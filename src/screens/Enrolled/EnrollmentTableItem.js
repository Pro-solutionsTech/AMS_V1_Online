import React from "react";
import styles from "./EnrollmentTableItem.module.css";
import { Link } from "react-router-dom";


export default function EnrollmentTableItem({ item }) {
  // function getDate(date) {
  //   const firstPart = date.toISOString().split("T")[0];
  //   const secondPart = date.toISOString().split("T")[1].slice(0, 5);

  //   return `${firstPart} ${secondPart}`;
  // }
  return (
    <tr className={`${styles.smartTableItemContainer} ${styles.borderBottom}`}>
      <td>
        <Link to={`/enrollments/${item.id}`}>
          {item.student.last_name}, {item.student.first_name} {item.student.middle_name}
        </Link>

      </td>
      <td>{item.student.student_no}</td>
      <td>{item.section.curriculum.name}</td>
      <td>{item.section.name}</td>
      <td>{item.payment_scheme_id}</td>
      <td>{item.updated_at}</td>
    </tr>
  );
}
