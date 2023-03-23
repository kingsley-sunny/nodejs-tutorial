const { ObjectId, ObjectID } = require("mongodb");
const { getDb } = require("../database/database");

class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  async save() {
    try {
      const db = getDb();
      const result = await db.collection("products").insertOne(this);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  static async fetchAll() {
    try {
      const db = getDb();
      const rawProducts = await db.collection("products").find().toArray();
      return rawProducts;
    } catch (error) {
      console.log(error);
    }
  }

  static async fetchOne(id) {
    try {
      const db = await getDb().collection("products").findOne(new ObjectId(id));
      return db;
    } catch (error) {}
  }

  static async updateOne(id, details) {
    try {
      const db = await getDb()
        .collection("products")
        .updateOne({ _id: new ObjectId(id) }, { $set: details });
      return db;
    } catch (error) {
      throw Error(error);
    }
  }

  static async deleteOne(id) {
    try {
      const db = await getDb();

      // Delete all the deleted product from all the users cart
      const response = await db
        .collection("users")
        .updateMany(
          { "cart.items.productId": new ObjectId(id) },
          { $pull: { "cart.items": { productId: new ObjectId(id), quantity: { $gte: 0 } } } }
        );

      // delete the product
      await db.collection("products").deleteOne({ _id: new ObjectId(id) });

      return response;
    } catch (error) {
      throw Error(error);
    }
  }
}

module.exports.Product = Product;
