// Dependencies
const express = require('express');
const path = require('path');

// Use express methods for route and JSON parsing
const votesRouter = express.Router();
const jsonBodyParser = express.json();

// Votes service object
const VotesService = require('./votes-service');

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
    const { value, post_id, userid } = req.body.voteData;

    // Put data in a new vote object
    const voteObj = {value, post_id, userid};
    
    if (req.body.type === 'addNewVote') {
      // Insert vote
      VotesService.addVote(req.app.get('db'), voteObj)

      // When successful, update state to reflect added vote
      .then(vote => {

        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${vote.id}`))
          .json(vote)
      })
      .catch(next);
    } else if (req.body.type === 'getVoteId') {
      VotesService.findVoteId(req.app.get('db'), userid, post_id)
        .then(returned => {
          return res
            .status(200)
            .location(path.posix.join(req.originalUrl, `/${returned.id}`))
            .json(returned[0].id)
        })
        .catch(next)
    }
  })

  votesRouter
    .route('/:vote_id')
    .get((req, res, next) => {
      VotesService.getVote(req.app.get('db'), req.params.vote_id)
        .then(response => {
          res.json(response[0]);
        })
    })
    .patch(jsonBodyParser, (req, res, next) => {
      VotesService.updateVote(req.app.get('db'), req.params.vote_id, req.body)
        .then(() => {
          res.status(204).end();
        })
    })

module.exports = votesRouter;