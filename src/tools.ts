import type { WebSocketServer } from 'ws';
import type { BaseEvent, WsEvent } from './types';

export function send<E extends WsEvent, T>(
  ws: WebSocketServer,
  v: BaseEvent<E, T> | string
): void {
  if (typeof v === 'object') {
    v = JSON.stringify(v);
  }

  ws.clients.forEach((x) => x.send(v));
}
