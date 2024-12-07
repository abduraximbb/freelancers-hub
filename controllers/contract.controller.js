const sequelize = require("../config/db")
const { errorHandler } = require("../helpers/error_handler")
const Contract = require("../models/contracts")
const {  contractValidation} = require("../validations/contract.validation")

const Freelancer = require("../models/freelancers")
const Project = require("../models/project")

const addContract = async (req, res)=>{
    try {
        const {error, value} = contractValidation(req.body)

        const {total_price, descriptions,expiration_time,status,projectId,freelancerId} = value

    if (error) {
        return res.status(400).send({ message: error.message });
      }
        
        const newContract = await Contract.create({total_price, descriptions,expiration_time,status,projectId,freelancerId})
        res.status(201).send({message:"New contract added successfully", data: newContract})
    } catch (error) {
        errorHandler(res, error)
    }
}

const getContracts = async (req, res)=>{
    try {
        const contracts = await Contract.findAll({
            include: [
                {model: Freelancer, attributes: ["full_name"]},
                {model: Project, attributes: ["project_title"]}
            ]
        })
        res.status(200).send({
            message: "All contracts fetched successfully",
            data: contracts
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

const getContractById = async (req, res)=>{
    try {
        const id = req.params.id
        const contract = await Contract.findByPk(id)
        if(!contract){
            return res.status(404).send({
                error: "This contract not found"
            })
        }
        return res.status(200).send({
            message: "Contract fetched successfully",
            data: contract
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

const updateContractById = async (req, res)=>{
    try {
        const id = req.params.id
        const {error, value} = contractValidation(req.body)
        
        if (error) {
            return res.status(400).send({ message: error.message });
        }
        const {total_price, descriptions,expiration_time,status,projectId,freelancerId} = value

        const contract = await Contract.findByPk(id)
        if(!contract){
            return res.status(404).send({
                error: "This contract not found"
            })
        }
        const project = await Project.findByPk(projectId)
        const freelancer = await Freelancer.findByPk(freelancerId)
        if(!project){
            return res.status(400).send({message: "Not this project id's"})
        }
        if(!freelancer){
            return res.status(400).send({message: "Not this freelancer id's"})
        }

    
        contract.total_price = total_price;
        contract.descriptions = descriptions;
        contract.expiration_time = expiration_time
        contract.status = status
        contract.projectId = projectId
        contract.freelancerId = freelancerId
        contract.save()
        if(!contract){
            return res.status(500).send({
                error: "Internal Server Error"
            })
        }

        return res.status(200).send({
            message: "Contract updated successfully",
            data: contract
        })

    } catch (error) {
        errorHandler(res, error)
    }
}


const deleteContractById = async (req, res)=>{
    try {
        const id = req.params.id
        const contract = await Contract.findByPk(id)
        if(!contract){
            return res.status(404).send({
                error: "This contract not found"
            })
        }
        await contract.destroy()
        return res.status(202).send({
            message: "Contract deleted successfully",
            data: contract
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

module.exports = {
    addContract,
    getContracts,
    getContractById,
    updateContractById,
    deleteContractById,
}