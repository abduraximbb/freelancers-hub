const {Router} = require("express")
const { addPortfolio, getPortfolios, getPortfolioById, updatePortfolioById, deletePortfolioById } = require("../controllers/portfolio.controller")
const freelancerPolice = require("../middleware/freelancer_police")

const router = Router()

router.post("/", freelancerPolice, addPortfolio)
router.get('/', getPortfolios)
router.get("/:id", getPortfolioById)
router.patch("/:id", freelancerPolice, updatePortfolioById)
router.delete("/:id", freelancerPolice, deletePortfolioById)

module.exports = router