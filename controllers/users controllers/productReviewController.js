const { default: mongoose } = require("mongoose");
const ProductReviewModel = require("../../models/productReviewModel");
const getUserUtils = require("../../utils/getUsersMethods");

exports.addProductReview = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;
  const { rating, comment } = req.body;
  try {
    ProductReviewModel.findOneAndUpdate(
      { userId, productId },
      { $set: { rating, comment } },
      { new: true, upsert: true },
    ).then(() => {
      res.status(201).json({
        success: true,
        message: "Product review added successfully",
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add product review",
      error: error.message,
    });
  }
};

exports.getProductReviewByProductId = async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await ProductReviewModel.aggregate([
      {
        $match: {
          productId: new mongoose.Types.ObjectId(productId),
        },
      },

      /// user
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },

      /// product
      {
        $lookup: {
          from: "product", // FIXED
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: {
          path: "$product",
        },
      },

      /// category
      {
        $lookup: {
          from: "categorie", // FIXED
          localField: "product.categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
        },
      },

      /// result
      {
        $group: {
          _id: "$product._id",

          product: {
            $first: {
              productName: "$product.productName",
              productDetails: "$product.productDetails",
              productImageUrl: "$product.productImageUrl",
              productPrice: "$product.productPrice",
            },
          },

          category: {
            $first: {
              categoriesName: "$category.categoriesName",
              description: "$category.description",
            },
          },

          reviews: {
            $push: {
              createdAt: "$createdAt",
              rating: "$rating", // FIXED
              comment: "$comment",
              user: {
                _id: "$user._id",
                fullName: "$user.fullName",
                username: "$user.username",
                email: "$user.email",
              },
            },
          },
        },
      },
    ]);
    if (reviews[0] === undefined) {
      res.status(200).json({
        success: true,
        message: "No reviews found",
        data: [],
      });
    } else {
      res.status(200).json({
        success: true,
        data: reviews[0],
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product reviews",
      error: error.message,
    });
  }
};

exports.getProductReviewByProductIdAndUserId = async (req, res) => {
  const { productId, userId } = req.query;

  try {
    const reviews = await ProductReviewModel.aggregate([
      /// user
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      /// product
      { $match: { productId: new mongoose.Types.ObjectId(productId) } },
      {
        $lookup: {
          from: "product",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },

      /// category
      {
        $lookup: {
          from: "categorie",
          localField: "product.categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },

      /// result
      {
        $group: {
          _id: "$product._id",
          product: {
            $first: {
              productName: "$product.productName",
              productDetails: "$product.productDetails",
              productImageUrl: "$product.productImageUrl",
              productPrice: "$product.productPrice",
            },
          },
          category: {
            $first: {
              categoriesName: "$category.categoriesName",
              description: "$category.description",
            },
          },
          user: {
            $first: {
              fullName: "$user.fullName",
              username: "$user.username",
              email: "$user.email",
            },
          },
          reviews: {
            $first: {
              rating: "$rating",
              comment: "$comment",
            },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: reviews[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch review details",
      error: error.message,
    });
  }
};

exports.getProductReviewByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const reviews = await ProductReviewModel.aggregate([
      /// user
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },

      /// product
      {
        $lookup: {
          from: "product",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      /// category
      {
        $lookup: {
          from: "categorie",
          localField: "product.categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },

      /// result
      {
        $group: {
          _id: "$user._id",
          user: {
            $first: {
              fullName: "$user.fullName",
              username: "$user.username",
              email: "$user.email",
            },
          },
          reviews: {
            $push: {
              createdAt: "$createdAt",
              rating: "$rating",
              comment: "$comment",
              product: {
                productName: "$product.productName",
                productDetails: "$product.productDetails",
                productImageUrl: "$product.productImageUrl",
                productPrice: "$product.productPrice",
              },
              category: {
                categoriesName: "$category.categoriesName",
                description: "$category.description",
              },
            },
          },
        },
      },
    ]);
    res.status(200).json({
      success: true,
      data: reviews[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user reviews",
      error: error.message,
    });
  }
};
