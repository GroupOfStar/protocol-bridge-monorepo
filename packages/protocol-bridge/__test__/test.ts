import { createProtocolContext } from "../src/provider"
import { useProtocolContext } from "../src/consumer"
import type { IDemoProtocolEventMap } from 'demo-protocol-event'

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

ctx2.emit('user.login').then(res => {
  console.log('res :>> ', res);
})

ctx2.emit('user.profile.update').then(res => {
  console.log('res :>> ', res);
})