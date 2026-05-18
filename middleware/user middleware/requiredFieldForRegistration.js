var validator = require("validator");

exports.requiredFieldForRegistration = (req, res, next) => {
  const { email, fullName, username, password } = req.body;
  if (!email || !validator.isEmail(email)) {
    res.status(400).json({
      error: "valid email is required Field For Registration!!",
    });
  } else if (!fullName) {
    res.status(400).json({
      error: "Full Name is required Field For Registration!!",
    });
  } else if (!username) {
    res.status(400).json({
      error: "username is required Field For Registration!!",
    });
  } else if (!password) {
    res.status(400).json({
      error: "password is required Field For Registration!!",
    });
  } else {
    next();
  }
};
