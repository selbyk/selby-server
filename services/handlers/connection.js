'use strict';
/**
 * socket.io message handler
 * @namespace services/handlers
 */
import logger from '../../lib/logger';

/**
 * Logs that a client connected
 * @function connection
 * @listens connection
 * @memberof services/handlers
 */
let handler = (io) => {
  io.on('connection', () => {
      logger.info('client connected');
    });
  return io;
};

module.exports = handler;
