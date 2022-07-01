import { v4 as uuidv4 } from "uuid";

export class Cashiers {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  user: number;
  initial: string;
  full_name: string;

  constructor(
    id: string = uuidv4(),
    first_name: string,
    middle_name: string,
    last_name: string,
    user: number,
    initial: string,
    full_name: string,

  ) {
    this.id = id;
    this.first_name = first_name;
    this.middle_name = middle_name;
    this.last_name = last_name;
    this.user = user;
    this.initial = initial;
    this.full_name = full_name;

  }
}
