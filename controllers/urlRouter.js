const urlRouter = require('express').Router();
const { generateRandomString, getUrlsForUser } = require('../helpers');
const { users, urlDatabase } = require('../mockDB');

urlRouter.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const userID = req.session.userID;

  urlDatabase[shortURL] = { longURL: req.body.longURL, userID };

  res.redirect(`/urls/${shortURL}`);
});

urlRouter.post("/urls/:shortURL/delete", (req, res) => {
  const userID = req.session.userID;
  const urlID = req.params.shortURL;

  if (urlDatabase[urlID].userID === userID) {
    delete urlDatabase[req.params.shortURL];
  }
  res.redirect('/urls');
});

urlRouter.post("/urls/:shortURL", (req, res) => {
  const userID = req.session.userID;
  const urlID = req.params.shortURL;

  if (urlDatabase[urlID].userID === userID) {
    urlDatabase[urlID] = { longURL: req.body.longURL, userID };
  }
  res.redirect('/urls');
});

urlRouter.get("/urls", (req, res) => {
  const userID = req.session.userID;
  const urls = getUrlsForUser(userID, urlDatabase);
  const templateVars = {
    urls,
    user: users[userID]
  };

  res.render("urls_index", templateVars);
});

urlRouter.get("/urls/new", (req, res) => {
  const userID = req.session.userID;
  if (!userID) {
    return res.render("login", { user: null });
  }
  res.render("urls_new", { user: users[userID] });
});

urlRouter.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  console.group(longURL);
  res.redirect(longURL);
});

urlRouter.get("/urls/:shortURL", (req, res) => {
  const userID = req.session.userID;
  const shortURL = req.params.shortURL;
  if (!userID || urlDatabase[shortURL].userID !== userID) {
    return res.render("urls_show", { user: null });
  }
  
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[userID]
  };
  res.render("urls_show", templateVars);
});

module.exports = urlRouter;