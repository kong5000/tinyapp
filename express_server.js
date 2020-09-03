const PORT = 8080; // default port 8080
const urlDatabase = {};
const users = {};

const express = require("express");
const app = express();
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');

const { getUserByEmail, generateRandomString, getUrlsForUser } = require('./helpers');

app.set("view engine", "ejs")

app.use(cookieSession({
  name: 'session',
  keys: ['secret']
}));

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("empty email or password field")
  }

  if (getUserByEmail(email, users)) {
    return res.status(400).send("email already registered")
  }

  const id = generateRandomString();
  const hashedPassword = bcrypt.hashSync(password, 10)
  const newUser = {
    id,
    email,
    password: hashedPassword
  }
  users[id] = newUser
  req.session.user_id = id;
  res.redirect("/urls")
})

app.post("/urls", (req, res) => {
  console.log(urlDatabase)
  let shortURL = generateRandomString();
  const userID = req.session.user_id;
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID };
  res.redirect(`/urls/${shortURL}`)
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const userID = req.session.user_id;
  const urlID = req.params.shortURL;
  if (urlDatabase[urlID].userID === userID) {
    delete urlDatabase[req.params.shortURL]
  }
  res.redirect('/urls')
})

app.post("/urls/:shortURL", (req, res) => {
  const userID = req.session.user_id;
  const urlID = req.params.shortURL;
  if (urlDatabase[urlID].userID === userID) {
    urlDatabase[urlID] = { longURL: req.body.longURL, userID };
  }
  res.redirect('/urls')
})

app.post("/login", (req, res) => {
  const { email, password } = req.body
  const userId = getUserByEmail(email, users);
  console.log(email, password)
  console.log(userId, "userId")
  if (!userId) {
    return res.status(403).send("Invalid credentials")
  }
  if (!bcrypt.compareSync(password, users[userId].password)) {
    return res.status(403).send("Invalid credentials")
  }
  req.session.user_id = userId;
  res.redirect('/urls')
})

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect('/urls')
})

app.get("/login", (req, res) => {
  res.render("login", { user: null })
})

app.get("/register", (req, res) => {
  res.render("registration", { user: null })
})

app.get("/urls", (req, res) => {
  const user_id = req.session.user_id;
  console.log(user_id, "USER ID FROM COOKIE")
  const urls = getUrlsForUser(user_id, urlDatabase);
  res.render("urls_index", { urls, user: users[user_id] })
});

app.get("/urls/new", (req, res) => {
  const user_id = req.session.user_id;
  if (!user_id) {
    return res.render("login", { user: null })
  }
  res.render("urls_new", { user: users[user_id] })
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  console.group(longURL)
  res.redirect(longURL);
});

app.get("/urls/:shortURL", (req, res) => {
  const user_id = req.session.user_id;
  const shortURL = req.params.shortURL;
  if (!user_id || urlDatabase[shortURL].userID !== user_id) {
    return res.render("urls_show", { user: null });
  }
  res.render("urls_show",
    {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: users[user_id]
    })
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

