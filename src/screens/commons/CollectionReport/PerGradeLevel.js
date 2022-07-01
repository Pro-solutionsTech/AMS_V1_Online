import React from 'react';
import Moment from 'react-moment';
import styles from './CollectionReportPerGradeComponent.module.css';
import { formatToCurrency } from '../../../repository/base';

export default function PerGradeLevel({ pergradeelem, pergradejunior, pergradesenior, pernonstudent, forPrint = false }) {

    const elemtotal = pergradeelem ? pergradeelem.reduce((a, b) => a + b.total, 0) : null
    const juniortotal = pergradejunior ? pergradejunior.reduce((a, b) => a + b.total, 0) : null
    const seniortotal = pergradesenior ? pergradesenior.reduce((a, b) => a + b.total, 0) : null
    const nonstudenttotal = pernonstudent ? pernonstudent.reduce((a, b) => a + b.total, 0) : null


    return (
        <div>
            <div className={!forPrint ? styles.perGradeLevelDetailsContainer : ''}>
                <table className={!forPrint ? styles.smartTable : ''}>
                    <thead
                        className={!forPrint ? `${styles.smartTableHeader} ${styles.smartTableHeaderWithColor}` : ''}
                    >
                        <tr>

                            <th className={forPrint ? styles.noPadding : ''}>GRADE LEVEL</th>
                            <th className={forPrint ? styles.noPadding : ''}>TOTAL COLLECTION</th>
                            <th className={forPrint ? styles.noPadding : ''}>TOTAL COLLECTION BY DEPARTMENT</th>
                        </tr>
                    </thead>
                    <tbody className={!forPrint ? styles.smartTableBody : ''}>

                        {elemtotal > 0 ? <>
                            <tr key={elemtotal} className={!forPrint ? styles.mainTableData : ''}>
                                <td>Elementary</td>
                                <td></td>
                                <td>{formatToCurrency(elemtotal)}</td>
                            </tr>

                            {pergradeelem.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.particular}</td>
                                        <td>{formatToCurrency(item.total)}</td>
                                        <td></td>
                                    </tr>
                                );
                            })}
                        </> : null}

                        {juniortotal > 0 ? (<>
                            <tr className={!forPrint ? styles.mainTableData : ''}>
                                <td>Junior High School</td>
                                <td></td>
                                <td>{formatToCurrency(juniortotal)}</td>

                            </tr>

                            {pergradejunior.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.particular}</td>
                                        <td>{formatToCurrency(item.total)}</td>
                                        <td></td>
                                    </tr>
                                );
                            })}
                        </>) : null}

                        {seniortotal > 0 ? (<>
                            <tr className={!forPrint ? styles.mainTableData : ''}>
                                <td>Senior High School</td>
                                <td></td>
                                <td>{formatToCurrency(seniortotal)}</td>
                            </tr>

                            {pergradesenior.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.particular}</td>
                                        <td>{formatToCurrency(item.total)}</td>
                                        <td></td>
                                    </tr>
                                );
                            })}
                        </>) : null}

                        {nonstudenttotal > 0 ? (<>
                            <tr className={!forPrint ? styles.mainTableData : ''}>
                                <td>Non Student Collection</td>
                                <td></td>
                                <td>{formatToCurrency(nonstudenttotal)}</td>
                            </tr>

                            {pernonstudent.map((item, index) => {

                                return (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>{formatToCurrency(item.total)}</td>
                                        <td></td>
                                    </tr>
                                );
                            })}
                        </>) : null}

                    </tbody>

                </table>
            </div>
        </div>

    );
}