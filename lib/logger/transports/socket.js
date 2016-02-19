/**
 * Socket module exports a class extending Winston.Transport to report logs via
 * socket.io
 * @module selby-server/logger/transports
 */

import util from 'util';
import {Transport} from 'winston';

/** Class extending Winston.Transport for reporting via sockets */
class Socket extends Transport {
  /**
   * Constructor for Socket transport object.
   * @param {object} socket - some object with emit().
   */
  constructor(socket) {
    super(socket);
    // Winston options
    this.name = 'Socket';
    this.level = 'info';

    this.socket = socket;
  }

  /**
   * Log function
   * @param {string} level - Level at which to log the message.
   * @param {string} msg - Message to log
   * @param {Object} [meta] - **Optional** Additional metadata to attach
   * @param {function} [callback] - Continuation to respond to when complete.
   */
  log(level, msg, meta, callback) {
    if (this.silent) {
      return callback(null, true);
    }

    if (typeof meta !== 'object' && meta !== null) {
      meta = {
        meta: meta
      };
    }

    var body = !!meta ? meta.body : null;
    var host = !!meta ? meta.host : null;
    var ip = !!meta ? meta.ip : null;
    var metaString = !!meta ? (!!meta.meta ? util.inspect(meta.meta, false, 3, true) : util.inspect(meta, false, 3, true)) : null;
    var query = !!meta ? meta.query : null;
    var route = !!meta ? meta.route : null;
    var sessionId = !!meta ? meta.sessionId : null;
    var url = !!meta ? meta.url : null;

    var options = {
      type: level,
      message: msg,
      meta: metaString,
      time: new Date(),
      ip_address: ip,
      session_id: sessionId,
      route: route,
      query: query,
      body: body,
      host: host,
      url: url
    };

    this.socket.broadcast('log', options);
    callback(null, options);
  }

  /**
   * Cleanup after transport is closed
   */
  close() {
    //this.sequelize.connectorManager.disconnect();
  }
}

module.exports = Socket;
