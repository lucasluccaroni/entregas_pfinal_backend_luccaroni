const { Router } = require("express")
const { userIsLoggedIn, userIsNotLoggedIn} = require("../middlewares/auth.middleware")

const { UsersDAO } = require("../dao/mongo/users.dao")
const usersDAO = new UsersDAO()

module.exports = () => {

    const router = Router()


    // HOME
    router.get("/", (req, res) => {
        console.log("Info de session en HOME => ", req.session.user)
        const isLoggedIn = ![null, undefined].includes(req.session.user)


        res.render("index", {
            title: "Home",
            isLoggedIn,
            isNotLoggedIn: !isLoggedIn
        })
    })


    // REGISTER
    router.get("/register", userIsNotLoggedIn, (_, res) => {
        res.render("register", {
            title: "Register"
        })
    })

    // LOGIN
    router.get("/login", userIsNotLoggedIn, (_, res) => {

        res.render("login", {
            Title: "Login"
        })
    })

    // RESET PASSWORD
    router.get("/reset_password", userIsNotLoggedIn, (_, res) => {

        res.render("reset_password", {
            title: "Reset Passowrd"
        })
    })


    // PROFILE
    router.get("/profile", userIsLoggedIn, async (req, res) => {

        console.log("Info de session en Profile: ", req.session)
        const idFromSession = req.session.user.id

        // Si tiene _id: 1 (porque es admin), importo los datos de admin y los renderizo.
        if (idFromSession == 1) {
            const user = req.session.user
            res.render("profile", {
                title: "My Profile",
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    age: user.age,
                    email: user.email,
                    rol: user.rol
                }
            })

            // Si el _id != 1 , busco en la DB el user, traigo sus datos y los renderizo.
        } else {
            const user = await usersDAO.getUserById(idFromSession)
            res.render("profile", {
                title: "My Profile",
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    age: user.age,
                    email: user.email,
                    role: user.role
                }
            })
        }
    })

    return router
}