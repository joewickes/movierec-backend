CREATE TABLE IF NOT EXISTS votes (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  userid INTEGER REFERENCES users(id) NOT NULL,
  value INTEGER NOT NULL,
  post_id INTEGER REFERENCES posts(id) NOT NULL,
  date_created TIMESTAMPTZ DEFAULT now() NOT NULL
);
