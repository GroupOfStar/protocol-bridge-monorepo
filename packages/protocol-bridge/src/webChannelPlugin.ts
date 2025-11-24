import type { IChannelPlugin } from "./types";

/**
 * 针对 web 基座，创建消息通信插件
 * @param event iframe容器event
 * @returns 父组件通信插件对象
 */
export function createWebChannelPlugin(event: Event): IChannelPlugin {
  const contentWindow = (event.currentTarget as HTMLIFrameElement)?.contentWindow
  const channel = new MessageChannel();
  // port1自己用，port2给iframe
  const parentPort = channel.port1
  return {
    onMessageEvent(listener) {
      parentPort.addEventListener('message', (event: MessageEvent) => listener(event.data));
      parentPort.start()
    },
    postMessageEvent(resMsg: string) {
      parentPort.postMessage(JSON.stringify(resMsg))
    },
    containerPostMessage(initPortMsg: string) {
      contentWindow?.postMessage(initPortMsg, '*', [channel.port2])
    }
  }
}