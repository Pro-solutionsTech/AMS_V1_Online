import { v4 as uuidv4 } from "uuid";

export class StudentPayment {
    id: string;
    enrollment_id: string;
    payment_method_id: string;
    finance_account_id: string;
    is_synced: boolean;

    constructor(
        id: string = uuidv4(),
        enrollment_id: string = uuidv4(),
        payment_method_id: string = uuidv4(),
        finance_account_id: string = uuidv4(),
        is_synced: boolean,

    ) {
        this.id = id;
        this.enrollment_id = enrollment_id;
        this.payment_method_id = payment_method_id;
        this.finance_account_id = finance_account_id;
        this.is_synced = is_synced;
    }
}
