'use strict';
/**
 * socket.io message handler
 * @namespace services/handlers
 */
import logger from '../../lib/logger';

/**
 * Logs all 'pong' messages so that they will be broadcast
 * @function pong
 * @listens pong
 * @memberof services/handlers
 */
let handler = (io) => {
  io.on('pong', () => {
    // we tell the client to execute 'new message'
    logger.info("fycj");
    let ping = this.args[0];
    let ms = (new Date()).getTime() - ping;
    logger.log('info', parseInt(ms) + ' ms ping with fsfs at ' + parseInt(ping));
    //yield;
  });
  return io;
};

export default  handler;
