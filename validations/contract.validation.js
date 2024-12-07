const Joi = require('joi')

exports.contractValidation = (data) =>{
    const schemaContract = Joi.object({
        total_price: Joi.number().required(),
        descriptions: Joi.string().required(),
        expiration_time: Joi.date(),
        status: Joi.boolean().default(false),
        projectId: Joi.number(),
        freelancerId: Joi.number()
    })

    return schemaContract.validate(data, {abortEarly: true})
}