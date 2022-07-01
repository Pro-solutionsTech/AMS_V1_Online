import React from "react";
import styles from "./AdditionalFeesTbl.module.css";
import { formatToCurrency } from "../../repository/base";

export default function AdditionalFeesTbl({
  style,
  allAdditionFee,
  withCheckBox,
  filterableParticularsDispatch,
  selectedParticulars,
}) {
  return (
    <div>
      <div className={styles.periodDetailsContainer} style={style}>
        <div className={styles.periodDetailsHeader}>
          <h3 className={styles.smartTableTitle}>Additional Fees</h3>
        </div>
        <table className={styles.smartTable}>
          <thead
            className={`${styles.smartTableHeader} ${styles.smartTableHeaderWithColor}`}
          >
            <tr>
              <th>ADDITIONAL FEE</th>
              <th>TOTAL AMOUNT(₱)</th>
              <th>BALANCE</th>
              <th>STATUS</th>
              {withCheckBox && (
                <div className={styles.smartTableHeaderfordiv}>
                  <th></th>
                  <th>PAYMENT</th>
                </div>
              )}
            </tr>
          </thead>
          <tbody className={styles.smartTableBody}>
            {allAdditionFee &&
              allAdditionFee.map((item) => {
                console.log(item)
                let itemStatus = "Not Paid";

                if (
                  item.paid_amount === 0 ||
                  item.paid_amount === undefined ||
                  item.paid_amount == null ||
                  item.additional_is_reversal === 1
                ) {
                  itemStatus = "Not Paid";
                } else if (item.amount - item.paid_amount === 0) {
                  itemStatus = "Fully Paid";
                } else {
                  itemStatus = "Partially Paid";
                }

                const selectedParticular = selectedParticulars?.find(
                  (particular) => particular.particular.id === item.id
                );
                const paid_amount = item.additional_is_reversal
                  ? 0
                  : item.paid_amount;
                const mybalance = item.amount - paid_amount;

                // console.log(name)
                return (
                  <tr key={item.id}>
                    <td>{item.name === "2021-2022" ? `BALANCE OF ${item.name}` : item.name}</td>
                    <td>{formatToCurrency(item.amount)}</td>

                    <td class="additional_balance">
                      {formatToCurrency(mybalance)}
                    </td>
                    <td>{itemStatus}</td>
                    {withCheckBox && (
                      <div>
                        <td>
                          {itemStatus === "Fully Paid" ? (
                            <span>✔️</span>
                          ) : (
                            <input
                              type="checkbox"
                              value={item.selected}
                              onChange={() =>
                                filterableParticularsDispatch({
                                  type: "TOGGLE_PARTICULAR",
                                  id: item.id,
                                })
                              }
                            />
                          )}
                        </td>
                        <td>
                          {selectedParticular && (
                            <input
                              type="number"
                              className={styles.filterableParticularAmountInput}
                              value={selectedParticular.amount}
                              onChange={(e) =>
                                filterableParticularsDispatch({
                                  type: "SET_PARTICULAR_AMOUNT",
                                  id: item.id,
                                  amount: e.target.value,
                                })
                              }
                            />
                          )}
                        </td>
                      </div>
                    )}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
