const Product = require("../models/product");
const Cart = require("../models/cart");
const { CartItem } = require("../models/cart-item");
const { User } = require("../models/user");
const { OrderItem } = require("../models/orderItem");
const { Orders } = require("../models/orders");

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
      products: cart,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postCart = async (req, res, next) => {
  const productId = req.body.productId;
  try {
    const product = await Product.findByPk(productId);

    const cartItems = await CartItem.findAll({
      where: { cartId: req.cart.id, productId: productId },
    });
    const cartItem = cartItems[0];

    if (!cartItem) {
      await CartItem.create({
        name: product.title,
        quantity: 1,
        cartId: req.cart.id,
        productId: productId,
      });
      return res.redirect("/cart");
    }

    cartItem.quantity += 1;
    await cartItem.save();
    return res.redirect("/cart");
  } catch (error) {
    console.log(error);
  }
};

exports.deleteCart = async (req, res, next) => {
  const productId = req.body.productId;
  try {
    const response = await CartItem.destroy({
      where: { cartId: req.cart.id, productId: productId },
    });
    console.log(response);
    return res.redirect("/cart");
  } catch (error) {
    console.log(error);
  }
};

exports.getOrders = async (req, res, next) => {
  const orders = await req.user.getOrders({ include: "products" });

  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
    orders: orders,
  });
};

exports.createOrder = async (req, res, next) => {
  try {
    const order = await req.user.createOrder();
    const cartItems = await CartItem.findAll({ where: { cartId: req.cart.id } });

    const formattedCartItems = cartItems.map(item => {
      return {
        quantity: item.quantity,
        orderId: order.id,
        productId: item.productId,
      };
    });
    await OrderItem.bulkCreate(formattedCartItems, { returning: true });
    await CartItem.destroy({ where: { cartId: req.cart.id } });

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
