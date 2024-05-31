const CartModel = require("../models/cart.model")
const ProductModel = require("../models/product.model")

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
            const cart = await CartModel.findOne(id)
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

    async addProductToExistingCart(cid, pid, quantity) {
        try {

            const cart = await CartModel.findOne({ _id: cid })
            console.log("CARRITO ENCONTRADO => ", cart)

            const productToAdd = await ProductModel.findById(pid)
            console.log("PRODUCTO ENCONTRADO => ", productToAdd)


            // Verificacion si el producto ya esta en el carrito
            let found = cart.products.find(productToAdd => {
                return (productToAdd._id.toString() === pid)
            })
            console.log(found)


            // Si no esta, lo agrego
            if (!found) {
                const cartUpdate = await CartModel.updateOne({ _id: cid }, { $push: { products: { _id: pid, quantity } } })
                return cartUpdate

                // Si ya esta en el carrito, actualizo la cantidad.
            } else if (found) {
                console.log("FOUND ENCONTRADO => ", found)
                quantity += found.quantity

                try {
                    const cartUpdate = await CartModel.updateOne({ _id: cid, "products._id": pid }, { $set: { "products.$.quantity": quantity } })

                    console.log(`CART ACTUALIZADO: ${await CartModel.findOne({ _id: cid })}`);
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

    async updateProductFromExistingCart(cid, pid, quantity) {
        try {
            const cart = await CartModel.findOne({ _id: cid })
            console.log("CARRITO ENCONTRADO => ", cart)

            const productToAdd = await ProductModel.findById(pid)
            console.log("PRODUCTO ENCONTRADO => ", productToAdd)

            // Verificacion si el producto ya esta en el carrito
            let found = cart.products.find(productToAdd => {
                return (productToAdd._id.toString() === pid)
            })
            console.log(found)

            // Si está, actualizo la cantidad.
            if (found) {
                console.log("FOUND ENCONTRADO => ", found)
                found.quantity = quantity

                const cartUpdate = await CartModel.updateOne({ _id: cid, "products._id": pid }, { $set: { "products.$.quantity": quantity } })

                console.log(`CART ACTUALIZADO: ${await CartModel.findOne({ _id: cid })}`);
                return cartUpdate
            }
        }
        catch (err) {
            console.log("Error en CartsDAO - updateProductFromExistingCart => ", err)
            return null

        }
    }

    async deleteProductFromExistingCart(cid, pid) {
        try {
            const cart = await CartModel.findOne({ _id: cid })
            console.log("CARRITO ENCONTRADO => ", cart)
            if (!cart) throw new Error('cart not found');

            const product = await ProductModel.findOne({ _id: pid })
            product.toObject()
            console.log("PRODUCTO ENCONTRADO => ", product)
            if (!product) throw new Error('product not found');


            const cartUpdate = await CartModel.updateOne({ _id: cid }, { $pull: { products: { _id: pid } } })
            return cartUpdate

        }
        catch (err) {
            console.log("Error en CartsDAO - deleteProductFromExistingCart => ", err)
            return null
        }
    }

    async clearCart(cid) {
        try {
            const cart = await CartModel.findOne({ _id: cid });
            if (!cart) throw new Error('cart not found');

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
            if (cartDelete.deletedCount == 0) {
                throw new Error('cart not found');
            }
            // console.log(`Carrito eliminado: ${cartDelete}`);
            return cartDelete;
        }
        catch (err) {
            console.log("Error en CartsDAO - deleteCart => ", err)
            return null
        }
    }
}

module.exports = { CartsDAO }

