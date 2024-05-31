const { Router } = require("express")
const productsController = require("../controllers/products.controller")

const { ProductsDAO } = require("../dao/mongo/products.dao")
const dao = new ProductsDAO()

const { ProductsService } = require("../service/products-service")
const service = new ProductsService(dao)

const { ProductsController } = require("../controllers/products.controller")
const controller = new ProductsController(service)

module.exports = () => {

    const router = Router()

    router.get("/", (req, res) => {
        controller.getProducts(req, res)
    })
    
    router.get("/:pid", (req, res) => {
        controller.getProductById(req, res)
    })
    
    router.post("/", (req, res) => {
        controller.addProduct(req, res)
    })

    router.put("/:pid", (req, res) => {
        controller.updateProduct(req, res)
    })

    router.delete("/:pid", (req, res) => {
        controller.deleteProduct(req, res)
    })

    return router
}