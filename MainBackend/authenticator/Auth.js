const axios = require('axios');
 function authenticateUser  (authorizedRoles) {
    return async (req, res, next) => {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      console.log("Auth token :-",token)
      if (token == null) return res.sendStatus(401);

      try {
        const response = await axios.post('localhost:3000/api/user/login', { token, authorizedRoles });
        console.log("response ",response)
        if (response.data.authorized) {
          req.user = response.data.user;

          next();
        } else {
          res.sendStatus(403);
        }
      } catch (err) {
        res.sendStatus(403);
      }
    };
  }


  module.exports = {
    authenticateUser
}