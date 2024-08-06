const axios = require('axios');

exports.handler = async (event, context) => {
  const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.REACT_APP_TELEGRAM_BOT_TOKEN}`;
  const NETLIFY_FUNCTION_URL = 'https://uzchat.netlify.app/';

  console.log('Setting up webhook...');
  console.log('Telegram API URL:', TELEGRAM_API_URL);
  console.log('Netlify Function URL:', NETLIFY_FUNCTION_URL);

  try {
    const response = await axios.post(`${TELEGRAM_API_URL}/setWebhook`, {
      url: `${NETLIFY_FUNCTION_URL}/.netlify/functions/telegram-bot`,
    });

    console.log('Webhook setup response:', response.data);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Webhook setup complete', response: response.data }),
    };
  } catch (error) {
    console.error('Error setting up webhook:', error.response ? error.response.data : error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message, details: error.response ? error.response.data : null }),
    };
  }
};
