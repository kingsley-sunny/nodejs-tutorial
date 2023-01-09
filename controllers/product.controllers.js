const ProductModel = require("../model/product");

module.exports.getAddProductPage = (req, res, next) => {
    res.render("add-product", {
        documentTitle: "Add Product",
        path: "/admin/add-product",
        productCSS: true,
        formCSS: true,
        addProductIsActive: true,
    });
};

module.exports.postAProduct = (req, res) => {
    const body = req.body;
    const productsModel = new ProductModel(body.title);
    productsModel.save();
    res.redirect("/");
};

module.exports.getProductsPage = (req, res, next) => {
    const products = ProductModel.fetchAll().then(fileData => {
        res.render("shop", {
            products: fileData,
            documentTitle: "My Shop",
            path: "/",
            hasProduct: fileData.length > 0,
            productCSS: true,
            shopIsActive: true,
        });
    });
};
