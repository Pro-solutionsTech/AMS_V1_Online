import React, { useEffect, useState } from "react";
import { getOfflineEnrollments, } from "../repository/EnrollmentRepository";
import SidebarComponent from "./commons/Sidebar/SidebarComponent";
import SearchComponent from "./commons/Search/SearchComponent";

export default function StudentList({ credentialsState }) {
  const [student, setStudent] = useState([]);

  useEffect(() => {
    getOfflineEnrollments().then((data) => {
      const { remote } = window.require("electron");
      const database = remote.getGlobal("database");
      database
        .connection("enrollment")
        .insert(
          data.map((enrollment) => ({
            id: enrollment.id,
            payment_scheme_id: enrollment.payment_scheme_id,
          }))
        )
        .finally((data) => {
          database
            .connection("enrollment")
            .select("*")
            .then((data) => {
              setStudent(data);
            });
        });
    });
  }, []);

  return (
    <>
      <SidebarComponent />
      <SearchComponent />
      <h1>TEST</h1>
    </>
  );
}
