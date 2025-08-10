var express = require('express');
const cors = require('cors');
const config = require('./config');
const { geminiChat, mistralChat, deepseekChat, chatGPTChat } = require('./services/apiService');
const { chatGPTGenImage } = require('./services/apiImageService');

const port = process.env.PORT || 3000;

var app = express();

app.use(express.json());

app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/n1/check', function (req, res) {
  res.json({ message: "hello there" }) 
});

app.get('/n1/apikey', (req, res) => {
  res.json({
    API_KEY_GEMINI: config.API_KEY_GEMINI,
    API_KEY_DEEPSEEK: config.API_KEY_DEEPSEEK,
    API_KEY_MISTRAL: config.API_KEY_MISTRAL,
    API_KEY_CHATGPT: config.API_KEY_CHATGPT })
})

app.post('/n1/geminichat', async (req, res) => {
  const { chatPrompt, userHistory, aiHistory } = req.body;
  try {
    const geminiResponse = await geminiChat(chatPrompt, userHistory, aiHistory);
    res.json(geminiResponse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

app.post('/n1/deepseekchat', async (req, res) => {
  const { messages } = req.body;
  try {
    const deepSeekResponse = await deepseekChat(messages);
    res.json(deepSeekResponse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/n1/mistralchat', async (req, res) => {
  const { messages } = req.body;
  try {
    const gptResponse = await mistralChat(messages);
    res.json(gptResponse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

app.post('/n1/chatgptchat', async (req, res) => {
  const { messages } = req.body;
  try {
    const gptResponse = await chatGPTChat(messages);
    res.json(gptResponse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/n1/chatgptgenimage', async (req, res) => {
  const { prompt, model } = req.body;
  try {
    const gptResponse = await chatGPTGenImage(prompt, model);
    res.json(gptResponse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



//the server is listening on port 3000 for connections
app.listen(port, function () {
  console.log('Example app listening on port 3000!')
});