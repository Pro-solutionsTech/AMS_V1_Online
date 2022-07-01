import { v4 as uuidv4 } from "uuid";
import { Enrollment } from "./Enrollment";
import { Particular } from "./Particular";

export class PaidParticular {
  id: string;
  student_payment_id: string;
  student_id: Enrollment;
  particular_id: Particular;
  amount: number;
  is_synced: boolean;
  is_reversal: boolean
  transaction_id: string;

  constructor(
    id: string = uuidv4(),
    student_payment_id: string = uuidv4(),
    student_id: Enrollment,
    particular_id: Particular,
    amount: number,
    is_synced: boolean,
    is_reversal: boolean,
    transaction_id: string = uuidv4(),

  ) {
    this.id = id;
    this.student_payment_id = student_payment_id;
    this.student_id = student_id;
    this.particular_id = particular_id;
    this.amount = amount;
    this.is_synced = is_synced;
    this.is_reversal = is_reversal;
    this.transaction_id = transaction_id;

  }
}
