const fs = require('fs');

class CartsManager {

constructor(path) {

this.path = path;

this.carts = [];

this.loadData();

}

loadData() {

if (fs.existsSync(this.path)) {

const data = fs.readFileSync(this.path, 'utf8');

this.carts = JSON.parse(data);

}

}

getAllCarts() {

return this.carts;

}

getCartById(cartId) {

return this.carts.find(cart => cart.id === cartId);

}

createCart() {

const newCartId = this.carts.length > 0 ? Math.max(...this.carts.map(cart => cart.id)) + 1 : 1;

const newCart = {

id: newCartId,

products: []

};

this.carts.push(newCart);

return newCart;

}

}

module.exports = CartsManager;