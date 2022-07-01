import {
  offlineDatabaseError,
  offlineSelectAll,
  offlineUpdateOrInsert,
  onlineGet,
  onlineGetError,
} from "./base";
import { PaymentPlan } from "../entity/PaymentPlan";

export function getOnlinePaymentPlans(apiUrl, apiToken, dispatch) {
  return onlineGet(
    `${apiUrl}/api/accounting/payment-plans`,
    apiToken,
    dispatch
  );
}

const tableName = "payment_plans";

export function getOfflinePaymentPlans() {
  return offlineSelectAll(tableName).then((entities) => {
    if (!entities) {
      return [];
    }
    return entities.map(
      (entity) => new PaymentPlan(entity.name, entity.description, entity.id)
    );
  });
}

export function savePaymentPlan(entity) {
  return offlineUpdateOrInsert(tableName, entity);
}

export function savePaymentPlans(entities) {
  return entities.forEach(async (entity) => {
    await savePaymentPlan(entity);
  });
}

export async function syncOnlineAndOfflinePaymentPlans(apiUrl, apiToken, dispatch) {
  try {
    let paymentPlans = await getOnlinePaymentPlans(apiUrl, apiToken, dispatch);

    paymentPlans = paymentPlans.map(entity => ({
      description: entity.description,
      name: entity.name,
      id: entity.id
    }))

    await savePaymentPlans(paymentPlans);
  } catch (err) {
    onlineGetError(err);
  }
}