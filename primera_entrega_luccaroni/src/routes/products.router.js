const {Router} = require("express")
const router = Router()
const fs = require("fs")

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

        const idProduct = +req.params.pid
        const productToSend = productManager.getProductById(idProduct)

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
        const {title , description, price, thumbnail, code, stock, status, category} = req.body
        
        await productManager.initialize()
        await productManager.readProductsFromFile()
    
        const productToAdd = await productManager.addProduct(title, description, price, thumbnail, code, stock, status, category)
        //console.log(productToAdd)
        const newProduct = {title, description, thumbnail, price, code, stock, status, category}

        if(productToAdd !== undefined){
            res.json({message: "success", newProduct})
            return
        }else{
            res.json({status: "error", message: "Hubo un error agregando el producto"})
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
    const productDataToUpdate = req.body
    delete productDataToUpdate.id
    const productId = +req.params.pid
    //console.log(productDataToUpdate)

    await productManager.initialize()
    const products = await productManager.readProductsFromFile()
    //console.log(products)

    const productIndex = products.findIndex(p => p.id === productId)
    if(productIndex < 0){
        return res.status(404).json({status: "error", message: "Producto no encontrado"})
    }
    products[productIndex] = {id: productId, ...products[productIndex], ...productDataToUpdate,}
    
    await fs.promises.writeFile(filename, JSON.stringify(products, null, "\t"))

    res.send({status: "success", message: "Producto actualizado", product: products[productIndex]})
})










module.exports = router