const { users } = require('./data');
const bcrypt = require('bcryptjs');

const findByEmail = jest.fn(email => {
  const [user] = users.filter(el => String(el.email) === String(email));
  return user;
});

const findById = jest.fn(id => {
  const [user] = users.filter(el => String(el._id) === String(id));
  return user;
});

const create = jest.fn(
  ({ name = 'Guest', email, password, sex = 'm', subscription = 'free' }) => {
    const pass = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const newUser = {
      name,
      email,
      password: pass,
      subscription,
      sex,
      _id: '604a571d3485ee19e1a3a77a',
      validPassword: function (pass) {
        return bcrypt.compareSync(pass, this.password);
      },
    };
    users.push(newUser);
    return newUser;
  },
);

const updateSubUser = jest.fn((id, subscription) => {
  const [user] = users.filter(el => String(el._id) === String(id));
  if (user) {
    user.subscription = subscription;
  }
  return user;
});

const updateToken = jest.fn((id, token) => {
  const [user] = users.filter(el => String(el._id) === String(id));
  if (user) {
    user.token = token;
  }
  return {};
});

const updateAatar = jest.fn((id, avatar) => {
  const [user] = users.filter(el => String(el._id) === String(id));
  if (user) {
    user.avatarURL = avatar;
  }

  return user.avatarURL;
});

module.exports = {
  findByEmail,
  create,
  findById,
  updateToken,
  updateSubUser,
  updateAatar,
};
