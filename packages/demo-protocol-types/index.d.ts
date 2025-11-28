
export declare type IDemoProtocolEventMap = {
  /**
   * 获取h5的页面高度
   * @param payload h5加载完后body的scrollHeight
   * @returns 
   */
  resize: (payload: number) => void
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
