import { v4 as uuidv4 } from "uuid";

export class Remarks {
    id: string;
    staff_id: string;
    student_id: string;
    remarks: string;
    created_at: Date;
    is_synced: boolean;

    constructor(
        id: string,
        staff_id: string = uuidv4(),
        student_id: string = uuidv4(),
        remarks: string,
        created_at: Date,
        is_synced: boolean,

    ) {
        this.id = id;
        this.staff_id = staff_id;
        this.student_id = student_id;
        this.remarks = remarks;
        this.created_at = created_at;
        this.is_synced = is_synced;

    }
}
