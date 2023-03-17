const Cart = require("../models/cart");
const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    edit: false,
  });
};

exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  // automatically sequelize will make a createProduct method
  try {
    await req.user.createProduct({ title, imageUrl, price, description });
    return res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};

exports.getEditProduct = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const products = await req.user.getProducts({ where: { id: productId } });
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
  } catch (error) {
    console.log(error);
  }
};

exports.postEditProduct = async (req, res, next) => {
  const product = req.body;
  const id = product.id;
  const title = product.title;
  const imageUrl = product.imageUrl;
  const description = product.description;
  const price = product.price;

  try {
    await Product.update({ title, id, imageUrl, description, price }, { where: { id: id } });
    res.redirect("/admin/products");
  } catch (error) {
    console.log(error);
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  const productId = req.body.id;
  try {
    const product = await Product.findByPk(productId);
    await product.destroy();
    res.redirect("/admin/products");
  } catch (error) {
    console.log(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await req.user.getProducts();
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  } catch (error) {
    console.log(error);
  }
};
