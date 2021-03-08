const Contact = require('./schemas/contactSchema');

const listContacts = async (
  userId,
  { sortBy, sortByDesc, sub, page = 1, limit = 20 },
) => {
  const options = { owner: userId };
  if (sub) {
    options.subscription = { $all: [sub] };
  }
  const results = await Contact.paginate(options, {
    limit,
    page,
    sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
      ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
    },
    populate: {
      path: 'owner',
      select: 'name email sex subscription -_id',
    },
  });
  const { docs: contacts, totalDocs: total } = results;
  return { total: total.toString(), page, limit, contacts };
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
  const result = await Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    { ...body },
    { returnOriginal: false },
  );
  return result;
};

const removeContact = async (contactId, userId) => {
  const result = await Contact.findOneAndRemove({
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
