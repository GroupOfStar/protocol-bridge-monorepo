import { createProtocolContext } from "@cqx/protocol_bridge";

type IDemoProtocolEventMap = {
  selectDate: (payload: string) => string
  showLoading: () => void
  'user.login': (payload: string) => boolean
  'user.logout': (payload: number) => void
  'user.profile.update': () => string
}

export const protocolCtx = createProtocolContext<IDemoProtocolEventMap>()