// Dependencies
const express = require('express');
const path = require('path');
require('dotenv').config();

// Use express methods for route and JSON parsing
const postsRouter = express.Router()
const jsonBodyParser = express.json()

// Posts service object
const PostsService = require('./posts-service')

postsRouter
  .route('/')
  .post(jsonBodyParser, (req, res, next) => {
    if (req.body.where === 'homePageGet') {

      PostsService.getPosts(req.app.get('db'), req.body.userId, 10, parseInt(req.body.offset))
        .then(posts => {
          console.log('returned something from postsservice get posts', posts)
          return res.send(posts.rows);
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

  postsRouter
    .route('/:post_id')
    .get((req, res, next) => {
      console.log(`grabbing that post at ${typeof req.params.post_id} ${req.params.post_id} now`)
      PostsService.getSinglePost(req.app.get('db'), req.params.post_id)
        .then(response => {
          if (response.length === 0) {
            console.log('no matching posts');
            res.status(404).json({message: 'No matching posts'})
          }
        })
        .catch(next)
      ;
    })

module.exports = postsRouter;