const CartModel = require("../../models/cart.model")
const ProductModel = require("../../models/product.model")

class CartManager{
    
    constructor() {}

    //leer archivo cart.json
    async readCartFromFile(){
        try{
            const carts = await CartModel.find()
            return carts
        }
        catch(err){
            console.log(`ERROR leyendo la Cart DataBase => ${err}`)
        }
    }        
    
    //actualziar cart.json
    async updateCartFile(id,updatedCartData){
        try{
            await CartModel.findByIdAndUpdate({_id: id}, {$set: updatedCartData})
        }
        catch(err){
            console.log(`ERROR actualizando el cart => ${err}`)
        }
    }
    
    
    // traer cart por ID
    async getCartById (id){
        const busqueda = await CartModel.findOne({_id: id})
        if(busqueda){
            return busqueda
        } else{
            throw console.log("Error. No se encontro ID")
        }
    }
    
}


//exporto
module.exports = CartManager