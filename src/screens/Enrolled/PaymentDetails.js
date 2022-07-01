import React, { useReducer, useState, useEffect } from "react";
import styles from "./PaymentDetails.module.css";
import { filterableParticularsReducer } from "../../reducers/FilterableParticulars";
import { savePaidParticulars } from "../../repository/PaidParticularRepository";
import { createUUID, formatToCurrency } from "../../repository/base";
import {
  saveTransaction,
  getLatestECR,
} from "../../repository/TransactionRepository";
import { saveStudentPayment } from "../../repository/StudentPaymentRepository";
import { getCashAccount } from "../../repository/FinanceAccountRepository";
import { getCashMethod } from "../../repository/PaymentMethodRepository";
import { savePaidAdditionalFees } from "../../repository/PaidAddittionalFeeRepository";
import { saveLibraryLateFees } from "../../repository/LibraryLateFeeRepository";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import AdditionalFeesTbl from "./AdditionalFeesTbl";
import LibraryLateFees from "./LibraryLateFees";

import { validateOR } from "../../repository/TransactionRepository";

import Swal from "sweetalert2";

export default function ProcessPayment({
  id,
  paymentSchemeParticulars,
  enrollment,
  particulars,
  paidParticulars,
  withCheckbox = true,
  withAdditionalFees,
  allAdditionFee,
  withLateFees,
  lateFees,
}) {
  const additionalFees = [];

  allAdditionFee?.map((fee) =>
    additionalFees.push({
      amount: 0,
      selected: false,
      type: "additional",
      particular: {
        id: fee.id,
        name: fee.name,
      },
    })
  );

  const libraryLateFees = [];

  lateFees?.map((fee) =>
    libraryLateFees.push({
      amount: fee.late_fee,
      selected: false,
      type: "lateFee",
      particular: {
        id: fee.id,
        name: fee.book_title,
      },
    })
  );

  const history = useHistory();

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  const [dateSelection, setDateSelection] = useState([
    { name: "January" },
    { name: "February" },
    { name: "March" },
    { name: "April" },
    { name: "May" },
    { name: "June" },
    { name: "July" },
    { name: "August" },
    { name: "September" },
    { name: "October" },
    { name: "November" },
    { name: "December" },
  ]);

  const handleBalanceInputBlur = (event, balance) => {
    const value = event.currentTarget.value;
    if (value > balance) {
      Swal.fire({
        title: "Logout",
        html: "Amount input exceeded the balance. Do you want to proceed?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then(async (result) => {
        if (result.value) {
        } else {
          event.target.focus();
        }
      });
    }
  };

  const [selectedDate, setSelectedDate] = useState(
    dateSelection[new Date().getMonth()].name
  );
  const [selectedStatus, setSelectedStatus] = useState("Partial");

  console.log(enrollment);
  const additionalParticulars = enrollment.payment_plan_items_list.map(
    (item) => {
      const particular = particulars.find((p) => p.id === item.particular_id);

      let total_pp = [];
      paidParticulars.filter((pp) => {
        if (
          pp.particular_id === particular.id &&
          pp.student_id === enrollment.id
        ) {
          total_pp.push(pp.amount);
        }
      });

      // Total all amounts of Paid Prticular
      if (total_pp.length > 0) {
        total_pp = total_pp.reduce((previous, current) => {
          return previous + current;
        });
      } else {
        total_pp = 0;
      }

      // Get Status
      const mybalance =
        Number(item.amount.toFixed(2)) - Number(total_pp.toFixed(2));

      let status = "Not Yet Paid";
      if (Number(mybalance.toFixed(2)) === item.amount) {
        status = "Not Yet Paid";
      } else if (
        Number(mybalance.toFixed(2)) > 0 &&
        Number(mybalance.toFixed(2)) !== 0
      ) {
        status = "Partially Paid";
      } else {
        status = "Paid";
      }

      return {
        amount: 0,
        selected: false,
        type: "particular",
        particular: {
          balance: Number(item.amount.toFixed(2)) - Number(total_pp.toFixed(2)),
          id: particular.id,
          name: particular.name,
          status,
          totalAmount: item.amount,
        },
      };
    }
  );

  const [filterableParticulars, filterableParticularsDispatch] = useReducer(
    filterableParticularsReducer,
    [...additionalParticulars, ...additionalFees, ...libraryLateFees]
  );
  // console.log(filterableParticulars);
  const [selectedParticulars, setSelectedParticulars] = useState([]);
  const [cashReceived, setCashReceived] = useState(0);
  const [orNo, setOrNo] = useState("");
  const [showOrMessage, setShowOrMessage] = useState(false);
  const [financeAccountId, setFinanceAccountId] = useState(null);
  const [paymentMethodId, setPaymentMethodId] = useState(null);
  const [ecrtest, setEcrtest] = useState(null);

  const total_additional_fee = allAdditionFee.length
    ? allAdditionFee
      .map((item) => {
        return parseFloat(item.amount);
      })
      .reduce((previous, current) => previous + current, 0)
    : 0;

  const totalAmount = selectedParticulars.length
    ? selectedParticulars
      .map((particular) => particular.amount)
      .map((amount) => parseFloat(amount))
      .reduce((a, b) => a + b)
      .toFixed(2)
    : 0;

  async function handleSubmit(e) {
    e.preventDefault();

    if (parseFloat(cashReceived) < parseFloat(totalAmount)) {
      toast.error("Not enough cash");
      return;
    }

    if (!/\S/.test(orNo)) {
      setShowOrMessage(true);
      return;
    }

    if (totalAmount <= 0) {
      toast.error("No Amount Input");
      return;
    }

    // Saving Paid Particulars
    const particulars_to_save = [];
    const additionals_to_save = [];
    const late_fees_to_save = [];
    const student_payment_id = createUUID();
    let total_amount = 0.0;

    let latestEcr = await getLatestECR(user.initial);

    latestEcr = latestEcr ? latestEcr.split("-")[2] : "0000000000";

    latestEcr = parseInt(latestEcr) + 1;

    const zeroPaddedEcr = latestEcr.toString().padStart(10, "0");

    const newEcr = `ECR-${user.initial}-${zeroPaddedEcr}`;
    const mytransaction_id = createUUID();

    // for particulars
    selectedParticulars
      .filter((particular) => particular.type === "particular")
      .map((particular) => {
        const particular_object = {
          id: createUUID(),
          student_payment_id: student_payment_id,
          student_id: enrollment.id,
          particular_id: particular?.particular.id,
          amount: particular?.amount,
          is_synced: false,
          transaction_id: mytransaction_id,
          is_reversal: false,
        };
        total_amount += parseFloat(particular?.amount);
        particulars_to_save.push(particular_object);
      });

    // for additionals
    selectedParticulars
      .filter((particular) => particular.type === "additional")
      .map((additional) => {
        const additional_object = {
          id: createUUID(),
          student_payment_id,
          additional_fee_id: additional.particular.id,
          amount: additional.amount,
          transaction_id: mytransaction_id,
          is_reversal: false,
          is_synced: false,
        };
        total_amount += parseFloat(additional.amount);
        additionals_to_save.push(additional_object);
      });

    // for late fees
    selectedParticulars
      .filter((particular) => particular.type === "lateFee")
      .map((fee) => {
        const late_fee_object = {
          id: fee.particular.id,
          student_payment: student_payment_id,
          paid: "Paid",
          is_synced: false,
        };
        total_amount += parseFloat(fee.amount);
        late_fees_to_save.push(late_fee_object);
      });
    let date = new Date();
    // Saving Transactions
    const transaction_object = {
      id: mytransaction_id,
      student_payment_id: student_payment_id,
      to_acct_id: financeAccountId,
      amount: total_amount,
      is_synced: false,
      created_at: new Date().toISOString(),
      or_no: orNo,
      ecr_no: newEcr,
      cash_received: cashReceived,
    };

    const student_payment_object = {
      id: student_payment_id,
      enrollment_id: enrollment.id,
      payment_method_id: paymentMethodId,
      finance_account_id: financeAccountId,
    };

    validateOR(transaction_object.or_no).then((data) => {
      if (data.length > 0) {
        Swal.fire("Error", "OR Already Exist", "error");
      }
      else {
        saveTransaction(transaction_object);
        savePaidParticulars(particulars_to_save);
        savePaidAdditionalFees(additionals_to_save);
        saveLibraryLateFees(late_fees_to_save);
        saveStudentPayment(student_payment_object);

        dispatch({
          type: "GET_TRANSACTION",
          payload: transaction_object,
        });

        dispatch({
          type: "GET_PAYMENT",
          payload: cashReceived,
        });

        dispatch({
          type: "GET_CHANGE",
          payload: cashReceived - totalAmount,
        });

        Swal.fire("Success", "Transaction Successfully created!", "success");
        history.push(`/enrollments/${id}/student-payment`);
      }
    })

  }

  const [totalOutstandingBalance, setTotalOutstandingBalance] = useState(0.0);

  useEffect(() => {
    const balances = document.querySelectorAll(".balance");
    const additional_balances = document.querySelectorAll(
      ".additional_balance"
    );

    let total_balance = 0.0;
    balances.forEach((balance) => {
      const balance_amount = balance.innerHTML.split("₱")[1].replace(",", "");
      total_balance += parseFloat(balance_amount);
    });

    additional_balances.forEach((balance) => {
      const balance_amount = balance.innerHTML.split("₱")[1].replace(",", "");
      total_balance += parseFloat(balance_amount);
    });

    setTotalOutstandingBalance(total_balance);

    getLatestECR(user.initial).then(setEcrtest);

    getCashAccount().then(setFinanceAccountId);
    getCashMethod().then(setPaymentMethodId);
  }, []);

  useEffect(() => {
    const selected = filterableParticulars.filter(
      (particular) => particular.selected
    );

    setSelectedParticulars(selected);
  }, [filterableParticulars]);

  useEffect(() => {
    dispatch({
      type: "GET_PARTICULARS",
      payload: selectedParticulars.map((particular) => {
        if (particular.particular.name.toLowerCase().includes("tuition fee")) {
          return {
            ...particular,
            particular: {
              ...particular.particular,
              name:
                selectedStatus === "Partial"
                  ? `${particular.particular.name} (${selectedStatus} ${selectedDate})`
                  : `${particular.particular.name} (${selectedDate})`,
            },
          };
        } else {
          return particular;
        }
      }),
    });
  }, [selectedParticulars]);

  return (
    <>
      <div className={styles.paymentDetailsContainer}>
        <div className={styles.paymentDetailsHeader}>
          <div className={styles.payablesHeader}>
            <div
              className={`${styles.smartFields} ${styles.smartFieldsDetail}`}
            >
              <div className={styles.payableSmartField}>
                <div className={styles.smartFieldLabel}>
                  Total Payable Amount (₱)
                </div>
                <div className={styles.smartFieldValue}>
                  {/* Will Get the Total Payable Amount */}
                  {formatToCurrency(
                    enrollment.payment_plan_items_list
                      .map((item) => {
                        return parseFloat(item.amount);
                      })
                      .reduce(
                        (previous, current) => previous + current,
                        0 + total_additional_fee
                      )
                  )}
                </div>
              </div>
              <div className={styles.payableSmartField}>
                <div className={styles.smartFieldLabel}>
                  Outstanding Balance (₱)
                </div>
                <div className={styles.smartFieldValue}>
                  {formatToCurrency(totalOutstandingBalance)}
                </div>
              </div>
              <div
                className={`${styles.payableSmartField} ${styles.payableSmartFieldEnd}`}
              >
                <div className={styles.smartFieldLabel}>Last ECR</div>
                <div className={styles.smartFieldValue}>{ecrtest}</div>
              </div>

            </div>
          </div>
        </div>

        {withAdditionalFees && allAdditionFee.length > 0 && (
          <AdditionalFeesTbl
            style={{ padding: "0", boxShadow: "none" }}
            withCheckBox={true}
            filterableParticularsDispatch={filterableParticularsDispatch}
            allAdditionFee={allAdditionFee}
            selectedParticulars={selectedParticulars}
          />
        )}
        <form onSubmit={handleSubmit} className={styles.payableForm}>
          <table className={styles.smartTable}>
            <thead
              className={`${styles.smartTableHeader} ${styles.smartTableHeaderWithColor}`}
            >
              <tr>
                <th>PARTICULAR</th>
                <th>TOTAL AMOUNT (₱)</th>
                <th>BALANCE (₱)</th>
                <th>STATUS</th>
                {withCheckbox && (
                  <div className={styles.smartTableHeaderfordiv}>
                    <th>PAYMENT</th>
                  </div>
                )}
              </tr>
            </thead>
            <tbody className={styles.smartTableBody}>
              {filterableParticulars
                .filter((particular) => particular.type === "particular")
                .map((particular) => (
                  <tr key={particular.particular.id}>
                    <td>{particular.particular.name}</td>
                    <td>
                      {formatToCurrency(
                        Number(particular.particular.totalAmount)
                      )}
                    </td>
                    <td className="balance">
                      {formatToCurrency(Number(particular.particular.balance))}
                    </td>
                    <td>{particular.particular.status}</td>
                    {withCheckbox && (
                      <div>
                        <td>
                          {particular.particular.status === "Paid" ? (
                            <span>✔️</span>
                          ) : (
                            <input
                              type="checkbox"
                              value={particular.selected}
                              onChange={() =>
                                filterableParticularsDispatch({
                                  type: "TOGGLE_PARTICULAR",
                                  id: particular.particular.id,
                                })
                              }
                            />
                          )}
                        </td>
                        <td>
                          {particular.selected && (
                            <div className={styles.statusPaymentContainer}>
                              <input
                                type="number"
                                step="any"
                                min="0"
                                onInput={(e) =>
                                (e.currentTarget.value =
                                  !!e.currentTarget.value &&
                                    Math.abs(e.currentTarget.value) >= 0
                                    ? Math.abs(e.currentTarget.value)
                                    : null)
                                }
                                onBlur={(e) => {
                                  handleBalanceInputBlur(
                                    e,
                                    particular.particular.balance
                                  );
                                }}
                                className={
                                  styles.filterableParticularAmountInput
                                }
                                value={particular.amount}
                                onChange={(e) =>
                                  filterableParticularsDispatch({
                                    type: "SET_PARTICULAR_AMOUNT",
                                    id: particular.particular.id,
                                    amount: e.target.value,
                                  })
                                }
                              />

                              {particular.particular.name
                                .toLowerCase()
                                .includes("tuition fee") ? (
                                <div>
                                  <select
                                    onChange={(e) =>
                                      setSelectedDate(e.target.value)
                                    }
                                    value={selectedDate}
                                  >
                                    {dateSelection.map((item, i) => (
                                      <option key={i} value={item.name}>
                                        {item.name}
                                      </option>
                                    ))}
                                  </select>
                                  <div>
                                    <div>
                                      <input
                                        id="paymentPartial"
                                        type="radio"
                                        name="paymentStatus"
                                        value="Partial"
                                        onChange={() =>
                                          setSelectedStatus("Partial")
                                        }
                                        checked={selectedStatus === "Partial"}
                                      />
                                      <label for="paymentPartial">
                                        Partial
                                      </label>
                                      <input
                                        id="paymentPaid"
                                        type="radio"
                                        name="paymentStatus"
                                        value="Paid"
                                        onChange={() =>
                                          setSelectedStatus("Paid")
                                        }
                                        checked={selectedStatus === "Paid"}
                                      />
                                      <label for="paymentPaid">Paid</label>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                          )}
                        </td>
                      </div>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>



          {withLateFees && lateFees?.length > 0 && (
            <LibraryLateFees
              style={{ padding: "0", boxShadow: "none" }}
              late_fees={lateFees}
              withCheckBox={true}
              filterableParticularsDispatch={filterableParticularsDispatch}
            />
          )}

          {!!selectedParticulars.length && withCheckbox && (
            <div className={styles.ctaActions}>
              <div className={styles.ctaActionsInner}>
                <div>
                  <h4>Total Amount</h4>
                  <p>₱ {Number.isNaN(totalAmount) ? 0 : totalAmount}</p>
                </div>
                <div>
                  <h4>Cash received</h4>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    onInput={(e) =>
                    (e.currentTarget.value =
                      !!e.currentTarget.value &&
                        Math.abs(e.currentTarget.value) >= 0
                        ? Math.abs(e.currentTarget.value)
                        : null)
                    }
                    className={styles.filterableParticularAmountInput}
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                  />
                </div>
                <div>
                  <h4>Change:</h4>
                  <p>
                    <b>
                      {formatToCurrency(
                        Number.isNaN(cashReceived - totalAmount)
                          ? 0
                          : cashReceived - totalAmount
                      )}
                    </b>
                  </p>
                </div>
                <div>
                  {/* jer */}
                  <h4 style={showOrMessage ? { color: "#FF3A3A" } : {}}>
                    Generated ECR
                  </h4>
                  {/* <div className={styles.smartFieldValue}>
                    {ecrtest}
                  </div> */}
                  <input
                    type="text"
                    value={
                      ecrtest.split("-")[0] +
                      "-" +
                      ecrtest.split("-")[1] +
                      "-" +
                      (parseInt(ecrtest.split("-")[2]) + 1 + "").padStart(
                        10,
                        "0"
                      )
                    }
                  />
                </div>
                <div>
                  <h4 style={showOrMessage ? { color: "#FF3A3A" } : {}}>
                    Official Receipt No.
                  </h4>
                  <input
                    type="text"
                    value={orNo}
                    onChange={(e) => setOrNo(e.target.value)}
                    style={showOrMessage ? { borderColor: "#FF3A3A" } : {}}
                  />
                </div>
                {showOrMessage && (
                  <p
                    style={{
                      fontSize: "12px",
                      textAlign: "right",
                      color: "#FF3A3A",
                    }}
                  >
                    This field is required.
                  </p>
                )}
                <button type="submit" disabled={!totalAmount}>
                  Save and Process Payment
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      <ToastContainer />
    </>
  );
}
