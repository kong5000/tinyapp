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

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

app.set("view engine", "ejs")

app.post("/register", (req, res) => {
  const {email, password} = req.body;
  const id = generateRandomString();
  const newUser = {
    id,
    email,
    password
  }
  users[id] = newUser
  res.cookie("user_id", id)
  res.redirect("/urls")
})

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

app.get("/register", (req, res) => {
  res.render("registration")
})

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const user_id = req.cookies["user_id"];
  res.render("urls_index", { urls: urlDatabase, user: users[user_id] })
});

app.get("/urls/new", (req, res) => {
  const user_id = req.cookies["user_id"];
  res.render("urls_new", { user: users[user_id] })
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/urls/:shortURL", (req, res) => {
  const user_id = req.cookies["user_id"];
  res.render("urls_show",
    {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL],
      user: users[user_id]
    })
});


app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

