/**
 * Module responsible for setting up and managing socket connections
 * @module router
 */
// Import our logger
import path from 'path';
import logger from '../lib/logger';
import Router from 'koa-router';
import send from 'koa-send';

/** koa-router instance */
const router = new Router();
/** path to files being served (docs) */
const rootPath = path.resolve('docs');
const publicPath = path.resolve('public');

module.exports = router
  .post('/auth', async(ctx, next) => {
    logger.debug('Authentication requested');
    logger.debug(ctx.requestBody);
    let user = {
      username: ctx.requestBody.identification,
      password: ctx.requestBody.password
    };
    await next();
    ctx.login(user, function(err) {
      if (err) {
        logger.debug('Authentication failed: ', err);
        ctx.status = 403; //next(err);
      }
      logger.debug('Authentication succeeded');
      ctx.body = {
        access_token: 'YWRtaW46YWRtaW4='
      };
    });
  })
  .get('/swagger.json', async(ctx, next) => { // jshint ignore:line
    await next();
    logger.debug(rootPath);
    await send(ctx, ctx.path, {
      root: rootPath
    });
  })
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
  }).get('*', async(ctx, next) => { // jshint ignore:line
    await next();
    logger.info('public request');
    if (ctx.status === 404) {
      logger.info('YEAH MAN! ' + ctx.path);
      if(ctx.path === '/ui' || ctx.path === '/ui/') {
        ctx.redirect('/ui/index.html');
      } else {
        await send(ctx, ctx.path, {
          root: publicPath
        });
      }
    }
  });
