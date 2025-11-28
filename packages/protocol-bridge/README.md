# protocol-bridge

基座应用与h5应用之间进行postMessage通信

## 一、安装

```shell
npm i protocol-bridge
```

## 二、使用

### 2.1 基座应用base-app中

- 创建通信协议上下文

```ts
// ./utils/protocolBridge.ts
import { createProtocolContext } from "protocol-bridge";

// 与h5-app通信事件的类型约束保持一致, 也可把事件类型定义成一个@types的npm包
type IDemoProtocolEventMap = {
  selectDate: (payload: string) => string
  showLoading: () => void
  'user.login': (payload: string) => boolean
  'user.logout': (payload: number) => void
  'user.profile.update': () => string
}

export const protocolCtx = createProtocolContext<IDemoProtocolEventMap>()
```
- 接入子应用

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
    if (Math.random() > 0.5) {
      const res = `${str ?? ''}-${Math.random()}`
      successCallback(res)
    } else {
      errorCallback()
    }
  })
}) 
</script>
```

### 2.2 H5应用h5-app中

- 使用通信协议上下文
```ts
// ./utils/protocolBridge.ts
import { useProtocolContext } from "protocol-bridge";

// 与base-app通信事件的类型约束保持一致
type IDemoProtocolEventMap = {
  selectDate: (payload: string) => string
  showLoading: () => void
  'user.login': (payload: string) => boolean
  'user.logout': (payload: number) => void
  'user.profile.update': () => string
}

// eslint-disable-next-line react-hooks/rules-of-hooks
export const protocolCtx = useProtocolContext<IDemoProtocolEventMap>()
```

- 建立链接

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

- 触发事件
```tsx
import { useState } from "react";
import { protocolCtx } from "./utils/protocolBridge";

export default function IframeChannel() {
  function handleSelectDate() {
    protocolCtx.emit("selectDate")
      .then(data => {
        console.log("handleSelectDate res data :>> ", data);
      })
      .catch(err => {
        console.log("err :>> ", err);
      });
  }

  return (
    <button onClick={handleSelectDate}>
      点击给父组件发送selectDate事件
    </button>
  );
}
```

  至此你完成了在web应用中接入h5应用的所有步骤

## 三、自定义平台通信插件

如果基座应用是在harmony、平板或车机上，可以在接入时传入平台的通信方法插件，来进行通信。

> 例如在Harmony系统下

```ts
// ./utils/arkWebChannelPlugin.ts
import { webview } from "@kit.ArkWeb"

/**
 * 基座（ArkWeb组件）通信插件对象
 */
export interface IChannelPlugin {
  /**
   * 添加container消息通信事件
   * @param listener 
   */
  onMessageEvent(listener: (data: string) => void): void
  /**
   * 向container发送消息
   * @param resMsg 
   */
  postMessageEvent(resMsg: string): void
  /**
   * 基座向Web容器发起注册port端口通信
   * @param initPortMsg 
   */
  postContainerMessage(initPortMsg: string): void
}

/**
 * 针对 ArkWeb 基座，创建消息通信插件
 * @param controller web容器controller
 * @returns 父组件通信插件对象
 */
export function createArkWebChannelPlugin(controller: webview.WebviewController): IChannelPlugin {
  const ports = controller.createWebMessagePorts()
  // port[0]自己用，port[1]给iframe
  const parentPort = ports[0]
  return {
    onMessageEvent(listener) {
      parentPort.onMessageEvent(listener);
    },
    postMessageEvent(resMsg: string) {
      parentPort.postMessageEvent(resMsg)
    },
    postContainerMessage(initPortMsg: string) {
      controller.postMessage(initPortMsg, [ports[1]], '*');
    }
  }
}
```

```ArkTs
import { createArkWebChannelPlugin } from "../utils/arkWebChannelPlugin";
import { protocolCtx } from '../utils/protocolBridge'; // 跟上面 创建通信协议上下文 一样

// /index.ets
  Web({ src: '', controller: this.controller })
    .javaScriptAccess(true)
    .fileAccess(true)
    .domStorageAccess(true)
    .onPageEnd(() => protocolCtx.onContainerLoaded(createArkWebChannelPlugin(this.controller)))
```