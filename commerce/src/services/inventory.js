const responses = require('@helpers/responses')
const httpStatusCode = require('@generics/http-status')
const inventoryQueries = require('@database/queries/inventory')
const { Op } = require('sequelize')
const utilsHelper = require('@generics/utils')

module.exports = class inventoryHelper {
    
    static async update(id,bodyData,userId) {
        try{

            let result = {}
            if(id){
                const fetchItem = await inventoryQueries.findOne({id})
                
                if(!fetchItem?.id){
                    return responses.successResponse({
			    		message: 'INVALID_INVENTORY_CODE',
			    		statusCode: httpStatusCode.bad_request,
			    		responseCode: 'CLIENT_ERROR',
			    	})
                }

                const [updateCount, updatedInventory] = await inventoryQueries.update({
                    id : fetchItem?.id
                },
                {
                    ...bodyData,
                    updated_by : userId

                },{
                    returning: true,
                    raw: true,
                })
               
    
                if (updateCount === 0) {
                    throw new Error('ERROR_IN_UPDATING_INVENTORY')
                }
                result.id = fetchItem?.id

            } else {
                const fetchItem = await inventoryQueries.findOne({item : bodyData.item})
                if(fetchItem?.id){
                    return responses.successResponse({
			    		message: 'ITEM_ALREADY_EXISTS_IN_INVENTORY',
			    		statusCode: httpStatusCode.bad_request,
			    		responseCode: 'CLIENT_ERROR',
			    	})
                }
                const createResult = await inventoryQueries.create({ 
                    ...bodyData,
                    created_by : userId,
                    updated_by : userId,
                })
                result ={
                    id : createResult?.id,
                    item : createResult?.item,
                } 

            }
           return responses.successResponse({
            statusCode: httpStatusCode.created,
            message: id ? 'INVENTORY_UPDATED_SUCCESSFULLY' : 'INVENTORY_CREATED_SUCCESSFULLY',
            result,
        })
        }catch(error){
            console.log("error : ", error)
            throw error
        }
    }

    static async delete(id) {
        try{
            let result = {}
            if(id){
                const fetchItem = await inventoryQueries.findOne({id})
                
                if(!fetchItem?.id){
                    return responses.successResponse({
			    		message: 'INVALID_INVENTORY_CODE',
			    		statusCode: httpStatusCode.bad_request,
			    		responseCode: 'CLIENT_ERROR',
			    	})
                }

                let deleteInventory = await inventoryQueries.deleteOne(fetchItem?.id)
    
                if (deleteInventory === 0) {
                    return responses.successResponse({
                        message: 'INVENTORY_NOT_FOUND',
                        statusCode: httpStatusCode.bad_request,
                        responseCode: 'CLIENT_ERROR',
                    })
                }
                result.id = fetchItem?.id

            } else {
                return responses.successResponse({
                    message: 'INVENTORY_ID_MISSING',
                    statusCode: httpStatusCode.bad_request,
                    responseCode: 'CLIENT_ERROR',
                })
            }

            return responses.successResponse({
                statusCode: httpStatusCode.created,
                message: 'INVENTORY_DELETED_SUCCESSFULLY' ,
                result,
            })

        }catch(error){
            console.log("error : ", error)
            throw error
        }
    }

    static async list() {
        try {
            const attributes = ['id','item','stock','price_per_item']
            const fetchItems = await inventoryQueries.findAll({
                status : 'IN-STOCK'
            },attributes)

            return responses.successResponse({
                statusCode: httpStatusCode.created,
                message: 'PRODUCTS_FETCHED_SUCCESSFULLY',
                result : fetchItems,
            })

        } catch (error) {
            console.log("error : ", error)
            throw error
        }
    }
}