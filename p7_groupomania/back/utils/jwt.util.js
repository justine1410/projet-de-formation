const jwt = require("jsonwebtoken");
require('dotenv').config();
const JWT_SIGN_SECRET = process.env.token;


module.exports = {
  generateTokenForUser: (userData)=>{
    return jwt.sign({
      userId: userData.id,
      isAdmin: userData.isAdmin,
      username: userData.username,
      image: userData.imageUrl
    },
    JWT_SIGN_SECRET,
    {
      expiresIn: '24h'
    })
  },

 
  parseAuthorization :(authorization)=>{
      return (authorization != null) ? authorization.replace('Bearer ', '') : null;
  },

  getUserId: (authorization)=>{
    let userId=-1;
    let token = module.exports.parseAuthorization(authorization);

    if(token != null){
      try{
        let jwtToken= jwt.verify(token, JWT_SIGN_SECRET);
        if(jwtToken != null)
        userId = jwtToken.userId;
      }catch(err) {}
    }
    return userId
  },

  isAdmin:(authorization)=>{
    let isAdmin=0;
    let token = module.exports.parseAuthorization(authorization);

    if(token != null){
      try{
        let jwtToken= jwt.verify(token, JWT_SIGN_SECRET);
        if(jwtToken != null)
        isAdmin = jwtToken.isAdmin;
      }catch(err) {}
    }
    return isAdmin

  } 
} 
