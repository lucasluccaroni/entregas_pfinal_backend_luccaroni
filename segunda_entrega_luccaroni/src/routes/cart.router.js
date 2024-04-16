const { Router } = require("express")
const CartModel = require("../models/cart.model")
const router = Router()


router.get("/", async (req, res) =>{
    try{
        const cartManager = req.app.get("cartManager")
        const carts = await cartManager.readCartFromFile()
        
        res.json(carts)
    }
    catch (err) {
        console.log("ERROR EN GET CATRTS => ", err)
    }
})



router.post("/", async (req, res) => {
    try{
        const cartManager = req.app.get("cartManager")
        
        const newCart = {}
    }
    catch (err) {
        console.log("ERROR CREANDO CART VACIO => ", err)
    }
})

router.post("/", async (req, res) =>{
    try{
        const cartManager = req.app.get("cartManager")
        await cartManager.readCartFromFile()
    
        await CartModel.insertMany([
            {
                products:[
                    {
                        product: {
                            title: "alfajor"
                        },
                        quantity: 2
                    }
                ]
            }
        ])
        res.json({message: "success"})
    }
    catch(err) {
        console.log("ERROR EN POST CART => ", err)
        return res.status(400).json({success: false})
    }
})

module.exports = router