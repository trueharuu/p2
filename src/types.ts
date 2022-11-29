export enum WsEvent {
  Message = 'message',
  Ping = 'ping',
  Connection = 'connection',
  UsernameUpdated = 'usernameUpdated',
}

export interface BaseEvent<E extends WsEvent, T> {
  event: E;
  data: T;
}

export type MessageEvent = BaseEvent<WsEvent.Message, Message>;
export type PingEvent = BaseEvent<WsEvent.Ping, never>;
export type ConnectionEvent = BaseEvent<WsEvent.Connection, never>;
export type UsernameUpdatedEvent = BaseEvent<
  WsEvent.UsernameUpdated,
  UsernameUpdated
>;

export interface Message {
  content: string;
  user: string;
}

export interface UsernameUpdated {
  old: string;
  new: string;
}

export type Event = MessageEvent | PingEvent;
