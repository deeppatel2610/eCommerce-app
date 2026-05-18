exports.requiredFieldForProductRivew = (req, res, next) => {
  const { productId } = req.params;
  const { userId, rating } = req.body;

  if (!Number.isFinite(rating)) {
    return res.status(400).json({
      error: "rating use only number!!",
    });
  }
  if (!productId) {
    return res.status(400).json({
      error: "ProductId required in path For Review!!",
    });
  } else if (!rating) {
    return res.status(400).json({
      error: "rating is required Field For Review!!",
    });
  } else {
    next();
  }
};
