import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./StudentFinance.module.css";
import { getOfflineEnrollment } from "../../repository/EnrollmentRepository";
import { offlineDatabaseError } from "../../repository/base";
import { getOfflinePaymentSchemes } from "../../repository/PaymentSchemeRepository";
import { Link, useParams } from "react-router-dom";
import EnrollmentCommonDetails from "./EnrollmentCommonDetails";
import PaymentDetails from "./PaymentDetails";
import { getOfflinePaymentPlanItems } from "../../repository/PaymentPlanItemRepository";
import { getOfflineallTransaction } from "../../repository/base";

import { getOfflineParticulars } from "../../repository/ParticularRepository";
import { getOfflinePaidParticulars, getOfflineSelectOnePaidParticulars, getofflineSelectOnePaidParticularsReversal } from "../../repository/PaidParticularRepository";
import { getOfflineTransactions } from "../../repository/TransactionRepository";
import { getOfflinePaymentPeriods } from "../../repository/PaymentPeriodRepository";
import { getOfflineLateFeeById } from "../../repository/LibraryLateFeeRepository";
import {
  saveRemark,
  getOfflineRemaks,
} from "../../repository/RemarksRepository";
import { getOfflineStudentPayments } from "../../repository/StudentPaymentRepository";
import {
  getOfflinePaymentMethod,
  getOfflineFinanceAccount,
} from "../../repository/StudentPaymentRepository";
import { getOfflineallAddtionalFeeByEnrollId } from "../../repository/PaidAddittionalFeeRepository";

import { createUUID } from "../../repository/base";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import TransactionHistoryWidget from "./TransactionHistoryWidget";
import PaymentPeriodWidget from "./PaymentPeriodWidget";
import Moment from "react-moment";
import AdditionalFeesTbl from "./AdditionalFeesTbl";
import LibraryLateFeesTbl from "./LibraryLateFees";
import StatementOfAccount from "./StatementOfAccount";
import printJS from "print-js";

export default function Enrolled() {
  const { id } = useParams();
  const selectedUser = useSelector((state) => state.user);
  const [enrollment, setEnrollment] = useState(null);
  const [particulars, setParticulars] = useState(null);
  const [paidParticulars, setPaidParticulars] = useState(null);
  const [historyPaidParticulars, setHistoryPaidParticulars] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState(null);

  const [financeaccounts, setFinanceAccount] = useState(null);
  const [paymentmethods, setPaymentMethod] = useState(null);
  const [studentpayment, setStudentPayment] = useState(null);

  const [paymentPeriods, setPaymentPeriods] = useState(null);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [remark, setRemark] = useState("");
  const [allRemarks, setRemarks] = useState(null);
  const [allAdditionFee, setadditionFee] = useState(null);
  const [late_fees, setLateFee] = useState(null);
  let date = new Date();

  console.log(historyPaidParticulars);
  console.log(id);
  useEffect(() => {
    getOfflineRemaks(id).then(setRemarks).catch(offlineDatabaseError);
    getOfflineallAddtionalFeeByEnrollId(id)
      .then(setadditionFee)
      .catch(offlineDatabaseError);
  }, []);
  useEffect(() => {
    getOfflineLateFeeById("request_by", id)
      .then(setLateFee)
      .catch(offlineDatabaseError);
  }, []);

  useEffect(() => {
    getOfflinePaymentPlanItems().then((payment_plan_items) => {
      getOfflinePaymentSchemes().then((paymentSchemes) => {
        getOfflineEnrollment(id, paymentSchemes, payment_plan_items)
          .then(setEnrollment)
          .catch(offlineDatabaseError);
      });
    }, []);

    getOfflineParticulars().then(setParticulars).catch(offlineDatabaseError);
    getofflineSelectOnePaidParticularsReversal(id)
      .then(setPaidParticulars)
      .catch(offlineDatabaseError);

    getOfflineSelectOnePaidParticulars(id)
      .then(setHistoryPaidParticulars)
      .catch(offlineDatabaseError);

    getOfflineallTransaction()
      .then(setTransactions)
      .catch(offlineDatabaseError);
    getOfflinePaymentMethod()
      .then(setPaymentMethod)
      .catch(offlineDatabaseError);
    getOfflineFinanceAccount()
      .then(setFinanceAccount)
      .catch(offlineDatabaseError);
    getOfflineStudentPayments()
      .then(setStudentPayment)
      .catch(offlineDatabaseError);

    getOfflinePaymentPeriods()
      .then(setPaymentPeriods)
      .catch(offlineDatabaseError);

    getOfflineallTransaction("student_payments.enrollment_id", id)
      .then(setTransactionHistory)
      .catch(offlineDatabaseError);
  }, []);
  function handleRemarkSubmit(e) {
    const remark_object = {
      id: createUUID(),
      staff_id: selectedUser.staff_id,
      student_id: id,
      remarks: remark,
      created_at: new Date().toISOString(),
      is_synced: false,
    };
    saveRemark(remark_object);
    setRemarks([
      { ...remark_object, initial: selectedUser.initial },
      ...allRemarks,
    ]);
    setRemark("");
    e.preventDefault();
    toast.info("Remark successfully added", {
      className: styles.toast,
    });
  }

  const printSOA = () => {
    printJS({
      printable: "soa",
      type: "html",
      targetStyles: ["*"],
      font_size: "13px",
      style: "*{font-family: Calibri;}",
    });
  };
  let loading = true;
  enrollment === null ? (loading = true) : (loading = false);
  return (
    <div>
      <div className={styles.studentFinancesContainer}>
        <h3 className={styles.backButton}>
          <Link className={styles.studentFinancesTitle} to={"/enrollments"}>
            &#129128; Student Details
          </Link>
        </h3>
        <header className={styles.studentFinancesHeader}>
          <div></div>
          <button
            type="button"
            className={styles.processPaymentButton}
            onClick={printSOA}
          >
            PRINT SOA
          </button>
          <Link to={`/enrollments/${id}/process-payment`}>
            <button type="button" className={styles.processPaymentButton}>
              PROCESS PAYMENT
            </button>
          </Link>
          <div className={`${styles.icons} ${styles.popupIcon}`}>
            <img
              src={
                allRemarks && allRemarks.length
                  ? "./img/icon-remarks-popup.png"
                  : "./img/icon-remarks-empty-popup.png"
              }
              alt="img icon"
              onClick={() => setPopupOpen(!isPopupOpen)}
            />
            <div
              className={`${styles.popupRemarks} popup-container ${isPopupOpen ? styles.popupOpen : ""
                }`}
            >
              <h3 className={styles.heading}>Add Remarks</h3>

              <p className={styles.subheading}>Remarks:</p>
              <form onSubmit={handleRemarkSubmit}>
                <textarea
                  required
                  name="paragraph_text"
                  rows="10"
                  className={styles.inputremarks}
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                ></textarea>
                <button type="submit">Add</button>
              </form>

              {allRemarks && allRemarks.length ? (
                <h3 className={styles.heading}>Remarks</h3>
              ) : (
                <h3 className={styles.heading}>No Remarks</h3>
              )}
              <div className={styles.remarksBody}>
                {allRemarks && allRemarks.length
                  ? allRemarks.map((item, index) => (
                    <div key={index}>
                      <h3
                        className={`${styles.heading}  ${styles.remarksHead}`}
                      >
                        {item.initial}{" "}
                        <span className={styles.bodyDate}>
                          <Moment format="DD-MMMM-YYYY | hh:mm a">
                            {item.created_at}
                          </Moment>
                        </span>
                      </h3>
                      <p className={styles.bodyContent}>{item.remarks}</p>
                    </div>
                  ))
                  : ""}
              </div>
            </div>
          </div>
        </header>

        {/* loader */}
        <div
          style={{
            marginLeft: "45%",
            marginTop: "15%",
            display: loading ? "block" : "none",
          }}
          className="load_container"
        >
          <div className="loader">
            <span></span>
          </div>
        </div>

        {enrollment && (
          <div>
            <EnrollmentCommonDetails enrollment={enrollment} />
            {allAdditionFee.length > 0 ? (
              <AdditionalFeesTbl
                allAdditionFee={allAdditionFee}
                withCheckBox={false}
              />
            ) : null}
            <br></br>
            <PaymentDetails
              id={id}
              paymentSchemeParticulars={enrollment.paymentSchemeParticulars}
              enrollment={enrollment}
              particulars={particulars}
              paidParticulars={paidParticulars}
              withCheckbox={false}
              transactions={transactions}
              allAdditionFee={allAdditionFee}
            />

            {late_fees.length > 0 ? (
              <LibraryLateFeesTbl late_fees={late_fees} />
            ) : null}

            <PaymentPeriodWidget
              paymentPeriods={paymentPeriods}
              enrollment={enrollment}
              transactions={transactions}
              paidParticulars={paidParticulars}
            />
            <TransactionHistoryWidget
              enrollment={enrollment}
              transactions={transactions}
              paidParticulars={historyPaidParticulars}
              transactionHistory={transactionHistory}
            />
          </div>
        )}
      </div>

      <StatementOfAccount
        school={selectedUser.school}
        enrollment={enrollment}
        transactions={transactionHistory}
      />
    </div>
  );
}
