export enum WsEvent {
  Message = 'message',
  Ping = 'ping',
  Connection = 'connection',
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

export interface Message {
  content: string;
  user?: string;
}

export interface UsernameUpdated {
  old: string;
  new: string;
}

export type Event =
  | ClientMessage
  | ConnectionEvent
  | MessageEvent
  | PingEvent
  | UsernameUpdatedEvent;
