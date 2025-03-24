const inventoryService = require('@services/inventory')


module.exports = class Inventory {
async update(req) {
    let result = {}
    if (req.method === 'DELETE') {
        result = inventoryService.delete(req.params.id ? req.params.id : '')
    }else {
        result = inventoryService.update(
            req.params.id ? req.params.id : '',
            req.body,
            req.userId
        )
    }
    
    return result
}
}