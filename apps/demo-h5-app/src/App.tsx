import { useState } from "react";
import { protocolCtx } from "./utils/protocolBridge";

export default function IframeChannel() {
  const [count, setCount] = useState(0);
  const [state, setState] = useState<"成功" | "失败" | undefined>();
  // 父组件返回的消息
  const [resInfo, setResInfo] = useState("");
  // // 接受的消息
  // const [receiveMsg, setReceiveMsg] = useState('')
  // // 回复的消息
  // const [replyMsg, setReplyMsg] = useState('')

  function handleShowLoading() {
    protocolCtx
      .emit("showLoading", count)
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

  function handleSelectDate() {
    protocolCtx
      .emit("selectDate")
      .then(data => {
        setState("成功");
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

      {Array.from({ length: 30 }, (_item, index) => (
        <div key={index}>填充内容</div>
      ))}
    </div>
  );
}
