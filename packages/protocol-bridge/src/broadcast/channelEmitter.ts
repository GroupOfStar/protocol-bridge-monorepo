import type { IEventArgType, IProtocolBridgeData, IProtocolEvent, IProtocolEventHandle } from './../types';

/**
 * 创建跨浏览器标签页通信emitter
 * @returns
 */
export function createChannelEmitter<EV extends IProtocolEvent>() {
  const channel = new BroadcastChannel('sync-msg');
  const MessageEventMap = new Map<EV[0], IProtocolEventHandle<EV, EV[0]>>();

  function messageListener(ev: MessageEvent<IProtocolBridgeData<EV>>) {
    if (!ev.data) return;
    const { type, action, data } = ev.data;
    if (action && type === '__request__') {
      const messageEvent = MessageEventMap.get(action);
      if (messageEvent) {
        messageEvent(
          data,
          res => {
            const resMsgData: IProtocolBridgeData<EV> = {
              ...ev.data,
              type: '__response__',
              status: 0,
              data: res,
            };
            channel.postMessage(resMsgData);
          },
          err => {
            const resMsgData: IProtocolBridgeData<EV> = {
              ...ev.data,
              type: '__response__',
              status: 1,
              data: err,
            };
            channel.postMessage(resMsgData);
          }
        );
      } else {
        console.log('未注册该事件');
      }
    }
  }

  channel.addEventListener('message', messageListener);

  return {
    /**
     * 注册事件
     */
    on<K extends EV[0]>(action: Exclude<K, '*'>, handle: IProtocolEventHandle<EV, K>) {
      MessageEventMap.set(action, handle);
    },
    /**
     * 触发通信事件
     * @param action
     * @param message
     * @returns
     */
    emit<K extends EV[0]>(action: Exclude<K, '*'>, message: IEventArgType<EV, K, 1>) {
      return new Promise<IEventArgType<EV, K, 2>>((resolve, reject) => {
        const sendMsgId = Date.now() + Math.random();
        // 等待回复
        const handler = (ev: MessageEvent<IProtocolBridgeData<EV>>) => {
          if (!ev.data) return;
          const { type, id, action, data } = ev.data;
          if (type === '__response__' && id === sendMsgId && action === action) {
            if (ev.data.status === 0) {
              resolve(data);
            } else {
              reject(data);
            }
            channel.removeEventListener('message', handler);
          }
        };
        channel.addEventListener('message', handler);

        const messageData: IProtocolBridgeData<EV> = {
          id: sendMsgId,
          action,
          type: '__request__',
          data: message,
        };
        channel.postMessage(messageData);
      });
    },
    /**
     * 取消注册的事件
     */
    off(action: EV[0] | '*') {
      if (action) {
        MessageEventMap.delete(action);
      } else {
        channel.removeEventListener('message', messageListener);
        MessageEventMap.clear();
      }
    },
  };
}
