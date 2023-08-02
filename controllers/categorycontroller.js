const asyncHandler = require("express-async-handler")
const { Category, validateCreateCategory } = require("../models/Category")







/**-------------------------------------------------
 * @desc Create New categorie
 * @router /api/categories
 * @method POST
 * @access private (only Admin)
 ------------------------------------------------*/

 module.exports.createCategoryCtrl = asyncHandler(async(req, res) => {
    const { error } = validateCreateCategory(req.body)
    if (error) {
        return res.status(400).json({message: error.details[0].message })
    }

    const category = await Category.create({
        title: req.body.title,
        user: req.user.id
    })
    res.status(200).json(category)
 })




/**-------------------------------------------------
 * @desc get all categorie
 * @router /api/categories
 * @method GET
 * @access public ()
 ------------------------------------------------*/

 module.exports.getAllCategoryCtrl = asyncHandler(async(req, res) => {
    const categories = await Category.find()
    res.status(200).json(categories)
 })



/**-------------------------------------------------
 * @desc delet category
 * @router /api/categories
 * @method DELETE
 * @access private (only admen)
 ------------------------------------------------*/

 module.exports.deleteCategoryCtrl = asyncHandler(async(req, res) => {
    const category = await Category.findById(req.params.id)
    if(!category) {
        return res.status(404).json({message: "category not found"})
    }
    await Category.findByIdAndDelete(req.params.id)
    res.status(200).json({
         message: " categore has been deletes sucsess", 
         categoryId: category._id
       })
 })