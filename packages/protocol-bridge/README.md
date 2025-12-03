# protocol-bridge

具有事件名和事件参数类型提示的 `Emitter` 类型的通信协议，具体包含：
1. 基座应用与h5应用之间进行postMessage通信；
2. 在Web应用中进行跨页签通信。

## 一、安装

```bash
npm i protocol-bridge
```

## 二、使用

### 2.1 基座应用base-app中

- 创建通信协议上下文

```ts
// ./utils/protocolBridge.ts
import { createProtocolContext } from 'protocol-bridge';

/**
 * 通信事件类型定义
 * 1. 第一个参数表示事件名, 第二个参数表示触发事件时的传参, 第三个参数表示监听到事件后成功情况下返回的参数, 第四个参数为可选的表示失败情况下返回的参数
 * 2. 与h5-app通信事件的类型约束保持一致, 也可把事件类型定义成一个@types的npm包
 */
type IDemoProtocolEventMap =
  | ['container.height.resize', 'number', 'undefined']
  | ['selectDate', 'string', 'string', 'undefined']
  | ['showLoading', 'undefined', 'undefined']
  | ['user.login', 'string', 'boolean', 'undefined']
  | ['user.logout', 'number', 'undefined', 'undefined']
  | ['user.profile.update', 'undefined', 'string', 'undefined'];

export const protocolCtx = createProtocolContext<IDemoProtocolEventMap>();
```

`IDemoProtocolEventMap` 必须受到 `IProtocolEvent` 的约束，即：

```ts
function createProtocolContext<EV extends IProtocolEvent>() {}
```

其中

```ts
/**
 * js类型映射
 */
type IJsTypeMap = {
  string: string;
  boolean: boolean;
  number: number;
  object: object;
  undefined: undefined;
};

/**
 * 注册的通信事件类型约束
 */
type IProtocolEvent =
  | [string, keyof IJsTypeMap, keyof IJsTypeMap, keyof IJsTypeMap]
  | [string, keyof IJsTypeMap, keyof IJsTypeMap];
```

- 接入子应用

```html
<template>
  <iframe src="http://localhost:6173/" @load="ev => protocolCtx.onContainerLoaded(createWebChannelPlugin(ev))"></iframe>
</template>

<script setup lang="ts">
  import { createWebChannelPlugin } from 'protocol-bridge';
  import { protocolCtx } from './utils/protocolBridge';

  onMounted(() => {
    // 注册事件，可以在任何地方、任何时机注册
    protocolCtx.on('selectDate', (str, successCallback, errorCallback) => {
      if (Math.random() > 0.5) {
        const res = `${str ?? ''}-${Math.random()}`;
        successCallback(res);
      } else {
        errorCallback(undefined);
      }
    });
  });
</script>
```

### 2.2 H5应用h5-app中

- 使用通信协议上下文

```ts
// ./utils/protocolBridge.ts
import { useProtocolContext } from 'protocol-bridge';

// 与base-app通信事件的类型约束保持一致
type IDemoProtocolEventMap =
  | ['container.height.resize', 'number', 'undefined']
  | ['selectDate', 'string', 'string', 'undefined']
  | ['showLoading', 'undefined', 'undefined']
  | ['user.login', 'string', 'boolean', 'undefined']
  | ['user.logout', 'number', 'undefined', 'undefined']
  | ['user.profile.update', 'undefined', 'string', 'undefined'];

// eslint-disable-next-line react-hooks/rules-of-hooks
export const protocolCtx = useProtocolContext<IDemoProtocolEventMap>();
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
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        protocolCtx.emit('container.height.resize', entry.target.scrollHeight);
      }
    });
    resizeObserver.observe(document.body);
  })
  .catch(() => {
    console.log("连接失败");
  });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- 触发事件

```tsx
import { useState } from 'react';
import { protocolCtx } from './utils/protocolBridge';

export default function IframeChannel() {
  function handleSelectDate() {
    protocolCtx
      .emit('selectDate', '2025-12-1')
      .then(data => {
        console.log('handleSelectDate res data :>> ', data);
      })
      .catch(err => {
        console.log('err :>> ', err);
      });
  }

  return <button onClick={handleSelectDate}>点击给父组件发送selectDate事件</button>;
}
```

至此你完成了在web应用中接入h5应用的所有步骤

### 2.3 在Web应用中进行跨页签通信

- 创建通信Emitter

```ts
// ./src/utils/channelEmitter.ts
import { createChannelEmitter } from 'protocol-bridge';

type IBroadcastChannelEventMap = ['setCount', 'number', 'number', 'undefined'];

export const channelEmitter = createChannelEmitter<IBroadcastChannelEventMap>();
```

- 使用通信Emitter中添加事件监听

```ts
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { channelEmitter } from '../utils/channelEmitter';

const count = ref(0);

onMounted(() => {
  channelEmitter.on('setCount', (data, successCallback) => {
    count.value = data;
    successCallback(data);
  });
});

onUnmounted(() => {
  channelEmitter.off('setCount')
});
</script>
```

- 使用通信Emitter中触发事件监听

```ts
<script setup lang="ts">
import { ref } from 'vue';
import { channelEmitter } from '../utils/channelEmitter';

const count = ref(0);

function onCountClick() {
  channelEmitter
    .emit('setCount', count.value)
    .then(res => {
      count.value = res + 1;
    })
    .catch(err => {
      console.log('🚀 ~ BroadcastChannelChild.vue:20 ~ onCountClick ~ err:', err);
    });
}
</script>
```

## 三、自定义平台通信插件

如果基座应用是在harmony、平板或车机上，可以在接入时传入平台的通信方法插件，来进行通信。

> 例如在Harmony系统下

```ts
// ./utils/arkWebChannelPlugin.ts
import { webview } from '@kit.ArkWeb';

/**
 * 基座（ArkWeb组件）通信插件对象
 */
export interface IChannelPlugin {
  /**
   * 添加container消息通信事件
   * @param listener
   */
  onMessageEvent(listener: (data: string) => void): void;
  /**
   * 向container发送消息
   * @param resMsg
   */
  postMessageEvent(resMsg: string): void;
  /**
   * 基座向Web容器发起注册port端口通信
   * @param initPortMsg
   */
  postContainerMessage(initPortMsg: string): void;
}

/**
 * 针对 ArkWeb 基座，创建消息通信插件
 * @param controller web容器controller
 * @returns 父组件通信插件对象
 */
export function createArkWebChannelPlugin(controller: webview.WebviewController): IChannelPlugin {
  const ports = controller.createWebMessagePorts();
  // port[0]自己用，port[1]给iframe
  const parentPort = ports[0];
  return {
    onMessageEvent(listener) {
      parentPort.onMessageEvent(listener);
    },
    postMessageEvent(resMsg: string) {
      parentPort.postMessageEvent(resMsg);
    },
    postContainerMessage(initPortMsg: string) {
      controller.postMessage(initPortMsg, [ports[1]], '*');
    },
  };
}
```

```extendtypescript
import { createArkWebChannelPlugin } from "../utils/arkWebChannelPlugin";
import { protocolCtx } from '../utils/protocolBridge'; // 跟上面 创建通信协议上下文 一样

@Entry
@Component
struct WebComponent {
  controller: webview.WebviewController = new webview.WebviewController();
  
  build() {
    Column() {
      Web({ src: '', controller: this.controller })
        .javaScriptAccess(true)
        .fileAccess(true)
        .domStorageAccess(true)
        .onPageEnd(() => protocolCtx.onContainerLoaded(createArkWebChannelPlugin(this.controller)))
    }
  }
}
```
