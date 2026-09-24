import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./tailwind.css";
import "./base.css";
import "./style.css";
import "./dashboard.css";
import "./demo.css";
import "./polish.css";
import "./settings.css";
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
