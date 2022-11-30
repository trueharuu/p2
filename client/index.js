/* eslint-disable @typescript-eslint/explicit-function-return-type */
// eslint-disable-next-line no-undef
const d = document;

const i = d.getElementById('console');
const o = d.getElementById('output');
const ws = new WebSocket('ws://localhost:8000');

let id = ~~(Date.now() % 1e7);
let user = undefined;
let max_messages = 25;

for (let i = 0; i < max_messages; i++) {
  const p = d.createElement('p');
  p.textContent = '\u200b';
  o.appendChild(p);
}

{
  const p = d.createElement('p');
  p.classList.add('error');
  p.id = 'no-user-error';

  p.innerText =
    '! You will not be able to send messages without logging in. Set one with `/login <name>`';

  o.appendChild(p);
}

i.addEventListener('keypress', function (event) {
  /** @type string */
  const value = this.value;
  if (event.key === 'Enter') {
    // client commands
    if (value.startsWith('/c:')) {
      // const ids = value.slice(3).split(' ');

      // const name = ids[0];

      // if (name === 'max_messages') {
      //   const count = Number.parseInt(ids[1]);

      //   if (Number.isNaN(count)) {
      //     onMessage(
      //       JSON.stringify({
      //         event: 'clientMessage',
      //         data: '/c:max_messages :: Invalid count',
      //       })
      //     );

      //     return;
      //   }

      //   // ws.emit doesn't exist :(
      //   onMessage({
      //     data: JSON.stringify({
      //       event: 'clientMessage',
      //       data: `/c:max_messages :: Set your max messages to ${count}`,
      //     }),
      //   });

      //   max_messages = count;
      // }
    }
    
    const d = {
      event: 'message',
      data: {
        user,
        content: this.value,
      },
      from: id,
    };

    ws.send(JSON.stringify(d));

    this.value = '';
  }
});

ws.addEventListener('message', onMessage);
function onMessage(event) {
  const json = JSON.parse(event.data);
  console.log(json);
  c: {
    if (json.event === 'clientMessage') {
      const p = d.createElement('p');
      p.classList.add('client-message');

      p.innerText = json.data;

      o.appendChild(p);
    }

    if (json.event === 'message') {
      if (json.from === id && user === undefined) {
        break c;
      }
      const p = d.createElement('p');

      const bold = d.createElement('b');
      bold.innerText = '@' + json.data.user;
      p.appendChild(bold);

      const span = d.createElement('span');
      span.innerText = ': ' + json.data.content;
      p.appendChild(span);

      o.appendChild(p);
    }

    if (json.event === 'connection') {
      const p = d.createElement('p');
      p.classList.add('success');

      const bold = d.createElement('b');
      bold.innerText = '-> ' + json.data;
      p.appendChild(bold);

      const span = d.createElement('span');
      span.innerText = ' has joined.';
      p.appendChild(span);

      o.appendChild(p);
    }

    if (json.event === 'disconnect') {
      const p = d.createElement('p');
      p.classList.add('error');

      const bold = d.createElement('b');
      bold.innerText = '<- ' + json.data.username + ' (' + json.data.id + ')';
      p.appendChild(bold);

      const span = d.createElement('span');
      span.innerText = ' has left.';
      p.appendChild(span);

      o.appendChild(p);

      break c;
    }

    if (json.event === 'usernameUpdate') {
      if (json.from === id) {
        if (user === undefined) {
          ws.send(JSON.stringify({ event: 'connection', data: json.data.new }));
          user = json.data.new;

          // change the warning

          const r = d.getElementById('no-user-error');

          if (r !== null) {
            r.innerText = '';
            r.classList.replace('error', 'client-message');

            const p = d.createElement('span');
            p.textContent = '✓ You have logged in as ';

            r.appendChild(p);

            const b = d.createElement('b');
            b.textContent = user;

            r.appendChild(b);
          }

          break c; // stops editing message
        }

        user = json.data.new;
      }

      if (json.data.old === undefined) {
        break c;
      }

      const p = d.createElement('p');
      p.classList.add('username-update-message');

      const bold = d.createElement('b');
      bold.innerText = ':: ' + json.data.old;
      p.appendChild(bold);

      const span = d.createElement('span');
      span.innerText = ' changed their name to ';
      p.appendChild(span);

      const bold2 = d.createElement('b');
      bold2.innerText = json.data.new;
      p.appendChild(bold2);

      o.appendChild(p);
    }
  }

  if (o.childElementCount > max_messages && o.firstChild !== null) {
    o.removeChild(o.firstChild);
  }
}
