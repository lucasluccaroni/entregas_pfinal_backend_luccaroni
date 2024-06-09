const CartModel = require("../models/cart.model")

class CartsDAO {

    async prepare() {
        if (CartModel.db.readyState != 1) {
            console.log("Must connect to MongoDB!")
            return null
        }
    }

    async getCarts() {
        try {
            const carts = await CartModel.find()
            return carts.map(c => c.toObject())
        }
        catch (err) {
            console.log("Error en CartsDAO - getCarts => ", err)
            return null
        }
    }

    async getCartById(id) {
        try {
            const cart = await CartModel.findOne({_id: id})
            return cart ?? false
        }
        catch (err) {
            console.log("Error en CartsDAO - getCartById => ", err)
            return null
        }
    }

    async createCart() {
        try {
            const newCart = await CartModel.create({ products: [] })
            return newCart
        }
        catch (err) {
            console.log("Error en CartsDAO - createCart => ", err)
            return null
        }
    }

    async addProductToExistingCart(productExistInCart, cartId, productId, quantity) {
        try {
            // Si no esta el producto, lo agrego
            if (!productExistInCart) {
                const cartUpdate = await CartModel.updateOne({ _id: cartId }, { $push: { products: { _id: productId, quantity } } })
                return cartUpdate

                // Si ya esta en el carrito, actualizo la cantidad.
            } else if (productExistInCart) {
                try {
                    const cartUpdate = await CartModel.updateOne({ _id: cartId, "products._id": productId }, { $set: { "products.$.quantity": quantity } })

                    console.log(`CART ACTUALIZADO: ${await CartModel.findOne({ _id: cartId })}`);
                    return cartUpdate
                }
                catch (err) {
                    console.log("Error en CartsDAO - addProductToExistingCart => ", err)
                    return null
                }
            }
        }
        catch (err) {
            console.log("Error en CartsDAO - addProductToExistingCart => ", err)
            return null
        }
    }

    async updateProductFromExistingCart(cartId, productId, quantity) {
        try {          
            const cartUpdate = await CartModel.updateOne({ _id: cartId, "products._id": productId }, { $set: { "products.$.quantity": quantity } })

            console.log(`CART ACTUALIZADO: ${await CartModel.findOne({ _id: cartId })}`);
            return cartUpdate
        }
        catch (err) {
            console.log("Error en CartsDAO - updateProductFromExistingCart => ", err)
            return null

        }
    }

    async deleteProductFromExistingCart(cartId, productId) {
        try {
            const cartUpdate = await CartModel.updateOne({ _id: cartId }, { $pull: { products: { _id: productId } } })
            return cartUpdate

        }
        catch (err) {
            console.log("Error en CartsDAO - deleteProductFromExistingCart => ", err)
            return null
        }
    }

    async clearCart(cid) {
        try {    
            const cartUpdate = await CartModel.updateOne({ _id: cid }, {
                $set: { products: [] }
            })

            console.log(`Carrito actualizado: ${cartUpdate}`);
            return cartUpdate;
        }
        catch (err) {
            console.log("Error en CartsDAO - clearCart => ", err)
            return null
        }
    }

    async deleteCart(cid) {
        try {
            const cartDelete = await CartModel.deleteOne({ _id: cid });
            return cartDelete;
        }
        catch (err) {
            console.log("Error en CartsDAO - deleteCart => ", err)
            return null
        }
    }
}

module.exports = { CartsDAO }

