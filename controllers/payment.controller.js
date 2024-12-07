const sequelize = require("../config/db")
const { errorHandler } = require("../helpers/error_handler")
const Payment = require("../models/payment")
const {  paymentValidation} = require("../validations/payment.validation")

const Contract = require("../models/contracts")

const addPayment = async (req, res)=>{
    try {
        const {error, value} = paymentValidation(req.body)

        const {total_price, status, contractId} = value

    if (error) {
        return res.status(400).send({ message: error.message });
      }
        
        const newPayment = await Payment.create({total_price, status, contractId})
        res.status(201).send({message:"New payment added successfully", data: newPayment})
    } catch (error) {
        errorHandler(res, error)
    }
}

const getPayments = async (req, res)=>{
    try {
        const payments = await Payment.findAll({
            include:   {model: Contract, attributes: ["id","status"]}
        })
        res.status(200).send({
            message: "All payments fetched successfully",
            data: payments
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

const getPaymentById = async (req, res)=>{
    try {
        const id = req.params.id
        const payment = await Payment.findByPk(id)
        if(!payment){
            return res.status(404).send({
                error: "This payment not found"
            })
        }
        return res.status(200).send({
            message: "Payment fetched successfully",
            data: payment
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

const updatePaymentById = async (req, res)=>{
    try {
        const id = req.params.id
        const {error, value} = paymentValidation(req.body)
        
        if (error) {
            return res.status(400).send({ message: error.message });
        }
        const {total_price, status, contractId} = value

        const payment = await Payment.findByPk(id)
        if(!payment){
            return res.status(404).send({
                error: "This payment not found"
            })
        }

        const contract = await Contract.findByPk(contractId)
        if(!contract){
            return res.status(400).send({message: "Not contract by this id's"})
        }
    
        payment.total_price = total_price;
        payment.status = status;
        payment.contractId = contractId
        payment.save()
        if(!payment){
            return res.status(500).send({
                error: "Internal Server Error"
            })
        }

        return res.status(200).send({
            message: "Payment updated successfully",
            data: payment
        })

    } catch (error) {
        errorHandler(res, error)
    }
}


const deletePaymentById = async (req, res)=>{
    try {
        const id = req.params.id
        const payment = await Payment.findByPk(id)
        if(!payment){
            return res.status(404).send({
                error: "This payment not found"
            })
        }
        await payment.destroy()
        return res.status(202).send({
            message: "Payment deleted successfully",
            data: payment
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

module.exports = {
    addPayment,
    getPayments,
    getPaymentById,
    updatePaymentById,
    deletePaymentById,
}