const { Schema, model } = require('mongoose');
const { Sex, Enum } = require('../../helpers/constants');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');

const SALT_WORK_FACTOR = 8;
const { MALE, FEMALE, NONE } = Sex;
const { FREE, PRO, PREMIUM } = Enum;

const userShema = new Schema(
  {
    name: {
      type: String,
      minLength: 3,
      default: 'Guest',
    },

    sex: {
      type: String,
      enum: {
        values: [MALE, FEMALE, NONE],
        message: 'This is not allowed',
      },
      default: 'none',
    },

    email: {
      type: String,
      required: [true, 'Email required'],
      unique: true,
      validate(value) {
        const re = /\S+@\S+\.\S+/;
        return re.test(String(value).toLocaleLowerCase());
      },
    },

    password: {
      type: String,
      required: [true, 'Password required'],
    },

    subscription: {
      type: String,
      enum: [FREE, PRO, PREMIUM],
      default: FREE,
    },

    avatarURL: {
      type: String,
      default: function () {
        return gravatar.url(this.email, { s: '250' }, true);
      },
    },

    imgIdCloud: {
      type: String,
      default: null,
    },

    token: {
      type: String,
      default: null,
    },
    veryfy: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, 'Verify token required'],
    },
  },
  { versionKey: false, timestamps: true },
);

userShema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  this.password = await bcrypt.hash(this.password, salt, null);
  next();
});

userShema.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = model('user', userShema);

module.exports = User;
