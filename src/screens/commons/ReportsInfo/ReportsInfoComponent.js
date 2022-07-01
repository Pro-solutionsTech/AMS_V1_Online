import React from 'react';
import { useSelector } from "react-redux"


import styles from './ReportsInfoComponent.module.css';
const ReportsInfoComponent = (props) => {
  const selectedUser = useSelector(state => state.user)

  return (
    <>
      <div className={styles.ReportsInfoComponent}>
        <div className={styles.ReportsInfoComponentRow}>
          <h4>Name of School:</h4>
          <p>{selectedUser.school}</p>
        </div>
      </div>
    </>
  )
}

export default ReportsInfoComponent;
