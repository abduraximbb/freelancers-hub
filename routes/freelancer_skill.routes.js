const {Router} = require("express")
const { addFreelancer_skill, getFreelancer_skills, getFreelancer_skillById, updateFreelancer_skillById, deleteFreelancer_skillById } = require("../controllers/freelancer_skill.controller")

const freelancerPolice = require("../middleware/freelancer_police")

const router = Router()

router.post("/",freelancerPolice, addFreelancer_skill)
router.get('/', getFreelancer_skills)
router.get("/:id", getFreelancer_skillById)
router.patch("/:id", freelancerPolice,updateFreelancer_skillById)
router.delete("/:id", freelancerPolice,deleteFreelancer_skillById)

module.exports = router