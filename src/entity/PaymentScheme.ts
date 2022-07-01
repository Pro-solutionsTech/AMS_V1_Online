import { v4 as uuidv4 } from "uuid";
import { PaymentPlan } from "./PaymentPlan";

export class PaymentScheme {
  id: string;
  title: string;
  financeCategory: string;
  paymentPlan: PaymentPlan;

  constructor(
    title: string,
    financeCategory: string,
    paymentPlan: PaymentPlan,
    id: string = uuidv4()
  ) {
    this.title = title;
    this.financeCategory = financeCategory;
    this.paymentPlan = paymentPlan;
    this.id = id;
  }
}
