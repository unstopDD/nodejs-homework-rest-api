const jwt = require('jsonwebtoken');
const Users = require('../model/users');
const { HttpCode } = require('../helpers/constants');
require('dotenv').config();

const SECRET_WORD = process.env.JWT_SECRET;
const { CONFLICT, CREATED, UNAUTHORIZED, OK, NO_CONTENT } = HttpCode;

const reg = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await Users.findByEmail(email);
    if (user) {
      return res.status(CONFLICT).json({
        status: 'error',
        code: CONFLICT,
        data: 'Conflict',
        message: 'Email is already use',
      });
    }
    const newUser = await Users.create(req.body);
    return res.status(CREATED).json({
      status: 'success',
      code: CREATED,
      data: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        subscription: newUser.subscription,
      },
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    const isValidPassword = await user.validPassword(password);
    if (!user || !isValidPassword) {
      return res.status(UNAUTHORIZED).json({
        status: 'error',
        code: UNAUTHORIZED,
        data: 'Unauthorized',
        message: 'Email or password is wrong',
      });
    }

    const id = user._id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_WORD, { expiresIn: '2h' });
    await Users.updateToken(id, token);
    return res.status(OK).json({
      status: 'success',
      code: OK,
      data: {
        token,
        user: {
          email,
          subscription: user.subscription,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  const userId = req.user.id;
  await Users.updateToken(userId, null);
  return res.status(NO_CONTENT).json({ message: 'No Content' });
};

const currentUser = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const user = await Users.findById(userId);

    return res.status(OK).json({
      status: 'success',
      code: OK,
      data: {
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { reg, login, logout, currentUser };
