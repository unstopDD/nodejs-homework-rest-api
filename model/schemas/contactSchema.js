const { Schema, model, SchemaTypes } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { Enum } = require('../../helpers/constants');

const { FREE, PRO, PREMIUM } = Enum;

const contactShema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Set contact email'],
      unique: true,
    },

    name: {
      type: String,
      required: [true, 'Set contact name'],
    },

    phone: {
      type: String,
      required: [true, 'Set contact phone'],
      unique: true,
    },

    feauteres: {
      type: Array,
      set: data => (!data ? [] : data),
    },

    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    },

    subscription: {
      type: String,
      enum: [FREE, PRO, PREMIUM],
      default: FREE,
    },
  },
  { versionKey: false, timestamps: true },
);

contactShema.plugin(mongoosePaginate);
const Contact = model('contact', contactShema);

module.exports = Contact;
