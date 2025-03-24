const cartService = require('@services/cart')


module.exports = class Cart {
    async add(req) {
        const result = cartService.add(req.params.id ? req.params.id : '',req.userId)
        return result
    }
    async remove(req) {
        const result = cartService.remove(req.params.id ? req.params.id : '',req.userId)
        return result
    }

    async list(req) {
    const result = cartService.list(req.userId)
    return result
}
}