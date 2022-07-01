import React from "react";
import styles from "./ReportSummary.module.css";
import { formatToCurrency } from '../../../repository/base';

export default function ReportSummary({ formData, totalCollection, forPrint = false }) {
  return (
    <>
      {forPrint && <p>============================================================</p>}
      <div className={!forPrint ? styles.ReportSummaryComponent : ''}>
        <h2 className={forPrint ? styles.noMargin : ''}>Report Summary</h2>
        <div className={!forPrint ? styles.ReportSummaryComponentRow : ''}>
          <h4>Cash on Hand (Begin):</h4>
          <p>{formData ? formData.cashBegin : 0.0}</p>
        </div>
        <div className={!forPrint ? styles.ReportSummaryComponentRow : ''}>
          <h4>Total Daily Collection:</h4>
          <p>{formatToCurrency(totalCollection)}</p>
        </div>
        <div className={!forPrint ? styles.ReportSummaryComponentRow : ''}>
          <h4>Total Collection:</h4>
          <p>{formatToCurrency(totalCollection)}</p>
        </div>
        <div className={!forPrint ? styles.ReportSummaryComponentRow : ''}>
          <h4>Cash Submitted:</h4>
          <p>{formData.cashSubmitted}</p>
        </div>
        <div className={!forPrint ? styles.ReportSummaryComponentRow : ''}>
          <h4>Cash on Hand (End):</h4>
          <p>{formData.cashEnd}</p>
        </div>
      </div>
    </>
  );
}
