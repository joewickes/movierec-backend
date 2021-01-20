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

  describe('GET /api/movies', function() {

    context('Given a populated db and matches', function() {
      
      const movies = [
        {original_title: 'A test movie 1', year: 2001, genre: 'Action'},
        {original_title: 'A test movie 2', year: 2002, genre: 'Mystery'},
        {original_title: 'A test movie 3', year: 2003, genre: 'Thriller'},
        {original_title: 'A test movie 4', year: 2004, genre: 'Action'},
        {original_title: 'A test movie 5', year: 2005, genre: 'Action'},
        {original_title: 'A test movie 6', year: 2006, genre: 'Action'},
        {original_title: 'A test movie 7', year: 2007, genre: 'Action'},
        {original_title: 'A test movie 8', year: 2008, genre: 'Action'},
        {original_title: 'A test movie 9', year: 2009, genre: 'Action'},
        {original_title: 'A test movie 10', year: 2001, genre: 'Action'},
        {original_title: 'A test movie 11', year: 2005, genre: 'Action'}
      ];
      
      before('populate the db', () => {
        return db
        .into('movies')
        .insert(movies)
      });
      
      it('returns a group of 10 movies containing the keyword searched', () => {

        return supertest(app)
          .get('/api/movies?search=movie')
          .expect(movieResults => {

            const movieRes = movieResults.body;

            expect(movieRes.length <= 10).to.equal(true);

            const checkIfMoviesMatch = () => {
              for (let i = 0; i < movieRes.length; i++) {
                if (!movieRes[i].original_title.includes('movie')) {
                  return false;
                } else if (i === (movieRes.length - 1) && movieRes[i].original_title.includes('movie')) {
                  return true;
                }
              }
            }

            expect(checkIfMoviesMatch()).to.equal(true);
          })
        ;
      });
    });
  });

  describe('POST /api/movies', function() {
    
    const newMovieObj = {
      original_title: "Test Movie Title",
      year: 2001,
      genre: "Action",
    }
    
    it('responds with a 201 when given a yes', () => {
      
      this.retries(3);

      const testUser = {
        username: "dGVzdHVzZXI=",
        email: "dGVzdGVtYWlsQHRlc3RlbWFpbC5jb20=",
        password: "dGVzdFBAc3N3MHJk",
      };

      return supertest(app)
        .post('/api/users')
        .send(testUser)
        .expect(201)
        .then(() => {
          return supertest(app)
            .post('/api/movies')
            .send({"newMovieObj": newMovieObj, "yn": "Yes", "user_id": 1}) // new movie object
            .expect(201) //201
        })
      ;
    })

    it('responds with a 201 when given a no', () => {
      return supertest(app)
        .post('/api/movies')
        .send({"newMovieObj": newMovieObj, "yn": "No", "user_id": 1}) // new movie object
        .expect(201) //201
    })
  });

  describe('GET /api/movies/:movie_id', function() {

    const movie = {
      original_title: 'A test movie 1', year: 2001, genre: 'Action'
    }

    before('populate the db', () => {
      return db
      .into('movies')
      .insert(movie)
    });

    it('should return the movie information matching the id', () => {
      return supertest(app)
        .get('/api/movies/1')
        .expect(result => {
          expect(result.body.original_title).to.equal(movie.original_title);
          expect(result.body.year).to.equal(movie.year)
        })
    })
  });
});