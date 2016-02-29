'use strict';
/**
 * socket.io broadcast channels
 * @namespace router/auth
 */
import logger from '../lib/logger';

/**
 * Authenticates a user
 * @function post
 * @memberof router/auth
 */
let route = (router) => {
  router.post('/auth', async(ctx, next) => {
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
  });
  return router;
};

export default  route;
