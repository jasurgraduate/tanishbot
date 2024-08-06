const axios = require('axios');

const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.REACT_APP_TELEGRAM_BOT_TOKEN}`;
const NETLIFY_FUNCTION_URL = 'https://uzchat.netlify.app/'; // Replace with your Netlify function URL

exports.handler = async () => {
  try {
    const response = await axios.get(`${TELEGRAM_API_URL}/getWebhookInfo`);
    const { url } = response.data.result;

    if (url !== `${NETLIFY_FUNCTION_URL}/.netlify/functions/telegram-bot`) {
      await axios.post(`${TELEGRAM_API_URL}/setWebhook`, {
        url: `${NETLIFY_FUNCTION_URL}/.netlify/functions/telegram-bot`,
      });

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Webhook reset successfully' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Webhook is correct' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
