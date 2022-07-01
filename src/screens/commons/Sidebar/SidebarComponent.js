import { Link, useLocation } from "react-router-dom";
import React from "react";
import { SidebarData } from './Sidebardata';
import styles from './SidebarComponent.module.css';

export default function SidebarComponent(props) {
  const location = useLocation();

  const path = location.pathname.split('/')[1];

  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.sidebarContainerInner}>
        <div className={styles.mainLogo}>
          {/* <img src='./img/lamparaLogo.png' alt='school logo' /> */}
          <img src='./img/icon-school-SJC.png' alt='school logo' />
        </div>
        <div className={styles.title}>School Accounting <br />Management System</div>
        {SidebarData.map((item, index) => {
          return (
            <div key={index} className={path === item.path.split('/')[1] ? `${styles[item.cName]} ${styles.navActive}` : `${styles[item.cName]}`}>
              <Link to={item.path}>
                <div className={styles.navItemActive}></div>
                <span className={styles.navItemIcon}><img src={item.icon} alt='img icon' /></span>
                <span className={styles.navItemText}>{item.title}</span>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
