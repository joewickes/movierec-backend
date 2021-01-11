// Dependencies
const { EROFS } = require('constants');
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
    return res.send("YEAAAAH");
  })
  .post(jsonBodyParser, (req, res, next) => {
    throw new Error('Posts ERRRRRRROR');
    if (req.body.where === 'homePageGet') {
      PostsService.getPosts(req.app.get('db'), req.body.userId, 10, parseInt(req.body.offset))
        .then(posts => {
          return res.json(posts.rows);
        })
        .catch(next)
      ;
    }

    if (req.body.where === 'homePageSearch') {
      if (!req.body.title) {
        return res.status(400).json({error: 'Invalid title search'});
      }

      return PostsService.searchPostsByTitle(req.app.get('db'), req.body.title, 10, 0)
        .then(postRes => {
          if (postRes.length === 0) {
            return res.status(404).json({error: 'No posts found with that title.'})
          } else {
            res.json(postRes);
          }
        })
        .catch(next)
      ;
    }

    if (req.body.where === 'homePageFilter') {
      return PostsService.searchPostsByGenre(req.app.get('db'), req.body.genre, 10, 0)
        .then(postRes => {
          res.json(postRes);
        })
        .catch(next)
      ;
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