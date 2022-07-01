import {v4 as uuidv4} from "uuid";

export class PaymentSchemeParticular {
    name: string;
    totalAmount: number;
    balance: number;
    status: string;
    id: string;

    constructor(
        name: string,
        totalAmount: number,
        balance: number,
        status: string,
        id: string = uuidv4(),
    ) {
        this.name = name;
        this.totalAmount = totalAmount;
        this.balance = balance;
        this.status = status;
        this.id = id;
    }
}
