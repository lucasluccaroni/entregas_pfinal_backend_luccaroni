const { config } = require("dotenv")

config()

module.exports = {
    mongoUri: process.env.MONGO_URI,
    dbName: process.env.DB_NAME,
    port: process.env.PORT,
    appId: process.env.APPID_GITHUB,
    clientID: process.env.CLIENT_ID_GITHUB,
    clientSecret: process.env.CLIENT_SECRET_GITHUB,
    callbackURL: process.env.CALLBACK_URL_GITHUB
}