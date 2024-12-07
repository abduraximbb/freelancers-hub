const {Router} = require("express")
const { addFreelancer, getFreelancers, getFreelancerById, updateFreelancerById, deleteFreelancerById, loginFreelancer, logoutFreelancer, refreshFreelancer, freelancerActivate, getFreelancerByName } = require("../controllers/freelancer.controller")
const freelancerPolice = require("../middleware/freelancer_police")

const router = Router()

router.post("/", addFreelancer)
router.get('/', getFreelancers)
router.get("/activate/:link", freelancerActivate);
router.get("/name",getFreelancerByName)
router.get("/:id", freelancerPolice,getFreelancerById)
router.patch("/:id", freelancerPolice, updateFreelancerById)
router.delete("/:id", freelancerPolice, deleteFreelancerById)
router.post("/login", loginFreelancer)
router.post("/logout", logoutFreelancer)
router.post("/refresh", refreshFreelancer)

module.exports = router