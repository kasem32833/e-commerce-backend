const jwt = require('jsonwebtoken');

const jwtTokenGenerator = (payload, jwtSecret, expire ) =>{
    
    const token = jwt.sign(payload, jwtSecret, expire);
    return token;
}

module.exports ={jwtTokenGenerator}