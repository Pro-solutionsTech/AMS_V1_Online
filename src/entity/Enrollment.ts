import { v4 as uuidv4 } from "uuid";
import { PaymentPlanItem } from "./PaymentPlanItem";
import { PaymentScheme } from "./PaymentScheme";
import { PaymentSchemeParticular } from "./PaymentSchemeParticular";

export class Enrollment {
  firstName: string;
  middleName: string;
  lastName: string;
  studentNo: string;
  grade: string;
  section: string;
  curriculum: string;
  paymentScheme: PaymentScheme;
  paymentSchemeParticulars: PaymentSchemeParticular[];
  updatedAt: Date;
  id: string;
  payment_plan_items_list: PaymentPlanItem[];
  gender: string;
  birth_date: Date;
  age: number;
  contact_no: string;
  student_address: string;
  school_year: string;

  constructor(
    firstName: string,
    middleName: string,
    lastName: string,
    studentNo: string,
    grade: string,
    section: string,
    curriculum: string,
    paymentScheme: PaymentScheme,
    paymentSchemeParticulars: PaymentSchemeParticular[],
    updatedAt: string,
    id: string = uuidv4(),
    payment_plan_items_list: PaymentPlanItem[],
    gender: string,
    birth_date: Date,
    age: number,
    contact_no: string,
    student_address: string,
    school_year: string
  ) {
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
    this.studentNo = studentNo;
    this.grade = grade;
    this.section = section;
    this.curriculum = curriculum;
    this.paymentScheme = paymentScheme;
    this.paymentSchemeParticulars = paymentSchemeParticulars;
    this.updatedAt = new Date(updatedAt);
    this.id = id;
    this.payment_plan_items_list = payment_plan_items_list;
    this.gender = gender;
    this.birth_date = birth_date;
    this.age = age;
    this.contact_no = contact_no;
    this.student_address = student_address;
    this.school_year = school_year;
  }
}
