const sequelize = require("../config/db")

const {DataTypes} = require("sequelize")

const Skill = sequelize.define("skill", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    skill_name: {
        type: DataTypes.STRING(100),
        unique: true
    }
}
)
module.exports = Skill