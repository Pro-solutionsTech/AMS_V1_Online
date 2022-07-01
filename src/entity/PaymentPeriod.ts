import { v4 as uuidv4 } from "uuid";
import { PaymentScheme } from "./PaymentScheme";

export class PaymentPeriod {
  id: string;
  due_date: Date;
  amount: number;
  name: string;
  payment_scheme_id: PaymentScheme;

  constructor(
    id: string = uuidv4(),
    due_date: Date,
    amount: number,
    name: string,
    payment_scheme_id: PaymentScheme
  ) {
    this.id = id;
    this.due_date = due_date;
    this.amount = amount;
    this.name = name;
    this.payment_scheme_id = payment_scheme_id;
  }
}
