const { hashPassword } = require("../utils/hashing")

class UsersService {
    constructor(dao) {
        this.dao = dao
    }

    async resetPassword(email, password) {
        try {

            // Verifico que se haya ingresado email y password
            if (!email || !password) {
                throw new Error("Invalid Credentials!")
            }

            // Busco al usuario
            const user = await this.dao.getUserByEmail(email)
            if (!user) {
                throw new Error("User not found!")
            }


            // Hasheo la contraseña
            const hashedPassword = hashPassword(password)
            // Actuializo la nueva contraseña
            const resetPassword = await this.dao.resetUserPassword(email, hashedPassword)

            return resetPassword
        }
        catch (err) {
            console.log(err)
            throw new Error(err)
        }
    }

    async getUserById(id) {
            const user = this.dao.getUserById(id)
            return user
    }
}

module.exports = { UsersService }