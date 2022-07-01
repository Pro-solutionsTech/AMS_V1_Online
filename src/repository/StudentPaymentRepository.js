import {
  offlineUpdateOrInsert,
  offlineSelectAll,
  onlineGet,
  onlineGetError,
  offlineDatabaseError,
  offlineSelectOneTransactionParticular,
  offlineSelectOneTransactionDetail,
  offlineGetCashierInfo
} from "./base";
import { StudentPayment } from "../entity/StudentPayment";
import { PaymentMethod } from "../entity/PaymentMethod";
import { FinanceAccount } from "../entity/FinanceAccount";

import axios from "axios";

const tableName = "student_payments";

export function saveStudentPayment(entity) {
  return offlineUpdateOrInsert(tableName, entity);
}

export function saveStudentPayments(entities) {
  return entities.map(async (entity) => await saveStudentPayment(entity));
}

export function getOnlineStudentPayments(apiUrl, apiToken, dispatch) {
  return onlineGet(
    `${apiUrl}/api/accounting/student-payments`,
    apiToken,
    dispatch
  );
}

export function getOfflineStudentPayments() {
  return offlineSelectAll(tableName).then((entities) => {
    if (!entities) {
      return [];
    }

    return entities.map(
      (entity) =>
        new StudentPayment(
          entity.id,
          entity.enrollment_id,
          entity.payment_method_id,
          entity.finance_account_id,
          entity.is_synced
        )
    );
  });
}

export function getOfflineStudentPaymentsNotYetSync() {
  return offlineSelectAll(tableName, ...Array(5), "is_synced", 0).then(
    (entities) => {
      if (!entities) {
        return [];
      }

      return entities.map(
        (entity) =>
          new StudentPayment(
            entity.id,
            entity.enrollment_id,
            entity.payment_method_id,
            entity.finance_account_id,
            entity.is_synced
          )
      );
    }
  );
}

export function getOfflineFinanceAccount() {
  return offlineSelectAll("finance_accounts").then((entities) => {
    if (!entities) {
      return [];
    }
    return entities.map(
      (entity) => new FinanceAccount(entity.id, entity.name, entity.description)
    );
  });
}

export function getOfflinePaymentMethod() {
  return offlineSelectAll("payment_methods").then((entities) => {
    if (!entities) {
      return [];
    }
    return entities.map(
      (entity) => new PaymentMethod(entity.id, entity.title, entity.description)
    );
  });
}

export async function syncOnlineAndOfflineStudentPayments(
  apiUrl,
  apiToken,
  dispatch
) {
  try {
    const toUpload = await getOfflineStudentPaymentsNotYetSync();
    await uploadOnlineStudentPayments(apiUrl, apiToken, dispatch, toUpload);

    let onlineStudentPayments = await getOnlineStudentPayments(
      apiUrl,
      apiToken,
      dispatch
    );

    onlineStudentPayments = onlineStudentPayments.map((entity) => ({
      id: entity.id,
      enrollment_id: entity.enrollment,
      payment_method_id: entity.payment_method,
      finance_account_id: entity.finance_account,
      is_synced: true,
    }));

    await saveStudentPayments(onlineStudentPayments);
  } catch (err) {
    onlineGetError(err);
  }
}

export function uploadOnlineStudentPayments(
  apiUrl,
  apiToken,
  credentialsDispatch,
  toUpload
) {
  toUpload.map(async (studentPayment) => {
    try {
      await axios.post(
        `${apiUrl}/api/accounting/student-payments`,
        {
          id: studentPayment.id,
          enrollment: studentPayment.enrollment_id,
          payment_method: studentPayment.payment_method_id,
          finance_account: studentPayment.finance_account_id,
        },
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );

      studentPayment.is_synced = 1;
      await saveStudentPayment(studentPayment);
    } catch (err) {
      console.log(err);
    }
  });
}

export function getOfflineTransactionPaidParticular(id) {
  return offlineSelectOneTransactionParticular(id).then((data) => data);
}

export function getOfflineSelectOneTransactionDetail(id) {
  return offlineSelectOneTransactionDetail(id).then((data) => data);
}
export function getofflineGetCashierInfo(initials) {
  return offlineGetCashierInfo(initials).then((data) => data);
}
