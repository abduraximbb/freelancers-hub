const sequelize = require("../config/db")

const {DataTypes} = require("sequelize")

const Project = require("../models/project")
const Freelancer = require("../models/freelancers")

const Contract = sequelize.define("contract", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    total_price: {
        type: DataTypes.DECIMAL(15,2),
    },
    descriptions: {
        type: DataTypes.STRING(2000)
    },
    expiration_time: {
        type: DataTypes.DATE()
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}
)

Contract.belongsTo(Project)
Project.hasMany(Contract)

Contract.belongsTo(Freelancer)
Freelancer.hasMany(Contract)

module.exports = Contract