import {
  offlineDatabaseError,
  offlineSelectAll,
  offlineUpdateOrInsert,
  onlineGet,
  onlineGetError,
} from "./base";
import { PaymentPeriod } from "../entity/PaymentPeriod";

export function getOnlinePaymentPeriods(apiUrl, apiToken, dispatch) {
  return onlineGet(
    `${apiUrl}/api/accounting/payment-periods`,
    apiToken,
    dispatch
  );
}

const tableName = "payment_periods";

export function getOfflinePaymentPeriods() {
  return offlineSelectAll(tableName).then((entities) => {
    if (!entities) {
      return [];
    }
    return entities.map(
      (entity) =>
        new PaymentPeriod(
          entity.id,
          entity.due_date,
          entity.amount,
          entity.name,
          entity.payment_scheme_id
        )
    );
  });
}

export function savePaymentPeriod(entity) {
  return offlineUpdateOrInsert(tableName, entity);
}

export function savePaymentPeriods(entities) {
  return entities.forEach(async (entity) => {
    await savePaymentPeriod(entity);
  });
}

export async function syncOnlineAndOfflinePaymentPeriods(apiUrl, apiToken, dispatch) {
  try {
    let paymentPeriods = await getOnlinePaymentPeriods(apiUrl, apiToken, dispatch);

    paymentPeriods = paymentPeriods.map(entity => ({
      id: entity.id,
      due_date: entity.due_date,
      amount: entity.amount,
      name: entity.name,
      payment_scheme_id: entity.payment_scheme
    }));

    await savePaymentPeriods(paymentPeriods);
  } catch (err) {
    onlineGetError(err);
  }
}
