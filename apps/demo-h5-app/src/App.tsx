import { useState } from "react";
import { emitProtocolMessage } from "protocol-bridge";

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
    console.log("handleShowLoading");
    emitProtocolMessage("showLoading", count)
      .then(data => {
        console.log("handleShowLoading res data :>> ", data);
        setState("成功");
        setCount(count + 1);
        setResInfo(`${data}`);
      })
      .catch(err => {
        console.log("err :>> ", err);
        setState("失败");
        setResInfo(`${err}`);
      });
  }

  function handleSelectDate() {
    console.log("handleSelectDate");
    emitProtocolMessage("selectDate")
      .then(data => {
        console.log("handleSelectDate res data :>> ", data);
        setState("成功");
        setResInfo(`${data}`);
      })
      .catch(err => {
        console.log("err :>> ", err);
        setState("失败");
        setResInfo(`${err}`);
      });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
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
    </div>
  );
}
