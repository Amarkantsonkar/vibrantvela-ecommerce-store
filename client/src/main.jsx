import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { persistor } from "./redux/store";

import "./index.css";
import App from "./App.jsx";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </StrictMode>
);
