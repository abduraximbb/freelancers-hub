const sequelize = require("../config/db")

const {DataTypes} = require("sequelize")

const Client = require("./clients")

const Project = sequelize.define("project", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    project_title: {
        type: DataTypes.STRING(100),
    },
    project_text: {
        type: DataTypes.STRING(2000)
    },
    price: {
        type: DataTypes.DECIMAL(15,2)
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}
)

Project.belongsTo(Client)
Client.hasMany(Project)

module.exports = Project