const { ObjectId } = require("mongodb");
const { Product } = require("../models/product");
const { User } = require("../models/user");
const { default: mongoose } = require("mongoose");

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
  try {
    await new Product({ title, imageUrl, price, description, userId: req.user._id }).save();
    return res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};

exports.getEditProduct = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId);
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
    const product = await Product.updateOne(
      { _id: id, userId: req.user._id },
      { title, id, imageUrl, description, price }
    );
    res.redirect("/admin/products");
  } catch (error) {
    console.log(error);
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  const productId = req.body.id;
  try {
    await User.updateMany(
      { _id: req.user._id },
      {
        $pull: {
          "cart.items": {
            productId: new mongoose.Types.ObjectId(productId),
          },
        },
      }
    );
    await Product.deleteOne({ _id: productId });
    res.redirect("/admin/products");
  } catch (error) {
    console.log(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  } catch (error) {
    console.log(error);
  }
};
