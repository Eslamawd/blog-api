const asyncHandler = require("express-async-handler")
const { User } = require("../models/User")
const { Chat } = require("../models/Chat")



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
 module.exports.getOnlineFrinds = async(id) => {
    try {
        
        let user = await User.findById(id).populate("frind", ["username", "profilePhoto"])
        const frind = user.frind
        return frind;
        
    } catch (error) {
        throw new Error(error)
        
    }
 }
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

        const userId = req.params.id
    
        let user = await User.findById(req.user.id).lean()
        if (!user) {
            return res.status(404).json({ message: "user not found"})
        }

        let newChat = new Chat({
            userInChat: [req.user.id, req.params.id]
        })
        
        const chat = await newChat.save()
    
        const isUserFrind = user.requestFrinds.find((user) => user.toString() === userId)
    
        if (isUserFrind) {
            user = await User.findByIdAndUpdate(req.user.id, {
                $pull: {
                    requestFrinds: req.params.id,
                },
                $push: {
                    frinds: req.params.id,
                    chats: chat._id
                }
                
            }, {
                new: true
            })

            user = await User.findByIdAndUpdate(req.params.id, {
                $push: {
                    frinds: req.user.id,
                    chats: chat._id
                },
                $pull: {
                    sendRequist: req.user.id,
                }
            },{
                new: true
            }).select('-password')


           res.status(200).json(user)
        } else {
            return res.status(404).json({message: "not access"})
        }
   
 })



  /**-------------------------------------------------
 * @desc delete frind from rquists
 * @router /api/users/frinds/:id
 * @method DELETE
 * @access private (only user)
 ------------------------------------------------*/

 module.exports.deleteRequist = asyncHandler(async (req, res) => {
    
        const  userId  = req.params.id
    
        let user = await User.findById(req.user.id).lean()
        if (!user) {
            return res.status(404).json({ message: "user not found"})
        }
    
        const isUserFrind = user.requestFrinds.find((userI) => userI.toString() === userId)
        const isUserRequist = user.sendRequist.find((userI) => userI.toString() === userId)
        const isUserFrindly = user.frinds.find((userI) => userI.toString() === userId)

    
        if (isUserFrind) {

          user = await User.findByIdAndUpdate(req.user.id, {
                $pull: {
                    requestFrinds: req.params.id,
                },
            }, {
                new: true
            })

            user = await User.findByIdAndUpdate(req.params.id, {
                $pull: {
                    sendRequist: req.user.id,
                }
            },{
                new: true
            }).select('-password')
            
             res.status(200).json(user)

        } else if(isUserRequist) {

            user = await User.findByIdAndUpdate(req.user.id, {
                $pull: {
                    sendRequist: req.params.id,
                },
            }, {
                new: true
            })

            user = await User.findByIdAndUpdate(req.params.id, {
                $pull: {
                    requestFrinds: req.user.id,
                }
            },{
                new: true
            }).select('-password')
         
         res.status(200).json(user)

        } else if(isUserFrindly) {

             user = await User.findByIdAndUpdate(req.user.id, {
                $pull: {
                    frinds: req.params.id,
                },
            }, {
                new: true
            })

            user = await User.findByIdAndUpdate(req.params.id, {
                $pull: {
                    frinds: req.user.id,
                }
            },{
                new: true
            }).select('-password')
            
          res.status(200).json(user)
        } else {
        res.status(403).json({message: "not access"})
        }
   

 })