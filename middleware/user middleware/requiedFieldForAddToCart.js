exports.requiredFieldForAddToCart = (req, res, next) => {
  const { productId, quantity = 1 } = req.body;

  if (!Number.isFinite(quantity)) {
    return res.status(400).json({
      error: "quantity use only number!!",
    });
  } else if (!productId || quantity < 1) {
    return res.status(400).json({
      message: "Invalid product or quantity",
    });
  } else if (!productId) {
    return res.status(400).json({
      error: "ProductId required in path For Add To Cart!!",
    });
  } else {
    next();
  }
};
