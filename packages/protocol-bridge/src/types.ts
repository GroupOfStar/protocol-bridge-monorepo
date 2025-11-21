
export type IProtocolEvent = Record<string, (arg: any) => any>

/**
* ChannelMessage data
*/
export type IChannelMsgData<T = string, R = unknown> = {
  id: number
  type: '__request__'
  action: T
  data?: R
} | {
  id: number
  type: '__response__'
  action: T
  /**
   * 0 成功 1 失败
   */
  status: 0 | 1
  data?: R
}
