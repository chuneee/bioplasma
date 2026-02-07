import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import React from "react";
import { AuthProvider } from "./modules/auth/context/AuthContext.tsx";
import { SessionExpireWarning } from "./components/shared/SessionExpireWarning.tsx";
import { MessageProvider } from "./components/shared/message/MessageContext.tsx";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MessageProvider>
      <AuthProvider>
        <SessionExpireWarning />
        <App />
      </AuthProvider>
    </MessageProvider>
  </React.StrictMode>,
);
