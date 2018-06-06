#!/usr/bin/env node

import * as fs from 'fs';
import * as util from 'util';
import * as request from 'request';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as querystring from 'querystring';
import * as program from 'commander';

const packageJSON = require('../package.json');

const app = express()
let mode = 'http';
let http;

function requiredArgument(arg) {
  console.error('\n  ' + arg + ' argument is required');
  program.help();
  process.exit(1);
}

program
  .version(packageJSON.version)
  .option('-t, --token <token>', 'Vivocha secret token')
  .option('-a, --agent <agent>', 'Vivocha agent id for which the token is created')
  .option('-p, --port [port]', 'Webhook port (default: 80, 443 if https is enabled)')
  .option('-k, --key <key>', 'HTTPS key file (if key and certificate are provided the server will listen in HTTPS mode)')
  .option('-c, --cert <cert>', 'HTTPS certificate file (if key and certificate are provided the server will listen in HTTPS mode)')
  .parse(process.argv);

if (!program.token) requiredArgument('token');
if (!program.agent) requiredArgument('agent');

if (program.key && program.cert) {
  mode = 'https';
  http = require('https').createServer(
    {
      key: fs.readFileSync(program.key),
      cert: fs.readFileSync(program.cert)
    }, app)
} else {
  http = require('http').Server(app)
}

const io = require('socket.io')(http);

// application global parameters
const __localport = program.port || (mode === 'http' ? 80 : 443);

function processEvent(ev, host, acct) {
  console.log("NEW EVENT", ev);
  getContactInfo(ev.cid, host, acct);
  getRoutingToken(ev.cid, host, acct, program.agent, function (err, token) {
    token.cid = ev.cid;
    console.log('token received', token, err);
    io.emit('token', token);
  });
}
function getContactInfo (cid, host, acct) {
  const contactUrl = `https://${host}/a/${acct}/api/_/contact/get/?${querystring.stringify({cid: cid, full: 1})}`
  console.log("getContactInfo url", contactUrl);
  request({
      url: contactUrl,
      headers : {
        "Accept": "application/json",
      },
      auth: {
        username: acct,
        password: program.token
      },
      removeRefererHeader: true
    },
    function (err, res, body) {
      if (err) {
        console.error("getContactInfo error", err);
      } else {
        console.log('getContactInfo res', res.headers, body);
      }
    }
  );
}
function getRoutingToken (cid, host, acct, user, cb) {
  request({
      url : `https://${host}/a/${acct}/api/_/contact/routingToken/?${querystring.stringify({cid, user})}`,
      headers : {
        "Accept": "application/json",
      },
      auth: {
        username: acct,
        password: program.token
      },
      removeRefererHeader: true
    },
    function (err, res, body) {
      if (err) {
        console.error("getRoutingToken error", err);
        cb(err);
      } else {
        try {
          console.log('getRoutingToken res', res.headers, body);
          var token = JSON.parse(body);
          cb(null, token);
        } catch(e) {
          cb(e);
        }
      }
    }
  );
}

app.use(express.static('views'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.all('/event', function (req, res, next) {
  console.log('agentStatus request:')
  console.log(' - Host', req.headers['x-vvc-host']);
  console.log(' - Account', req.headers['x-vvc-acct']);
  console.log(' - HMAC', req.headers[' x-vvc-hmac']);
  console.log(' - query', req.query);
  // TODO verify HMAC
  const host = req.headers['x-vvc-host'];
  const acct = req.headers['x-vvc-acct'];
  if (!host || !acct) {
    console.error('Bad headers', host, acct);
    res.sendStatus(400);
  } else {
    if (util.isArray(req.body)) {
      for (var i = 0 ; i < req.body.length ; i++) {
        processEvent(req.body[i], host, acct);
      }
    } else {
      processEvent(req.body, host, acct);
    }
    res.jsonp({result: true, reason: "this is a test message"});
  }
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('status', function(msg){
    console.log('new status', msg);
    status = msg;
  });
});

http.listen(__localport, function () {
  console.log('listening on ' + mode + ' *:' + __localport);
});