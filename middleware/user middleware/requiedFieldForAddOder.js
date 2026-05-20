exports.requiredFieldForAddOrder = (req, res, next) => {
  const { cartId, addressId, paymentMethod, paymentStatus } = req.body;

  if (!cartId) {
    return res.status(400).json({
      success: false,
      message: "Cart ID is required",
    });
  } else if (!addressId) {
    return res.status(400).json({
      success: false,
      message: "Address ID is required",
    });
  } else if (!paymentMethod) {
    return res.status(400).json({
      success: false,
      message: "Payment method is required",
    });
  } else if (!paymentStatus) {
    return res.status(400).json({
      success: false,
      message: "Payment status is required",
    });
  } else if (
    !["COD", "UPI", "CARD", "PAYPAL", "NET_BANKING", "WALLET"].includes(
      paymentMethod.toUpperCase(),
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid payment method",
    });
  } else if (
    !["PENDING", "SUCCESS", "FAILED", "REFUNDED"].includes(
      paymentStatus.toUpperCase(),
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid payment status",
    });
  } else {
    next();
  }
};
