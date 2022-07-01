import React, { useState } from "react";
import styles from "./StudentFinanceContainer.module.css";
import SidebarComponent from "../../screens/commons/Sidebar/SidebarComponent";
import SearchComponent from "../../screens/commons/Search/SearchComponent";
import ProcessPayment from "../../screens/Enrolled/ProcessPayment";

export default function ProcessPaymentContainer(props) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <div className={`${styles.mainWrapper} ${styles.dashboardContainer}`}>
        <SidebarComponent />
        <SearchComponent
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <div className={styles.contentContainer}>
          <ProcessPayment />
        </div>
      </div>
    </div>
  );
}
