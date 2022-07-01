import {
  offlineDatabaseError,
  offlineSelectAll,
  onlineGet,
  onlineGetError,
  offlineUpdateOrInsert,
} from "./base";
import { AdditionalFee } from "../entity/AdditionalFee";
import axios from "axios";

const tableName = "additional_fee";

export function getOnlineAdditionalFee(apiUrl, apiToken, dispatch) {
  return onlineGet(
    `${apiUrl}/api/accounting/additional-fee`,
    apiToken,
    dispatch
  );
}

export function getOfflineAdditionalFee() {
  return offlineSelectAll(tableName).then((entities) => {
    if (!entities) {
      return [];
    }

    return entities.map(
      (entity) =>
        new AdditionalFee(
          entity.id,
          entity.enrollment,
          entity.amount,
          entity.student_payment_id,
          entity.payment_particular,
          true
        )
    );
  });
}
export function getOfflineAdditionalFeeNotYetSync() {
  return offlineSelectAll(tableName, ...Array(5), "is_synced", 0).then(
    (entities) => {
      if (!entities) {
        return [];
      }

      return entities.map(
        (entity) =>
          new AdditionalFee(
            entity.id,
            entity.enrollment,
            entity.amount,
            entity.student_payment_id,
            entity.payment_particular,
            true
          )
      );
    }
  );
}

export function saveAdditionalFee(entity) {
  return offlineUpdateOrInsert(tableName, entity);
}

export function saveAdditionalFees(entities) {
  return entities.forEach(async (entity) => {
    await saveAdditionalFee(entity);
  });
}

export async function syncOnlineAndOfflineAdditionalFee(
  apiUrl,
  apiToken,
  dispatch
) {
  try {
    const toUpload = await getOfflineAdditionalFeeNotYetSync();
    await uploadOnlineAdditionalFee(apiUrl, apiToken, dispatch, toUpload);

    let onlineAdditionalFees = await getOnlineAdditionalFee(
      apiUrl,
      apiToken,
      dispatch
    );

    onlineAdditionalFees = onlineAdditionalFees.map((entity) => ({
      id: entity.id,
      enrollment_id: entity.enrollment,
      amount: entity.amount,
      student_payment_id: entity.student_payment_id,
      particular_id: entity.payment_particular,
      is_synced: true,
    }));

    await saveAdditionalFees(onlineAdditionalFees);
  } catch (err) {
    onlineGetError(err);
  }
}

export function uploadOnlineAdditionalFee(
  apiUrl,
  apiToken,
  credentialsDispatch,
  toUpload
) {
  toUpload.map(async (fee) => {
    let amount = fee.amount.toFixed(2);
    try {
      await axios.post(
        `${apiUrl}/api/accounting/additional-fee`,
        {
          id: fee.id,
          enrollment: fee.enrollment_id,
          amount: amount,
          payment_particular: fee.particular_id,
        },
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  });
}
