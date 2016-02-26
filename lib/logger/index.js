/**
 * Logger module.
 * @module logger
 */
import _ from 'lodash';
import winston from 'winston';
import winstonKoaLogger from '../koa-logger-winston';
import socketTransport from './transports/socket';

/** winston options. */
let opts = {
  levels: {
    emerg: 0,
    alert: 1,
    crit: 2,
    error: 3,
    warning: 4,
    notice: 5,
    info: 6,
    debug: 7
  },
  colors: {
    emerg: 'teal',
    error: 'red',
    warning: 'yellow',
    notice: 'blue'
  },
  transports: [
    new(winston.transports.Console)()
  ]
};

/** Winston logger instance. */
const loggerInstance = new(winston.Logger)(opts);

/** Class used to abstract a winston logger instance. */
class Logger {
  /**
   * Configures logger singleton.
   * @example
   * // defaults
   * logger.configure({
   *  levels: { emerg: 0, alert: 1, crit: 2, error: 3, warning: 4, notice: 5, info: 6, debug: 7 },
   *    colors: {
   *      emerg: 'teal',
   *      error: 'red',
   *      warning: 'yellow',
   *      notice: 'blue'
   *    }
   *  });
   * @param {object} opts - winston configuration.
   */
  static configure(options) { // jshint ignore:line
    opts = typeof options === 'object' ? _.assign(opts, options) : opts;
    // ...
    // var logger = new(winston.Logger)({
    loggerInstance.configure(opts);
    loggerInstance.log('debug', 'configed logger');
    return this;
  }

  /**
   * Log function abstraction
   */
  static log() {
    loggerInstance.log.apply(loggerInstance, _.values(arguments));
  }

  /**
   * Log function abstraction
   */
  static emerg() {
    this.log.apply(this, ['emerg'].concat(_.values(arguments)));
  }

  /**
   * Log function abstraction
   */
  static alert() {
    this.log.apply(this, ['alert'].concat(_.values(arguments)));
  }

  /**
   * Log function abstraction
   */
  static crit() {
    this.log.apply(this, ['crit'].concat(_.values(arguments)));
  }

  /**
   * Log function abstraction
   */
  static error() {
    this.log.apply(this, ['error'].concat(_.values(arguments)));
  }

  /**
   * Log function abstraction
   */
  static warning() {
    this.log.apply(this, ['warning'].concat(_.values(arguments)));
  }

  /**
   * Log function abstraction
   */
  static notice() {
    this.log.apply(this, ['notice'].concat(_.values(arguments)));
  }

  /**
   * Log function abstraction
   */
  static info() {
    this.log.apply(this, ['info'].concat(_.values(arguments)));
  }

  /**
   * Log function abstraction
   */
  static debug() {
    this.log.apply(this, ['debug'].concat(_.values(arguments)));
  }

  /**
   * Returns middleware for koa.
   * @return {function} The x value.
   */
  static koaMiddleware() {
    return winstonKoaLogger(loggerInstance);
  }

  /**
   * Get logger instance
   * @return {winston} winston logger
   */
  static getLoggerInstance() {
    return loggerInstance;
  }

  /**
   * Add a socket transport
   * @param {emitter} socket - socket instance or something with .emit()
   * @return {Point} A Point object.
   */
  static addSocketTransport(socket) {
    loggerInstance.add(socketTransport, socket);
  }
}

module.exports = Logger;
