const ProductModel = require("../../models/productModel");

exports.getAllProduct = async (req, res) => {
  const { page, limit, productName, categoryId } = req.query;
  try {
    let productLimit = parseInt(limit);
    if (limit === undefined || limit <= 0) {
      productLimit = 5;
    } else {
      productLimit = limit;
    }
    const skip = (page - 1) * productLimit;
    let product;
    if (productName !== undefined && categoryId !== undefined) {
      product = await ProductModel.find({
        categoryId,
        productName: { $regex: productName, $options: "i" },
      })
        .skip(skip)
        .limit(productLimit)
        .exec();
    } else if (categoryId !== undefined) {
      product = await ProductModel.find({
        categoryId,
      })
        .skip(skip)
        .limit(productLimit)
        .exec();
    } else if (productName !== undefined) {
      product = await ProductModel.find({
        productName: { $regex: productName, $options: "i" },
      })
        .skip(skip)
        .limit(productLimit)
        .exec();
    } else {
      product = await ProductModel.find().skip(skip).limit(productLimit).exec();
    }

    res.status(200).json({
      page,
      limit,
      data: product.map((e) => {
        return {
          id: e._id,
          productName: e.productName,
          productQuality: e.productQuality,
          productImageUrl: e.productImageUrl,
          productPrice: e.productPrice,
          categoryId: e.categoryId,
        };
      }),
    });
  } catch (error) {
    res.status(500).json({
      errer: error.message,
    });
  }
};

exports.getProductDetail = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await ProductModel.findById(productId);

    res.status(200).json({
      data: {
        id: product._id,
        productName: product.productName,
        productDetails: product.productDetails,
        productQuantity: product.productQuantity,
        productQuality: product.productQuality,
        imageUrl: product.productImageUrl,
        productPrice: product.productPrice,
        categoryId: product.category,
        productReview: product.productReview,
      },
    });
  } catch (error) {
    res.status(500).json({
      errer: error.message,
    });
  }
};

exports.getRandomProduct = async (req, res) => {
  const { limit } = req.query;
  try {
    let productLimit = parseInt(limit);
    if (limit === undefined || limit <= 0) {
      productLimit = 5;
    }
    let product;
    product = await ProductModel.aggregate([
      { $sample: { size: productLimit } },
    ]);
    res.status(200).json({
      page: 0,
      limit,
      data: product.map((e) => {
        return {
          id: e._id,
          productName: e.productName,
          productQuality: e.productQuality,
          productImageUrl: e.productImageUrl,
          productPrice: e.productPrice,
          categoryId: e.categoryId,
        };
      }),
    });
  } catch (error) {
    res.status(500).json({
      errer: error.message,
    });
  }
};
