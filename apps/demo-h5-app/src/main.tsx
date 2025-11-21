import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createProtocolBridge } from "protocol-bridge";
import "./index.css";
import App from "./App.tsx";

createProtocolBridge()
  .then(() => {
    console.log("已拿到port");
  })
  .catch(() => {
    console.log("链接失败");
  });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
