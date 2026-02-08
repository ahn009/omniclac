import React from "react";
import ReactDOM from "react-dom/client";
import AppWrapper from "./App";
import "./styles/globals.css"; // keep only this

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);