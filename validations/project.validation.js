const Joi = require('joi')

exports.projectValidation = (data) =>{
    const schemaProject = Joi.object({
        project_title: Joi.string().required(),
        project_text: Joi.string().required(),
        price: Joi.number(),
        status: Joi.boolean().default(false),
        clientId: Joi.number()
    })

    return schemaProject.validate(data, {abortEarly: true})
}