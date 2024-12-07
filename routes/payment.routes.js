const {Router} = require("express")
const { addPayment, getPayments, getPaymentById, updatePaymentById, deletePaymentById } = require("../controllers/payment.controller")

const clientPolice = require("../middleware/client_police")
const { cli } = require("winston/lib/winston/config")

const router = Router()

router.post("/", clientPolice, addPayment)
router.get('/', getPayments)
router.get("/:id", getPaymentById)
router.patch("/:id", clientPolice, updatePaymentById)
router.delete("/:id",clientPolice, deletePaymentById)

module.exports = router