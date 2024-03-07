const {Router} = require("express")
const router = Router()

router.get("/", (req, res) =>{
    res.send("PRUEBA")
})

module.exports = router