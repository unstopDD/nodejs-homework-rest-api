const express = require('express');
const router = express.Router();
const contactsController = require('../../controllers/contacts');
const validate = require('../../services/validation');

router.get('/', contactsController.getAll);

router.get('/:contactId', contactsController.getById);

router.post('/', validate.createConatat, contactsController.create);

router.patch('/:contactId', validate.updateConatat, contactsController.update);

router.delete('/:contactId', contactsController.remove);

module.exports = router;
