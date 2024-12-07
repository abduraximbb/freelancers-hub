const Joi = require('joi')

exports.adminValidation = (data) =>{
    const schemaAdmin = Joi.object({
        username: Joi.string().required(),
        descriptions: Joi.string(),
        email: Joi.string().email(),
        password: Joi.string().required(),
        is_super_admin: Joi.boolean()
    })

    return schemaAdmin.validate(data, {abortEarly: true})
}