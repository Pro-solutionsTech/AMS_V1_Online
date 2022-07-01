import { insertSyncDate, lastestSyncDate } from './base';

const tableName = 'sync';

export function syncDate() {
  let currentDate = new Date().toISOString();

  insertSyncDate(currentDate);

  return currentDate;
}

export function getLatestSyncDate() {
  return lastestSyncDate().then(date => date);
}