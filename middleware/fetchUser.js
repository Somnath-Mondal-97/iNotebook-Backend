const jwt = require('jsonwebtoken');
const JWT_KEY = "9e39d7ae32e305d13d8fcdf3b23ff378ad9eeb057c5b26f2a525dfb102e52b9f"

const fetchUser = (req,res,next) => {
    const token = req.header('auth-token')
    if(!token){
        res.status(401).send({error:"Please authenticate using a valid token"})
    }
    try {
        const data = jwt.verify(token,JWT_KEY)
        req.user = data.user;
        next()
    } catch (error) {
        res.status(401).send({error:"Please authenticate using a valid token"})
    }
}

module.exports =  fetchUser