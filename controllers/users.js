const jwt = require('jsonwebtoken');
const Users = require('../model/users');

require('dotenv').config();
const Jimp = require('jimp');
const { promisify } = require('util');
const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises;
const path = require('path');

const createFolderIsExist = require('../helpers/create-dir');
const { HttpCode } = require('../helpers/constants');
const { CONFLICT, CREATED, UNAUTHORIZED, OK, NO_CONTENT } = HttpCode;

const SECRET_WORD = process.env.JWT_SECRET;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
const uploadCloud = promisify(cloudinary.uploader.upload);

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
        avatar: newUser.avatar,
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
    const isValidPassword = await user?.validPassword(password);
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
  const userId = req.user._id;
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

const updateSub = async (req, res, next) => {
  const userId = req.user._id;
  try {
    await Users.updateSubUser(userId, req.body.subscription);
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

const avatars = async (req, res, next) => {
  try {
    const id = String(req.user._id);
    const avatarUrl = await saveAvatarToStatic(req);
    await Users.updateAatar(id, avatarUrl);

    // для облака
    // const {
    //   public_id: ImgIdCloud,
    //   secure_url: avatarUrl,
    // } = await saveAvatarToCloud(req);
    // await Users.updateAatar(id, avatarUrl, ImgIdCloud);

    return res.json({
      status: 'success',
      code: OK,
      data: {
        avatarUrl,
      },
    });
  } catch (err) {
    next(err);
  }
};

const saveAvatarToStatic = async req => {
  const id = String(req.user._id);
  const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS;
  const pathFile = req.file.path;
  const newAvatarName = `${Date.now()}-${req.file.originalname}`;

  const img = await Jimp.read(pathFile);
  await img
    .autocrop()
    .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(pathFile);
  await createFolderIsExist(path.join(AVATARS_OF_USERS, id));
  await fs.rename(pathFile, path.join(AVATARS_OF_USERS, id, newAvatarName));
  const avatarUrl = path.normalize(path.join(id, newAvatarName));
  try {
    await fs.unlink(
      path.join(process.cwd(), AVATARS_OF_USERS, req.user.avatarUrl),
    );
  } catch (e) {
    console.log(e.message);
  }
  return avatarUrl;
};

const saveAvatarToCloud = async req => {
  const pathFile = req.file.path;
  const restult = await uploadCloud(pathFile, {
    folder: 'Photo',
    transformation: { width: 250, height: 250, crop: 'fill' },
  });
  cloudinary.uploader.destroy(req.user.ImgIdCloud, (err, result) => {
    console.log(err, result);
  });
  try {
    await fs.unlink(path.join(pathFile));
  } catch (e) {
    console.log(e.message);
  }
  return restult;
};

module.exports = { reg, login, logout, currentUser, updateSub, avatars };
