import {
  offlineDatabaseError,
  offlineSelectAll,
  offlineUpdateOrInsert,
  onlineGet,
  onlineGetError,
  offlineSelectHave,
} from "./base";
import { Reversal } from "../entity/Reversal";
import axios from "axios";
import { offlineSelectTransaction } from "../repository/base";

const tableName = "reversal";

export function saveReversal(entity) {
  return offlineUpdateOrInsert(tableName, entity);
}

export function saveReversals(entities) {
  return entities.forEach(async (entity) => {
    await saveReversal(entity);
  });
}

export function getOfflineReversalCheck(id) {
  return offlineSelectTransaction("reversal", id).then((reversal) => reversal);
}

export function getOnlineReversal(apiUrl, apiToken, dispatch) {
  return onlineGet(`${apiUrl}/api/accounting/reversals`, apiToken, dispatch);
}

export function getOfflineReversals() {
  return offlineSelectAll(tableName).then((entities) => {
    if (!entities) {
      return [];
    }
    return entities.map(
      (entity) =>
        new Reversal(
          entity.id,
          entity.staff_id,
          entity.transaction_id,
          entity.reason,
          entity.created_at,
          entity.is_synced,
          entity.initial
        )
    );
  });
}

export function getOfflineReversalsNotYetSync() {
  return offlineSelectAll(tableName, ...Array(5), "is_synced", 0).then(
    (entities) => {
      if (!entities) {
        return [];
      }
      return entities.map(
        (entity) =>
          new Reversal(
            entity.id,
            entity.staff_id,
            entity.transaction_id,
            entity.reason,
            entity.created_at,
            entity.is_synced,
            entity.initial
          )
      );
    }
  );
}

export async function syncOnlineAndOfflineReversals(
  apiUrl,
  apiToken,
  dispatch
) {
  try {
    const toUpload = await getOfflineReversalsNotYetSync();

    await uploadOnlineReversal(apiUrl, apiToken, dispatch, toUpload);

    let onlineReversals = await getOnlineReversal(apiUrl, apiToken, dispatch);

    onlineReversals = onlineReversals.map((entity) => ({
      reason: entity.reason,
      created_at: new Date(entity.created_at).toISOString(),
      transaction_id: entity.transaction_id,
      staff_id: entity.staff_id,
      initial: entity.initial,
      is_synced: true,
      id: entity.id,
    }));

    await saveReversals(onlineReversals);
  } catch (err) {
    onlineGetError(err);
  }
}

export function uploadOnlineReversal(
  apiUrl,
  apiToken,
  credentialsDispatch,
  toUpload
) {
  toUpload.map(async (reversal) => {
    try {
      await axios.post(
        `${apiUrl}/api/accounting/reversals`,
        {
          id: reversal.id,
          staff_id: reversal.staff_id,
          reason: reversal.reason,
          transaction_id: reversal.transaction_id,
          created_at: reversal.created_at,
          initial: reversal.initial,
          is_reversal: true,
        },
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );

      reversal.is_synced = 1;
      await saveReversal(reversal);
    } catch (err) {
      console.log(err);
    }
  });
}

export async function uploadOnlineRequestReversal(apiUrl, apiToken, toUpload) {
  try {
    await axios.post(
      `${apiUrl}/api/accounting/reversal-requests`,
      {
        transaction: toUpload.transaction,
        reason: toUpload.reason,
        request_by: toUpload.request_by,
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
}
