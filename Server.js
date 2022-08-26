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
    connectionString : process.env.DATABASE_URL,
    ssl: true,
  },
});
app.use(cors());

app.get("https://hidden-lowlands-43310.herokuapp.com//", (req, res) => {
  res.send("its working");
});

app.get("https://hidden-lowlands-43310.herokuapp.com//:id/movies", (req, res) => {
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

app.get("https://hidden-lowlands-43310.herokuapp.com//movies", (req, res) => {
  db.select("*")
    .from("movies")
    .then((movie) => {
      res.json(movie);
    });
});

app.post("https://hidden-lowlands-43310.herokuapp.com//movies", (req, res) => {
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

app.post("https://hidden-lowlands-43310.herokuapp.com//login", (req, res) => {
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

app.post("https://hidden-lowlands-43310.herokuapp.com//register", (req, res) => {
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
    }).catch((err) => res.status(400).json("unable to register"));
  });
});

app.get("https://hidden-lowlands-43310.herokuapp.com//profile/:id", (req, res) => {
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
