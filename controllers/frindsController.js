const asyncHandler = require("express-async-handler")
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

        const  userId  = req.params.id;
    
        let user = await User.findById(req.user.id).lean();
        let reqUser = await User.findById(req.params.id).lean();

        if (!user && !reqUser) {
            return res.status(404).json({ message: "user not found" })
        }
    
        const isUserFrind = user.requestFrinds.find((userI) => userI.toString() === userId)
        const isUserRequist = user.sendRequist.find((userI) => userI.toString() === userId)
        const isUserMfrends = user.frinds.find((userI) => userI.toString() === userId)
    
        if (!isUserFrind && !isUserRequist  && !isUserMfrends) {

            user = await User.findByIdAndUpdate(req.user.id, {
                $push: {
                    sendRequist: req.params.id,
                }
            }, {
                new: true
            })

            user = await User.findByIdAndUpdate(req.params.id, {
                $push: {
                    requestFrinds: req.user.id,
                }
            }, {
                new: true
            }).select("-password")
            
        res.status(200).json(user)
        } else {
            res.status(403).json({ message: "not access your requist frinds" })
        }
        console.log(req)
        console.log(user)
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
            }).select('-password')

            return res.status(200).json(addReqToFrind)
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
            }).select(password)
            
            return res.status(200).json(deleteSenReq)

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
            }).select('-password')
         
            return res.status(200).json(deleteSenReq)

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
            }).select('-password')
            
            return res.status(200).json(deleteYfrind)
        } else {
            return res.status(404).json({message: "not access"})
        }
    } catch (error) {
        throw new Error(error)
  
    }

 })