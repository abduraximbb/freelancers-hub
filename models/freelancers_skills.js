const sequelize = require("../config/db")

const {DataTypes} = require("sequelize")

const Freelancer = require("./freelancers")
const Skill = require("./skills")

const Freelancers_skills = sequelize.define("freelancers_skills", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
},
{
    timestamps:false
}
)

Freelancer.belongsToMany(Skill, { through: Freelancers_skills})
Skill.belongsToMany(Freelancer, { through: Freelancers_skills})

Freelancer.hasMany(Freelancers_skills)
Freelancers_skills.belongsTo(Freelancer)

Skill.hasMany(Freelancers_skills)
Freelancers_skills.belongsTo(Skill)

module.exports = Freelancers_skills