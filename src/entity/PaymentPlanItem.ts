import { v4 as uuidv4 } from "uuid";
import { Particular } from "./Particular";
import { PaymentPlan } from "./PaymentPlan";

export class PaymentPlanItem {
  id: string;
  particular_id: Particular;
  payment_plan_id: PaymentPlan;
  amount: number;

  constructor(
    id: string = uuidv4(),
    particular_id: Particular,
    payment_plan_id: PaymentPlan,
    amount: number
  ) {
    this.id = id;
    this.particular_id = particular_id;
    this.payment_plan_id = payment_plan_id;
    this.amount = amount;
  }
}
