const Product = require("../../models/productModel");
const CartModel = require("../../models/cartModel");

const checkMaxQuantity = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const cart = await CartModel.findOne({ userId: userId });

    let existingQty = 0;

    if (cart) {
      const item = cart.items.find((i) => i.productId.toString() === productId);

      if (item) {
        existingQty = item.quantity;
      }
    }

    const totalQty = existingQty + quantity;

    if (totalQty > product.productQuantity) {
      return res.status(400).json({
        message: `Only ${product.productQuantity} items available, you already have ${existingQty} in cart`,
      });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = checkMaxQuantity;
