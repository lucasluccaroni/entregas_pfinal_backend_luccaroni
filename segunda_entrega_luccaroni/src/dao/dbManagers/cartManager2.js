const CartModel = require("../../models/cart.model")
const ProductModel = require("../../models/product.model")

class CartManager {
    constructor(){ }

    async initialize() {
        if(CartModel.db.readyState != 1){
            throw new Error ("Must connect to MongoDB")
        }
    }

    async getCart(){
        const carts = await CartModel.find()
        return carts.map(c => c.toObject({virtuals: true}))
    }

    async getCartById(id){
        try{
            const cartToSend = await CartModel.find({_id: id}) //POPULATE 

            if(!cartToSend){
                console.log("Cart not Found")
                throw new Error (" Cart not Found")
                
            }
        }
        catch (err) {
            console.log("Error en getCartById => ", err)
            return { error: err.message}
        }
    }
}