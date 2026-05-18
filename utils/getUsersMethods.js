const UserModel = require("../models/userModel");

exports.getUserById = async (userId) => {
  const user = await UserModel.findById(userId);
  return user;
};

exports.getUsersByMultipleIds = async (usersId) => {
  const users = await UserModel.find({
    _id: { $in: usersId },
  });
};
