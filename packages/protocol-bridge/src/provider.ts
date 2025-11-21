import type { IChannelMsgData, IProtocolEvent } from "./types";

export function createProtocolContext<EventMap extends IProtocolEvent>() {
  type IAction = keyof EventMap

  type IProtocolEventHandle<T extends IAction> = (params: Parameters<EventMap[T]>[0], successCallback: (str?: ReturnType<EventMap[T]>) => void, errorCallback: (str?: string) => void) => void

  const MessageEventMap = new Map<IAction, IProtocolEventHandle<IAction>>()

  return {
    /**
     * 监听窗口加载事件
     * @param payload 
     */
    onContainerLoaded(payload: Event) {
      const contentWindow = (payload.currentTarget as HTMLIFrameElement)?.contentWindow
      if (contentWindow) {
        const channel = new MessageChannel();
        // port1自己用，port2给iframe
        const parentPort = channel.port1

        const initPortMsgId = Date.now() + Math.random();

        // 等待回复
        function handler(event: MessageEvent) {
          if (typeof event.data === 'string') {
            const resObj: IChannelMsgData = JSON.parse(event.data)
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
                messageEvent(resObj.data, (res: any) => {
                  const resMsgData: IChannelMsgData = {
                    ...resObj,
                    type: '__response__',
                    status: 0,
                    data: res
                  }
                  parentPort.postMessage(JSON.stringify(resMsgData))
                }, (err: any) => {
                  const resMsgData: IChannelMsgData = {
                    ...resObj,
                    type: '__response__',
                    status: 1,
                    data: err
                  }
                  parentPort.postMessage(JSON.stringify(resMsgData))
                })
              } else {
                console.log('未注册该事件');
              }
            }
          }
        };
        parentPort.addEventListener('message', handler);
        parentPort.start()

        const initPortMsgReq: IChannelMsgData = {
          id: initPortMsgId,
          type: '__request__',
          action: '__init_port__',
        }
        contentWindow.postMessage(JSON.stringify(initPortMsgReq), '*', [channel.port2])
      }
    },
    /**
     * 注册事件
     */
    on<K extends IAction>(action: K, handle: IProtocolEventHandle<K>) {
      MessageEventMap.set(action, handle)
    },
    /**
     * 取消注册事件
     */
    off(action?: IAction) {
      if (action) {
        if (MessageEventMap.has(action)) {
          MessageEventMap.delete(action)
        }
      } else {
        MessageEventMap.clear()
      }
    }
  }
}
