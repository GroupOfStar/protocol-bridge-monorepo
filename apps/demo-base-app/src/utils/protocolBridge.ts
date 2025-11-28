import { createProtocolContext } from "protocol-bridge";
import type { IDemoProtocolEventMap } from 'demo-protocol-event'

export const protocolCtx = createProtocolContext<IDemoProtocolEventMap>()