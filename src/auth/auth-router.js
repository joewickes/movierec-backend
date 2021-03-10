// Dependencies
const express = require('express');

// Use express methods for route and JSON parsing
const authRouter = express.Router();
const jsonBodyParser = express.json();

// Auth service object
const AuthService = require('./auth-service');
 
authRouter
  .route('/')
  .post(jsonBodyParser, (req, res, next) => {

    // Parsed Username
    const parsedUN = Buffer
      .from(req.body.username, 'base64')
      .toString()
    ;

    // Parsed Password
    const parsedPwd = Buffer
      .from(req.body.password, 'base64')
      .toString()
    ;

    console.log('parsed both');

    AuthService.getUser(req.app.get('db'), parsedUN)
      .then(foundUser => {
        if (foundUser) {
          AuthService.comparePasswords(parsedPwd, foundUser.password)
            .then(comparedRes => {
              if (comparedRes) {
                console.log('compared the passwords')
                const createdToken = AuthService.createToken(foundUser.username, {user_id: foundUser.id});
                console.log('returning a 200');
                return res.status(200).json({createdToken: createdToken, userId: foundUser.id});
              }
            })
            
          ;
        }
      })
      .catch(next);
  })

module.exports = authRouter;