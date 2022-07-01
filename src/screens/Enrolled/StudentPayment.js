import React from "react";
import styles from "./StudentPayment.module.css";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import Moment from "react-moment";
import moment from "moment";
import printJS from "print-js";
import { saveTransaction } from "../../repository/TransactionRepository";
import Swal from 'sweetalert2';
import PrintReceipt from './PrintReceipt';

export default function StudentPayment() {
  const history = useHistory();

  const studentPayment = useSelector((state) => state.studentPayment);

  const { particulars, studentDetails, transaction, payment, change } = studentPayment;

  let totalDue = 0.0;
  let balance = 0.0;

  for (let i = 0; i < particulars.length; i++) {
    let particular = particulars[i];

    totalDue += parseFloat(particular.amount);
    balance +=
      parseFloat(particular.particular.balance) - parseFloat(particular.amount);
  }

  const date = Date.now();

  const printReceipt = () => {
    printJS({
      printable: 'receipt',
      type: 'html',
      targetStyles: ['*'],
      font_size: '13px',
      style: "*{font-family: Calibri;}"
    });
  }

  // const saveOR = (e) => {
  //   const orNo = e.target.querySelector("input").value;

  //   e.target.querySelector("button").style.display = "none";

  //   transaction.or_no = orNo;
  //   saveTransaction(transaction);

  //   Swal.fire('Success', 'OR No. Saved!', 'success');

  //   e.preventDefault();
  // };

  return (
    <div>
      <div className={styles.studentPaymentContainer}>
        <h3 className={styles.backButton}>
          <a onClick={() => history.goBack()} href="#">
            &lt;- Payment Process
          </a>
        </h3>

        <header className={styles.studentPaymentHeader}>
          <form className={styles.offialReceiptForm}>
            <label
              htmlFor="officialReceipt"
              className={styles.officialReceiptLabel}
            >
              OFFICIAL RECEIPT NO.
            </label>
            <input type="text" className={styles.officialReceiptField} value={studentPayment.transaction.or_no} disabled />
            {/* <button type="submit" className={styles.studentPaymentBtn}>
              SAVE
            </button> */}
          </form>
        </header>

        <div className={styles.print}>
          {/* <label htmlFor="file"  className={styles.studentPaymentBtn}>Print</label>
          <input id="file" type="file" onChange={printReceipt} style={{display: 'none'}} /> */}
          <button
            className={styles.studentPaymentBtn}
            onClick={printReceipt}
          >
            Print
          </button>
        </div>

        <div className={styles.studentPaymentTableContainer}>
          <table className={styles.smartTable}>
            <thead className={styles.smartTableHeader}>
              <tr></tr>
              <tr></tr>
            </thead>
            <tbody className={styles.smartTableBody}>
              <tr className={styles.studentInfoTableRow}>
                <td>{studentDetails.studentNo}</td>
                <td>
                  <Moment format="DD-MMMM-YYYY / hh:mm">{date}</Moment>
                </td>
              </tr>

              <tr className={styles.studentInfoTableRow}>
                <td>{`${studentDetails.lastName}, ${studentDetails.firstName} ${studentDetails.middleName}`}</td>
                <td>{transaction.ecr_no}</td>
              </tr>

              <tr className={styles.studentInfoTableRow}>
                <td>{`${studentDetails.grade} - ${studentDetails.section}`}</td>
                {/* <td>{balance.toLocaleString()}</td> */}
                <td></td>
              </tr>

              <tr>
                <td>
                  <br />
                </td>
              </tr>

              {particulars.map((particular) => (
                <tr
                  key={particular.particular.id}
                  className={styles.studentPaymentTableRow}
                >
                  <td>{particular.particular.name}</td>
                  <td>{particular.amount.toLocaleString()}</td>
                </tr>
              ))}

              <tr>
                <td>
                  <br />
                </td>
              </tr>

              <tr className={styles.studentPaymentTableRow}>
                <td>Total Due</td>
                <td>{totalDue.toLocaleString()}</td>
              </tr>

              <tr className={styles.studentPaymentTableRow}>
                <td>Payment</td>
                <td>{Number(payment).toLocaleString()}</td>
              </tr>

              <tr className={styles.studentPaymentTableRow}>
                <td>Change</td>
                <td>{change.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <PrintReceipt
        idNumber={studentDetails.studentNo}
        date={date}
        studentName={`${studentDetails.lastName}, ${studentDetails.firstName} ${studentDetails.middleName}`}
        ecr={transaction.ecr_no}
        gradeAndSection={`${studentDetails.grade} - ${studentDetails.section}`}
        balance={balance}
        particulars={particulars}
        totalDue={totalDue}
        payment={payment}
        change={change}
      />
    </div>
  );
}
