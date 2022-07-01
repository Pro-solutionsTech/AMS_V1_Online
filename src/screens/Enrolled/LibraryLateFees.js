import React from "react";
import styles from "./LibraryLateFees.module.css";
import Moment from "react-moment";
import { formatToCurrency } from "../../repository/base";
export default function LibraryLateFeesTbl({ style, late_fees, withCheckBox, filterableParticularsDispatch }) {
  let today = new Date().toISOString().split("T")[0];

  return (
    <>
      <div className={styles.periodDetailsContainer} style={style}>
        <div className={styles.periodDetailsHeader}>
          <h3 className={styles.smartTableTitle}>Library Late Fees</h3>
        </div>
        <table className={styles.smartTable}>
          <thead
            className={`${styles.smartTableHeader} ${styles.smartTableHeaderWithColor}`}
          >
            <tr>
              <th>DATE BARROWED</th>
              <th>BOOK TITLE</th>
              <th>RETURN DATE</th>
              <th>NO. OF DAYS LATE</th>
              <th>LATE FEES(₱)</th>
              <th>STATUS</th>
              {withCheckBox && (
                <th></th>
              )}
            </tr>
          </thead>
          <tbody className={styles.smartTableBody}>
            {late_fees?.map((item) => {
              const oneDay = 24 * 60 * 60 * 1000; // hoursminutesseconds*milliseconds
             
              const secondDate = new Date(item.return_date);
              const firstDate = new Date(today);

              const diffDays = Math.round(
                Math.abs((firstDate - secondDate) / oneDay)
              );
         
              return (
                <tr key={item.id}>
                  <td>
                    <Moment format="MMM DD, YYYY">{item.created_at}</Moment>
                  </td>
                  <td>{item.book_title}</td>
                  <td>{item.return_date}</td>
                  <td>{item.paid == "Paid" ? "Done" : diffDays}</td>
                  <td>{formatToCurrency(item.late_fee)}</td>
                  <td>{item.paid}</td>
                  {withCheckBox && (
                    <td>
                      <input type='checkbox' onClick={() => {
                        filterableParticularsDispatch({
                          type: "TOGGLE_PARTICULAR",
                          id: item.id,
                          amount: item.late_fee
                        })
                      }} />
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
