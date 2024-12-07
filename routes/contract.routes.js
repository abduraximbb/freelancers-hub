const {Router} = require("express")
const { addContract, getContracts, getContractById, updateContractById, deleteContractById } = require("../controllers/contract.controller")

const clientPolice = require("../middleware/client_police")

const router = Router()

router.post("/",clientPolice, addContract)
router.get('/', getContracts)
router.get("/:id", getContractById)
router.patch("/:id", clientPolice, updateContractById)
router.delete("/:id", clientPolice, deleteContractById)

module.exports = router