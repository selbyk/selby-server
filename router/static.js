'use strict';
/**
 * socket.io broadcast channels
 * @namespace router/static
 */
import logger from '../lib/logger';
import path from 'path';
import send from 'koa-send';

const rootPath = path.resolve('./docs');
const publicPath = path.resolve('./public');

let route = (router) => {
  router
  /**
   * Replies with swagger.json
   * @function get /swagger.json
   * @memberof router/static
   */
    .get('/swagger.json', async(ctx, next) => { // jshint ignore:line
      await next();
      logger.debug(rootPath);
      await send(ctx, ctx.path, {
        root: rootPath
      });
    })
    /**
     * Replies with contents of the url path in relation to ./jsdocs
     * @function get *
     * @memberof router/static
     */
    .get('*', async(ctx, next) => { // jshint ignore:line
      logger.info('index request');
      logger.debug(ctx.path);
      if (!ctx.path || ctx.path === '/') {
        ctx.path = '/index.html';
      }
      await send(ctx, ctx.path, {
        root: rootPath + '/jsdocs'
      });
      await next();
    })
    /**
     * Replies with contents of the url path in relation to ./ui
     * @function get /ui
     * @memberof router/static
     */
    .get('*', async(ctx, next) => { // jshint ignore:line
      await next();
      logger.info('deep request');
      if (ctx.status === 404) {
        if (ctx.path === '/ui' || ctx.path === '/ui/') {
          ctx.redirect('/ui/index.html');
        } else {
          await send(ctx, ctx.path, {
            root: publicPath
          });
        }
      }
    });

  return router;
};

module.exports = route;
