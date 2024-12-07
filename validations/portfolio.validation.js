const Joi = require('joi')

exports.portfolioValidation = (data) =>{
    const schemaPortfolio = Joi.object({
        project_name: Joi.string().required(),
        project_link: Joi.string().required(),
        project_descriptions: Joi.string(),
        freelancerId: Joi.number()
    })

    return schemaPortfolio.validate(data, {abortEarly: true})
}