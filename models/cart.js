const path = require("path");
const fs = require("fs");

const p = path.join(path.dirname(require.main.filename), "data", "cart.json");

const getCartFromFile = cb => {
    fs.readFile(p, (err, data) => {
        let initialData = {
            products: [],
            totalPrice: 0,
            totalQuantity: 0,
        };

        if (!err) {
            initialData = JSON.parse(data);
        }

        cb(initialData);
    });
};

module.exports = class Cart {
    static addToCart(product, cb) {
        getCartFromFile(cart => {
            // check if there is a prduct
            let updatedCart = { ...cart };
            if (product) {
                // check if that product is not in existense in the product array
                const gottenProduct = updatedCart.products.find(p => p.id === product.id);
                if (!gottenProduct) {
                    console.log("heleo");
                    // push to the product array
                    updatedCart.products.push(product);
                }
                // update the total quantity and the total price
                const updatedTotalPrice = +product.price + updatedCart.totalPrice;
                const updatedTotalQuantity = updatedCart.totalQuantity + 1;

                updatedCart = {
                    ...updatedCart,
                    totalPrice: updatedTotalPrice,
                    totalQuantity: updatedTotalQuantity,
                };
            }

            fs.writeFile(p, JSON.stringify({ ...updatedCart }), (err, data) => {
                cb(data);
            });
        });
    }
};
