const getUserByEmail = (email, users) => {
  for (userId in users) {
    if (users[userId].email === email) {
      return userId;
    }
  }
  return undefined;
}

module.exports ={ getUserByEmail }