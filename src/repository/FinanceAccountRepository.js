import {
  onlineGet,
  onlineGetError,
  offlineUpdateOrInsert,
  offlineDatabaseError,
  offlineGetId,
} from "./base";

const tableName = "finance_accounts";

export function getOnlineFinanceAccounts(apiUrl, apiToken, dispatch) {
  return onlineGet(
    `${apiUrl}/api/accounting/finance-accounts`,
    apiToken,
    dispatch
  );
}

export function saveFinanceAccount(entity) {
  return offlineUpdateOrInsert(tableName, entity);
}

export function saveFinanceAccounts(entities) {
  return entities.forEach(async (entity) => await saveFinanceAccount(entity));
}

export async function syncOnlineFinanceAccounts(apiUrl, apiToken, dispatch) {
  try {
    let financeAccounts = await getOnlineFinanceAccounts(
      apiUrl,
      apiToken,
      dispatch
    );

    financeAccounts = financeAccounts.map((entity) => ({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      amount: entity.amount,
      transaction_id: entity.transaction_id,
    }));

    await saveFinanceAccounts(financeAccounts);
  } catch (err) {
    onlineGetError(err);
  }
}

export function getCashAccount() {
  return offlineGetId(tableName, "name", "Cash-on-hand");
}
