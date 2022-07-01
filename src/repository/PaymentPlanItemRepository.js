import {
  offlineDatabaseError,
  offlineSelectAll,
  offlineUpdateOrInsert,
  onlineGet,
  onlineGetError,
} from "./base";
import { PaymentPlanItem } from "../entity/PaymentPlanItem";

export function getOnlinePaymentPlanItems(apiUrl, apiToken, dispatch) {
  return onlineGet(
    `${apiUrl}/api/accounting/payment-plans`,
    apiToken,
    dispatch
  );
}

const tableName = "payment_plan_items";

export function getOfflinePaymentPlanItems() {
  return offlineSelectAll(tableName).then((entities) => {
    if (!entities) {
      return [];
    }
    return entities.map(
      (entity) =>
        new PaymentPlanItem(
          entity.id,
          entity.particular_id,
          entity.payment_plan_id,
          entity.amount
        )
    );
  });
}

export function savePaymentPlanItem(entity) {
  return offlineUpdateOrInsert(tableName, entity);
}

export function savePaymentPlanItems(entities) {
  return entities.forEach(async (entity) => {
    await savePaymentPlanItem(entity);
  });
}

export async function syncOnlineAndOfflinePaymentPlanItems(
  apiUrl,
  apiToken,
  dispatch
) {
  try {
    let paymentPlanItems = await getOnlinePaymentPlanItems(apiUrl, apiToken, dispatch);
    
    const entities = [];

    paymentPlanItems.map(entity => {
      entity.paymentplanitem_set.map(item => {
        entities.push({
          id: item.id,
          particular_id: item.particular_id,
          payment_plan_id: item.payment_plan_id,
          amount: item.amount
        });
      });
    });

    await savePaymentPlanItems(entities);
  } catch (err) {
    onlineGetError(err);
  }
}
