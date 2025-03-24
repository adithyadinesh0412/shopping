const accountService = require('@services/account')


module.exports = class Users {
async signUp(req) {
    // console.log("bodyData : ",req)
    const result = accountService.create(req.body)
    return result
}
async login(req) {
    // console.log("bodyData : ",req)
    const result = accountService.login(req.body)
    return result
}
}