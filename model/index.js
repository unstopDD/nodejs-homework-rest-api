// const db = require('./db');
// const { ObjectID } = require('mongodb');
const Contact = require('./schemas/contactSchema');

const listContacts = async () => {
  const results = await Contact.find({});
  return results;
};

const getContactById = async contactId => {
  const result = await Contact.findOne({ _id: contactId });
  return result;
};

const addContact = async body => {
  // const record = {
  //   ...body,
  // };
  // const collection = await getCollection(db, 'contacts');
  // const { ops: result } = await collection.insertOne(record);
  const result = await Contact.create(body);

  return result;
};

const updateContact = async (contactId, body) => {
  const result = await Contact.findByIdAndUpdate(
    { _id: contactId },
    { ...body },
    { returnOriginal: false },
  );
  return result;
};

const removeContact = async contactId => {
  const result = await Contact.findByIdAndRemove({
    _id: contactId,
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
