const Contact = require('./schemas/contactSchema');

const listContacts = async userId => {
  const results = await Contact.find({ owner: userId }).populate({
    path: 'owner',
    select: 'name email sex subscription -_id',
  });
  return results;
};

const getContactById = async (contactId, userId) => {
  const result = await Contact.findOne({
    _id: contactId,
    owner: userId,
  }).populate({
    path: 'owner',
    select: 'name email sex subscription -_id',
  });
  return result;
};

const addContact = async body => {
  const result = await Contact.create(body);

  return result;
};

const updateContact = async (contactId, body, userId) => {
  const result = await Contact.findByIdAndUpdate(
    { _id: contactId, owner: userId },
    { ...body },
    { returnOriginal: false },
  );
  return result;
};

const removeContact = async (contactId, userId) => {
  const result = await Contact.findByIdAndRemove({
    _id: contactId,
    owner: userId,
  });
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
