const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Users = require('../models/userModel')
const axios = require('axios')

//Register
const registerUser = (req,res) =>{
    const user = req.body
    console.log(user)
    if(user.password !== user.confPassword){
        return res.status(400).json({error: 'Password Does not match confirm password'})
    }else{
    bcrypt.hash(user.password,10,async(err,hash) =>{
        user.password = hash
        try{
            const Register =  new Users({
                userName:user.userName,
                password:user.password,
                role:user.role
            })
            await Register.save()
            const payload = { username: user._id, role: user.role };
            const token = jwt.sign(payload, 'secretKey');
            res.status(200).json({token})
        }catch(error){
            res.status(400).json({error:error.message})
        }
    })
}
}

//Login
const login = async (req, res) => {
    const userData = req.body;
    const user = await Users.findOne({ userName: userData.userName });
  
    if (!user) {
      return res.status(401).send({ message: 'Invalid username or password' });
    }
  
    const result = await bcrypt.compare(userData.password, user.password);
    if (!result) {
      return res.status(401).send({ message: 'Invalid username or password' });
    }
  

    const payload = { username: user._id, role: user.role};
    const token = jwt.sign(payload, 'secretKey');
    res.status(200).send({ token });
   
  };
  
  const authenticateUser = (authorizedRoles) => {
    return (req, res, next) => {
      const authHeader = req.headers['authorization'];
      if (!authHeader) {
        return res.status(401).send({ message: 'Authorization header missing' });
      }
      const token = authHeader.split(' ')[1];
      if (!token) {
        return res.status(401).send({ message: 'Bearer token missing' });
      }
      jwt.verify(token, 'secretKey', (err, user) => {
        if (err) return res.sendStatus(403);
        if (authorizedRoles.includes(user.role)) {
          req.user = user;
          next();
        } else {
          res.sendStatus(403);
        }
      });
    };
  };
  
  

module.exports = {
    registerUser,
    login,
    authenticateUser
}