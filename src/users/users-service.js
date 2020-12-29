const UsersService = {
  findUser(database, username) {
    return database('users')
      .where({username})
      .first()
      .then(user => !!user)
  },
  getUsers(database, param, limit, offset) { // Knex instance to the database
    return database 
      .from('movies') // Queries movies table
      .select('*') // Selects all movies
      .where(database.raw(`LOWER(original_title) LIKE LOWER('%${param}%')`)) // Searches with lowercase title against lowercase param
      .limit(limit) // Limits the results to the first 10
      .offset(offset) // Offsets which set of results is seen 1-10, 11-20, etc.
    ;
  },
  addUser(database, newUserObj) {
    return database
      .insert(newUserObj) // Insert the new user object
      .into('users') // into the users table
      .returning('*') // returning the object
  }
  
}

module.exports = UsersService;