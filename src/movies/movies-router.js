// Dependencies
const express = require('express');
const path = require('path');

// Use express methods for route and JSON parsing
const moviesRouter = express.Router()
const jsonBodyParser = express.json()

// Movies service object
const MoviesService = require('./movies-service')

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
    const {original_title, year, genre} = req.body;

    // Put data in a new movie object
    const newMovieObj = {original_title, year, genre};
    
    // Validate necessary keys

    // Insert movie
    MoviesService.addMovie(
      req.app.get('db'),
      newMovieObj
    )
      // When successful, update state to reflect added movie
      .then(movie => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${movie.id}`))
          .json(movie)
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