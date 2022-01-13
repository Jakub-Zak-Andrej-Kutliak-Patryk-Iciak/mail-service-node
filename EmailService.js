const nodemailer = require('nodemailer');

class EmailService {

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_SERVER,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      }
    });
  }

  sendMail({ sender: from = process.env.MAIL_DEFAULT_SENDER, receiver: to, subject, message: text }) {
    const mailOptions = {
      from: `${process.env.APP_NAME || ''} ${from}`,
      to,
      subject,
      text
    }

    if (process.env.MAIL_SUPPRESS_SEND === 'true') {
      console.log('Sending mail suppressed')
      return
    }
    if (process.env.MAIL_DEFAULT_RECEIVER) {
      console.log('Overriding receiver: ' + process.env.MAIL_DEFAULT_RECEIVER)
      mailOptions.to = process.env.MAIL_DEFAULT_RECEIVER
    }

    console.log('Sending mail with these options: ' + JSON.stringify(mailOptions));
    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('An error occurred while sending mail: ' + error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
}

module.exports = EmailService


// const transporter = nodemailer.createTransport({
//   service: process.env.MAIL_SERVER,
//   auth: {
//     user: process.env.MAIL_USERNAME,
//     pass: process.env.jakZak01,
//   }
// });
//
// const mailOptions = {
//   from: process.env.MAIL_USERNAME,
//   to: 'jakub@graitor.dk',
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!'
// };
//
// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });