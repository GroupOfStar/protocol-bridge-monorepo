import { createProtocolContext } from '../src/provider';
import { useProtocolContext } from '../src/consumer';

declare type IDemoProtocolEventMap = {
  /**
   * 获取h5的页面高度
   * @param payload h5加载完后body的scrollHeight
   * @returns
   */
  resize: (payload: number) => void;
  selectDate: (payload: string) => string;
  showLoading: () => void;
  /**
   * 用户登录
   * @param payload 入参
   * @returns 登录是否成功
   */
  'user.login': (payload: string) => boolean;
  'user.logout': (payload: number) => void;
  'user.profile.update': () => string;
};

const ctx = createProtocolContext<IDemoProtocolEventMap>();

ctx.on('user.login', (arg, successCallback, errorCallback) => {
  console.log('arg :>> ', arg);
  if (Math.random() > 0.5) {
    successCallback(true);
  } else {
    errorCallback();
  }
});

ctx.on('user.logout', (arg, successCallback, errorCallback) => {
  console.log('arg :>> ', arg);
  if (Math.random() > 0.5) {
    successCallback();
  } else {
    errorCallback();
  }
});

const ctx2 = useProtocolContext<IDemoProtocolEventMap>();

ctx2.emit('user.login', 'text').then(res => {
  console.log('res :>> ', res);
});

ctx2.emit('user.logout', 3).then(res => {
  console.log('res :>> ', res);
});

ctx2.emit('user.profile.update', undefined).then(res => {
  console.log('res :>> ', res);
});

type JSTypeMap = {
  string: string;
  boolean: boolean;
  number: number;
  undefined: undefined;
};

export type IEventMap = [string, keyof JSTypeMap, keyof JSTypeMap, keyof JSTypeMap];

// 工具类型：从事件定义中提取第N个位置的类型
type EventArgType<T extends IEventMap, K extends T[0], N extends number> = JSTypeMap[Extract<T, [K, ...any]>[N]];

export function test<T extends IEventMap>() {
  return {
    on<K extends T[0]>(
      action: K,
      handle: (
        data: EventArgType<T, K, 1>,
        successCallback: (arg: EventArgType<T, K, 2>) => void,
        errorCallback: (arg: EventArgType<T, K, 3>) => void
      ) => void
    ) {},
  };
}

type ITestEventMap =
  | ['aa', 'boolean', 'number', 'undefined']
  | ['bb', 'string', 'undefined', 'boolean']
  | ['bb2', 'string', 'undefined', 'boolean']
  | ['bb3', 'string', 'undefined', 'boolean']
  | ['bb4', 'string', 'undefined', 'boolean']
  | ['bb5', 'string', 'undefined', 'boolean']
  | ['bb6', 'string', 'undefined', 'boolean'];

// 测试 - 现在类型推断完全正确
test<ITestEventMap>().on('aa', (data, successCallback, errorCallback) => {
  // data: boolean ✓
  // successCallback: (arg: number) => void ✓
  // errorCallback: (arg: undefined) => void ✓
  console.log('data :>> ', data);
  successCallback(0); // 只能传number ✓
});

test<ITestEventMap>().on('bb', (data, successCallback, errorCallback) => {
  // data: string ✓
  // successCallback: (arg: undefined) => void ✓
  // errorCallback: (arg: boolean) => void ✓
  successCallback(undefined); // 只能传undefined ✓
  errorCallback(true); // 只能传boolean ✓
});
