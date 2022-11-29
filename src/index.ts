import { static as s } from 'express';
import { app, ws } from './globals';
import { send } from './tools';
import type { Event } from './types';
import { WsEvent } from './types';

app.use(s('client'));

app.listen(4000);

// for now this just acts as a proxy between clients, clients handle all the events
ws.on('connection', (socket, request) => {
  send(ws, {
    event: WsEvent.Connection,
    data: { ip: request.connection.remoteAddress },
  });
  socket.on('message', (data) => {
    const json: Event = JSON.parse(data.toString());

    // just send it back to client(s)
    send(ws, json);
  });
});

process.on('uncaughtException', console.error);
