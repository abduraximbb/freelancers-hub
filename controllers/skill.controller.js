const sequelize = require("../config/db")
const { errorHandler } = require("../helpers/error_handler")
const Skill = require("../models/skills")
const {  skillValidation} = require("../validations/skill.validation")
const Freelancer = require("../models/freelancers")

const addSkill = async (req, res)=>{
    try {
        const {error, value} = skillValidation(req.body)

        const {skill_name} = value

    if (error) {
        return res.status(400).send({ message: error.message });
      }
        const skill = await Skill.findOne({where: {skill_name}})
        if(skill){
            return res.status(404).send({
                error: "This skill already exists"
            })
        }
        
        const newSkill = await Skill.create({skill_name})
        res.status(201).send({message:"New skill added successfully", data: newSkill})
    } catch (error) {
        errorHandler(res, error)
    }
}

const getSkills = async (req, res)=>{
    try {
        const skills = await Skill.findAll({
            include: {model: Freelancer, attributes: ["full_name"]}
        })
        res.status(200).send({
            message: "All skills fetched successfully",
            data: skills
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

const getSkillById = async (req, res)=>{
    try {
        const id = req.params.id
        const skill = await Skill.findByPk(id)
        if(!skill){
            return res.status(404).send({
                error: "This skill not found"
            })
        }
        return res.status(200).send({
            message: "Skill fetched successfully",
            data: skill
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

const getSkillBySkillname = async (req, res)=>{
    try {
        const skill_name = req.params.skillname
        const skill = await Skill.findOne({where: {skill_name}})
        if(!skill){
            return res.status(404).send({
                error: "This skill not found"
            })
        }
        return res.status(200).send({
            message: "Skill fetched successfully",
            data: skill
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

const updateSkillById = async (req, res)=>{
    try {
        const id = req.params.id
        const {error, value} = skillValidation(req.body)
        
        if (error) {
            return res.status(400).send({ message: error.message });
        }
        const {skill_name} = value

        const skill = await Skill.findByPk(id)
        if(!skill){
            return res.status(404).send({
                error: "This skill not found"
            })
        }
        const exist_skill = await Skill.findOne({where: {skill_name}})
        if(exist_skill){
            return res.status(404).send({
                error: "This skill already exists"
            })
        }
    
        skill.skill_name = skill_name;
        skill.save()
        if(!skill){
            return res.status(500).send({
                error: "Internal Server Error"
            })
        }
        // console.log(updated_client);
        
        return res.status(200).send({
            message: "Skill updated successfully",
            data: skill
        })

    } catch (error) {
        errorHandler(res, error)
    }
}


const deleteSkillById = async (req, res)=>{
    try {
        const id = req.params.id
        const skill = await Skill.findByPk(id)
        if(!skill){
            return res.status(404).send({
                error: "This skill not found"
            })
        }
        await skill.destroy()
        return res.status(202).send({
            message: "Skill deleted successfully",
            data: skill
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

module.exports = {
    addSkill,
    getSkills,
    getSkillById,
    updateSkillById,
    deleteSkillById,
    getSkillBySkillname
}