const { Router } = require("express")
const ProductModel = require("../models/product.model")

const router = Router()



router.get("/", async (req, res) =>{

    try {
        const productManager = req.app.get("productManager")
        await productManager.initialize()
        let products = await productManager.getProducts()
        //console.log(products)

        //queries
        const limit = req.query.limit || 10
        const  page  = req.query.page || 1
        const sort = req.query.sort //asc o desc}
        
        // category y stock(disponibilidad)
        let query = {}
        if(req.query.category){

            query.category = req.query.category

        } else if(req.query.stock){

            query.stock = req.query.stock
        }


        products = await ProductModel.paginate(
            query,
            {
                sort: sort && {price: sort}, //asc o desc
                limit, 
                page, 
                lean: true
            }
        )
        
        //console.log(products)
        res.render("products", {
            title: "Products!",
            products
        })

    } 
    catch (err) {
        console.log("Error in 'get' products =>" , err)
    }
})



router.get("/:pid", async (req, res) => {
    try{
        const productManager = req.app.get("productManager")
        const idProduct = req.params.pid
        let product = await productManager.getProductById(idProduct)
    
        if(!product){
            res.status(404).json({status: "error", message: `Product with ID: '${idProduct}' was not found.` })
            return
        }

        //console.log(product)
        res.render("productId", {
            title: "Search By ID",
            product
        })
    }
    catch (err) {
        console.log("Error in 'getProductByID' => ", err)
    }
})




router.post("/", async (req, res) => {
    try{
        const productManager = req.app.get("productManager")
        
        const {title, description, price, thumbnail, code, stock, status, category} = req.body
    
        const newProduct = {title, description, price, thumbnail, code, stock, status, category }

    
        await productManager.addProduct(newProduct)
        res.json({status: "success", newProduct: newProduct})
    }
    catch(err) {
        console.log("Error in 'addProduct' => ", err)
    }
})


router.put("/:pid", async (req,res) =>{
    
    try{
        const productManager = req.app.get("productManager")
        const idParams = req.params.pid
        const productDataToUpdate = req.body
    
        //console.log(idParams)
        //onsole.log(productDataToUpdate)
    
        await productManager.updateProduct(idParams, productDataToUpdate)
        const productUpdated = await productManager.getProductById(idParams)

        res.send({status: "success", message: "Product updated", productUpdated})
    }
    catch (err) {
        console.log("Error in 'updateProduct' => ", err )
    }

})
router.delete("/:pid", async (req,res) => {
    try{
        const productManager = req.app.get("productManager")
        const idParams = req.params.pid
        //console.log(idParams)
    
        await productManager.initialize()
        await productManager.deleteById(idParams)
        res.json({status: "success", message: `Product with ID: '${idParams}' was succesfully removed.`})
    }
    catch (err) {
        console.log("Error in 'deleteById' => ", err)
    }

})

module.exports = router