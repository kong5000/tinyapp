const PORT = 8080; // default port 8080

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');

const { generateRandomString, getUrlsForUser } = require('./helpers');
const { users, urlDatabase } = require('./mockDB');

const userRouter = require('./userRouter');

app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieSession({
  name: 'session',
  keys: ['secret']
}));

app.use('/', userRouter)

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  const userID = req.session.user_id;
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID };
  res.redirect(`/urls/${shortURL}`);
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

app.get("/urls", (req, res) => {
  const user_id = req.session.user_id;
  const urls = getUrlsForUser(user_id, urlDatabase);
  res.render("urls_index", { urls, user: users[user_id] });
});

app.get("/urls/new", (req, res) => {
  const user_id = req.session.user_id;
  if (!user_id) {
    return res.render("login", { user: null });
  }
  res.render("urls_new", { user: users[user_id] })
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  console.group(longURL);
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
    });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

