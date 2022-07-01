import {
  offlineDatabaseError,
  offlineSelectAll,
  offlineUpdateOrInsert,
  onlineGet,
  onlineGetError,
  onlinePost,
  offlineInsertOnly,
  offlineUpdateOrInsertTransactionById,
  offlineSelectOnePaidParticulars,
  offlineSelectOnePaidParticularsReversal
} from "./base";
import { PaidParticular } from "../entity/PaidParticular";
import axios from "axios";

export function getOnlinePaidParticulars(apiUrl, apiToken, dispatch) {
  return onlineGet(
    `${apiUrl}/api/accounting/paid-particulars`,
    apiToken,
    dispatch
  );
}

const tableName = "paid_particulars";

export function getOfflinePaidParticulars(isSelectAll) {
  if (isSelectAll) {
    return offlineSelectAll(tableName).then((entities) => {
      if (!entities) {
        return [];
      }
      return entities.map(
        (entity) =>
          new PaidParticular(
            entity.id,
            entity.student_payment_id,
            entity.student_id,
            entity.particular_id,
            entity.amount,
            entity.is_synced,
            entity.is_reversal,
            entity.transaction_id
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
            new PaidParticular(
              entity.id,
              entity.student_payment_id,
              entity.student_id,
              entity.particular_id,
              entity.amount,
              entity.is_synced,
              entity.is_reversal,
              entity.transaction_id
            )
        );
      }
    );
  }
}

export function getOfflinePaidParticularsNotYetSync() {
  return offlineSelectAll(tableName, ...Array(5), "is_synced", 0).then(
    (entities) => {
      if (!entities) {
        return [];
      }
      return entities.map(
        (entity) =>
          new PaidParticular(
            entity.id,
            entity.student_payment_id,
            entity.student_id,
            entity.particular_id,
            entity.amount,
            entity.is_synced,
            entity.is_reversal,
            entity.transaction_id
          )
      );
    }
  );
}

export function updatePaidPaticularTranc(entity) {
  return offlineUpdateOrInsertTransactionById(tableName, entity);
}

export function savePaidParticular(entity) {
  return offlineUpdateOrInsert(tableName, entity);
}

export function savePaidParticularNoUp(entity) {
  return offlineInsertOnly(tableName, entity);
}

export function savePaidParticularsOnly(entities) {
  return entities.forEach(async (entity) => {
    await savePaidParticularNoUp(entity);
  });
}

export function savePaidParticulars(entities) {
  return entities.forEach(async (entity) => {
    await savePaidParticular(entity);
  });
}

export async function syncOnlineAndOfflinePaidParticulars(
  apiUrl,
  apiToken,
  dispatch
) {
  try {
    let onlineParticulars = await getOnlinePaidParticulars(
      apiUrl,
      apiToken,
      dispatch
    );

    const toUploadUnFiltered = await getOfflinePaidParticularsNotYetSync();

    const toUpload = [];
    const toUpdate = [];

    toUploadUnFiltered.forEach((item) => {
      const exists = onlineParticulars.find(
        (particular) => particular.id === item.id
      );

      if (exists) {
        toUpdate.push(item);
      } else {
        toUpload.push(item);
      }
    });
    await uploadOnlinePaidParticulars(apiUrl, apiToken, dispatch, toUpload);

    onlineParticulars = onlineParticulars.map((entity) => ({
      id: entity.id,
      student_payment_id: entity.student_payment,
      student_id: entity.student,
      particular_id: entity.particular,
      amount: entity.amount,
      is_reversal: entity.is_reversal,
      is_synced: true,
      transaction_id: entity.transaction_id,
    }));

    await savePaidParticulars(onlineParticulars);

    await updateOnlinePaidParticulars(apiUrl, apiToken, dispatch, toUpdate);
  } catch (err) {
    onlineGetError(err);
  }
}

export function uploadOnlinePaidParticulars(
  apiUrl,
  apiToken,
  credentialsDispatch,
  toUpload
) {
  toUpload.map(async (paidParticular) => {
    let amount = paidParticular.amount.toFixed(2);
    try {
      await axios.post(
        `${apiUrl}/api/accounting/paid-particulars`,
        {
          id: paidParticular.id,
          student_payment: paidParticular.student_payment_id,
          particular: paidParticular.particular_id,
          transaction_id: paidParticular.transaction_id,
          amount: amount,
          is_reversal: paidParticular.is_reversal,
        },
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );

      paidParticular.is_synced = 1;
      await savePaidParticular(paidParticular);
    } catch (err) {
      console.log(err);
    }
  });
}

export function updateOnlinePaidParticulars(
  apiUrl,
  apiToken,
  credentialsDispatch,
  toUpload
) {
  toUpload.map(async (paidParticular) => {
    try {
      await axios.put(
        `${apiUrl}/api/accounting/paid-particular/${paidParticular.id}`,
        {
          id: paidParticular.id,
          student_payment: paidParticular.student_payment_id,
          particular: paidParticular.particular_id,
          transaction_id: paidParticular.transaction_id,
          amount: paidParticular.amount,
          is_reversal: paidParticular.is_reversal,
        },
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );

      paidParticular.is_synced = 1;
      paidParticular.is_reversal = 1;
      await savePaidParticular(paidParticular);
    } catch (err) {
      console.log(err);
    }
  });
}
 

export function getOfflineSelectOnePaidParticulars(id) {
  return offlineSelectOnePaidParticulars(id).then((data) => data);
}
export function getofflineSelectOnePaidParticularsReversal(id) {
  return offlineSelectOnePaidParticularsReversal(id).then((data) => data);
}
