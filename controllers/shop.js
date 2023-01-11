const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render("shop/product-list", {
            prods: products,
            pageTitle: "All Products",
            path: "/products",
        });
    });
};

exports.getProduct = (req, res) => {
    const productId = req.params.productId;
    Product.fetchById(productId, product => {
        if (!product) {
            return res.redirect("/404");
        }
        return res.render("shop/product-detail", {
            pageTitle: product.title,
            product,
            path: "/products",
        });
    });
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll(products => {
        res.render("shop/index", {
            prods: products,
            pageTitle: "Shop",
            path: "/",
        });
    });
};

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            cart: cart,
        });
    });
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.fetchById(productId, product => {
        Cart.addToCart(product, data => {
            res.redirect("/cart");
        });
    });
};

exports.getOrders = (req, res, next) => {
    res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
    });
};

exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", {
        path: "/checkout",
        pageTitle: "Checkout",
    });
};
