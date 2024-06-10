module.exports = {
    userIsLoggedIn: (req, res, next) => {
        // el usuario debe tener una sesion iniciada
        const isLoggedIn = ![null, undefined].includes(req.session.user)
        if (!isLoggedIn) {
            return res.status(401).json({ error: "User should be logged in!" })
        }
        next()
    },

    userIsNotLoggedIn: (req, res, next) => {
        const isLoggedIn = ![null, undefined].includes(req.session.user)

        if (isLoggedIn) {
            return res.status(401).json({ error: "User should not be logged in!" })
        }
        next()
    },


    adminAuth: (req, res, next) => {

        const adminData = {
            firstName: "admin",
            lastName: "admin",
            age: 100,
            email: "admin@admin.com",
            password: "admin",
            role: "admin",
            id: 1
        }
        // Si es admin, lo autentifica y redirige a profile
        if (req.body.email === adminData.email && req.body.password === adminData.password) {
            req.session.user = adminData
            console.log("Bienvenido ADMIN")
            return res.redirect("/profile")
        }

        // Si no es admin, continua con la autenticación normal
        next()
    },

    userShouldNotBeAdmin(req, res, next) {

        const adminData = {
            firstName: "admin",
            lastName: "admin",
            age: 100,
            email: "admin@admin.com",
            password: "admin",
            role: "admin",
            id: 1
        }

        // Me fijo si el usuario es admin
        console.log("INFO DE SESSION AUTH MIDDLEWARE, USER SHOULD NOT BE ADMIN => ", req.session)
        const sessionInfo = req.session.user
        console.log("SESSION.USER DATA => ", sessionInfo)
        
        // Valido si es admin. Si es manda un error
        if (adminData.role === sessionInfo.role) {
            return res.status(401).json({ error: "User should not be admin!" })
        }

        next()
    },

    userShouldBeAdmin(req, res, next) {

        const adminData = {
            firstName: "admin",
            lastName: "admin",
            age: 100,
            email: "admin@admin.com",
            password: "admin",
            role: "admin",
            id: 1
        }

        // Me fijo si el usuario es admin
        console.log("INFO DE SESSION AUTH MIDDLEWARE, USER SHOULD BE ADMIN => ", req.session)
        const sessionInfo = req.session.user
        console.log("SESSION.USER DATA => ", sessionInfo)

        // Valido si es admin. Si NO es manda un error
        if (adminData.role !==  sessionInfo.role) {
            return res.status(401).json({ error: "User should be admin!" })
        }

        next()
    }
}


