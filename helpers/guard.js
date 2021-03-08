const passport = require('passport');
require('../config/passport');
const { HttpCode } = require('./constants');

const { UNAUTHORIZED } = HttpCode;

const guard = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    const [, token] = req.get('Authorization').split(' ');
    if (!user || err || token !== user.token) {
      return res.status(UNAUTHORIZED).json({
        status: 'error',
        code: UNAUTHORIZED,
        data: 'Unautgorized',
        message: 'Not authorized',
      });
    }
    req.user = user;
    return next();
  })(req, res, next);
};

module.exports = guard;
