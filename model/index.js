const fs = require('fs').promises;
const path = require('path');
const { v4: uuid } = require('uuid');
const contactsPath = path.resolve('model/contacts.json');

const listContacts = async () => {
  const data = await fs.readFile(contactsPath, 'utf-8');
  return JSON.parse(data);
};

const getContactById = async contactId => {
  const contacts = await listContacts();
  const requiredContact = contacts.find(
    contact => contact.id.toString() === contactId,
  );
  return requiredContact;
};

const removeContact = async contactId => {
  const contacts = await listContacts();
  const contact = contacts.find(contact => contact.id.toString() === contactId);
  if (!contact) return;
  const updatedContactList = contacts.filter(
    contact => contact.id.toString() !== contactId,
  );
  await fs.writeFile(contactsPath, JSON.stringify(updatedContactList), 'utf8');
  return contact;
};

const addContact = async body => {
  const contacts = await listContacts();
  const { name, email, phone } = body;
  const newContact = { id: uuid(), name, email, phone };
  const updatedContactList = [...contacts, newContact];

  await fs.writeFile(contactsPath, JSON.stringify(updatedContactList), 'utf-8');

  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const contact = contacts.find(contact => contact.id === contactId);
  const updatedContact = { ...contact, ...body };
  return updatedContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
