exports.productValidation = (req, res, next) => {
  const {
    productName,
    productQuantity,
    productQuality,
    productDetails,
    productPrice,
  } = req.body;
  const productImageUrl = req.file.path;
  let fieldError = {};
  if (!productName) {
    fieldError.productName = "Product Name is require!";
  } else if (!productQuantity) {
    fieldError.productQuantity = "Product Quantity is require!";
  } else if (!productQuality) {
    fieldError.productQuality = "Product Quality is require!";
  } else if (!productPrice) {
    fieldError.productQuantity = "Product Priceis is require!";
  } else if (!productDetails) {
    fieldError.productDetails = "product Details is require!";
  } else if (!productImageUrl) {
    fieldError.productImageUrl = "product image is require!";
  }
  if (Object.keys(fieldError).length > 0) {
    return res.render("addProduct", {
      error: "Please fix the errors below",
      fieldError,
      formData: req.body,
    });
  } else {
    next();
  }
};
