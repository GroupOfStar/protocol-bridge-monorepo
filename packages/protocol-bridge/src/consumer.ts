import type { IProtocolEvent, IProtocolBridgeData } from "./types";

/**
 * 使用通信上下文
 * @returns 
 */
export function useProtocolContext<EventMap extends IProtocolEvent>() {
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
            const reqObj: IProtocolBridgeData = JSON.parse(ev.data)
            if (reqObj.type === "__request__" && reqObj.action === '__init_port__') {
              h5Port = ev.ports[0]; // 1. 保存从应用侧发送过来的端口。
              const initPortMsgRes: IProtocolBridgeData = {
                ...reqObj,
                type: '__response__',
                status: 0
              }
              h5Port.postMessage(JSON.stringify(initPortMsgRes))
              window.removeEventListener('message', handleChannelMessage)
              resolve()
            } else {
              reject()
            }
          } else {
            reject()
          }
        }
        window.addEventListener('message', handleChannelMessage)
      })
    },
    /**
     * 触发通信事件
     * @param action 
     * @param message 
     * @returns 
     */
    emit<K extends keyof EventMap>(action: K, message?: string | number | object) {
      type IReturn = ReturnType<EventMap[K]>
      return new Promise<IReturn>((resolve, reject) => {
        if (!h5Port) {
          return reject('请先使用 createProtocolBridge 进行初始化！')
        }
        const sendMsgId = Date.now() + Math.random();
        const messageData: IProtocolBridgeData<K> = {
          id: sendMsgId,
          type: '__request__',
          action,
          data: message
        };
        // 等待回复
        const handler = (ev: MessageEvent<string>) => {
          if (typeof ev.data === 'string') {
            const resObj: IProtocolBridgeData<K, IReturn> = JSON.parse(ev.data)
            if (resObj.type !== "__response__") return reject()
            if (resObj.action === action) {
              if (resObj.id === sendMsgId) {
                if (resObj.status === 0) {
                  resolve(resObj.data!);
                } else {
                  reject(resObj.data);
                }
              } else {
                reject('出现了接受到的消息与发送到的消息id不一致情况~')
              }
            } else {
              reject('方法不存在，或不一致')
            }
          }
          h5Port?.removeEventListener('message', handler);
        };
        h5Port.addEventListener('message', handler);
        h5Port.start()
        h5Port.postMessage(JSON.stringify(messageData));
      });
    }
  }
}
