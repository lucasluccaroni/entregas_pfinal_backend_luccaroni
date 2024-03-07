//Configuracion de router + fs
const {Router} = require("express")
const router = Router()
const fs = require("fs")

// importo la class productManager y establezco la ubicacion de mi archivo JSON
const filename = `${__dirname}/../../assets/products.json`
const {ProductManager} = require("./productManager")
const productManager = new ProductManager(filename)



// GET todos los productos o ?limit
router.get("/", async (req, res) =>{
    try{
        await productManager.initialize()
        const products = await productManager.readProductsFromFile()

        //query limit
        const {limit} = req.query
        if(limit){
            const result = products.slice(0, limit)
            res.status(200).json({message: "success", result})
            return
        }

        //si no hay query devuelve todos los productos
        res.status(200).json({message: "success", products})
        return
    }
    catch(err){
        res.status(500).json({status: "error", message: "Error trayendo productos"})
    }
})



// GET por ID
router.get("/:pid", async(req, res) =>{
    try{
        await productManager.initialize()
        await productManager.readProductsFromFile()

        //traigo el id de params y busco el product con el metodo de clase correspondiente
        const idProduct = +req.params.pid
        const productToSend = productManager.getProductById(idProduct)

        //si no existe, lo informo al cliente
        if(!productToSend){
            res.status(400).json({status: "error", message: `Error. Producto no encontrado. ID: ${idProduct}`})
            return
        }

        res.send({status: "success", product: productToSend})
        return

    }
    catch(err){
        console.log(err)
        res.send({error: "Error buscando producto por ID"})
        return
    }
})


//POST
router.post("/", async (req, res) =>{
    try{
        //traigo los params para cargar el producto
        const {title , description, price, thumbnail, code, stock, status, category} = req.body
        
        await productManager.initialize()
        await productManager.readProductsFromFile()
        
        //metodo de clase para añadir el producto
        const productToAdd = await productManager.addProduct(title, description, price, thumbnail, code, stock, status, category)
        //console.log(productToAdd)
        const newProduct = {title, description, thumbnail, price, code, stock, status, category}

        //si el producto se cargo correctamente mediante el metodo, lo informo al cliente. Solo puede fallar si el cliente manda mal algun dato
        if(productToAdd !== undefined){
            res.json({message: "success", newProduct})
            return
        }else{
            res.status(400).json({status: "error", message: "Hubo un error agregando el producto"})
        }
    }
    catch(err){
        console.log(err)
        res.status(400).json({message: "error",err})
        return
    }
})



//PUT
router.put("/:pid", async (req, res)=>{

    //traigo los params que me da el cliente, borrando el id si es que lo mandó, evitando que se cambie
    const productDataToUpdate = req.body
    delete productDataToUpdate.id
    const productId = +req.params.pid
    //console.log(productDataToUpdate)

    await productManager.initialize()
    const products = await productManager.readProductsFromFile()
    //console.log(products)

    //busco la posicion del producto que corresponde con su id, si no existe lo informo al cliente. si existe, lo modifico e informo
    const productIndex = products.findIndex(p => p.id === productId)
    if(productIndex < 0){
        return res.status(404).json({status: "error", message: "Producto no encontrado"})
    }
    products[productIndex] = {id: productId, ...products[productIndex], ...productDataToUpdate,}
    
    await fs.promises.writeFile(filename, JSON.stringify(products, null, "\t"))

    res.send({status: "success", message: "Producto actualizado", product: products[productIndex]})
})




//DELETE
router.delete("/:pid", async (req, res)=>{

    //traigo el id de params
    const idParams = +req.params.pid
    //console.log(idParams)

    await productManager.initialize()
    let products = await productManager.readProductsFromFile()
    const largoDelArray = products.length
    //console.log(largoDelArray)

    //filtro el array quitando el producto que corresponde al id. si el largo del array es igual que antes de quitarlo. significa que no encontró el producto, por lo que no borró nada.
    //Caso contrario, lo elimina e informa al cliente
    products = products.filter(p => p.id !=idParams)
    if(products.length == largoDelArray){
        return res.status(404).json({status: "error", message: "producto no econtrado."})
    }

    await fs.promises.writeFile(filename, JSON.stringify(products, null, "\t"))

    res.send({status: "success", message: "producto eliminado"})
})



module.exports = router