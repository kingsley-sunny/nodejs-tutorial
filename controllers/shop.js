const Product = require("../models/product");
const Cart = require("../models/cart");
const { CartItem } = require("../models/cart-item");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    return res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getProduct = async (req, res) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findByPk(productId);
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
    const products = await Product.findAll();
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
    const cart = await CartItem.findAll();
    return res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      cart: cart,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postCart = async (req, res, next) => {
  const productId = req.body.productId;
  try {
    const product = await Product.findByPk(productId);
    console.log(req.user);
    await CartItem.create({ name: product.title, quantity: 1, cartId: 1, productId: productId });
    res.redirect("/cart");
  } catch (error) {
    console.log(error);
  }
};

exports.deleteCart = async (req, res, next) => {
  const productId = req.body.productId;
  Cart.deleleCart(productId, () => {
    res.redirect("/cart");
  });
};

exports.getOrders = async (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = async (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
