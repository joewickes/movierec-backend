const { expect } = require('chai');
const { default: expectCt } = require('helmet/dist/middlewares/expect-ct');

const knex = require('knex');
const supertest = require('supertest');

const app = require('../src/app');
const config = require('../src/config');

describe('Posts Endpoints', function() {

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

    const votes = [
      {value: 0, post_id: 1, userid: 1},
      {value: 1, post_id: 2, userid: 1},
      {value: -1, post_id: 3, userid: 1},
      {value: 1, post_id: 4, userid: 1},
      {value: 0, post_id: 5, userid: 1},
    ]

    before('clean the table', () => db.raw('truncate table posts restart identity cascade')); // truncate table users restart identity cascade

    beforeEach('Populate users, movies, and posts tables', () => {
      console.log('populating now')
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
                .then(() => {
                  return db
                    .into('votes')
                    .insert(votes)
                  ;
                })
              ;
            })
          ;
        })
      ;
    });


    afterEach('cleanup votes', () => db.raw('truncate table votes restart identity cascade'));

    afterEach('cleanup posts', () => db.raw('truncate table posts restart identity cascade'));

    afterEach('cleanup movies', () => db.raw('truncate table movies restart identity cascade'));

    afterEach('cleanup users', () => db.raw('truncate table users restart identity cascade'));

    it('responds with 5 rows if where is homePageGet', () => {
      return supertest(app)
        .post('/api/posts')
        .send({
          where: 'homePageGet',
          offset: 0
        })
        .expect(resultingList => {

          expect(resultingList.body.length).to.equal(5);
        })
      ;
    });

    it('responds with matching rows to the search if where is homePageSearch', () => {
      return supertest(app)
        .post('/api/posts')
        .send({
          where: 'homePageSearch',
          title: 'Test',
          offset: 0
        })
        .expect(resultingList => {
          expect(resultingList.body.length).to.equal(5);
        })
      ;
    });

    it('responds with all 5 of the rows matching the filter if  where is homePageFilter', () => {
      return supertest(app)
        .post('/api/posts')
        .send({
          where: 'homePageFilter',
          userId: 1,
          genre: 'Thriller'
        })
        .expect(resultingList => {
          expect(resultingList.body.length).to.equal(5);
        })
      ;
    });

    it('responds with a 201 if it sucessfully created if where is addNewPost', () => {
      return supertest(app)
        .post('/api/posts')
        .send({
          where: 'addNewPost',
          newPostObj: {
            title: 'Test Movie 10',
            movie_id: 10,
            user_id: 1
          }
        })
        .expect(201)
      ;
    });

  });

  describe('GET /api/posts/:post_id', function() {
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
    });

    it('responds with a 200 and the matching post if found', () => {
      return supertest(app)
        .get('/api/posts/1')
        .expect(result => {
          expect(result.body[0].id).to.equal(1);
          expect(result.body[0].title).to.equal('asdf');
          expect(result.body[0].movie_id).to.equal(1);
          expect(result.body[0].user_id).to.equal(1);
        })
    });
  });
});