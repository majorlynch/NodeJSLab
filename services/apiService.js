const axios = require('axios');
const { default: OpenAI } = require('openai');
const config = require('./../config');
const { GoogleGenAI } = require('@google/genai');
const { Mistral } = require('@mistralai/mistralai');

const chatGPTApiUrl = 'https://api.openai.com/v1/chat/completions';

//Gemini
ai = new GoogleGenAI({
  apiKey: config.API_KEY_GEMINI,
});

//DeepSeek
const deepseekAI = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: config.API_KEY_DEEPSEEK
});

//Mistral
try{
mistralClient = new Mistral({ apiKey: config.API_KEY_MISTRAL });
} catch(e) {
  console.log(e);
}

async function geminiChat(chatPrompt, userHistory, aiHistory) {
  try {
    if (!this.ai) {
      console.log('Gemini ai not set');
      return '';
    }
    const chat = ai.chats.create({
      model: 'gemini-2.0-flash',
      history: [
        {
          role: 'user',
          parts: userHistory,
        },
        {
          role: 'model',
          parts: aiHistory,
        },
      ],
    });

    this.response = await chat.sendMessage({
      message: chatPrompt,
    });

    return this.response.text;
  } catch (err) {
    throw {
      status: 500,
      message: err
    }
  }
}

async function mistralChat(messages) {
    if (!mistralClient) {
      throw {
        status: 500,
        message: 'Mistral ai not set'
      }
    }

    let response = '';
    const result = await mistralClient.chat.stream({
      model: "mistral-large-latest",
      messages,
    });

    for await (const chunk of result) {
      let streamText = chunk.data.choices[0].delta.content;
      if (typeof streamText === "string") {
        response += streamText;
      }
    }
    return response;
}

async function deepseekChat(messages) {
  try {
    const response = await deepseekAI.chat.completions.create({
      model: 'deepseek-chat', // or 'deepseek-reasoner' for complex tasks
      messages,
      temperature: 0.7,
      max_tokens: 150,
    });

    return { "response": response.choices[0].message.content };
  } catch (err) {

    if (err.message) {
      throw {
        status: err.code,
        message: err.message || 'Deepseek error'
      }
    }
    throw {
      status: 500,
      message: 'Internal Server Error'
    }
  }
};


async function chatGPTChat(messages) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${config.API_KEY_CHATGPT}`,
  };

  const body = {
    model: 'gpt-4o-mini',
    messages,
    temperature: 0.7,
  };

  try {
    const response = await axios.post(chatGPTApiUrl, body, { headers });
    return { "response": response.data.choices[0].message.content };
  } catch (err) {

    if (err.response) {
      throw {
        status: err.response.status,
        message: err.response?.data?.error?.message || 'ChatGPT error'
      }
    }
    throw {
      status: 500,
      message: 'Internal Server Error'
    }
  }
};


module.exports = { geminiChat, mistralChat, deepseekChat, chatGPTChat };