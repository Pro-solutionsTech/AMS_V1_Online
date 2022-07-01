import {
  offlineDatabaseError,
  offlineSelectAll,
  offlineUpdateOrInsert,
  onlineGet,
  onlineGetError,
  offlineSelectHave,
} from "./base";
import { LibraryLateFee } from "../entity/LibraryLateFee";

import axios from "axios";
import Swal from "sweetalert2";

const tableName = "late_fees";

export function saveLibraryLateFee(entity) {
  return offlineUpdateOrInsert(tableName, entity);
}

export function saveLibraryLateFees(entities) {
  return entities.forEach(async (entity) => {
    await saveLibraryLateFee(entity);
  });
}

// export function getOfflineLibraryLateFee(
//     id
// ) {
//     return offlineSelectHave(tableName, id, 'student_id').then((remark) =>
//         remark
//     );
// }

export function getOnlineLibraryLateFee(apiUrl, apiToken, dispatch) {
  return onlineGet(
    `${apiUrl}/api/accounting/library-late-fee`,
    apiToken,
    dispatch
  );
}

export function getOfflineLibraryLateFees() {
  return offlineSelectAll(tableName).then((entities) => {
    if (!entities) {
      return [];
    }
    return entities.map(
      (entity) =>
        new LibraryLateFee(
          entity.id,
          entity.book_title,
          entity.request_by,
          entity.late_fee,
          entity.return_date,
          entity.paid,
          entity.done,
          entity.student_payment,
          entity.created_at,
          entity.is_synced
        )
    );
  });
}

export function getOfflineLibraryLateFeesNotYetSync() {
  return offlineSelectAll(tableName, ...Array(5), "is_synced", 0).then(
    (entities) => {
      if (!entities) {
        return [];
      }
      return entities.map(
        (entity) =>
          new LibraryLateFee(
            entity.id,
            entity.book_title,
            entity.request_by,
            entity.late_fee,
            entity.return_date,
            entity.paid,
            entity.done,
            entity.student_payment,
            entity.created_at,
            entity.is_synced
          )
      );
    }
  );
}

export async function syncOnlineAndOfflineLibraryLateFees(
  apiUrl,
  apiToken,
  dispatch
) {
  try {
    const toUpload = await getOfflineLibraryLateFeesNotYetSync();

    await uploadOnlineLibraryLateFee(apiUrl, apiToken, dispatch, toUpload);

    let onlineLateFees = await getOnlineLibraryLateFee(
      apiUrl,
      apiToken,
      dispatch
    );

    onlineLateFees = onlineLateFees.map((entity) => ({
      id: entity.id,
      book_title: entity.book_title,
      request_by: entity.request_by,
      late_fee: entity.late_fee,
      return_date: entity.return_date,
      paid: entity.paid,
      done: entity.done,
      student_payment: entity.student_payment,
      is_synced: true,
      created_at: new Date(entity.created_at).toISOString(),
    }));

    await saveLibraryLateFees(onlineLateFees);
  } catch (err) {
    onlineGetError(err);
  }
}

export function uploadOnlineLibraryLateFee(
  apiUrl,
  apiToken,
  credentialsDispatch,
  toUpload
) {
  toUpload.map(async (late_fee) => {
    try {
      await axios.put(
        `${apiUrl}/api/accounting/library-late-fee/${late_fee.id}`,
        {
          id: late_fee.id,
          request_by: late_fee.request_by,
          paid: late_fee.paid,
        },
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );

      late_fee.is_synced = 1;
      await saveLibraryLateFee(late_fee);
    } catch (err) {
      console.log(err);
    }
  });
}

function getDatabase() {
  const { remote } = window.require("electron");
  return remote.getGlobal("database");
}

export function getOfflineLateFeeById(whereColumn, whereValue) {
  let queryBuilder = getDatabase()
    .connection("late_fees")
    .select("*")
    .where(whereColumn, whereValue);
  return queryBuilder.catch(offlineDatabaseError).then((result) => result);
}
