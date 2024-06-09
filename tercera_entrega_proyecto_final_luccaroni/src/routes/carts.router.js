const { Router } = require("express")

const { CartsDAO } = require("../dao/mongo/carts.dao")
const dao = new CartsDAO()

const { CartsService } = require("../service/carts-service")
const service = new CartsService(dao)

const { CartsController } = require("../controllers/carts.controllers")
const controller = new CartsController(service)

module.exports = () => {

    const router = Router()

    router.get("/", (req, res) => {
        controller.getCarts(req, res)
    })

    router.get("/:cid",  async (req, res) => {
        const cart = await controller.getCartById(req, res)

        res.render("cart", {
            title: "Cart",
            cart
        })
    })

    router.post("/", (req, res) => {
        controller.createCart(req, res)
    })

    router.post("/:cid/product/:pid", (req, res) => {
        controller.addProductToExistingCart(req, res)
    })
    
    router.put("/:cid/products/:pid", (req, res) => {
        controller.updateProductFromExistingCart(req, res)
    })

    router.delete("/:cid/product/:pid", (req, res) => {
        controller.deleteProductFromExistingCart(req, res)
    })

    router.delete("/:cid", (req, res) => {
        controller.clearCart(req, res)
    })

    router.delete("/delete/:cid", (req, res) => {
        controller.deleteCart(req, res)
    })
    
    return router
}