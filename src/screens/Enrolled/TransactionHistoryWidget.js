import React, { useReducer, useState, useEffect } from "react";
import styles from "./TransactionHistoryWidget.module.css";
import { formatToCurrency } from "../../repository/base";
import styles2 from "./TransactionHistoryModal.module.css";
import TransactionHistoryModal from "./TransactionHistoryModal";
import {
  getOfflineTransactionPaidParticular,
  getofflineGetCashierInfo,
} from "../../repository/StudentPaymentRepository";
import "./Loader.css";
import printJS from "print-js";
import stylesP from "./PrintReceipt.module.css";
import moment from "moment";


export default function TransactionHistoryWidget({
  transactions,
  enrollment,
  paidParticulars,
  transactionHistory,
}) {
  let currentBalance = enrollment.payment_plan_items_list
    .map((item) => {
      return parseFloat(item.amount);
    })
    .reduce((previous, current) => previous + current, 0);

  const studentsPaidParticulars = [];

  paidParticulars.map((paidParticular) => {
    if (paidParticular.student_id === enrollment.id) {
      studentsPaidParticulars.push(paidParticular.student_payment_id);
    }
  });

  let studentsTransactions = [];

  transactions.map((transaction) => {
    if (studentsPaidParticulars.includes(transaction.student_payment_id)) {
      studentsTransactions.push(transaction);
    }
  });

  const [paidtransactionList, settransactionData] = useState(null);

  const [isPopupOpen, setPopupOpen] = useState(false);
  const [transactionDetail, settransactionDetail] = useState(null);
  const [transactionDetailEcr, settransactionDetailEcr] = useState(null);
  const [transactionDetailOr, settransactionDetailOr] = useState(null);
  const [transactionDetailDate, settransactionDetailDate] = useState(null);
  const [transactionDetailTotal, settransactionDetailTotal] = useState(null);
  const [cashierName, setCashierName] = useState(null);

  const handleSubmit = (id, ecr_no, or_no, date, total) => {
    setPopupOpen(true);
    settransactionDetailEcr(ecr_no);
    settransactionDetailOr(or_no);
    settransactionDetailDate(date);
    settransactionDetailTotal(total);
    const initial = ecr_no?.split("-")[1];

   loading = true;
   if (ecr_no === null){
      setCashierName(null);
   } 
   else 
   {
       getofflineGetCashierInfo(initial).then((data)=> {
      setCashierName(data);
    });
   }
   
    getOfflineTransactionPaidParticular(id).then((data) => {
      settransactionData(data);
    });
  };
  const handleClose =()=> {
    settransactionData(null);
    setPopupOpen(false);
  }
   const printParticulars = () => {
    printJS({
      printable: "printMe",
      type: 'html',
      targetStyles: ['*'],
      font_size: '13px',
      style: "*{font-family: Calibri;}"
    });
  };
    //loader
    
  let loading;
  paidtransactionList === null ? loading = true : loading = false;

  // for receipt format codes
  let cName;
  if (cashierName == null )
  {
     cName  = "NO ASSIGN";
  }
  else 
  {
     cName = cashierName?.length > 0 && cashierName.map((name)=> (
      name.full_name))
  }
  const data = paidtransactionList; 
  // for receipt format codes
const date = moment(transactionDetailDate).format("MMM DD, YYYY/ h:mm:ss a" );
console.log(transactionDetailDate);
  return (
    <div>
      {transactionHistory.length > 0 && (
        <div className={styles.transactionDetailsContainer}>
          <div className={styles.transactionDetailsHeader}>
            <h3 className={styles.smartTableTitle}>Transaction History</h3>
          </div>
          <table className={styles.smartTable}>
            <thead
              className={`${styles.smartTableHeader} ${styles.smartTableHeaderWithColor}`}
            >
              <tr>
                <th>DATE</th>
                <th>ECR NO.</th>
                <th>OR NO.</th>
                <th>FINANCE ACCOUNT</th>
                <th>PAYMENT METHOD</th>
                <th>PREVIOUS BALANCE(₱)</th>
                <th>PAID AMOUNT(₱)</th>
                <th>CURRENT BALANCE(₱)</th>
                <th></th>
              </tr>
            </thead>
            <tbody className={styles.smartTableBody}>
              {transactionHistory.map((transaction) => {
                return (
                  <tr
                    key={transaction.id}
                    style={transaction.is_reversal ? { color: "red" } : {}}
                  >
                    <td>{transaction.created_at.split("T")[0]}</td>
                    <td>
                      {transaction.ecr_no ? transaction.ecr_no : "No Assign"}
                    </td>
                    <td>
                      {transaction.or_no ? transaction.or_no : "No Assign"}
                    </td>
                    <td>{transaction.finance_account}</td>
                    <td>{transaction.payment_method}</td>
                    <td>{formatToCurrency(currentBalance)}</td>
                    <td>
                      <a onClick={() => setPopupOpen(!isPopupOpen)}>
                        {formatToCurrency(transaction.amount)}
                      </a>
                    </td>

                    <td>
                      {formatToCurrency((currentBalance -= transaction.amount))}
                    </td>
                    <td>
                      <img
                        style={{ alignContent: "center", marginLeft: "-50px" }}
                        className={styles2.image}
                        src="./img/icon-eye.png"
                        alt="img"
                        onClick={() =>
                          handleSubmit(
                            transaction.id,
                            transaction.ecr_no,
                            transaction.or_no,
                            transaction.created_at,
                            transaction.amount
                          )
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {/**/}
  
    <div style={{ position: "absolute", left: "-9999em" }}>
      <pre id="printMe" className={stylesP.receiptContainer}>
        <div className={stylesP.receiptContent}>
          <div className={stylesP.receiptHeader}>
            
          </div>

          <div className={stylesP.receiptInfo}>
                <p>LIST OF PAID PARTICULARS</p>
             <div className={stylesP.receiptInfoRow}>
              <p>OR:{transactionDetailOr}</p>
              <p>{date}</p>
            </div>

            <div className={stylesP.receiptInfoRow}>
              <p>{cName}</p>
              <p>{transactionDetailEcr}</p>
            </div>

            
          </div>

                      <div className={`${stylesP.receiptPayment} ${stylesP.marginTop}`}>
                       
                          
                              {data?.length > 0 &&
                                data.map((item) => (
                                  <div className={stylesP.receiptPaymentParticular}>
                                    <p >
                                      {item.name}
                                    </p>
                                    <p >
                                      {"₱ " +item.amount}
                                    </p>
                                 </div>
                                ))}
                          
                      

                        <div
                          className={`${stylesP.receiptPaymentParticular} ${stylesP.marginTop}`}
                        >
                           
                        </div><div
                          className={`${stylesP.receiptPaymentParticular} ${stylesP.marginTop}`}
                        >
                          <p>TOTAL AMOUNT</p>
                          <p>{"₱ "+transactionDetailTotal}</p>
                        </div>
                      </div>

                      <div className={stylesP.receiptFooter}></div>
                    </div>
                  </pre>
                </div>
      {/* start */}

      {isPopupOpen ? (
        <div className={styles2.container} >
          <div className={styles2.modal} >

        
            <div className={styles2.row} >
              <div className={styles2.column1}>
                <div></div>
                <div>
                  <div className={styles2.grid}>
                    <div> </div>
                    <div>
                      {" "}
                      <h1 >LIST OF PAID AMOUNT</h1>
                    </div>
                    <div>
                      {" "}
                      <button
                        className={styles2.btn_close}
                        onClick={() =>handleClose()}
                      >
                        {" "}
                        &#10005;
                      </button>
                    </div>
                  </div>
                </div>
                <div></div>
              </div>

            {/* loader */}
            <div style ={{marginLeft: '45%',marginTop : '15%' ,marginBottom : '200%' , display: (loading ? 'block' : 'none') }} className="load_container">
              <div className="loader" > 
                <span></span>
              </div>
            </div>
              <div className={styles2.column2} >
              <TransactionHistoryModal 
                paidtransactionList={paidtransactionList}
                transactionDetail={transactionDetail}
                or_no={transactionDetailOr}
                ecr_no={transactionDetailEcr}
                transaction_date={transactionDetailDate}
                cashier_name={cashierName}
                total_amount={transactionDetailTotal}
              />
           </div>
              <div className={styles2.column3}>
                <div></div>

                <div>
                  <button
                    className={styles2.btn}
                    onClick={() => printParticulars() }
                  >
                    {" "}
                    Print
                  </button>
                </div>
                <div>
                  <button
                    className={styles2.btn}
                    onClick={() =>handleClose()}
                  >
                    {" "}
                    Back
                  </button>
                </div>
                <div></div>
              </div>
              {/* print  */}

    

            </div>
          </div>
        </div>



      ) : null}
      {/* end */}
    </div>
  );
}
