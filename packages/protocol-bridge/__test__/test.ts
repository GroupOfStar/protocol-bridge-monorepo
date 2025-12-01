import { createProtocolContext, useProtocolContext, createChannelEmitter } from '../src';

type IDemoProtocolEventMap =
  | ['container.height.resize', 'number', 'undefined']
  | ['selectDate', 'string', 'string', 'undefined']
  | ['showLoading', 'undefined', 'undefined']
  | ['user.login', 'string', 'boolean', 'undefined']
  | ['user.logout', 'number', 'undefined', 'undefined']
  | ['user.profile.update', 'undefined', 'string', 'undefined'];

const ctx = createProtocolContext<IDemoProtocolEventMap>();

ctx.on('user.login', (arg, successCallback, errorCallback) => {
  console.log('arg :>> ', arg);
  if (Math.random() > 0.5) {
    successCallback(true);
  } else {
    errorCallback(undefined);
  }
});

ctx.on('user.logout', (arg, successCallback, errorCallback) => {
  console.log('arg :>> ', arg);
  if (Math.random() > 0.5) {
    successCallback(undefined);
  } else {
    errorCallback(undefined);
  }
});

const ctx2 = useProtocolContext<IDemoProtocolEventMap>();

ctx2.emit('user.login', 'text').then(res => {
  console.log('res :>> ', res);
});

ctx2.emit('user.logout', 3).then(res => {
  console.log('res :>> ', res);
});

ctx2
  .emit('user.profile.update', undefined)
  .then(res => {
    console.log('res :>> ', res);
  })
  .catch(err => {
    console.log('err :>> ', err);
  });

type IBroadcastChannelEventMap = ['setCount', 'number', 'number', 'undefined'];

const channelEmitter = createChannelEmitter<IBroadcastChannelEventMap>();

channelEmitter.on('setCount', (data, successCallback, errorCallback) => {
  console.log('data :>> ', data);
  if (Math.random() > 0.5) {
    successCallback(99);
  } else {
    errorCallback(undefined);
  }
});

channelEmitter
  .emit('setCount', 5)
  .then(res => {
    console.log('res :>> ', res);
  })
  .catch(err => {
    console.log('err :>> ', err);
  });
