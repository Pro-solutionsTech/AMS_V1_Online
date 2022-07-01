import {
  offlineDatabaseError,
  offlineSelectAll,
  offlineUpdateOrInsert,
  onlineGet,
  onlineGetError,
  offlineSelectHave,
  offlineSelectOneIncome,
} from "./base";
import { IncomeEntry } from "../entity/IncomeEntry";
import axios from "axios";
import { offlineSelectTransaction } from "../repository/base";
import moment from "moment";
const tableName = "income_entry";

export function saveIncome(entity) {
  return offlineUpdateOrInsert(tableName, entity);
}

export function saveIncomes(entities) {
  return entities.forEach(async (entity) => {
    await saveIncome(entity);
  });
}

// export function getOfflineReversalCheck(
//     id
// ) {
//     return offlineSelectTransaction('reversal', id,).then((reversal) =>
//         reversal
//     );
// }

export function getOfflineIncomeOne(id) {
  return offlineSelectOneIncome(tableName, id, "transaction").then(
    (income) => income
  );
}

export function getOnlineIncome(apiUrl, apiToken, dispatch) {
  return onlineGet(
    `${apiUrl}/api/accounting/income-expense-entry`,
    apiToken,
    dispatch
  );
}

export function getOfflineIncomes() {
  return offlineSelectAll(tableName).then((entities) => {
    if (!entities) {
      return [];
    }
    return entities.map(
      (entity) =>
        new IncomeEntry(
          entity.id,
          entity.finance_category,
          entity.title,
          entity.description,
          entity.receive_from,
          entity.add_to,
          entity.amount,
          entity.date,
          entity.type,
          entity.transaction,
          entity.created_at,
          entity.is_synced,
          entity.is_reversal
        )
    );
  });
}

export function getOfflineIncomesNotYet() {
  return offlineSelectAll(tableName, ...Array(5), "is_synced", 0).then(
    (entities) => {
      if (!entities) {
        return [];
      }
      return entities.map(
        (entity) =>
          new IncomeEntry(
            entity.id,
            entity.finance_category,
            entity.title,
            entity.description,
            entity.receive_from,
            entity.add_to,
            entity.amount,
            entity.date,
            entity.type,
            entity.transaction,
            entity.created_at,
            entity.is_synced,
            entity.is_reversal
          )
      );
    }
  );
}

export async function syncOnlineAndOfflineIncomeEntries(
  apiUrl,
  apiToken,
  dispatch
) {
  try {
    const toUpload = await getOfflineIncomesNotYet();
    await uploadOnlineIncome(apiUrl, apiToken, dispatch, toUpload);
    let onlineIncomes = await getOnlineIncome(apiUrl, apiToken, dispatch);

    onlineIncomes = onlineIncomes.map((entity) => ({
      id: entity.id,
      finance_category: entity.finance_category,
      title: entity.title,
      description: entity.description,
      receive_from: entity.receive_from,
      add_to: entity.add_to,
      amount: entity.amount,
      date: entity.date,
      type: entity.type,
      transaction: entity.transaction,
      created_at: new Date(entity.created_at).toISOString(),
      is_synced: true,
      is_reversal: entity.is_reversal,
    }));

    await saveIncomes(onlineIncomes);
  } catch (err) {
    onlineGetError(err);
    console.log(err);
  }
}

export function uploadOnlineIncome(
  apiUrl,
  apiToken,
  credentialsDispatch,
  toUpload
) {
  toUpload.map(async (income) => {
    let amount = income.amount.toFixed(2);
    try {
      await axios.post(
        `${apiUrl}/api/accounting/income-expense-entry`,
        {
          id: income.id,
          finance_category: income.finance_category,
          title: income.title,
          description: income.description,
          receive_from: income.receive_from,
          add_to: income.add_to,
          amount: amount,
          date: income.date,
          type: income.type,
          transaction: income.transaction,
          // created_at: income.created_at,
          is_reversal: income.is_reversal,
        },
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );
      income.is_synced = 1;
      await saveIncome(income);
    } catch (err) {
      console.log(err);
    }
  });
}
