import type { IProtocolEvent, IProtocolBridgeData, IEventArgType } from '../types';

/**
 * 使用通信上下文
 * @returns
 */
export function useProtocolContext<EV extends IProtocolEvent>() {
  let h5Port: MessagePort | undefined = undefined;
  return {
    /**
     * 创建通信连接
     * @returns
     */
    createProtocolBridge() {
      return new Promise<void>((resolve, reject) => {
        function handleChannelMessage(ev: MessageEvent<string>) {
          if (typeof ev.data === 'string') {
            const reqObj: IProtocolBridgeData<EV> = JSON.parse(ev.data);
            if (reqObj.type === '__request__' && reqObj.action === '__init_port__') {
              h5Port = ev.ports[0]; // 1. 保存从应用侧发送过来的端口。
              const initPortMsgRes: IProtocolBridgeData<EV> = {
                ...reqObj,
                type: '__response__',
                status: 0,
              };
              h5Port.postMessage(JSON.stringify(initPortMsgRes));
              window.removeEventListener('message', handleChannelMessage);
              resolve();
            } else {
              reject();
            }
          } else {
            reject();
          }
        }
        window.addEventListener('message', handleChannelMessage);
      });
    },
    /**
     * 触发通信事件
     * @param action
     * @param message
     * @returns
     */
    emit<K extends EV[0]>(action: Exclude<K, '*'>, message: IEventArgType<EV, K, 1>) {
      return new Promise<IEventArgType<EV, K, 2>>((resolve, reject) => {
        if (!h5Port) {
          return reject('请先使用 createProtocolBridge 进行初始化！');
        }
        const sendMsgId = Date.now() + Math.random();
        const messageData: IProtocolBridgeData<EV> = {
          id: sendMsgId,
          type: '__request__',
          action,
          data: message,
        };
        // 等待回复
        const handler = (ev: MessageEvent<string>) => {
          if (typeof ev.data === 'string') {
            const resObj: IProtocolBridgeData<EV> = JSON.parse(ev.data);
            const { type, id, action, data } = resObj;
            if (type === '__response__' && id === sendMsgId && action === action) {
              if (resObj.status === 0) {
                resolve(data);
              } else {
                reject(data);
              }
            }
          }
          h5Port?.removeEventListener('message', handler);
        };
        h5Port.addEventListener('message', handler);
        h5Port.start();
        h5Port.postMessage(JSON.stringify(messageData));
      });
    },
  };
}
