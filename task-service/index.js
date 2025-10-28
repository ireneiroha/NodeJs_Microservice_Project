const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const amqplib = require('amqplib');

const app = express();
const port = 3002;

app.use(bodyParser.json());

// ✅ Use environment variable or fallback to docker network hostname "mongo"
const mongoUri = process.env.MONGO_URI || "mongodb://irene:Obasi6220@mongo:27017/tasks?authSource=admin";

mongoose.connect(mongoUri)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  userId: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Task = mongoose.model('Task', TaskSchema);

let channel, connection;

async function connectRabbitMQWithRetry(retries = 10, delay = 5000) {
  while (retries) {
    try {
      connection = await amqplib.connect('amqp://rabbitmq');
      channel = await connection.createChannel();
      await channel.assertQueue('task_created');
      console.log("✅ Connected to RabbitMQ");
      return;
    } catch (error) {
      console.error("❌ RabbitMQ Connection Error:", error.message);
      retries--;
      console.log(`⏳ Retrying... Attempts left: ${retries}`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
  console.error("🚨 Failed to connect to RabbitMQ after multiple attempts");
}


app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const { title, description, userId } = req.body;

  try {
    const task = new Task({ title, description, userId });
    await task.save();

    const message = {taskId: task._id, userId, title: task.title }

    if (!channel) {
        return res.status(500).json({ error: "❌ RabbitMQ channel is not connected" });
    }

    channel.sendToQueue('task_created', Buffer.from(JSON.stringify(message)));

    res.status(201).json(task);
  } catch (error) {
    console.error("❌ Error saving:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`✅ Task Service listening on port ${port}`)
    connectRabbitMQWithRetry();
});
