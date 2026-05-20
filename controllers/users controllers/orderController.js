const { default: mongoose } = require("mongoose");
const CartModel = require("../../models/cartModel");
const OrderModel = require("../../models/OrderModel");
const ProductModel = require("../../models/productModel");

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await CartModel.findOne({ userId });

    if (!cart) {
      cart = new CartModel({
        userId,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        price: product.productPrice,
      });
    }

    await cart.save();

    return res.status(201).json({
      success: true,
      message: "Product added to cart successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
      error: error.message,
    });
  }
};

exports.removeOneProduct = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    let cart = await CartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    if (cart.items.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId,
    );

    await cart.save();
    return res.status(200).json({
      success: true,
      message: "Product removed successfully",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to remove product",
      error: error.message,
    });
  }
};

exports.removeAllProduct = async (req, res) => {
  const userId = req.user.id;

  try {
    let cart = await CartModel.findOneAndDelete({ userId });
    return res.status(200).json({
      success: true,
      message: "All products removed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to remove all products",
      error: error.message,
    });
  }
};

exports.getCartList = async (req, res) => {
  const userId = req.user.id;
  try {
    const cart = await CartModel.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) },
      },

      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user" } },

      {
        $lookup: {
          from: "product",
          localField: "items.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: {
          path: "$product",
        },
      },

      {
        $lookup: {
          from: "categorie",
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

      {
        $unwind: "$items",
      },
      {
        $match: {
          $expr: {
            $eq: ["$items.productId", "$product._id"],
          },
        },
      },

      {
        $group: {
          _id: "$_id",
          user: {
            $first: {
              _id: "$user._id",
              fullName: "$user.fullName",
              username: "$user.username",
              email: "$user.email",
            },
          },
          items: {
            $push: {
              _id: "$product._id",
              quantity: "$items.quantity",
              productName: "$product.productName",
              productDetails: "$product.productDetails",
              productImageUrl: "$product.productImageUrl",
              productPrice: "$product.productPrice",
              category: {
                id: "$category._id",
                categoriesName: "$category.categoriesName",
                description: "$category.description",
              },
            },
          },
        },
      },
    ]).then((cart) => {
      if (cart.length === 0) {
        return res.status(200).json({
          data: {},
        });
      } else {
        let totalItems = 0;
        let subtotal = 0;
        for (let i = 0; i < cart[0].items.length; i++) {
          totalItems = totalItems + cart[0].items[i].quantity;
          if (cart[0].items[i].quantity > 1) {
            let totalPrice =
              cart[0].items[i].productPrice * cart[0].items[i].quantity;
            subtotal = subtotal + totalPrice;
            totalPrice = 0;
          } else {
            subtotal = subtotal + cart[0].items[i].productPrice;
          }
        }

        cart[0].totalItems = totalItems;
        cart[0].subtotal = subtotal;

        return res.status(200).json({
          data: cart[0],
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart list",
      error: error.message,
    });
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const { productId, quantity, isAdd = true } = req.body;
    const userId = req.user.id;

    const cart = await CartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        error: "Cart not found.",
      });
    }

    if (cart.items.length === 0) {
      return res.status(404).json({
        error: "Cart items not found.",
      });
    }

    const cartItem = cart.items.find(
      (item) => item.productId.toString() === productId,
    );

    if (!cartItem) {
      return res.status(404).json({
        error: "Product not found in cart.",
      });
    }

    const finalQuantity = isAdd
      ? cartItem.quantity + quantity
      : cartItem.quantity - quantity;

    if (finalQuantity <= 0) {
      return res.status(400).json({
        error: "Calculated quantity must be greater than 0.",
      });
    }

    cartItem.quantity = finalQuantity;

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Quantity updated successfully",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update quantity",
      error: error.message,
    });
  }
};

exports.addOrder = async (req, res) => {
  const { cartId, addressId, paymentMethod, paymentStatus } = req.body;
  const userId = req.user.id;
  try {
    const Order = new OrderModel({
      userId,
      cartId,
      addressId,
      payment: {
        paymentMethod: paymentMethod.toUpperCase(),
        paymentStatus: paymentStatus.toUpperCase(),
      },
    });

    await Order.save().then(() => {
      return res.status(201).json({
        success: true,
        message: "Order created successfully",
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

exports.getOrderHistory = async (req, res) => {
  const userId = req.user.id;
  try {
    const Orders = await OrderModel.find({ userId });

    if (!Orders || Orders.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No orders found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      data: Orders.map((e) => {
        return {
          OrderId: e._id,
          OrderTime: e.createdAt,
        };
      }),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order history",
      error: error.message,
    });
  }
};

exports.getOrderBill = async (req, res) => {
  const { OrderId } = req.params;
  try {
    const OrderBill = await OrderModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(OrderId) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "cart",
          localField: "cartId",
          foreignField: "_id",
          as: "cartList",
        },
      },
      { $unwind: "$cartList" },
      {
        $lookup: {
          from: "product",
          localField: "cartList.items.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $lookup: {
          from: "categorie",
          localField: "product.categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $lookup: {
          from: "address",
          localField: "addressId",
          foreignField: "_id",
          as: "address",
        },
      },
      { $unwind: "$address" },

      {
        $unwind: "$cartList.items",
      },
      {
        $match: {
          $expr: {
            $eq: ["$cartList.items.productId", "$product._id"],
          },
        },
      },

      ///
      {
        $group: {
          _id: "$_id",
          orderDate: { $first: "$createdAt" },
          payment: {
            $first: {
              paymentMethod: "$payment.paymentMethod",
              paymentStatus: "$payment.paymentStatus",
            },
          },
          user: {
            $first: {
              _id: "$user._id",
              fullName: "$user.fullName",
              username: "$user.username",
              email: "$user.email",
              phoneNumber: "$address.phoneNumber",
            },
          },
          address: {
            $first: {
              addressLine1: "$address.addressLine1",
              addressLine2: "$address.addressLine2",
              city: "$address.city",
              state: "$address.state",
              pincode: "$address.pincode",
            },
          },
          items: {
            $push: {
              _id: "$product._id",
              productName: "$product.productName",
              quantity: "$cartList.items.quantity",
              productDetails: "$product.productDetails",
              productImageUrl: "$product.productImageUrl",
              productPrice: "$product.productPrice",
              category: {
                id: "$category._id",
                categoriesName: "$category.categoriesName",
                description: "$category.description",
              },
            },
          },
        },
      },
    ]).then((Order) => {
      if (Order.length === 0) {
        return res.status(200).json({
          data: {},
        });
      } else {
        let totalItems = 0;
        let subtotal = 0;
        for (let i = 0; i < Order[0].items.length; i++) {
          totalItems = totalItems + Order[0].items[i].quantity;
          if (Order[0].items[i].quantity > 1) {
            let totalPrice =
              Order[0].items[i].productPrice * Order[0].items[i].quantity;
            subtotal = subtotal + totalPrice;
            totalPrice = 0;
          } else {
            subtotal = subtotal + Order[0].items[i].productPrice;
          }
        }
        Order[0].payment.totalItems = totalItems;
        Order[0].payment.totalAmount = subtotal;
        return res.status(200).json({ data: Order[0] });
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order bill",
      error: error.message,
    });
  }
};
