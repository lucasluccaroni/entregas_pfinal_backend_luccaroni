// Service - Repository
const ProductModel = require("../dao/models/product.model")
const CartModel = require("../dao/models/cart.model")
const UserModel = require("../dao/models/user.model")

const { ProductsDAO } = require("../dao/mongo/products.dao")
const { ProductsService } = require("./products-service")
const productsDAO = new ProductsDAO()
const productsService = new ProductsService(productsDAO)

const { UsersDAO } = require("../dao/mongo/users.dao")
const { UsersService } = require("./users-service")
const usersDAO = new UsersDAO()
const usersService = new UsersService(usersDAO)

const { CartsDTO } = require("../dao/dtos/carts.dto")
const TicketModel = require("../dao/models/ticket.model")

class CartsService {
    constructor(dao) {
        this.dao = dao
    }

    async getCarts() {
        const carts = await this.dao.getCarts()
        if (!carts) {
            throw new Error("Someting went wrong!")
        }

        // Transformacion de carts usando DTO
        const cartsTransformed = carts.map(c => {
            const dto = new CartsDTO(c)
            const transformation = dto.trasnformOneCart()
            return transformation
        })

        return cartsTransformed
        // return carts
    }

    async getCartById(id) {
        const cart = await this.dao.getCartById(id)
        // console.log("RESPUESTA getCartById DAO => ", cart)

        if (cart === false) {
            throw new Error("Cart not found!")

        } else if (cart === null) {
            throw new Error("Invalid caracters")
        }

        // Transformacion de cart usando DTO
        const dto = new CartsDTO(cart)
        const cartTransformed = dto.trasnformOneCart()

        return cartTransformed
    }

    async createCart() {
        const result = await this.dao.createCart()

        if (!result) {
            throw new Error("Someting went wrong!")
        }

        // Transformacion de cart usando DTO
        const dto = new CartsDTO(result)
        const cartTransformed = dto.trasnformOneCart()

        return cartTransformed
    }

    async addProductToExistingCart(cartId, productId, quantity, userInfo) {
        try {
            let productExistInCart

            // Busco el carrito
            const cart = await CartModel.findOne({ _id: cartId })
            if (!cart) {
                throw new Error("Cart not found!")
            }
            console.log("CARRITO ENCONTRADO => ", cart)

            // Busco el carrito que le corresponde al User cuando se registró
            const user = await usersService.getUseById(userInfo.id)
            console.log("USER ENCONTRADO EN CARTS-SERVICE => ", user)
            
            const userCart = user.cart.toString()
            console.log("USER CART => ", userCart)
            
            // Comparo los carritos. El usuario registrado solo puede añadir carritos al carrito que le corresponde.
            if (userCart !== cart.id) {
                throw new Error ("This cart isn't yours!")
            }

            // Busco el producto
            const productToAdd = await ProductModel.findById(productId)
            if (!productToAdd) {
                throw new Error("Product not found!")
            }
            console.log("PRODUCTO ENCONTRADO => ", productToAdd)

            // Busco si el producto ya existe en el carrito
            let found = cart.products.find(productToAdd => {
                return (productToAdd._id.toString() === productId)
            })
            console.log("BUSQUEDA SERVICE => ", found)

            // Si no existe, lo agrego al carrito
            if (!found) {

                // Verifico la cantidad actual, la que se quiere ingresar y el stock disponible
                if (quantity < 0 || quantity > productToAdd.stock) {
                throw new Error("Wrong quantity")
                }

                productExistInCart = false
                const cartUpdate = this.dao.addProductToExistingCart(productExistInCart, cartId, productId, quantity)
                return cartUpdate

                // Si existe, sumo la cantidad ingresada + la que que tenia y actualizo el producto    
            } else if (found) {
                console.log("FOUND ENCONTRADO => ", found)

                // Verifico la cantidad actual, la que se quiere actualizar y el stock disponible
                if (found.quantity < 0 || quantity < 0 || quantity > productToAdd.stock) {
                throw new Error("Wrong quantity")
                }

                quantity += found.quantity
                productExistInCart = true

                const cartUpdate = this.dao.addProductToExistingCart(productExistInCart, cartId, productId, quantity)
                return cartUpdate
            }
        }
        catch (err) {
            console.log(err)
            throw new Error(err)
        }
    }

    async updateProductFromExistingCart(cartId, productId, quantity) {

        // Busco el carrito
        const cart = await this.getCartById(cartId)

        // Busco el producto
        const productToAdd = await productsService.getProductById(productId)

        // Verificacion si el producto ya esta en el carrito
        let found = cart.products.find(productToAdd => {
            return (productToAdd.id.toString() === productId)
        })

        // Si está, primero verifico si tiene el stock solicitado antes de actualizar la cantidad.
        if (found) {

            // Verifico la cantidad actual, la que se quiere actualizar y el stock disponible
            if (found.quantity < 0 || quantity < 0 || quantity > productToAdd.stock) {
                throw new Error("Wrong quantity")
            }

            found.quantity = quantity

            const cartUpdate = await this.dao.updateProductFromExistingCart(cartId, productId, quantity)
            return cartUpdate

            // Si no está, arrojo un error
        } else if (!found) {
            throw new Error("Product is not in cart!")
        }
    }

    async deleteProductFromExistingCart(cartId, productId) {

        // Busco el carrito
        const cart = await this.getCartById(cartId)

        // Busco el producto
        const productToDelete = await productsService.getProductById(productId)

        // Verificacion si el producto ya esta en el carrito
        let found = cart.products.find(productToDelete => {
            return (productToDelete._id.toString() === productId)
        })

        // Si esta, actualizo el carrito quitando ese producto
        if (found) { 
            const deleteProduct = await this.dao.deleteProductFromExistingCart(cartId, productToDelete.id)
            return deleteProduct

        // Si no esta, arrojo un error
        } else if (!found) {
            throw new Error("Product is not in cart!")
        }
    }

    async clearCart(id) {

        const cart = await CartModel.findOne({ _id: id })
        if (!cart) {
            throw new Error('Cart not found!')
        }

        const result = await this.dao.clearCart(id)
        console.log("RESULT SERVICE => ", result)
        if (!result) {
            throw new Error("Something went wrong!")
        }

        return result
    }

    async deleteCart(id) {

        const deletedCart = await this.dao.deleteCart(id)

        if (!deletedCart) {
            throw new Error("Something went wrong!")

        } else if (deletedCart.deletedCount == 0) {
            console.log("DELETED PRODUCT SERVICE", deletedCart.deletedCount)
            throw new Error("Product not found!")
        }

        console.log("DELETED PRODUCT SERVICE", deletedCart.deletedCount)
        return (deletedCart)

    }

    async purchaseCart(cartId, userInfo) {

        //! Busco el carrito
        const cart = await this.getCartById(cartId)
        console.log("CART => ", cart)


        //! Busco el User y el carrito que le corresponde al User cuando se registró
        const user = await usersService.getUseById(userInfo.id)
        console.log("USER ENCONTRADO EN PURCHASE => ", user)
        
        const userCart = user.cart.toString()
        console.log("USER CART => ", userCart)
        
        //! Comparo los carritos. El usuario registrado solo puede comprar el carrito que le corresponde.
        if (userCart !== cart.id) {
            throw new Error ("This cart isn't yours!")
        }

        // return carts.map(c => c.toObject()) -- ejemplo de map


        //! Extraigo la propiedad "quantity" de cada producto en el carrito
        // const quantitiesOfEachProduct = cart.products.map(p => p.quantity.toString())
        // const totalQuantity = quantitiesOfEachProduct.reduce((total, number) => total + Number(number), 0)
        // console.log("TOTAL QUANTITY => ", totalQuantity)

        const quantityMap = cart.products.map(p => p.quantity.toString())
        console.log("QUANTITY MAP =>", quantityMap)
        const quantity = quantityMap[0]
        console.log("QUANTITY => ", quantity)


        //! Busco el/los productos en la bd
        // let ids
        // const productsId = cart.products.map(p => p.id.toString())
        // for (let i = 0; i < productsId.length; i++){
        //     ids = productsId[i]    
        // }
        // console.log(ids)

        const productIdMap = cart.products.map(p => p.id.toString())
        console.log("PRODUCT ID MAP =>", productIdMap)
        const productId = productIdMap[0]
        console.log("PRODUCT ID => ", productId)
        const productToPurchase = await productsService.getProductById(productId)
        console.log("PRODUCTO A COMPRAR => ", productToPurchase)


        //! Hago la cuenta = cantidad del carrito * precio del producto
        const amount = productToPurchase.price * quantity
        console.log("TOTAL A PAGAR => ", amount)

        

        //! Genero el ticket
        const ticket = await TicketModel.create({
            code: parseInt(Math.random()*1000),
            purchase_datetime: Date.now(),
            amount,
            purchaser: user.email
        })


        //! Actualizo el producto restandole del stock la cantidad comprada
        const stockRestante = productToPurchase.stock - quantity
        const updateProduct = await productsService.updateProduct(productId, {stock: stockRestante})

        return ticket

        // const idSearch = async (ids) => {
        //     await ids.forEach((id) => {
        //         productsService.getProductById(id)
        //     }) 
        // }
        // console.log("ID SEARCH RESULT => ", idSearch(productsId))

        

        // const productToAdd = await productsService.getProductById(productId)
    }

}

module.exports = { CartsService }