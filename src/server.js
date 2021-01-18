// Dependencies
const knex = require('knex');

// Express instance
const app = require('./app');

// Config Files
const { PORT, DATABASE_URL } = require('./config');

// Assign knex instance to db
const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
})

// Connect the db instance to app.js to use with express
app.set('db', db);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});