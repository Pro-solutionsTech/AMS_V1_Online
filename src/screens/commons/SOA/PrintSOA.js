import React from 'react';
import { useSelector } from 'react-redux';
import { formatToCurrency } from "../../../repository/base";

export default function PrintSOA({ accounts }) {
  const user = useSelector(state => state.user);

  return (
    <div style={{position: 'absolute', left: '-9999em'}}>
      <pre id='bulk-soa'>
        <div style={{marginBottom: '30px'}}>
          <p>{user.school}</p>
          <p>Statement of Accounts</p>
          <p>S.Y. {accounts && accounts[0]?.school_year}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>STUDENT NO.</th>
              <th>LAST NAME</th>
              <th>FIRST NAME</th>
              <th>GRADE</th>
              <th>SECTION</th>
              <th>BALANCE</th>
            </tr>
          </thead>
          <tbody>
            {accounts && accounts.length && (
              accounts.map(account => (
                <tr key={account.id}>
                  <td>{account.studentNo}</td>
                  <td>{account.lastName}</td>
                  <td>{account.firstName}</td>
                  <td>{account.grade}</td>
                  <td>{account.section}</td>
                  <td>{formatToCurrency(account.balance)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </pre>
    </div>
  );
}