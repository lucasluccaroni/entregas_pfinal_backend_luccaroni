const express = require("express")
const handlebars = require("express-handlebars")
const mongoose = require("mongoose")

const app = express()

const ProductManager = require("./dao/dbManagers/productManager")

app.engine("handlebars", handlebars.engine())
app.set("views" , `${__dirname}/views`)
app.set("view engine", "handlebars")

app.use("/api/products", require("./routes/products.router"))
app.use("/api/cart", require("./routes/cart.router"))

const main = async ()=>{

    await mongoose.connect("mongodb://localhost:27017", {
        dbName:  "ecommerce-coderhouse-backend"
    })

    // creacion de nueva instancia prodcuctManager
    const productManager = new ProductManager()
    await productManager.initialize()
    app.set("productManager", productManager)

    // creacion de nueva instancia cartManager

    app.listen(1404, () =>{
        console.log("Servidor OK!")
    })
}

main()