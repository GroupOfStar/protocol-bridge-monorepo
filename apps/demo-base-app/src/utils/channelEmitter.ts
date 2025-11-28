/**
 * 创建跨浏览器标签页通信emitter
 * @returns
 */
function createChannelEmitter<EventMap extends Record<string, (arg: any) => any>>() {
  type IAction = keyof EventMap;

  interface IChannelData {
    id: number;
    action: IAction;
    type: '__response__' | '__request__';
    status: number;
    data?: any;
  }

  type IProtocolEventHandle<T extends IAction> = (
    params: Parameters<EventMap[T]>[0],
    successCallback: (str: ReturnType<EventMap[T]>) => void,
    errorCallback: (str?: string) => void
  ) => void;

  const channel = new BroadcastChannel('sync-msg');
  const MessageEventMap = new Map<IAction, IProtocolEventHandle<IAction>>();

  function messageListener(ev: MessageEvent) {
    const resObj: IChannelData = ev.data;
    if (resObj && resObj.action && resObj.type === '__request__') {
      const messageEvent = MessageEventMap.get(resObj.action);
      if (messageEvent) {
        messageEvent(
          resObj.data,
          res => {
            const resMsgData: IChannelData = {
              ...resObj,
              type: '__response__',
              status: 0,
              data: res,
            };
            channel.postMessage(resMsgData);
          },
          err => {
            const resMsgData: IChannelData = {
              ...resObj,
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
    on<K extends IAction>(action: K, handle: IProtocolEventHandle<K>) {
      MessageEventMap.set(action, handle);
    },
    /**
     * 触发通信事件
     * @param action
     * @param message
     * @returns
     */
    emit<K extends keyof EventMap>(action: K, data: Parameters<EventMap[K]>[0]) {
      return new Promise<ReturnType<EventMap[K]>>((resolve, reject) => {
        const sendMsgId = Date.now() + Math.random();
        // 等待回复
        const handler = (ev: MessageEvent<IChannelData>) => {
          if (!ev.data) return;
          const { type, id, action, status, data } = ev.data;
          if (type === '__response__' && id === sendMsgId && action === action) {
            if (status === 0) {
              resolve(data);
            } else {
              reject(data);
            }
            channel.removeEventListener('message', handler);
          }
        };
        channel.addEventListener('message', handler);

        const messageData: IChannelData = {
          id: sendMsgId,
          action,
          type: '__request__',
          status: 0,
          data,
        };
        channel.postMessage(messageData);
      });
    },
    /**
     * 取消注册的事件
     */
    off(action?: IAction) {
      if (action) {
        MessageEventMap.delete(action);
      } else {
        channel.removeEventListener('message', messageListener);
        MessageEventMap.clear();
      }
    },
  };
}

type IBroadcastChannelEventMap = {
  setCount: (count: number) => number;
};

export const channelEmitter = createChannelEmitter<IBroadcastChannelEventMap>();
