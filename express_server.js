const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const STRING_LENGTH = 6;
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}));

function generateRandomString() {
  let alphaNumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
  let randomIndex;
  let string = ""
  for(let i = 0; i < STRING_LENGTH; i++){
    randomIndex = Math.floor(Math.random() * alphaNumeric.length)
    string += alphaNumeric[randomIndex];
  }
  return string
}


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.set("view engine", "ejs")

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`)
});

app.post("/urls/:shortURL/delete", (req, res) => {
  console.log(urlDatabase)
  delete urlDatabase[req.params.shortURL]
  res.redirect('/urls')
  console.log(urlDatabase)
})

app.post("/urls/:id", (req, res) => {
  console.log(urlDatabase)
  let id = req.params.id;
  urlDatabase[id] = req.body.longURL;
  console.log(urlDatabase)
})

app.post("/login", (req, res) => {
  let userName = req.body.username;
  res.cookie("username", userName);
  res.redirect('/urls')
})

app.post("/logout", (req, res) => {
  res.clearCookie('username')
  res.redirect('/urls')
})

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  let username = req.cookies["username"];
  res.render("urls_index", { urls: urlDatabase, username })
});

app.get("/urls/new", (req, res) => {
  let username = req.cookies["username"];
  res.render("urls_new", {username});
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/urls/:shortURL", (req, res) => {
  let username = req.cookies["username"];
  res.render("urls_show",
    {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL],
      username
    })
});


app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

