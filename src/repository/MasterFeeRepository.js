import {OfflineMasterFee, OfflineParticular,} from "../entity/OfflineMasterFee";
import {offlineSelectAll, onlineGet} from "./base";

export function getOfflineMasterFees() {
  return offlineSelectAll("master_fee").then((masterFees) => {
    return offlineSelectAll("particular").then((particulars) => {
      return masterFees.map(masterFee => new OfflineMasterFee(
        masterFee.id,
        masterFee.name,
        masterFee.description,
        particulars.filter(particular => particular.master_fee_id === masterFee.id)
      ))
    });
  });
}

export function getOnlineMasterFees(apiUrl, apiToken, dispatch) {
  return onlineGet(`${apiUrl}/api/accounting/master-fees`, apiToken, dispatch);
}

export function syncOnlineAndOfflineMasterFees(apiUrl, apiToken, dispatch) {
  return getOnlineMasterFees(apiUrl, apiToken, dispatch).then((response) => {
  });
}
