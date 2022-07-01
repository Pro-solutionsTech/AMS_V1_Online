import React, { useEffect, useState } from "react";
import styles from "./SOA.module.css";
import EnrollmentTableItem from "../../Enrolled/EnrollmentTableItem";
import Pagination from "../Pagination/Pagination";
import {
  getOfflineEnrollments,
  countOfflineEnrollments,
  getOfflineDistinct,
  getOfflineFilterByGradeAndSection,
  getCountOfflineFilter,
} from "../../../repository/EnrollmentRepository";
import { offlineDatabaseError } from "../../../repository/base";
import { getOfflinePaymentSchemes } from "../../../repository/PaymentSchemeRepository";
import { getOfflinePaymentPlanItems } from "../../../repository/PaymentPlanItemRepository";
import { getOfflineParticulars } from "../../../repository/ParticularRepository";
import { getOfflinePaidParticulars } from "../../../repository/PaidParticularRepository";
import {
  formatToCurrency,
  getOfflineSOA,
  countSOA,
} from "../../../repository/base";
import printJS from "print-js";
import PrintSOA from "./PrintSOA";

export default function SOA({ searchQuery }) {
  const [enrollments, setEnrollments] = useState(null);
  const [particulars, setParticulars] = useState(null);
  const [paidParticulars, setPaidParticulars] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEnrolled, setTotalEnrolled] = useState(0);
  const [studentsPerPage] = useState(100);
  const [distinctGrade, setDistinctGrade] = useState(null);
  const [distinctSection, setDistinctSection] = useState(null);
  const [searchStudent, setSearchStudent] = useState({
    grade: "",
    section: "",
    dateFrom: "",
    dateTo: "",
  });
  const [activePage, setActivePage] = useState(1);
  const [pageIndex, setPageIndex] = useState({
    startIndex: 0,
    endIndex: 5,
  });

  const { grade, section, dateFrom, dateTo } = searchStudent;

  const clear = () => {
    setSearchStudent({
      grade: "",
      section: "",
      dateFrom: "",
      dateTo: "",
    });
  };

  const searchDate = () => {
    changePage(1);
    setPageIndex({ startIndex: 0, endIndex: 5 });

    countSOA(grade, section, dateFrom, dateTo).then(setTotalEnrolled);

    retrieveEnrollmentList(1, totalEnrolled, searchQuery);
  };

  function retrieveEnrollmentList(page, totalStudents, searchQuery) {
    getOfflinePaymentPlanItems().then((payment_plan_items) => {
      getOfflinePaymentSchemes().then((paymentSchemes) => {
        getOfflineSOA(
          dateFrom,
          dateTo,
          page,
          studentsPerPage,
          paymentSchemes,
          payment_plan_items,
          grade,
          section
        )
          .then(setEnrollments)
          .catch(offlineDatabaseError);
      });
    });
  }

  useEffect(() => {
    getOfflineDistinct("grade").then(setDistinctGrade);
    getOfflineDistinct("section").then(setDistinctSection);

    getOfflineParticulars().then(setParticulars);

    getOfflinePaidParticulars().then(setPaidParticulars);
  }, []);

  useEffect(() => {
    retrieveEnrollmentList(currentPage, totalEnrolled, searchQuery);
  }, [currentPage]);

  useEffect(() => {
    changePage(1);
    setPageIndex({ startIndex: 0, endIndex: 5 });

    countSOA(grade, section, dateFrom, dateTo).then(setTotalEnrolled);

    retrieveEnrollmentList(1, totalEnrolled, searchQuery);
  }, [grade, section]);

  const handleChange = (e) => {
    setSearchStudent({ ...searchStudent, [e.target.name]: e.target.value });
  };

  const changePage = (number) => {
    setActivePage(number);
    setCurrentPage(number);
  };

  const printSOA = () => {
    printJS({
      printable: "bulk-soa",
      type: "html",
      font_size: "13px",
      style: "*{font-family: Calibri;}",
      targetStyles: ["*"],
    });
  };

  const accounts = [];

  if (enrollments && particulars && paidParticulars) {
    enrollments.forEach((enrollment) => {
      let balance = 0;

      enrollment.payment_plan_items_list.forEach((item) => {
        let totalPaid = 0;

        const particular = particulars.find((p) => p.id === item.particular_id);

        paidParticulars.forEach((paidParticular) => {
          if (
            paidParticular.particular_id === particular.id &&
            paidParticular.student_id === enrollment.id
          ) {
            totalPaid += paidParticular.amount;
          }
        });

        balance += item.amount - totalPaid;
      });

      accounts.push({
        id: enrollment.id,
        studentNo: enrollment.student_no,
        firstName: enrollment.first_name,
        lastName: enrollment.last_name,
        grade: enrollment.grade,
        section: enrollment.section,
        balance: balance,
        school_year: enrollment.school_year,
      });
    });
  }
  let loading = true;
  enrollments === null ? loading = true : loading = false;
  return (
    <>
      <div className={styles.enrollmentContainer}>
        <div className={styles.enrollmentHeader}>
          <h2>BULK SOA</h2>
        </div>
        <div className={styles.enrollmentSearch}>
          <div>
            <div className={`${styles.insideWrapper}`}>
              <input
                type="date"
                name="dateFrom"
                onChange={handleChange}
                value={dateFrom}
              />
            </div>
            <div className={`${styles.insideWrapper}`}>
              <input
                type="date"
                name="dateTo"
                onChange={handleChange}
                value={dateTo}
              />
            </div>
            <div className={`${styles.insideWrapper}`}>
              <button className={styles.clearButton} onClick={searchDate}>
                Search Date
              </button>
            </div>
          </div>
          <div>
            <select
              type="text"
              name="grade"
              placeholder="Search"
              className={`${styles.inputBtn} ${styles.bygradeSel}`}
              value={grade}
              onChange={handleChange}
            >
              <option value="" defaultValue>
                By Grade
              </option>
              {distinctGrade &&
                distinctGrade.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
            </select>
            <select
              type="text"
              name="section"
              placeholder="By Section"
              className={`${styles.inputBtn} ${styles.bysectionSel}`}
              value={section}
              onChange={handleChange}
            >
              <option value="" defaultValue>
                By Section
              </option>
              {distinctSection &&
                distinctSection.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
            </select>
            <div>
              <button className={styles.clearButton} onClick={clear}>
                Clear
              </button>
            </div>
          </div>
          <div>
            <button className={styles.clearButton} onClick={printSOA}>
              Print
            </button>
          </div>
        </div>
         {/* loader */}
                <div style ={{marginLeft: '45%',marginTop : '15%' , display: (loading ? 'block' : 'none') }} className="load_container">
                  <div className="loader" > 
                    <span></span>
                  </div>
                </div>
        <table className={styles.smartTable}>
          <thead className={styles.smartTableHeader}>
            <tr>
              <th>STUDENT NO.</th>
              <th>LAST NAME</th>
              <th>FIRST NAME</th>
              <th>GRADE</th>
              <th>SECTION</th>
              <th>BALANCE</th>
            </tr>
          </thead>
          <tbody className={styles.smartTableBody}>
            {accounts && accounts.length ? (
              accounts.map((account) => (
                <tr
                  key={account.id}
                  className={`${styles.smartTableItemContainer} ${styles.borderBottom}`}
                >
                  <td>{account.studentNo}</td>
                  <td>{account.lastName}</td>
                  <td>{account.firstName}</td>
                  <td>{account.grade}</td>
                  <td>{account.section}</td>
                  <td>{formatToCurrency(account.balance)}</td>
                </tr>
              ))
            ) : (
              <tr>
                 
                <td colSpan={6}>
                  No enrolled students found. Try syncing first.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className={styles.enrollmentPagi}>
          {enrollments && (
            <Pagination
              studentsPerPage={studentsPerPage}
              totalEnrolled={totalEnrolled}
              changePage={changePage}
              activePage={activePage}
              pageIndex={pageIndex}
              setPageIndex={setPageIndex}
            />
          )}
        </div>
      </div>

      <PrintSOA accounts={accounts} />
    </>
  );
}
