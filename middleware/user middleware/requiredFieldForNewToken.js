exports.requiredFieldForNewToken = (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400).json({
      error: "Refresh Token is required Field For new Token!!",
    });
  } else {
    next();
  }
};
