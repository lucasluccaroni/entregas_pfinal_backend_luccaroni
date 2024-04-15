const ProductModel = require("../../models/product.model")

class ProductManager {

    constructor() {}

    async initialize(){
        if( ProductModel.db.readyState !== 1 ) {
            throw new Error('must connect to mongodb!')
        }
    }


    // Leer los productos cargados en el archivo
    async readProductsFromFile() {
        try {
            const products = await ProductModel.find()
            return products

        } catch(err) {
            console.log("error en readProductsFromFile DB")
            return []
        }
    }


    //Actualizar un producto
    async updateProduct( id, updatedProductData ) {
        await ProductModel.findByIdAndUpdate( { _id: id} , { $set: updatedProductData } )
    }


    // Eliminar producto
    async deleteById(id) {
        await ProductModel.deleteOne( { _id: id } )
    }


    // Mostrar los productos cargados en memoria
    async getProducts() {
        try {
            const products = await ProductModel.find()
            return products

        } catch(err) {
            return console.log("Error leyendo productos", err)
        }
    }



    // Metodo de busqueda por ID
    async getProductById(id) {
        return await ProductModel.findOne( { _id: id } )
    }


    // Método para agregar un nuevo producto
    async addProduct(product) {

        const {title, description, price, thumbnail, code, stock, status, category} = product
        console.log("el producto es: " , product)

        // Validacion de condiciones (ninguna clave vacia o en blanco)
        if (!title || !description || !price || !code || !stock || title.trim() === "" || description.trim() === "" || price < 1 || code.trim() === "" || stock < 1  || !status || !category) {
            console.log("ERROR EN LA CARGA DEL PRODUCTO. Todos los datos son obligatorios y no pueden estar en blanco. El precio y el stock deben ser mayores que 1. 'status' debe ser boolean.");
            return
        }

        // Creación del nuevo producto
        await ProductModel.create({
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status,
            category
        })
    }
}    


module.exports = ProductManager 