// Dependencies
const xss = require('xss'); // For sterilizing strings

const PostsService = {
  getPosts(database, limit, offset) { // Knex instance to the database
    return database 
      .from('posts') // Queries posts table
      .select('*') // Selects all posts
      .orderBy('date_created', 'desc') // Sorts by most recent date_created
      .limit(limit) // Limits the results to the first 10
      .offset(offset) // Offsets which set of results is seen 1-10, 11-20, etc.
    ;
  },
  addPost(database, newPostObj) {
    return database
      .insert(newPostObj) // Insert the new post object
      .into('posts') // into the posts table
      .returning('*') // returning the object
  }
  
}

module.exports = PostsService;