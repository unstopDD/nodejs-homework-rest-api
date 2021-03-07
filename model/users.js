const User = require('./schemas/userSchema');

const findByEmail = async email => {
  return await User.findOne({ email });
};

const findById = async id => {
  return await User.findOne({ _id: id });
};

const create = async ({ name, email, password, sex, subscription }) => {
  const user = new User({ name, email, password, sex, subscription });
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token: token });
};

const updateSubUser = async (id, subscription) => {
  return await User.updateOne({ _id: id }, { subscription });
};

module.exports = {
  findByEmail,
  create,
  findById,
  updateToken,
  updateSubUser,
};
