const { CartsDTO } = require("../dao/dtos/carts.dto")


class CartsController {
    constructor(service) {
        this.service = service
    }

    async getCarts(_, res) {
        try {
            const result = await this.service.getCarts()

            res.sendSuccess(result)
        }
        catch (err) {
            res.sendError(err.message)
        }
    }

    async getCartById(req, res) {
        try {
            const id = req.params.cid
            const cart = await this.service.getCartById(id)

            console.log("CART => ", cart)
            return cart
        }
        catch (err) {
            res.sendError(err.message)
        }
    }

    async createCart(_, res) {
        try {
            const newCart = await this.service.createCart()

            res.sendSuccess(newCart)
        }
        catch (err) {
            res.sendError(err.message)
        }
    }

    async addProductToExistingCart(req, res) {
        try {
            const cartId = req.params.cid
            const productId = req.params.pid
            const { quantity } = req.body

            console.log("PRODUCT QUANTITY CART CONTROLLER => ", quantity)
            console.log("CART ID CONTROLLER => ", cartId)
            console.log("PRODUCT ID CONTROLLER => ", productId)

            const result = await this.service.addProductToExistingCart(cartId, productId, quantity)

            res.sendSuccess(result)
        }
        catch (err) {
            res.sendError(err.message)
        }
    }

    async updateProductFromExistingCart(req, res) {
        try {
            const cartId = req.params.cid
            const productId = req.params.pid
            const { quantity } = req.body
            console.log("PRODUCT QUANTITY CONTROLLER => ", quantity)

            const result = await this.service.updateProductFromExistingCart(cartId, productId, quantity)

            res.sendSuccess(result)
        }
        catch (err) {
            console.log(err)
            res.sendError(err.message)
        }

    }

    async deleteProductFromExistingCart(req, res) {
        try {
            const cartId = req.params.cid
            const productId = req.params.pid

            const result = await this.service.deleteProductFromExistingCart(cartId, productId)

            res.sendSuccess(result)
        }
        catch (err) {
            console.log(err)
            res.sendError(err.message)
        }
    }

    async clearCart(req, res) {
        try {
            const cartId = req.params.cid
            console.log("CARTID CONTROLLER => ", cartId)
            const result = await this.service.clearCart(cartId)
            console.log("REULT CONTROLLER => ", result)
            res.sendSuccess(result)
        }
        catch (err) {
            console.log(err)
            res.sendError(err.message)
        }
    }

    async deleteCart(req, res) {
        try {
            const cartId = req.params.cid
            const result = await this.service.deleteCart(cartId)

            res.sendSuccess(result)
        }
        catch (err) {
            res.sendError(err.message)
        }
    }
}

module.exports = { CartsController }