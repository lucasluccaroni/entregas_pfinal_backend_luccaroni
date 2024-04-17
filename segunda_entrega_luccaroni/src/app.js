const express = require("express")
const expressHandlebars = require("express-handlebars")
const mongoose = require("mongoose")

const app = express()

const ProductManager = require("./dao/dbManagers/productManager")
const CartManager = require("./dao/dbManagers/cartManager")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const handlebars = expressHandlebars.create({
    defaultLayout: "main",
    handlebars: require("handlebars"),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    }
})
app.engine("handlebars", handlebars.engine)
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
    const cartManager = new CartManager()
    await cartManager.initialize()
    app.set("cartManager", cartManager)

    app.listen(1404, () =>{
        console.log("Server OK!")
    })
}

main()