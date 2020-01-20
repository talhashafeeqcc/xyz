const mailer = require('nodemailer');

module.exports = mail => {

  //test throw
  if (!process.env.TRANSPORT) return console.error(new Error('Transport not set.'));

  let _mail = {
    from: `<${process.env.TRANSPORT.split(':')[1]}>`,
    sender: `<${process.env.TRANSPORT.split(':')[1]}>`,
    subject: mail.subject.replace(/”/g,''),
    text: mail.text.replace(/”/g,'')
  };

  if (mail.to) _mail.to = mail.to;

  if (mail.bcc) _mail.bcc = mail.bcc;

  mailer.createTransport(process.env.TRANSPORT).sendMail(_mail);
};