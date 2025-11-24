import { webview } from "@kit.ArkWeb"

interface IChannelPlugin {
  onMessageEvent(listener: (data: string) => void): void

  postMessageEvent(resMsg: string): void

  containerPostMessage(initPortMsg: string): void
}

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