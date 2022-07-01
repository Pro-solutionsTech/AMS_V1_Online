import React from "react";
import styles from "./CollectionReportPerPartiComponent.module.css";
import { formatToCurrency } from "../../../repository/base";

export default function NonStudentPerParticular({
  nonstudents,
  forPrint = false,
}) {
  return (
    <div>
      <div className={!forPrint ? styles.particularDetailsContainer : ""}>
        <table className={!forPrint ? styles.smartTable : ""}>
          <thead
            className={
              !forPrint
                ? `${styles.smartTableHeader} ${styles.smartTableHeaderWithColor}`
                : ""
            }
          >
            <tr>
              <th className={forPrint ? styles.noPadding : ""}>
                NON STUDENT PER FINANCE CATEGORY
              </th>
              <th className={forPrint ? styles.noPadding : ""}>
                TOTAL COLLECTION
              </th>
            </tr>
          </thead>
          <tbody className={!forPrint ? styles.smartTableBody : ""}>
            {nonstudents.map((nonstudent) => {
              return (
                <tr key={nonstudent.id}>
                  <td>{nonstudent.finance_category}</td>
                  <td>{formatToCurrency(nonstudent.total)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
