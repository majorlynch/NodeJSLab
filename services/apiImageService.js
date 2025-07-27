const { default: OpenAI } = require('openai');
const fs = require('fs');

chatAPTAI = new OpenAI({
  apiKey: process.env.API_KEY_CHATGPT
});

async function chatGPTGenImage(prompt, model) {
  console.log(prompt, model);

  try {
    /*
  const response = await chatAPTAI.images.generate({
    model: model,
    prompt: prompt,
    n: 1,
    size: '1024x1024',
  }); 

  const imageUrl = response.data[0].url;
  */
    const imageUrl = 'https://madebyconor.com/assets/img/oprime.jpg';
    console.log('Generated Image URL:', imageUrl);

    const filePath = './imagescreated.txt';
    const line = imageUrl;
    fs.appendFile(filePath, line, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
      return;
    }
    console.log('Line successfully added!');
});


    return { "response": imageUrl };

  } catch (error) {
    console.error('Image generation failed:', error.message);
    return null;
  }
}


module.exports = { chatGPTGenImage }