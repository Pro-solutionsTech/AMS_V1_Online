import styles from "./Settings.module.css";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link, useHistory, useLocation } from "react-router-dom";
import { syncOnlineAndOfflineMasterFees } from "../repository/MasterFeeRepository";
import { syncOnlineAndOfflineEnrollments } from "../repository/EnrollmentRepository";
import { syncOnlineAndOfflinePaymentSchemes } from "../repository/PaymentSchemeRepository";
import { syncOnlineAndOfflineParticulars } from "../repository/ParticularRepository";
import { syncOnlineAndOfflinePaidParticulars } from "../repository/PaidParticularRepository";
import { syncOnlineAndOfflinePaymentPlans } from "../repository/PaymentPlanRepository";
import { syncOnlineAndOfflinePaymentPlanItems } from "../repository/PaymentPlanItemRepository";
import { syncOnlineAndOfflineTransactions } from "../repository/TransactionRepository";
import { syncOnlineAndOfflinePaymentPeriods } from "../repository/PaymentPeriodRepository";
import { syncOnlineAndOfflineRemarks } from "../repository/RemarksRepository";
import { syncDate } from "../repository/SyncRepository";
import { getSettings, saveSettings } from "../repository/SettingsRepository";
import { useSelector } from "react-redux";
import { createUUID } from "../repository/base";
import axios from "axios";

export default function Settings({ credentialsState, credentialsDispatch }) {
  const history = useHistory();
  const location = useLocation();

  const path = location.pathname;

  const [state, setState] = useState({
    id: "",
    apiUrl: "",
    apiToken: credentialsState.authorization,
    client_id: "",
    client_secret: "",
  });

  const { id, apiUrl, apiToken, client_id, client_secret } = state;

  const user = useSelector((state) => state.user);
  const userCredential = useSelector((state) => state.userCredential);

  useEffect(() => {
    getSettings().then((settings) => {
      setState({
        ...state,
        id: settings?.id || "",
        apiUrl: settings?.api_url || "",
        client_id: settings?.client_id || "",
        client_secret: settings?.client_secret || "",
      });
    });
  }, []);

  function save() {
    const id = state.id || createUUID();

    const settings_object = {
      id,
      api_url: apiUrl,
      client_id: client_id,
      client_secret: client_secret,
    };

    setState({ ...state, id });

    saveSettings(settings_object);

    Swal.fire("Success", "Saved successfulyl!", "success");
  }

  async function sync() {
    try {
      if (!user.access_token) {
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

        setState({ ...state, apiToken: response.data.access_token });
      }

      syncOnlineAndOfflinePaidParticulars(
        apiUrl,
        apiToken,
        credentialsDispatch
      ).then(() => {
        syncOnlineAndOfflineParticulars(
          apiUrl,
          apiToken,
          credentialsDispatch
        ).then(() => {
          syncOnlineAndOfflineMasterFees(
            apiUrl,
            apiToken,
            credentialsDispatch
          ).then(() => {
            syncOnlineAndOfflineEnrollments(
              apiUrl,
              apiToken,
              credentialsDispatch
            ).then(() => {
              syncOnlineAndOfflinePaymentSchemes(
                apiUrl,
                apiToken,
                credentialsDispatch
              ).then(() => {
                syncOnlineAndOfflinePaymentPlans(
                  apiUrl,
                  apiToken,
                  credentialsDispatch
                ).then(() => {
                  syncOnlineAndOfflinePaymentPlanItems(
                    apiUrl,
                    apiToken,
                    credentialsDispatch
                  ).then(() => {
                    syncOnlineAndOfflineTransactions(
                      apiUrl,
                      apiToken,
                      credentialsDispatch
                    ).then(() => {
                      syncOnlineAndOfflinePaymentPeriods(
                        apiUrl,
                        apiToken,
                        credentialsDispatch
                      ).then(() => {
                        syncDate().then(() => {
                          syncOnlineAndOfflineRemarks(
                            apiUrl,
                            apiToken,
                            credentialsDispatch
                          ).then(() =>
                            Swal.fire(
                              "Success",
                              "Successfully synced!",
                              "success"
                            )
                          );
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    } catch (err) {
      console.log(err);
      Swal.fire("Error", "Check if settings are correct", "error");
    }
  }

  return (
    <div className={styles.Settings}>
      <div className={styles.back}>
        <Link to="#" onClick={() => history.goBack()}>
          Back
        </Link>
      </div>
      <section className={styles.SettingsBody}>
        <header className={styles.SettingsHeader}>Lampara AMS Settings</header>
        <label className={styles.SettingsField}>
          <span>API URL:</span>
          <input
            className={styles.SettingsInputText}
            type="text"
            value={apiUrl}
            onChange={(e) => setState({ ...state, apiUrl: e.target.value })}
            disabled={path !== "/settings"}
          />
        </label>
        <label className={styles.SettingsField}>
          <span>Client ID:</span>
          <input
            className={styles.SettingsInputText}
            type="text"
            value={client_id}
            onChange={(e) => setState({ ...state, client_id: e.target.value })}
            disabled={path !== "/settings"}
          />
        </label>
        <label className={styles.SettingsField}>
          <span> Client Secret:</span>
          <input
            className={styles.SettingsInputText}
            type="text"
            value={client_secret}
            onChange={(e) =>
              setState({ ...state, client_secret: e.target.value })
            }
            disabled={path !== "/settings"}
          />
        </label>

        {path === "/maintenance" && (
          <button type="button" value="Sync" onClick={sync}>
            Sync
          </button>
        )}

        {path === "/settings" && (
          <button type="button" onClick={save}>
            Save
          </button>
        )}

        <div>
          {/* <header className={styles.SettingsHeader2}>
            Please upload database file from School Management System "Import Database"
            Export database = "Local" Export ng App Data (SQL)
          </header>
          <div className={styles.inAndExportContainer}>
            <button type="button" onClick={save}>
              Import Database
            </button>
            <button type="button" className={styles.exportCol} onClick={save}>
              Export Database
            </button>
          </div> */}

        </div>

      </section>


    </div>
  );
}
