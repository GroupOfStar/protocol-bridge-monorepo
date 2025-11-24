# protocol-bridge

基座应用与h5应用之间进行postMessage通信

## 使用

### 1.基座应用base-app中

a.创建通信协议上下文

```ts
// ./utils/protocolBridge.ts
import { createProtocolContext } from "protocol-bridge";

type IDemoProtocolEventMap = {
  selectDate: (payload: string) => string
  showLoading: () => void
  'user.login': (payload: string) => boolean
  'user.logout': (payload: number) => void
  'user.profile.update': () => string
}

export const protocolCtx = createProtocolContext<IDemoProtocolEventMap>()
```
b.接入子应用

```html
<template>
  <iframe src="http://localhost:6173/" @load="ev => protocolCtx.onContainerLoaded(createWebChannelPlugin(ev))"></iframe>
</template>

<script setup lang="ts">
import { createWebChannelPlugin } from "protocol-bridge";
import { protocolCtx } from './utils/protocolBridge'

onMounted(() => {
  // 注册事件，可以在任何地方、任何时机注册
  protocolCtx.on('selectDate', (str, successCallback, errorCallback) => {
    eventName.value = 'selectDate'
    eventParams.value = str
    if (Math.random() > 0.5) {
      const res = `${str ?? ''}-${Math.random()}`
      eventResData.value = res
      successCallback(res)
    } else {
      errorCallback()
    }
  })
}) 
</script>
```

### 2.H5应用h5-app中

a.使用通信协议上下文
```ts
// ./utils/protocolBridge.ts
import { useProtocolContext } from "protocol-bridge";
import type { IDemoProtocolEventMap } from 'demo-protocol-event'

// eslint-disable-next-line react-hooks/rules-of-hooks
export const protocolCtx = useProtocolContext<IDemoProtocolEventMap>()
```

b.建立链接

```ts
// ./main.ts
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { protocolCtx } from "./utils/protocolBridge";
import "./index.css";
import App from "./App.tsx";

// 建立链接
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
```

c.触发事件
```tsx
import { useState } from "react";
import { protocolCtx } from "./utils/protocolBridge";

export default function IframeChannel() {
  function handleSelectDate() {
    console.log("handleSelectDate");
    protocolCtx.emit("selectDate")
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
    <button onClick={handleSelectDate}>
      点击给父组件发送selectDate事件
    </button>
  );
}
```

## todo...