import { offlineSelectAll, offlineUpdateOrInsert } from './base';

const tableName = 'settings';

export function getSettings() {
  return offlineSelectAll(tableName)
    .then(result => result[0]);
}

export function saveSettings(data) {
  return offlineUpdateOrInsert(tableName, data);
}