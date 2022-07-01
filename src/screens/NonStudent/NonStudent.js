import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  saveTransaction,
  getLatestECR,
} from "../../repository/TransactionRepository";
import { saveIncome } from "../../repository/IncomeRepository";
import { getCashAccount } from "../../repository/FinanceAccountRepository";
import {
  createUUID,
  formatToCurrency,
  offlineDatabaseError,
} from "../../repository/base";
import { getAllFinanceCatgories } from "../../repository/FinanceCategoryRepository";
import { toast, ToastContainer } from "react-toastify";
import styles from "./NonStudent.module.css";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import printJS from "print-js";
import Moment from "react-moment";
import { validateOR } from "../../repository/TransactionRepository";

const NonStudent = () => {
  let date = new Date();
  const [orNo, setOrNo] = useState("");
  const [title, setTitle] = useState("Non-Student");
  const [cashOnHandId, setcashOnHand] = useState("");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [financeCategory, setCategory] = useState("None");
  const [receiveFrom, setReceiveFrom] = useState("");
  const [financeCategories, setFinanceCategories] = useState(null);
  const [cashReceived, setCashReceived] = useState(0);
  const [financeAccountId, setFinanceAccountId] = useState(null);
  const [disableInputs, setDisableInputs] = useState(false);
  const [submitText, setSubmitText] = useState("Process Non-Student");

  // Validation
  const [showOrMessage, setShowOrMessage] = useState(false);
  const [valCategory, setValCategory] = useState(false);
  const [valDescription, setValDescription] = useState(false);
  const [valReceiveFrom, setValReceiveFrom] = useState(false);
  const [newECRforPrint, setNewECRForPrint] = useState("");

  const [dateFrom, setDateFrom] = useState(
    new Date().toLocaleString("en-us", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    })
  );
  const user = useSelector((state) => state.user);

  const middleInitial = `${user.middle_name}`
    ? `${user.middle_name == null ? "" : user.middle_name}`
    : "";
  const firstName = `${user.first_name}`
    ? `${user.first_name == null ? "" : user.first_name}`
    : "";
  const lastName = `${user.last_name}`
    ? `${user.last_name == null ? "" : user.last_name}`
    : "";
  const cashierFullName = `${firstName} ${middleInitial.charAt(
    0
  )}. ${lastName}`;
  let today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    getCashAccount().then((data) => {
      setcashOnHand(data);
    });
    getAllFinanceCatgories().then((data) => {
      setFinanceCategories(data);
    });
    getCashAccount().then(setFinanceAccountId);
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
  async function handleSubmit(e) {
    e.preventDefault();
    setDisableInputs(true);
    setSubmitText("Processing...");

    if (!description) {
      setValDescription(true);
      setDisableInputs(false);
      toast.error("Please Enter Description");
      return;
    }
    if (!receiveFrom) {
      setValReceiveFrom(true);
      setDisableInputs(false);
      toast.error("Please Enter Receive From");
      setSubmitText("Process Non-Student");
      return;
    }

    if (financeCategory === "None") {
      setValCategory(true);
      setDisableInputs(false);
      setSubmitText("Process Non-Student");
      return;
    }

    if (amount <= 0) {
      setDisableInputs(false);
      setSubmitText("Process Non-Student");
      toast.error("No Amount Input");
      return;
    }

    if (!/\S/.test(orNo)) {
      setShowOrMessage(true);
      setDisableInputs(false);
      setSubmitText("Process Non-Student");
      return;
    }

    if (parseFloat(cashReceived) < parseFloat(amount)) {
      toast.error("Not enough cash");
      setDisableInputs(false);
      setSubmitText("Process Non-Student");
      return;
    }

    let latestEcr = await getLatestECR(user.initial);
    latestEcr = latestEcr ? latestEcr.split("-")[2] : "0000000000";
    latestEcr = parseInt(latestEcr) + 1;
    const zeroPaddedEcr = latestEcr.toString().padStart(10, "0");

    const newEcr = `ECR-${user.initial}-${zeroPaddedEcr}`;
    setNewECRForPrint(newEcr);

    const transaction_id = createUUID();

    const transactionObject = {
      id: transaction_id,
      amount: amount,
      created_at: new Date().toISOString(),
      is_reversal: false,
      ecr_no: newEcr,
      or_no: orNo,
      to_acct_id: financeAccountId,
      cash_received: cashReceived,
      is_synced: false,
    };
    const incomeObject = {
      id: createUUID(),
      title: title,
      type: "I",
      date: today,
      amount: amount,
      description: description,
      finance_category: financeCategory,
      add_to: cashOnHandId,
      receive_from: receiveFrom,
      transaction: transaction_id,
      created_at: new Date().toISOString(),
      is_synced: false,
    };

    //validate if or exist 
    validateOR(transactionObject.or_no).then((data) => {
      if (data.length > 0) {
        Swal.fire("Error", "OR Already Exist", "error");
        setDisableInputs(false);
        setSubmitText("Process Non-Student");
      }
      else {
        saveIncome(incomeObject);
        saveTransaction(transactionObject);
        Swal.fire("Success", "Transaction Successfully created!", "success");

        // setDescription('')
        // setReceiveFrom('')
        // setAmount(0)
        // setCategory('None')
        // setCashReceived(0)
        // setOrNo('')

        setSubmitText("Successfully Processed");
      }
    })

  }

  const handleClear = () => {
    setDescription("");
    setReceiveFrom("");
    setAmount(0);
    setCategory("None");
    setCashReceived(0);
    setOrNo("");
    setDisableInputs(false);
    setValCategory(false);
    setValReceiveFrom(false);
    setValDescription(false);
    setShowOrMessage(false);
    setValCategory(false);
    setSubmitText("Process Non-Student");
  };
  return (
    <div>
      <div className={styles.NonStudentComponent}>
        <div className={`${styles.NonstudentHeaderRow} ${styles.withButtons}`}>
          <h2>Process Payment Non-Student</h2>
          {disableInputs && <button onClick={printReceipt}>Print</button>}
        </div>
        <div className={styles.NonstudentComponentRow}>
          <h4>Cashier Name:</h4>
          <p>{cashierFullName}</p>
        </div>
        <div
          className={`${styles.NonstudentComponentRow} ${styles.withLineInput}`}
        >
          <h4>Title:</h4>
          <div>
            <input
              type="text"
              disabled={disableInputs}
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled
            />
          </div>
        </div>

        <div
          className={`${styles.NonstudentComponentRow} ${styles.withLineInput}`}
        >
          <h4 style={valDescription ? { color: "#FF3A3A" } : {}}>
            Description:
          </h4>
          <div style={valDescription ? { color: "#FF3A3A" } : {}}>
            <input
              type="text"
              disabled={disableInputs}
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div
          className={`${styles.NonstudentComponentRow} ${styles.withLineInput}`}
        >
          <h4>Type:</h4>
          <div>
            <label>Income</label>
          </div>
        </div>

        <div
          className={`${styles.NonstudentComponentRow} ${styles.withLineInput}`}
        >
          <h4 style={valReceiveFrom ? { color: "#FF3A3A" } : {}}>
            Receive from:
          </h4>
          <div style={valReceiveFrom ? { color: "#FF3A3A" } : {}}>
            <input
              type="text"
              disabled={disableInputs}
              name="receiveFrom"
              value={receiveFrom}
              onChange={(e) => setReceiveFrom(e.target.value)}
            />
          </div>
        </div>
        <div
          className={`${styles.NonstudentComponentRow} ${styles.withLineInput}`}
        >
          <h4>Add to:</h4>
          <div>
            <label>Cash-on-Hand</label>
          </div>
        </div>
        <div
          className={`${styles.NonstudentComponentRow} ${styles.withLineInput}`}
        >
          <h4>Amount (₱):</h4>
          <div>
            <input
              type="number"
              min="0"
              onInput={(e) =>
              (e.currentTarget.value =
                !!e.currentTarget.value &&
                  Math.abs(e.currentTarget.value) >= 0
                  ? Math.abs(e.currentTarget.value)
                  : null)
              }
              disabled={disableInputs}
              name="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
        <div
          className={`${styles.NonstudentComponentRow} ${styles.withLineInput}`}
        >
          <h4>Date:</h4>
          <div>{dateFrom}</div>
        </div>
        <div
          className={`${styles.NonstudentComponentRow} ${styles.withLineInput}`}
        >
          <h4 style={valCategory ? { color: "#FF3A3A" } : {}}>Category</h4>
          <div>
            <select
              disabled={disableInputs}
              type="text"
              name="financeCategory"
              onChange={(e) => setCategory(e.target.value)}
              className={`${styles.inputBtn} ${styles.byCategorySel}`}
              style={valCategory ? { color: "#FF3A3A" } : {}}
            >
              <option value={"None"} selected={financeCategory === "None"}>
                Choose
              </option>
              {financeCategories &&
                financeCategories.map((data) => (
                  <option key={data.id} value={data.id}>
                    {data.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div
          className={`${styles.NonstudentComponentRow} ${styles.withLineInput}`}
        >
          <h4 style={showOrMessage ? { color: "#FF3A3A" } : {}}>
            OR Number Series:
          </h4>
          <div>
            <input
              disabled={disableInputs}
              type="text"
              value={orNo}
              onChange={(e) => setOrNo(e.target.value)}
              style={showOrMessage ? { borderColor: "#FF3A3A" } : {}}
            />
          </div>
        </div>
        <div
          className={`${styles.NonstudentComponentRow} ${styles.withLineInput}`}
        >
          <h4>Cash received</h4>
          <div>
            <input
              disabled={disableInputs}
              type="number"
              min="0"
              onInput={(e) =>
              (e.currentTarget.value =
                !!e.currentTarget.value &&
                  Math.abs(e.currentTarget.value) >= 0
                  ? Math.abs(e.currentTarget.value)
                  : null)
              }
              value={cashReceived}
              onChange={(e) => setCashReceived(e.target.value)}
            />
          </div>
        </div>
        <div className={`${styles.NonstudentComponentRow}`}>
          <h4>Change:</h4>
          <b>
            {Number.isNaN(cashReceived - amount)
              ? 0
              : (cashReceived - amount).toFixed(2)}
          </b>
        </div>

        <div
          className={`${styles.NonstudentComponentRow} ${styles.withButtons}`}
        >
          <button onClick={handleClear}>Reset</button>
          <button onClick={handleSubmit} disabled={disableInputs}>
            {submitText}
          </button>
        </div>
      </div>

      {disableInputs && (
        <div style={{ position: "absolute", left: "-9999em" }}>
          <pre id="receipt" className={styles.receiptContainer}>
            <div className={styles.receiptContent}>
              <div className={styles.receiptHeader}></div>

              <div className={styles.receiptInfo}>
                <div className={styles.receiptInfoRow}>
                  <p></p>
                  <p>
                    <Moment format="DD-MMMM-YYYY / h:mm A">{new Date()}</Moment>
                  </p>
                </div>

                <div className={styles.receiptInfoRow}>
                  <p>{receiveFrom}</p>
                  <p>{newECRforPrint}</p>
                </div>

                <div className={styles.receiptInfoRow}>
                  <p></p>
                  <p></p> {/*balance*/}
                </div>
              </div>

              <div className={`${styles.receiptPayment} ${styles.marginTop}`}>
                <div className={styles.receiptPaymentParticular}>
                  <p>
                    {financeCategories &&
                      financeCategories.find(
                        (data) => data.id === financeCategory
                      )?.name}
                  </p>
                  <p>{formatToCurrency(Number(amount))}</p>
                </div>

                <div
                  className={`${styles.receiptPaymentParticular} ${styles.marginTop}`}
                >
                  <p>TOTAL DUE</p>
                  <p>{formatToCurrency(Number(amount))}</p>
                </div>

                <div className={styles.receiptPaymentParticular}>
                  <p>PAYMENT</p>
                  <p>{formatToCurrency(Number(cashReceived))}</p>
                </div>

                <div
                  className={`${styles.receiptPaymentParticular} ${styles.marginTop}`}
                >
                  <p>CHANGE</p>
                  <p>
                    {formatToCurrency(
                      Number.isNaN(cashReceived - amount)
                        ? 0
                        : cashReceived - amount
                    )}
                  </p>
                </div>
              </div>

              <div className={styles.receiptFooter}></div>
            </div>
          </pre>
        </div>
      )}
    </div>
  );
};

export default NonStudent;
