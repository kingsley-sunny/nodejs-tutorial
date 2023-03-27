const { Order } = require("../models/orders");
const { Product } = require("../models/product");
const { User } = require("../models/user");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    return res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  } catch (error) {
    s;
    console.log(error);
  }
};

exports.getProduct = async (req, res) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.redirect("/404");
    }
    return res.render("shop/product-detail", {
      pageTitle: product.title,
      product,
      path: "/products",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.find();
    return res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const products = await req.user.getCart();
    console.log(products);
    return res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postCart = async (req, res, next) => {
  const productId = req.body.productId;
  try {
    await req.user.addToCart(productId);
    return res.redirect("/cart");
  } catch (error) {
    console.log(error);
  }
};

exports.deleteCart = async (req, res, next) => {
  const productId = req.body.productId;
  try {
    await req.user.deleteProductFromCart(productId);
    return res.redirect("/cart");
  } catch (error) {
    console.log(error);
  }
};

exports.getOrders = async (req, res, next) => {
  const userId = req.user._id;
  const orders = await Order.find({ userId: userId });

  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
    orders: orders,
  });
};

exports.createOrder = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const user = await req.user.populate("cart.items.productId");
    const products = user.cart.items.map(item => {
      const product = item.productId._doc;
      return { product: { ...product }, quantity: item.quantity };
    });
    const order = new Order({ userId: userId, products });
    order.save();

    req.user.cart.items = [];
    await req.user.save();

    return res.redirect("/orders");
  } catch (error) {
    console.log(error);
  }
};

exports.getCheckout = async (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
