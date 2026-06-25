import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app/globals.css";
import SurveyPage from "./app/page";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <SurveyPage />
  </StrictMode>
);
