import React from "react";
import CollectionReportPerPartiComponent from "../../commons/CollectionReport/CollectionReportPerPartiComponent";
import ReportsInfoComponent from "../../commons/ReportsInfo/ReportsInfoComponent";
import styles from "../Reports.module.css";

const Perparticular = (props) => {
  return (
    <div>
      <div className={styles.ReportHeader}>
        <h2>Reports</h2>
      </div>
      <ReportsInfoComponent />
      <CollectionReportPerPartiComponent />
    </div>
  );
};

export default Perparticular;
