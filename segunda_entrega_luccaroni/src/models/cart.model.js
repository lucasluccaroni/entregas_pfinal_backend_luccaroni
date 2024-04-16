const mongoose = require("mongoose")
const cartPaginate = require("mongoose-paginate-v2")

const schema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        quantity: {
            type: Number,
            default: 1
        }
    }]
})

schema.virtual("id").get(function () {
    return this._id.toString()
})

module.exports = mongoose.model("Cart", schema, "carts")