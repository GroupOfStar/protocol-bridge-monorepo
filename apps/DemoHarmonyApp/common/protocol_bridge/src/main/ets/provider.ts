import type { IProtocolBridgeData, IChannelPlugin, IProtocolEvent } from "./types";

/**
 * 创建通信上下文
 * @returns 
 */
export function createProtocolContext<EventMap extends IProtocolEvent>() {
  type IAction = keyof EventMap

  type IProtocolEventHandle<T extends IAction> = (params: Parameters<EventMap[T]>[0], successCallback: (str?: ReturnType<EventMap[T]>) => void, errorCallback: (str?: string) => void) => void

  const MessageEventMap = new Map<IAction, IProtocolEventHandle<IAction>>()

  return {
    /**
     * 监听窗口加载事件
     * @param payload 
     */
    onContainerLoaded(channelPlugin: IChannelPlugin) {
      const initPortMsgId = Date.now() + Math.random();
      // 等待回复
      function handler(data: string) {
        if (typeof data === 'string') {
          const resObj: IProtocolBridgeData = JSON.parse(data)
          if (resObj.type === "__response__") {
            if (resObj.action === '__init_port__' && resObj.id === initPortMsgId) {
              console.log('连接成功')
            }
          } else if (resObj.type === "__request__") {
            const action = resObj.action as IAction
            const messageEvent = MessageEventMap.get(action)
            if (messageEvent) {
              messageEvent(resObj.data as string, (res: any) => {
                const resMsgData: IProtocolBridgeData = {
                  ...resObj,
                  type: '__response__',
                  status: 0,
                  data: res
                }
                channelPlugin.postMessageEvent(JSON.stringify(resMsgData))
              }, (err: any) => {
                const resMsgData: IProtocolBridgeData = {
                  ...resObj,
                  type: '__response__',
                  status: 1,
                  data: err
                }
                channelPlugin.postMessageEvent(JSON.stringify(resMsgData))
              })
            } else {
              console.log('未注册该事件');
            }
          }
        }
      };
      channelPlugin.onMessageEvent(handler)

      const initPortMsgReq: IProtocolBridgeData = {
        id: initPortMsgId,
        type: '__request__',
        action: '__init_port__',
      }
      channelPlugin.postContainerMessage(JSON.stringify(initPortMsgReq))
    },
    /**
     * 注册事件
     */
    on<K extends IAction>(action: K, handle: IProtocolEventHandle<K>) {
      MessageEventMap.set(action, handle)
    },
    /**
     * 取消注册的事件
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
