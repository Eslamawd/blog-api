const router = require("express").Router()
const { createCategoryCtrl, getAllCategoryCtrl, deleteCategoryCtrl } = require("../controllers/categorycontroller")
const { virfyTokenAndAdmin } = require("../middlewares/virfyToken")
const validateOpject = require("../middlewares/validateOpjectId")

// /api/categories \\
router.route("/")
    .post(virfyTokenAndAdmin, createCategoryCtrl)
    .get(getAllCategoryCtrl)


router.route("/:id").delete(validateOpject, virfyTokenAndAdmin, deleteCategoryCtrl)



module.exports = router