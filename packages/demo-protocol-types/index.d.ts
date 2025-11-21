
// 1. 在 protocol-types 中定义新事件
export interface DemoEvents {
  'user.login': (payload: string) => boolean
  'user.logout': (payload: number) => void
  'user.profile.update': () => string
}

// 事件映射类型 - 核心!
export type DemoEventsMap = {
  [K in keyof DemoEvents]: {
    payload: DemoEvents[K];
    response?: any; // 可选的响应类型
  };
};

export type EventType = keyof DemoEventsMap;