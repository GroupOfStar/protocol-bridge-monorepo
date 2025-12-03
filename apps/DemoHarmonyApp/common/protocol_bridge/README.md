# protocol_bridge

ArkWeb通信协议，提供类型安全的postMessage解决方案，解耦鸿蒙原生与H5应用间的交互，可随时随地注册事件。

## Installation

```bash
ohpm install @cqx/protocol_bridge
```

## How to use

- 创建通信协议上下文

```ts
// ./utils/protocolBridge.ts
import { createProtocolContext } from '@cqx/protocol-bridge';

/**
 * 通信事件类型定义
 * 第一个参数表示事件名, 第二个参数表示触发事件时的传参, 第三个参数表示监听到事件后成功情况下返回的参数, 第四个参数为可选的表示失败情况下返回的参数
 */
type IDemoProtocolEventMap =
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

```extendtypescript
// src/main/ets/jsApi/showLoading.ets
import { protocolCtx } from '../utils/protocolBridge';

/**
 * 可以在任何地方注册事件，只要在Web组件build之前导入执行过即可
 */
protocolCtx.on('showLoading', (params, successCallback, errorCallback) => {
  console.log('showLoading params :>> ', params);
  if (Math.random() > 0.5) {
    successCallback(undefined)
  } else {
    errorCallback('')
  }
})
```

```extendtypescript
import { webview } from '@kit.ArkWeb';
import { BusinessError } from '@kit.BasicServicesKit';
import { createArkWebChannelPlugin } from "@cqx/protocol_bridge";
import { protocolCtx } from '../utils/protocolBridge';
import './../jsApi/showLoading' // 可以在任何地方注册事件，只要在Web组件build之前导入执行过即可

@Entry
@Component
struct Index {
  controller: webview.WebviewController = new webview.WebviewController();
  uiContext: UIContext = this.getUIContext();

  aboutToAppear(): void {
    // 也可以在此处注册事件
    protocolCtx.on('selectDate', (params, successCallback, errorCallback) => {
      console.log('selectDate params :>> ', params);
      if (Math.random() > 0.5) {
        successCallback('successfully')
      } else {
        errorCallback(undefined)
      }
    })
  }

  aboutToDisappear(): void {
    // 卸载所有事件
    protocolCtx.off("*") // 卸载某一个事件protocolCtx.off('selectDate')
  }

  build() {
    Column() {
      Web({ src: '', controller: this.controller })
        .layoutWeight(1)
        .onControllerAttached(() => {
          try {
            // 设置允许可以跨域访问的路径列表
            this.controller.setPathAllowingUniversalAccess([
              this.uiContext.getHostContext()!.resourceDir
            ])
            this.controller.loadUrl("file://" + this.uiContext.getHostContext()!.resourceDir + "/dist/index.html")
          } catch (error) {
            console.error(`ErrorCode: ${(error as BusinessError).code}, Message: ${(error as BusinessError).message}`);
          }
        })
        .javaScriptAccess(true)
        .fileAccess(true)
        .domStorageAccess(true)
        .onPageEnd(() => protocolCtx.onContainerLoaded(createArkWebChannelPlugin(this.controller)))
    }
  }
}
```

## More information

对应H5子应用使用的协议见: [protocol-bridge](https://www.npmjs.com/package/protocol-bridge)