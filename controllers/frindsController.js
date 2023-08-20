const asyncHandler = require("express-async-handler")
const mongoose = require('mongoose')
const { User } = require("../models/User")



/**-------------------------------------------------
 * @desc Get all users
 * @router /api/users/requist
 * @method GET
 * @access private (only user)
 ------------------------------------------------*/
 module.exports.getAllUsersRequests = asyncHandler(async (req, res) => {
    try {
        const loggedInUser = req.user.id

        let user = await User.findById(loggedInUser).populate("requist", ["username", "profilePhoto"])

        const users = user.requist
    
        if (!user) {
            
            return res.status(404).json({ message: "user not found"})
        }
        
        res.status(200).json(users)
        
    } catch (error) {
        res.status(404).json({message: "not found"})
        
    }
})



/**-------------------------------------------------
 * @desc add new requist   
 * @router /api/users/requist/:id
 * @method PUT
 * @access private ( only user loged in) 
 ------------------------------------------------*/

 module.exports.addNewRequest = asyncHandler(async (req, res) => {

    const loggedInUser = req.user.id
    const { id: userId } = req.params

    let user = await User.findById(userId)
    if (!user) {
        return res.status(404).json({ message: "user not found"})
    }

    const isUserFrind = user.requestFrinds.find((userI) => userI.toString() === loggedInUser)

    if (!isUserFrind) {
        user.updateOne({
            $push: {
                sendRequist: userId,
            }
        }, {
            new: true
        })
        user = await User.findByIdAndUpdate(userId, {
            $push: {
                requestFrinds: loggedInUser,
            }
        }, {
            new: true
        })
    }
    res.status(200).json({ message: "Add Request New" });
 })


 /**-------------------------------------------------
 * @desc Get all users
 * @router /api/users/frinds
 * @method GET
 * @access private (only user)
 ------------------------------------------------*/
 module.exports.getAllUsersFrends = asyncHandler(async (req, res) => {
    try {
        const loggedInUser = req.user.id
        
        let user = await User.findById(loggedInUser).populate("frind", ["username", "profilePhoto"])

        const users = user.frind
    
        if (!user) {
            
            return res.status(404).json({ message: "user not found"})
        }
        
        res.status(200).json(users)
        
    } catch (error) {
        res.status(404).json({message: "not found"})
        
    }
})



 /**-------------------------------------------------
 * @desc add new frind from rquists
 * @router /api/users/frinds/:id
 * @method put
 * @access private (only user)
 ------------------------------------------------*/

 module.exports.addNewFrind = asyncHandler(async (req, res) => {

    try {
        const loggedInUser = req.user.id
        const { id: userId } = req.params
    
        let user = await User.findById(loggedInUser)
        if (!user) {
            return res.status(404).json({ message: "user not found"})
        }
    
        const isUserFrind = user.requestFrinds.find((user) => user.toString() === userId)
    
        if (isUserFrind) {
            user.updateOne({
                $pull: {
                    requestFrinds: userId,
                },
                $push: {
                    frinds: userId,
                }
            }, {
                new: true
            })

            user = await User.findByIdAndUpdate(userId, {
                $push: {
                    frinds: loggedInUser,
                },
                $pull: {
                    sendRequist: loggedInUser,
                }
            },{
                new: true
            })
        } else {
            return res.status(404).json({message: "not access"})
        }
        res.status(200).json({ message: "Add Request New" });
    } catch (error) {
        console.log(error)
    }

 })



  /**-------------------------------------------------
 * @desc add new frind from rquists
 * @router /api/users/frinds/:id
 * @method DELETE
 * @access private (only user)
 ------------------------------------------------*/

 module.exports.deleteRequist = asyncHandler(async (req, res) => {

    try {
        const loggedInUser = req.user.id
        const { id: userId } = req.params
    
        let user = await User.findById(loggedInUser)
        if (!user) {
            return res.status(404).json({ message: "user not found"})
        }
    
        const isUserFrind = user.requestFrinds.find((user) => user.toString() === userId)
    
        if (isUserFrind) {
            user.updateOne({
                $pull: {
                    requestFrinds: userId,
                },
            }, {
                new: true
            })

            user = await User.findByIdAndUpdate(userId, {
                $pull: {
                    sendRequist: loggedInUser,
                }
            },{
                new: true
            })
        } else {
            return res.status(404).json({message: "not access"})
        }
        res.status(200).json({ message: "Deleted Requist" });
    } catch (error) {
        console.log(error)
    }

 })