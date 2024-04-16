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
        const query = req.query.query

        products = await ProductModel.paginate(
            {},
            {
                sort: sort && {price: sort}, //asc o desc
                limit, 
                page, 
                lean: true
            }
        )
        console.log(products)
        res.render("products", {
            title: "PRODUCTS!",
            products
        })

    } 
    catch (err) {
        console.log("Error en 'get' products =>" , err)
    }
})

router.get("/:pid", (req, res) => {
    const productManager = req.app.get("productManager")
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
        console.log("Error en addProduct => ", err)
    }
})


router.delete("/:pid", async (req,res) => {
    try{
        const productManager = req.app.get("productManager")
        const idParams = req.params.pid
        console.log(idParams)
    
        await productManager.initialize()
        await productManager.deleteById(idParams)
        res.json({status: "success", message: `Product with ID: '${idParams}' was succesfully removed.`})
    }
    catch (err) {
        console.log("Error en deleteById => ", err)
    }

})

module.exports = router