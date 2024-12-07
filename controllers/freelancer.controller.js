const sequelize = require("../config/db")
const { errorHandler } = require("../helpers/error_handler")
const Freelancer = require("../models/freelancers")
const { freelancerValidation } = require("../validations/freelancer.validation")
const bcrypt = require('bcrypt');
const uuid = require("uuid")
const config = require('config');

const myJwt = require("../services/jwt_service")
const { to } = require("../helpers/to_promise");
const mail_service = require("../services/mail_service")

const Skill = require("../models/skills")
const Portfolio = require("../models/portfolio")
const Contract = require("../models/contracts")

const addFreelancer = async (req, res)=>{
    try {
        const {error, value} = freelancerValidation(req.body)

        const {full_name,descriptions,email, password} = value

    if (error) {
        return res.status(400).send({ message: error.message });
      }
        const exists_email = await Freelancer.findOne({where: {email}})
        if(exists_email){
            return res.status(404).send({
                error: "This freelancer already exists duplicate(email or username"
            })
        }

        const exists_full_name = await Freelancer.findOne({where: {full_name}})
        if(exists_full_name){
            return res.status(404).send({
                error: "This freelancer already exists duplicate(email or username)"
            })
        }
    
        const hashed_password = bcrypt.hashSync(password, 7);

        const activation_link = uuid.v4()

        const newFreelancer = await Freelancer.create({full_name,descriptions,email, password:hashed_password, activation_link})

        await mail_service.sendActivationmail(email, `${config.get("api_url")}:${config.get("port")}/api/freelancer/activate/${activation_link}`)
        
        const payload = {
            _id: newFreelancer.id,
            email: newFreelancer.email,
        };
        const tokens = myJwt.generateTokens(payload);
        newFreelancer.refresh_token = tokens.refreshToken;
        newFreelancer.save();
  
        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true, maxAge: config.get("refresh_time_ms")
        })

        res.status(201).send({message:"New freelancer added successfully", data: newFreelancer})
    } catch (error) {
        errorHandler(res, error)
    }
}

const loginFreelancer = async (req, res) => {
    try {
      const { email, password } = req.body;
      const freelancer = await Freelancer.findOne({ where:{email} });
      if (!freelancer) {
        return res.status(400).send({ message: "Freelancer or password invalid" });
      }
  
      const validPassword = bcrypt.compareSync(password, freelancer.password);
      if (!validPassword) {
        return res.status(400).send({ message: "Freelancer or password invalid" });
      }
  
      const payload = {
        id: freelancer.id,
        name: freelancer.email,
      };
  
      const tokens = myJwt.generateTokens(payload);
      freelancer.refresh_token = tokens.refreshToken;
      freelancer.is_active=true
      await freelancer.save();
  
      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        maxAge: config.get("refresh_time_ms"),
      });
  
      res.send({
        message: "Freelancer logged ",
        id: freelancer.id,
        accessToken: tokens.accessToken,
      });
    } catch (error) {
      errorHandler(res, error);
    }
  };

  
const logoutFreelancer = async (req, res) => {
    const {refreshToken} = req.cookies
    if(!refreshToken){
      res.status(400).send({ message: error.message })
    }
    
    const freelancer = await Freelancer.findOne({where: {refresh_token:refreshToken}})
    
    freelancer.refresh_token = ""
    freelancer.is_active = false
    freelancer.save()
  
    if(!freelancer){
      res.status(400).send({ message: "Invalid refresh token" });
    }
    // console.log(111,freelancer);
  
    res.clearCookie("refreshToken")
    res.status(200).send({ message:"Refresh token cleared",refreshToken: freelancer.token })
}


const refreshFreelancer = async (req, res)=>{
    try {
      const { refreshToken } = req.cookies
      if(!refreshToken){
        return res.status(403).send({message: "Cookieda RefreshToken topilmadi"})
      }
  
      const [error, decodedRefreshToken] = await to(myJwt.verifyRefreshToken(refreshToken))
  
      const freelancerFromDB = await Freelancer.findOne({where:{refresh_token:refreshToken}})
      if(!freelancerFromDB){
        return res.status(403).send({message: "Ruxsat etilmagan foydalanuvchi(refresh token mos emas)"})
      }
  
      const payload = {
        id: freelancerFromDB.id,
        name: freelancerFromDB.email,
      };
  
      const tokens = myJwt.generateTokens(payload)
      freelancerFromDB.refresh_token = tokens.refreshToken
      await freelancerFromDB.save()
  
      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true, maxAge: config.get("refresh_time_ms")
      })
      res.send({ message: "Token refreshed successfully", id: freelancerFromDB.id, accessToken: tokens.accessToken });
  
  
    } catch (error) {
      errorHandler(res, error)
    }
  }


const getFreelancers = async (req, res)=>{
    try {
        const freelancers = await Freelancer.findAll({
          include: [
            {model: Skill,  attributes: ["skill_name"]},
            {model: Portfolio, attributes: ["project_name", "project_link"]},
            {model: Contract, attributes: ["id", "expiration_time"]}
          ]
        })
        res.status(200).send({
            message: "All freelancers fetched successfully",
            data: freelancers
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

const getFreelancerById = async (req, res)=>{
    try {
        const id = req.params.id
        const freelancer = await Freelancer.findByPk(id)
        if(!freelancer){
            return res.status(404).send({
                error: "This freelancer not found"
            })
        }
        return res.status(200).send({
            message: "Freelancer fetched successfully",
            data: freelancer
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

const getFreelancerByName = async (req, res)=>{
    try {
        const {name} = req.body
        const freelancer = await Freelancer.findOne({where: {full_name:name}})
        if(!freelancer){
            return res.status(404).send({
                error: "This freelancer not found"
            })
        }
        return res.status(200).send({
            message: "Freelancer fetched successfully",
            data: freelancer
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

const updateFreelancerById = async (req, res)=>{
    try {
        const id = req.params.id
        if(req.freelancer.id != id){
          return res.status(400).send({message: "You are not this id's freelancer"})
        }
        const freelancer = await Freelancer.findByPk(id)
        if(!freelancer){
            return res.status(404).send({
                error: "This freelancer not found"
            })
        }
        const {error, value} = freelancerValidation(req.body)
        
        if (error) {
            return res.status(400).send({ message: error.message });
        }
        const {full_name, descriptions,email, password} = value

        const exists_email = await Freelancer.findOne({where: {email}})
        if(exists_email){
            return res.status(404).send({
                error: "This freelancer already exists duplicate(email or username"
            })
        }

        const exists_full_name = await Freelancer.findOne({where: {full_name}})
        if(exists_full_name){
            return res.status(404).send({
                error: "This freelancer already exists duplicate(email or username)"
            })
        }

        const hashed_password = bcrypt.hashSync(password, 7)
    
        freelancer.full_name = full_name;
        freelancer.descriptions = descriptions;
        freelancer.email = email
        freelancer.password = hashed_password
        freelancer.save()
        if(!freelancer){
            return res.status(500).send({
                error: "Internal Server Error"
            })
        }
        
        return res.status(200).send({
            message: "Freelancer updated successfully",
            data: freelancer
        })

    } catch (error) {
        errorHandler(res, error)
    }
}


const deleteFreelancerById = async (req, res)=>{
    try {
        const id = req.params.id
        if(req.freelancer.id != id){
          return res.status(400).send({message: "You are not this id's freelancer"})
        }
        const freelancer = await Freelancer.findByPk(id)
        if(!freelancer){
            return res.status(404).send({
                error: "This freelancer not found"
            })
        }
        await freelancer.destroy()
        return res.status(202).send({
            message: "Freelancer deleted successfully",
            data: freelancer
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

const freelancerActivate = async (req, res)=>{
    try {
      const link = req.params.link
      const freelancer = await Freelancer.findOne({activation_link:link})
    //   console.log(freelancer);
      
      
      if(!freelancer){
          return res.status(400).send({message:"This freelancer not found"})
        }
      if(freelancer.is_active){
            return res.status(400).send({message:"This freelancer already activated"})
        }
        
      freelancer.is_active = true
      await freelancer.save()
  
      res.send({is_active: freelancer.is_active,message:"Freelancer activated"})
    } catch (error) {
      errorHandler(res, error)
    }
}

module.exports = {
    addFreelancer,
    getFreelancers,
    getFreelancerById,
    updateFreelancerById,
    getFreelancerByName,
    deleteFreelancerById,
    loginFreelancer,
    logoutFreelancer,
    refreshFreelancer,
    freelancerActivate
}