import {
    offlineDatabaseError,
    offlineSelectAll,
    offlineUpdateOrInsert,
    onlineGet,
    onlineGetError,
    offlineSelectHave,
} from "./base";
import { Remarks } from "../entity/Remarks";
import axios from "axios";

const tableName = "remarks";


export function saveRemark(entity) {
    return offlineUpdateOrInsert(tableName, entity);
}

export function saveRemarks(entities) {
    return entities.forEach(async (entity) => {
        await saveRemark(entity);
    });
}

export function getOfflineRemaks(
    id
) {
    return offlineSelectHave(tableName, id, 'student_id').then((remark) =>
        remark
    );
}

export function getOnlineRemark(apiUrl, apiToken, dispatch) {
    return onlineGet(`${apiUrl}/api/accounting/remarks`, apiToken, dispatch);
}

export function getOfflineRemarks() {
    return offlineSelectAll(tableName).then((entities) => {
        if (!entities) {
            return [];
        }
        return entities.map(
            (entity) =>
                new Remarks(
                    entity.id,
                    entity.staff_id,
                    entity.student_id,
                    entity.remarks,
                    entity.created_at,
                    entity.is_synced
                )
        );
    });
}

export function getOfflineRemarksNotYetSync() {
    return offlineSelectAll(tableName, ...Array(5), "is_synced", 0).then((entities) => {
        if (!entities) {
            return [];
        }
        return entities.map(
            (entity) =>
                new Remarks(
                    entity.id,
                    entity.staff_id,
                    entity.student_id,
                    entity.remarks,
                    entity.created_at,
                    entity.is_synced
                )
        );
    });
}
export async function syncOnlineAndOfflineRemarks(apiUrl, apiToken, dispatch) {
    try {
        const toUpload = await getOfflineRemarksNotYetSync();

        await uploadOnlineRemark(apiUrl, apiToken, dispatch, toUpload);

        let onlineRemarks = await getOnlineRemark(apiUrl, apiToken, dispatch);

        onlineRemarks = onlineRemarks.map(entity => ({
            remarks: entity.remarks,
            created_at: new Date(entity.created_at).toISOString(),
            student_id: entity.student_id,
            staff_id: entity.staff_id,
            is_synced: true,
            id: entity.id,
        }));

        await saveRemarks(onlineRemarks);
    } catch (err) {
        onlineGetError(err);
    }
}


export function uploadOnlineRemark(
    apiUrl,
    apiToken,
    credentialsDispatch,
    toUpload
) {
    toUpload.map(async (remark) => {
        try {
            await axios.post(
                `${apiUrl}/api/accounting/remarks`,
                {
                    id: remark.id,
                    staff_id: remark.staff_id,
                    student_id: remark.student_id,
                    created_at: remark.created_at,
                    remarks: remark.remarks,
                },
                {
                    headers: {
                        Authorization: `Bearer ${apiToken}`,
                    },
                }
            );

            remark.is_synced = 1;
            await saveRemark(remark);
        } catch (err) {
            console.log(err);
        }
    });
}