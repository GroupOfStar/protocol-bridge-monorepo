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
    try {
      // 配置Web开启无线调试模式，指定TCP Socket的端口。
      webview.WebviewController.setWebDebuggingAccess(true);
    } catch (error) {
      console.error(`ErrorCode: ${(error as BusinessError).code},  Message: ${(error as BusinessError).message}`);
    }

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