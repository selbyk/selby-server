'use strict';
/**
 * selby-server is an koa/socket.io based ES6 node server developed
 * with security and convience in mind. Its purpose is to replace the
 * current server running https://selby.io/
 * @module selby-server
 */
// Import configuration
import config from './config';
import fs from 'fs';
fs.writeFile('./docs/swagger.json', JSON.stringify(config.spec, null, 2));//, callback);

import logger from './lib/logger';
import Koa from 'koa';
import IO from 'koa-socket';
import Router from 'koa-router';

import send from 'koa-send';
import koaConvert from 'koa-convert';
import compress from 'koa-compress';
//import mount from 'koa-mount';
import serve from 'koa-static-server';
import koaBody from 'koa-body';
import koaJson from 'koa-json';

logger.info('required modules imported, lets get started');

/*
  Setup some middleware to serve our public dirs
 */
//let serveDocs = serve({rootDir: 'docs', rootPath: '/', index: 'index.html'});

/*
  Instantiate our koa app
 */
const app = new Koa();
const router = new Router();
const io = new IO();

router
.get(':path', async (ctx) => {
  logger.info('index request');
  console.log(ctx.params);
  if(!ctx.params.path || ctx.params.path.length < 1) {
    await send(ctx, `docs/jsdocs/index.html`);
  } else {
    await send(ctx, `docs/jsdocs/${ctx.params.path}`);
  }
})
.get('/swagger.json', async (ctx) => {
  await send(ctx, 'docs/swagger.json');
});

/*
  Configure our middleware
 */
app
  .use(router.routes())
  .use(koaConvert(function*(next) {
    this.set({
      "Access-Control-Allow-Methods": "GET POST",
      "Access-Control-Allow-Headers": "Content-Type",
      "Accept": "application/json",
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "* http://localhost:4200 http://petstore.swagger.io/"
    });
    var start = new Date();
    yield next;
    var ms = new Date() - start;
    logger.info(`${this.method} ${this.url} ${this.status} ${ms}ms`);
    this.set('X-Response-Time', ms + 'ms');
  }))
  .use(koaConvert(koaJson()))
  .use(koaConvert(compress({
    filter: function(content_type) {
      return /text/gi.test(content_type);
    },
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
  })))
  .use(koaConvert(koaBody({
    formidable: {
      uploadDir: __dirname
    }
  })))
  .use(koaConvert(logger.koaMiddleware()))
  .use(koaConvert(serve({
    rootDir: 'docs/jsdocs',
    rootPath: '',
    index: 'index.html'
  })));

/*
  Setup the sockets
 */

/**
 * io middlewares
 */
// jshint ignore:start
io.use(async(ctx, next) => {
  logger.info('io middleware');
  const start = new Date;
  await next();
  const ms = new Date - start;
  logger.info(`WS ${ ms }ms`);
});
// jshint ignore:end
// jshint ignore:start
io.use(async(ctx, next) => {
  ctx.teststring = 'test';
  await next();
});
// jshint ignore:end

io.attach(app);

io
  .on('connection', () => {
    logger.info('client connected');
  })
  .on('new message', function*() {
    // we tell the client to execute 'new message'
    var message = this.args[0];
    this.broadcast.emit('new message', message);
    //yield;
  })
  .on('log', function*() {
    // we tell the client to execute 'new message'
    var log = this.args[0];
    this.broadcast.emit('log', log);
    //yield;
  })
  .on('pong', function*() {
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
app.server.listen(5644, function() {
  logger.addSocketTransport(io);
  let pingIt = () => {
    let ms = (new Date()).getTime();
    logger.log('info', 'Pinging clients...');
    io.broadcast('ping', parseInt(ms));
    setTimeout(pingIt, 10000);
  };
  setTimeout(pingIt, 1000);
});

module.exports = app; // for testing
