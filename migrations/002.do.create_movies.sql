CREATE TABLE IF NOT EXISTS movies(
  id             VARCHAR(10) NOT NULL PRIMARY KEY,
  original_title TEXT NOT NULL,
  year           INTEGER  NOT NULL,
  genre          TEXT NOT NULL
);

