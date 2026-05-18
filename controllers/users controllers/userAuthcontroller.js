const bcrypt = require("bcrypt");
const UserModel = require("../../models/userModel");
const jwt = require("jsonwebtoken");
const getToken = require("../../utils/getAccessAndRefreshToken");
const { envVariables } = require("../../utils/envVariables");

exports.registration = async (req, res) => {
  const { email, username, fullName, password } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({ email, username, fullName, hashPassword });

    await user.save();
    res.status(201).json({
      message: "User creact success!",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  const { credential, password } = req.body;

  try {
    const user = await UserModel.findOne({
      $or: [{ email: credential }, { username: credential }],
    });

    if (!user) {
      return res.status(400).json({
        error: "User Not Found!!",
      });
    }

    const hashPassword = user.hashPassword;
    const isMech = await bcrypt.compare(password, hashPassword);

    if (!isMech) {
      return res.status(400).json({
        error: "password is Wrong!!",
      });
    }

    return res.status(200).json(await getToken(user));
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.newToken = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const JWT_KEY = envVariables.JWT_SECRET;
    const decodeToken = await jwt.verify(refreshToken, JWT_KEY);

    if (!decodeToken.id) {
      return res.status(400).json({
        error: "Refresh Token expires!!",
      });
    }

    const user = await UserModel.findById(decodeToken.id);

    if (!user) {
      return res.status(400).json({
        error: "user not found!",
      });
    }

    return res.status(200).json(await getToken(user));
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
