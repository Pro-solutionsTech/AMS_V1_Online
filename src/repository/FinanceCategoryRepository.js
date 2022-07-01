import {
    onlineGet,
    onlineGetError,
    offlineUpdateOrInsert,
    offlineDatabaseError,
    offLineGetAllByName
  } from './base';
  
  const tableName = 'finance_categories';
  
  export function getOnlineFinanceCategories(apiUrl, apiToken, dispatch) {
    return onlineGet(`${apiUrl}/api/accounting/finance-category` , apiToken, dispatch);
  }
  
  export function saveFinanceCategory(entity) {
    return offlineUpdateOrInsert(tableName, entity);
  }
  
  export function saveFinanceCategories(entities) {
    return entities.forEach(async entity => await saveFinanceCategory(entity));
  }
  
  export async function syncOnlineFinanceCategories(apiUrl, apiToken, dispatch) {
    try {
      let financeCategories = await getOnlineFinanceCategories(apiUrl, apiToken, dispatch);  

        
      financeCategories = financeCategories.map(entity => ({
        id: entity.id,
        name: entity.name,
        description: entity.description,
        category_types: entity.category_types,


      }));
  
      await saveFinanceCategories(financeCategories);
    } catch(err) {
      onlineGetError(err);
    }
  }

// this is for getting all Finance Categotries with a name of Income
  export function getAllFinanceCatgories() {
    return offLineGetAllByName(tableName, 'category_types', 'Income');
  }
  