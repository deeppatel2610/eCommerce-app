const { envVariables } = require("../utils/envVariables");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const getToken = async (user) => {
  try {
    const accessToken = jwt.sign(
      {
        id: user._id,
      },
      envVariables.JWT_KEY,
      { expiresIn: "1h" },
    );
    const refreshToken = jwt.sign(
      {
        id: user._id,
      },
      envVariables.JWT_KEY,
      { expiresIn: "7d" },
    );

    await UserModel.updateOne(
      { _id: user._id },
      { refreshToken: refreshToken },
    );

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = getToken;
