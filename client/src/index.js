import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import React from "react";

import ClientUI from "./client";

// Clear the existing HTML content
document.body.innerHTML = "<div id='app'></div>";

// Render your React app
const root = createRoot(document.getElementById("app"));
root.render(
  <BrowserRouter>
    <ClientUI />
  </BrowserRouter>
);
