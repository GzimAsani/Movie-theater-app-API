import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import knex from "knex";
import bcrypt, { hash } from "bcrypt";

const app = express();
app.use(bodyParser.json());

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "123",
    database: "movieapp_database",
  },
});

app.use(cors());

app.get("/", (req, res) => {
  res.send(db.users);
});

app.get("/:id/movies", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("movies")
    .where({ movieid: id })
    .then((movie) => {
      if (movie.length) {
        res.json(movie[0]);
      } else {
        res.status(400).json("Movie Not found");
      }
    })
    .catch((err) => res.status(400).json("error getting movie"));
});

app.get("/movies", (req, res) => {
  db.select("*")
    .from("movies")
    .then((movie) => {
      res.json(movie);
    });
});

app.post("/movies", (req, res) => {
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
    Title: title,
  })
    .into("movies")
    .then((user) => {
      res.json(user[0]);
    });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.select("username", "hash")
    .from("login")
    .where("username", "=", username)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("username", "=", req.body.username)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("unable to get user"));
      } else {
        res.status(400).json("npm");
      }
    })
    .catch((err) => res.status(400).json("wrong credentials"));
});

app.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  bcrypt.hash(password, 10, function (err, hash) {
    db.transaction((trx) => {
      trx
        .insert({
          hash: hash,
          username: username,
        })
        .into("login")
        .returning("username")
        .then((loginUser) => {
          return trx("users")
            .returning("*")
            .insert({
              username: loginUser[0].username,
              email: email,
              joined: new Date(),
            })
            .then((user) => {
              res.json(user[0]);
            });
        })
        .then(trx.commit)
        .catch(trx.rollback);
    }).catch((err) => res.status(400).json("1unable to register"));
  });
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      console.log(user);
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("Not found");
      }
    })
    .catch((err) => res.status(400).json("error getting user"));
});

app.listen(process.env.PORT || 3000);
