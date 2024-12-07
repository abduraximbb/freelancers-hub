const sequelize = require("../config/db")

const {DataTypes} = require("sequelize")

const Freelancer = require("./freelancers")

const Portfolio = sequelize.define("portfolio", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    project_name: {
        type: DataTypes.STRING(100),
    },
    project_link: {
        type: DataTypes.STRING(200)
    },
    project_description: {
        type: DataTypes.STRING(2000)
    }
}
)

Portfolio.belongsTo(Freelancer)
Freelancer.hasMany(Portfolio)

module.exports = Portfolio