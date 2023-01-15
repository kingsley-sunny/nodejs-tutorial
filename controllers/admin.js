const Cart = require("../models/cart");
const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        edit: false,
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    Product.create({ title, imageUrl, price, description })
        .then(res => {
            return res.redirect("/");
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getEditProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.fetchById(productId, product => {
        console.log(product);
        if (product) {
            return res.render("admin/edit-product", {
                pageTitle: "Edit Product",
                path: "/admin/Edit-product",
                edit: true,
                product: product,
            });
        }

        res.redirect("/");
    });
};

exports.postEditProduct = (req, res, next) => {
    const product = req.body;
    const productModel = new Product(
        product.id,
        product.title,
        product.imageUrl,
        product.description,
        product.price
    );
    productModel.save();
    res.redirect("/admin/products");
};

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.id;
    Product.delete(productId, () => {
        Cart.deleleCart(productId, () => {
            res.redirect("/admin/products");
        });
    });
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(([products]) =>
            res.render("admin/products", {
                prods: products,
                pageTitle: "Admin Products",
                path: "/admin/products",
            })
        )
        .catch(err => console.log(err));
};
