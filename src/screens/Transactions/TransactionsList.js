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

 //#region TESTING (not used)
const [nextOffset, setNextOffset] = useState(100);
const [prevOffset, setPrevOffset] = useState(-100);

const GetTransactionBatch = async (offset, isNext) => {
  setLoadingDone(false);
  setTransactions(null);
  const response = await axios.get(
    `${apiUrl}/api/accounting/transactions?limit=100&offset=${offset}`, {
       headers: {
       Authorization: `Bearer ${apiToken}`,
       },
    });
    if(response.status === 200){
      SetButton(response,null,isNext);
    }
    else{
      Swal.fire( "Error",  "Something Went Wrong!", "error" );
      setLoadingDone(true);
    }
}

const SetButton = (response, transaction, isNext) => {
  if(response.data.next !== null) {
    setNextAPICall(response.data.next)
    if(isNext == true){
      setPrevOffset(prevState => prevState+100);
      setNextOffset(prevState => prevState+100);
      console.log('next')
    }
    if(isNext == false){
      setNextOffset(prevState => prevState-100);
      setPrevOffset(prevState => prevState-100);

      console.log('prev')
    }
  } else {setNextAPICall(null) }
  if(response.data.previous !== null) {
    setPrevAPICall(response.data.previous)
  } else { setPrevAPICall(null) }
  if(transaction == undefined){
    setTransactions(response.data.results); }
  else{
    setTransactions(transaction); }
  console.log('nextOffSet',nextOffset)
  console.log('prevOffSet',prevOffset)
  setLoadingDone(true);
}

//#endregion

const GetTransactionSearch = async () => {
  setLoadingDone(false);
  setTransactions(null);
  let searchedQuery = []  
  const response1 = await axios.get(
    `${apiUrl}/api/accounting/transactions?limit=100&or_no=${searchQuery}`, {
       headers: {
       Authorization: `Bearer ${apiToken}`,
       },
    });
    if(response1.status === 200){
      searchedQuery = [...searchedQuery,...response1.data.results]
      SetButton(response1, searchedQuery);
    }
    else{
      Swal.fire( "Error",  "Something Went Wrong!", "error" );
      setLoadingDone(true);
    }
    const response2 = await axios.get(
      `${apiUrl}/api/accounting/transactions?limit=100&ecr_no=${searchQuery}`, {
         headers: {
         Authorization: `Bearer ${apiToken}`,
         },
      });
      if(response2.status === 200){
        searchedQuery = [...searchedQuery,...response2.data.results]
        SetButton(response2, searchedQuery);
      }
      else{
        Swal.fire( "Error",  "Something Went Wrong!", "error" );
        setLoadingDone(true);
      }
}

const NextPage = () => {
  //GetTransactionBatch(nextOffset, true)
  GetAllTransaction(nextAPICall)
}
const PrevPage = () => {
  //GetTransactionBatch(prevOffset, false)
  GetAllTransaction(prevAPICall)
}

const baseAPICall = `${apiUrl}/api/accounting/transactions?limit=100&offset=0`;
const [nextAPICall, setNextAPICall] = useState(null)
const [prevAPICall, setPrevAPICall] = useState(null)

const NextPrevBTN = () => {
  return (
    <div style={{ textAlign : 'center'}}>
    { prevAPICall !==null && <div style={{ display : 'inline-block'}}>
            <button onClick={PrevPage}>
                  <img src='./img/left-arrow.png' />Previous</button>
    </div>}
    { nextAPICall !==null && <div style={{ display : 'inline-block'}}>
            <button onClick={NextPage}>
              Next<img src='./img/right-arrow.png'/></button>
     </div>}
     </div>
  )
}

const GetAllTransaction = async (apiCall) => {
  setTransactions(null);
  setLoadingDone(false);
  const response = await axios.get(
    `${apiCall}`, {
       headers: {
       Authorization: `Bearer ${apiToken}`,
       },
    });
    if(response.status === 200){
      setTransactions(response.data.results);
      if(response.data.next !== null) {
        let next = response.data.next;
        setNextAPICall(`${next.slice(0,4)}s${next.slice(4)}`)
      } else {setNextAPICall(null) }
      if(response.data.previous !== null) {
        let prev = response.data.previous;
        setPrevAPICall(`${prev.slice(0,4)}s${prev.slice(4)}`)
      } else { setPrevAPICall(null) }
      setLoadingDone(true);
    } 
    else{
      Swal.fire( "Error",  "Something Went Wrong!", "error" );
      setLoadingDone(true);
    }
}

 useEffect(() => {
  GetAllTransaction(baseAPICall);
    // GetAllTransaction;
    // GetTransactionBatch(0);
 },[])
  

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

  const searchTransactionOffline = () => {
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

  //#region  offline search
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

  //#endregion

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
              onClick={GetTransactionSearch}
            />
          </div>
          <div className={styles.searchNote}>
            {/* You may search for student name, OR No., ECR No., and Date */}
            You may search for OR No., and ECR No.
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
            display: !loadingDone ? "block" : "none",
          }}
          className="load_container"
        >
          <div className="loader">
            <span></span>
          </div>
        </div>
        <div className={styles.enrollmentPagi}>
          {(transactions && transactions !== null) && (
            <NextPrevBTN/>
            // <Pagination
            //   studentsPerPage={transactionsPerPage}
            //   totalEnrolled={totalTransactions}
            //   changePage={changePage}
            //   activePage={activePage}
            //   pageIndex={pageIndex}
            //   setPageIndex={setPageIndex}
            // />
          )}
        </div>
      </div>
    </>
  );
  
};




export default TransactionsList;
