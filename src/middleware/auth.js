const jwt = require('jsonwebtoken');


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Authentication>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) {
            return res.status(400).send({ status: false, message: "token is required" });
        }
        jwt.verify(token, "backenedTask", (error, decodedToken) => {
            if (error) {
                return res.status(401).send({ status: false, message: "token is invalid" });
            }
        //-------set the token in request object so that i can access this token outside the middleware-----//
            req.decodedToken = decodedToken.userId;
            console.log(decodedToken);
            next();
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



//...................................................................................................................//
module.exports={authentication}; 