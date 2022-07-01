import {
  offlineDatabaseError,
  offlineSelectAll,
  offlineUpdateOrInsert,
  onlineGet,
  onlineGetError,
  allTransactions,
  allPerParticular,
  allPerGradeLevelElementary,
  allPerGradeLevelSeniorHigh,
  allPerGradeLevelJunior,
  allTransactionCollections,
  countOfflineTransactions,
  getOfflineTransactionsList,
  getOfflineLatest,
  listPerParticular,
  offlineSelectOne,
  getOfflineTransactionsListSearch,
  listNonStudent,
  offlineSelectOnePaidParticularsTransac,
  OfflineCheckExisting
} from "./base";

import { Transaction } from "../entity/Transaction";
import axios from "axios";

export function getOnlineTransactions(apiUrl, apiToken, dispatch) {
  return onlineGet(`${apiUrl}/api/accounting/transactions`, apiToken, dispatch);
}

const tableName = "transactions";

export function getOfflineTransactions(
  pageNumber,
  pageLimit,
  totalTransactions
) {
  return offlineSelectAll(
    tableName,
    pageNumber,
    pageLimit,
    totalTransactions
  ).then((entities) => {
    if (!entities) {
      return [];
    }
    return entities.map(
      (entity) =>
        new Transaction(
          entity.id,
          entity.student_payment_id,
          entity.to_acct_id,
          entity.amount,
          entity.is_synced,
          entity.created_at,
          entity.or_no,
          entity.ecr_no,
          entity.is_reversal,
          entity.cash_received
        )
    );
  });
}
export function getOfflineTransactionOne(id) {
  return offlineSelectOne(tableName, id).then((transaction) => transaction);
}

export function getOfflineTransactionsNotYet() {
  return offlineSelectAll(tableName, ...Array(5), "is_synced", 0).then(
    (entities) => {
      if (!entities) {
        return [];
      }
      return entities.map(
        (entity) =>
          new Transaction(
            entity.id,
            entity.student_payment_id,
            entity.to_acct_id,
            entity.amount,
            entity.is_synced,
            entity.created_at,
            entity.or_no,
            entity.ecr_no,
            entity.is_reversal,
            entity.cash_received
          )
      );
    }
  );
}

export function saveTransaction(entity) {
  return offlineUpdateOrInsert(tableName, entity);
}

export function saveTransactions(entities) {
  return entities.forEach(async (entity) => {
    await saveTransaction(entity);
  });
}

export async function syncOnlineAndOfflineTransactions(
  apiUrl,
  apiToken,
  dispatch
) {
  try {
    const toUpload = await getOfflineTransactionsNotYet();

    await uploadOnlineTransactions(apiUrl, apiToken, dispatch, toUpload);

    let onlineTransactions = await getOnlineTransactions(
      apiUrl,
      apiToken,
      dispatch
    );

    onlineTransactions = onlineTransactions.map((entity) => ({
      id: entity.id,
      student_payment_id: entity.student_payment,
      to_acct_id: entity.to_acct,
      amount: entity.amount,
      is_reversal: entity.is_reversal,
      is_synced: true,
      created_at: new Date(entity.transaction_date).toISOString(),
      or_no: entity.or_no,
      ecr_no: entity.ecr_no,
      cash_received: entity.cash_received,
    }));

    await saveTransactions(onlineTransactions);
  } catch (err) {
    onlineGetError(err);
  }
}

export function uploadOnlineTransactions(
  apiUrl,
  apiToken,
  credentialsDispatch,
  toUpload
) {
  toUpload.map(async (transaction) => {
    let amount = transaction.amount.toFixed(2);
    let cash_received = transaction.cash_received.toFixed(2);

    try {
      await axios.post(
        `${apiUrl}/api/accounting/transactions`,
        {
          id: transaction.id,
          student_payment: transaction.student_payment_id,
          to_acct: transaction.to_acct_id,
          amount: amount,
          transaction_date: transaction.created_at,
          or_no: transaction.or_no,
          ecr_no: transaction.ecr_no,
          is_reversal: transaction.is_reversal,
          cash_received: cash_received,
        },
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );

      transaction.is_synced = 1;
      await saveTransaction(transaction);
    } catch (err) {
      console.log(err);
    }
  });
}

export function getAllTransactions(formData) {
  return allTransactions(formData).then((data) => data);
}

export function getAllTransactionsCollection(formData) {
  return allTransactionCollections(formData).then((data) => data);
}

export function getPerParticular(formData) {
  return allPerParticular(formData).then((data) => data);
}

export function getPerGradeLevelElementary(formData) {
  return allPerGradeLevelElementary(formData).then((data) => data);
}

export function getGradeLevelJunior(formData) {
  return allPerGradeLevelJunior(formData).then((data) => data);
}

export function getPerGradeLevelSeniorHigh(formData) {
  return allPerGradeLevelSeniorHigh(formData).then((data) => data);
}

export function getListPerParticular(formData, filter) {
  return listPerParticular(formData, filter).then((data) => data);
}

export function countTransactions(searchQuery) {
  return countOfflineTransactions(searchQuery).then((total) => total);
}

export function getListNonStudent(formData) {
  return listNonStudent(formData).then((data) => data);
}

export function getTransactions(pageNumber, pageLimit, searchQuery, initial) {
  return getOfflineTransactionsList(
    pageNumber,
    pageLimit,
    searchQuery,
    initial
  ).then((result) => result);
}
export function getTransactionsSearch(
  pageNumber,
  pageLimit,
  searchQuery,
  initial
) {
  return getOfflineTransactionsListSearch(
    pageNumber,
    pageLimit,
    searchQuery,
    initial
  ).then((result) => result);
}

export function getLatestECR(initial) {
  const orderBy = "ecr_no DESC";
  return getOfflineLatest(tableName, "ecr_no", orderBy, initial).then(
    (result) => result
  );
}

export function getOfflineSelectOnePaidParticularsTransac(id) {
  return offlineSelectOnePaidParticularsTransac(id).then((data) => data);
}

export function validateOR(or_no) {
  return OfflineCheckExisting("transactions", "or_no", or_no)
}