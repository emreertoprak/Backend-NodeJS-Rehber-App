const jwt = require('jsonwebtoken');
require('dotenv/config');

function getUserIdFromToken(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return send.status(401)

    jwt.verify(token,process.env.secret,(err,user) => {
        if(err) return send.status(403)
        req.userId = user.userId
        next()
    })
}


module.exports = getUserIdFromToken;