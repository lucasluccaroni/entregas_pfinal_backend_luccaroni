const { Router } = require("express")
const ProductModel = require("../models/product.model")
const router = Router()

router.get("/", async (req, res) =>{

    try {
        const productManager = req.app.get("productManager")
        await productManager.initialize()
        let products = await productManager.getProducts()
        //console.log(products)

       //query limit
        const { page } = req.query.page || 1
        products = await ProductModel.paginate({}, {limit: 5, page, lean: true})
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


router.post("/", async (req, res) => {
    try{
        const productManager = req.app.get("productManager")
        await productManager.initialize()

        console.log(req.body)
        res.json({message: req.body})
        // const {title, description, thumnbnail, price, stock, status, category} = req.body

        // const newProduct = {title, description, thumnbnail, price, stock, status, category}

        // await productManager.addProduct(req.body)

        // res.json("success", newProduct)
        // return

    } 
    catch (err) {
        console.log("Error en 'post' de products => ", err)
    }
})




module.exports = router