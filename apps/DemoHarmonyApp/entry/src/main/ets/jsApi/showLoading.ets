import { protocolCtx } from '../utils/protocolBridge';

/**
 * 可以在任何地方注册事件
 */
protocolCtx.on('selectDate', (params, successCallback, errorCallback) => {
  console.log('selectDate params :>> ', params);
  if (Math.random() > 0.5) {
    successCallback('successfully')
  } else {
    errorCallback(undefined)
  }
})