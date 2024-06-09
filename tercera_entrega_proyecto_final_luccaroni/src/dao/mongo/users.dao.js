const UserModel = require("../models/user.model")

class UsersDAO {

    async getUsers() {
        try {
            const users = await UserModel.find()
            return users.map(u => u.toObject())
        }
        catch (err) {
            console.log("Error en UsersDAO = getUsers => ", err)
            return null
        }
    }

    async getUserById(id) {
        try {
            const user = await UserModel.findById(id)
            return user?.toObject() ?? false
        }
        catch (err) {
            console.log("Error en UsersDAO = getUserById => ", err)
            return null
        }
    }

    async getUserByEmail(email) {
        try {
            const user = await UserModel.findOne({ email })
            return user?.toObject() ?? false
        }
        catch (err) {
            console.log("Error en UsersDAO = getUserByEmail => ", err)
            return null
        }
    }

    async resetUserPassword(email, password) {
        try {
            const updatedUser = UserModel.updateOne({ email }, { $set: { password } })

            return updatedUser
        }
        catch (err) {
            console.log("Error en UsersDAO = updateUser => ", err)
            return null
        }
    }
}

module.exports = { UsersDAO }