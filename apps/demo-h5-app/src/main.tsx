import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { protocolCtx } from "./utils/protocolBridge";
import "./index.css";
import App from "./App.tsx";

protocolCtx
  .createProtocolBridge()
  .then(() => {
    console.log("已拿到port");

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        protocolCtx.emit("resize", entry.target.scrollHeight);
      }
    });
    resizeObserver.observe(document.body);
  })
  .catch(() => {
    console.log("链接失败");
  });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
