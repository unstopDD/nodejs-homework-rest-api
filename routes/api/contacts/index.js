const express = require('express');
const router = express.Router();
const contactsController = require('../../../controllers/contacts');
const validate = require('./validation');
const guard = require('../../../helpers/guard');

router.get('/', guard, contactsController.getAll);

router.get('/:contactId', guard, contactsController.getById);

router.post('/', guard, validate.createConatat, contactsController.create);

router.patch(
  '/:contactId',
  guard,
  validate.updateConatat,
  contactsController.update,
);

router.delete('/:contactId', guard, contactsController.remove);

module.exports = router;
