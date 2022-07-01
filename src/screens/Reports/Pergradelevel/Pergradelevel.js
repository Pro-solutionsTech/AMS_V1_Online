import React from "react";
import CollectionReportPerGradeComponent from "../../commons/CollectionReport/CollectionReportPerGradeComponent";
import ReportsInfoComponent from "../../commons/ReportsInfo/ReportsInfoComponent";
import styles from "../Reports.module.css";

const Pergradelevel = (props) => {
  return (
    <div>
      <div className={styles.ReportHeader}>
        <h2>Reports</h2>
      </div>
      <ReportsInfoComponent />
      <CollectionReportPerGradeComponent />
    </div>
  );
};

export default Pergradelevel;
