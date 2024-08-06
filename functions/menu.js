const menuConfig = [
  { text: "💌 Tasodifiy xabar yuborish", callback: "contactMe", width: 3 },
  { text: "💋 Bu qanday ishlaydi?", callback: "whoAmI", width: 3 },
  { text: "🔃 Botni qayta ishlatish", callback: "resetBot", width: 3 },
];

const generateKeyboard = (config) => {
  const keyboard = [];
  let row = [];
  let currentWidth = 0;
  const maxWidth = 3; // Maximum width for a single row

  config.forEach(item => {
    if (currentWidth + item.width > maxWidth) {
      keyboard.push(row);
      row = [];
      currentWidth = 0;
    }
    row.push({ text: item.text });
    currentWidth += item.width;
  });

  if (row.length > 0) {
    keyboard.push(row);
  }

  return keyboard;
};

const regularMarkup = {
  keyboard: generateKeyboard(menuConfig),
  resize_keyboard: true,
  one_time_keyboard: false,
  selective: false
};

module.exports = {
  menuConfig,
  regularMarkup,
  generateKeyboard
};
