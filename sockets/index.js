/**
 * Module responsible for setting up and managing socket connections
 * @module sockets
 */
import logger from '../lib/logger';
import IO from 'koa-socket';

import server from './server';

/** the socket.io instance provided by koa-socket */
const io = new IO();

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

io
  /**
   * Logs that a client connected
   *
   * @listens connection
   */
  .on('connection', () => {
    logger.info('client connected');
  })
  /**
   * Broadcasts the same message back to all clients
   *
   * @listens new message
   */
  .on('new message', () => {
    var message = this.args[0];
    this.broadcast.emit('new message', message);
  })
  /**
   * Pong to finish up a ping. Calculates and records ping duration
   *
   * @listens pong
   */
  .on('pong', () => {
    // we tell the client to execute 'new message'
    logger.info("fycj");
    let ping = this.args[0];
    let ms = (new Date()).getTime() - ping;
    logger.log('info', parseInt(ms) + ' ms ping with fsfs at ' + parseInt(ping));
    //yield;
  });

server(io);

module.exports = io;
