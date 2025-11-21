import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { protocolCtx } from "./utils/protocolBridge";
import "./index.css";
import App from "./App.tsx";

protocolCtx
  .createProtocolBridge()
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
