const axios = require('axios');
const FormData = require('form-data'); // Require the FormData module for multipart/form-data encoding

const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.REACT_APP_TELEGRAM_BOT_TOKEN}`;

// Function to send an image message with caption
const sendImageMessage = async (chatId) => {
  try {
    const imageUrl = 'https://s1.ppllstatics.com/lasprovincias/www/multimedia/202202/01/media/cortadas/sebastian-yatra-kDCC-U160739049332F2C-1248x770@Las%20Provincias.jpg'; // Replace with your hosted image URL

    // Create a FormData instance to send a multipart request
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('photo', imageUrl);
    formData.append('caption', 'Bu bot orqali o`zingizga sirli suhbatdosh toping. Bot orqali suhbat xavfsiz va istalgan mavzuda bo`lishi mumkin ❤️'); // Optional caption with HTML tags

    // Send the image with caption using Axios
    const response = await axios.post(`${TELEGRAM_API_URL}/sendPhoto`, formData, {
      headers: {
        ...formData.getHeaders(), // Set headers for multipart/form-data
      },
      params: {
        parse_mode: 'HTML', // Enable HTML parsing for the caption
      },
    });

    console.log('Image sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending image:', error.response ? error.response.data : error.message);
  }
};

module.exports = {
  sendImageMessage, // Export only the remaining function
};
