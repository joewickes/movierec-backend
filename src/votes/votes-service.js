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
  addVote(database, newVoteObj) {

    return database('votes') // into the votes table
      .insert(newVoteObj) // Insert the new vote object
      .returning('*') // returning the object
  },
  updateVote(database, id, updatedVoteObj) {

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