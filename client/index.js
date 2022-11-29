// eslint-disable-next-line no-undef
const d = document;

const i = d.getElementById('console');
const o = d.getElementById('output');
const ws = new WebSocket('ws://localhost:8000');
let user = 'unknown';
i.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    ws.send(
      JSON.stringify({
        event: 'message',
        data: {
          user,
          content: this.value,
        },
      })
    );

    this.value = '';
  }
});

d.getElementById('nickname').addEventListener('keypress', function (event) {
  const t = this.value;
  const p = user || 'unknown';

  if (event.key === 'Enter') {
    user = t;
    ws.send(
      JSON.stringify({ event: 'usernameUpdate', data: { old: p, new: t } })
    );
  }
});

ws.addEventListener('message', (event) => {
  const json = JSON.parse(event.data);
  if (json.event === 'message') {
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
    p.classList.add('connection-message');

    const span = d.createElement('span');
    span.innerText = '-> A user has joined with ip ';
    p.appendChild(span);

    const bold = d.createElement('b');
    bold.innerText = json.data.ip;
    p.appendChild(bold);

    o.appendChild(p);
  }

  if (json.event === 'usernameUpdate') {
    const p = d.createElement('p');
    p.classList.add('username-update-message');

    const span = d.createElement('span');
    span.innerText = '-> A user has changed their name from ';
    p.appendChild(span);

    const bold = d.createElement('b');
    bold.innerText = json.data.old;
    p.appendChild(bold);

    const span2 = d.createElement('span');
    span2.innerText = ' to ';
    p.appendChild(span2);

    const bold2 = d.createElement('b');
    bold2.innerText = json.data.new;
    p.appendChild(bold2);

    o.appendChild(p);
  }
});
