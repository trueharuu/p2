import type { WebSocketServer } from 'ws';
import type { BaseEvent, WsEvent } from './types';

export function send(
  ws: WebSocketServer,
  v: BaseEvent<WsEvent, unknown> | string
): void {
  if (typeof v === 'object') {
    v = JSON.stringify(v);
  }

  ws.clients.forEach((x) => x.send(v));
}
