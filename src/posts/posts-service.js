const usersRouter = require("../users/users-router")

const PostsService = {
  getPosts(database, userId, limit, offset) {
    if (!userId) {
      userId = 'null';
    }

    return database
      .raw(`
        select 
        votes
        , title
        , username
        , date_created 
        , post_id as id
        ,case when (
          select votes.value 
          from votes 
            inner join posts on votes.post_id = posts.id 
          where 
            votes.userid = ${userId}
            and posts.movie_id = n.movie_id
          ) is not null
          then (
            select value
            from votes 
              inner join posts on votes.post_id = posts.id
            where 
              votes.userid = ${userId}
              and posts.movie_id  = n.movie_id
          ) 
          else null end as myvote
      from (	
        select 
          SUM(v.value) as votes
          ,m.original_title as title
          ,m.id as movie_id
          ,u.username
          ,p.date_created 
          ,p.id as post_id
        from posts p
          inner join movies m on p.movie_id = m.id 
          inner join votes v on p.id = v.post_id 
          inner join users u on p.user_id  = u.id 
        group by m.original_title , u.username, m.id, p.date_created, p.id
      ) n
      order by n.date_created desc
      limit ${limit} offset ${offset}
    `)
  },
  getSinglePost(database, id) {
    return database
      .select('*')
      .from('posts')
      .where('posts.movie_id', '=', `${id}`)
  },
  addPost(database, newPostObj) {
    return database
      .insert(newPostObj) // Insert the new post object
      .into('posts') // into the posts table
      .returning('id')
  },
  searchPostsByTitle(database, userId, title, limit, offset) {
    if (!userId) {
      userId = 'null';
    }
    
    return database
      .raw(`
        select 
        votes
        , title
        , username
        , date_created 
        , post_id as id
        ,case when (
          select votes.value 
          from votes 
            inner join posts on votes.post_id = posts.id 
          where 
            votes.userid = ${userId}
            and posts.movie_id = n.movie_id
          ) is not null
          then (
            select value
            from votes 
              inner join posts on votes.post_id = posts.id
            where 
              votes.userid = ${userId}
              and posts.movie_id  = n.movie_id
          ) 
          else null end as myvote
      from (	
        select 
          SUM(v.value) as votes
          ,m.original_title as title
          ,m.id as movie_id
          ,u.username
          ,p.date_created 
          ,p.id as post_id
        from posts p
          inner join movies m on p.movie_id = m.id 
          inner join votes v on p.id = v.post_id 
          inner join users u on p.user_id  = u.id 
        group by m.original_title , u.username, m.id, p.date_created, p.id
      ) n
      where LOWER(n.title) LIKE LOWER('%${title}%')
      order by n.date_created desc
      limit ${limit} offset ${offset}
    `)
    // return database 
    //   .select('posts.id', 'movies.original_title as title', 'users.username')
    //   .sum({votes: 'votes.value'})
    //   .groupBy('posts.id', 'movies.original_title', 'users.username')
    //   .from('posts') // Queries movies table
    //   .innerJoin('users', 'posts.user_id', 'users.id')
    //   .innerJoin('movies', 'posts.movie_id', 'movies.id')
    //   .innerJoin('votes', 'posts.id', 'votes.post_id')
    //   .where(database.raw(`LOWER(movies.original_title) LIKE LOWER('%${title}%')`)) // Searches with lowercase title against lowercase param
    //   .orderBy('movies.original_title', 'asc') // Sorts by most recent date_created
    //   .limit(limit) // Limits the results to the first 10
    //   .offset(offset) // Offsets which set of results is seen 1-10, 11-20, etc.
  },
  searchPostsByGenre(database, userId, genre, limit, offset) {
    if (!userId) {
      userId = 'null';
    }
    
    return database
      .raw(`
        select 
        votes
        , title
        , username
        , date_created 
        , post_id as id
        ,case when (
          select votes.value 
          from votes 
            inner join posts on votes.post_id = posts.id 
          where 
            votes.userid = ${userId}
            and posts.movie_id = n.movie_id
          ) is not null
          then (
            select value
            from votes 
              inner join posts on votes.post_id = posts.id
            where 
              votes.userid = ${userId}
              and posts.movie_id  = n.movie_id
          ) 
          else null end as myvote
      from (	
        select 
          SUM(v.value) as votes
          ,m.original_title as title
          ,m.id as movie_id
          ,u.username
          ,p.date_created 
          ,p.id as post_id
        from posts p
          inner join movies m on p.movie_id = m.id 
          inner join votes v on p.id = v.post_id 
          inner join users u on p.user_id  = u.id 
        where LOWER(m.genre) LIKE LOWER('%${genre}%')
        group by m.original_title , u.username, m.id, p.date_created, p.id
      ) n
      order by n.votes desc
      limit ${limit} offset ${offset}
    `)


    // return database
    //   .select('posts.id', 'movies.original_title as title', 'users.username')
    //   .sum({votes: 'votes.value'})
    //   .groupBy('posts.id', 'movies.original_title', 'users.username')
    //   .from('posts') // Queries movies table
    //   .innerJoin('users', 'posts.user_id', 'users.id')
    //   .innerJoin('movies', 'posts.movie_id', 'movies.id')
    //   .innerJoin('votes', 'posts.id', 'votes.post_id')
    //   .where(database.raw(`LOWER(movies.genre) LIKE LOWER('%${genre}%')`)) // Searches with lowercase title against lowercase param
    //   .orderByRaw('sum(votes.value) DESC')
    //   .limit(limit) // Limits the results to the first 10
    //   .offset(offset) // Offsets which set of results is seen 1-10, 11-20, etc.
  }
  
}

module.exports = PostsService;