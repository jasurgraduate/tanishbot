const axios = require('axios');

const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.REACT_APP_TELEGRAM_BOT_TOKEN}`;
const MY_TELEGRAM_USER_ID = '5840967881'; // Your Telegram admin user ID

// Function to forward user messages to the admin with a quote
const forwardMessageToAdmin = async (chatId, messageId) => {
  try {
    const response = await axios.post(`${TELEGRAM_API_URL}/forwardMessage`, {
      chat_id: MY_TELEGRAM_USER_ID,
      from_chat_id: chatId,
      message_id: messageId,
    });
    console.log('Message forwarded:', response.data);
  } catch (error) {
    console.error('Error forwarding message:', error.response ? error.response.data : error.message);
  }
};

// Function to send user report to admin
const sendUserReportToAdmin = async (user) => {
  const { id: userId, first_name: firstName, username, is_bot: isBot } = user;
  const nickname = username ? `@${username}` : 'No nickname';
  const profileLink = `tg://user?id=${userId}`;

  const reportText = `
User Report:
Name: ${firstName}
User ID: ${userId}
Nickname: ${nickname}
Profile: [Link to profile](${profileLink})
Bot: ${isBot ? 'Yes' : 'No'}
`;

  try {
    await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: MY_TELEGRAM_USER_ID,
      text: reportText,
      parse_mode: 'Markdown',
    });
    console.log('User report sent to admin');
  } catch (error) {
    console.error('Error sending user report:', error.response ? error.response.data : error.message);
  }
};

// Function to handle user session activity
const handleUserSession = async (chatId, user, message) => {
  const { id: userId } = user;

  // Check if the message is from the admin
  if (userId.toString() === MY_TELEGRAM_USER_ID) {
    console.log('Admin message ignored:', message);
    return; // Skip handling admin messages
  }

  // Log message for debugging
  console.log('Forwarding message:', message);

  try {
    // Forward the message to the admin with a quote
    await forwardMessageToAdmin(chatId, message.message_id);

    // Send user report to admin
    await sendUserReportToAdmin(user);

  } catch (error) {
    console.error('Error handling user session:', error);
  }
};

module.exports = {
  handleUserSession,
};
