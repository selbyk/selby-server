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
import Body from 'koa-async-body';

// Import koa middleware
import cors from './middleware/koa-cors-async';
import passport from './middleware/passport';
import compress from 'koa-compress';
import session from './lib/session';

// Import our routes and sockets
import router from './router';
import io from './services';

logger.info('required modules imported, lets get started');

/*
    Instantiate our koa app and middleware
 */
const app = new Koa();
const body = new Body({
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
    ctx.set('X-Response-Time', ms + 'ms');
  })
  .use(logger.koaMiddleware())
  .use(cors())
  .use(compress({
    filter: function(contentType) { // jshint ignore:line
      return true; // /text/i.test(content_type)
    },
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
  }))
  .use(body)
  .use(session({}))
  .use(passport.initialize())
  .use(passport.session())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(async(ctx, next) => {
    await next();
    let n = ctx.session.views || 0;
    ctx.session.views = ++n;
    logger.info(n + ' hits to the server since last restart');
  });

/*
    Attach our sockets to the koa app
 */
io.attach(app);

/*
    Start listening for incoming http requests and socket connections
 */
app.server.listen(5644, function() {
  logger.addSocketTransport(io);
});

module.exports = app; // for testing
