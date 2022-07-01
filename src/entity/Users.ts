import { v4 as uuidv4 } from "uuid";

export class Users {
    id: string;
    staff_id: string;
    employee_no: string;
    first_name: string;
    last_name: string;
    middle_name: string;
    initial: string;
    username: string;
    password: string;
    email: string;
    designation: string;
    is_head: Boolean;
    is_cashier: Boolean;
    school: string;

    constructor(
        id: string,
        staff_id: string = uuidv4(),
        employee_no: string,
        first_name: string,
        last_name: string,
        middle_name: string,
        initial: string,
        username: string,
        password: string,
        email: string,
        designation: string,
        is_head: Boolean,
        is_cashier: Boolean,
        school: string,

    ) {
        this.id = id;
        this.staff_id = staff_id;
        this.employee_no = employee_no;
        this.first_name = first_name;
        this.last_name = last_name;
        this.middle_name = middle_name;
        this.initial = initial;
        this.username = username;
        this.password = password;
        this.email = email;
        this.designation = designation;
        this.is_head = is_head;
        this.is_cashier = is_cashier;
        this.school = school;
    }
}
