# MovieRec (API)

## Live Link: https://movierec-frontend.vercel.app/

## Front End Repo: https://github.com/joewickes/movierec-frontend

## Table of Contents
- [Summary](##-summary)
- [How To Use It](##-how-to-use-it)
- [Technologies Used](##-technologies-used)

## Summary
MovieRec is an app that lets you recommend movies to family, friends, or strangers! 

As a user you can:
- Search for movie titles by keyword
- Filter the top-rated movies for each genre
- Sign up for an account which lets you 
  - Log In
  - Upvote on already recommended movies
  - Downvote on already recommended movies
  - Take away your previous vote on already recommended movies
  - Add movie titles to our database (so that only one person can get the pride of recommending a movie for the first time)
  - Add movie recommendations yourself
  - Log out of your account


## How To Use It
Here are the different API endpoints, what kind of data they take, and what kind of end result to expect

Endpoint: /api/auth
- Request Type: POST
- Expected Data Type: Object with user info
- Happy Path Response: A 200 with JWT token and user ID

-----

Endpoint: /api/movies
- Request Type: GET
- Expected Data Type: Search in query parameters
- Happy Path Response: Array of 10 movies from the database containing the search word

Endpoint: /api/movies
- Request Type: POST
- Expected Data Type: Object with new movie info
- Happy Path Response: 201

Endpoint: /api/movies/:movie_id
- Request Type: GET
- Expected Data Type: ID in query parameters
- Happy Path Response: All data of the movie object with the matching ID

-----

Endpoint: /api/posts
- Request Type: POST
- Expected Data Type: Object with specified key 'where' denoting what returns and other necessary values
- Happy Path Response: Either
  - A list of 10 or less most recent posts
  - A list of 10 or less posts that match a search
  - A list of 10 or less posts that match a specified genre
  - A 201 if successfully created a post

Endpoint: /api/users/:post_id
- Request Type: GET
- Expected Data Type: ID in query parameter
- Happy Path Response: 200 with the object with the specified ID

-----

Endpoint: /api/users
- Request Type: POST
- Expected Data Type: Object with new user info
- Happy Path Response: 201

-----

Endpoint: /api/votes
- Request Type: POST
- Expected Data Type: Object with specified key 'type' denoting what returns and other necessary values
- Happy Path Response: Either
  - A 201 returning the created vote
  - A 200 returning the ID of the vote

Endpoint: /api/votes/:vote_id
- Request Type: GET
- Expected Data Type: ID in query parameters
- Happy Path Response: 200 and the whole vote object that matches

Endpoint: /api/votes/:vote_id
- Request Type: PATCH
- Expected Data Type: An object with new vote values
- Happy Path Response: 204

## Technologies Used
- Bcrypt JS
- Cors
- DotENV
- Express
- Helmet
- JWT
- Knex
- Postgrator
- XSS
- Tested with Mocha, Chai, and Supertest
- Used Nodemon for the dev environment
