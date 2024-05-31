const { Router } = require("express")
const cartsController = require("../controllers/carts.controllers")

module.exports = () => {

    const router = Router()

    router.get("/", cartsController.getCarts)
    router.get("/:cid", cartsController.getCartById)
    router.post("/", cartsController.createCart)
    router.post("/:cid/product/:pid", cartsController.addProductToExistingCart)
    router.put("/:cid/products/:pid", cartsController.updateProductFromExistingCart)
    router.delete("/:cid/product/:pid", cartsController.deleteProductFromExistingCart)
    router.delete("/:cid", cartsController.clearCart)
    router.delete("/delete/:cid", cartsController.deleteCart)
    return router
}