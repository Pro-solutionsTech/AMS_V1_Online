import { v4 as uuidv4 } from "uuid";
import { PaymentPlan } from "./PaymentPlan";

export class Particular {
  id: string;
  name: string;
  payment_plan: PaymentPlan;
  description: string;

  constructor(
    name: string,
    description: string,
    id: string = uuidv4(),
    payment_plan: PaymentPlan
  ) {
    this.name = name;
    this.description = description;
    this.payment_plan = payment_plan;
    this.id = id;
  }
}
