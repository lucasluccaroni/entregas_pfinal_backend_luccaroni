const {Router} = require("express")
const router = Router()

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
        res.send({status: "success", productToSend})
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
        await productManager.initialize()
        const products = await productManager.readProductsFromFile()
    
        const newProduct = productManager.addProduct()
        res.json({message: "success", newProduct})
        return
    }
    catch(err){
        console.log(err)
        res.status(400).json({message: "error",err})
        return
    }
})














module.exports = router