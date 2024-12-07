const sequelize = require("../config/db")

const {DataTypes} = require("sequelize")

const Freelancer = sequelize.define("freelancer", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    full_name: {
        type: DataTypes.STRING(100),
        unique: true
    },
    descriptions: {
        type: DataTypes.STRING(2000),
    },
    email: {
        type: DataTypes.STRING(100),
    },
    password: {
        type: DataTypes.STRING(200),
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    refresh_token: {
        type: DataTypes.STRING(200)
    },
    activation_link: {
        type: DataTypes.STRING(200)
    }
}
)

module.exports = Freelancer