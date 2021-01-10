console.log('config =>', process.env.DATABASE_URL);
module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://dunder_mifflin@localhost/movierec',
  TEST_DATABASE_URL: process.env.DATABASE_URL || 'postgresql://dunder_mifflin@localhost/movierec-test',
  JWT_SECRET: process.env.JWT_SECRET || '',
}