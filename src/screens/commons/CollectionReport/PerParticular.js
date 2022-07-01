import React, { useEffect } from 'react';
import Moment from 'react-moment';
import styles from './CollectionReportPerPartiComponent.module.css';
import { formatToCurrency } from '../../../repository/base';
import { useState } from 'react';

export default function PerParticular({ perpaticulars, forPrint = false }) {


    return (
        <div>
            <div className={!forPrint ? styles.particularDetailsContainer : ''}>
                <table className={!forPrint ? styles.smartTable : ''}>
                    <thead className={!forPrint ? `${styles.smartTableHeader} ${styles.smartTableHeaderWithColor}` : ''}>
                        <tr>
                            <th className={forPrint ? styles.noPadding : ''}>PARTICULAR</th>
                            <th className={forPrint ? styles.noPadding : ''}>TOTAL COLLECTION</th>
                        </tr>
                    </thead>
                    <tbody className={!forPrint ? styles.smartTableBody : ''}>
                        {perpaticulars.map((perpaticular) => {

                            return (
                                <tr key={perpaticular.id}>
                                    <td>{perpaticular.name}</td>
                                    <td>{formatToCurrency(perpaticular.total)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>

    );
}