// Dependencies
const xss = require('xss'); // For sterilizing strings

const VotesService = {

  // GET VOTE COUNT (SELECT ALL WITH THE MATCHING ID)
  getVotes(database, voteId) { // Knex instance to the database
    return database  // SELECT SUM(nameOfColumn) from tableName
      .from('votes') // Queries votes table
      .sum('value')
      .innerJoin('posts', 'votes.post_id', '=', 'posts.id') // InnerJoin newTable on primary key = secondTableName foreign column
      .where(`votes.${voteId}`, 'posts.id') // WHERE POST ID MATCHES POST (JOIN POSTS AND VOTES AND COUNT LEFT TABLE)
    ;
  },
  addVote(database, newVoteObj) {
    return database
      .insert(newVoteObj) // Insert the new vote object
      .into('votes') // into the votes table
      .returning('*') // returning the object
  }
  
}

module.exports = VotesService;