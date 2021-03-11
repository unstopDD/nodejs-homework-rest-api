const express = require('express');
const router = express.Router();
const userController = require('../../../controllers/users');
const guard = require('../../../helpers/guard');
const validate = require('./validation');
const upload = require('../../../helpers/upload');
const { validateUploadAvatar } = require('./validation');

router.post('/auth/register', validate.registration, userController.reg);

router.post('/auth/login', validate.login, userController.login);

router.post('/auth/logout', guard, userController.logout);

router.get('/current', guard, userController.currentUser);

router.patch('/', guard, validate.updateSub, userController.updateSub);

router.patch(
  '/avatars',
  [guard, upload.single('avatar'), validateUploadAvatar],
  userController.avatars,
);

module.exports = router;
