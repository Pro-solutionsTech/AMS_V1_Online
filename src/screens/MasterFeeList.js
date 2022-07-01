import styles from "./MasterFeeList.module.css";
import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {getOfflineMasterFees} from "../repository/MasterFeeRepository";

export default function MasterFeeList({credentialsState}) {
  const [masterFees, setMasterFees] = useState([]);

  useEffect(() => {
    getOfflineMasterFees().then((data) => {
      setMasterFees(data);
    });
  }, []);

  return (
    <div className={styles.MasterFeeList}>
      <header className={styles.MasterFeeListHeader}>
        Lampara AMS MasterFeeList
      </header>
      <section className={styles.MasterFeeListBody}>
        {masterFees.map((masterFee) => (
          <div>
            <h2>{masterFee.name}</h2>
            <small>{masterFee.description}</small>
          </div>
        ))}
      </section>
      <Link to="/students">Student List</Link>
    </div>
  );
}
