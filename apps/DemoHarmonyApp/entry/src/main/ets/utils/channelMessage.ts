import { webview } from "@kit.ArkWeb"

type IAction = 'showLoading' | 'selectDate'

/**
 * ChannelMessage data
 */
type IChannelMsgData = {
  id: number
  type: '__request__'
  action: '__init_port__' | IAction
  data?: unknown
} | {
  id: number
  type: '__response__'
  action: '__init_port__' | IAction
  /**
   * 0 成功 1 失败
   */
  status: 0 | 1
  data?: unknown
}

type ICallback = (str?: string) => void

type IMessageEventHandle = (params: string | number, successCallback: ICallback, errorCallback: ICallback) => void

const MessageEventMap = new Map<IAction, IMessageEventHandle>()

/**
 * 注册事件
 */
export function registerMessageEvent(action: IAction, handle: IMessageEventHandle) {
  MessageEventMap.set(action, handle)
}

/**
 * 取消注册事件
 */
export function unRegisterMessageEvent(action?: IAction) {
  if (action) {
    MessageEventMap.delete(action)
  } else {
    MessageEventMap.clear()
  }
}

/**
 * iframe onload方法
 * @param payload
 */
export function handleIframeLoad(controller: webview.WebviewController) {
  const ports = controller.createWebMessagePorts()
  // port[0]自己用，port[1]给iframe
  const parentPort = ports[0]

  const initPortMsgId = Date.now() + Math.random();

  // 等待回复
  function handler(result: webview.WebMessage) {
    if (typeof result === 'string') {
      const resObj: IChannelMsgData = JSON.parse(result)
      console.log('handleIframeLoad resObj :>> ', resObj);
      if (resObj.type === "__response__") {
        if (resObj.action === '__init_port__' && resObj.id === initPortMsgId) {
          console.log('连接成功')
        }
      } else if (resObj.type === "__request__") {
        console.log('接收到的resObj :>> ', resObj);
        const action = resObj.action as IAction
        const messageEvent = MessageEventMap.get(action)
        console.log('MessageEventMap.has(action) :>> ', MessageEventMap.has(action));
        if (messageEvent) {
          messageEvent(resObj.data as string, (res: any) => {
            const resMsgData: IChannelMsgData = {
              ...resObj,
              type: '__response__',
              status: 0,
              data: res
            }
            parentPort.postMessageEvent(JSON.stringify(resMsgData))
          }, (err: any) => {
            const resMsgData: IChannelMsgData = {
              ...resObj,
              type: '__response__',
              status: 1,
              data: err
            }
            parentPort.postMessageEvent(JSON.stringify(resMsgData))
          })
        } else {
          console.log('未注册该事件');
        }
      }
    }
  };
  parentPort.onMessageEvent(handler);

  const initPortMsgReq: IChannelMsgData = {
    id: initPortMsgId,
    type: '__request__',
    action: '__init_port__',
  }
  controller.postMessage(JSON.stringify(initPortMsgReq), [ports[1]], '*');
}