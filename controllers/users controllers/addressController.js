const AddressModel = require("../../models/addressModel");

exports.getAddresses = async (req, res) => {
  const userId = req.user.id;
  try {
    const address = await AddressModel.find({ userId });
    if (!address || address.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No addresses found",
      });
    }

    res.status(200).json({
      success: true,
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
      success: false,
      message: "Failed to fetch addresses",
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
      return res.status(201).json({
        success: true,
        message: "Address added successfully",
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add address",
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
        success: true,
        message: "All addresses deleted successfully",
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete addresses",
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
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    await AddressModel.findOneAndDelete({ _id: addressId, userId }).then(() => {
      return res.status(200).json({
        success: true,
        message: "Address deleted successfully",
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete address",
      error: error.message,
    });
  }
};
