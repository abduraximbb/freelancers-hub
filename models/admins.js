const sequelize = require("../config/db")

const {DataTypes} = require("sequelize")

const Admin = sequelize.define("admin", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(200),
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_super_admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    refresh_token: {
        type: DataTypes.STRING(200)
    }
}
)

module.exports = Admin