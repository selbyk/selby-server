import logger from '../../lib/logger';
import passport from 'koa-passport';
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new LocalStrategy({
    usernameField: 'identification'
  },
  function(username, password, done) {
    logger.info('Local Authentication Strategy');

    if (username === 'admin' && password === 'admin') {
      done(null, {
        username: 'admin',
        isAdmin: true
      });
    } else {
      done(null, false, {
        message: 'Incorrect login.'
      });
    }
  }));
export default  passport;
