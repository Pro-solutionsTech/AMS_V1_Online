import React from "react";
import styles from "./CollectionReportAllTransComponent.module.css";
import { formatToCurrency } from "../../../repository/base";

export default function ListPerParticular({
  forPrint = false,
  listPerParticular,
}) {
  return (
    <div>
      <div className={!forPrint ? styles.transactionDetailsContainer : ""}>
        <table className={!forPrint ? styles.smartTable : ""}>
          <thead
            className={
              !forPrint
                ? `${styles.smartTableHeader} ${styles.smartTableHeaderWithColor}`
                : ""
            }
          >
            <tr>
              <th className={forPrint ? styles.noPadding : ""}>ECR NO</th>
              <th className={forPrint ? styles.noPadding : ""}>SCHOOL YEAR</th>
              <th className={forPrint ? styles.noPadding : ""}>NAME</th>
              <th className={forPrint ? styles.noPadding : ""}>GRADE</th>
              <th className={forPrint ? styles.noPadding : ""}>SECTION</th>
              <th className={forPrint ? styles.noPadding : ""}>PARTICULAR</th>
              <th className={forPrint ? styles.noPadding : ""}>AMOUNT(₱)</th>
              <th className={forPrint ? styles.noPadding : ""}>
                TRANSACTION DATE
              </th>
            </tr>
          </thead>
          <tbody className={!forPrint ? styles.smartTableBody : ""}>
            {listPerParticular.map((item) => (
              <tr key={item.id}>
                <td>{item.ecr_no}</td>
                <td>{item.school_year}</td>
                <td>{`${item.last_name}, ${item.first_name} ${item.middle_name}`}</td>
                <td>{item.grade}</td>
                <td>{item.section}</td>
                <td>{item.name}</td>
                <td>{formatToCurrency(item.amount)}</td>
                <td>{item.transaction_date.split("T")[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
