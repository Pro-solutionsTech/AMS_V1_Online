import React from 'react';
// import { Link } from "react-router-dom"

import styles from './SettingChangePass.module.css';
const SettingChangePass = (props) => {
  return (
    <>
      <div className={styles.changepasscontainer}>
        <div className={styles.changepasstitle}>Change Password</div>
        <div className={styles.changepassdesc}>Use a strong password. Your new password must be different from your previous password. Length must be greater than 8 characters.</div>
        <div className={`${styles.passfield} ${styles.smartTableHeaderWithColor}`}>
          <label>Current Password</label>
          <input type='password'></input>
        </div>
        <div className={`${styles.passfield} ${styles.smartTableHeaderWithColor}`}>
          <label>New Password</label>
          <input type='password'></input>
        </div>
        <div className={`${styles.passfield} ${styles.smartTableHeaderWithColor}`}>
          <label>Confirm Password</label>
          <input type='password'></input>
        </div>
        <div>
          <a href="#" className={styles.forgetpass}>Forgot your password?</a>
        </div>
        <div className={styles.changePassbutton}>
          <buttom className={styles.changePassCancel}>Cancel</buttom>
          <buttom className={styles.changePassSave}>Save Changes</buttom>
        </div>
      </div>
    </>
  )
}

export default SettingChangePass;