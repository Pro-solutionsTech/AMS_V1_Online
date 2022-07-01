import React from 'react';
import styles from './Pagination.module.css';

export default function Pagination({ studentsPerPage, totalEnrolled, changePage, activePage, pageIndex, setPageIndex }) {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalEnrolled / studentsPerPage); i++) {
        pageNumbers.push(i);
    }

    const { startIndex, endIndex } = pageIndex;

    const addPageIndex = () => {
        if (endIndex >= pageNumbers.length) {
            return;
        }

        setPageIndex({
            startIndex: startIndex + 5,
            endIndex: endIndex + 5
        });

        changePage(startIndex + 6);
    }

    const subtractPageIndex = () => {
        if (startIndex === 0) {
            return;
        }

        setPageIndex({
            startIndex: startIndex - 5,
            endIndex: endIndex - 5
        });

        changePage(startIndex);
    }

    const jumpToFirstPage = () => {
        setPageIndex({
            startIndex: 0,
            endIndex: 5
        });

        changePage(1);
    }

    const jumpToLastPage = () => {
        let startIndex = pageNumbers.length - (pageNumbers.length % 5);

        startIndex = startIndex === pageNumbers[pageNumbers.length - 1] ? startIndex - 5 : startIndex;

        setPageIndex({
            startIndex,
            endIndex: startIndex + 5
        });

        changePage(pageNumbers[pageNumbers.length - 1]);
    }

    const next = () => {
        if (activePage === pageNumbers.length) {
            return;
        }

        if(activePage % 5 === 0) {
            setPageIndex({
                startIndex: startIndex + 5,
                endIndex: endIndex + 5
            });
        }

        changePage(activePage + 1);
    }

    const previous = () => {
        if(activePage === 1) {
            return;
        }

        if(activePage % 5 === 1) {
            setPageIndex({
                startIndex: startIndex - 5,
                endIndex: endIndex - 5
            });
        }

        changePage(activePage - 1);
    }

    return (
        <ul className={styles.pagination}>
            <button onClick={subtractPageIndex}>
                <img src='./img/left-arrow.png' />
            </button>

            <button onClick={previous}>Previous</button>

            {startIndex > 0 && (
                <>
                    <li className={styles.pageItem}>
                        <button onClick={jumpToFirstPage} className={styles.pageLink}>
                            1
                        </button>
                    </li>
                    <li className={styles.pageItem}>
                        <span>...</span>
                    </li>
                </>
            )}

            {pageNumbers.slice(startIndex, endIndex).map(number => (
                <li key={number} className={number === activePage ? `${styles.pageItem} ${styles.active}` : `${styles.pageItem}`}>
                    <button onClick={() => changePage(number)} className={styles.pageLink}>
                        {number}
                    </button>
                </li>
            ))}

            {endIndex < pageNumbers.length - 1 && (
                <>
                <li className={styles.pageItem}>
                    <span>...</span>
                </li>
                <li className={styles.pageItem}>
                    <button onClick={jumpToLastPage} className={styles.pageLink}>
                        {pageNumbers[pageNumbers.length - 1]}
                    </button>
                </li>
                </>
            )}

            <button onClick={next}>Next</button>

            <button onClick={addPageIndex}>
                <img src='./img/right-arrow.png' />
            </button>
        </ul>
    );
}