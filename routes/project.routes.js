const {Router} = require("express")
const { addProject, getProjects, getProjectById, updateProjectById, deleteProjectById, getProjectByName } = require("../controllers/project.controller")
const clientPolice = require("../middleware/client_police")

const router = Router()

router.post("/", clientPolice, addProject)
router.get('/', getProjects)
router.get("/name/:name", getProjectByName)
router.get("/:id", getProjectById)
router.patch("/:id", clientPolice, updateProjectById)
router.delete("/:id", clientPolice, deleteProjectById)

module.exports = router