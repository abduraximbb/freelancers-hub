const sequelize = require("../config/db")

const {DataTypes} = require("sequelize")

const Contract = require("./contracts")

const Payment = sequelize.define("payment", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    total_price: {
        type: DataTypes.INTEGER
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}
)

Payment.belongsTo(Contract)
Contract.hasMany(Payment)

module.exports = Payment