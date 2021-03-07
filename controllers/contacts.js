const Contacts = require('../model/contacts');
const { HttpCode } = require('../helpers/constants');

const { OK, CREATED, NOT_FOUND } = HttpCode;

const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contacts = await Contacts.listContacts(userId);
    return res.json({
      status: 'success',
      code: OK,
      data: {
        contacts,
      },
    });
  } catch (e) {
    next(e);
  }
};

const getById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.getContactById(req.params.contactId, userId);
    if (contact) {
      return res.json({
        status: 'success',
        code: OK,
        data: {
          contact,
        },
      });
    } else {
      return res.status(NOT_FOUND).json({
        status: 'error',
        code: NOT_FOUND,
        message: 'Not Found',
      });
    }
  } catch (e) {
    next(e);
  }
};

const create = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.addContact({ ...req.body, owner: userId });
    return res.status(CREATED).json({
      status: 'success',
      code: CREATED,
      data: {
        contact,
      },
    });
  } catch (e) {
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.removeContact(req.params.contactId, userId);
    if (contact) {
      return res.json({
        status: 'success',
        code: OK,
        message: 'contact deleted',
        data: {
          contact,
        },
      });
    } else {
      return res.status(NOT_FOUND).json({
        status: 'error',
        code: NOT_FOUND,
        message: 'Not Found',
      });
    }
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.updateContact(
      req.params.contactId,
      req.body,
      userId,
    );
    if (contact) {
      return res.json({
        status: 'success',
        code: OK,
        data: {
          contact,
        },
      });
    } else {
      return res.status(NOT_FOUND).json({
        status: 'error',
        code: NOT_FOUND,
        message: 'Not Found',
      });
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
