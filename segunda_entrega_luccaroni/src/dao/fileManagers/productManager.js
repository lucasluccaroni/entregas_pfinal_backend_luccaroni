//PRODUCT MANAGER IMPORTADO DEL DESAFIO ANTERIOR PARA CONTINUIDAD DE TRABAJO

const fs = require("fs")
const filename = `${__dirname}/../assets/products.json`


class ProductManager{
    #products
    #ultimoId = 1
    #path
    #usedIds = new Set()

    constructor(pathToUse){
        this.#path = pathToUse
        this.#products
    }


    // Método para iniciar la clase y cargar los productos en memoria.
    async initialize(){
        this.#products = await this.readProductsFromFile()
    }


    // Leer los productos cargados en el archivo
    async readProductsFromFile(){
        try{
            const productsFileContent = await fs.promises.readFile(this.#path, "utf-8")
            return JSON.parse(productsFileContent)


        } catch(err){
            return []
        }
    }


    // Actualizar el archivo
    async updateFile(){
        await fs.promises.writeFile(this.#path, JSON.stringify(this.#products, null, "\t"))
    }


    //Actualizar un producto
    async updateProduct(id, updatedProduct){
        try{
            console.log(updatedProduct)
            const exsitingProductIndex = this.#products.findIndex(p => p.id === id)

            if(exsitingProductIndex < 0){
                console.log(exsitingProductIndex)
                throw "Codigo invalido. 0 coincidencias para actualización"
            }

            //actualizar los datos de ese product en el array
            const productData = {...this.#products[exsitingProductIndex], ...updatedProduct}
            this.#products[exsitingProductIndex] = productData

            await this.updateFile()

        }catch(err){
            console.log(`Error actualizando el producto => ${err}`)
        }
        
    }


    // Eliminar producto
    async deleteById(productId){
        try{

            //Validar si existe el producto con ese ID
            const validation = this.#products.find(p => p.id === productId)
            console.log(validation);
            if(validation === undefined || validation == null || !validation){
                throw "Error.No se encontró ID."
            }


            const arrayWithoutDeletedProduct = this.#products.filter(product => product.id !== productId)
            this.#products = arrayWithoutDeletedProduct
    
            await this.updateFile()
            console.log(`El producto con ID:${productId} fue eliminado exitosamente.`)

        }catch(err){
            console.log(`Error en la eliminación de producto => ${err}`)
        }
    }


    // Mostrar los productos cargados en memoria
    async getProducts(){
        return this.#products
        //return await this.readProductsFromFile()
    }


    // Creación de Id autoincrementable
    #getNuevoId(){
        const id = this.#ultimoId
        this.#ultimoId += 1
        return id
    }


    //Creacopm de ID aleatorio
    #getRandomId(){
        let randomId
        do {
            randomId = parseInt(Math.random()*1000)
        } while (this.#usedIds.has(randomId))

        this.#usedIds.add(randomId)
        return randomId.toString()
    }


    // Metodo de busqueda por ID
    getProductById(idABuscar){
        const busqueda = this.#products.find((product)=>{
            return product.id === idABuscar
        })
        if(busqueda){
            return busqueda
        }else{
            console.log("Error. No se encontró ID.")
        }
    }

    
    // Método para agregar un nuevo producto
    async addProduct(title,description, price, thumbnail, code, stock, category){

        // // Validacion de condiciones (ninguna clave vacia o en blanco)
        // if(!title || !description || !price || !code || !stock || title.trim() === "" || description.trim() === "" || price < 1 || code.trim() === "" || stock < 1  || !status || !category){
        //     console.log("ERROR EN LA CARGA DEL PRODUCTO. Todos los datos son obligatorios y no pueden estar en blanco. El precio y el stock deben ser mayores que 1. 'status' debe ser boolean.");
        //     return
        // }

        // Validacion de no repeticion de clave "code"
        const existingProduct = this.#products.some(product => product.code === code)
        if(existingProduct){
            console.log("Error. El código del producto ya existe. Cargue otro código.")
            return
        }

        // Creación del nuevo producto
        const newProduct = 
        {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            category,
            status: true,
            id: this.#getRandomId()
        }

        // Agregar el nuevo producto
        this.#products.push(newProduct)
        await this.updateFile()

        return newProduct
    }
}


module.exports = { ProductManager }