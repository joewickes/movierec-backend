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
    console.log('PWD being compared', password);
    console.log('hash being compared', hash);
    const result = bcrypt.compare(password, hash);
    return result;
  },
  createToken(subject, payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      algorithm: 'HS256',
    })
  },
}

module.exports = AuthService;