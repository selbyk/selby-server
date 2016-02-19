'use strict';
/**
 * selby-server is an koa/socket.io based ES6 node server developed
 * with security and convience in mind. Its purpose is to replace the
 * current server running https://selby.io/
 * @module selby-server
 */
// Import our logger
import logger from './lib/logger';
// Load configuration
import config from './config';
// Write Swagger spec to file so it can later be served
import fs from 'fs';
fs.writeFile('./docs/swagger.json', JSON.stringify(config.spec, null, 2)); //, callback);

// Import koa
import Koa from 'koa';

// Import koa middleware
import cors from './middleware/koa-cors-async';
import passport from './middleware/passport';
import koaConvert from 'koa-convert';
import compress from 'koa-compress';
import KoaBody from 'koa-async-body';
import session from 'koa-generic-session';

// Import our routes and sockets
import router from './router';
import io from './sockets';

logger.info('required modules imported, lets get started');

/*
  Instantiate our koa app and middleware
 */
const app = new Koa();
const koaBody = new KoaBody({
  limits: {
    fileSize: 1024 * 1024 * 2,
    files: 1,
    parts: 1000,
  }
});

app.keys = ['secret'];

/*
  Configure our middleware
 */
app
  .use(async(ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    //logger.info(`${ctx.method} ${ctx.url} ${ctx.status} ${ms}ms`);
    ctx.set('X-Response-Time', ms + 'ms');
  })
  .use(koaConvert(logger.koaMiddleware()))
  .use(cors())
  .use(koaBody)
  .use(koaConvert(session()))
  .use(passport.initialize())
  .use(passport.session())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(koaConvert(compress({
    filter: function(content_type) {
      return /text/gi.test(content_type);
    },
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
  })));

// Attach our sockets to the koa app
io.attach(app);

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
