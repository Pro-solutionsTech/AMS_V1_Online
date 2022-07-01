import React from 'react';
import Moment from 'react-moment';
import {formatToCurrency} from '../../repository/base';

export default function StatementOfAccount({school, transactions, enrollment}) {
  let currentBalance = enrollment?.payment_plan_items_list
    .map((item) => {
      return parseFloat(item.amount);
    })
    .reduce((previous, current) => previous + current, 0);

  return (
    <div style={{position: 'absolute', left: '-9999em'}}>
      <pre id='soa'>
        <div>
          <h1 style={{margin: '0', padding: '0'}}>STATMENT OF ACCOUNT</h1>
          <h3 style={{margin: '0', padding: '0'}}>{school}</h3>
          <h3 style={{margin: '0', padding: '0'}}>{`${enrollment?.firstName} ${enrollment?.middleName}, ${enrollment?.lastName}`}</h3>
          <h3 style={{margin: '0', padding: '0'}}>{`${enrollment?.grade} - ${enrollment?.section}`}</h3>
        </div>
        
        <table style={{marginTop: '10px'}}>
          <thead>
            <tr>
              <th>DATE</th>
              <th>FINANCE ACCOUNT</th>
              <th>PAYMENT METHOD</th>
              <th>PREVIOUS BALANCE</th>
              <th>PAID AMOUNT</th>
              <th>CURRENT BALANCE</th>
            </tr>
          </thead>

          <tbody>
            {transactions && transactions.map(transaction => (
              <tr key={transaction.id}>
                <td>
                  <Moment format='YYYY-MM-DD'>{transaction.created_at}</Moment>
                </td>
                <td>{transaction.finance_account}</td>
                <td>{transaction.payment_method}</td>
                <td>{formatToCurrency(currentBalance || 0)}</td>
                <td>{formatToCurrency(transaction.amount)}</td>
                <td>{formatToCurrency(currentBalance -= transaction.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </pre>
    </div>
  )
}