// Dependencies
const express = require('express');
const path = require('path');

// Use express methods for route and JSON parsing
const votesRouter = express.Router()
const jsonBodyParser = express.json()

// Votes service object
const VotesService = require('./votes-service')

votesRouter
  .route('/')
  .get((req, res, next) => {
    VotesService.getVotes(req.app.get('db'), 10, 0)
      .then(votes => {
        return res.json(votes);
      })
      .catch(next)
    ;
  })
  .post(jsonBodyParser, (req, res, next) => {
    
    // Get data from request body
    const {username, email, password} = req.body;

    // Put data in a new vote object
    const newVotesObj = {title, description, movie_id, votecount, user_id};
    
    // Validate necessary keys

    // Insert vote
    VotesService.addVote(
      req.app.get('db'),
      newVotesObj
    )
      // When successful, update state to reflect added vote
      .then(vote => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${vote.id}`))
          .json(vote)
      })
      .catch(next);
  })

module.exports = votesRouter;