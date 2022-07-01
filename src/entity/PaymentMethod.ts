import { v4 as uuidv4 } from "uuid";

export class PaymentMethod {
    id: string;
    title: string;
    description: string;

    constructor(
        id: string = uuidv4(),
        title: string,
        description: string,
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
    }
}
