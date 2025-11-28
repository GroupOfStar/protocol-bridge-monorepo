import { createProtocolContext } from "../src/provider"
import { useProtocolContext } from "../src/consumer"

declare type IDemoProtocolEventMap = {
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

const ctx = createProtocolContext<IDemoProtocolEventMap>()

ctx.on('user.login', (arg, successCallback, errorCallback) => {
  console.log('arg :>> ', arg);
  if (Math.random() > 0.5) {
    successCallback(true)
  } else {
    errorCallback()
  }
})

ctx.on('user.logout', (arg, successCallback, errorCallback) => {
  console.log('arg :>> ', arg);
  if (Math.random() > 0.5) {
    successCallback()
  } else {
    errorCallback()
  }
})

const ctx2 = useProtocolContext<IDemoProtocolEventMap>()

ctx2.emit('user.login', 'text').then(res => {
  console.log('res :>> ', res);
})

ctx2.emit('user.logout', 3).then(res => {
  console.log('res :>> ', res);
})

ctx2.emit('user.profile.update', undefined).then(res => {
  console.log('res :>> ', res);
})