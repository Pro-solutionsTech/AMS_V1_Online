import { v4 as uuidv4 } from "uuid";
import { StudentPayment } from "./StudentPayment";
import { Transaction } from "./Transaction";
import { AdditionalFee } from "./AdditionalFee";

export class PaidAdditionalFee {
    
  id: string;
  student_payment_id: StudentPayment;
  additional_fee_id: AdditionalFee;
  amount: number;
  transaction_id : Transaction;
  is_reversal: boolean;
  is_synced: boolean;

  constructor(
    id: string = uuidv4(),
    student_payment_id: StudentPayment,
    additional_fee_id: AdditionalFee,
    amount: number,
    transaction_id:Transaction,
    is_reversal: boolean,
    is_synced: boolean,


  ) {
    this.id = id;
    this.student_payment_id = student_payment_id;
    this.additional_fee_id = additional_fee_id;
    this.amount = amount;
    this.transaction_id = transaction_id;
    this.is_reversal = is_reversal;
    this.is_synced = is_synced;

  }
}