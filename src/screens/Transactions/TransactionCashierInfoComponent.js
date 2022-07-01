import React from "react";
// import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import styles from "./TransactionCashierInfoComponent.module.css";

const TransactionCashierInfoComponent = (props) => {

  const selectedUser = useSelector(state => state.user)
  const middleName = `${selectedUser.middle_name}` ? `${selectedUser.middle_name == null ? '' : selectedUser.middle_name}` : ''
  const firstName = `${selectedUser.first_name}` ? `${selectedUser.first_name == null ? '' : selectedUser.first_name}` : ''
  const lastName = `${selectedUser.last_name}` ? `${selectedUser.last_name == null ? '' : selectedUser.last_name}` : ''
  const empNo = `${selectedUser.employee_no}` ? `${selectedUser.employee_no == null ? '' : selectedUser.employee_no}` : ''


  return (
    <>
      <div className={styles.TransactionCashierInfoComponent}>
        <h3 className={styles.TransactionCashierInfoTitle}>
          Cashier Information
        </h3>
        <div className={styles.smartFields}>
          <div className={styles.smartField}>
            <div className={styles.smartFieldLabel}>Cashier ID</div>
            <div className={styles.smartFieldValue}>{empNo}</div>
          </div>
          <div className={styles.smartField}>
            <div className={styles.smartFieldLabel}>Last Name</div>
            <div className={styles.smartFieldValue}>{lastName}</div>
          </div>
          <div className={styles.smartField}>
            <div className={styles.smartFieldLabel}>First Name</div>
            <div className={styles.smartFieldValue}>{firstName}</div>
          </div>
          {middleName ? (
            <div className={styles.smartField}>
              <div className={styles.smartFieldLabel}>Middle Name</div>
              <div className={styles.smartFieldValue}>{middleName}</div>
            </div>
          ) : ''}

        </div>
      </div>
    </>
  );
};

export default TransactionCashierInfoComponent;
