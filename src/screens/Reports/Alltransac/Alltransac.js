import React from "react";
import CollectionReportAllTransComponent from "../../commons/CollectionReport/CollectionReportAllTransComponent";
import ReportsInfoComponent from "../../commons/ReportsInfo/ReportsInfoComponent";
import styles from "../Reports.module.css";

// import { Link } from "react-router-dom"

const Alltransac = (props) => {
  return (
    <div>
      <div className={styles.ReportHeader}>
        <h2>Reports</h2>
      </div>
      <ReportsInfoComponent />
      <CollectionReportAllTransComponent />
    </div>
  );
};

export default Alltransac;
