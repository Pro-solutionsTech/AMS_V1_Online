import { v4 as uuidv4 } from "uuid";

export class FinanceCategory {
    id: string;
    name: string;
    description: string;


    constructor(
        id: string = uuidv4(),
        name: string,
        description: string,
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
}
