import { v4 as uuidv4 } from "uuid";

export class PaymentPlan {
  id: string;
  name: string;
  description: string;

  constructor(name: string, description: string, id: string = uuidv4()) {
    this.name = name;
    this.description = description;
    this.id = id;
  }
}
