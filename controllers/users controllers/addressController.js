const AddressModel = require("../../models/addressModel");

exports.getAddresses = async (req, res) => {
  const userId = req.user.id;
  try {
    const address = await AddressModel.find({ userId });
    if (!address) {
      res.status(200).json({
        addNewAddress: true,
      });
    }

    res.status(200).json({
      data: address.map((e) => {
        return {
          id: e._id,
          userId: e.userId,
          phoneNumber: e.phoneNumber,
          addressLine1: e.addressLine1,
          addressLine2: e.addressLine2 ?? "",
          city: e.city,
          state: e.state,
          pincode: e.pincode,
        };
      }),
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.addNewAddress = async (req, res) => {
  const { phoneNumber, addressLine1, addressLine2, city, state, pincode } =
    req.body;
  const userId = req.user.id;
  try {
    const address = new AddressModel({
      userId,
      phoneNumber,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
    });
    await address.save().then(() => {
      return res.status(200).json({
        message: "Add a New Address success!!",
      });
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.removeAllAddress = async (req, res) => {
  const userId = req.user.id;
  try {
    await AddressModel.deleteMany({
      userId: userId,
    }).then(() => {
      return res.status(200).json({
        message: "Delete All Address!!",
      });
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.removeOneAddress = async (req, res) => {
  const { addressId } = req.params;
  const userId = req.user.id;

  try {
    const address = await AddressModel.findById(addressId);

    if (!address) {
      return res.status(204).json({
        message: "Address Not Avelebal!!",
      });
    }

    await AddressModel.findOneAndDelete({ _id: addressId, userId }).then(() => {
      return res.status(200).json({
        message: "Delete Address!!",
      });
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
