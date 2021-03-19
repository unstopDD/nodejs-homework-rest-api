const User = require('./schemas/userSchema');

const findByEmail = async email => {
  return await User.findOne({ email });
};

const findById = async id => {
  return await User.findOne({ _id: id });
};

const findByVerifyToken = async verifyToken => {
  return await User.findOne({ verifyToken });
};

const create = async ({
  name,
  email,
  password,
  sex,
  subscription,
  verify,
  verifyToken,
}) => {
  const user = new User({
    name,
    email,
    password,
    sex,
    subscription,
    verify,
    verifyToken,
  });
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token: token });
};

const updateVerifyToken = async (id, verifyToken) => {
  return await User.findOneAndUpdate({ _id: id }, { verifyToken });
};

const updateSubUser = async (id, subscription) => {
  return await User.updateOne({ _id: id }, { subscription });
};

const updateAatar = async (id, avatar, ImgIdCloud = null) => {
  return await User.updateOne({ _id: id }, { avatarURL: avatar, ImgIdCloud });
};

module.exports = {
  findByEmail,
  create,
  findById,
  updateToken,
  updateSubUser,
  updateAatar,
  updateVerifyToken,
  findByVerifyToken,
};
