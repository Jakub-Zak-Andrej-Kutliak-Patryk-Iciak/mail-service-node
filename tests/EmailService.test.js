require('dotenv').config()

const EmailService = require('../EmailService')

describe('Test email service', () => {
  it('sends mail', () => {
    const service = new EmailService()
    service.sendMail({
      receiver: process.env.MAIL_DEFAULT_RECEIVER,
      subject: 'Hey there!',
      message: 'Test message',
    })
  })
})