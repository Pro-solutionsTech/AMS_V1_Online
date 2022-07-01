export class Student {
  id: string;
  student_no: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;

  constructor(
    id: string,
    student_no: string,
    first_name: string,
    middle_name: string,
    last_name: string,
    email: string
  ) {
    this.id = id;
    this.student_no = student_no;
    this.first_name = first_name;
    this.middle_name = middle_name;
    this.last_name = last_name;
    this.email = email;
  }
}
