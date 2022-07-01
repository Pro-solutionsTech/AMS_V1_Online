import React, {useState} from 'react';
import styles from './StudentFinanceContainer.module.css';
import SidebarComponent from "../../screens/commons/Sidebar/SidebarComponent";
import SearchComponent from "../../screens/commons/Search/SearchComponent";
import StudentFinance from "../../screens/Enrolled/StudentFinance";

export default function StudentFinanceContainer(props) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <div className={`${styles.mainWrapper} ${styles.dashboardContainer}`}>
        <SidebarComponent/>
        <SearchComponent searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
        <div className={styles.contentContainer}>
          <StudentFinance/>
        </div>
      </div>
    </>
  )
}
