require('dotenv').config();

console.log('tdburl', process.env.TEST_DATABASE_URL)
console.log('dburl', process.env.DATABASE_URL)
console.log('nodeenv', process.env.NODE_ENV)
console.log()

module.exports = {
  "migrationDirectory": "migrations",
  "driver": "pg",
  "connectionString": (process.env.NODE_ENV === 'test')
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL,
}
