import {
  offlineDatabaseError,
  offlineSelectAll,
  offlineUpdateOrInsert,
  onlineGet,
  onlineGetError,
} from "./base";
import { Particular } from "../entity/Particular";

export function getOnlineParticulars(apiUrl, apiToken, dispatch) {
  return onlineGet(`${apiUrl}/api/accounting/particulars`, apiToken, dispatch);
}

const tableName = "particulars";

export function getOfflineParticulars() {
  return offlineSelectAll(tableName).then((entities) => {
    if (!entities) {
      return [];
    }
    return entities.map(
      (entity) =>
        new Particular(
          entity.name,
          entity.description,
          entity.id,
          entity.payment_plan
        )
    );
  });
}


export function saveParticular(entity) {
  return offlineUpdateOrInsert(tableName, entity);
}

export function saveParticulars(entities) {
  return entities.forEach(async (entity) => {
    await saveParticular(entity);
  });
}

export async function syncOnlineAndOfflineParticulars(apiUrl, apiToken, dispatch) {
  try {
    let particulars = await getOnlineParticulars(apiUrl, apiToken, dispatch);

    particulars = particulars.map(entity => ({
      description: entity.description,
      name: entity.name,
      payment_plan: entity.payment_plan,
      id: entity.id
    }));

    await saveParticulars(particulars);
  } catch (err) {
    onlineGetError(err);
  }
}
