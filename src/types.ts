import type { WebSocket } from 'ws';

export enum WsEvent {
  Message = 'message',
  Ping = 'ping',
  Connection = 'connection',
  Disconnect = 'disconnect',
  UsernameUpdate = 'usernameUpdate',
  ClientMessage = 'clientMessage',
}

export interface BaseEvent<E extends WsEvent, T> {
  event: E;
  data: T;
  from: number;
}

export type MessageEvent = BaseEvent<WsEvent.Message, Message>;
export type PingEvent = BaseEvent<WsEvent.Ping, never>;
export type ConnectionEvent = BaseEvent<WsEvent.Connection, never>;
export type UsernameUpdatedEvent = BaseEvent<
  WsEvent.UsernameUpdate,
  UsernameUpdated
>;
export type ClientMessage = BaseEvent<WsEvent.ClientMessage, string>;
export type DisconnectEvent = BaseEvent<WsEvent.Disconnect, string>;

export interface Message {
  content: string;
  user?: string;
}

export interface UsernameUpdated {
  old: string;
  new: string;
}

export interface Disconnect {
  id: number;
  username: string;
}

export type Event =
  ClientMessage | ConnectionEvent | DisconnectEvent | MessageEvent | PingEvent | UsernameUpdatedEvent;

export interface Sock extends WebSocket {
  id: number;
  username: string;
}
