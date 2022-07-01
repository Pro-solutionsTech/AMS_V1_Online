import {
  onlineGet,
  onlineGetError,
  offlineUpdateOrInsert,
  offlineDatabaseError,
  offlineGetId
} from './base';

const tableName = 'payment_methods';

export function getOnlinePaymentMethods(apiUrl, apiToken, dispatch) {
  return onlineGet(`${apiUrl}/api/accounting/payment-methods`, apiToken, dispatch);
}

export function savePaymentMethod(entity) {
  return offlineUpdateOrInsert(tableName, entity);
}

export function savePaymentMethods(entities) {
  return entities.forEach(async entity => await savePaymentMethod(entity));
}

export async function syncOnlinePaymentMethods(apiUrl, apiToken, dispatch) {
  try {
    let paymentMethods = await getOnlinePaymentMethods(apiUrl, apiToken, dispatch);

    paymentMethods = paymentMethods.map(entity => ({
      id: entity.id,
      title: entity.title,
      description: entity.description
    }));

    await savePaymentMethods(paymentMethods);
  } catch(err) {
    onlineGetError(err);
  }
}

export function getCashMethod() {
  return offlineGetId(tableName, 'title', 'Cash');
}