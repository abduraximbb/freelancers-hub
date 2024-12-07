const sequelize = require("../config/db")
const { errorHandler } = require("../helpers/error_handler")
const Admin = require("../models/admins")
const { adminValidation } = require("../validations/admin.validation")
const bcrypt = require('bcrypt');
const myJwt = require("../services/jwt_service_admin")
const config = require('config');
const { to } = require("../helpers/to_promise");


const addAdmin = async (req, res)=>{
    try {
        const {error, value} = adminValidation(req.body)

        const {username, password, is_super_admin} = value

    if (error) {
        return res.status(400).send({ message: error.message });
      }
        const admin = await Admin.findOne({where: {username}})
        if(admin){
            return res.status(404).send({
                error: "This admin already exists"
            })
        }
    
        const hashed_password = bcrypt.hashSync(password, 7);
        // console.log(hashed_password);
        
        const newAdmin = await Admin.create({username, password:hashed_password, is_super_admin})

        
        const payload = {
            _id: newAdmin.id,
            email: newAdmin.email,
            is_super_admin: newAdmin.is_super_admin,
        };
      const tokens = myJwt.generateTokens(payload);
      newAdmin.refresh_token = tokens.refreshToken;
      newAdmin.save();
  
      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true, maxAge: config.get("refresh_time_ms")
      })

        res.status(201).send({message:"New admin added successfully", data: newAdmin, accessToken:tokens.accessToken})
    } catch (error) {
        errorHandler(res, error)
    }
}

const loginAdmin = async (req, res) => {
    try {
      const { username, password } = req.body;
      const admin = await Admin.findOne({ where:{username} });
      if (!admin) {
        return res.status(400).send({ message: "Admin or password invalid" });
      }
  
      const validPassword = bcrypt.compareSync(password, admin.password);
      if (!validPassword) {
        return res.status(400).send({ message: "Admin or password invalid" });
      }
    //   console.log(admin);
      
    // console.log(admin.id, admin.is_super_admin);
    
  
      const payload = {
        id: admin.id,
        name: admin.username,
        is_super_admin: admin.is_super_admin
      };
  
      const tokens = myJwt.generateTokens(payload);
      admin.refresh_token = tokens.refreshToken;
      admin.is_active = true
      await admin.save();
  
      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        maxAge: config.get("refresh_time_ms"),
      });
  
      res.send({
        message: "Admin logged ",
        id: admin.id,
        accessToken: tokens.accessToken,
      });
    } catch (error) {
      errorHandler(res, error);
    }
  };

  
const logoutAdmin = async (req, res) => {
    const {refreshToken} = req.cookies
    if(!refreshToken){
      res.status(400).send({ message: error.message })
    }
    // console.log(refreshToken);
    
    
    const admin = await Admin.findOne({where: {refresh_token:refreshToken}})
    // console.log(admin);
    
    admin.refresh_token = ""
    admin.is_active = false
    admin.save()
  
    if(!admin){
      res.status(400).send({ message: "Invalid refresh token" });
    }
    // console.log(111,admin);
  
    res.clearCookie("refreshToken")
    res.status(200).send({ message:"Refresh token cleared",refreshToken: admin.token })
}


const refreshAdmin = async (req, res)=>{
    try {
      const { refreshToken } = req.cookies
      if(!refreshToken){
        res.status(403).send({message: "Cookieda RefreshToken topilmadi"})
      }
  
      const [error, decodedRefreshToken] = await to(myJwt.verifyRefreshToken(refreshToken))
  
      const adminFromDB = await Admin.findOne({where:{refresh_token:refreshToken}})
      if(!adminFromDB){
        return res.status(403).send({message: "Ruxsat etilmagan foydalanuvchi(refresh token mos emas)"})
      }
  
      const payload = {
        id: adminFromDB.id,
        name: adminFromDB.username,
        is_super_admin: adminFromDB.is_super_admin
      };
  
      const tokens = myJwt.generateTokens(payload)
      adminFromDB.refresh_token = tokens.refreshToken
      adminFromDB.is_active = false
      await adminFromDB.save()
  
      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true, maxAge: config.get("refresh_time_ms")
      })
      res.send({ message: "Token refreshed successfully", id: adminFromDB.id, accessToken: tokens.accessToken });
  
  
    } catch (error) {
      errorHandler(res, error)
    }
  }

const getAdmins = async (req, res)=>{
    try {
        const admins = await Admin.findAll({
            attributes: { exclude: ['password'] },
          })
        res.status(200).send({
            message: "All admins fetched successfully",
            data: admins
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

const getAdminById = async (req, res)=>{
    try {
        const id = req.params.id
        if(req.admin.id != id){
          return res.status(400).send({message: "You are not this id's admin"})
        }
        
        const admin = await Admin.findByPk(id)
        if(!admin){
            return res.status(404).send({
                error: "This admin not found"
            })
        }
        return res.status(200).send({
            message: "Admin fetched successfully",
            data: admin
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

const getAdminByUsername = async (req, res)=>{
    try {
        const {username} = req.body
        console.log(req.admin);
        
        if(req.admin.name != username){
          return res.status(400).send({message: "You are not this username's admin"})
        }
        const admin = await Admin.findOne({where: {username}})
        if(!admin){
            return res.status(404).send({
                error: "This admin not found"
            })
        }
        return res.status(200).send({
            message: "Admin fetched successfully",
            data: admin
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

const updateAdnminByCreator = async (req, res)=>{
    try {
        const id = req.params.id

        const {error, value} = adminValidation(req.body)
        
        if (error) {
            return res.status(400).send({ message: error.message });
        }
        const {username, password, is_super_admin} = value
        const hashed_password = bcrypt.hashSync(password, 7);

        const admin = await Admin.findByPk(id)
        if(!admin){
            return res.status(404).send({
                error: "This admin not found"
            })
        }
        const exist_admin = await Admin.findOne({where: {username}})
        if(exist_admin){
            return res.status(404).send({
                error: "This admin already exists"
            })
        }
    
        admin.username = username;
        admin.password = hashed_password;
        admin.is_super_admin = is_super_admin
        admin.save()
        if(!admin){
            return res.status(500).send({
                error: "Internal Server Error"
            })
        }
        // console.log(updated_client);
        
        return res.status(200).send({
            message: "Admin updated successfully",
            data: admin
        })

    } catch (error) {
        errorHandler(res, error)
    }
}


const updateSelfAdmin = async (req, res)=>{
  try {
      const id = req.params.id
      
      if(!req.admin.is_super_admin){
        if(req.admin.id != id){
          return res.status(400).send({message:"This id not your"})
        }
    }

      const {error, value} = adminValidation(req.body)
      
      if (error) {
          return res.status(400).send({ message: error.message });
      }
      const {username, password} = value
      const hashed_password = bcrypt.hashSync(password, 7);

      const admin = await Admin.findByPk(id)
      if(!admin){
          return res.status(404).send({
              error: "This admin not found"
          })
      }
      const exist_admin = await Admin.findOne({where: {username}})
      if(exist_admin){
          return res.status(404).send({
              error: "This admin already exists"
          })
      }
  
      admin.username = username;
      admin.password = hashed_password;
      admin.save()
      if(!admin){
          return res.status(500).send({
              error: "Internal Server Error"
          })
      }
      
      return res.status(200).send({
          message: "Admin updated successfully",
          data: admin
      })

  } catch (error) {
      errorHandler(res, error)
  }
}


const deleteAdminById = async (req, res)=>{
    try {
        const id = req.params.id
        const admin = await Admin.findByPk(id)
        if(!admin){
            return res.status(404).send({
                error: "This admin not found"
            })
        }
        await admin.destroy()
        return res.status(202).send({
            message: "Admin deleted successfully",
            data: admin
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

module.exports = {
    addAdmin,
    getAdmins,
    getAdminById,
    updateAdnminByCreator,
    getAdminByUsername,
    deleteAdminById,
    loginAdmin,
    logoutAdmin,
    refreshAdmin,
    updateSelfAdmin
}