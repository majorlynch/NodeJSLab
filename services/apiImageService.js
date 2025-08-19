const { default: OpenAI } = require('openai');
const fs = require('fs');
const config = require('./../config');

//Gemini
//const GeminiAI = new GoogleGenAI({apiKey: config.API_KEY_GEMINI});
const chatGPTAI = new OpenAI({ apiKey: config.API_KEY_CHATGPT });

async function chatGPTGenImage(prompt, model) {
  console.log('chatGPTGenImage', prompt);

  try {
    const response = await chatGPTAI.images.generate({
      model: model,
      prompt: prompt,
      n: 1,
      size: '1024x1024',
    });
    //const imageUrl = 'https://madebyconor.com/assets/img/oprime.jpg';
    const imageUrl = response.data[0].url;
    if (!imageUrl) {
      throw new Error('No image URL returned from API');
    }

    const filePath = './imagescreated.txt';
    const generatedDate = new Date().toISOString()
    const line = `${prompt}\n${imageUrl}\n${generatedDate}\n`;
    fs.appendFile(filePath, line, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        return;
      }
    });

    return { "response": imageUrl };

  } catch (error) {
    console.error('Image generation failed:', error.message);
    return null;
  }
}
/*
async function geminiImageRead(imageContent, prompt) {
  try {
    if (!this.GeminiAI) {
      return {
        status: 500,
        success: false,
        message: 'Gemini AI not set',
        response: null
      };
    }

    const response = await this.GeminiAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        createUserContent([
          prompt,
          createPartFromBase64(imageContent, 'image/png'),
        ]),
      ]
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return {
        status: 204,
        success: false,
        message: 'No content returned from Gemini',
        response: null
      };
    }

    return {
      status: 200,
      success: true,
      message: 'Content generated successfully',
      response: text
    };

  } catch (error) {
    console.error('Error in geminiImageRead:', error);
    return {
      status: 500,
      success: false,
      message: 'Internal server error',
      error: error.message
    };
  }
}
*/
module.exports = { chatGPTGenImage, geminiImageRead }