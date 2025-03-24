const inventoryService = require('@services/inventory')


module.exports = class Product {
async list() {
    const result = inventoryService.list()
    return result
}
}