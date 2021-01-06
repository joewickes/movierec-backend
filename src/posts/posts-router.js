// Dependencies
const express = require('express');
const path = require('path');

// Use express methods for route and JSON parsing
const postsRouter = express.Router()
const jsonBodyParser = express.json()

// Posts service object
const PostsService = require('./posts-service')

postsRouter
  .route('/')
  .get((req, res, next) => {
    PostsService.getPosts(req.app.get('db'), 10, 0)
      .then(posts => {
        return res.json(posts);
      })
      .catch(next)
    ;
  })
  .post(jsonBodyParser, (req, res, next) => {

    if (req.body.where === 'homepage') {
      return PostsService.searchPostsByTitle(req.app.get('db'), req.body.title, 0, 10)
        .then(postRes => {
          res.json(postRes);
        })
    }

    // // Get data from request body
    // const {title, description, movie_id, votecount, user_id} = req.body;

    // // Put data in a new post object
    // const newPostObj = {title, description, movie_id, votecount, user_id};
    
    // // Validate necessary keys

    // // Insert post
    // PostsService.addPost(
    //   req.app.get('db'),
    //   newPostObj
    // )
    //   // When successful, update state to reflect added post
    //   .then(post => {
    //     res
    //       .status(201)
    //       .location(path.posix.join(req.originalUrl, `/${post.id}`))
    //       .json(post)
    //   })
    //   .catch(next);
  })

module.exports = postsRouter;