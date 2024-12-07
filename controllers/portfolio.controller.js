const sequelize = require("../config/db")
const { errorHandler } = require("../helpers/error_handler")
const Portfolio = require("../models/portfolio")
const {  portfolioValidation} = require("../validations/portfolio.validation")
const Freelancer = require("../models/freelancers")

const addPortfolio = async (req, res)=>{
    try {
        const {error, value} = portfolioValidation(req.body)

        const {project_name, project_link, project_descriptions, freelancerId} = value

    if (error) {
        return res.status(400).send({ message: error.message });
      }
        
        const newPortfolio = await Portfolio.create({project_name, project_link, project_descriptions, freelancerId})
        res.status(201).send({message:"New portfolio added successfully", data: newPortfolio})
    } catch (error) {
        errorHandler(res, error)
    }
}

const getPortfolios = async (req, res)=>{
    try {
        const portfolios = await Portfolio.findAll({
            include: {model: Freelancer, attributes: ["full_name"]}
        })
        res.status(200).send({
            message: "All portfolios fetched successfully",
            data: portfolios
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

const getPortfolioById = async (req, res)=>{
    try {
        const id = req.params.id
        const portfolio = await Portfolio.findByPk(id)
        if(!portfolio){
            return res.status(404).send({
                error: "This portfolio not found"
            })
        }
        return res.status(200).send({
            message: "Portfolio fetched successfully",
            data: portfolio
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

const updatePortfolioById = async (req, res)=>{
    try {
        const id = req.params.id
        const {error, value} = portfolioValidation(req.body)
        
        if (error) {
            return res.status(400).send({ message: error.message });
        }
        const {project_name, project_link, project_descriptions, freelancerId} = value

        const portfolio = await Portfolio.findByPk(id)
        if(!portfolio){
            return res.status(404).send({
                error: "This portfolio not found"
            })
        }
    
        portfolio.project_name = project_name;
        portfolio.project_link = project_link;
        portfolio.project_descriptions = project_descriptions
        portfolio.save()
        if(!portfolio){
            return res.status(500).send({
                error: "Internal Server Error"
            })
        }

        return res.status(200).send({
            message: "Portfolio updated successfully",
            data: portfolio
        })

    } catch (error) {
        errorHandler(res, error)
    }
}


const deletePortfolioById = async (req, res)=>{
    try {
        const id = req.params.id
        const portfolio = await Portfolio.findByPk(id)
        if(!portfolio){
            return res.status(404).send({
                error: "This portfolio not found"
            })
        }
        await portfolio.destroy()
        return res.status(202).send({
            message: "Portfolio deleted successfully",
            data: portfolio
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

module.exports = {
    addPortfolio,
    getPortfolios,
    getPortfolioById,
    updatePortfolioById,
    deletePortfolioById,
}