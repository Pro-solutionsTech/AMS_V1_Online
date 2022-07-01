import React, { useState, useReducer, useEffect } from "react";
import styles from "./SearchComponent.module.css";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  credentialsReducer,
  credentialsInitialState,
} from "../../../reducers/Credentials";
import { getLatestSyncDate } from "../../../repository/SyncRepository";
import { getSettings } from "../../../repository/SettingsRepository";
import { syncOnlineAndOfflineMasterFees } from "../../../repository/MasterFeeRepository";
import { syncOnlineAndOfflineEnrollments } from "../../../repository/EnrollmentRepository";
import { syncOnlineAndOfflinePaymentSchemes } from "../../../repository/PaymentSchemeRepository";
import { syncOnlineAndOfflineParticulars } from "../../../repository/ParticularRepository";
import { syncOnlineAndOfflinePaidParticulars } from "../../../repository/PaidParticularRepository";
import { syncOnlineAndOfflinePaymentPlans } from "../../../repository/PaymentPlanRepository";
import { syncOnlineAndOfflinePaymentPlanItems } from "../../../repository/PaymentPlanItemRepository";
import { syncOnlineAndOfflineTransactions } from "../../../repository/TransactionRepository";
import { syncOnlineAndOfflinePaymentPeriods } from "../../../repository/PaymentPeriodRepository";
import { syncDate } from "../../../repository/SyncRepository";
import { syncOnlineAndOfflineRemarks } from "../../../repository/RemarksRepository";
import { syncOnlineAndOfflineReversals } from "../../../repository/ReversalRepository";
import { syncOnlinePaymentMethods } from "../../../repository/PaymentMethodRepository";
import { syncOnlineFinanceAccounts } from "../../../repository/FinanceAccountRepository";
import { syncOnlineAndOfflineStudentPayments } from "../../../repository/StudentPaymentRepository";
import { syncOnlineAndOfflinePaidAdditionalFees } from "../../../repository/PaidAddittionalFeeRepository";

import { syncOnlineAndOfflineCashiers } from "../../../repository/CashierRepository";

import { syncOnlineAndOfflineAdditionalFee } from "../../../repository/AddittionalFeeRepository";
import { syncOnlineAndOfflineLibraryLateFees } from "../../../repository/LibraryLateFeeRepository";
import { syncOnlineAndOfflineIncomeEntries } from "../../../repository/IncomeRepository";
import { syncOnlineAndOfflineRequestReversals } from "../../../repository/RequestReversalRepository";
import { syncOnlineFinanceCategories } from "../../../repository/FinanceCategoryRepository";
import { ToastContainer, toast } from "react-toastify";

import Swal from "sweetalert2";
import Moment from "react-moment";
import axios from "axios";

export default function SearchComponent({ searchQuery, setSearchQuery }) {
  const [internalSearch, setInternalSearch] = useState(searchQuery);
  const [lastSync, setLastSync] = useState(null);
  const reduxDispatch = useDispatch();

  const selectedUser = useSelector((state) => state.user);
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

  const [credentialsState, credentialsDispatch] = useReducer(
    credentialsReducer,
    credentialsInitialState
  );

  const [state, setState] = useState({
    apiUrl: "",
    client_id: "",
    client_secret: "",
  });

  const { apiUrl, client_id, client_secret } = state;

  const userCredential = useSelector((state) => state.userCredential);

  const history = useHistory();

  const logout = () => {
    Swal.fire({
      title: "Logout",
      html: "Are you sure you want to logout And Sync?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.value) {
        credentialsDispatch({ type: "LOGOUT" });
        await sync();
        reduxDispatch({ type: "GET_USER_LOG_OUT" });
        reduxDispatch({ type: "CLEAR_USER_CREDENTIAL" });
        history.push("/");
      } else {
        credentialsDispatch({ type: "LOGOUT" });
        reduxDispatch({ type: "GET_USER_LOG_OUT" });
        reduxDispatch({ type: "CLEAR_USER_CREDENTIAL" });
        history.push("/");
      }
    });
  };

  useEffect(() => {
    getLatestSyncDate().then((date) => setLastSync(date?.sync_date));

    getSettings().then((settings) => {
      setState({
        ...state,
        apiUrl: settings?.api_url || "",
        client_id: settings?.client_id || "",
        client_secret: settings?.client_secret || "",
      });
    });
  }, []);

  const sync = async () => {
    try {
      reduxDispatch({
        type: "SET_LOADING",
        payload: true,
      });

      let apiToken = selectedUser.access_token;

      if (!apiToken) {
        const data = {
          grant_type: "password",
          client_id,
          client_secret,
          username: userCredential.username,
          password: userCredential.password,
        };

        const formData = new FormData();

        Object["entries"](data).forEach((keyValue) =>
          formData.append(keyValue[0], keyValue[1])
        );

        const response = await axios.post(`${apiUrl}/o/token/`, formData);

        apiToken = response.data.access_token;
      }

      await syncOnlineFinanceCategories(apiUrl, apiToken, credentialsDispatch);
      await syncOnlinePaymentMethods(apiUrl, apiToken, credentialsDispatch);
      await syncOnlineFinanceAccounts(apiUrl, apiToken, credentialsDispatch);
      await syncOnlineAndOfflineEnrollments(
        apiUrl,
        apiToken,
        credentialsDispatch
      );
      await syncOnlineAndOfflineStudentPayments(
        apiUrl,
        apiToken,
        credentialsDispatch
      );
      await syncOnlineAndOfflineTransactions(
        apiUrl,
        apiToken,
        credentialsDispatch
      );
      await syncOnlineAndOfflineParticulars(
        apiUrl,
        apiToken,
        credentialsDispatch
      );
      await syncOnlineAndOfflineMasterFees(
        apiUrl,
        apiToken,
        credentialsDispatch
      );
      await syncOnlineAndOfflinePaymentSchemes(
        apiUrl,
        apiToken,
        credentialsDispatch
      );
      await syncOnlineAndOfflinePaymentPlans(
        apiUrl,
        apiToken,
        credentialsDispatch
      );
      await syncOnlineAndOfflinePaymentPlanItems(
        apiUrl,
        apiToken,
        credentialsDispatch
      );
      await syncOnlineAndOfflinePaymentPeriods(
        apiUrl,
        apiToken,
        credentialsDispatch
      );
      await syncOnlineAndOfflineRemarks(apiUrl, apiToken, credentialsDispatch);
      await syncOnlineAndOfflineReversals(
        apiUrl,
        apiToken,
        credentialsDispatch
      );
      await syncOnlineAndOfflinePaidAdditionalFees(
        apiUrl,
        apiToken,
        credentialsDispatch
      );
      await syncOnlineAndOfflineAdditionalFee(
        apiUrl,
        apiToken,
        credentialsDispatch
      );
      await syncOnlineAndOfflineLibraryLateFees(
        apiUrl,
        apiToken,
        credentialsDispatch
      );
      await syncOnlineAndOfflineIncomeEntries(
        apiUrl,
        apiToken,
        credentialsDispatch
      );
      await syncOnlineAndOfflinePaidParticulars(
        apiUrl,
        apiToken,
        credentialsDispatch
      );
      await syncOnlineAndOfflineRequestReversals(
        apiUrl,
        apiToken,
        credentialsDispatch
      );

      await syncOnlineAndOfflineCashiers(apiUrl, apiToken, credentialsDispatch);

      const date = await syncDate();

      setLastSync(date);

      reduxDispatch({
        type: "SET_LOADING",
        payload: false,
      });

      Swal.fire("Success", "Successfully synced!", "success");
    } catch (err) {
      reduxDispatch({
        type: "SET_LOADING",
        payload: false,
      });
      console.log(err);
      Swal.fire("Error", "Check if settings are correct", "error");
    }
  };

  const date = new Date();

  const hoursDifference = Math.abs(date - new Date(lastSync)) / 36e5;

  return (
    <div className={styles.navigationContainer}>
      <div className={styles.navigationContainerNav}>
        <div className={styles.accountInfoDetails}>
          <span className={styles.accountInfoName}>{fullName}</span>
          <span className={styles.accountInfoTitle}>
            {`${selectedUser.designation}`
              ? `${
                  selectedUser.designation == null
                    ? ""
                    : selectedUser.designation
                }`
              : ""}{" "}
          </span>
        </div>
      </div>
      <div className={styles.navigationContainerInner}>
        <div className={styles.search}></div>
        <div className={styles.accountInfo}>
          <div className={styles.accountInfoDetails}>
            <span className={styles.accountInfoName}>Last Sync:</span>
            <span
              className={styles.accountInfoTitle}
              style={
                hoursDifference >= 24 ? { color: "red" } : { color: "black" }
              }
            >
              {lastSync && (
                <Moment format="MMM DD, YYYY h:mm A">{lastSync}</Moment>
              )}
            </span>
          </div>
        </div>
        <div
          className={styles.icons}
          style={{ cursor: "pointer" }}
          onClick={sync}
        >
          <img src="./img/icon-sync.png" alt="img icon" />
        </div>
        <div className={styles.icons} onClick={logout}>
          <img src="./img/icon-signout.png" alt="img icon" />
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}
