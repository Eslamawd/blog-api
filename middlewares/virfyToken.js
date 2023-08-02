const jwt = require("jsonwebtoken")


function verifyToken(req, res, next) {
    const authToken = req.headers.authorization;
    if (authToken) {
        const token = authToken.split(" ")[1]
        try {
            const decodedPayload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = decodedPayload;
            next();
        } catch (error) { 
            return res.status(401).json({  message: "invalid Token, not " })
        }


    } else {
        res.status(401).json({ message: "invalid Token, not acccess"})
    }
}


function virfyTokenAndAdmin(req, res, next) {
    verifyToken(req, res, () => {
        if(req.user.isAdmin) {
            next();
        } else {
            
            return res.status(401).json({  message: "invalid Token, not acccess , access is admin" });
        }

    })
}


function virfyTokenAndOnlyUser(req, res, next) {
    verifyToken(req, res, () => {
        if(req.user.id === req.params.id) {
            next();
        } else {
            
            return res.status(401).json({  message: " not acccess user" });
        }

    })
}


function virfyTokenAndAthorization(req, res, next) {
    verifyToken(req, res, () => {
        if(req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            
            return res.status(401).json({  message: " not access" });
        }

    })
}


module.exports = {
    verifyToken,
    virfyTokenAndAdmin,
    virfyTokenAndOnlyUser,
    virfyTokenAndAthorization
}