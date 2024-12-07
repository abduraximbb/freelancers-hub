const {Router} = require("express")
const { addAdmin, getAdmins, getAdminByUsername, getAdminById, updateAdminById, deleteAdminById, loginAdmin, logoutAdmin, refreshAdmin, updateAdnminByCreator, updateSelfAdmin } = require("../controllers/admin.controller")
const adminPolice = require("../middleware/admin_police")
const adminCreatorPolice = require("../middleware/admin_creator_police")

const router = Router()

router.post("/", adminCreatorPolice,addAdmin)
router.get('/', adminCreatorPolice,getAdmins)
router.get("/username", adminPolice,getAdminByUsername)
router.get("/:id", adminPolice,getAdminById)
router.patch("/:id", adminCreatorPolice,updateAdnminByCreator)
router.patch("/self/:id", adminPolice, updateSelfAdmin)
router.delete("/:id", adminCreatorPolice,deleteAdminById)
router.post("/login", loginAdmin)
router.post("/logout", logoutAdmin)
router.post("/refresh", refreshAdmin)

module.exports = router