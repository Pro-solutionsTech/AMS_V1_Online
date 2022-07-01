import styles2 from "./TransactionHistoryModal.module.css";
import styles from "./TransactionHistoryWidget.module.css";
import { useState } from "react";
import React from "react";
import moment from "moment";
import { formatToCurrency } from "../../repository/base";

export default function TransactionHistoryModal(props) {
  const data = props.paidtransactionList;
  const cashier = props.cashier_name;
  let cashierName ;
  if (cashier == null )
  {
    cashierName = "NO ASSIGN";
  }
  else 
  {
    cashierName = cashier?.length > 0 && cashier.map((name)=> (
      name.full_name))
  }
  const date = moment(props.transaction_date).format("MMM DD, YYYY");

  return (
   <>
      <div>
        <div className={styles2.grid4}>
          <div>
            {" "}
            <label className={styles2.info}>ECR#</label>
            <br /> <label className={styles2.infoData}>
              {props.ecr_no == null ? "N/A" : props.ecr_no}
               
            </label>{" "}
          </div>
          <div>
            {" "}
            <label className={styles2.info}>OR#</label>
            <br /> <label className={styles2.infoData}>
              {props.or_no == null ? "N/A" : props.or_no}
            </label>{" "}
          </div>
          <div>
            {" "}
            <label className={styles2.info}>Transaction Date</label>
            <br />
            <label className={styles2.infoData}>
              {date == null ? "N/A" : date}</label>{" "}
          </div>
          <div>
            {" "}
            <label className={styles2.info}>Cashier Name</label>
            <br />
            <label className={styles2.infoData}>{
              cashierName
             }</label>{" "}
            
          </div>
        </div>
      </div>
      <div>
     
        <table
          className={styles.smartTable}
          style={{ width: "80%", marginLeft: "10%" }}
        >
          <thead
            className={styles.smartTableHeaderWithColor}
            style={{ backgroundColor: "#001f71", color: "white" }}
          >
            <th style = {{textAlign: "left"}}>PARTICULARS</th>
            <th style = {{textAlign: "left"}}>AMOUNT</th>
          </thead>
          <tbody className={styles.smartTableBody}>
            {data?.length > 0 &&
              data.map((item) => (
                <tr>
                  <td key={item.name} style={{ fontSize: "21px", textAlign: "left" }}>
                    {item.name}
                  </td>
                  <td key={item.amount} style={{ fontSize: "21px", textAlign: "left" }}>
                    {formatToCurrency(item.amount)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className={styles2.totalBottom}>
          <div></div>
          <div>
            <label id = "total_amount" className={styles2.total}>TOTAL AMOUNT : </label>
            <label id = "total_amount" className={styles2.totalAmount}>{formatToCurrency(props.total_amount) } </label>
          </div>
        </div>
      </div>
   </>
  );
}
