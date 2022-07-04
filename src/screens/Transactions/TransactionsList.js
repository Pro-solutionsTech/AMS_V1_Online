import React, { useState, useEffect } from "react";
import styles from "./TransactionsList.module.css";
import TransactionsListTableItem from "./TransactionsListTableItem";
import {
  countTransactions,
  getTransactions,
  getTransactionsSearch,
} from "../../repository/TransactionRepository";
import Pagination from "../commons/Pagination/Pagination";
import { useSelector } from "react-redux";

import axios from "axios";
import Swal from "sweetalert2";

const TransactionsList = ({ }) => {
  const [transactions, setTransactions] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [transactionsPerPage] = useState(100);
  const [activePage, setActivePage] = useState(1);
  const selectedUser = useSelector((state) => state.user);

  const [pageIndex, setPageIndex] = useState({
    startIndex: 0,
    endIndex: 5,
  });

  const [loadingDone, setLoadingDone] = useState(false)
  
  const userInitial = selectedUser.initial;
  // useEffect(() => {
  //   const cleanup = countTransactions().then((total) => {
  //     setTotalTransactions(total);
  //     getTransactions(currentPage, transactionsPerPage, userInitial).then(
  //       setTransactions
  //     );
  //   });
  //   return cleanup;
  // }, []);

 const user = useSelector((state) => state.user);
 const settingDatas = useSelector((state) => state.userCredential.state)
 const apiToken = user?.access_token;
 const apiUrl = settingDatas?.apiUrl

let pages = 0, currPage = 1;
let offset = 0;

const GetAllTransaction = async () => {
  let newList = []
  while (currPage <= pages){
    console.log('offset', offset)
    const response = await axios.get(
      `${apiUrl}/api/accounting/transactions?limit=100&offset=${offset}`, {
         headers: {
         Authorization: `Bearer ${apiToken}`,
         },
      });
      if(response.status === 200){
        newList = [...newList, ...response.data.results]
        currPage+=1;
        offset+=100;
      }
      
  }
  setTransactions(newList)
  console.log('newList', newList)
  setLoadingDone(true);
}

const GetAllTransactionCount = async () => {
  const response = await axios.get(
    `${apiUrl}/api/accounting/transactions?limit=1&offset=0`, {
       headers: {
       Authorization: `Bearer ${apiToken}`,
       },
    });
    if(response.status === 200){
      pages = Math.ceil(response.data.count / 100)
      console.log('pages', pages)
      GetAllTransaction();
    } 
}

const searchTransaction2 = () => {
  changePage(1);
  const filteredData = transactions.filter((item) => {
    const initial = item.ecr_no?.split("-")[1];
    if (initial === userInitial) {
      return item;
    }
  });
}

 useEffect(() => {
  GetAllTransactionCount();
 },[activePage])
  

  // useEffect(() => {
  //   const cleanup = getTransactions(
  //     currentPage,
  //     transactionsPerPage,
  //     userInitial
  //   ).then(setTransactions);

  //   return cleanup;
  // }, [currentPage]);

  const changePage = (number) => {
    setActivePage(number);
    setCurrentPage(number);
  };

  const searchTransaction = () => {
    changePage(1);

    countTransactions(searchQuery).then((total) => {
      setTotalTransactions(total);
      getTransactionsSearch(1, total, searchQuery, userInitial).then((data) => {
        const filteredData = data.filter((item) => {
          const initial = item.ecr_no?.split("-")[1];
          if (initial === userInitial) {
            return item;
          }
        });
        setTransactions(filteredData);
      });
    });
  };

  const [searchQuery, setSearchQuery] = useState("");

  let loading = true;
  transactions === null && totalTransactions > 0
    ? (loading = true)
    : (loading = false);

  //console.log(transactions)

  return (
    <>
      <div className={styles.transactionsListContainer}>
        <div className={styles.transactionsListHeader}>
          <h2>Transactions List</h2>
        </div>
        <div className={styles.transactionsListSearch}>
          <div
            className={`${styles.insideWrapperSearch} ${styles.insideWrapper}`}
          >
            <input
              type="text"
              name="name"
              placeholder="Search"
              className={`${styles.inputBtn} ${styles.searchTransactionBtn}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <img
              src="./img/icon-search.png"
              alt="school logo"
              onClick={searchTransaction}
            />
          </div>
          <div className={styles.searchNote}>
            You may search for student name, OR No., ECR No., and Date
            (YYYY-MM-DD)
          </div>
        </div>
        <table className={styles.smartTable}>
          <thead className={styles.smartTableHeader}>
            <tr>
              <th>ECR NO.</th>
              <th>OR NO.</th>
              <th>DATE</th>
              <th>STUDENT NO.</th>
              <th>STUDENT NAME</th>
              <th>DESCRIPTION</th>
              <th>AMOUNT</th>
            </tr>
          </thead>
          <tbody className={styles.smartTableBody}>
            {transactions && transactions.length > 0 && transactions !== null? (
              transactions.map((transaction, index) => (
                <TransactionsListTableItem
                  transaction={transaction}
                  key={index}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6}>No transactions found. Try syncing first.</td>
              </tr>
            )}
          </tbody>
        </table>
        {/* loader */}
        <div
          style={{
            marginLeft: "45%",
            marginTop: "15%",
            display: loading ? "block" : "none",
          }}
          className="load_container"
        >
          <div className="loader">
            <span></span>
          </div>
        </div>
        <div className={styles.enrollmentPagi}>
          {(transactions && transactions !== null) && (
            <Pagination
              studentsPerPage={transactionsPerPage}
              totalEnrolled={totalTransactions}
              changePage={changePage}
              activePage={activePage}
              pageIndex={pageIndex}
              setPageIndex={setPageIndex}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default TransactionsList;
