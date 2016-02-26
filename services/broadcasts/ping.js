'use strict';
/**
 * socket.io broadcast channels
 * @namespace services/broadcasts
 */
import logger from '../../lib/logger';

/**
 * broadcasts a ping message to all clients
 * @function ping
 * @emits ping
 * @memberof services/broadcasts
 */
let broadcast = (io) => {
  let pingIt = () => {
    let date = new Date();
    let ms = date.getTime();
    logger.info('Pinging clients...');
    io.broadcast('ping', ms);
    setTimeout(pingIt, 10000);
  };
  pingIt();
  return io;
};

module.exports = broadcast;
