import {
  offlineDatabaseError,
  offlineSelectAll,
  offlineUpdateOrInsert,
  onlineGet,
  onlineGetError,
} from "./base";
import { Cashiers } from "../entity/Cashiers";

export function getOnlineCashier(apiUrl, apiToken, dispatch) {
  return onlineGet(`${apiUrl}/api/accounting/cashiers`, apiToken, dispatch);
}

const tableName = "cashiers";

export function getOfflineCashiers() {
  return offlineSelectAll(tableName).then((entities) => {
    if (!entities) {
      return [];
    }
    return entities.map(
      (entity) =>
        new Cashiers(
          entity.id,
          entity.first_name,
          entity.middle_name,
          entity.last_name,
          entity.user,
          entity.initial,
          entity.full_name
        )
    );
  });
}

export function saveCashier(entity) {
  return offlineUpdateOrInsert(tableName, entity);
}

export function saveCashiers(entities) {
  return entities.forEach(async (entity) => {
    await saveCashier(entity);
  });
}

export async function syncOnlineAndOfflineCashiers(apiUrl, apiToken, dispatch) {
  try {
    let cashiers = await getOnlineCashier(apiUrl, apiToken, dispatch);

    cashiers = cashiers.map((entity) => ({
      full_name: entity.full_name,
      initial: entity.initial,
      user: entity.user,
      last_name: entity.last_name,
      middle_name: entity.middle_name,
      first_name: entity.first_name,
      id: entity.id,
    }));

    await saveCashiers(cashiers);
  } catch (err) {
    onlineGetError(err);
  }
}
