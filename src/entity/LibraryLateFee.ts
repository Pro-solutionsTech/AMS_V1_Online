

import { v4 as uuidv4 } from "uuid";

export class LibraryLateFee {
  id: string;
  book_title: string;
  request_by: string;
  late_fee: Number;
  return_date: Date;
  paid:string;
  done: string;
  student_payment: string;
  created_at: Date;
  is_synced: boolean;

  constructor(
    id: string = uuidv4(),
    book_title: string = uuidv4(),
    request_by: string = uuidv4(),
    late_fee:number,
    return_date: Date,
    paid:string,
    done: string,
    student_payment: string = uuidv4(),
    created_at: Date,
    is_synced: boolean,

  ) {
    this.id = id;
    this.book_title = book_title;
    this.request_by = request_by;
    this.late_fee = late_fee;
    this.return_date = return_date;
    this.paid = paid;
    this.done = done;
    this.student_payment = student_payment;
    this.created_at = created_at;
    this.is_synced = is_synced;
  }
}
