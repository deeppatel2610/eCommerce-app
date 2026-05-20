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
      success: true,
      message: "User created successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
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
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hashPassword = user.hashPassword;
    const isPasswordCorrect = await bcrypt.compare(password, hashPassword);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    return res.status(200).json({
      success: true,
      ...(await getToken(user)),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed",
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
      return res.status(401).json({
        success: false,
        message: "Refresh token expired",
      });
    }

    const user = await UserModel.findById(decodeToken.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      ...(await getToken(user)),
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token refresh failed",
      error: error.message,
    });
  }
};
