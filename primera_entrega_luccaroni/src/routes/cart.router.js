const {Router} = require("express")
const router = Router()

router.get("/", (req, res) =>{
    res.send("prueba CART")
})

module.exports = router