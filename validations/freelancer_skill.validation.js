const Joi = require('joi')

exports.freelancer_skillValidation = (data) =>{
    const schemaFreelancer_skill = Joi.object({   
        freelancerId: Joi.number(),
        skillId:Joi.number()
    })

    return schemaFreelancer_skill.validate(data, {abortEarly: true})
}