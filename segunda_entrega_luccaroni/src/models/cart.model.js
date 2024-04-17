const mongoose = require("mongoose")
const cartPaginate = require("mongoose-paginate-v2")

const schema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Product"
        },
        quantity: {
            type: Number,
            default: 1
        }
    }]
})

schema.pre("findOne", function () {
    this.populate("products.product")
})

schema.virtual("id").get(function () {
    return this._id.toString()
})

module.exports = mongoose.model("Cart", schema, "carts")