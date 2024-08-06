const axios = require('axios');

// Replace with your Telegram bot token
const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.REACT_APP_TELEGRAM_BOT_TOKEN}`;

// Function to reset the bot by sending the /start command
const resetBot = async (chatId) => {
  try {
    await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: chatId,
      text: '/start',
    });
    console.log(`Bot reset with /start command for chat ID: ${chatId}`);
  } catch (error) {
    console.error('Error resetting bot:', error.response ? error.response.data : error.message);
  }
};

module.exports = { resetBot };
