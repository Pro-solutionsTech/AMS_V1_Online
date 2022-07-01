import React, { useEffect, useState } from "react";
import styles from "./ProcessPayment.module.css";
import { getOfflineEnrollment } from "../../repository/EnrollmentRepository";
import { offlineDatabaseError } from "../../repository/base";
import { getOfflinePaymentSchemes } from "../../repository/PaymentSchemeRepository";
import { getOfflinePaymentPlanItems } from "../../repository/PaymentPlanItemRepository";
import { getOfflineParticulars  } from "../../repository/ParticularRepository";
import { getOfflinePaidParticulars , getofflineSelectOnePaidParticularsReversal } from "../../repository/PaidParticularRepository";
import { getOfflineTransactions } from "../../repository/TransactionRepository";
import { getOfflineallAddtionalFeeByEnrollId } from "../../repository/PaidAddittionalFeeRepository";
import { getOfflineLateFeeById } from "../../repository/LibraryLateFeeRepository";
import { Link, useParams } from "react-router-dom";
import EnrollmentCommonDetails from "./EnrollmentCommonDetails";
import PaymentDetails from "./PaymentDetails";
import { useDispatch } from "react-redux";

export default function ProcessPayment() {
  const { id } = useParams();

  const dispatch = useDispatch();

  const [enrollment, setEnrollment] = useState(null);
  const [particulars, setParticulars] = useState(null);
  const [paidParticulars, setPaidParticulars] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [allAdditionFee, setadditionFee] = useState(null);
  const [lateFees, setLateFees] = useState(null);

  useEffect(() => {
    getOfflinePaymentPlanItems().then((payment_plan_items) => {
      getOfflinePaymentSchemes().then((paymentSchemes) => {
        getOfflineEnrollment(id, paymentSchemes, payment_plan_items)
          .then((enrollment) => {
            setEnrollment(enrollment);
            dispatch({ type: "GET_STUDENT_DETAILS", payload: enrollment });
          })
          .catch(offlineDatabaseError);
      });
    });

    getOfflineParticulars().then(setParticulars).catch(offlineDatabaseError);
    getofflineSelectOnePaidParticularsReversal(id)
      .then(setPaidParticulars)
      .catch(offlineDatabaseError);

    getOfflineTransactions().then(setTransactions).catch(offlineDatabaseError);

    getOfflineallAddtionalFeeByEnrollId(id)
      .then(setadditionFee)
      .catch(offlineDatabaseError);

    getOfflineLateFeeById("request_by", id).then((fees) =>
      setLateFees(fees.reverse().filter((fee) => fee.paid !== "Paid"))
    );
  }, []);
  let loading = true;
  enrollment === null ? loading = true : loading = false;
  return (
    <div className={styles.studentFinancesContainer}>
      <h3 className={styles.backButton}>
        <Link to={`/enrollments/${id}`}>&lt;- Student Finances</Link>
      </h3>
      <header className={styles.studentFinancesHeader}>
        <h2>Process Payment</h2>
      </header>

       {/* loader */}
          <div style ={{marginLeft: '45%',marginTop : '15%' , display: (loading ? 'block' : 'none') }} className="load_container">
            <div className="loader" > 
              <span></span>
            </div>
          </div>

      {enrollment && (
        <div>
          <EnrollmentCommonDetails enrollment={enrollment} />
          {allAdditionFee && (
            <PaymentDetails
              id={id}
              totalPayableAmount={60000}
              outstandingBalance={12000}
              paymentSchemeParticulars={enrollment.paymentSchemeParticulars}
              enrollment={enrollment}
              particulars={particulars}
              paidParticulars={paidParticulars}
              withAdditionalFees={true}
              allAdditionFee={allAdditionFee}
              withLateFees={true}
              lateFees={lateFees}
            />
          )}
        </div>
      )}
    </div>
  );
}
