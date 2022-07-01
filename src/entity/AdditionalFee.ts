import { v4 as uuidv4 } from "uuid";
import { Enrollment } from "./Enrollment";
import { Particular } from "./Particular";

export class AdditionalFee {
  id: string;
  enrollment_id: Enrollment;
  amount: number;
  student_payment_id: string;
  particular_id: Particular;
  is_synced: boolean;

  constructor(
    id: string = uuidv4(),
    enrollment_id: Enrollment,
    amount: number,
    student_payment_id: string = uuidv4(),
    particular_id: Particular,
    is_synced: boolean,


  ) {
    this.id = id;
    this.enrollment_id = enrollment_id;
    this.amount = amount;
    this.student_payment_id = student_payment_id;
    this.particular_id = particular_id;
    this.is_synced = is_synced;
  }
}
