const productsRouter = require("./routes/products.router")
const express = require("express")
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.use("/api/products", productsRouter)

app.listen(2200, ()=> { console.log("DEMO LISTA")})