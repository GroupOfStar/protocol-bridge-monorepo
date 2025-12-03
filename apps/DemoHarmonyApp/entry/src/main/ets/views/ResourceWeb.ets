import { webview } from '@kit.ArkWeb';
import { BusinessError } from '@kit.BasicServicesKit';
import { createArkWebChannelPlugin } from "@cqx/protocol_bridge";
import { protocolCtx } from '../utils/protocolBridge';
import './../jsApi/index' // 可以在任何地方注册事件，只要在Web build之前导入执行过即可

@ComponentV2
struct ResourceWeb {
  private pathStack: NavPathStack = new NavPathStack()
  controller: webview.WebviewController = new webview.WebviewController();
  uiContext: UIContext = this.getUIContext();

  aboutToAppear(): void {
    console.log("aboutToAppear");
    // 配置Web开启无线调试模式，指定TCP Socket的端口。
    webview.WebviewController.setWebDebuggingAccess(true);

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
    protocolCtx.off("*")
  }

  // 后退点击
  private onBackBtnClick(): boolean {
    if (this.controller.accessBackward()) {
      this.controller.backward()
    } else {
      this.pathStack.pop({})
    }
    return true
  }

  build() {
    NavDestination() {
      Web({ src: '', controller: this.controller })
        .layoutWeight(1)
        .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM])
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
        .zoomAccess(false)
        .overScrollMode(OverScrollMode.NEVER)
        .fileAccess(true)
        .domStorageAccess(true)
        .onPageEnd(() => protocolCtx.onContainerLoaded(createArkWebChannelPlugin(this.controller)))
    }
    .title('加载本地资源Web')
    .onReady((context: NavDestinationContext) => {
      this.pathStack = context.pathStack
    })
    .onBackPressed(() => this.onBackBtnClick())
  }
}

@Builder
export function ResourceWebBuilder(_name: string, params: object) {
  ResourceWeb(params)
}