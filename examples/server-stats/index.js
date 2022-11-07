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
    const info = JSON.parse(data)
    logger.info(info.key1);
    logger.security('received: %s', info.key2);
  });

  ws.send('You are connected to Logging Server');
  
  logger.info('started client interval');

  ws.on('close', function () {
    logger.info('stopping client interval');
    clearInterval(id);
  });
});

server.listen(8080, function () {
  logger.info('Listening on http://localhost:8080');
});
