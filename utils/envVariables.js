require("dotenv").config();

const JWT_KEY = process.env.JWT_SECRET;
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;

exports.envVariables = {
  SESSION_SECRET,
  JWT_SECRET,
  MONGO_URI,
  PORT,
  JWT_KEY,
};
