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
                const updatedProduct = {
                    ...product,
                    qty: 1,
                    price: +product.price,
                    actualPrice: +product.price,
                };
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
                const updatedTotalPrice = updatedProduct.price + updatedCart.totalPrice;
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

    static deleleCart(id, cb) {
        getCartFromFile(cartData => {
            let updatedCartData = { ...cartData };
            // check if the product is in the cart
            const product = cartData.products.find(p => p.id === id);
            // if there is product
            if (product) {
                // check if the quantity of the product is greater than one
                if (product.qty > 1) {
                    // subtract the quantity and the price frm the product
                    product.qty += -1;
                } else {
                    // else
                    // remove the product and subtract the quantity and the price frm the product
                    const filterdProducts = updatedCartData.products.filter(
                        p => p.id !== product.id
                    );
                    updatedCartData.products = [...filterdProducts];
                }
                // substract the totalQuantity by one and the totalPrice by the Product price
                updatedCartData.totalQuantity += -1;
                updatedCartData.totalPrice = Number(
                    (updatedCartData.totalPrice - Number(product.actualPrice)).toFixed(2)
                );

                // add to the cart.json file and then call the callback
                fs.writeFile(p, JSON.stringify({ ...updatedCartData }), (err, data) => {
                    cb();
                });
            } else {
                cb();
            }
        });
    }
};
