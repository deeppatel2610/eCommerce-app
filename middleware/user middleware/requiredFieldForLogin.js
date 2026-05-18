exports.requiredFieldForLogin = (req, res, next) => {
  const { credential, password } = req.body;

  if (!credential) {
    return res.status(400).json({
      error: "email Or Username required Field For Login!!",
    });
  } else if (!password) {
    return res.status(400).json({
      error: "password is required Field For Login!!",
    });
  } else {
    next();
  }
};
