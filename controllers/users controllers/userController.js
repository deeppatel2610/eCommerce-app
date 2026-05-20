const getUserUtils = require("../../utils/getUsersMethods");

exports.getUserById = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await getUserUtils.getUserById(userId);

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user details",
      error: error.message,
    });
  }
};
