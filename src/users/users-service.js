const UsersService = {
  findUser(database, username) {
    return database('users')
      .where({username})
      .first()
      .then(user => !!user)
  },
  addUser(database, newUserObj) {
    return database
      .insert(newUserObj) // Insert the new user object
      .into('users') // into the users table
      .returning('*') // returning the object
  }
  
}

module.exports = UsersService;