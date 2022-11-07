'use strict';

const express = require('express');
const path = require('path');
const { createServer } = require('http');
//logging
const logger = require('./lib/logging.js')("index.js")


const { WebSocketServer } = require('../..');

const app = express();
app.use(express.static(path.join(__dirname, '/public')));

const server = createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', function (ws) {
  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
  
  const id = setInterval(function () {
    ws.send(JSON.stringify(process.memoryUsage()), function () {
      //
      // Ignore errors.
      //
    });
  }, 100);
  console.log('started client interval');

  ws.on('close', function () {
    console.log('stopping client interval');
    clearInterval(id);
  });
});

server.listen(8080, function () {
  console.log('Listening on http://localhost:8080');
});
