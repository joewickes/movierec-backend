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

  before('clean the table', () => db.raw('truncate table movies restart identity cascade')); // truncate table users restart identity cascade

  afterEach('cleanup', () => db.raw('truncate table movies restart identity cascade'));

  describe('POST /api/votes', function() {

    const users = {
      username: "dGVzdFBAc3N3MHJk",
      email: "dGVzdGVtYWlsQHRlc3RlbWFpbC5jb20=",
      password: "dGVzdFBAc3N3MHJk"
    }

    const movies = [
      {original_title: 'Test Movie 1', year: 2003, genre: 'Thriller'},
      {original_title: 'Test Movie 2', year: 2003, genre: 'Thriller'},
      {original_title: 'Test Movie 3', year: 2003, genre: 'Thriller'},
      {original_title: 'Test Movie 4', year: 2003, genre: 'Thriller'},
      {original_title: 'Test Movie 5', year: 2003, genre: 'Thriller'},
      {original_title: 'Test Movie 6', year: 2003, genre: 'Thriller'},
      {original_title: 'Test Movie 7', year: 2003, genre: 'Thriller'},
      {original_title: 'Test Movie 8', year: 2003, genre: 'Thriller'},
      {original_title: 'Test Movie 9', year: 2003, genre: 'Thriller'},
      {original_title: 'Test Movie 10', year: 2003, genre: 'Thriller'},
    ]
    
    const posts = [
      {title: 'asdf', movie_id: 1, user_id: 1},
      {title: 'asdf', movie_id: 2, user_id: 1},
      {title: 'asdf', movie_id: 4, user_id: 1},
      {title: 'asdf', movie_id: 7, user_id: 1},
      {title: 'asdf', movie_id: 9, user_id: 1}
    ];

    beforeEach('Populate users, movies, and posts tables', () => {
      return db
        .into('users')
        .insert(users)
        .then(() => {
          return db
            .into('movies')
            .insert(movies)
            .then(() => {
              return db
                .into('posts')
                .insert(posts)
              ;
            })
          ;
        })
      ;
    })

    context('Given type addNewVote', function() {
      
      it('should return a 201 with vote data', () => {
        return supertest(app)
          .post('/api/votes')
          .send({
            type: 'addNewVote',
            voteData: {
              value: 1,
              post_id: 1,
              userid: 1
            }
          }).expect(result => {
            console.log(result.body);
            expect(result.status).to.equal(201);
            expect(result.body[0].value).to.equal(1);
            expect(result.body[0].userid).to.equal(1);
          })
        ;
      })
    });

    context('Given type getVoteId', function() {

      it('should return a 201 with the id', () => {
        
        return supertest(app)
          .post('/api/votes')
          .send({
            type: 'addNewVote',
            voteData: {
              value: 1,
              post_id: 1,
              userid: 1
            }
          }).expect(result => {
            console.log(result.body);
            expect(result.status).to.equal(201);
            expect(result.body[0].value).to.equal(1);
            expect(result.body[0].userid).to.equal(1);
          })
          .then(() => {
            return supertest(app)
              .post('/api/votes')
              .send({
                type: 'getVoteId',
                voteData: {
                  value: 1,
                  post_id: 1,
                  userid: 1
                }
              })
              .expect(newVoteRes => {
                console.log(newVoteRes);
                expect(newVoteRes.status).to.equal(200);
                expect(newVoteRes.body).to.equal(1);
              })
            ;
          });
      });
    });
  });
});