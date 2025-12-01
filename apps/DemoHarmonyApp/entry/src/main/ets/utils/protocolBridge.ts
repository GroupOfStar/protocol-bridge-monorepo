import { createProtocolContext } from "@cqx/protocol_bridge";

type IDemoProtocolEventMap =
  | ['selectDate', 'string', 'string', 'undefined']
  | ['showLoading', 'undefined', 'undefined']
  | ['user.login', 'string', 'boolean', 'undefined']
  | ['user.logout', 'number', 'undefined', 'undefined']
  | ['user.profile.update', 'undefined', 'string', 'undefined'];

export const protocolCtx = createProtocolContext<IDemoProtocolEventMap>()