const { Carts } = require("../dao")
const cartsDAO = new Carts()

module.exports = {

    getCarts: async (_, res) => {
        const result = await cartsDAO.getCarts()
        if (!result) {
            return res.sendError({ message: "Something went wrong!" })
        }

        res.sendSuccess(result)
    },

    getCartById: async (req, res) => {
        const id = req.params.pid

        const cart = await cartsDAO.getCartById(id)
        if (!cart) {
            return cart === false
                ? res.sendError({message: "Not Found"}, 404)
                : res.sendError({message: "Something went wrong!"})
        }

        res.sendSuccess(cart)
    },

    createCart: async (_, res) => {
        // res.send({status: "success", payload: "createCart"})
        const newCart = await cartsDAO.createCart()
        if (!newCart) {
            return res.sendError({ message: "Something went wrong!" })
        }

        res.sendSuccess(newCart)
    },

    addProductToExistingCart: async (req, res) => {
        const cartId = req.params.cid
        const productId = req.params.pid
        const {quantity} = req.body

        console.log("PRODUCT QUANTITY => ", quantity )

        const result = await cartsDAO.addProductToExistingCart(cartId, productId, quantity)
        if (!result) {
            return res.sendError({ message: "Something went wrong!" })
        }

        res.sendSuccess(result)
        
    },

    updateProductFromExistingCart: async (req, res) => {
        const cartId = req.params.cid
        const productId = req.params.pid
        const {quantity} = req.body

        console.log("PRODUCT QUANTITY => ", quantity )

        const result = await cartsDAO.updateProductFromExistingCart(cartId, productId, quantity)
        if (!result) {
            return res.sendError({ message: "Something went wrong!" })
        }

        res.sendSuccess(result)

    },

    deleteProductFromExistingCart: async (req, res) => {
        const cartId = req.params.cid
        const productId = req.params.pid

        const result = await cartsDAO.deleteProductFromExistingCart(cartId, productId)
        if (!result) {
            return res.sendError({ message: "Something went wrong!" })
        }

        res.sendSuccess(result)
    },

    clearCart: async (req, res) => {
        const cartId = req.params.cid

        const result = await cartsDAO.clearCart(cartId)
        if(!result) {
            return res.sendError("Something went wrong!")
        }

        res.sendSuccess(result)
    },

    deleteCart: async (req, res) => {
        const cartId = req.params.cid

        const result = await cartsDAO.deleteCart(cartId)
        if(!result) {
            return res.sendError("Something went wrong!")
        }

        res.sendSuccess(result)
    }
}