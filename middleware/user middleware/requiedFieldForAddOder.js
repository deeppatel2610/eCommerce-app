exports.requiredFieldForAddOrder = (req, res, next) => {
  const { cartId, addressId, paymentMethod, paymentStatus } = req.body;

  if (!cartId) {
    return res.status(400).json({
      error: "cartId Required!",
    });
  } else if (!addressId) {
    return res.status(400).json({
      error: "addressId Required!",
    });
  } else if (!paymentMethod) {
    return res.status(400).json({
      error: "paymentMethod is not found!",
    });
  } else if (!paymentStatus) {
    return res.status(400).json({
      error: "paymentStatus is not found!",
    });
  } else if (
    !["COD", "UPI", "CARD", "PAYPAL", "NET_BANKING", "WALLET"].includes(
      paymentMethod.toUpperCase(),
    )
  ) {
    return res.status(400).json({
      error: "paymentMethod is Invalid!",
    });
  } else if (
    !["PENDING", "SUCCESS", "FAILED", "REFUNDED"].includes(
      paymentStatus.toUpperCase(),
    )
  ) {
    return res.status(400).json({
      error: "paymentStatus is Invalid!",
    });
  } else {
    next();
  }
};
