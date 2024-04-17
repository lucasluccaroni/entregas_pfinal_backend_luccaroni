const { Router } = require("express")
const router = Router()


// todos los carritos
router.get("/", async (req, res) =>{

    try{
        const cartManager = req.app.get("cartManager")
        const carts = await cartManager.getCarts()

        res.json(carts)
    }
    catch (err) {
        console.log("Error in getCarts =>", err)
    }
})


// carrito por id
router.get("/:cid", async (req, res) => {

    try{
        const cartManager = req.app.get("cartManager")
        const idParams = req.params.cid
        const cart = await cartManager.getCartById(idParams)
        console.log(cart)

        res.render("cart", {
            title: "Cart",
            cart
        })
    }
    catch (err){
        console.log("Error getting cartById => ", err)
    }
})



// nuevo carrito vacio
router.post("/", async (req, res) =>{

    try{
        const cartManager = req.app.get("cartManager")

        const newCart = await cartManager.addCart()
        res.json({message: "success", newCart})

    }
    catch(err) {
        console.log("Error creando cart vacio => ", err)
        return res.status(400).json({message: "Error creating new cart"})
    }
})


// agregar producto a un carrito que ya existe
router.post("/:cid/product/:pid", async (req, res) =>{

    try{
        const cartManager = req.app.get("cartManager")
        const quantity = req.body.quantity
        const cartId = req.params.cid
        const productId = req.params.pid

        const addProductToCart = await cartManager.addProductCart(cartId, {productId, quantity})
        
        if(!addProductToCart){
            res.status(400).json({status: "error", message: "Error adding product to cart",})
            return
        }

        res.json({status: "success", message: "Product added succesfully."})
    }
    catch(err){
        console.log("Error adding product in cart => ", err)
    }
})


// borrar producto del carrito
router.delete("/:cid/product/:pid", async (req, res) =>{

    try{
        const cartManager = req.app.get("cartManager")
        const cartId = req.params.cid
        const productId = req.params.pid

        const deleteProduct = await cartManager.deleteProductFromCart(cartId, productId)

        if(!deleteProduct){
            res.status(400).json({status: "error", message: "Error deleting product from cart"})
            return
        }
        
        res.json({status: "success", message: "Product was succesfully deleted from cart"})
    }
    catch(err){
        console.log("Error deleting product from cart =>". err)
    }
})


// limpiar el carrito completo
router.delete("/:cid", async (req, res) => {

    try{
        const cartManager = req.app.get("cartManager")
        const cartId = req.params.cid

        const cleaningCart = await cartManager.clearCart(cartId)
        res.json({status: "success", message: "The cart was successfully cleaned."})

    }
    catch(err) {
        console.log("Error cleaning cart => ", err)
    }
})


// actualizar un producto ya existente dentro del carrito
router.put("/:cid/carts/:pid", async (req, res) =>{

    try{
        const cartManager = req.app.get("cartManager")
        const quantity = req.body.quantity
        const cartId = req.params.cid
        const productId = req.params.pid

        const productUpdated = {productId, quantity}

        const cartUpdated = await cartManager.updateProductQuantity(cartId, productUpdated)

        res.json({status: "success", message:"Cart updated succesfully."})
    }
    catch(err){
        console.log("Error updating product =>", err)
    }
})


// actualizar el carrito con array de productos
router.put("/:cid", async (req, res) => {
    try{
        const cartManager = req.app.get("cartManager")
        const cartId = req.params.cid
        const productsArray = req.body

        const cartUpdated = await cartManager.updateArrayInCart(cartId, productsArray)
        res.json({status: "success", message: "Cart updated succesfully", cart: cartUpdated})
    }
    catch(err){
        console.log(err)
    }
})


module.exports = router