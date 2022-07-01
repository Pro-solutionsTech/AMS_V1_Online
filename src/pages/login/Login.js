import React, { useState } from 'react';
import styles from './Login.module.css';
import { Link, useHistory } from "react-router-dom";
import { login } from "../../repository/LoginRepository";
import { useDispatch } from 'react-redux';
import { getSettings } from '../../repository/SettingsRepository';

const Login = ({ credentialsState, credentialsDispatch }) => {
  const reduxDispatch = useDispatch()

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  async function handleLogin() {
    const settings = await getSettings();

    const state = {
      apiUrl: settings?.api_url || '',
      client_id: settings?.client_id || '',
      client_secret: settings?.client_secret || ''
    };

    login(state, credentialsDispatch, username, password, history, reduxDispatch)
    reduxDispatch({
      type: 'SET_CREDENTIAL',
      payload: { username, password, state }
    });
  }

  return (
    <div>
      <div className={styles.loginComponent} style={{ background: "url(img/bgAmsnew.png) center center / cover no-repeat fixed", height: "100vh" }}>
        <div className={styles.loginComponentLeftContainer}>
          <div className={styles.settings}>
            <Link to="/settings">Settings</Link>
          </div>
          <div className={styles.containerWrapper}>
            <div className={styles.logo}>
              <img src='./img/iconlampara.png' alt='logo' />
            </div>
            <div className={styles.heading}>School Accounting <br />Management System </div>
            <div className={styles.subheading}>Log into your Account</div>
            <div className={`${styles.fieldContainer} ${styles.usernameField}`}>
              <label htmlFor='username'>Username</label> <br />
              <input
                className={styles.intfield}
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div className={`${styles.fieldContainer} ${styles.passwordField}`}>
              <label htmlFor='password'>Password</label> <br />
              <input
                className={styles.intfield}
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className={styles.loginBtn}>
              <button type="button" value="Login" onClick={handleLogin}>Login</button>
            </div>
            <div className={styles.forgotPasswordField}><a href="#" className={styles.btnForgot}>Forgot Password?</a></div>
            <div className={styles.sublinks}>
              <a href="#" className={styles.sublinksCta}>Privacy Policy </a>
              <span>&#9679;</span>
              <a href="#" className={`${styles.sublinksCta} ${styles.termsLink}`}> Terms &amp; Conditions</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



export default Login;
