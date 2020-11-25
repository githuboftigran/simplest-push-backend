const admin = require('firebase-admin');
const serviceAccount = require('./firebase-key.json');

const express = require('express');
const app = express();
const port = 3000;


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://simplestpush.firebaseio.com"
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

app.get('/push-me-this', (req, res) => {
  const { token, message } = req.query;
  const firebaseMessage = {
    notification: {
      title: 'A test notification from SimplestPush!',
      body: `Your message: ${message}`,
      imageUrl: 'https://my-cdn.com/app-logo.png',
    },
    token,
  };
  setTimeout(() => {
    admin.messaging().send(firebaseMessage).catch((error) => {
      console.log('Error sending message:', error);
    });
  }, 3000);
  // Respond immediately
  res.send();
});

const sessions = {};

const users = {
  tigran: 'Tigran S',
  sal: 'Sal S',
  josh: 'Josh K',
  raman: 'Raman S',
};

app.get('/log-in', ({ query }, res) => {
  const { username, password } = query;
  // simulate login
  console.log("logging in: " + username);
  const user = users[username];
  if(!user){
  console.log("NO USER");
    res.send({success: false});
  }else{
    const sessionKey = Date.now();
    sessions[sessionKey] = { username };
    res.send({ success: true, data: {name: user, sessionKey}});
  }
});

app.get('/log-out', ({query}, res) => {
  const sessionKey = query.sessionKey;
  console.log("logging out: " + sessionKey);
  const session = sessions[sessionKey];
  console.log(session);
  if(!session){
    res.send({success: false});
  }else{
    delete sessions[sessionKey];
    res.send({success: true});
  }
});

app.post('/geo-ping', ({body, query}, res) => {
  const sessionKey = query.sessionKey;
  if (!sessionKey) {
    console.log('No session for geo ping');
    res.send({ success: false });
  }
  const username = sessions[sessionKey];
  if (!username) {
    console.log(`No user found with username: ${username}`);
    res.send({ success: false });
  }
  // const user = users[username];
  console.log(username);
  console.log(body);
  res.send({ success: true });
});

app.post('/health-kit-ping', ({body, query}, res) => {
  const sessionKey = query.sessionKey;
  if (!sessionKey) {
    console.log('No session for health ping');
    res.send({ success: false });
  }
  const username = sessions[sessionKey];
  if (!username) {
    console.log(`No user found with username: ${username}`);
    res.send({ success: false });
  }
  // const user = users[username];
  console.log(username);
  console.log(body);
  res.send({ success: true });
});
