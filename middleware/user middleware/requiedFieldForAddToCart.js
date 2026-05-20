exports.requiredFieldForAddToCart = (req, res, next) => {
  const { productId, quantity = 1 } = req.body;

  if (!Number.isFinite(quantity)) {
    return res.status(400).json({
      success: false,
      message: "Quantity must be a number",
    });
  } else if (!productId || quantity < 1) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID or quantity",
    });
  } else {
    next();
  }
};
