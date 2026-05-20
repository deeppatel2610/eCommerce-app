exports.requiredFieldForProductReview = (req, res, next) => {
  const { productId } = req.params;
  const { userId, rating } = req.body;

  if (!Number.isFinite(rating)) {
    return res.status(400).json({
      success: false,
      message: "Rating must be a number",
    });
  }
  if (!productId) {
    return res.status(400).json({
      success: false,
      message: "Product ID is required",
    });
  } else if (!rating) {
    return res.status(400).json({
      success: false,
      message: "Rating is required",
    });
  } else {
    next();
  }
};

// Keep old export for backward compatibility
exports.requiredFieldForProductRivew = exports.requiredFieldForProductReview;
