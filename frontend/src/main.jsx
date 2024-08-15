import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { QrContextProvider } from "./qrContest/QrContest.jsx";

createRoot(document.getElementById("root")).render(
    <QrContextProvider>
      <App />
    </QrContextProvider>
);
