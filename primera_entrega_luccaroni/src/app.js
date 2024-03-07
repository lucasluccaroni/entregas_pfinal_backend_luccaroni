const productsRouter = require("./routes/products.router")
const cartRouter = require("./routes/cart.router")
const express = require("express")
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.use("/api/products", productsRouter)
app.use("/api/cart", cartRouter)

app.listen(8080, ()=> { console.log("Servidor listo")})
