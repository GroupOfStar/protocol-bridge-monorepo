# protocol_bridge

基座应用与h5应用之间进行postMessage通信

## 使用

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

```ArkTs
import { webview } from '@kit.ArkWeb';
import { BusinessError } from '@kit.BasicServicesKit';
import { onContainerLoaded, registerMessageEvent, unRegisterMessageEvent } from '../utils/channelMessage';
import { createArkWebChannelPlugin } from './../utils/arkWebChannalPlugin'

@Entry
@Component
struct Index {
  controller: webview.WebviewController = new webview.WebviewController();
  uiContext: UIContext = this.getUIContext();

  aboutToAppear(): void {
    // 配置Web开启无线调试模式，指定TCP Socket的端口。
    webview.WebviewController.setWebDebuggingAccess(true);

    registerMessageEvent('showLoading', (params, successCallback, errorCallback) => {
      console.log('showLoading params :>> ', params);
      if (Math.random() > 0.5) {
        successCallback('successfully')
      } else {
        errorCallback('error')
      }
    })

    registerMessageEvent('selectDate', (params, successCallback, errorCallback) => {
      console.log('selectDate params :>> ', params);
      if (Math.random() > 0.5) {
        successCallback('successfully')
      } else {
        errorCallback('error')
      }
    })
  }

  aboutToDisappear(): void {
    unRegisterMessageEvent()
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
        .onPageEnd(() => onContainerLoaded(createArkWebChannelPlugin(this.controller)))
    }
  }
}
```