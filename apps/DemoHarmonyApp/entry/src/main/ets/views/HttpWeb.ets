import { webview } from '@kit.ArkWeb';
import { createArkWebChannelPlugin } from "@cqx/protocol_bridge";
import { protocolCtx } from '../utils/protocolBridge';

@ComponentV2
struct HttpWeb {
  private pathStack: NavPathStack = new NavPathStack()
  controller: webview.WebviewController = new webview.WebviewController();
  uiContext: UIContext = this.getUIContext();

  aboutToAppear(): void {
    // 配置Web开启无线调试模式，指定TCP Socket的端口。
    webview.WebviewController.setWebDebuggingAccess(true);

    protocolCtx.on('showLoading', (params, successCallback, errorCallback) => {
      console.log('showLoading params :>> ', params);
      if (Math.random() > 0.5) {
        successCallback(undefined)
      } else {
        errorCallback('')
      }
    })

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
    protocolCtx.off("*")
  }

  // 后退点击
  private onBackBtnClick(): boolean {
    if (this.controller.accessBackward()) {
      this.controller.backward()
      return true
    } else {
      this.pathStack.pop({})
      return true
    }
  }

  build() {
    NavDestination() {
      Web({ src: 'http://192.168.137.1:6173/', controller: this.controller })
        .layoutWeight(1)
        .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM])
        .javaScriptAccess(true)
        .zoomAccess(false)
        .overScrollMode(OverScrollMode.NEVER)
        .fileAccess(true)
        .domStorageAccess(true)
        .verticalScrollBarAccess(false)
        .onPageEnd(() => protocolCtx.onContainerLoaded(createArkWebChannelPlugin(this.controller)))
    }
    .title({ main: '加载在线Web', sub: 'http://192.168.137.1:6173/' })
    .onReady((context: NavDestinationContext) => {
      this.pathStack = context.pathStack
    })
    .onBackPressed(() => this.onBackBtnClick())
  }
}

@Builder
export function HttpWebBuilder(_name: string, params: object) {
  HttpWeb(params)
}