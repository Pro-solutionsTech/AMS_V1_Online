import React from "react";
import ReactExport from "react-data-export";
import moment from "moment";
import styles from "./CollectionReportAllTransComponent.module.css";
import { formatToCurrency } from "../../../repository/base";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


export default function Excel({
  reports,
  reportsparticular,
  pergradeelem,
  pergradejunior,
  pergradesenior,
  listPerParticular,
  type,
  dateName
}) {
  const reportsss = reports?.map((report) => ({
    ...report,
    description: report.description === null ? "N/A" : report.description,
    name: report.name === null ? report.category_name : report.name,
    category_name: report.category_name === null ? "N/A" : report.category_name,
    amount:
      report.is_reversal || report.income_is_reversal
        ? "Reversed (" + -Math.abs(report.transaction_amount ? report.amount : report.income_amount) + ")" :
        report.receive_from ? report.income_amount :
          report.amount === null ? report.transaction_amount : report.amount,

    date: moment(report.created_at).format("MMM DD, YYYY"),
    time: moment(report.created_at).format("hh:mm A"),
  }));
  let amount = 0;
  let elemTotal = 0;
  pergradeelem.map((elem) => {
    elemTotal = elemTotal + elem.total;
  });

  let juniorTotal = 0;
  pergradejunior.map((junior) => {
    juniorTotal = juniorTotal + junior.total;
  });

  let seniorTotal = 0;
  pergradesenior.map((senior) => {
    seniorTotal = seniorTotal + senior.total;
  });

  console.log(reportsss)
  const excelgradelevel = [
    { particular: "ELEMENTARY", total: elemTotal },
    ...pergradeelem,
    { particular: "JUNIOR HIGH SCHOOL", total: juniorTotal },
    ...pergradejunior,
    { particular: "SENIOR HIGH SCHOOL", total: seniorTotal },
    ...pergradesenior,
  ];

  if (type === "PER PARTICULAR") {
    return (
      <ExcelFile
        element={
          <button className={styles.printBtnExcel}>Generate Excel</button>
        }
        fileExtension="xlsx"
        filename={"PER PARTICULARS-" + dateName + ".xlsx"}
      >
        <ExcelSheet data={reportsparticular} name="Employees">
          <ExcelColumn label="PARTICULAR" value="name" />
          <ExcelColumn label="TOTAL COLLECTION." value="total" />
        </ExcelSheet>
      </ExcelFile>
    );
  } else if (type === "PER GRADE LEVEL") {
    return (
      <ExcelFile
        element={
          <button className={styles.printBtnExcel}>Generate Excel</button>
        }
        fileExtension="xlsx"
        filename={"PER GRADE LEVEL-" + dateName + ".xlsx"}
      >
        <ExcelSheet data={excelgradelevel} name="Employees">
          <ExcelColumn label="GRADE LEVEL" value="particular" />
          <ExcelColumn label="TOTAL COLLECTION" value="total" />
        </ExcelSheet>
      </ExcelFile>
    );
  } else if (type === "LIST PER PARTICULAR") {
    return (
      <ExcelFile
        element={
          <button className={styles.printBtnExcel}>Generate Excel</button>
        }
        fileExtension="xlsx"
        filename={"LIST PER PARTICULAR-" + dateName + ".xlsx"}
      >
        <ExcelSheet data={listPerParticular} name="Employees">
          <ExcelColumn label="ECR NO" value="ecr_no" />
          <ExcelColumn label="SCHOOL YEAR" value="school_year" />
          <ExcelColumn
            label="NAME"
            value={(col) => col.last_name + " " + col.first_name}
          />
          <ExcelColumn label="GRADE" value="grade" />
          <ExcelColumn label="SECTION" value="section" />
          <ExcelColumn label="PARTICULAR" value="name" />
          <ExcelColumn label="AMOUNT(₱)" value="amount" />
          <ExcelColumn label="TRANSACTION DATE" value={(col) => col.transaction_date.split('T')[0]} />
        </ExcelSheet>
      </ExcelFile>
    );
  }

  return (

    <ExcelFile
      element={<button className={styles.printBtnExcel}>Generate Excel</button>}
      fileExtension="xlsx"
      filename={"ALL TRANSACTIONS-" + dateName + ".xlsx"}
    >
      <ExcelSheet data={reportsss} name="Employees">
        <ExcelColumn label="ECR NO." value="ecr_no" />
        <ExcelColumn label="OR NO." value="or_no" />
        <ExcelColumn label="PARTICULARS" value="name" />
        <ExcelColumn label="AMOUNT(₱)" value="amount" />
        <ExcelColumn label="DATE" value="date" />
        <ExcelColumn label="TIME" value="time" />
      </ExcelSheet>
    </ExcelFile>
  );
}
