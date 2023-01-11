const fs = require("fs");
const path = require("path");

const p = path.join(path.dirname(process.mainModule.filename), "data", "products.json");

const getProductsFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
};

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile(products => {
            let upadatedProducts = [...products];
            if (this.id) {
                const foundedProductIndex = products.findIndex(p => p.id === this.id);
                upadatedProducts[foundedProductIndex] = { ...this };
            } else {
                this.id =
                    (Date.now() + Math.random()).toString(36).substring(0, 8) +
                    (Date.now() + Math.random()).toString(36).substring(0, 8);
                upadatedProducts.push(this);
            }
            fs.writeFile(p, JSON.stringify(upadatedProducts), err => {
                console.log(err);
            });
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static fetchById(id, cb) {
        getProductsFromFile(fileData => {
            const foundProduct = fileData.find(product => product.id === id);

            if (foundProduct) {
                cb(foundProduct);
                return;
            }
            cb(null);
        });
    }
};
