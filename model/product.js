const fs = require("fs");
const rootDir = require("../utils/path");
const path = require("path");

const filePath = path.join(rootDir, "data", "products.json");

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
        fs.readFile(filePath, (err, fileData) => {
            let products = [];

            if (!err) {
                console.log(fileData.toString());
                products = JSON.parse(fileData.toString());
            }
            products.push(this);
            fs.writeFile(filePath, JSON.stringify(products), err => {});
        });
    }

    static fetchAll() {
        let initialData = [];
        return new Promise(res =>
            fs.readFile(filePath, (err, data) => {
                if (!err) {
                    initialData = JSON.parse(data.toString());
                }
                return res(initialData);
            })
        );
    }
};
