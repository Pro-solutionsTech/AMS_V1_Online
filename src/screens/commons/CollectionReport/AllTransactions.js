import React from "react";
import Moment from "react-moment";
import styles from "./CollectionReportAllTransComponent.module.css";
import { formatToCurrency } from "../../../repository/base";

export default function AllTransactions({ reports, forPrint = false }) {
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
              <th className={forPrint ? styles.noPadding : ""}>ECR NO.</th>
              <th className={forPrint ? styles.noPadding : ""}>OR NO.</th>
              <th className={forPrint ? styles.noPadding : ""}>PARTICULAR/STUDENT</th>
              <th className={forPrint ? styles.noPadding : ""}>CATEGORY/NON-STUDENT</th>
            
              <th className={forPrint ? styles.noPadding : ""}>AMOUNT(₱)</th>
              <th className={forPrint ? styles.noPadding : ""}>DATE</th>
              <th className={forPrint ? styles.noPadding : ""}>TIME</th>
            </tr>
          </thead>
          {console.log(reports)}
          <tbody className={!forPrint ? styles.smartTableBody : ""}>
            {reports.map((report, index) => (
              <tr
                style={
                  report.is_reversal | report.income_is_reversal
                    ? { color: "red" }
                    : {}
                }
                key={index}
              > 
              
                <td>{report.ecr_no}</td>
                <td>{report.or_no}</td>
                <td>
                  { report.name === null ? "N/A" : report.name}
                   
                </td>
                <td>{ report.category_name === null ? "N/A" : report.category_name}</td>
                
                <td>
                  {/* {report.is_reversal | report.income_is_reversal
                    ? formatToCurrency(-Math.abs(report.amount))
                    : report.receive_from
                      ? formatToCurrency(report.transaction_amount)
                      : formatToCurrency(report.amount)} */}
                      {   report.is_reversal | report.income_is_reversal
                    ? formatToCurrency(-Math.abs(report.transaction_amount? report.amount : report.income_amount )) 
                     : report.receive_from 
                      ? formatToCurrency(report.income_amount)
                      : report.amount === null ? formatToCurrency(report.transaction_amount) : formatToCurrency(report.amount)
                      }
                </td>
             
                <td>
                  <Moment format="MMM DD, YYYY">{report.created_at}</Moment>
                </td>
                <td>
                  <Moment format="LT">{report.created_at}</Moment>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
