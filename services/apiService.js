const axios = require('axios');
const dotenv = require('dotenv').config({ path: '.env' });

const apiKey = process.env.API_KEY_CHATGPT;
const chatGPTApiUrl ='https://api.openai.com/v1/chat/completions';

async function chatGPTResponse(prompt) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };

  const body = {
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
  };


  try {
    const response = await axios.post(chatGPTApiUrl, body, { headers });
    return response.data;
  } catch (error) {
    console.error('ChatGPT API error:', error.message);
    throw error;
  }
};

async function chatGPTChat(messages) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };

  const body = {
    model: 'gpt-4o-mini',
    messages,
    temperature: 0.7,
  };

  try {
    const response = await axios.post(chatGPTApiUrl, body, { headers });
    console.log(response);
    return {"response" : response.data.choices[0].message.content};
  } catch (error) {
    console.error('ChatGPT API error:', error.response?.data || error.message);
    throw error;
  }
};


module.exports = {chatGPTResponse, chatGPTChat};