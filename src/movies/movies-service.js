// Dependencies
const xss = require('xss'); // For sterilizing strings

const MoviesService = {
  getMovies(database, param, limit, offset) { // Knex instance to the database
    return database 
      .from('movies') // Queries movies table
      .select('*') // Selects all movies
      .where(database.raw(`LOWER(original_title) LIKE LOWER('%${param}%')`)) // Searches with lowercase title against lowercase param
      .limit(limit) // Limits the results to the first 10
      .offset(offset) // Offsets which set of results is seen 1-10, 11-20, etc.
    ;
  },
  getSingleMovie(database, id) {
    return database
      .from('movies')
      .select('id', 'original_title', 'year')
      .where('id', '=', `${id}`)
  },
  addMovie(database, newMovieObj) {
    return database
      .insert(newMovieObj) // Insert the new movie object
      .into('movies') // into the movies table
      .returning('id') // returning the object
  }
  
}

module.exports = MoviesService;