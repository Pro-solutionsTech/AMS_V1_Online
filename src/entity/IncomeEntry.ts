import { v4 as uuidv4 } from "uuid";

export class IncomeEntry {
    id: string;   
    finance_category: string;
    title:string;
    description:string;
    receive_from:string;
    add_to:string
    amount:number;
    date: Date;
    type: string;
    transaction: string;
    created_at: Date;
    is_synced: boolean;
    is_reversal: boolean;


  constructor(
  
    id: string,   
    finance_category: string,
    title:string,
    description:string,
    receive_from:string,
    add_to:string= uuidv4(),
    amount:number,
    date: Date,
    type:string,
    transaction:string = uuidv4(),
    created_at: Date,
    is_synced: boolean,
    is_reversal: boolean,

  ) {
    this.id=id;   
    this.finance_category = finance_category;
    this.title = title;
    this.description = description;
    this.receive_from=receive_from;
    this.add_to=add_to;
    this.amount=amount;
    this.date=date;
    this.type=type;
    this.transaction = transaction;
    this.created_at= created_at;
    this.is_synced = is_synced;
    this.is_reversal=is_reversal;
  }
}


