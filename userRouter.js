const userRouter = require('express').Router();
const {users} = require('./mockDB');
const {getUserByEmail, generateRandomString} = require('./helpers')
const bcrypt = require('bcrypt');

userRouter.post("/register", (req, res) => {
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

userRouter.post("/login", (req, res) => {
  const { email, password } = req.body
  const userId = getUserByEmail(email, users);
  if (!userId) {
    return res.status(403).send("Invalid credentials")
  }
  if (!bcrypt.compareSync(password, users[userId].password)) {
    return res.status(403).send("Invalid credentials")
  }
  req.session.user_id = userId;
  res.redirect('/urls')
})

userRouter.post("/logout", (req, res) => {
  req.session = null;
  res.redirect('/urls');
})

userRouter.get("/login", (req, res) => {
  res.render("login", { user: null });
})

userRouter.get("/register", (req, res) => {
  res.render("registration", { user: null });
})

module.exports = userRouter;