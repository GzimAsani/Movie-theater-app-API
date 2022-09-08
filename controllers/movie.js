export const createMovie = (db) => async (req, res, next) => {
  const {
    description,
    duration,
    movielanguage,
    releasedate,
    country,
    genre,
    movieimg,
    posterimg,
    title,
  } = req.body;

  db.insert({
    description: description,
    duration: duration,
    movielanguage: movielanguage,
    releasedate: releasedate,
    country: country,
    genre: genre,
    movieimg: movieimg,
    posterimg: posterimg,
    title: title,
  })
    .into("movies")
    .returning("*")
    .then((movie) => {
      res.json(movie[0]);
    })
    .catch((err) => {
      next(err);
    });
};

export const updateMovie = (db) => async (req, res, next) => {
  const { id } = req.params;
  db("movies")
    .where({ movieid: id })
    .update(req.body)
    .returning("*")
    .then((movie) => {
      if (movie.length) {
        res.status(200).json(movie[0]);
      } else {
        res.status(404).json("This movie does not exist");
      }
    })
    .catch((err) => next(err));
};

export const deleteMovie = (db) => async (req, res, next) => {
  const { id } = req.params;
  try {
    db("movies")
      .where({ movieid: id })
      .del()
      .then(res.status(200).json("Movie has been deleted"));
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getMovie = (db) => async (req, res, next) => {
  const { id } = req.params;

  db.select("*")
    .from("movies")
    .where({ movieid: id })
    .then((movies) => {
      if (movies.length) {
        res.json(movies[0]);
      } else {
        res.status(400).json("This movie does not exist");
      }
    })
    .catch((err) => {
      next(createError(401, "Invalid credientials"));
    });
};

export const getMovies = (db) => async (req, res, next) => {
  db.select("*")
    .from("movies")
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      next(createError(401, "Invalid credientials"));
    });
};
