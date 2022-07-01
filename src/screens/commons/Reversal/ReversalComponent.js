import React from "react";
import "react-toastify/dist/ReactToastify.css";
import styles from "./ReversalComponent.module.css";
import { ToastContainer } from "react-toastify";

const ReversalComponent = ({
  handleLoginSubmit,
  onPopupClick,
  reason,
  isOnline,
  setReason,
}) => {
  return (
    <div>
      <div className={styles.reversalContainer}>
        <div className={styles.reversalHeader}>
          <div className={styles.reversalTitle}>Reversal Confirmation</div>
          <button className={styles.reversalHeaderBtn} onClick={onPopupClick}>
            X
          </button>
        </div>
        <div className={styles.reversalbody}>
          <div className={styles.reversalSubtitle}>Reason for Reversal</div>
          <textarea
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            name="paragraph_text"
            rows="10"
            className={styles.inputReversal}
          ></textarea>
          <div className={styles.reversalNote}>
            This will serve as "Reversal Request", all request will be send and
            approve by your Supervisor. Please coordinate for updates.
          </div>
          <div className={styles.reversalLoginContainer}>
            <div className={styles.reversalLoginBtn}>
              <button className={styles.reversalCancel} onClick={onPopupClick}>
                CANCEL
              </button>
              <button
                className={styles.reversalSubmit}
                onClick={() => handleLoginSubmit(reason, isOnline)}
              >
                SUBMIT
              </button>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ReversalComponent;
