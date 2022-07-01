import React, { useState } from "react";
import styles from "./Dashboard.module.css";
import SidebarComponent from "../../screens/commons/Sidebar/SidebarComponent";
import SearchComponent from "../../screens/commons/Search/SearchComponent";
import ReactLoading from "react-loading";
import { useSelector } from "react-redux";

const Dashboard = ({ props, Component }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const loading = useSelector((state) => state.loading);

  return (
    <div>
      <div className={`${styles.mainWrapper} ${styles.dashboardContainer}`}>
        <SidebarComponent />
        <SearchComponent
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <div className={styles.contentContainer}>
          <Component
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>

        {loading && (
          <div className={styles.loading}>
            <div className={styles.loadingContent}>
              <ReactLoading color="#001f71" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
