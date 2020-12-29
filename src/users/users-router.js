// Dependencies
const express = require('express');
const path = require('path');

// Use express methods for route and JSON parsing
const usersRouter = express.Router()
const jsonBodyParser = express.json()

// Users service object
const UsersService = require('./users-service')

usersRouter
  .route('/')
  // .get((req, res, next) => {
  //   UsersService.getUsers(req.app.get('db'), 10, 0)
  //     .then(users => {
  //       return res.json(users);
  //     })
  //     .catch(next)
  //   ;
  // })
  .post(jsonBodyParser, (req, res, next) => {

    console.log(req.body);

    // Parse Username
    const parsedUN = Buffer
    .from(req.body.username, 'base64')
    .toString()

    // Parse Email
    const parseEmail = Buffer
    .from(req.body.email, 'base64')
    .toString()

    // Make sure username doesn't exist in DB
    UsersService.findUser(req.app.get('db'), parsedUN)
      .then(foundUser => {
        if (foundUser) {
          console.log('Username already taken');
          return res.status(400).json({ error: 'Username already taken' });
        } else {
          const pwd = req.body.password;
          const newData = {
            username: parsedUN,
            email: parseEmail,
            password: pwd,
          }
          // POST USER USERNAME AND PASSWORD AND DATE CREATED
          UsersService.addUser(req.app.get('db'), newData)
            .then((result) => {
              console.log('Added USER', result);
              return res.status(201).end();
            })
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