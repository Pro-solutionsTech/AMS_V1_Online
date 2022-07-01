import {
  offlineDatabaseError,
  offlineSelectAll,
  offlineUpdateOrInsert,
  onlineGet,
  onlineGetError,
  onlinePost,
  offlineUpdateOrInsertTransactionById,
} from "./base";
import Swal from "sweetalert2";

import { PaidAdditionalFee } from "../entity/PaidAdditionalFee";
import axios from "axios";

export function getOnlinePaidAdditionalFees(apiUrl, apiToken, dispatch) {
  return onlineGet(
    `${apiUrl}/api/accounting/paid-additional-fee`,
    apiToken,
    dispatch
  );
}

const tableName = "paid_additional_fee";

export function getOfflinePaidAdditionalFees(isSelectAll) {
  if (isSelectAll) {
    return offlineSelectAll(tableName).then((entities) => {
      if (!entities) {
        return [];
      }
      return entities.map(
        (entity) =>
          new PaidAdditionalFee(
            entity.id,
            entity.student_payment_id,
            entity.additional_fee_id,
            entity.amount,
            entity.transaction_id,
            entity.is_reversal,
            entity.is_synced
          )
      );
    });
  } else {
    return offlineSelectAll(tableName, ...Array(5), "is_reversal", 0).then(
      (entities) => {
        if (!entities) {
          return [];
        }
        return entities.map(
          (entity) =>
            new PaidAdditionalFee(
              entity.id,
              entity.student_payment_id,
              entity.additional_fee_id,
              entity.amount,
              entity.transaction_id,
              entity.is_reversal,
              entity.is_synced
            )
        );
      }
    );
  }
}

export function getOfflinePaidAdditionalFeesNotYetSync() {
  return offlineSelectAll(tableName, ...Array(5), "is_synced", 0).then(
    (entities) => {
      if (!entities) {
        return [];
      }
      return entities.map(
        (entity) =>
          new PaidAdditionalFee(
            entity.id,
            entity.student_payment_id,
            entity.additional_fee_id,
            entity.amount,
            entity.transaction_id,
            entity.is_reversal,
            entity.is_synced
          )
      );
    }
  );
}

export function updatePaidAdditionalTranc(entity) {
  return offlineUpdateOrInsertTransactionById(tableName, entity);
}

export function savePaidAdditionalFee(entity) {
  return offlineUpdateOrInsert(tableName, entity);
}

export function savePaidAdditionalFees(entities) {
  return entities.forEach(async (entity) => {
    await savePaidAdditionalFee(entity);
  });
}

export async function syncOnlineAndOfflinePaidAdditionalFees(
  apiUrl,
  apiToken,
  dispatch
) {
  try {
    const toUpload = await getOfflinePaidAdditionalFeesNotYetSync();

    await uploadOnlinePaidAdditionalFees(apiUrl, apiToken, dispatch, toUpload);

    let onlinePaidAdditionalFees = await getOnlinePaidAdditionalFees(
      apiUrl,
      apiToken,
      dispatch
    );

    onlinePaidAdditionalFees = onlinePaidAdditionalFees.map((entity) => ({
      id: entity.id,
      student_payment_id: entity.student_payment,
      additional_fee_id: entity.additional_fee,
      amount: entity.amount,
      is_synced: true,
      transaction_id: entity.transaction,
      is_reversal: entity.is_reversal,
    }));

    await savePaidAdditionalFees(onlinePaidAdditionalFees);
  } catch (err) {
    onlineGetError(err);
  }
}

export function uploadOnlinePaidAdditionalFees(
  apiUrl,
  apiToken,
  credentialsDispatch,
  toUpload
) {
  toUpload.map(async (paid_add) => {
    try {
      await axios.post(
        `${apiUrl}/api/accounting/paid-additional-fee`,
        {
          student_payment: paid_add.student_payment_id,
          additional_fee: paid_add.additional_fee_id,
          amount: paid_add.amount,
          is_reversal: paid_add.is_reversal,
          transaction: paid_add.transaction_id,
          id: paid_add.id,
        },
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );

      paid_add.is_synced = 1;
      await savePaidAdditionalFee(paid_add);
    } catch (err) {
      console.log(err);
    }
  });
}

function getDatabase() {
  const { remote } = window.require("electron");
  return remote.getGlobal("database");
}

export function getOfflineallAddtionalFeeByEnrollId(id) {
  let queryBuilder = getDatabase()
    .connection("additional_fee")
    .select("particulars.name",
     "additional_fee.amount", "additional_fee.id",
     "paid_additional_fee.is_reversal as additional_is_reversal")
    .leftJoin(
      "paid_additional_fee",
      "additional_fee.id",
      "paid_additional_fee.additional_fee_id"
    )
    .join("particulars", "particulars.id", "additional_fee.particular_id")
    .where("additional_fee.enrollment_id", `${id}`)
    // .where("paid_additional_fee.is_reversal", false)
    .sum("paid_additional_fee.amount as paid_amount")
    .groupBy("additional_fee.id");

  return queryBuilder.catch(offlineDatabaseError).then((result) => result);
}

export function getOfflineAdditionalFeePerTransaction(
  enrollmentId,
  studentPaymentId
) {
  let queryBuilder = getDatabase()
    .connection("additional_fee")
    .select(
      "particulars.name",
      "paid_additional_fee.amount",
      "paid_additional_fee.id as id"
    )
    .leftJoin(
      "paid_additional_fee",
      "additional_fee.id",
      "paid_additional_fee.additional_fee_id"
    )
    .join("particulars", "particulars.id", "additional_fee.particular_id")
    .where("additional_fee.enrollment_id", enrollmentId)
    .orWhere("paid_additional_fee.student_payment_id", studentPaymentId);

  return queryBuilder.catch(offlineDatabaseError).then((result) => result);
}
