
export declare type IDemoProtocolEventMap = {
  selectDate: (payload: string) => string
  showLoading: () => void
  /**
   * 用户登录
   * @param payload 入参
   * @returns 登录是否成功
   */
  'user.login': (payload: string) => boolean
  'user.logout': (payload: number) => void
  'user.profile.update': () => string
}
