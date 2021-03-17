const contacts = [
  {
    _id: '60423455265ddc184c7cb839',
    subscription: 'free',
    name: 'Dmitriy',
    email: 'unstopddd@gmail.com',
    phone: '(066) 097-9491',
    owner: '604a571d3485ee19e4a3a776',
  },
  {
    _id: '6042346b265ddc184c7cb83b',
    subscription: 'pro',
    name: 'Ban',
    email: 'ban@test.com',
    phone: '(095) 234-4422',
    owner: '604a571d3485ee19e4a3a776',
  },
];

const newContact = {
  name: 'Many',
  email: 'many@test.com',
  phone: '(066) 451-5522',
  subscription: 'premium',
};

const User = {
  _id: '604a571d3485ee19e4a3a776',
  subscription: 'premium',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNGE1NzFkMzQ4NWVlMTllNGEzYTc3NiIsImlhdCI6MTYxNTg5MTQwMSwiZXhwIjoxNjE1ODk4NjAxfQ.qpR_Gh0CM4jiILiCDYxopGpcJJwBhC3jh_eS0s2r0Eo',
  email: 'example@example.com',
  password: '$2a$08$CYVy2D5Kvi4lQsQMJw7iMOCcbmyfKyk5KuDdGN5rb1D.BnqwFY81C',
  avatarURL:
    'https://s.gravatar.com/avatar/8b538062c8bd0def5f35727d8067edd3?s=250',
};

const users = [];
users[0] = User;

const newUser = { email: 'test@test.com', password: 'Ab1234567' };

module.exports = { User, users, newUser, contacts, newContact };
