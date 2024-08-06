const axios = require('axios');
const { sendWelcomeMessage, handleMenuResponse } = require('./menustyle'); // Updated to menustyle.js
const { handleUserSession } = require('./report'); // Include the report.js module
const { resetBot } = require('./error'); // Include the error.js module

// Replace with your Telegram bot token
const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.REACT_APP_TELEGRAM_BOT_TOKEN}`;
const MY_TELEGRAM_USER_ID = '5840967881'; // Your Telegram user ID

let userContacting = {};

// Function to send an image and description
const sendImageAndDescription = async (chatId, imageUrl, description) => {
  try {
    // Send the image
    await axios.post(`${TELEGRAM_API_URL}/sendPhoto`, {
      chat_id: chatId,
      photo: imageUrl,
      caption: description,
      parse_mode: 'HTML', // Enable HTML parsing
    });
  } catch (error) {
    console.error('Error sending image and description:', error.response ? error.response.data : error.message);
  }
};

// Function to forward message with quote
const forwardMessageWithQuote = async (fromChatId, toChatId, messageId) => {
  try {
    await axios.post(`${TELEGRAM_API_URL}/forwardMessage`, {
      chat_id: toChatId,
      from_chat_id: fromChatId,
      message_id: messageId,
      disable_notification: true, // Optional: Disables notification in the forwarded message
    });
  } catch (error) {
    console.error('Error forwarding message with quote:', error.response ? error.response.data : error.message);
  }
};

// Function to handle different types of messages from admin replies
const sendAdminReply = async (chatId, adminMessage) => {
  try {
    const text = adminMessage.text;
    const photo = adminMessage.photo;
    const sticker = adminMessage.sticker;
    const document = adminMessage.document;
    const video = adminMessage.video;
    const audio = adminMessage.audio;
    const voice = adminMessage.voice;
    const animation = adminMessage.animation;

    if (text) {
      await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
        chat_id: chatId,
        text: text,
      });
    } else if (photo) {
      await axios.post(`${TELEGRAM_API_URL}/sendPhoto`, {
        chat_id: chatId,
        photo: photo[photo.length - 1].file_id,
        caption: adminMessage.caption,
        parse_mode: 'HTML',
      });
    } else if (sticker) {
      await axios.post(`${TELEGRAM_API_URL}/sendSticker`, {
        chat_id: chatId,
        sticker: sticker.file_id,
      });
    } else if (document) {
      await axios.post(`${TELEGRAM_API_URL}/sendDocument`, {
        chat_id: chatId,
        document: document.file_id,
        caption: adminMessage.caption,
        parse_mode: 'HTML',
      });
    } else if (video) {
      await axios.post(`${TELEGRAM_API_URL}/sendVideo`, {
        chat_id: chatId,
        video: video.file_id,
        caption: adminMessage.caption,
        parse_mode: 'HTML',
      });
    } else if (audio) {
      await axios.post(`${TELEGRAM_API_URL}/sendAudio`, {
        chat_id: chatId,
        audio: audio.file_id,
        caption: adminMessage.caption,
        parse_mode: 'HTML',
      });
    } else if (voice) {
      await axios.post(`${TELEGRAM_API_URL}/sendVoice`, {
        chat_id: chatId,
        voice: voice.file_id,
        caption: adminMessage.caption,
        parse_mode: 'HTML',
      });
    } else if (animation) {
      await axios.post(`${TELEGRAM_API_URL}/sendAnimation`, {
        chat_id: chatId,
        animation: animation.file_id,
        caption: adminMessage.caption,
        parse_mode: 'HTML',
      });
    } else {
      console.warn('Unsupported message type in admin reply');
    }
  } catch (error) {
    console.error('Error sending admin reply:', error.response ? error.response.data : error.message);
  }
};

exports.handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body);

    console.log('Event body:', body);

    if (body.message) {
      const chatId = body.message.chat.id;
      const messageId = body.message.message_id;
      const user = body.message.from; // Get the user information

      // Handle different types of messages
      const text = body.message.text;
      const photo = body.message.photo;
      const sticker = body.message.sticker;
      const document = body.message.document;
      const video = body.message.video;
      const audio = body.message.audio;
      const voice = body.message.voice;
      const animation = body.message.animation;

      console.log(`Received message from ${user.username || user.first_name}`);

      // Handle user session activity
      await handleUserSession(chatId, user, body.message); // Updated to pass the entire message object

      if (userContacting[chatId]) {
        // Handle user messaging logic here
        userContacting[chatId].messageId = messageId;

        // Replace text message with image and description
        await sendImageAndDescription(chatId, 'https://fmlike.com.ar/wp-content/uploads/2022/02/Sebastia%CC%81n-Yatra.jpg', 'Tabriklaymiz! 🤩 Sizning xabaringiz yetkazildi! Tez orada javob olasiz ❤️');

        // Forward the message with quote to admin
        await forwardMessageWithQuote(chatId, MY_TELEGRAM_USER_ID, messageId);

        delete userContacting[chatId];
      } else {
        if (text === "/start") {
          await sendWelcomeMessage(chatId);
        } else {
          const status = await handleMenuResponse(chatId, text);
          if (status === "contacting") {
            userContacting[chatId] = {};
          }
        }
      }
    }

    if (body.message && body.message.reply_to_message) {
      // Handle reply logic if needed
      const replyMessage = body.message.reply_to_message;
      const adminMessage = body.message;
      const userId = replyMessage.forward_from ? replyMessage.forward_from.id : null; // Ensure forward_from exists

      if (userId) {
        // Send admin reply to user based on the forwarded message
        await sendAdminReply(userId, adminMessage);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Telegram message processed successfully!',
      }),
    };
  } catch (error) {
    console.error('Error processing Telegram message:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to process Telegram message',
      }),
    };
  }
};
