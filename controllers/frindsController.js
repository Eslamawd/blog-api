const asyncHandler = require("express-async-handler")
const mongoose = require('mongoose')
const { User } = require("../models/User")



/**-------------------------------------------------
 * @desc Get all users requist frinds
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
        throw new Error(error)
        
    }
})



/**-------------------------------------------------
 * @desc add new requist   
 * @router /api/users/requist/:id
 * @method PUT
 * @access private ( only user loged in) 
 ------------------------------------------------*/

 module.exports.addNewRequest = asyncHandler(async (req, res) => {

    try {
        const loggedInUser = req.user.id
        const { id: userId } = req.params
    
        const user = await User.findById(loggedInUser)
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }
    
        const isUserFrind = user.requestFrinds.find((userI) => userI.toString() === userId)
        const isUserRequist = user.sendRequist.find((userI) => userI.toString() === userId)
        const isUserMfrends = user.frinds.find((userI) => userI.toString() === userId)
    
        if (!isUserFrind || !isUserRequist  || !isUserMfrends) {
            const newUserAdd = await User.findByIdAndUpdate(loggedInUser, {
                $push: {
                    sendRequist: userId,
                }
            }, {
                new: true
            })
            const newRequistUser = await User.findByIdAndUpdate(userId, {
                $push: {
                    requestFrinds: loggedInUser,
                }
            }, {
                new: true
            })
            const newReq = newRequistUser.requestFrinds
    
            return res.status(200).json(newReq)
        } else {
           return res.status(400).json({ message: "Add Request New" });
        }
        
    } catch (error) {
        throw new Error(error)
        
    }
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
        throw new Error(error)
        
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
            const addNewFrind = await User.findByIdAndUpdate(loggedInUser, {
                $pull: {
                    requestFrinds: userId,
                },
                $push: {
                    frinds: userId,
                }
            }, {
                new: true
            })

            const addReqToFrind = await User.findByIdAndUpdate(userId, {
                $push: {
                    frinds: loggedInUser,
                },
                $pull: {
                    sendRequist: loggedInUser,
                }
            },{
                new: true
            })

            const frinds = addNewFrind.frinds

            return res.status(200).json(frinds)
        } else {
            return res.status(404).json({message: "not access"})
        }
    } catch (error) {
        throw new Error(error)
    }

 })



  /**-------------------------------------------------
 * @desc delete frind from rquists
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
        const isUserRequist = user.sendRequist.find((user) => user.toString() === userId)
        const isUserFrindly = user.frinds.find((user) => user.toString() === userId)

    
        if (isUserFrind) {
          const deleteReq = await User.findByIdAndUpdate(loggedInUser, {
                $pull: {
                    requestFrinds: userId,
                },
            }, {
                new: true
            })

            const deleteSenReq = await User.findByIdAndUpdate(userId, {
                $pull: {
                    sendRequist: loggedInUser,
                }
            },{
                new: true
            })
            const requist = deleteReq.requestFrinds
            return res.status(200).json(requist)

        } else if(isUserRequist) {
            const deleteReq = await User.findByIdAndUpdate(loggedInUser, {
                $pull: {
                    sendRequist: userId,
                },
            }, {
                new: true
            })

            const deleteSenReq = await User.findByIdAndUpdate(userId, {
                $pull: {
                    requestFrinds: loggedInUser,
                }
            },{
                new: true
            })
            const requist = deleteReq.sendRequist
            return res.status(200).json(requist)

        } else if(isUserFrindly) {
            const deleteFrind = await User.findByIdAndUpdate(loggedInUser, {
                $pull: {
                    frinds: userId,
                },
            }, {
                new: true
            })

            const deleteYfrind = await User.findByIdAndUpdate(userId, {
                $pull: {
                    frinds: loggedInUser,
                }
            },{
                new: true
            })
            const requist = deleteFrind.frinds
            return res.status(200).json(requist)
        } else {
            return res.status(404).json({message: "not access"})
        }
    } catch (error) {
        throw new Error(error)
  
    }

 })