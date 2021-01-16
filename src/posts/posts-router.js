// Dependencies
const express = require('express');
const path = require('path');
require('dotenv').config();

// Use express methods for route and JSON parsing
const postsRouter = express.Router()
const jsonBodyParser = express.json()

// Posts service object
const PostsService = require('./posts-service')
const VotesService = require('./../votes/votes-service');

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

    if (req.body.where === 'addNewPost') {
      console.log('new Post Obj', req.body.newPostObj)
      return PostsService.addPost(req.app.get('db'), req.body.newPostObj)
        .then(response => {
          console.log('add the post successfully', response)
          const voteObj = {
            userid: req.body.newPostObj.user_id,
            value: 1,
            post_id: response[0],
          }
          
          VotesService.addVote(req.app.get('db'), voteObj)
            .then(() => {
              res.status(201).end();
            })
          
        })
        .catch(next)
      ;
    }
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