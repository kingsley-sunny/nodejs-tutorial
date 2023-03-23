const { ObjectId } = require("mongodb");
const { getDb } = require("../database/database");

class User {
  constructor(name, email, cart, _id) {
    this.name = name;
    this.email = email;
    this.cart = cart || { items: [] };
    this._id = _id || undefined;
  }

  async save() {
    try {
      const db = getDb();
      const response = await db
        .collection("users")
        .insertOne({ name: this.name, email: this.email, cart: this.cart });
      return response;
    } catch (error) {
      throw Error(error);
    }
  }

  static async findById(userId) {
    try {
      const db = getDb();
      const response = await db.collection("users").findOne({ _id: ObjectId(userId) });
      return response;
    } catch (error) {
      throw Error(error);
    }
  }

  async addToCart(productId) {
    const newQuantity = 1;
    try {
      const db = getDb();
      // first check if the product id is in the cart
      const cartItems = this.cart.items;
      const foundedProduct = cartItems.find(product => product.productId.toString() === productId);
      // if it is in the cart, increase the quantity
      if (foundedProduct) {
        foundedProduct.quantity += newQuantity;
        foundedProduct.productId = ObjectId(productId);
      } else {
        // else add the product to the cart
        cartItems.push({ productId: ObjectId(productId), quantity: newQuantity });
      }
      const response = await db
        .collection("users")
        .updateOne({ _id: ObjectId(this._id) }, { $set: { cart: { items: [...cartItems] } } });
      return response;
    } catch (error) {
      throw Error(error);
    }
  }

  async getCart() {
    const db = getDb();
    // we first find the cart
    const cart = this.cart;
    // since we reference the product Id in the cart, we will get all the products that are in the cart
    const cartProductIds = cart.items.map(product => product.productId);
    try {
      const products = await db
        .collection("products")
        .find({ _id: { $in: cartProductIds } })
        .toArray();
      products.map((product, i) => {
        product.quantity = cart.items[i].quantity;
        return product;
      });

      return products;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProductFromCart(productId) {
    const db = getDb();
    const userId = this._id;
    const cartItems = this.cart.items;
    const updatedCartItems = cartItems.filter(
      cart => cart.productId.toString() !== productId.toString()
    );
    try {
      const response = db
        .collection("users")
        .updateOne({ _id: userId }, { $set: { cart: { items: [...updatedCartItems] } } });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async addOrder() {
    const db = getDb();
    const products = await this.getCart();
    const order = {
      products,
      user: {
        _id: this._id,
        name: this.name,
      },
    };
    const response = await db.collection("orders").insertOne(order);
    await db.collection("users").updateOne({ _id: this._id }, { $set: { cart: { items: [] } } });
    return response;
  }

  async getOrders() {
    const db = getDb();
    const orders = await db.collection("orders").find({ "user._id": this._id }).toArray();
    return orders;
  }
}

exports.User = User;
