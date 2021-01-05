// Dependencies
const express = require('express');
const bcrypt = require('bcryptjs');
const path = require('path');

// Use express methods for route and JSON parsing
const usersRouter = express.Router()
const jsonBodyParser = express.json()

// Users service object
const UsersService = require('./users-service');
// const { parse } = require('dotenv/types');

usersRouter
  .route('/')
  .post(jsonBodyParser, (req, res, next) => {

    console.log(req.body);

    // Parse Username
    const parsedUN = Buffer
      .from(req.body.username, 'base64')
      .toString()
    ;

    // Parse Email
    const parsedEmail = Buffer
      .from(req.body.email, 'base64')
      .toString()
    ;

    // Parse Password
    const parsedPwd = Buffer
      .from(req.body.password, 'base64')
      .toString()
    ;

    // Make sure username doesn't exist in DB
    UsersService.findUser(req.app.get('db'), parsedUN)
      .then(foundUser => {
        if (foundUser) {
          console.log('Username already taken');
          return res.status(400).json({ error: 'Username already taken' });
        } else {

          const r = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&])[\S]+/;

          if (parsedPwd.length < 8) {
            return res.status(400).json({error: 'Password must be at least 8 characters'});
          } else if (parsedPwd.length > 72) {
            return res.status(400).json({error: 'Password must be less than 72 characters'}); 
          } else if (parsedPwd.startsWith(' ') || parsedPwd.endsWith(' ')) {
            return res.status(400).json({error: 'Password must not start or end with empty spaces'}); 
          } else if (!r.test(parsedPwd)) {
            return res.status(400).json({error: 'Password must have at least one upper case, lower case, number and special character'}); 
          }

          bcrypt.hash(parsedPwd, 12)
            .then(epass => {
              const newData = {
                username: parsedUN,
                email: parsedEmail,
                password: epass,
              }

              // POST USER USERNAME AND PASSWORD AND DATE CREATED
              UsersService.addUser(req.app.get('db'), newData)
              .then((result) => {
                console.log('Added USER', result);
                return res.status(201).end();
              })
            })
          ;
        }
      })

    // // Get data from request body
    // const {username, email, password} = req.body;

    // // Put data in a new vote object
    // const newUsersObj = {title, description, movie_id, votecount, user_id};
    
    // // Validate necessary keys

    // // Insert vote
    // VotesService.addVote(
    //   req.app.get('db'),
    //   newVotesObj
    // )
    //   // When successful, update state to reflect added vote
    //   .then(vote => {
    //     res
    //       .status(201)
    //       .location(path.posix.join(req.originalUrl, `/${vote.id}`))
    //       .json(vote)
      // })
      .catch(next);
  })

module.exports = usersRouter;