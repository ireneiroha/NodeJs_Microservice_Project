const amqplib = require('amqplib');

async function start() {
  try {
    const connection = await amqplib.connect('amqp://rabbitmq');
    const channel = await connection.createChannel();

    await channel.assertQueue('task_created');
    console.log("✅ Notification Service is listening to messages");

    channel.consume('task_created', (msg) => {
      const data = JSON.parse(msg.content.toString());
      console.log("📩 Notification: NEW TASK:", data.title);
      console.log("📦 Full task data:", data);
      channel.ack(msg);
    });
    
  } catch (error) {
    console.error("🚨 Failed to connect to RabbitMQ:", error.message);
  }
}

start();
