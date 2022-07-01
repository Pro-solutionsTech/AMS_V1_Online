import React, { useEffect, useState } from "react";
import styles from "./Enrolled.module.css";
import EnrollmentTableItem from "./EnrollmentTableItem";
import Pagination from "../commons/Pagination/Pagination";
import {
  getOfflineEnrollments,
  countOfflineEnrollments,
  getOfflineDistinct,
  getOfflineFilterByGradeAndSection,
  getCountOfflineFilter,
} from "../../repository/EnrollmentRepository";
import { offlineDatabaseError } from "../../repository/base";
import { getOfflinePaymentSchemes } from "../../repository/PaymentSchemeRepository";
import "./Loader.css";
import styles2 from "./TransactionHistoryModal.module.css";
import TransactionHistoryModal from "./TransactionHistoryModal";
import VoucherApprovalModal from "./VoucherApprovalModal";
import { useSelector } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";

export default function Enrolled({ searchQuery }) {
  const [enrollments, setEnrollments] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEnrolled, setTotalEnrolled] = useState(0);
  const [studentsPerPage] = useState(100);
  const [distinctGrade, setDistinctGrade] = useState(null);
  const [distinctSection, setDistinctSection] = useState(null);
  const [searchStudent, setSearchStudent] = useState({
    name: "",
    grade: "",
    section: "",
    school_year: "2021-2022"
  });
  const [activePage, setActivePage] = useState(1);
  const [pageIndex, setPageIndex] = useState({
    startIndex: 0,
    endIndex: 5,
  });

  const { name, grade, section, school_year } = searchStudent;
  const [schoolyear, setSchoolYear] = useState("2021-2022");

  const handleSchoolYearChange = (e) => {
    setSchoolYear(e.target.value)
  }

  const clear = () => {
    setSearchStudent({
      name: "",
      grade: "",
      section: "",
    });
  };


  function retrieveEnrollmentList(page, totalStudents, searchQuery) {
    getOfflinePaymentSchemes().then((paymentSchemes) => {
      getOfflineEnrollments(
        searchQuery,
        paymentSchemes,
        page,
        studentsPerPage,
        totalStudents
      )
        .then(setEnrollments)
        .catch(offlineDatabaseError);
    });
  }

  function searchStudentByName(name) {
    changePage(1);
    setPageIndex({ startIndex: 0, endIndex: 5 });
    countOfflineEnrollments(name).then((totalStudents) => {
      setTotalEnrolled(totalStudents);
      retrieveEnrollmentList(1, totalStudents, name);
    });
  }

  function filterEnrolledStudents() {
    getOfflinePaymentSchemes().then((paymentSchemes) => {
      getOfflineFilterByGradeAndSection(
        paymentSchemes,
        currentPage,
        studentsPerPage,
        grade,
        section,
        school_year
      )
        .then(setEnrollments)
        .catch(offlineDatabaseError);
    });
  }

  useEffect(() => {
    getOfflineDistinct("grade").then(setDistinctGrade);
    getOfflineDistinct("section").then(setDistinctSection);
  }, []);

  useEffect(() => {
    if (grade || section || school_year) {
      filterEnrolledStudents();
    } else {
      retrieveEnrollmentList(currentPage, totalEnrolled, searchQuery);
    }
  }, [currentPage]);

  useEffect(() => {
    if (!name) {
      searchStudentByName("");
    }
  }, [name]);

  useEffect(() => {
    changePage(1);
    setPageIndex({ startIndex: 0, endIndex: 5 });

    getCountOfflineFilter(grade, section, school_year).then(setTotalEnrolled);

    if (grade || section || school_year) {
      filterEnrolledStudents();
    } else {
      retrieveEnrollmentList(1, totalEnrolled, searchQuery);
    }
  }, [grade, section, school_year]);

  const handleChange = (e) => {
    setSearchStudent({ ...searchStudent, [e.target.name]: e.target.value });
  };

  const changePage = (number) => {
    setActivePage(number);
    setCurrentPage(number);
  };


  //loader
  let loading = true;
  enrollments === null && totalEnrolled > 0 ? loading = true : loading = false;

  const [openDesign, setOpenDesign] = useState(false);



  //get enrolled students online

  //get api token url and other creds -start ()
  const user = useSelector((state) => state.user);
  const settingDatas = useSelector((state) => state.userCredential.state)
  const apiToken = user?.access_token;
  const apiUrl = settingDatas?.apiUrl
  //get api token url and other creds -end ()

  useEffect(() => {
    try {
      axios.get(
        `${apiUrl}/api/accounting/enrollments?limit=10&offset=1`, //reuse get function on create notice api
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      ).then(e => {
        console.log(e.data.results)
      })
    } catch (err) {
      Swal.fire(
        "Error",
        "Something Went Wrong!",
        "error"
      );
      console.log(err);
    }
  }, []);

  return (
    <div className={styles.enrollmentContainer}>

      <div className={styles.enrollmentHeader}>
        <h2>Enrolled Students</h2>

      </div>

      <div className={styles.enrollmentSearch}>
        <div
          className={`${styles.insideWrapperSearch} ${styles.insideWrapper}`}
        >
          <input
            type="text"
            name="name"
            placeholder="Search"
            className={`${styles.inputBtn} ${styles.searchstudBtn}`}
            value={name}
            onChange={handleChange}
          />
          <img
            style={{ zIndex: "0" }}
            src="./img/icon-search.png"
            alt="school logo"
            onClick={() => searchStudentByName(name)}
          />
        </div>
        <div className={`${styles.insideWrapper}`}>
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
        </div>
        <div className={`${styles.insideWrapper}`}>
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
        </div>
        <div className={`${styles.insideWrapper}`}>
          <select
            type="text"
            name="school_year"
            placeholder="Select School Year"
            className={`${styles.inputBtn} ${styles.bysectionSel}`}
            value={school_year}
            onChange={handleChange}
          >
            <option value="2020-2021" >
              2020-2021
            </option>
            <option value="2021-2022" defaultValue>
              2021-2022
            </option>
            <option value="2022-2023" >
              2022-2023
            </option>
          </select>
        </div>
        <div>
          <button className={styles.clearButton} onClick={clear}>
            Clear
          </button>
          {/* <button className={styles.clearButton} onClick={()=>setOpenDesign(true)}>
              Voucher Approval Design
            </button> */}
        </div>
      </div>

      {/* loader */}
      <div style={{ marginLeft: '45%', marginTop: '15%', display: (loading ? 'block' : 'none') }} className="load_container">
        <div className="loader" >
          <span></span>
        </div>
      </div>
      {openDesign ? (
        <>
          <VoucherApprovalModal
            setOpenDesign={setOpenDesign}

          />
        </>



      ) : null}

      <table className={styles.smartTable}>
        <thead className={styles.smartTableHeader}>
          <tr>
            <th>NAME</th>
            <th>STUDENT NO.</th>
            <th>GRADE</th>
            <th>SECTION</th>
            <th>PAYMENT SCHEME</th>
            <th>UPDATED AT</th>
          </tr>
        </thead>
        <tbody className={styles.smartTableBody}>
          {enrollments && enrollments.length ? (

            enrollments.map((enrollment) => (
              <EnrollmentTableItem item={enrollment} key={enrollment.id} />
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
  );
}
