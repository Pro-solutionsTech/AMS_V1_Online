import {
  offlineDatabaseError,
  offlineSelectAll,
  offlineUpdateOrInsert,
  onlineGet,
  onlineGetError,
  offlineSelectHave,
  offlineSelectOne,
} from "./base";
import { RequestReversal } from "../entity/RequestReversal";
import axios from "axios";
import { offlineSelectTransaction } from "../repository/base";

const tableName = "request_reversal";

export function saveRequestReversal(entity) {
  return offlineUpdateOrInsert(tableName, entity);
}

export function saveRequestReversals(entities) {
  return entities.forEach(async (entity) => {
    await saveRequestReversal(entity);
  });
}
export function getOnlineRequestReversal(apiUrl, apiToken, dispatch) {
  return onlineGet(
    `${apiUrl}/api/accounting/reversal-requests`,
    apiToken,
    dispatch
  );
}

export function selectOneRequest(id) {
  return offlineSelectOne(tableName, id, "transaction");
}
export async function uploadOnlineRequestReversal(apiUrl, apiToken, toUpload) {
  try {
    await axios.post(
      `${apiUrl}/api/accounting/reversal-requests`,
      {
        id: toUpload.id,
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
    toUpload.is_synced = 1;
    await saveRequestReversal(toUpload);
  } catch (err) {
    console.log(err);
  }
}

export function getOfflineRequestReversalsNotYetSync() {
  return offlineSelectAll(tableName, ...Array(5), "is_synced", 0).then(
    (entities) => {
      if (!entities) {
        return [];
      }
      return entities.map(
        (entity) =>
          new RequestReversal(
            entity.id,
            entity.reason,
            entity.transaction,
            entity.request_by,
            entity.is_synced
          )
      );
    }
  );
}

export async function syncOnlineAndOfflineRequestReversals(
  apiUrl,
  apiToken,
  dispatch
) {
  try {
    const toUpload = await getOfflineRequestReversalsNotYetSync();

    await uploadOnlineRequestRev(apiUrl, apiToken, dispatch, toUpload);

    let onlineRequestReversals = await getOnlineRequestReversal(
      apiUrl,
      apiToken,
      dispatch
    );

    onlineRequestReversals = onlineRequestReversals.map((entity) => ({
      request_by: entity.request_by,
      transaction: entity.transaction,
      reason: entity.reason,
      is_synced: true,
      id: entity.id,
    }));

    await saveRequestReversals(onlineRequestReversals);
  } catch (err) {
    onlineGetError(err);
  }
}
// reversal Online
export function uploadOnlineRequestRev(
  apiUrl,
  apiToken,
  credentialsDispatch,
  toUpload
) {
  toUpload.map(async (data_reversal) => {
    try {
      await axios.post(
        `${apiUrl}/api/accounting/reversal-requests`,
        {
          id: data_reversal.id,
          transaction: data_reversal.transaction,
          reason: data_reversal.reason,
          request_by: data_reversal.request_by,
        },
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );

      data_reversal.is_synced = 1;
      await saveRequestReversal(data_reversal);
    } catch (err) {
      console.log(err);
    }
  });
}
