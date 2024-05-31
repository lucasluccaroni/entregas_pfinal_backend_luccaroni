const express = require("express")
const mongoose = require("mongoose")
const { dbName, mongoUri, port } = require("./config")

const { configureCustomResponses } = require("./controllers/utils")
const createProductsRouter = require("./routes/products.router")
const createCartsRouter = require("./routes/carts.router")
// const createSessionsRouter = require("./routes/sessions.router")
// const createViewsRouter = require("./routes/views.router")

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(configureCustomResponses)

const main = async () => {

    await mongoose.connect(mongoUri, { dbName })

    const routers = [
        // { path: "api/sessions", createRouter: createSessionsRouter },
        { path: "/api/products", createRouter: createProductsRouter },
        { path: "/api/carts", createRouter: createCartsRouter }
    ]

    for (const { path, createRouter } of routers) {
        app.use(path, createRouter())
    }


    app.listen(port, () => {
        console.log(`CoderServer Ready - port: ${port}`)
    })
}

main()
