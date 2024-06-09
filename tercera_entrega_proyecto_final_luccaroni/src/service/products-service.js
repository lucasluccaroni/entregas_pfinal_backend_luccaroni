// Service - Repository
const { ProductsDTO } = require("../dao/dtos/products.dto")
const ProductModel = require("../dao/models/product.model")

class ProductsService {
    constructor(dao) {
        this.dao = dao
    }

    async getProducts(query, sort, limit, page) {

        let products = await this.dao.getProducts()
        if (!products) {
            throw new Error("Someting went wrong!")
        }


        // Paginacion para enviar al controller
        products = await ProductModel.paginate(
            query,
            {
                sort: sort && { price: sort },
                limit,
                page,
                lean: true
            }
        )
        console.log("PRODUCTS DESPUES DE PAGINATE => ", products)

        // Transformacion de productos usando DTO
        let productsTransformed = await products.docs.map(p => {
            const dto = new ProductsDTO(p)
            const transformation = dto.transform()
            return transformation
        })
        // console.log("PRODUCTS DTO",productsTransformed)
        products.docs = productsTransformed
        // console.log("PRODUCTS PAGINATE => ", products)


        return products
    }

    async getProductById(id) {

        const product = await this.dao.getProductById(id)
        console.log("RESPUESTA PRODUCT DAO => ", product)
        if (product === false) {
            throw new Error("Product not found!")

        } else if (product === null) {
            throw new Error("Invalid caracters")
        }

        // Transformacion de producto usando DTO
        const dto = new ProductsDTO(product)
        const productTransformed = dto.transform()
        //console.log(productTransformed)
        return productTransformed
    }

    async addProduct(productData) {

        const { title, description, code, price, status, stock, category, thumbnail } = productData
        if (!title || !code || price < 0 || stock < 0 || !category || !description) {
            throw new Error("Invalid parameters")
        }

        return await this.dao.addProduct(productData)
    }

    async updateProduct(id, productData) {

        // Verificacion de que propiedades se quieren actualizar, y que estas sean parte de las propiedades del Product.Model
        let dataKeys = Object.keys(productData)
        // console.log("DATAKEYS =>", dataKeys)

        if (!dataKeys.includes("title") && !dataKeys.includes("description") && !dataKeys.includes("price") && !dataKeys.includes("stock") && !dataKeys.includes("status")) {
            throw new Error("Invalid property")
        }

        const productToUpdate = await this.dao.getProductById(id)
        console.log("PRODUCT FOUND SERVICE", productToUpdate)


        if (!productToUpdate) {
            throw new Error("Product not found!")
        }

        const updatedProduct = await this.dao.updateProduct(id, productData)
        if (!updatedProduct) {
            throw new Error("Error updating product!")
        }

        return updatedProduct
    }

    async deleteProduct(id) {

        const deletedProduct = await this.dao.deleteProduct(id)

        if (!deletedProduct) {
            throw new Error("Something went wrong!")

        } else if (deletedProduct.deletedCount == 0) {
            console.log("DELETED PRODUCT SERVICE", deletedProduct.deletedCount)
            throw new Error("Product not found!")
        }

        console.log("DELETED PRODUCT SERVICE", deletedProduct.deletedCount)
        return (deletedProduct)
    }
}

module.exports = { ProductsService }