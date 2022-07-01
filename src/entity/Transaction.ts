import { v4 as uuidv4 } from "uuid";

export class Transaction {
  id: string;
  student_payment_id: string;
  to_acct_id: string;
  amount: number;
  is_synced: boolean;
  created_at: Date;
  or_no: string;
  ecr_no: string;
  is_reversal: boolean;
  cash_received: number;

  constructor(
    id: string = uuidv4(),
    student_payment_id: string = uuidv4(),
    to_acct_id: string = uuidv4(),
    amount: number,
    is_synced: boolean,
    created_at: Date,
    or_no: string,
    ecr_no: string,
    is_reversal: boolean,
    cash_received: number

  ) {
    this.id = id;
    this.student_payment_id = student_payment_id;
    this.to_acct_id = to_acct_id;
    this.amount = amount;
    this.is_synced = is_synced;
    this.created_at = created_at;
    this.or_no = or_no;
    this.ecr_no = ecr_no;
    this.is_reversal = is_reversal;
    this.cash_received = cash_received;

  }
}
