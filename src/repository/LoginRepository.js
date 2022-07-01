import axios from "axios";
import Swal from "sweetalert2";
import { offlineMessage } from "./base";
import { offlineLogin, saveUser } from "../repository/UserRepository";

export async function login(
  state,
  dispatch,
  username,
  password,
  history,
  reduxDispatch
) {
  const data = {
    grant_type: "password",
    client_id: state.client_id,
    client_secret: state.client_secret,
    username: username,
    password: password,
  };

  const formData = new FormData();

  Object["entries"](data).forEach((keyValue) =>
    formData.append(keyValue[0], keyValue[1])
  );

  const result = await offlineLogin(username, password);

  if (navigator.onLine) {
    return axios
      .post(`${state.apiUrl}/o/token/`, formData)
      .then((response) => {
        console.log(response)
        if (response.data.is_cashier) {
          dispatch({
            type: "SET_AUTHORIZATION",
            authorization: response.data.access_token,
          });
          reduxDispatch({ type: "GET_USER", payload: response.data });
          const datas = {
            id: response.data.id ? response.data.id : null,
            staff_id: response.data.staff_id ? response.data.staff_id : null,
            employee_no: response.data.employee_no
              ? response.data.employee_no
              : null,
            first_name: response.data.first_name
              ? response.data.first_name
              : null,
            last_name: response.data.last_name ? response.data.last_name : null,
            middle_name: response.data.middle_name
              ? response.data.middle_name
              : null,
            initial: response.data.initial ? response.data.initial : null,
            username: response.data.username ? response.data.username : null,
            password: response.data.password ? response.data.password : null,
            email: response.data.email ? response.data.email : null,
            designation: response.data.designation
              ? response.data.designation
              : null,
            is_head: response.data.is_head ? response.data.is_head : false,
            is_cashier: response.data.is_cashier
              ? response.data.is_cashier
              : false,
            school: response.data.school ? response.data.school : false,
          };
          saveUser(datas);
          Swal.fire("Success", "Successfully logged in! (Online)", "success");
          history.push("/enrollments");
        } else {
          Swal.fire(
            "Error",
            'Your account must be "Cashier" to be login.',
            "error"
          );
        }
      })
      .catch((error) => {
        if (result) {
          if (result?.message_fill) {
            return offlineMessage(result.message_fill);
          }

          if (result?.message) {
            return offlineMessage(result.message);
          }

          if (result?.message_not_cashier) {
            return offlineMessage(result.message_not_cashier);
          }

          reduxDispatch({ type: "GET_USER", payload: result });
          Swal.fire("Success", "Successfully logged in! (Offline)", "success");
          history.push("/enrollments");
        } else {
          return axios
            .post(`${state.apiUrl}/o/token/`, formData)
            .then((response) => {
              if (response.data.is_cashier) {
                dispatch({
                  type: "SET_AUTHORIZATION",
                  authorization: response.data.access_token,
                });
                reduxDispatch({ type: "GET_USER", payload: response.data });
                const datas = {
                  id: response.data.id ? response.data.id : null,
                  staff_id: response.data.staff_id
                    ? response.data.staff_id
                    : null,
                  employee_no: response.data.employee_no
                    ? response.data.employee_no
                    : null,
                  first_name: response.data.first_name
                    ? response.data.first_name
                    : null,
                  last_name: response.data.last_name
                    ? response.data.last_name
                    : null,
                  middle_name: response.data.middle_name
                    ? response.data.middle_name
                    : null,
                  initial: response.data.initial ? response.data.initial : null,
                  username: response.data.username
                    ? response.data.username
                    : null,
                  password: response.data.password
                    ? response.data.password
                    : null,
                  email: response.data.email ? response.data.email : null,
                  designation: response.data.designation
                    ? response.data.designation
                    : null,
                  is_head: response.data.is_head
                    ? response.data.is_head
                    : false,
                  is_cashier: response.data.is_cashier
                    ? response.data.is_cashier
                    : false,
                  school: response.data.school ? response.data.school : false,
                };
                saveUser(datas);
                Swal.fire(
                  "Success",
                  "Successfully logged in! (Online)",
                  "success"
                );
                history.push("/enrollments");
              } else {
                Swal.fire(
                  "Error",
                  'Your account must be "Cashier" to be login.',
                  "error"
                );
              }
            })
            .catch((error) => {
              if (!username | !password) {
                Swal.fire(
                  "Error",
                  "All fields are required to be fill.",
                  "error"
                );
              } else {
                Swal.fire(
                  "Error",
                  "User Does Not Exist in Local Database.",
                  "error"
                );
              }
            });
        }
      });
  } else {
    const result = await offlineLogin(username, password);
    if (result) {
      if (result?.message_fill) {
        return offlineMessage(result.message_fill);
      }

      if (result?.message) {
        return offlineMessage(result.message);
      }

      if (result?.message_not_cashier) {
        return offlineMessage(result.message_not_cashier);
      }

      reduxDispatch({ type: "GET_USER", payload: result });
      Swal.fire("Success", "Successfully logged in! (Offline)", "success");
      history.push("/enrollments");
    } else {
      return axios
        .post(`${state.apiUrl}/o/token/`, formData)
        .then((response) => {
          if (response.data.is_cashier) {
            dispatch({
              type: "SET_AUTHORIZATION",
              authorization: response.data.access_token,
            });
            reduxDispatch({ type: "GET_USER", payload: response.data });
            const datas = {
              id: response.data.id ? response.data.id : null,
              staff_id: response.data.staff_id ? response.data.staff_id : null,
              employee_no: response.data.employee_no
                ? response.data.employee_no
                : null,
              first_name: response.data.first_name
                ? response.data.first_name
                : null,
              last_name: response.data.last_name
                ? response.data.last_name
                : null,
              middle_name: response.data.middle_name
                ? response.data.middle_name
                : null,
              initial: response.data.initial ? response.data.initial : null,
              username: response.data.username ? response.data.username : null,
              password: response.data.password ? response.data.password : null,
              email: response.data.email ? response.data.email : null,
              designation: response.data.designation
                ? response.data.designation
                : null,
              is_head: response.data.is_head ? response.data.is_head : false,
              is_cashier: response.data.is_cashier
                ? response.data.is_cashier
                : false,
              school: response.data.school ? response.data.school : false,
            };
            saveUser(datas);
            Swal.fire("Success", "Successfully logged in! (Online)", "success");
            history.push("/enrollments");
          } else {
            Swal.fire(
              "Error",
              'Your account must be "Cashier" to be login.',
              "error"
            );
          }
        })
        .catch((error) => {
          if (!username | !password) {
            Swal.fire("Error", "All fields are required to be fill.", "error");
          } else {
            Swal.fire(
              "Error",
              "User Does Not Exist in Local Database.",
              "error"
            );
          }
        });
    }
  }
}
