INSERT INTO users (username, email, password)
VALUES
('user1', 'user1@gmail.com', 'asdfasdf'),
('user2', 'user2@gmail.com', 'asdfasdf'),
('user3', 'user3@gmail.com', 'asdfasdf'),
('user4', 'user4@gmail.com', 'asdfasdf'),
('user5', 'user5@gmail.com', 'asdfasdf');

INSERT INTO movies (title_id, year, orignal_title)
VALUES
(1, 2012, 'Avengers'),
(2, 2014, 'Avengers 2'),
(3, 2016, 'Avengers 3'),
(4, 2018, 'Avengers 4'),
(5, 2020, 'Avengers 5');

INSERT INTO posts (title, description, movie_id, votecount, user_id)
VALUES
('post 1', 'A description of a movie', 1, 1, 1),
('post 2', 'A description of a movie', 2, 2, 2),
('post 3', 'A description of a movie', 3, 3, 3),
('post 4', 'A description of a movie', 4, 4, 4),
('post 5', 'A description of a movie', 5, 5, 5);

INSERT INTO votes (userid, value, post_id)
VALUES
(1, 2, 1),
(2, 3, 2),
(3, 0, 3),
(4, 1, 4),
(5, 4, 5);