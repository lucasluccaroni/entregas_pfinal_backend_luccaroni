//MODULO PROPIOS CREADOS PARA MANEJAR EL CART
const fs = require("fs")


//leer archivo cart.json
const readCartFromFile = async (filename) =>{
    try{
        const cartFileContent = await fs.promises.readFile(filename, "utf-8")
        return JSON.parse(cartFileContent)
    }
    catch(err){
        console.log(`ERROR leyendo archivo => ${err}`)
    }
}


//generar id random
let usedIds = new Set()

const getRandomId = () => {
    let randomId
    do {
        randomId = parseInt(Math.random()*1000)
    } while (usedIds.has(randomId))

    usedIds.add(randomId)
    return randomId
}


//actualziar cart.json
const updateCartFile = async (filename, cart) =>{
    try{
        await fs.promises.writeFile(filename, JSON.stringify(cart, null, "\t"))
    }
    catch(err){
        console.log(`ERROR actualizando archivo => ${err}`)
    }
}


// traer cart por ID
const getCartById = async (array , idABuscar) =>{
    const busqueda = array.find((cart)=>{
        return cart.id === idABuscar
    })
    if(busqueda){
        return busqueda
    } else{
        console.log("Error. No se encontro ID")
    }
}


//exporto
module.exports = {
    readCartFromFile,
    getRandomId,
    updateCartFile,
    getCartById
}