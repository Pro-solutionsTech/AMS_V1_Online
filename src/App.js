import React from "react";
import styles from "./App.module.css";
import Login from "./pages/login/Login";
// import logo from './logo.svg';

const App = (props) => {
  return (
    <div>
      <div className="app-main">
        <Login {...props} />
      </div>
    </div>
  );
};

export default App;
