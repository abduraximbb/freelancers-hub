const {Router} = require("express")
const { addClient, getClients, getClientByEmail, getClientById, updateClientById, deleteClientById, loginClient, logoutClient, refreshClient, activateClient, getClientByname } = require("../controllers/client.controller")

const clientPolice = require("../middleware/client_police")

const router = Router()

router.post("/", addClient)
router.get('/', getClients)
router.get("/activate/:link", activateClient);
router.get("/name",getClientByname)
router.get("/:id", clientPolice, getClientById)
router.patch("/:id", clientPolice,updateClientById)
router.delete("/:id", clientPolice,deleteClientById)
router.post("/login", loginClient)
router.post("/logout", logoutClient)
router.post("/refresh", refreshClient)

module.exports = router