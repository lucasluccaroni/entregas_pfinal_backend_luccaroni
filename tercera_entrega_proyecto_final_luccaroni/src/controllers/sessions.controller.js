class SessionsController {
    constructor(service) {
        this.service = service
    }

    async resetPassword(req, res) {
        try {
            const { email, password } = req.body

            const resetPassword = this.service.resetPassword(email, password)

            return resetPassword
        }
        catch (err) {
            console.log("CATCH EN CONTROLLER - resetPassword", err)
            res.sendError(err.message)
        }
    }

    async getUserById(req, res) {
        try {
            const idFromSession = req.session.user.id
            console.log("ID SESSION CONTROLLER => ", idFromSession)

            if (idFromSession == 1) {
                const user = req.session.user
                res.send(user)

            } else{
                const user = await this.service.getUseById(idFromSession)
                res.send(user)
            }
        }
        catch (err) {
                console.log("CATCH EN CONTROLLER - resetPassword", err)
                res.sendError(err.message)
            }
        }
}

module.exports = { SessionsController }