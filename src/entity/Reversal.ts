import { v4 as uuidv4 } from "uuid";

export class Reversal {
    id: string;
    staff_id: string;
    transaction_id: string;
    reason: string;
    created_at: Date;
    is_synced: boolean;
    initial: string;

    constructor(
        id: string = uuidv4(),
        staff_id: string = uuidv4(),
        transaction_id: string = uuidv4(),
        reason: string,
        created_at: Date,
        is_synced: boolean,
        initial: string,


    ) {
        this.id = id;
        this.staff_id = staff_id;
        this.transaction_id = transaction_id;
        this.reason = reason;
        this.created_at = created_at;
        this.is_synced = is_synced;
        this.initial = initial;

    }
}
