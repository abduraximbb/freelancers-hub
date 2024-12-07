const sequelize = require("../config/db")
const { errorHandler } = require("../helpers/error_handler")
const Project = require("../models/project")
const {  projectValidation} = require("../validations/project.validation")

const Client = require("../models/clients")
const Contract = require("../models/contracts")

const { clientValidation } = require("../validations/client.validation")


const addProject = async (req, res)=>{
    try {
        const {error, value} = projectValidation(req.body)

        const {project_title, project_text, price, status, clientId} = value

    if (error) {
        return res.status(400).send({ message: error.message });
      }
        
        const newProject = await Project.create({project_title, project_text, price, status, clientId})
        res.status(201).send({message:"New project added successfully", data: newProject})
    } catch (error) {
        errorHandler(res, error)
    }
}

const getProjects = async (req, res)=>{
    try {
        const projects = await Project.findAll({
            include:[ 
                {model: Client, attributes: ["full_name"]},
                {model: Contract, attributes: ["id", "expiration_time"]}
            ]
        })
        res.status(200).send({

            message: "All projects fetched successfully",
            data: projects
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

const getProjectById = async (req, res)=>{
    try {
        const id = req.params.id
        const project = await Project.findByPk(id)
        if(!project){
            return res.status(404).send({
                error: "This project not found"
            })
        }
        return res.status(200).send({
            message: "Project fetched successfully",
            data: project
        })
    } catch (error) {
        errorHandler(res, error)
    }
}


const getProjectByName = async (req, res)=>{
    try {
        const name = req.params.name
        const project = await Project.findOne({where:{project_title:name}})
        if(!project){
            return res.status(404).send({
                error: "This project not found"
            })
        }
        return res.status(200).send({
            message: "Project fetched successfully",
            data: project
        })
    } catch (error) {
        errorHandler(res, error)
    }
}


const updateProjectById = async (req, res)=>{
    try {
        const id = req.params.id
        const {error, value} = projectValidation(req.body)
        
        if (error) {
            return res.status(400).send({ message: error.message });
        }
        const {project_title, project_text, price, status, clientId} = value

        const project = await Project.findByPk(id)
        if(!project){
            return res.status(404).send({
                error: "This project not found"
            })
        }
        
        const client = await Client.findByPk(clientId)
        if(!client){
            return res.status(400).send({message:"Not Client this id"})
        }

        project.project_title = project_title;
        project.project_text = project_text;
        project.price = price;
        project.status = status
        project.clientId = clientId
        project.save()
        if(!project){
            return res.status(500).send({
                error: "Internal Server Error"
            })
        }

        return res.status(200).send({
            message: "Project updated successfully",
            data: project
        })

    } catch (error) {
        errorHandler(res, error)
    }
}


const deleteProjectById = async (req, res)=>{
    try {
        const id = req.params.id
        const project = await Project.findByPk(id)
        if(!project){
            return res.status(404).send({
                error: "This project not found"
            })
        }
        await project.destroy()
        return res.status(202).send({
            message: "Project deleted successfully",
            data: project
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

module.exports = {
    addProject,
    getProjects,
    getProjectById,
    updateProjectById,
    deleteProjectById,
    getProjectByName
}