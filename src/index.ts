import { static as s } from 'express';
import { app, ws } from './globals';
import { send } from './tools';
import type { Event } from './types';
import { WsEvent } from './types';

app.use(s('client'));

app.listen(4000);

// for now this just acts as a proxy between clients, clients handle all the events
ws.on('connection', (socket) => {
  socket.on('message', (data) => {
    const json: Event = JSON.parse(data.toString());
    console.log(json);

    if (json.event === WsEvent.Message) {
      // commands!
      if (json.data.content.startsWith('/')) {
        const ids = json.data.content.slice(1).split(' ');

        const name = ids[0];

        if (name === 'name' || name === 'login') {
          if (ids.length === 1 && name !== 'login') {
            // send it back individually! this is a client message

            socket.send(
              JSON.stringify({
                event: WsEvent.ClientMessage,
                data: `/${name} :: ${
                  json.data.user
                    ? `Your current name is "${json.data.user}"`
                    : 'You do not have a name set.'
                }`,
                from: json.from,
              })
            );

            return;
          } else {
            const n = ids.slice(1).join(' ');
            socket.send(
              JSON.stringify({
                event: WsEvent.ClientMessage,
                data: `/${name} :: Set your name to "${n}"`,
                from: json.from,
              })
            );

            // this is really weird, we send the name changed event before the client who asks for it even knows
            send(
              ws,
              JSON.stringify({
                event: WsEvent.UsernameUpdate,
                data: { old: json.data.user, new: n },
                from: json.from,
              })
            );
            return;
          }
        }

        if (name === 'id') {
          return socket.send(
            JSON.stringify({
              event: WsEvent.ClientMessage,
              data: `/id :: ${json.from}`,
            })
          );
        }

        return;
      }
    }

    // just send it back to client(s)
    send(ws, json);
  });
});

process.on('uncaughtException', console.error);
