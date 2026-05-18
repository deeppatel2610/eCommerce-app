var validator = require("validator");

exports.requiredFieldForAddNewAddress = (req, res, next) => {
  const { phoneNumber, addressLine1, city, state, pincode } = req.body;

  if (!phoneNumber) {
    res.status(400).json({
      message: "Phone Number is required Field For New Address!!",
    });
  } else if (!validator.isMobilePhone(phoneNumber)) {
    res.status(400).json({
      message: "Enter a Valid Phone Number!!",
    });
  } else if (!addressLine1) {
    res.status(400).json({
      message: "Address is required Field For New Address!!",
    });
  } else if (!city) {
    res.status(400).json({
      message: "City is required Field For New Address!!",
    });
  } else if (!state) {
    res.status(400).json({
      message: "State is required Field For New Address!!",
    });
  } else if (!pincode) {
    res.status(400).json({
      message: "Pincode is required Field For New Address!!",
    });
  } else if (!(pincode.length === 6)) {
    res.status(400).json({
      message: "Enter a Valid pincode!!",
    });
  } else {
    next();
  }
};
