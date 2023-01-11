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

        if (data.toString()) {
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
                const updatedProduct = { ...product, qty: 1 };
                // check if that product is not in existense in the product array
                const productIndex = updatedCart.products.findIndex(
                    p => p.id === updatedProduct.id
                );
                if (productIndex === -1) {
                    // push to the product array
                    updatedCart.products.push(updatedProduct);
                } else {
                    // update the total quantity
                    updatedCart.products[productIndex].qty += 1;
                }
                // update the total quantity and the total price and the cart quantity
                const updatedTotalPrice = +updatedProduct.price + updatedCart.totalPrice;
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

    static getCart(cb) {
        getCartFromFile(cartData => {
            cb(cartData);
        });
    }
};
