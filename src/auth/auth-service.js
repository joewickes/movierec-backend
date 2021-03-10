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
    bcrypt.hash(password, 12).then((r) => {
      console.log('r', r);
      console.log('heading into comp');
      if (r === hash) {
        console.log('same');
      } else {
        console.log('DIFF')
      }
    console.log(password);
    console.log(hash);
    bcrypt.hash(parsedPwd, 12).then((r) => {
      console.log(r);
      console.log(bcrypt.compare(password, hash))
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