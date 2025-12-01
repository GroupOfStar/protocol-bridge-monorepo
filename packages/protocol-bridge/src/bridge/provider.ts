import type { IProtocolBridgeData, IChannelPlugin, IProtocolEvent, IProtocolEventHandle } from '../types';

/**
 * 创建通信上下文
 * @returns
 */
export function createProtocolContext<EV extends IProtocolEvent>() {
  const MessageEventMap = new Map<EV[0], IProtocolEventHandle<EV, EV[0]>>();

  return {
    /**
     * 监听窗口加载事件
     * @param payload
     */
    onContainerLoaded(channelPlugin: IChannelPlugin) {
      const initPortMsgId = Date.now() + Math.random();
      type IInitPort = ['__init_port__', 'undefined', 'undefined', 'undefined'];
      // 等待回复
      function handler(data: string) {
        if (typeof data === 'string') {
          const resObj: IProtocolBridgeData<EV> = JSON.parse(data);
          if (resObj.type === '__response__') {
            if (resObj.action === '__init_port__' && resObj.id === initPortMsgId) {
              console.log('连接成功');
            }
          } else if (resObj.type === '__request__') {
            const action = resObj.action;
            const messageEvent = MessageEventMap.get(action);
            if (messageEvent) {
              messageEvent(
                resObj.data,
                res => {
                  const resMsgData: IProtocolBridgeData<EV> = {
                    ...resObj,
                    type: '__response__',
                    status: 0,
                    data: res,
                  };
                  channelPlugin.postMessageEvent(JSON.stringify(resMsgData));
                },
                err => {
                  const resMsgData: IProtocolBridgeData<EV> = {
                    ...resObj,
                    type: '__response__',
                    status: 1,
                    data: err,
                  };
                  channelPlugin.postMessageEvent(JSON.stringify(resMsgData));
                }
              );
            } else {
              console.log('未注册该事件');
            }
          }
        }
      }
      channelPlugin.onMessageEvent(handler);

      const initPortMsgReq: IProtocolBridgeData<IInitPort> = {
        id: initPortMsgId,
        type: '__request__',
        action: '__init_port__',
        data: undefined,
      };
      channelPlugin.postContainerMessage(JSON.stringify(initPortMsgReq));
    },
    /**
     * 注册事件
     */
    on<K extends EV[0]>(action: Exclude<K, '*'>, handle: IProtocolEventHandle<EV, K>) {
      MessageEventMap.set(action, handle);
    },
    /**
     * 取消注册的事件
     */
    off(action: EV[0] | '*') {
      if (action) {
        if (action === '*') {
          MessageEventMap.clear();
        } else if (MessageEventMap.has(action)) {
          MessageEventMap.delete(action);
        }
      }
    },
  };
}
