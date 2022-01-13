require('dotenv').config()

const amqplib = require('amqplib');
const amqpUrl = process.env.RABBITMQ_URL_PARAMS;

const EmailService = require('./EmailService')
const mailService = new EmailService()

const processMessage = async (message) => {
  console.log('---------------------------------');
  try {
    const email = JSON.parse(message.content.toString());
    mailService.sendMail(email);
  } catch (error) {
    console.error('Could not parse message to json:\n' + error + '\nin: ' + message.content.toString());
  }
}

(async () => {
  const connection = await amqplib.connect(amqpUrl, "heartbeat=60");
  const channel = await connection.createChannel();
  channel.prefetch(10);
  const queue = process.env.RABBITMQ_QUEUE_NAME;
  process.once('SIGINT', async () => {
    console.log('got sigint, closing connection');
    await channel.close();
    await connection.close();
    process.exit(0);
  });

  await channel.assertQueue(queue, {durable: true});
  await channel.consume(queue, async (msg) => {
      await processMessage(msg);
      await channel.ack(msg);
    },
    {
      noAck: false,
      consumerTag: process.env.RABBITMQ_CONSUMER_TAG
    });
  console.log("Message queue is ready to consume!");
})();

module.exports = { processMessage }