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
    // automatically sequelize will make a createProduct method
    req.user
        .createProduct({ title, imageUrl, price, description })
        .then(result => {
            return res.redirect("/");
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getEditProduct = (req, res, next) => {
    const productId = req.params.productId;
    req.user.getProducts({ where: { id: productId } }).then(products => {
        const product = products[0];
        if (product) {
            return res.render("admin/edit-product", {
                pageTitle: "Edit Product",
                path: "/admin/Edit-product",
                edit: true,
                product: product,
            });
        }
        return res.redirect("/");
    });
};

exports.postEditProduct = (req, res, next) => {
    const product = req.body;
    const id = product.id;
    const title = product.title;
    const imageUrl = product.imageUrl;
    const description = product.description;
    const price = product.price;

    Product.update({ title, id, imageUrl, description, price }, { where: { id: id } })
        .then(() => res.redirect("/admin/products"))
        .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.id;
    Product.findByPk(productId)
        .then(product => {
            product.destroy().then(() => res.redirect("/admin/products"));
        })
        .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
    req.user
        .getProducts()
        .then(products => {
            res.render("admin/products", {
                prods: products,
                pageTitle: "Admin Products",
                path: "/admin/products",
            });
        })
        .catch(err => console.log(err));
};
