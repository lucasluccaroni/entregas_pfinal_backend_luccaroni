//TODO: PONER LOS RENDERS DE PRODUCTS ACA PARA PARA QUE SEAN LLAMADOS POR ROUTES

class ProductsController {
    constructor(service) {
        this.service = service
    }

    async getProducts(_, res) {
        try {
            const result = await this.service.getProducts()
            res.sendSuccess(result)
        }
        catch (err) {
            res.sendError(err.message)
        }

    }

    async getProductById(req, res) {
        try {
            const id = req.params.pid
            const product = await this.service.getProductById(id)

            res.sendSuccess(product)
        }
        catch (err) {
            console.log("CATCH EN CONTROLLER - getProductById => ", err)
            res.sendError(err.message)
        }
    }

    async addProduct(req, res) {
        try {
            const productData = req.body

            const newProduct = await this.service.addProduct(productData)
            console.log("NEW PRODUCT CONTROLLER => ", newProduct)

            res.sendSuccess(newProduct)
        }
        catch (err) {
            console.log("CATCH EN CONTROLLER - addProduct => ", err)
            res.sendError(err.message)
        }
    }

    async updateProduct(req, res) {
        try {
            const id = req.params.pid
            const productData = req.body

            const updatedProduct = await this.service.updateProduct(id, productData)

            res.sendSuccess("Product updated succesfully")
        }
        catch (err) {
            console.log("CATCH EN CONTROLLER - updateProduct => ", err)
            res.sendError(err.message)
        }
    }

    async deleteProduct(req, res) {
        try {
            const id = req.params.pid
            const deletedProduct = await this.service.deleteProduct(id)

            res.sendSuccess(`Product succesfully deleted`)
        }
        catch (err) {
            console.log("CATCH EN CONTROLLER - deleteProduct => ", err)
            res.sendError(err.message)
        }
    }
}

module.exports = { ProductsController }