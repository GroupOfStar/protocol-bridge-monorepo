import { createChannelEmitter } from 'protocol-bridge';

type IBroadcastChannelEventMap = ['setCount', 'number', 'number', 'undefined'];

export const channelEmitter = createChannelEmitter<IBroadcastChannelEventMap>();
