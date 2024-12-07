const {Router} = require("express")

const adminRouter = require("./admin.routes")
const skillRouter = require("./skill.routes")
const freelancerRouter = require("./freelancer.routes")
const freelancer_skillRouter = require("./freelancer_skill.routes")
const clientRouter = require("./client.routes")
const portfolioRouter = require("./portfolio.routes")
const projectRouter = require("./project.routes")
const contractRouter = require("./contract.routes")
const paymentRouter = require("./payment.routes")

const router = Router()

router.use("/admin", adminRouter)
router.use("/skill", skillRouter)
router.use("/freelancer", freelancerRouter)
router.use("/freelancerskill", freelancer_skillRouter)
router.use("/client", clientRouter)
router.use("/portfolio", portfolioRouter)
router.use("/project", projectRouter)
router.use("/contract", contractRouter)
router.use("/payment", paymentRouter)

module.exports = router