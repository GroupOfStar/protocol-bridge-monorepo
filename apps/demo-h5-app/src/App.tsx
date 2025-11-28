import { useState } from "react";
import { protocolCtx } from "./utils/protocolBridge";

export default function IframeChannel() {
  const [count, setCount] = useState(0);
  const [state, setState] = useState<"成功" | "失败" | undefined>();
  // 父组件返回的消息
  const [resInfo, setResInfo] = useState("");
  const [textNum, setTextNum] = useState(30);

  function handleShowLoading() {
    protocolCtx
      .emit("showLoading", undefined)
      .then(data => {
        setState("成功");
        setResInfo(`${data}`);
      })
      .catch(err => {
        setState("失败");
        setResInfo(`${err}`);
      });
  }

  function handleSelectDate() {
    protocolCtx
      .emit("selectDate", `${count}`)
      .then(data => {
        setState("成功");
        setCount(count + 1);
        setResInfo(`${data}`);
      })
      .catch(err => {
        setState("失败");
        setResInfo(`${err}`);
      });
  }

  return (
    <div className="app-container">
      <div className="card">
        <div className="card_title">发送消息</div>
        <div className="card_body">
          <div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={handleShowLoading}>
                点击给父组件发送showLoading事件count: {count}
              </button>
              <button onClick={handleSelectDate}>
                点击给父组件发送selectDate事件
              </button>
            </div>
            <p>发送状态: {state}</p>
            <p>父组件返回的消息为: {resInfo}</p>
          </div>
        </div>
      </div>

      {Array.from({ length: textNum }, (_item, index) => (
        <div key={index}>
          <span>填充内容</span>
          <button onClick={() => setTextNum(prev => (prev ? prev - 1 : prev))}>
            删除
          </button>
        </div>
      ))}
    </div>
  );
}
