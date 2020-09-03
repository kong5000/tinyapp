const express = require("express");
const app = express();
const bcrypt = require('bcrypt');
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const STRING_LENGTH = 6;
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));

function generateRandomString() {
  let alphaNumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
  let randomIndex;
  let string = ""
  for (let i = 0; i < STRING_LENGTH; i++) {
    randomIndex = Math.floor(Math.random() * alphaNumeric.length)
    string += alphaNumeric[randomIndex];
  }
  return string
}


const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: "testuser1"},
  "9sm5xK": {longURL: "http://www.google.com", userID: "testuser2"}
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
const urlsForUser = (id) => {
  const urls = {};
  for(const key in urlDatabase){
    if(urlDatabase[key].userID === id){
      urls[key] = urlDatabase[key]
    }
  }
  return urls;
}

const findUserIdByEmail = (email) => {
  for (userId in users) {
    if (users[userId].email === email) {
      return userId;
    }
  }
  return false;
}

app.set("view engine", "ejs")

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("empty email or password field")
  }

  if (findUserIdByEmail(email)) {
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
  console.log(users)
  res.cookie("user_id", id)
  res.redirect("/urls")
})

app.post("/urls", (req, res) => {
  console.log(urlDatabase)
  let shortURL = generateRandomString();
  const userID = req.cookies["user_id"];
  urlDatabase[shortURL] = {longURL: req.body.longURL, userID};
  res.redirect(`/urls/${shortURL}`)
  console.log(urlDatabase)
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const userID = req.cookies["user_id"];
  const urlID = req.params.shortURL;
  if(urlDatabase[urlID].userID === userID){
    delete urlDatabase[req.params.shortURL]
  }
  res.redirect('/urls')
})

app.post("/urls/:id", (req, res) => {
  const userID = req.cookies["user_id"];
  const urlID = req.params.shortURL;
  if(urlDatabase[urlID].userID === userID){
    urlDatabase[urlID] = {longURL: req.body.longURL, userID};
  }
})

app.post("/login", (req, res) => {
  const { email, password } = req.body
  const userId = findUserIdByEmail(email);
  if(!userId){
    return res.status(403).send("Invalid credentials")
  }
  if(!bcrypt.compareSync(password, users[userId].password)){
    return res.status(403).send("Invalid credentials")
  }
  res.cookie("user_id", userId);
  res.redirect('/urls')
})

app.post("/logout", (req, res) => {
  res.clearCookie('user_id')
  res.redirect('/urls')
})

app.get("/login", (req, res) => {
  res.render("login", { user: null })
})

app.get("/register", (req, res) => {
  res.render("registration", { user: null })
})

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const user_id = req.cookies["user_id"];
  const urls = urlsForUser(user_id);
  res.render("urls_index", { urls, user: users[user_id] })
});

app.get("/urls/new", (req, res) => {
  const user_id = req.cookies["user_id"];
  if(!user_id){
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
  const user_id = req.cookies["user_id"];
  const shortURL = req.params.shortURL;
  if(!user_id || urlDatabase[shortURL].userID !== user_id){
    return res.render("urls_show",{ user: null});
  }
  res.render("urls_show",
    {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: users[user_id]
    })
});


app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

