import logger from '../lib/logger';
import IO from 'koa-socket';
const io = new IO();

/*
  Setup the sockets
 */

/**
 * io middlewares
 */
io.use(async(ctx, next) => {
  logger.info('io middleware');
  const start = new Date();
  await next();
  const ms = new Date() - start;
  logger.info(`WS ${ ms }ms`);
});
io.use(async(ctx, next) => {
  ctx.teststring = 'test';
  await next();
});

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
    logger.info("fycj");
    let ping = this.args[0];
    let ms = (new Date()).getTime() - ping;
    logger.log('info', parseInt(ms) + ' ms ping with fsfs at ' + parseInt(ping));
    //yield;
  });

module.exports = io;
