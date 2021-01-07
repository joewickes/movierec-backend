// Dependencies
const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');

// Use express methods for route and JSON parsing
const authRouter = express.Router();
const jsonBodyParser = express.json();

// Auth service object
const AuthService = require('./auth-service');

authRouter
  .route('/')
  .post(jsonBodyParser, (req, res, next) => {

    console.log(req.body);

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

    console.log('creds on creds', parsedUN, parsedPwd);

    // Make sure username exists in DB FIX THIS
    AuthService.getUser(req.app.get('db'), parsedUN)
      .then(foundUser => {
        if (foundUser) {
          console.log('Found User =>', foundUser);
              AuthService.comparePasswords(parsedPwd, foundUser.password)
                .then(comparedRes => {
                  if (comparedRes) {
                    const createdToken = AuthService.createToken(foundUser.username, {user_id: foundUser.id});
                    console.log(createdToken);
                    return res.status(200).json({createdToken: createdToken, userId: foundUser.id});
                  }
                  
                });
          

          // return res.status(200).json();
        } 
        // else {
        //   const pwd = req.body.password;
        //   const newData = {
        //     username: parsedUN,
        //     password: pwd,
        //   }
        // }
      })
      .catch(next);
  })

module.exports = authRouter;