const STRING_LENGTH = 6;

const getUserByEmail = (email, users) => {
  for (userId in users) {
    if (users[userId].email === email) {
      return userId;
    }
  }
  return undefined;
}

const generateRandomString = () => {
  let alphaNumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
  let randomIndex;
  let string = ""
  for (let i = 0; i < STRING_LENGTH; i++) {
    randomIndex = Math.floor(Math.random() * alphaNumeric.length)
    string += alphaNumeric[randomIndex];
  }
  return string
}

const getUrlsForUser = (id, urlDatabase) => {
  const urls = {};
  for (const key in urlDatabase) {
    if (urlDatabase[key].userID === id) {
      urls[key] = urlDatabase[key]
    }
  }
  return urls;
}


module.exports ={ getUserByEmail, generateRandomString, getUrlsForUser }