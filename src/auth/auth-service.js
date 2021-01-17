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
    bcrypt.compare(password, hash)
      .then(comp => {
        return comp;
      });
    
  },
  createToken(subject, payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      algorithm: 'HS256',
    })
  },
}

module.exports = AuthService;