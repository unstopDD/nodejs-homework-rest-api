const Mailgen = require('mailgen');
const sgMail = require('@sendgrid/mail');
const { dev, prod, stage } = require('../config/email.json');
require('dotenv').config();

class EmailService {
  #sender = sgMail;
  #GenerateTemplate = Mailgen;

  constructor(env) {
    switch (env) {
      case 'development':
        this.link = dev;
        break;
      case 'stage':
        this.link = stage;
        break;
      case 'production':
        this.link = prod;
        break;
      default:
        this.link = dev;
        break;
    }
  }

  #createTemplate(verifyToken, name = 'Guest') {
    const mailGenerator = new this.#GenerateTemplate({
      theme: 'cerberus',
      product: {
        name: 'Phonebook',
        link: this.link,
      },
    });

    const template = {
      body: {
        name,
        intro: 'Welcome to Phonebook',
        action: {
          instructions: 'To get started with Phonebook, please click here:',
          button: {
            color: '#22BC66',
            text: 'Confirm your account',
            link: `${this.link}/api/users/auth/verify/${verifyToken}`,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };
    return mailGenerator.generate(template);
  }

  async sendEmail(verifyToken, email, name) {
    const emailBody = this.#createTemplate(verifyToken, name);
    this.#sender.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email,
      from: 'unstopddd@gmail.com',
      subject: 'Confirmation of registration',
      html: emailBody,
    };

    await this.#sender.send(msg);
  }
}

module.exports = EmailService;
