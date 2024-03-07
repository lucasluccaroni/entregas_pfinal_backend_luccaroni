//configuracion de routers y express
const productsRouter = require("./routes/products.router")
const cartRouter = require("./routes/cart.router")
const express = require("express")
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

//enlaze de comunicacion entre los routes y las rutas
app.use("/api/products", productsRouter)
app.use("/api/cart", cartRouter)

app.listen(8080, ()=> { console.log("Servidor listo")})

