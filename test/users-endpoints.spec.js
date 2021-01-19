const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');

const app = require('../src/app');
const config = require('../src/config');

describe('Users (and Auth) Endpoints', function() {

  let db;

  before('make knex instance', () => {

    db = knex({
      client: 'pg',
      connection: config.TEST_DATABASE_URL,
    });

    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db.raw('truncate table users restart identity cascade'));
  
  afterEach('cleanup', () => db.raw('truncate table users restart identity cascade'));

  describe('POST /api/users', function() {

    const testUser = {
      username: "dGVzdHVzZXI=",
      email: "dGVzdGVtYWlsQHRlc3RlbWFpbC5jb20=",
      password: "dGVzdFBAc3N3MHJk",
    };

    context('Given no matching user in the db', function() {

      it('responds with a 201 if the user was created', () => {
        return supertest(app)
          .post('/api/users')
          .send(testUser)
          .expect(201);
      });

    });
  });
  
  // Test after sucessfully inserting user
  describe('POST /api/auth', function() {

    context('Given a match in the database', function() {

      const testUser = {
        username: "dGVzdHVzZXI=",
        email: "dGVzdGVtYWlsQHRlc3RlbWFpbC5jb20=",
        password: "dGVzdFBAc3N3MHJk",
      };

      const testAuth = {
        username: "dGVzdHVzZXI=",
        password: "dGVzdFBAc3N3MHJk",
      };

      it('responds with the matching created token and user id', function() {

        return supertest(app)
          .post('/api/users')
          .send(testUser)
          .expect(201)
          .then(() => {

            return supertest(app)
              .post('/api/auth')
              .send(testAuth)
              .expect(tokenRes => {
                jwtRegex = /^.*\..*\..*$/;
                const jwtTest = jwtRegex.test(tokenRes.body.createdToken);

                expect(jwtTest).to.eql(true);
                expect(tokenRes.body.userId).to.eql(1);
              });
            })
          ;
        ;    
      });
    });
  });

  // Regex for JWT (all characters surrounding two periods) /^.*\..*\..*$/
})