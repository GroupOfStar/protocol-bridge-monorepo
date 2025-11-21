import { useProtocolContext } from "protocol-bridge";
import type { IDemoProtocolEventMap } from 'demo-protocol-event'

// eslint-disable-next-line react-hooks/rules-of-hooks
export const protocolCtx = useProtocolContext<IDemoProtocolEventMap>()