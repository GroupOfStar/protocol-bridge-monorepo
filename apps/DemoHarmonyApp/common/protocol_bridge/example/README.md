
## How to use

- 创建协议上下文

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

- 接入子应用

```ArkTs
import { webview } from '@kit.ArkWeb';
import { BusinessError } from '@kit.BasicServicesKit';
import { createArkWebChannelPlugin } from 'protocol-bridge'
import { protocolCtx } from '../utils/protocolBridge';

@Entry
@Component
struct Index {
  controller: webview.WebviewController = new webview.WebviewController();
  uiContext: UIContext = this.getUIContext();

  aboutToAppear(): void {
    // 配置Web开启无线调试模式，指定TCP Socket的端口。
    webview.WebviewController.setWebDebuggingAccess(true);

    // 注册事件
    protocolCtx.on('showLoading', (params, successCallback, errorCallback) => {
      console.log('showLoading params :>> ', params);
      if (Math.random() > 0.5) {
        successCallback('successfully')
      } else {
        errorCallback('error')
      }
    })

    // 注册事件
    protocolCtx.on('selectDate', (params, successCallback, errorCallback) => {
      console.log('selectDate params :>> ', params);
      if (Math.random() > 0.5) {
        successCallback('successfully')
      } else {
        errorCallback('error')
      }
    })
  }

  aboutToDisappear(): void {
    protocolCtx.off()
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