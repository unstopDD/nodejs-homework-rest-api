const express = require('express');
const router = express.Router();
const userController = require('../../../controllers/users');
const guard = require('../../../helpers/guard');
const validate = require('./validation');

router.post('/register', validate.registration, userController.reg);

router.post('/login', validate.login, userController.login);

router.post('/logout', guard, userController.logout);

router.get('/current', guard, userController.currentUser);

router.patch('/', guard, validate.updateSub, userController.updateSub);

module.exports = router;
