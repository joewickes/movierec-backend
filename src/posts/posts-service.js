const PostsService = {
  // getPosts(database, limit, offset) { // Knex instance to the database
  //   return database 
  //     .from('posts') // Queries posts table
  //     .select('*') // Selects all posts
      
  //   ;
  // },
  getPosts(database, limit, offset) { // Knex instnce to the database
    return database
      .select('posts.id', 'movies.original_title as title', 'users.username')
      .sum({votes: 'votes.value'})
      .groupBy('posts.id', 'movies.original_title', 'users.username')
      .from('posts')
      .innerJoin('users', 'posts.user_id', 'users.id')
      .innerJoin('movies', 'posts.movie_id', 'movies.id')
      .innerJoin('votes', 'posts.id', 'votes.post_id')
      .orderBy('posts.date_created', 'desc') // Sorts by most recent date_created
      .limit(limit) // Limits the results to the first 10
      .offset(offset) // Offsets which set of results is seen 1-10, 11-20, etc.
  },
  addPost(database, newPostObj) {
    return database
      .insert(newPostObj) // Insert the new post object
      .into('posts') // into the posts table
      .returning('*') // returning the object
  },
  searchPostsByTitle(database, title, limit, offset) {
    return database 
      .from('posts') // Queries movies table
      .select('*') // Selects all movies
      .where(database.raw(`LOWER(title) LIKE LOWER('%${title}%')`)) // Searches with lowercase title against lowercase param
      .limit(limit) // Limits the results to the first 10
      .offset(offset) // Offsets which set of results is seen 1-10, 11-20, etc.
  }
  
}

module.exports = PostsService;