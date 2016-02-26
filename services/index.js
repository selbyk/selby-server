'use strict';
/**
 * Realtime services provided via socket.io
 * @module services
 * @namespace services
 * @see services/broadcasts
 * @see services/handlers
 */
import logger from '../lib/logger';
import fs from 'fs';
import path from 'path';
import IO from 'koa-socket';

/** the socket.io instance provided by koa-socket */
const io = new IO();

/** path to broadcasts */
const broadcastsPath = path.join(__dirname, "broadcasts");
/** path to handlers */
const handlersPath = path.join(__dirname, "handlers");

let loadServices = (io) => {

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

  /*
      Load our broadcasts that emit messages
   */
  fs.readdir(broadcastsPath, function(err, files) {
    files
      .filter(function(file) {
        return file.substr(-3) === '.js';
      })
      .forEach(function(file) {
        require(broadcastsPath + '/' + file)(io);
      });
  });

  /*
      Setup our handlers that recieve messages
   */
  fs.readdir(handlersPath, function(err, files) {
    files
      .filter(function(file) {
        return file.substr(-3) === '.js';
      })
      .forEach(function(file) {
        require(handlersPath + '/' + file)(io);
      });
  });

  return io;
};

module.exports = loadServices(io);
