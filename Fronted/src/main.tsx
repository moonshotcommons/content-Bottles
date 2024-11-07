import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { AppKitProvider } from "./provider.tsx"
import "@/styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
        <AppKitProvider>
        <App />
        </AppKitProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
