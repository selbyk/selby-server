'use strict';
/**
 * selby-server is an koa/socket.io based ES6 node server developed
 * with security and convience in mind. Its purpose is to replace the
 * current server running https://selby.io/
 * @module selby-server
 */
// Import configuration
import config from './config';
import logger from './lib/logger';
import koa from 'koa.io';
import compress from 'koa-compress';
import mount from 'koa-mount';
import serve from 'koa-static';
import koaBody from 'koa-body';

logger.info('required modules imported, lets get started');

/*
  Setup some middleware to serve our public dirs
 */
let serveDocs = serve('./docs');
let serveJsonSpec = function*(next) {
  yield next;
  this.set('Content-Type', 'application/json; charset=utf-8');
  this.body = JSON.stringify(config.spec);
};

/*
  Instantiate our koa app
 */
let app = koa();

/*
  Configure our middleware
 */
app
  .use(compress({
    filter: function(content_type) {
      return /text/gi.test(content_type);
    },
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
  }))
  .use(koaBody({
    formidable: {
      uploadDir: __dirname
    }
  }))
  .use(logger.koaMiddleware())
  .use(mount('/', serveDocs))
  .use(mount('/swagger.json', serveJsonSpec))
  .use(function*(next) { // headers w x-response-time
    var start = new Date().valueOf();
    yield next;
    var ms = new Date().valueOf() - start;
    this.set({
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type",
      "Accept": "application/json",
      "Content-Type": "text/json; charset=utf-8",
      "Access-Control-Allow-Origin": "http://localhost:4200"
    });
    this.set('X-Response-Time', ms + 'ms');
  })
  .use(function*(next) {
    yield next;
    if (!this.body) {
      return;
    } else {
      this.set('Content-Length', this.body.length);
    }
  })
  .use(function*(next) {
    yield next;
    this.status = 404;
    this.body = 'U is lost boi'; //JSON.stringify(this.request.body);
  })
  .use(function*() {
    this.body = yield this.request.body;
  })
  .use(function*(next) {
    var start = new Date();
    yield next;
    var ms = new Date() - start;
    logger.info(`${this.method} + ${this.url} ${ms} ms`);
  });

/*
  Setup the sockets
 */
app.io.use(function*(next) {
    // on connect
    logger.info('client connected');
    yield next;
    // on disconnect
    logger.info('client disconnected');
  })
  .route('new message', function*() {
    // we tell the client to execute 'new message'
    var message = this.args[0];
    this.broadcast.emit('new message', message);
    //yield;
  })
  .route('log', function*() {
    // we tell the client to execute 'new message'
    var log = this.args[0];
    this.broadcast.emit('log', log);
    //yield;
  })
  .route('pong', function*() {
    // we tell the client to execute 'new message'
    console.log("fycj");
    let ping = this.args[0];
    let ms = (new Date()).getTime() - ping;
    logger.log('info', parseInt(ms) + ' ms ping with fsfs at ' + parseInt(ping));
    //yield;
  });

/*
  Start listening for incoming http requests and socket connections
 */
app.listen(5644, function() {
  logger.addSocketTransport(app.io.sockets);
  let pingIt = () => {
    let ms = (new Date()).getTime();
    logger.log('info', 'Pinging clients...');
    app.io.sockets.emit('ping', parseInt(ms));
    setTimeout(pingIt, 10000);
  };
  setTimeout(pingIt, 1000);
});

module.exports = app; // for testing
