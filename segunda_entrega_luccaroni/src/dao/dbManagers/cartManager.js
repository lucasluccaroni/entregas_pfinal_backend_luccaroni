const CartModel = require("../../models/cart.model")
const ProductModel = require("../../models/product.model")

class CartManager {
    constructor(){ }


    async initialize() {
        if(CartModel.db.readyState != 1){
            throw new Error ("Must connect to MongoDB")
        }
    }


    async getCarts(){
        const carts = await CartModel.find()
        return carts.map(c => c.toObject({virtuals: true}))
    }


    async getCartById(id){
        try{
            const cartToSend = await CartModel.findOne({_id: id})/* .populate
            ("products.product") */
            console.log("Carrito a enviar => ", cartToSend)

            if(!cartToSend){
                console.log("Cart not Found")
                throw new Error (" Cart not Found")
            }
            return cartToSend
        }
        catch (err) {
            console.log("Error en getCartById => ", err)
            return { error: err.message}
        }
    }


    async deleteCartById(id){
        try{
            await CartModel.deleteOne({_id: id})
        }
        catch(err){
            console.log("Error in 'deleteCartById' => ", err)
        }
    }


    async clearCart(cid) {
        try {
            const findCart = await this.getCartById(cid)
            console.log(cid)
            if(!findCart){

                console.log(`Cart with ID: ${cid} was not found.`)
                throw new Error(`Cart with ID: ${cid} was not found.`)
            }

            const clearCart = await CartModel.updateOne(
                { _id: cid }, { $set: { products: [] } }
            )
            return clearCart

        }
        catch (err) {
            console.log("Error in 'cleanCart' => ", err)
        }
    }


    async deleteProductFromCart(cid, pid){
        try{

            const findCart = await this.getCartById(cid)
            if(!findCart){

                console.log(`Cart with ID: ${cid} was not found.`)
                throw new Error(`Cart with ID: ${cid} was not found.`)
            }

            // No puedo hacer funcionar el .find()
            // const productToDelete = findCart.products.find(p => {
            //     return p._id.toString() === pid
            // })
            // if(!productToDelete){
                
            //     console.log(`Product with ID: ${pid} was not found in cart.`)
            //     throw new Error(`Product with ID: ${pid} was not found in cart.`)
            // }


            const cartUpdated = await CartModel.updateOne(
                {_id: cid }, { $pull: { products: {_id: pid} }}
            )
            return cartUpdated

        }   
        catch (err) {
            console.log("Error in 'deleteProductFromCart' => ", err)
        }
    }


    async addProductCart(cid, product) {
        try{
            const pid = product.productId
            
            const cartToAdd = await this.getCartById(cid)
            console.log("Carrito a llenar: ", cartToAdd)
            if(!cartToAdd) { 
                throw new Error (`Cart with ID: ${cid} was not found.`)
            }

            const productToAdd = await ProductModel.findOne({_id: pid})
            console.log("Producto a agregar =>", productToAdd)
            if(!productToAdd) {
                throw new Error (`Product with ID: ${pid} was not found.`)
            }
            
            // No puedo hacer funcionar el .find()
            //verificacion de si el producto ya está en el carrito
            /* const productVerification = cartToAdd.products.find((product) => {
                return (product._id).toString() === pid
            }) */

            // si el producto está, le sumo una unidad
            /* if(productVerification){
                const sumQuantity = product.quantity + productVerification.quantity
                const updateCart = await CartModel.updateOne(
                    {_id: cid, "products._id": pid}, {$set: {"products.$.quantity": sumQuantity}}
                )
                return updateCart
            } */

            // si el producto no está, lo agrego al carrito
            const cartUpdate = await CartModel.updateOne(
                { _id: cid }, {$set: { products: { _id: product.pid, quantity: product.quantity } } }
            )
            return cartUpdate
        }   
        catch(err) {
            console.log("Error in addProductToCart => ", err)
        }
    }


    async addCart() {
        try{
            const newCart = await CartModel.create({products: []})
            return newCart
        }
        catch(err) {
            console.log("Error in addCart => ", err)
        }
    }


    async updateArrayinCart (cid, productsArray){
        try{

            const findCart = await this.getCartById(cid)
            if(!findCart){

                console.log(`Cart with ID: ${cid} was not found.`)
                throw new Error(`Cart with ID: ${cid} was not found.`)
            }

            const cartUpdated = await CartModel.updateOne(
                { _id: cid }, { $set: { products: productsArray } }
            )
            return cartUpdated

        }
        catch(err) {
            console.log("Error in => ", err)
        }
    }


    async updateProductQuantity (cid, product) {
        try{
            const pid = product.productId
            const newQuantity = product.quantity


            const findCart = await this.getCartById(cid)
            if(!findCart){

                console.log(`Cart with ID: ${cid} was not found.`)
                throw new Error(`Cart with ID: ${cid} was not found.`)
            }
            
            // No pude hacer funcionar el .find()
            // const productToUpdate = findCart.products.find(p => {
            //     return p._id.toString() === pid
            // })
            // if(!productToUpdate){

            //     console.log(`Product with ID: ${pid} was not found in cart.`)
            //     throw new Error(`Product with ID: ${pid} was not found in cart.`)
            // }


            const cartUpdated = await CartModel.updateOne(
                { _id: cid, "products._id": pid }, { $set: { "products.$.quantity": newQuantity } }
            )
            return cartUpdated

        }
        catch(err) {
            console.log( "Error in 'updateProductQuantity' => ", err)
        }
    }
}

module.exports = CartManager