/**
 * 注册的通信事件类型约束
 */
export type IProtocolEvent = Record<string, (arg: any) => any>;

/**
 * 内部ProtocolBridge数据协议
 */
export type IProtocolBridgeData<T = string, R = unknown> =
  | {
      id: number;
      type: '__request__';
      action: T;
      data?: R;
    }
  | {
      id: number;
      type: '__response__';
      action: T;
      /**
       * 0 成功 1 失败
       */
      status: 0 | 1;
      data?: R;
    };

/**
 * 基座通信插件对象
 */
export interface IChannelPlugin {
  /**
   * 添加container消息通信事件
   * @param listener
   */
  onMessageEvent(listener: (data: string) => void): void;
  /**
   * 向container发送消息
   * @param resMsg
   */
  postMessageEvent(resMsg: string): void;
  /**
   * 基座向iframe容器发起注册port端口通信
   * @param initPortMsg
   */
  postContainerMessage(initPortMsg: string): void;
}
