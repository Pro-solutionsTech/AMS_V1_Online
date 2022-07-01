import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import {
  getAllTransactionsCollection,
  getPerParticular,
  getPerGradeLevelElementary,
  getGradeLevelJunior,
  getPerGradeLevelSeniorHigh,
  getListPerParticular,
  getListNonStudent,
} from "../../../repository/TransactionRepository";
import { getOfflineCashiers } from "../../../repository/CashierRepository";
import { getOfflineDistinct } from "../../../repository/EnrollmentRepository";
import { getOfflineParticulars } from "../../../repository/ParticularRepository";
import { formatToCurrency } from "../../../repository/base";
import AllTransactions from "./AllTransactions";
import PerParticular from "./PerParticular";
import NonStudentPerParticular from "./NonStudentPerParticular";
import PerGradeLevel from "./PerGradeLevel";
import ListPerParticular from "./ListPerParticular";
import printJS from "print-js";
import PrintReport from "./PrintReport";
import styles from "./CollectionReportAllTransComponent.module.css";
import ReportSummary from "./ReportSummary";
import Excel from "./Excel";
import { report } from "process";

const CollectionReportAllTransComponent = (props) => {
  const selectedUser = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    dateFrom: "",
    dateTo: "",
    ecrFrom: "",
    ecrTo: "",
    orFrom: "",
    orTo: "",
    cashBegin: "",
    cashEnd: "",
    cashSubmitted: "",
    initial: "",
  });
  // formData.initial = selectedUser.initial;

  const {
    dateFrom,
    dateTo,
    ecrFrom,
    ecrTo,
    orFrom,
    orTo,
    cashBegin,
    cashEnd,
    cashSubmitted,
    initial,
  } = formData;

  const [reports, setReports] = useState([]);
  const [perpaticulars, setPerParticular] = useState([]);
  const [nonstudents, setNonStudent] = useState([]);
  const [pergradeelem, setPerGradeElem] = useState([]);
  const [pergradejunior, setPerGradeJunior] = useState([]);
  const [pergradesenior, setPerGradeSenior] = useState([]);
  const [listPerParticular, setListPerParticular] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [particulars, setParticulars] = useState([]);
  const [cashierList, setCashierList] = useState([]);
  const [perpaticularsForList, setPerParticularForList] = useState([]);
  const [cashier, setCashier] = useState([]);

  useEffect(() => {
    getOfflineCashiers().then((data) => {
      setCashierList(data);
    });
  }, []);
  const [filter, setFilter] = useState({
    grade: "",
    section: "",
    particular: "",
  });

  const { grade, section, particular } = filter;

  const [totalCollection, setTotalCollection] = useState(0);
  const [reportComponent, setReportComponent] = useState("ALL TRANSACTIONS");

  const middleInitial = `${selectedUser.middle_name}`
    ? `${selectedUser.middle_name == null ? "" : selectedUser.middle_name}`
    : "";
  const firstName = `${selectedUser.first_name}`
    ? `${selectedUser.first_name == null ? "" : selectedUser.first_name}`
    : "";
  const lastName = `${selectedUser.last_name}`
    ? `${selectedUser.last_name == null ? "" : selectedUser.last_name}`
    : "";
  const fullName = `${firstName} ${middleInitial.charAt(0)}. ${lastName}`;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateReport = () => {
    getAllTransactionsCollection(formData).then((data) => {
      setReports(data);
    });

    getPerParticular(formData).then((data) => {
      setPerParticular(data);
      getListNonStudent(formData).then((data2) => {

        setNonStudent(data2);
        const perPerticularData = data.map((i) => ({
          id: i.id,
          name: i.name,
          total: i.total,
          type: "PERTICULAR",
        }));
        const nonStudentData = data2.map((i) => ({
          id: i.id,
          name: i.finance_category,
          total: i.total,
          type: "NONSTUDENT",
        }));
        setPerParticularForList([...perPerticularData, ...nonStudentData]);
      });
    });

    getPerGradeLevelElementary(formData).then((data) => {
      setPerGradeElem(data);
    });

    getGradeLevelJunior(formData).then((data) => {
      setPerGradeJunior(data);
    });

    getPerGradeLevelSeniorHigh(formData).then((data) => {
      setPerGradeSenior(data);
    });

    getListPerParticular(formData).then((data) => {
      setListPerParticular(data);
    });
  };

  const reset = () => {
    setFormData({
      dateFrom: "",
      dateTo: "",
      ecrFrom: "",
      ecrTo: "",
      orFrom: "",
      orTo: "",
      cashBegin: "",
      cashEnd: "",
      cashSubmitted: "",
      initial: "",
    });

    setReports([]);
    setPerParticular([]);
    setPerGradeElem([]);
    setPerGradeJunior([]);
    setPerGradeSenior([]);
    setNonStudent([]);
  };

  const clearFilter = () => {
    setFilter({
      grade: "",
      section: "",
      particular: "",
    });
  };

  const printReport = () => {
    printJS({
      printable: "printReport",
      type: "html",
      font_size: "13px",
      style: "*{font-family: Calibri;}",
    });
  };

  useEffect(() => {
    let collection1 = 0;
    let collection2 = 0;
    let collection = 0;


    for (let i = 0; i < reports.length; i++) {
      if (!reports[i].income_is_reversal) {
        collection1 += reports[i].income_amount;
      }

      if (!reports[i].is_reversal) {
        collection2 += reports[i].amount;
      }
      collection = collection1 + collection2;
    }

    setTotalCollection(collection);
  }, [reports]);

  // console.log(reports);

  useEffect(() => {
    getOfflineDistinct("grade").then(setGradeList);
    getOfflineDistinct("section").then(setSectionList);
    getOfflineParticulars().then(setParticulars);
  }, []);
  const [dataHolder, setdataHolder] = useState([]);
  const [selectionRadio, setselectionRadio] = useState(0);

  useEffect(() => {
    setdataHolder(perpaticularsForList);
  }, [perpaticularsForList]);

  function onFilterClick(showID) {
    if (showID === 0) {
      setdataHolder(perpaticularsForList);
    } else if (showID === 1) {
      setdataHolder(
        perpaticularsForList.filter((i) => i.type === "PERTICULAR")
      );
    } else if (showID === 2) {
      setdataHolder(
        perpaticularsForList.filter((i) => i.type === "NONSTUDENT")
      );
    }
  }

  useEffect(() => {
    getListPerParticular(formData, filter).then((data) => {
      setListPerParticular(data);
    });
  }, [filter]);


  return (
    <div>
      <div className={styles.CollectionReportAllTransComponent}>
        <h2>Collection Report - All Transactions</h2>
        <div className={styles.CollectionReportAllTransComponentRow}>
          <h4>Generated by:</h4>
          <p>{selectedUser.initial ? selectedUser.initial : ""}</p>
        </div>
        <div
          className={`${styles.CollectionReportAllTransComponentRow} ${styles.withTwoColumn}`}
        >
          <div>
            <h4>Date From:</h4>
            <div
              className={styles.CollectionReportAllTransComponentRow}
              type="date"
            >
              <input
                type="date"
                name="dateFrom"
                value={dateFrom}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <h4>To:</h4>
            <div
              className={styles.CollectionReportAllTransComponentRow}
              type="date"
            >
              {/* <input type="text" placeholder="Date" />
              <img src='./img/icon-calendar.png' alt='Calendar logo' /> */}
              <input
                type="date"
                name="dateTo"
                value={dateTo}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div
          className={`${styles.CollectionReportAllTransComponentRow} ${styles.withLineInput}`}
        >
          <h4>Cashier Name:</h4>
          <div className={styles.cashierDropdown}>
            <select name="initial" value={initial} onChange={handleChange}>
              <option value="None" defaultValue>
                All
              </option>
              {cashierList &&
                cashierList.map((item, index) => (
                  <option key={index} value={item.initial}>
                    {item.full_name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div
          className={`${styles.CollectionReportAllTransComponentRow} ${styles.withLineInput}`}
        >
          <h4>ECR Number Series:</h4>
          <div>
            <input
              type="text"
              name="ecrFrom"
              value={ecrFrom}
              onChange={handleChange}
            />
            <span>to</span>
            <input
              type="text"
              name="ecrTo"
              value={ecrTo}
              onChange={handleChange}
            />
          </div>
        </div>
        <div
          className={`${styles.CollectionReportAllTransComponentRow} ${styles.withLineInput}`}
        >
          <h4>OR Number Series:</h4>
          <div>
            <input
              type="text"
              name="orFrom"
              value={orFrom}
              onChange={handleChange}
            />
            <span>to</span>
            <input
              type="text"
              name="orTo"
              value={orTo}
              onChange={handleChange}
            />
          </div>
        </div>
        <div
          className={`${styles.CollectionReportAllTransComponentRow} ${styles.withTwoColumn}`}
        >
          <div>
            <h4>Number of Transactions:</h4>
            <p>{reports ? new Set(reports.map((i) => i.ecr_no)).size : 0}</p>
          </div>
          <div>
            <h4>Total Collection (₱):</h4>
            <p>{formatToCurrency(totalCollection)}</p>
          </div>
        </div>
        <div
          className={`${styles.CollectionReportAllTransComponentRow} ${styles.withLineInput}`}
        >
          <h4>Cash on Hand (Begin):</h4>
          <div>
            <input
              type="number"
              name="cashBegin"
              value={cashBegin}
              onChange={handleChange}
            />
          </div>
        </div>
        <div
          className={`${styles.CollectionReportAllTransComponentRow} ${styles.withLineInput}`}
        >
          <h4>Cash submitted</h4>
          <div>
            <input
              type="number"
              name="cashSubmitted"
              value={cashSubmitted}
              onChange={handleChange}
            />
          </div>
        </div>
        <div
          className={`${styles.CollectionReportAllTransComponentRow} ${styles.withLineInput}`}
        >
          <h4>Cash on Hand (End):</h4>
          <div>
            <input
              type="number"
              name="cashEnd"
              value={cashEnd}
              onChange={handleChange}
            />
          </div>
        </div>

        <div
          className={`${styles.CollectionReportAllTransComponentRow} ${styles.withButtons}`}
        >
          <button onClick={reset}>Reset</button>
          <button onClick={generateReport}>Generate Report</button>
        </div>
      </div>

      {reports.length > 0 && (
        <div>
          <div className={styles.flex}>
            <div className={styles.flex}>
              <button
                className={
                  reportComponent === "ALL TRANSACTIONS" ? styles.active : ""
                }
                onClick={() => setReportComponent("ALL TRANSACTIONS")}
              >
                DETAILED COLLECTION REPORT
              </button>
              <button
                className={
                  reportComponent === "PER GRADE LEVEL" ? styles.active : ""
                }
                onClick={() => setReportComponent("PER GRADE LEVEL")}
              >
                DEPARTMENT COLLECTION
              </button>
              <button
                className={
                  reportComponent === "PER PARTICULAR" ? styles.active : ""
                }
                onClick={() => setReportComponent("PER PARTICULAR")}
              >
                DAILY SUMMARY COLLECTION
              </button>
              {/* <button
                className={
                  reportComponent === "NON STUDENT LIST" ? styles.active : ""
                }
                onClick={() => setReportComponent("NON STUDENT LIST")}
              >
                NON STUDENT LIST
              </button> */}
              <button
                className={
                  reportComponent === "LIST PER PARTICULAR" ? styles.active : ""
                }
                onClick={() => setReportComponent("LIST PER PARTICULAR")}
              >
                PAID PER PARTICULAR
              </button>
            </div>

            <div>
              {/* <button className={styles.printBtn} onClick={printReport}>Excel</button> */}
            </div>
            <div className={styles.btnContainer2}>
              <Excel
                reports={reports}
                type={reportComponent}
                listPerParticular={listPerParticular}
                reportsparticular={dataHolder}
                pergradeelem={pergradeelem}
                pergradejunior={pergradejunior}
                pergradesenior={pergradesenior}
                dateName={moment(dateFrom).format('MMMM D, YYYY') + " - " + moment(dateTo).format('MMMM D, YYYY')}
              />
              <button className={styles.printBtn} onClick={printReport}>
                Print
              </button>
            </div>
          </div>

          {reportComponent === "LIST PER PARTICULAR" && (
            <div className={styles.ListPartiFilter}>
              <select
                name="grade"
                value={grade}
                onChange={(e) =>
                  setFilter({ ...filter, grade: e.target.value })
                }
              >
                <option value="" defaultValue>
                  Grade
                </option>
                {gradeList &&
                  gradeList.map((grade, index) => (
                    <option key={index} value={grade}>
                      {grade}
                    </option>
                  ))}
              </select>

              <select
                name="section"
                value={section}
                onChange={(e) =>
                  setFilter({ ...filter, section: e.target.value })
                }
              >
                <option value="" defaultValue>
                  Section
                </option>
                {sectionList &&
                  sectionList.map((section, index) => (
                    <option key={index} value={section}>
                      {section}
                    </option>
                  ))}
              </select>

              <select
                name="particular"
                value={particular}
                onChange={(e) =>
                  setFilter({ ...filter, particular: e.target.value })
                }
              >
                <option value="" defaultValue>
                  Particular
                </option>
                {particulars &&
                  particulars.map((particular) => (
                    <option key={particular.id} value={particular.id}>
                      {particular.name}
                    </option>
                  ))}
              </select>

              <button className={styles.printBtn} onClick={clearFilter}>
                Clear
              </button>
            </div>
          )}
        </div>
      )}

      {reports.length > 0 && reportComponent === "ALL TRANSACTIONS" && (
        <AllTransactions reports={reports} />
      )}

      {perpaticulars.length > 0 && reportComponent === "PER PARTICULAR" && (
        <div>
          <div className={styles.radioContainer}>
            <div className={styles.radioGroup} onClick={() => onFilterClick(0)}>
              <input
                type="radio"
                id="allData"
                name="selection"
                value="all"
                onChange={(e) => setselectionRadio(0)}
                checked={selectionRadio === 0}
              />
              <label for="allData">Show All Data</label>
            </div>
            <div className={styles.radioGroup} onClick={() => onFilterClick(1)}>
              <input
                type="radio"
                id="perParticularsOnly"
                name="selection"
                onChange={(e) => setselectionRadio(1)}
                checked={selectionRadio === 1}
                value="perPerticular"
              />
              <label for="perParticularsOnly">Per Particular Only</label>
            </div>
            <div className={styles.radioGroup} onClick={() => onFilterClick(2)}>
              <input
                type="radio"
                id="nonStudentOnly"
                name="selection"
                onChange={(e) => setselectionRadio(2)}
                checked={selectionRadio === 2}
                value="nonStudent"
              />
              <label for="nonStudentOnly">Non Student Only</label>
            </div>
          </div>
          <PerParticular perpaticulars={dataHolder} />
        </div>
      )}

      {/* {nonstudents.length > 0 && reportComponent === "NON STUDENT LIST" && (
        <NonStudentPerParticular nonstudents={nonstudents} />
      )} */}

      {(pergradejunior.length > 0 ||
        pergradejunior.length > 0 ||
        pergradesenior.length > 0) &&
        reportComponent === "PER GRADE LEVEL" && (

          <PerGradeLevel
            pergradeelem={pergradeelem}
            pergradejunior={pergradejunior}
            pergradesenior={pergradesenior}
            pernonstudent={perpaticularsForList.filter((i) => i.type === "NONSTUDENT")}
          />
        )}

      {listPerParticular.length > 0 &&
        reportComponent === "LIST PER PARTICULAR" && (
          <ListPerParticular listPerParticular={listPerParticular} />
        )}

      {reports.length > 0 &&
        (reportComponent === "PER PARTICULAR") |
        (reportComponent === "PER GRADE LEVEL") ? (
        <ReportSummary formData={formData} totalCollection={totalCollection} />
      ) : (
        []
      )}

      <PrintReport
        dateFrom={dateFrom}
        dateTo={dateTo}
        ecrFrom={ecrFrom}
        ecrTo={ecrTo}
        orFrom={orFrom}
        orTo={orTo}
        schoolName={selectedUser.school}
        numberOfTransactions={
          reports ? new Set(reports.map((i) => i.ecr_no)).size : 0
        }
        totalCollection={totalCollection}
        cashBegin={cashBegin}
        cashSubmitted={cashSubmitted}
        cashEnd={cashEnd}
        AllTransactions={() => (
          <AllTransactions reports={reports} forPrint={true} />
        )}
        PerParticular={() => (
          <PerParticular perpaticulars={dataHolder} forPrint={true} />
        )}
        PerGradeLevel={() => (
          <PerGradeLevel
            pergradeelem={pergradeelem}
            pergradejunior={pergradejunior}
            pergradesenior={pergradesenior}
            pernonstudent={perpaticularsForList.filter((i) => i.type === "NONSTUDENT")}
            forPrint={true}
          />
        )}
        ListPerParticular={() => (
          <ListPerParticular
            listPerParticular={listPerParticular}
            forPrint={true}
          />
        )}
        ReportSummary={() => (
          <ReportSummary
            formData={formData}
            totalCollection={totalCollection}
            forPrint={true}
          />
        )}
        reportComponent={reportComponent}
      />
    </div>
  );
};

export default CollectionReportAllTransComponent;
