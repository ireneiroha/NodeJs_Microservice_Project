const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(bodyParser.json());

// ✅ Use environment variable or fallback to docker network hostname "mongo"
const mongoUri = process.env.MONGO_URI || "mongodb://irene:Obasi6220@mongo:27017/users?authSource=admin";

mongoose.connect(mongoUri)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));



const UserSchema = new mongoose.Schema({
    name: String,
    email: String
});

const User = mongoose.model('User', UserSchema);

app.get('/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
    
})

app.post('/users', async (req, res) => {
    const { name, email} = req.body;

    try{
        const user = new User({ name, email});
        await user.save();
        res.status(201).json(user);
    } catch (error) {
  console.error("❌ Error saving user:", error);
  res.status(500).json({ error: error.message });
}


    });


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`User Service listening on port ${port}`)
})
