const sequelize = require("../config/db")
const { errorHandler } = require("../helpers/error_handler")
const Freelancer_skill = require("../models/freelancers_skills")
const { freelancer_skillValidation } = require("../validations/freelancer_skill.validation")

const addFreelancer_skill = async (req, res)=>{
    try {
        
        const {error, value} = freelancer_skillValidation(req.body)
        
        
        const {freelancerId, skillId} = value
        
        if (error) {
            return res.status(400).send({ message: error.message });
        }
        
        const newFreelancer_skill = await Freelancer_skill.create({freelancerId, skillId})
        res.status(201).send({message:"New freelancer_skill added successfully", data: newFreelancer_skill})
    } catch (error) {
        errorHandler(res, error)
    }
}

const getFreelancer_skills = async (req, res)=>{
    try {
        const freelancer_skills = await Freelancer_skill.findAll()
        res.status(200).send({
            message: "All freelancer_skills fetched successfully",
            data: freelancer_skills
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

const getFreelancer_skillById = async (req, res)=>{
    try {
        const id = req.params.id
        const freelancer_skill = await Freelancer_skill.findByPk(id)
        if(!freelancer_skill){
            return res.status(404).send({
                error: "This freelancer_skill not found"
            })
        }
        return res.status(200).send({
            message: "Freelancer_skill fetched successfully",
            data: freelancer_skill
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

const updateFreelancer_skillById = async (req, res)=>{
    try {
        const id = req.params.id
        const {error, value} = freelancer_skillValidation(req.body)
        
        if (error) {
            return res.status(400).send({ message: error.message });
        }
        const {freelancerId, skillId} = value

        const freelancer_skill = await Freelancer_skill.findByPk(id)
        if(!freelancer_skill){
            return res.status(404).send({
                error: "This freelancer_skill not found"
            })
        }
    
        freelancer_skill.freelancerId = freelancerId;
        freelancer_skill.skillId = skillId
        freelancer_skill.save()
        if(!freelancer_skill){
            return res.status(500).send({
                error: "Internal Server Error"
            })
        }
        
        return res.status(200).send({
            message: "Freelancer_skill updated successfully",
            data: freelancer_skill
        })

    } catch (error) {
        errorHandler(res, error)
    }
}


const deleteFreelancer_skillById = async (req, res)=>{
    try {
        const id = req.params.id
        const freelancer_skill = await Freelancer_skill.findByPk(id)
        if(!freelancer_skill){
            return res.status(404).send({
                error: "This freelancer_skill not found"
            })
        }
        await freelancer_skill.destroy()
        return res.status(202).send({
            message: "Freelancer_skill deleted successfully",
            data: freelancer_skill
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

module.exports = {
    addFreelancer_skill,
    getFreelancer_skills,
    getFreelancer_skillById,
    updateFreelancer_skillById,
    deleteFreelancer_skillById,
}