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

const savedPath = sessionStorage.getItem("archiranin_admin_path");
if (savedPath && savedPath.startsWith("/admin")) {
  sessionStorage.removeItem("archiranin_admin_path");
  window.history.replaceState(null, "", savedPath);
} else if (window.location.pathname.endsWith("/admin/index.html")) {
  window.history.replaceState(null, "", "/admin/");
}

const basename = window.location.pathname.startsWith("/admin") ? "/admin" : "/";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
