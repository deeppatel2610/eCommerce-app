const UserModel = require("../../models/userModel");

exports.checkUser = async (req, res, next) => {
  const { email, username } = req.body;
  try {
    const user = await UserModel.findOne({
      $or: [
        {
          email,
        },
        { username },
      ],
    });
    if (user) {
      if (user.email === email) {
        return res.status(409).json({
          error: "Account email already exists!!",
        });
      } else if (user.username === username) {
        return res.status(409).json({
          error: "Account username already exists!!",
        });
      }
    }
    if (!user) {
      next();
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
