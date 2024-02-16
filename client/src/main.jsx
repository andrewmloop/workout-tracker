import { BrowserRouter } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";

import ClientUI from "./Client.jsx";
import "./main.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClientUI />
    </BrowserRouter>
  </React.StrictMode>
);
