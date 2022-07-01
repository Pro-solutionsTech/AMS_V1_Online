import "reflect-metadata";

import React, { useEffect, useReducer } from "react";
import ReactDOM from "react-dom";
import "./index.module.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";

import { Route, Switch, HashRouter } from "react-router-dom";

import Settings from "./screens/Settings";
import {
  credentialsInitialState,
  credentialsReducer,
} from "./reducers/Credentials";
import MasterFeeList from "./screens/MasterFeeList";
import Student from "./screens/StudentList";
import Dashboard from "./pages/dashboard/Dashboard";
import StudentFinanceContainer from "./pages/student/StudentFinanceContainer";
import ProcessPaymentContainer from "./pages/student/ProcessPaymentContainer";
import Enrolled from "./screens/Enrolled/Enrolled";
import TransactionsList from "./screens/Transactions/TransactionsList";
import Transactions from "./screens/Transactions/Transactions";
import Reports from "./screens/Reports/Reports";
import Paymentscon from "./screens/Paymentscon/Paymentscon";
import Settingsdash from "./screens/Settingsdash/Settingsdash";
import Alltransac from "./screens/Reports/Alltransac/Alltransac";
import Pergradelevel from "./screens/Reports/Pergradelevel/Pergradelevel";
import Perparticular from "./screens/Reports/Perparticular/Perparticular";
import StudentFinance from "./screens/Enrolled/StudentFinance";
import ProcessPayment from "./screens/Enrolled/ProcessPayment";
import StudentPayment from "./screens/Enrolled/StudentPayment";
import SOA from './screens/commons/SOA/SOA';
import NonStudent from "./screens/NonStudent/NonStudent";

function CashierRoutes() {
  const [credentialsState, credentialsDispatch] = useReducer(
    credentialsReducer,
    credentialsInitialState
  );

  useEffect(() => {
    const { ipcRenderer } = window.require("electron");
    ipcRenderer.on("database", (event, arg) => {
      // console.log("Database", arg);
    });
    ipcRenderer.invoke("database");
  }, []);

  return (
    <div className="App">
      <Switch>
        <Route
          path="/enrollments"
          exact
          render={(props) => (
            <Dashboard
              {...props}
              credentialsState={credentialsState}
              credentialsDispatch={credentialsDispatch}
              Component={Enrolled}
            />
          )}
        />
       
         <Route
          path="/non-student"
          exact
          render={(props) => (
            <Dashboard
              {...props}
              credentialsState={credentialsState}
              credentialsDispatch={credentialsDispatch}
              Component={NonStudent}
            />
          )}
        />

        <Route
          path="/transactions-list"
          render={(props) => (
            <Dashboard
              {...props}
              credentialsState={credentialsState}
              credentialsDispatch={credentialsDispatch}
              Component={TransactionsList}
            />
          )}
        />

        <Route
          path="/transactions/:id"
          exact
          render={(props) => (
            <Dashboard
              {...props}
              credentialsState={credentialsState}
              credentialsDispatch={credentialsDispatch}
              Component={() => <Transactions credentialsState={credentialsState} credentialsDispatch={credentialsDispatch} />}
            />
          )}
        />

        <Route
          exact
          path="/reports"
          render={(props) => (
            <Dashboard
              {...props}
              credentialsState={credentialsState}
              credentialsDispatch={credentialsDispatch}
              Component={Alltransac}
            />
          )}
        />

        <Route
          path="/payment"
          render={(props) => (
            <Dashboard
              {...props}
              credentialsState={credentialsState}
              credentialsDispatch={credentialsDispatch}
              Component={Paymentscon}
            />
          )}
        />

        <Route
          path="/settingsdash"
          render={(props) => (
            <Dashboard
              {...props}
              credentialsState={credentialsState}
              credentialsDispatch={credentialsDispatch}
              Component={Settingsdash}
            />
          )}
        />

        <Route
          path="/statement-of-account"
          render={(props) => (
            <Dashboard
              {...props}
              credentialsState={credentialsState}
              credentialsDispatch={credentialsDispatch}
              Component={SOA}
            />
          )}
        />

        <Route
          path="/"
          exact
          render={(props) => (
            <App
              {...props}
              credentialsState={credentialsState}
              credentialsDispatch={credentialsDispatch}
            />
          )}
        />

        <Route
          path="/master-fees"
          exact
          render={(props) => (
            <MasterFeeList {...props} credentialsState={credentialsState} />
          )}
        />

        {/* <Route
          path="/maintenance"
          exact
          render={(props) => (
            <Settings
              {...props}
              credentialsState={credentialsState}
              credentialsDispatch={credentialsDispatch}
            />
          )}
        /> */}

        <Route
          path="/settings"
          exact
          render={(props) => (
            <Settings
              {...props}
              credentialsState={credentialsState}
              credentialsDispatch={credentialsDispatch}
            />
          )}
        />

        <Route
          path="/students"
          exact
          render={(props) => (
            <Student {...props} credentialsState={credentialsState} />
          )}
        />

        <Route
          path="/enrollments/:id"
          exact
          render={(props) => (
            <Dashboard
              {...props}
              credentialsState={credentialsState}
              credentialsDispatch={credentialsDispatch}
              Component={StudentFinance}
            />
          )}
        />

        <Route
          path="/enrollments/:id/process-payment"
          exact
          render={(props) => (
            <Dashboard
              {...props}
              credentialsState={credentialsState}
              credentialsDispatch={credentialsDispatch}
              Component={ProcessPayment}
            />
          )}
        />

        <Route
          path="/enrollments/:id/student-payment"
          exact
          render={(props) => (
            <Dashboard
              {...props}
              credentialsState={credentialsState}
              credentialsDispatch={credentialsDispatch}
              Component={StudentPayment}
            />
          )}
        />

        <Route
          path="/dashboard"
          exact
          render={(props) => (
            <Dashboard
              {...props}
              credentialsState={credentialsState}
              credentialsDispatch={credentialsDispatch}
            />
          )}
        />
      </Switch>
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter>
        <CashierRoutes />
      </HashRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// ReactDOM.render(
//   <Dashboard/>,
//   document.getElementById("root")
// );
