const Joi = require('joi')

exports.freelancerValidation = (data) =>{
    const schemaFreelancer = Joi.object({
        full_name: Joi.string().required(),
        descriptions: Joi.string(),
        email: Joi.string().email().lowercase(),
        password: Joi.string().required(),
        is_active: Joi.boolean().default(false),
        refresh_token: Joi.string(),
        activation_link: Joi.string()
    })

    return schemaFreelancer.validate(data, {abortEarly: true})
}