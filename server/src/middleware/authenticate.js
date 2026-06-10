const AppError = require('../utils/AppError');
const { verifyAccessToken } = require('../utils/jwt');
const userModel = require('../modules/users/user.model');

async function authenticate(req, _res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new AppError('Authentication token is required', 401);
    }

    const payload = verifyAccessToken(token);
    const user = await userModel.findById(payload.sub);

    if (!user) {
      throw new AppError('Authenticated user no longer exists', 401);
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error.isOperational) return next(error);
    return next(new AppError('Invalid or expired authentication token', 401));
  }
}

module.exports = authenticate;
