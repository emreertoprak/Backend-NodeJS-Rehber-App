const {expressjwt: jwt}  = require('express-jwt');

function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL;
    
    return jwt({
        secret,
        algorithms: ['HS256'],
        
    }).unless({
        path: [
            `${api}/addUser`,
            `${api}/loginUser`
        ]
    })
}

module.exports = authJwt;