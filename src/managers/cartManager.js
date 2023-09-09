
class CartsManager {
    constructor() {
        this.carts = [];
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
