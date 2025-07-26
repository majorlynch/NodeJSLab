//require the just installed express app
var express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config({ path: '.env' });
const {chatGPTResponse, chatGPTChat} = require('./services/apiService');

const port = process.env.PORT || 3000;

//then we call express
var app = express();
//const router = express.Router();

app.use(express.json());

app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

//takes us to the root(/) URL
app.get('/s1/check', function (req, res) {
//when we visit the root URL express will respond with 'Hello World'
  res.json({ message: "hello there" }) 
});

app.get('/s1/apikey', (req, res) => {
  res.json({
    API_KEY_GEMINI: process.env.API_KEY_GEMINI,
    API_KEY_DEEPSEEK: process.env.API_KEY_DEEPSEEK,
    API_KEY_MISTRAL: process.env.API_KEY_MISTRAL,
    API_KEY_CHATGPT: process.env.API_KEY_CHATGPT })
})

app.post('/s1/chatgptchat', async (req, res) => {
  const { messages } = req.body;
  try {
    const gptResponse = await chatGPTChat(messages);
    res.json(gptResponse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/s1/chatgptprompt', async (req, res) => {
  const { prompt } = req.body;
  try {
    const gptResponse = await chatGPTResponse(prompt);
    res.json(gptResponse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//the server is listening on port 3000 for connections
app.listen(port, function () {
  console.log('Example app listening on port 3000!')
});