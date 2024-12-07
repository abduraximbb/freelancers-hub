const {Router} = require("express")
const { addSkill, getSkills, getSkillBySkillname, getSkillById, updateSkillById, deleteSkillById } = require("../controllers/skill.controller")
const freelancerPolice = require("../middleware/freelancer_police")

const router = Router()

router.post("/", freelancerPolice, addSkill)
router.get('/', getSkills)
router.get("/skillname/:skillname", getSkillBySkillname)
router.get("/:id", getSkillById)
router.patch("/:id", freelancerPolice, updateSkillById)
router.delete("/:id", freelancerPolice, deleteSkillById)

module.exports = router