const axios = require('axios');
const { menuConfig, regularMarkup } = require('./menu');
const { sendImageMessage } = require('./image');
const cases = require('./cases');

const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.REACT_APP_TELEGRAM_BOT_TOKEN}`;
const MY_TELEGRAM_USER_ID = '5840967881'; // Ensure this is the same as in the main app

const sendWelcomeMessage = async (chatId) => {
  await sendImageMessage(chatId);

  await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
    chat_id: chatId,
    text: "Tanishuvlarni boshlash uchun tanlang:",
    reply_markup: regularMarkup,
    parse_mode: 'HTML',
  });
};

const sendImage = async (chatId, imageUrl, caption, replyMarkup) => {
  await axios.post(`${TELEGRAM_API_URL}/sendPhoto`, {
    chat_id: chatId,
    photo: imageUrl,
    caption: caption,
    reply_markup: replyMarkup,
    parse_mode: 'HTML'
  });
};

const handleMenuResponse = async (chatId, text) => {
  const menuItem = menuConfig.find(item => item.text === text);
  if (menuItem) {
    const caseResponse = cases[menuItem.callback];

    if (caseResponse && caseResponse.action === "reset") {
        await sendWelcomeMessage(chatId);
        return;
      }

    if (caseResponse) {
      if (caseResponse.image) {
        await sendImage(chatId, caseResponse.image, caseResponse.message, caseResponse.reply_markup);
      } else {
        await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
          chat_id: chatId,
          text: caseResponse.message,
          reply_markup: caseResponse.reply_markup,
          parse_mode: 'HTML'
        });
      }

      switch (caseResponse.action) {

        case "contacting":
          return "contacting";

        default:
          // Handle other actions if any
          return;
      }
    }
    return; // Added this return statement to prevent the default message
  }

  // Send default message if no menu item matches
  const defaultMessage = chatId === MY_TELEGRAM_USER_ID 
    ? "Hey Admin! Done! ✅"
    : "Iltimos kerakli menyuni tanlang ⏬";
    
  await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
    chat_id: chatId,
    text: defaultMessage
  });
};

module.exports = {
  sendWelcomeMessage,
  handleMenuResponse,
};
