import React, { useState, useEffect } from "react";
import { saveIncome } from "../../repository/IncomeRepository";
import { useSelector } from "react-redux";
import TransactionBasicInfoComponent from "./TransactionBasicInfoComponent";
import TransactionCashierInfoComponent from "./TransactionCashierInfoComponent";
import TransactionTransactionInfoComponent from "./TransactionTransactionInfoComponent";
import { getOfflinePaymentPlanItems } from "../../repository/PaymentPlanItemRepository";
import { getOfflinePaymentSchemes } from "../../repository/PaymentSchemeRepository";
import { getOfflineEnrollment } from "../../repository/EnrollmentRepository";
import {
  getOfflinePaidParticulars,
  updatePaidPaticularTranc,

} from "../../repository/PaidParticularRepository";
import { getOfflineParticulars } from "../../repository/ParticularRepository";
import {
  getOfflineTransactions,
  saveTransaction,
  getLatestECR,
  getOfflineTransactionOne,
  getOfflineSelectOnePaidParticularsTransac
} from "../../repository/TransactionRepository";
import { useParams, useHistory } from "react-router-dom";
import { PaymentPlanItem } from "../../entity/PaymentPlanItem";
import { offlineDatabaseError, offlineGetColumn } from "../../repository/base";
import styles from "./TransactionsStyle.module.css";
import { offlineLoginUser, saveUser } from "../../repository/UserRepository";
import { saveStudentPayment } from "../../repository/StudentPaymentRepository";
import {
  saveReversal,
  getOfflineReversalCheck,
} from "../../repository/ReversalRepository";

import {
  uploadOnlineRequestReversal,
  selectOneRequest,
} from "../../repository/RequestReversalRepository";

import { getOfflineIncomeOne } from "../../repository/IncomeRepository";
import { createUUID } from "../../repository/base";
import { getCashAccount } from "../../repository/FinanceAccountRepository";
import { getCashMethod } from "../../repository/PaymentMethodRepository";
import {
  getOfflineAdditionalFeePerTransaction,
  savePaidAdditionalFees,
} from "../../repository/PaidAddittionalFeeRepository";
import { getOfflineLateFeeById } from "../../repository/LibraryLateFeeRepository";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReversalComponent from "../commons/Reversal/ReversalComponent";
import TransactionReversalInfoComponent from "./TransactionReversalInfoComponent";
import PrintReceipt from "../Enrolled/PrintReceipt";
import axios from "axios";
import { getSettings } from "../../repository/SettingsRepository";
import { savePaidParticulars } from "../../repository/PaidParticularRepository";
import NonStudentReversal from "../NonStudent/NonStudentReversal";
import { offlineMessage } from "../../repository/base";
import Swal from "sweetalert2";
import printJS from "print-js";

const Transactions = ({ credentialsState, credentialsDispatch }) => {
  const user = useSelector((state) => state.user);
  const history = useHistory();
  const { id } = useParams();
  const selectedUser = useSelector((state) => state.user);
  const [enrollment, setEnrollment] = useState(null);
  const [transaction, setTransactions] = useState(null);
  const [paidParticulars, setPaidParticulars] = useState(null);
  const [particulars, setParticulars] = useState(null);
  const [popupOpen, isPopupOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [reason, setReason] = useState("");
  const [reversal, setReversal] = useState("");
  const [transactionOne, setOneTransaction] = useState("");
  const [studentId, setStudentId] = useState(null);
  const [financeAccountId, setFinanceAccountId] = useState(null);
  const [paymentMethodId, setPaymentMethodId] = useState(null);
  const [additionalFee, setAdditionalFee] = useState(null);
  const [lateFees, setLateFees] = useState(null);
  const [requestReversal, setRequestReversal] = useState(null);
  const [isRequestReversal, setisRequestReversal] = useState(false);
  const [incometransaction, setIncomeTransaction] = useState(null);
  const [stateSettings, setState] = useState({
    apiUrl: "",
    client_id: "",
    client_secret: "",
  });
  let date = new Date();


  useEffect(() => {
    getSettings().then((settings) => {
      setState({
        ...stateSettings,
        apiUrl: settings?.api_url || "",
        client_id: settings?.client_id || "",
        client_secret: settings?.client_secret || "",
      });
    });
  }, []);

  useEffect(() => {
    getOfflineReversalCheck(id).then(setReversal).catch(offlineDatabaseError);
    getCashAccount().then(setFinanceAccountId);
    getCashMethod().then(setPaymentMethodId);
  }, []);

  console.log(id);
  useEffect(async () => {
    selectOneRequest(id)
      .then(async (data_request) => {
        setRequestReversal(data_request);
        getOfflineTransactionOne(id).then(async (transaction) => {
          if (transaction.student_payment_id == null) {
            setOneTransaction(transaction);
            getOfflineIncomeOne(id)
              .then(async (income) => {
                setIncomeTransaction(income);
              })
              .catch(offlineDatabaseError);
          } else {
            getOfflineTransactions()
              .then((transactions) => {
                getOfflineSelectOnePaidParticularsTransac(id).then(

                  async (paidParticulars) => {

                    const transaction = transactions.filter(
                      (transaction) => transaction.id === id
                    );

                    setTransactions(transaction[0]);
                    console.log(transaction + "transaction object")
                    const student_id = await offlineGetColumn(
                      "student_payments",
                      "enrollment_id",
                      "id",
                      transaction[0].student_payment_id
                    );
                    const additionalFees =
                      await getOfflineAdditionalFeePerTransaction(
                        student_id,
                        transaction[0].student_payment_id
                      );
                    const libraryLateFee = await getOfflineLateFeeById(
                      "student_payment",
                      transaction[0].student_payment_id
                    );

                    setStudentId(student_id);
                    setAdditionalFee(additionalFees);
                    setLateFees(libraryLateFee);

                    // setPaidParticulars(
                    //   paidParticulars.filter(
                    //     (paidParticular) =>
                    //       paidParticular.student_payment_id ===
                    //       transaction[0].student_payment_id
                    //   )
                    // );
                    getOfflineSelectOnePaidParticularsTransac(id)
                      .then(setPaidParticulars)
                      .catch(offlineDatabaseError);

                    getOfflinePaymentPlanItems().then((paymentPlanItems) => {
                      getOfflinePaymentSchemes().then((paymentSchemes) => {
                        getOfflineEnrollment(
                          student_id,
                          paymentSchemes,
                          paymentPlanItems
                        )
                          .then(setEnrollment)
                          .catch(offlineDatabaseError);
                      });
                    });
                  }
                );
              })
              .catch(offlineDatabaseError);

            getOfflineParticulars()
              .then(setParticulars)
              .catch(offlineDatabaseError);
          }
        });
      })
      .catch(offlineDatabaseError);
  }, []);

  const printReceipt = () => {
    printJS({
      printable: "receipt",
      type: "html",
      targetStyles: ["*"],
      font_size: "13px",
      style: "*{font-family: Calibri;}",
    });
  };
  // for Offline
  // async function handleLoginSubmit(username, password, reason) {
  //   let latestEcr = await getLatestECR(selectedUser.initial);

  //   latestEcr = latestEcr ? latestEcr.split("-")[2] : "0000000000";

  //   latestEcr = parseInt(latestEcr) + 1;

  //   const zeroPaddedEcr = latestEcr.toString().padStart(10, "0");

  //   const data = {
  //     grant_type: "password",
  //     client_id: stateSettings.client_id,
  //     client_secret: stateSettings.client_secret,
  //     username: username,
  //     password: password,
  //   };

  //   const formData = new FormData();

  //   Object["entries"](data).forEach((keyValue) =>
  //     formData.append(keyValue[0], keyValue[1])
  //   );

  //   const reverseAdditionalFee =
  //     additionalFee &&
  //     additionalFee.map((fee) => ({ id: fee.id, is_reversal: true }));

  //   if (navigator.onLine) {
  //     return axios
  //       .post(`${stateSettings.apiUrl}/o/token/`, formData)
  //       .then((response) => {
  //         if (response.data.is_head == 1) {
  //           const datas = {
  //             id: response.data.id ? response.data.id : null,
  //             staff_id: response.data.staff_id ? response.data.staff_id : null,
  //             employee_no: response.data.employee_no
  //               ? response.data.employee_no
  //               : null,
  //             first_name: response.data.first_name
  //               ? response.data.first_name
  //               : null,
  //             last_name: response.data.last_name
  //               ? response.data.last_name
  //               : null,
  //             middle_name: response.data.middle_name
  //               ? response.data.middle_name
  //               : null,
  //             initial: response.data.initial ? response.data.initial : null,
  //             username: response.data.username ? response.data.username : null,
  //             password: response.data.password ? response.data.password : null,
  //             email: response.data.email ? response.data.email : null,
  //             designation: response.data.designation
  //               ? response.data.designation
  //               : null,
  //             is_head: response.data.is_head ? response.data.is_head : false,
  //             is_cashier: response.data.is_cashier
  //               ? response.data.is_cashier
  //               : false,
  //             school: response.data.school ? response.data.school : false,
  //           };
  //           saveUser(datas);
  //           if (
  //             transactionOne.student_payment_id == null &&
  //             incometransaction
  //           ) {
  //             const transactionObject = {
  //               id: transactionOne.id,
  //               amount: -Math.abs(transactionOne.amount),
  //               is_synced: false,
  //               created_at: new Date().toISOString(),
  //               is_reversal: true,
  //               ecr_no: transactionOne.ecr_no,
  //             };
  //             const reversal_object = {
  //               id: createUUID(),
  //               staff_id: datas.staff_id,
  //               initial: datas.initial,
  //               transaction_id: transactionOne.id,
  //               reason: reason,
  //               created_at: new Date().toISOString(),
  //               is_synced: false,
  //               is_reversal: true,
  //             };

  //             const incomeObject = {
  //               id: incometransaction.id,
  //               finance_category: incometransaction.finance_category,
  //               title: incometransaction.title,
  //               description: incometransaction.description,
  //               receive_from: incometransaction.receive_from,
  //               add_to: incometransaction.add_to,
  //               amount: incometransaction.amount,
  //               date: incometransaction.date,
  //               type: incometransaction.type,
  //               transaction: incometransaction.transaction,
  //               created_at: incometransaction.created_at,
  //               is_reversal: true,
  //               is_synced: false,
  //             };

  //             saveIncome(incomeObject);
  //             saveReversal(reversal_object);
  //             saveTransaction(transactionObject);
  //             setUsername("");
  //             setPassword("");
  //             setReason("");
  //             isPopupOpen(false);
  //             Swal.fire(
  //               "Success",
  //               "Transaction was successfully reverse.",
  //               "success"
  //             );
  //             isPopupOpen(false);
  //           } else {
  //             const student_payment_id = createUUID();

  //             const transactionObject = {
  //               ...transaction,
  //               id: createUUID(),
  //               student_payment_id,
  //               amount: -Math.abs(transaction.amount),
  //               is_synced: false,
  //               created_at: new Date().toISOString(),
  //               is_reversal: true,
  //               ecr_no: transaction.ecr_no,
  //             };
  //             const reversal_object1 = {
  //               id: createUUID(),
  //               staff_id: datas.staff_id,
  //               initial: datas.initial,
  //               transaction_id: id,
  //               reason: reason,
  //               created_at: new Date().toISOString(),
  //               is_synced: false,
  //               is_reversal: true,
  //             };
  //             const reversal_object2 = {
  //               id: createUUID(),
  //               staff_id: datas.staff_id,
  //               initial: datas.initial,
  //               transaction_id: transactionObject.id,
  //               reason: reason,
  //               created_at: new Date().toISOString(),
  //               is_synced: false,
  //               is_reversal: true,
  //             };
  //             setReversal(reversal_object1);

  //             const transactionParti = {
  //               transaction_id: reversal_object1.transaction_id,
  //               is_reversal: true,
  //               is_synced: false,
  //             };

  //             const student_payment_object = {
  //               id: student_payment_id,
  //               enrollment_id: studentId,
  //               payment_method_id: paymentMethodId,
  //               finance_account_id: financeAccountId,
  //             };

  //             saveStudentPayment(student_payment_object);
  //             saveTransaction(transactionObject);
  //             updatePaidPaticularTranc(transactionParti);
  //             saveReversal(reversal_object1);
  //             saveReversal(reversal_object2);
  //             savePaidAdditionalFees(reverseAdditionalFee);
  //             setUsername("");
  //             setPassword("");
  //             setReason("");
  //             isPopupOpen(false);

  //             Swal.fire(
  //               "Success",
  //               "Transaction was successfully reverse.",
  //               "success"
  //             );
  //           }
  //         } else {
  //           toast.error("Only Supervisor can reverse the transaction!", {
  //             className: styles.toast,
  //           });
  //         }
  //       })
  //       .catch((error) => {
  //         if (!username | !password) {
  //           toast.error("All fields are required to be fill.", {
  //             className: styles.toast,
  //           });
  //         } else {
  //           toast.error("Incorrect username or password.", {
  //             className: styles.toast,
  //           });
  //         }
  //       });
  //   } else {
  //     const result = await offlineLoginUser(username, password);

  //     if (result) {
  //       if (result?.message_fill) {
  //         return toast.error(result.message_fill, {
  //           className: styles.toast,
  //         });
  //       } else if (result?.message) {
  //         return toast.error(result.message, {
  //           className: styles.toast,
  //         });
  //       } else if (result.is_head == 1) {
  //         if (transactionOne.student_payment_id == null && incometransaction) {
  //           const transactionObject = {
  //             id: transactionOne.id,
  //             amount: -Math.abs(transactionOne.amount),
  //             is_synced: false,
  //             created_at: new Date().toISOString(),
  //             is_reversal: true,
  //             ecr_no: transactionOne.ecr_no,
  //           };

  //           const reversal_object = {
  //             id: createUUID(),
  //             staff_id: result.staff_id,
  //             initial: result.initial,
  //             transaction_id: transactionOne.id,
  //             reason: reason,
  //             created_at: new Date().toISOString(),
  //             is_synced: false,
  //             is_reversal: true,
  //           };

  //           const incomeObject = {
  //             id: incometransaction.id,
  //             is_reversal: false,
  //             is_synced: false,
  //           };

  //           saveIncome(incomeObject);
  //           saveReversal(reversal_object);
  //           saveTransaction(transactionObject);
  //           setUsername("");
  //           setPassword("");
  //           setReason("");
  //           isPopupOpen(false);
  //           Swal.fire(
  //             "Success",
  //             "Transaction was successfully reverse.",
  //             "success"
  //           );
  //           isPopupOpen(false);
  //         } else {
  //           const student_payment_id = createUUID();

  //           const transactionObject = {
  //             ...transaction,
  //             id: createUUID(),
  //             student_payment_id,
  //             amount: -Math.abs(transaction.amount),
  //             is_synced: false,
  //             created_at: new Date().toISOString(),
  //             is_reversal: true,
  //             ecr_no: transaction.ecr_no,
  //           };

  //           // blue
  //           const reversal_object1 = {
  //             id: createUUID(),
  //             staff_id: selectedUser.staff_id,
  //             initial: result.initial,
  //             transaction_id: id,
  //             reason: reason,
  //             created_at: new Date().toISOString(),
  //             is_synced: false,
  //             is_reversal: true,
  //           };

  //           // red
  //           const reversal_object2 = {
  //             id: createUUID(),
  //             staff_id: result.staff_id,
  //             initial: result.initial,
  //             transaction_id: transactionObject.id,
  //             reason: reason,
  //             created_at: new Date().toISOString(),
  //             is_synced: false,
  //             is_reversal: true,
  //           };

  //           const student_payment_object = {
  //             id: student_payment_id,
  //             enrollment_id: studentId,
  //             payment_method_id: paymentMethodId,
  //             finance_account_id: financeAccountId,
  //           };

  //           saveStudentPayment(student_payment_object);
  //           setReversal(reversal_object1);
  //           saveReversal(reversal_object1);
  //           saveReversal(reversal_object2);
  //           savePaidAdditionalFees(reverseAdditionalFee);
  //           setUsername("");
  //           setPassword("");
  //           setReason("");

  //           const transactionParti = {
  //             transaction_id: reversal_object1.transaction_id,
  //             is_reversal: true,
  //             is_synced: false,
  //           };

  //           saveTransaction(transactionObject);
  //           updatePaidPaticularTranc(transactionParti);

  //           isPopupOpen(false);
  //           Swal.fire(
  //             "Success",
  //             "Transaction was successfully reverse.",
  //             "success"
  //           );
  //         }
  //       } else {
  //         toast.error("Only Supervisor can reverse the transaction!", {
  //           className: styles.toast,
  //         });
  //       }
  //     } else {
  //       toast.error("User Does Not Exist in Local Database.", {
  //         className: styles.toast,
  //       });
  //     }
  //   }
  // }

  async function handleLoginSubmit(reason) {
    if (transactionOne.id === undefined || transactionOne.id === null) {
      const RequestReversal = {
        id: createUUID(),
        transaction: transaction.id,
        reason: reason,
        request_by: user.staff_id,
      };
      uploadOnlineRequestReversal(
        stateSettings.apiUrl,
        user.access_token,
        RequestReversal
      );
      setisRequestReversal(true);
      setReason("");
      isPopupOpen(false);
      Swal.fire(
        "Success",
        "Reversal request has been successfully submitted.",
        "success"
      );
    } else {
      const RequestReversal = {
        id: createUUID(),
        transaction: transactionOne.id,
        reason: reason,
        request_by: user.staff_id,
      };
      uploadOnlineRequestReversal(
        stateSettings.apiUrl,
        user.access_token,
        RequestReversal
      );
      setisRequestReversal(true);
      setReason("");
      isPopupOpen(false);
      Swal.fire(
        "Success",
        "Reversal request has been successfully submitted.",
        "success"
      );
    }
  }

  let totalDue = 0.0;
  const transactionParticulars = [];

  paidParticulars?.map((paidParticular) => {
    return particulars.filter((particular) => {
      if (particular.id === paidParticular.particular_id) {
        totalDue += paidParticular.amount;

        transactionParticulars.push({
          amount: paidParticular.amount,
          particular: {
            id: particular.id,
            name: particular.name,
          },
        });
      }

      return particular;
    });
  });

  additionalFee?.map((fee) => {
    totalDue += fee.amount;

    transactionParticulars.push({
      amount: fee.amount,
      particular: {
        id: fee.id,
        name: fee.name,
      },
    });
  });

  lateFees?.map((fee) => {
    totalDue += fee.late_fee;

    transactionParticulars.push({
      amount: fee.late_fee,
      particular: {
        id: fee.id,
        name: fee.book_title,
      },
    });
  });

  //loader 
  let loading = true;
  transaction === null && transactionOne.id === undefined ? loading = true : loading = false;

  return (
    <div>
      <div>
        <h2
          className={styles.titlehead}
          onClick={() => history.goBack()}
          style={{ cursor: "pointer" }}
        >
          &#129128; List of Transactions
        </h2>
        <div className={styles.containerBtn}>
          <div>
            <button className={styles.reverseBtn} onClick={printReceipt}>
              Print
            </button>
          </div>
          <div>
            {(transactionOne && transactionOne.is_reversal) ||
              reversal ||
              requestReversal ||
              isRequestReversal ? (
              ""
            ) : (
              <div>
                <button
                  className={styles.reverseBtn}
                  onClick={() => isPopupOpen(!popupOpen)}
                >
                  Reverse Transaction
                </button>
              </div>
            )}
          </div>
        </div>

        {transactionOne ? (
          <NonStudentReversal
            transactionOne={transactionOne}
            incometransaction={incometransaction}
            isReversed={transactionOne.is_reversal ? true : false}
          />
        ) : (
          <div>
            <TransactionBasicInfoComponent enrollment={enrollment} />
            <TransactionCashierInfoComponent />
            <TransactionTransactionInfoComponent
              transaction={transaction}
              paidParticulars={paidParticulars}
              particulars={particulars}
              isReversed={reversal ? true : false}
              additionalFee={additionalFee}
              lateFees={lateFees}
            />
          </div>
        )}

        {reversal ? (
          <TransactionReversalInfoComponent reversal={reversal} />
        ) : (
          ""
        )}
      </div>
      <div
        id="popupReverse"
        className={`${styles.reversePopup} ${popupOpen ? styles.open : ""}`}
      >
        <div className={styles.reversePopupInner}>
          <ReversalComponent
            setReason={setReason}
            reason={reason}
            handleLoginSubmit={handleLoginSubmit}
            onPopupClick={() => isPopupOpen(!popupOpen)}
          />
        </div>
      </div>
      {/* loader */}
      <div style={{ marginLeft: '45%', marginTop: '15%', display: (loading ? 'block' : 'none') }} className="load_container">
        <div className="loader" >
          <span></span>
        </div>
      </div>
      {enrollment && transaction && (
        <PrintReceipt
          idNumber={enrollment.studentNo}
          date={transaction.created_at}
          studentName={`${enrollment.lastName}, ${enrollment.firstName} ${enrollment.middleName}`}
          ecr={transaction.ecr_no}
          gradeAndSection={`${enrollment.grade} - ${enrollment.section}`}
          balance={""}
          particulars={transactionParticulars}
          totalDue={totalDue}
          payment={Number(transaction.cash_received)}
          change={Math.abs(
            totalDue - transaction.cash_received
          ).toLocaleString()}
        />
      )}
    </div>
  );
};

export default Transactions;
