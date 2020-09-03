const PORT = 8080;

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const userRouter = require('./controllers/userRouter');
const urlRouter = require('./controllers/urlRouter');

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['secret']
}));
app.use(userRouter);
app.use(urlRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

