const sequelize = require("../config/db")
const { errorHandler } = require("../helpers/error_handler")
const Client = require("../models/clients")
const { clientValidation } = require("../validations/client.validation")
const bcrypt = require('bcrypt');
const uuid = require("uuid")
const config = require('config');

const myJwt = require("../services/jwt_service")
const { to } = require("../helpers/to_promise");
const mail_service = require("../services/mail_service")

const Project = require("../models/project")


const addClient = async (req, res)=>{
    try {
        const {error, value} = clientValidation(req.body)

        const {full_name,descriptions,email, password} = value

    if (error) {
        return res.status(400).send({ message: error.message });
      }
        const exists_full_name = await Client.findOne({where: {full_name}})
        if(exists_full_name){
            return res.status(404).send({
                error: "This client already exists duplicate(email or username)"
            })
        }

        const exists_email = await Client.findOne({where: {email}})
        if(exists_email){
            return res.status(404).send({
                error: "This client already exists duplicate(email or username)"
            })
        }
    
        const hashed_password = bcrypt.hashSync(password, 7);

        const activation_link = uuid.v4()

        const newClient = await Client.create({full_name,descriptions,email, password:hashed_password, activation_link})

        await mail_service.sendActivationmail(email, `${config.get("api_url")}:${config.get("port")}/api/client/activate/${activation_link}`)
        
        const payload = {
            _id: newClient.id,
            email: newClient.email,
        };
        const tokens = myJwt.generateTokens(payload);
        newClient.refresh_token = tokens.refreshToken;
        newClient.save();
  
        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true, maxAge: config.get("refresh_time_ms")
        })

        res.status(201).send({message:"New client added successfully", data: newClient})
    } catch (error) {
        errorHandler(res, error)
    }
}

const loginClient = async (req, res) => {
    try {
      const { email, password } = req.body;
      const client = await Client.findOne({ where:{email} });
      if (!client) {
        return res.status(400).send({ message: "Client or password invalid" });
      }
  
      const validPassword = bcrypt.compareSync(password, client.password);
      if (!validPassword) {
        return res.status(400).send({ message: "Client or password invalid" });
      }
  
      const payload = {
        id: client.id,
        name: client.email,
      };
  
      const tokens = myJwt.generateTokens(payload);
      client.refresh_token = tokens.refreshToken;
      client.is_active = true
      await client.save();
  
      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        maxAge: config.get("refresh_time_ms"),
      });
  
      res.send({
        message: "Client logged ",
        id: client.id,
        accessToken: tokens.accessToken,
      });
    } catch (error) {
      errorHandler(res, error);
    }
  };

  
const logoutClient = async (req, res) => {
    const {refreshToken} = req.cookies
    if(!refreshToken){
      res.status(400).send({ message: error.message })
    }
    
    const client = await Client.findOne({where: {refresh_token:refreshToken}})
    
    client.refresh_token = ""
    client.is_active = false
    client.save()
  
    if(!client){
      res.status(400).send({ message: "Invalid refresh token" });
    }
  
    res.clearCookie("refreshToken")
    res.status(200).send({ message:"Refresh token cleared",refreshToken: client.token })
}


const refreshClient = async (req, res)=>{
    try {
      const { refreshToken } = req.cookies
      if(!refreshToken){
        res.status(403).send({message: "Cookieda RefreshToken topilmadi"})
      }
  
      const [error, decodedRefreshToken] = await to(myJwt.verifyRefreshToken(refreshToken))
  
      const clientFromDB = await Client.findOne({where:{refresh_token:refreshToken}})
      if(!clientFromDB){
        return res.status(403).send({message: "Ruxsat etilmagan foydalanuvchi(refresh token mos emas)"})
      }
  
      const payload = {
        id: clientFromDB.id,
        name: clientFromDB.email,
      };
  
      const tokens = myJwt.generateTokens(payload)
      clientFromDB.refresh_token = tokens.refreshToken
      await clientFromDB.save()
  
      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true, maxAge: config.get("refresh_time_ms")
      })
      res.send({ message: "Token refreshed successfully", id: clientFromDB.id, accessToken: tokens.accessToken });
  
  
    } catch (error) {
      errorHandler(res, error)
    }
  }

const getClients = async (req, res)=>{
    try {
        const clients = await Client.findAll({
          include: {model:Project, attributes:["project_title"]}
        })
        res.status(200).send({
            message: "All clients fetched successfully",
            data: clients
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

const getClientById = async (req, res)=>{
    try {
        const id = req.params.id
        if(req.client.id != id){
          return res.status(400).send({message: "You are not this id's client"})
        }
        const client = await Client.findByPk(id)
        if(!client){
            return res.status(404).send({
                error: "This client not found"
            })
        }
        return res.status(200).send({
            message: "Client fetched successfully",
            data: client
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

const getClientByname = async (req, res)=>{
    try {
        const {name} = req.body
        const client = await Client.findOne({where: {full_name:name}})
        if(!client){
            return res.status(404).send({
                error: "This client not found"
            })
        }
        return res.status(200).send({
            message: "Client fetched successfully",
            data: client
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

const updateClientById = async (req, res)=>{
    try {
        const id = req.params.id
        if(req.client.id != id){
          return res.status(400).send({message: "You are not this id's client"})
        }
        const {error, value} = clientValidation(req.body)
        
        if (error) {
            return res.status(400).send({ message: error.message });
        }
        const {full_name, descriptions,email, password} = value
        
        const hashed_password = bcrypt.hashSync(password, 7);

        const client = await Client.findByPk(id)
        if(!client){
            return res.status(404).send({
                error: "This client not found"
            })
        }
        const exist_email = await Client.findOne({where: {email}})
        if(exist_email){
            return res.status(404).send({
                error: "This client already exists"
            })
        }

        const exist_full_name = await Client.findOne({where: {full_name}})
        if(exist_full_name){
            return res.status(404).send({
                error: "This client already exists"
            })
        }
    
        client.full_name = full_name;
        client.descriptions = descriptions;
        client.email = email
        client.password = hashed_password
        client.save()
        if(!client){
            return res.status(500).send({
                error: "Internal Server Error"
            })
        }
        
        return res.status(200).send({
            message: "Client updated successfully",
            data: client
        })

    } catch (error) {
        errorHandler(res, error)
    }
}


const deleteClientById = async (req, res)=>{
    try {
        const id = req.params.id
        if(req.client.id != id){
          return res.status(400).send({message: "You are not this id's client"})
        }
        const client = await Client.findByPk(id)
        if(!client){
            return res.status(404).send({
                error: "This client not found"
            })
        }
        await client.destroy()
        return res.status(202).send({
            message: "Client deleted successfully",
            data: client
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

const activateClient = async (req, res)=>{
    try {
      const link = req.params.link
      const client = await Client.findOne({activation_link:link})
    //   console.log(client);
      
      
      if(!client){
          return res.status(400).send({message:"This client not found"})
        }
      if(client.is_active){
            return res.status(400).send({message:"This client already activated"})
        }
        
      client.is_active = true
      await client.save()
  
      res.send({is_active: client.is_active,message:"Client activated"})
    } catch (error) {
      errorHandler(res, error)
    }
}

module.exports = {
    addClient,
    getClients,
    getClientById,
    updateClientById,
    getClientByname,
    deleteClientById,
    loginClient,
    logoutClient,
    refreshClient,
    activateClient
}