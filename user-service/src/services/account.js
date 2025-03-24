const responses = require('@helpers/responses')
const httpStatusCode = require('@generics/http-status')
const emailEncryption = require('@utils/emailEncryption')
const UserQueries = require('@database/queries/users')
const { Op } = require('sequelize')
const utilsHelper = require('@generics/utils')
const bcryptJs = require('bcryptjs')
module.exports = class AccountHelper {
    
    static async create(bodyData) {
        try{
            const plaintextEmailId = bodyData.email.toLowerCase()
			const encryptedEmailId = emailEncryption.encrypt(plaintextEmailId)
            let result = {
                data : []
            }
            
            const users = await UserQueries.findOne({
				email: encryptedEmailId,
				password: {
					[Op.ne]: null,
				},
			})
            if (users) {
				return responses.failureResponse({
					message: 'USER_ALREADY_EXISTS',
					statusCode: httpStatusCode.not_acceptable,
					responseCode: 'CLIENT_ERROR',
                    result 
				})
			}

            const encPassword = utilsHelper.hashPassword(bodyData.password)
            const createUser = {
                email : encryptedEmailId,
                password : encPassword,
                name : bodyData?.name,
                status : 'ACTIVE',
                email_verified : true,
                has_accepted_terms_and_conditions : true,
                about : bodyData?.about || "",
                location : bodyData?.location || "",
                prefererd_language : bodyData?.prefererd_language || "en",
                last_logged_in_at : new Date(),
                refresh_tokens : "",
                image : bodyData?.image || "en",
                meta : bodyData?.meta || {},
                created_at :  new Date(),
                updated_at :  new Date(),
                deleted_at :  null
            }

			const insertedUser = await UserQueries.create(createUser)

            const tokenDetail = {
				data: {
					id: insertedUser.id,
					name: insertedUser.name,
				},
			}

			const accessToken = utilsHelper.generateToken(
				tokenDetail,
				process.env.ACCESS_TOKEN_SECRET,
				process.env.ACCESSTOKENEXPIRY
			)

			const refreshToken = utilsHelper.generateToken(
				tokenDetail,
				process.env.REFRESH_TOKEN_SECRET,
				process.env.REFRESHTOKENEXPIRY
			)

            result = {
                user : tokenDetail.data,
                accessToken,
                refreshToken
            }
           return responses.successResponse({
            statusCode: httpStatusCode.created,
            message: 'USER_CREATED_SUCCESSFULLY',
            result,
        })
        }catch(error){
            console.log("error : ", error)
            throw error
        }
    }

    static async login(bodyData) {
        try{
            const plaintextEmailId = bodyData.email.toLowerCase()
			const encryptedEmailId = emailEncryption.encrypt(plaintextEmailId)
            let result = {
                data : []
            }
            const encPassword = utilsHelper.hashPassword(bodyData.password)
            console.log("EMAIL : ",encryptedEmailId)
            console.log("encPassword : ",encPassword)
            const users = await UserQueries.findOne({
				email: encryptedEmailId,
				password: {
                    [Op.ne]: null,
                }
			})
            if (users) {
                const isPasswordCorrect = bcryptJs.compareSync(bodyData.password, users.password)
			    if (!isPasswordCorrect) {
			    	return responses.failureResponse({
			    		message: 'USERNAME_OR_PASSWORD_IS_INVALID',
			    		statusCode: httpStatusCode.bad_request,
			    		responseCode: 'CLIENT_ERROR',
			    	})
			    }

                const tokenDetail = {
                    data: {
                        id: users.id,
                        name: users.name,
                    },
                }
    
			    const accessToken = utilsHelper.generateToken(
			    	tokenDetail,
			    	process.env.ACCESS_TOKEN_SECRET,
			    	process.env.ACCESSTOKENEXPIRY
			    )

			    const refreshToken = utilsHelper.generateToken(
			    	tokenDetail,
			    	process.env.REFRESH_TOKEN_SECRET,
			    	process.env.REFRESHTOKENEXPIRY
			    )
                result = {
                    user : tokenDetail.data,
                    accessToken,
                    refreshToken
                }

                   return responses.successResponse({
                    statusCode: httpStatusCode.created,
                    message: 'USER_LOGGED_IN_SUCCESSFULLY',
                    result,
                })
				
			}
            result = {
                data : 'USER_NOT_FOUND'
            }
            return responses.failureResponse({
                message: 'USER_NOT_FOUND',
                statusCode: httpStatusCode.not_found,
                responseCode: 'CLIENT_ERROR',
                result 
            })
        }catch(error){
            console.log("error : ", error)
            throw error
        }
    }
}