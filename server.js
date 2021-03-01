const express = require("express");
const dotenv = require("dotenv");
const conenctDB = require("./db");
const passport = require("passport");
const authRouter = require("./authRoute");

dotenv.config();

require("./google")(passport);
require("./facebook")(passport);

conenctDB();

const app = express();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);
