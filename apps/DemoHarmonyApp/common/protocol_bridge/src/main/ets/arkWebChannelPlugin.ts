import { webview } from "@kit.ArkWeb"
import { IChannelPlugin } from "./types";

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
    containerPostMessage(initPortMsg: string) {
      controller.postMessage(initPortMsg, [ports[1]], '*');
    }
  }
}