export type IAction = 'showLoading' | 'selectDate'

/**
* ChannelMessage data
*/
export type IChannelMsgData = {
  id: number
  type: '__request__'
  action: '__init_port__' | IAction
  data?: unknown
} | {
  id: number
  type: '__response__'
  action: '__init_port__' | IAction
  /**
   * 0 成功 1 失败
   */
  status: 0 | 1
  data?: unknown
}

type ICallback = (str?: string) => void

export type IMessageEventHandle = (params: any, successCallback: ICallback, errorCallback: ICallback) => void