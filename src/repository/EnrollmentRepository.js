import { Enrollment } from "../entity/Enrollment";
import {
  offlineUpdateOrInsert,
  offlineSelectAll,
  onlineGet,
  offlineDatabaseError,
  onlineGetError,
  offlineSelectOne,
  countOffline,
  offlineDistinct,
  offlineFilterByGradeAndSection,
  countOfflineFilter,
} from "./base";

export function getOnlineEnrollments(apiUrl, apiToken, dispatch) {
  return onlineGet(`${apiUrl}/api/accounting/enrollments`, apiToken, dispatch);
}

const tableName = "enrollments";

function mapEnrollment(enrollment, paymentSchemes, payment_plan_items = []) {
  const payment_scheme = paymentSchemes.filter(
    (paymentScheme) => paymentScheme.id === enrollment.payment_scheme_id
  )[0];

  const payment_plan_items_list = payment_plan_items.filter(
    (item) => item.payment_plan_id === payment_scheme.paymentPlan
  );
  const paymentSchemeParticulars = [
    {
      id: "1234",
      name: "Tuition Fee",
      totalAmount: 12000,
      balance: 6000,
      status: "Partially Paid",
    },
    {
      id: "2345",
      name: "Miscellaneous Fees - PTA",
      totalAmount: 12000,
      balance: 6000,
      status: "Partially Paid",
    },
    {
      id: "3456",
      name: "Miscellaneous Fees - School Supplies",
      totalAmount: 12000,
      balance: 12000,
      status: "Not Yet Paid",
    },
    {
      id: "4567",
      name: "Miscellaneous Fees - Uniform",
      totalAmount: 12000,
      balance: 0,
      status: "Paid",
    },
    {
      id: "5678",
      name: "Miscellaneous Fees - Books",
      totalAmount: 12000,
      balance: 0,
      status: "Paid",
    },
  ]; // TODO: Remove hardcoding
  return new Enrollment(
    enrollment.first_name,
    enrollment.middle_name,
    enrollment.last_name,
    enrollment.student_no,
    enrollment.grade,
    enrollment.section,
    enrollment.curriculum,
    payment_scheme,
    paymentSchemeParticulars,
    enrollment.updated_at,
    enrollment.id,
    payment_plan_items_list,
    enrollment.gender,
    enrollment.birth_date,
    enrollment.age,
    enrollment.contact_no,
    enrollment.student_address,
    enrollment.school_year
  );
}

export function getOfflineEnrollments(
  searchQuery,
  paymentSchemes,
  pageNumber,
  pageLimit,
  totalStudents,
  payment_plan_items = []
) {
  return offlineSelectAll(
    tableName,
    pageNumber,
    pageLimit,
    totalStudents,
    searchQuery,
    ["first_name", "middle_name", "last_name", "student_no"]
  ).then((enrollments) => {
    return enrollments.map((enrollment) =>
      mapEnrollment(enrollment, paymentSchemes, payment_plan_items)
    );
  });
}

export function getOfflineEnrollment(
  id,
  paymentSchemes,
  payment_plan_items = []
) {
  return offlineSelectOne(tableName, id).then((enrollment) =>
    mapEnrollment(enrollment, paymentSchemes, payment_plan_items)
  );
}

export function countOfflineEnrollments(searchQuery) {
  return countOffline(tableName, searchQuery, [
    "first_name",
    "middle_name",
    "last_name",
    "student_no",
  ]).then((enrollment) => enrollment);
}

export function saveEnrollment(enrollment) {
  return offlineUpdateOrInsert(tableName, enrollment);
}

export function saveEnrollments(enrollments) {
  return enrollments.forEach(async (enrollment) => {
    await saveEnrollment(enrollment);
  });
}

export async function syncOnlineAndOfflineEnrollments(
  apiUrl,
  apiToken,
  dispatch
) {
  try {
    let enrollments = await getOnlineEnrollments(apiUrl, apiToken, dispatch);

    enrollments = enrollments.map((data) => ({
      id: data.id,
      payment_scheme_id: data.payment_scheme_id,
      grade: data.section
        ? data.section.curriculum.grade_level.name
        : "Not Yet Set",
      section: data.section ? data.section.name : "Not yet Set",
      first_name: data.student.first_name,
      middle_name: data.student.middle_name,
      last_name: data.student.last_name,
      student_no: data.student.student_no,
      created_at: new Date(data.created_at).toISOString(),
      updated_at: data.updated_at,
      curriculum: data.section ? data.section.name : "Not Yet Set",
      gender: data.student.gender,
      age: data.student.age,
      birth_date: data.student.birth_date,
      student_address: data.student.address,
      contact_no: data.student.contact_no,
      school_year: data.school_year,
    }));

    await saveEnrollments(enrollments);
  } catch (err) {
    onlineGetError(err);
  }
}

export function getOfflineDistinct(column) {
  return offlineDistinct(tableName, column).then((data) =>
    data.map((distinct) => distinct[column])
  );
}

export function getOfflineFilterByGradeAndSection(
  paymentSchemes,
  pageNumber,
  pageLimit,
  grade,
  section,
  school_year,
  payment_plan_items = []
) {
  return offlineFilterByGradeAndSection(
    tableName,
    pageNumber,
    pageLimit,
    grade,
    section,
    school_year
  ).then((enrollments) =>
    enrollments.map((enrollment) =>
      mapEnrollment(enrollment, paymentSchemes, payment_plan_items)
    )
  );
}

export function getCountOfflineFilter(grade, section, school_year) {
  return countOfflineFilter(tableName, grade, section, school_year).then((total) => total);
}
