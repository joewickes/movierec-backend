const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');

const app = require('../src/app');
const config = require('../src/config');

describe('Movies Endpoints', function() {

  let db;

  before('make knex instance', () => {

    db = knex({
      client: 'pg',
      connection: config.TEST_DATABASE_URL,
    });

    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw('truncate table posts restart identity cascade')); // truncate table users restart identity cascade

  afterEach('cleanup', () => db.raw('truncate table posts restart identity cascade'));

  describe('POST /api/posts', function() {

    context('When the database is populated', function() {

      context('When where is homePageGet', function() {
        
        //populate the movies db
        //populate the users db
        //populate the posts db
        //populate the votes db
        

        const getRequest = {
          where: 'homePageGet',
          userId: 1
        }
        
        return supertest(app)
          .post('/api/posts')
          .send()
        ;
      });

      context('When where is homePageSearch', function() {
        return supertest(app)
          .post('/api/posts')
          .send()
        ;
      });

      context('When where is homePageFilter', function() {
        return supertest(app)
          .post('/api/posts')
          .send()
        ;
      });

      context('When where is addNewPost', function() {
        return supertest(app)
          .post('/api/posts')
          .send()
        ;
      });
    });
  });

  describe('GET api/posts/:post_id', function() {

  });
});
