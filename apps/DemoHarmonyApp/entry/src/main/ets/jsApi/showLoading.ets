import { protocolCtx } from '../utils/protocolBridge';

/**
 * 可以在任何地方注册事件，只要在Web组件build之前导入执行过即可
 */
protocolCtx.on('showLoading', (params, successCallback, errorCallback) => {
  console.log('showLoading params :>> ', params);
  if (Math.random() > 0.5) {
    successCallback(undefined)
  } else {
    errorCallback('')
  }
})