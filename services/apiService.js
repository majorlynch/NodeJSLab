const axios = require('axios');
const { default: OpenAI } = require('openai');

const chatGPTApiUrl = 'https://api.openai.com/v1/chat/completions';


const deepseekAI = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.API_KEY_DEEPSEEK
});


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
    Authorization: `Bearer ${process.env.API_KEY_CHATGPT}`,
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
        message: err.response.status.data.error?.message || 'Chatgpt error'
      }
    }
    throw {
      status: 500,
      message: 'Internal Server Error'
    }
  }
};


module.exports = { deepseekChat, chatGPTChat };