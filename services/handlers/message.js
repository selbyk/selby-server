'use strict';
/**
 * socket.io message handler
 * @namespace services/handlers
 */
import logger from '../../lib/logger';

/**
 * Broadcasts the same message back to all clients
 * @function new message
 * @listens new message
 * @memberof services/handlers
 */
let handler = (io) => {
  io.on('new message', () => {
    var message = this.args[0];
    logger.debug('Handler should repeat this:' + message);
    this.broadcast.emit('new message', message);
  });
  return io;
};

export default  handler;
