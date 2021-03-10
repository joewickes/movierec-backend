const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const AuthService = {
  getUser(database, username) {
    return database('users')
      .where({username})
      .first()
    ;
  },
  comparePasswords(password, hash) {
    console.log(password);
    console.log(hash);
    bcrypt.hash(parsedPwd, 12).then((r) => {
      console.log(r);
      if (r === hash) {
        console.log('same');
      } else {
        console.log('DIFF')
      }
    })
    
    
  },
  createToken(subject, payload) {

    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      algorithm: 'HS256',
    })
  },
}

module.exports = AuthService;