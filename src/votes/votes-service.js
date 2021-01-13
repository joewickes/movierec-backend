// Dependencies
const xss = require('xss'); // For sterilizing strings

const VotesService = {

  findVoteId(database, userid, post_id) {
    return database('votes')
      .returning('id')
      .where('userid', '=', userid)
      .andWhere('post_id', '=', post_id)
    ;
  },

  // GET VOTE COUNT (SELECT ALL WITH THE MATCHING ID)
  getVotes(database, voteId) { // Knex instance to the database
    return database  // SELECT SUM(nameOfColumn) from tableName
      .select('*')
      .from('votes') // Queries votes table
      // .sum('value')
      // .innerJoin('posts', 'votes.post_id', '=', 'posts.id') // InnerJoin newTable on primary key = secondTableName foreign column
      // .where(`votes.${voteId}`, 'posts.id') // WHERE POST ID MATCHES POST (JOIN POSTS AND VOTES AND COUNT LEFT TABLE)
    ;
  },
  addVote(database, newVoteObj) {
    console.log('addvote backend', newVoteObj)

    return database('votes') // into the votes table
      .insert(newVoteObj) // Insert the new vote object
      .returning('*') // returning the object
  },
  updateVote(database, id, updatedVoteObj) {
    console.log('updateVoteObj', updatedVoteObj);

    return database('votes')
      .where('id', '=', id)
      .update(updatedVoteObj)
  },
  getVote(database, id) {
    return database('votes')
      .where('id', '=', id)
  }
  
}

module.exports = VotesService;