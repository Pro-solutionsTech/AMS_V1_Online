import { v4 as uuidv4 } from "uuid";

export class RequestReversal {

    id: string;
    reason: string;
    transaction: string;
    request_by:string = uuidv4();
    is_synced:boolean;

    constructor(
        id: string = uuidv4(),
        reason: string,
        transaction: string = uuidv4(),
        request_by: string = uuidv4(),
        is_synced:boolean

    ) {
        this.id = id;
        this.transaction = transaction;
        this.reason = reason;
        this.request_by = request_by;
        this.is_synced = is_synced;
    }
}

