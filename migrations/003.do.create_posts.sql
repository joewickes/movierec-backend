CREATE TABLE posts (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  movie_id INTEGER REFERENCES movies(id) NOT NULL,
  votecount INTEGER NOT NULL,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  date_created TIMESTAMPTZ DEFAULT now() NOT NULL
);
