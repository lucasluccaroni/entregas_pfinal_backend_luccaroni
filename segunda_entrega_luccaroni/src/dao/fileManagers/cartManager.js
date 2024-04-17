//MODULO PROPIOS CREADOS PARA MANEJAR EL CART
const fs = require("fs")

class CartManager{
    #usedIds = new Set()
    #path
    
    constructor(pathToUse){
        this.#path = pathToUse
    }

    //leer archivo cart.json
    async readCartFromFile(){
        try{
            const cartFileContent = await fs.promises.readFile(this.#path, "utf-8")
            return JSON.parse(cartFileContent)
        }
        catch(err){
            console.log(`ERROR leyendo archivo => ${err}`)
        }
    }
        
    //generar id random    
    #getRandomId (){
        let randomId
        do {
            randomId = parseInt(Math.random()*1000)
        } while (usedIds.has(randomId))
    
        this.#usedIds.add(randomId)
        return randomId
    }
    
    
    //actualziar cart.json
    async updateCartFile(cart){
        try{
            await fs.promises.writeFile(this.#path, JSON.stringify(cart, null, "\t"))
        }
        catch(err){
            console.log(`ERROR actualizando archivo => ${err}`)
        }
    }
    
    
    // traer cart por ID
    async getCartById (array , idABuscar){
        const busqueda = array.find((cart)=>{
            return cart.id === idABuscar
        })
        if(busqueda){
            return busqueda
        } else{
            console.log("Error. No se encontro ID")
        }
    }
}


//exporto
module.exports = CartManager