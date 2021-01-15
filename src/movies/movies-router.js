// Dependencies
const express = require('express');
const path = require('path');

// Use express methods for route and JSON parsing
const moviesRouter = express.Router()
const jsonBodyParser = express.json()

// Service objects
const MoviesService = require('./movies-service')
const PostsService = require('../posts/posts-service');
const VotesService = require('../votes/votes-service');

moviesRouter
  .route('/')
  .get((req, res, next) => {
    MoviesService.getMovies(req.app.get('db'), req.query.search, 10, 0)
      .then(movies => {
        return res.json(movies);
      })
      .catch(next)
    ;
  })
  .post(jsonBodyParser, (req, res, next) => {
    // Get data from request body
    const {original_title, year, genre} = req.body.newMovieObj;

    // Put data in a new movie object
    const newMovieObj = {original_title, year, genre};
    console.log('new movie obj', newMovieObj);
    
    // Validate necessary keys

    // Insert movie
    MoviesService.addMovie(
      req.app.get('db'),
      newMovieObj
    )
      // When successful, update state to reflect added movie
      .then(id => {
        if (req.body.yn === 'Yes') {

          const newPostObj = {
            title: newMovieObj.original_title,
            movie_id: id[0],
            user_id: req.body.user_id,
          }

          return PostsService.addPost(req.app.get('db'), newPostObj)
                  .then(response => {
                    console.log('add the post successfully', response)
                    const voteObj = {
                      userid: req.body.user_id,
                      value: 1,
                      post_id: response[0],
                    }
                    
                    VotesService.addVote(req.app.get('db'), voteObj)
                      .then(() => {
                        res.status(201)
                        .location(path.posix.join(req.originalUrl, `/${id}`))
                        .end();
                      })
                  })
        } else {
          res
            .status(201).end()
        }
        
      })
      .catch(next);
  })

  moviesRouter
    .route('/:movie_id')
    .get((req, res, next) => {
      MoviesService.getSingleMovie(req.app.get('db'), req.params.movie_id)
        .then(response => {
          console.log('movie id single response', response)
          res.json(response[0]);
        })
    })

module.exports = moviesRouter;