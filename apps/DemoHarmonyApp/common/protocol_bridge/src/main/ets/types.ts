/**
 * js类型映射
 */
export type IJsTypeMap = {
  string: string;
  boolean: boolean;
  number: number;
  object: object;
  undefined: undefined;
};

/**
 * 注册的通信事件类型约束
 */
export type IProtocolEvent =
  | [string, keyof IJsTypeMap, keyof IJsTypeMap, keyof IJsTypeMap]
    | [string, keyof IJsTypeMap, keyof IJsTypeMap];

/**
 * 工具类型：从事件定义中提取第N个位置的类型
 */
export type IEventArgType<T extends IProtocolEvent, K extends T[0], N extends number> = IJsTypeMap[Extract<
T,
[K, ...any]
>[N]];

/**
 * map中存放的通信事件类型
 */
export type IProtocolEventHandle<EV extends IProtocolEvent, K extends EV[0]> = (
  data: IEventArgType<EV, K, 1>,
  successCallback: (arg: IEventArgType<EV, K, 2>) => void,
  errorCallback: (arg: IEventArgType<EV, K, 3>) => void
) => void;

/**
 * 内部ProtocolBridge数据协议
 */
export type IProtocolBridgeData<T extends IProtocolEvent> =
  | {
    id: number;
    type: '__request__';
    action: T[0];
    data: IEventArgType<T, T[0], 1>;
  }
    | {
    id: number;
    type: '__response__';
    action: T[0];
    /**
     * 0 成功 1 失败
     */
    status: 0 | 1;
    data: IEventArgType<T, T[0], 1>;
  };

/**
 * 基座（ArkWeb组件）通信插件对象
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
   * 基座向Web容器发起注册port端口通信
   * @param initPortMsg
   */
  postContainerMessage(initPortMsg: string): void;
}
