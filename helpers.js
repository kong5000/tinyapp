const STRING_LENGTH = 6;
const ALPHA_NUMERIC_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";

const generateRandomString = () => {
  let randomIndex;
  let string = "";

  for (let i = 0; i < STRING_LENGTH; i++) {
    randomIndex = Math.floor(Math.random() * ALPHA_NUMERIC_CHARS.length);
    string += ALPHA_NUMERIC_CHARS[randomIndex];
  }
  return string;
};

const getUserByEmail = (email, users) => {
  for (let userId in users) {
    if (users[userId].email === email) {
      return userId;
    }
  }
  return undefined;
};

const getUrlsForUser = (id, urlDatabase) => {
  const urls = {};
  for (const key in urlDatabase) {
    if (urlDatabase[key].userID === id) {
      urls[key] = urlDatabase[key];
    }
  }
  return urls;
};

module.exports = { getUserByEmail, generateRandomString, getUrlsForUser };