const Joi = require('joi')

exports.clientValidation = (data) =>{
    const schemaClient = Joi.object({
        full_name: Joi.string().required(),
        descriptions: Joi.string(),
        email: Joi.string().email().lowercase(),
        password: Joi.string().required(),
        is_active: Joi.boolean().default(false),
        refresh_token: Joi.string(),
        activation_link: Joi.string()
    })

    return schemaClient.validate(data, {abortEarly: true})
}