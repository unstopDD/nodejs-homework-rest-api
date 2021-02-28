const { Schema, model } = require('mongoose');

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

    //   data: {type: Date, default: () => Date.now}
  },
  { versionKey: false, timestamps: true },
);

const Contact = model('contact', contactShema);

module.exports = Contact;
