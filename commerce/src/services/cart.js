const responses = require('@helpers/responses')
const httpStatusCode = require('@generics/http-status')
const cartQueries = require('@database/queries/cart')
const { Op } = require('sequelize')
const utilsHelper = require('@generics/utils')
const inventoryQueries = require('@database/queries/inventory')

module.exports = class inventoryHelper {
    
    static async add(productId,userId) {
        try{
            let result = {}
            const fetchItem = await inventoryQueries.findOne({ id : productId})
            if(!fetchItem?.id){
                return responses.successResponse({
                    message: 'PRODUCT_ID_INVALID',
                    statusCode: httpStatusCode.bad_request,
                    responseCode: 'CLIENT_ERROR',
                })
            }

            const createResult = await cartQueries.create({
                userId : userId,
                productId : fetchItem?.id,
            })
            
            const inventory = await inventoryQueries.findOne({
                id : productId
            })
            await inventoryQueries.update({
                id : productId
            },{
                stock : (inventory.stock - 1) > 0 ? inventory.stock - 1 : 0
            })
           return responses.successResponse({
            statusCode: httpStatusCode.created,
            message: 'ITEM_ADDED_TO_CART',
            result,
        })
        }catch(error){
            console.log("error : ", error)
            throw error
        }
    }

    static async remove(id,userId) {
        try{
            let result = {}
            if(id){
                const fetchItem = await cartQueries.findOne({productId : id,userId})
                
                if(!fetchItem?.id){
                    return responses.successResponse({
			    		message: 'CART_ID_INVALID',
			    		statusCode: httpStatusCode.bad_request,
			    		responseCode: 'CLIENT_ERROR',
			    	})
                }

                let deleteInventory = await cartQueries.deleteOne(fetchItem?.id)

                const inventory = await inventoryQueries.findOne({
                    id : fetchItem.productId
                })
                
                await inventoryQueries.update({
                    id : inventory.id
                },{
                    stock : inventory.stock + 1
                })

    
                if (deleteInventory === 0) {
                    return responses.successResponse({
                        message: 'CART_ID_NOT_FOUND',
                        statusCode: httpStatusCode.bad_request,
                        responseCode: 'CLIENT_ERROR',
                    })
                }
                result.id = fetchItem?.id

            } else {
                return responses.successResponse({
                    message: 'CART_ID_MISSING',
                    statusCode: httpStatusCode.bad_request,
                    responseCode: 'CLIENT_ERROR',
                })
            }

            return responses.successResponse({
                statusCode: httpStatusCode.created,
                message: 'ITEM_DELETED_FROM_CART_SUCCESSFULLY' ,
                result,
            })

        }catch(error){
            console.log("error : ", error)
            throw error
        }
    }

    static async list(userId) {
        try {
            const attributes = ['id','projectId']
            const fetchItems = await cartQueries.findAll({
                userId
            },attributes)
            
            // let listData = []

            const uniqueProducts = [ ...new Set( fetchItems.map(item => item.productId) )]
            const productCountMapping = new Map();
            fetchItems.forEach((item) => {
                productCountMapping.set(Number(item.productId), productCountMapping.get(item.productId) ? productCountMapping.get(item.productId) + 1 : 1);
            }) 

            const fetchProductDetails = await inventoryQueries.findAll({
                id : uniqueProducts
            })

            const productDetails = new Map();

            fetchProductDetails.forEach((product) => {
                productDetails.set(Number(product.id), {
                    price: product.price_per_item,
                    name: product.item
                });
            });
            
            const listData = uniqueProducts.map((product) => {
                const price = productCountMapping.get(product) * productDetails.get(product).price
                console.log("price : : : : : ------>> ",price)
                let listElement = {}
                if(price){
                    listElement = {
                        productId : product,
                        item : productDetails.get(product).name,
                        price
                    }
                }
                return listElement
            })


            return responses.successResponse({
                statusCode: httpStatusCode.created,
                message: 'PRODUCTS_FETCHED_SUCCESSFULLY',
                result : listData,
            })

        } catch (error) {
            console.log("error : ", error)
            throw error
        }
    }
}