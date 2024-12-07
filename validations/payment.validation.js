const Joi = require('joi')

exports.paymentValidation = (data) =>{
    const schemaPayment = Joi.object({
        total_price: Joi.number().required(),
        status: Joi.boolean().default(false),
        contractId: Joi.number()
    })

    return schemaPayment.validate(data, {abortEarly: true})
}