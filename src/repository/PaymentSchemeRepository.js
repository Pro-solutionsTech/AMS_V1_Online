import {
  offlineDatabaseError,
  offlineSelectAll,
  offlineUpdateOrInsert,
  onlineGet,
  onlineGetError,
} from "./base";
import { PaymentScheme } from "../entity/PaymentScheme";

export function getOnlinePaymentSchemes(apiUrl, apiToken, dispatch) {
  return onlineGet(
    `${apiUrl}/api/accounting/payment-schemes`,
    apiToken,
    dispatch
  );
}

const tableName = "payment_schemes";

export function getOfflinePaymentSchemes() {
  return offlineSelectAll(tableName).then((entities) => {
    if (!entities) {
      return [];
    }
    return entities.map(
      (entity) =>
        new PaymentScheme(
          entity.title,
          entity.finance_category,
          entity.payment_plan,
          entity.id
        )
    );
  });
}

export function savePaymentSchema(entity) {
  return offlineUpdateOrInsert(tableName, entity);
}

export function savePaymentSchemas(entities) {
  return entities.forEach(async (entity) => {
    await savePaymentSchema(entity);
  });
}

export async function syncOnlineAndOfflinePaymentSchemes(apiUrl, apiToken, dispatch) {
  try {
    let paymentSchemes = await getOnlinePaymentSchemes(apiUrl, apiToken, dispatch);

    paymentSchemes = paymentSchemes.map(entity => ({
      finance_category: entity.finance_category.name,
      payment_plan: entity.payment_plan.id,
      title: entity.title,
      id: entity.id
    }));

    await savePaymentSchemas(paymentSchemes);
  } catch (err) {
    onlineGetError(err);
  }
}
