import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import knex from "knex";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const db = knex({
  client: "pg",
  connection: {
    connectionString: "postgres://njjrdeelxjupud:f3d4cbf4d0ba33a1a24f3ca08d69225d00a133475552816dc2d9bfe8d6d46881@ec2-54-161-255-125.compute-1.amazonaws.com:5432/d7elrjgg32kujo"
  },
});

app.use(cors());

app.get("/", (req, res) => {
  // res.send(db.users);
  db.select("*")
  .from("users")
  .then((movie) => {
    res.json(movie);
  });
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
    title: title,
  })
    .into("movies")
    .then((user) => {
      res.json(user[0]);
    })
    .catch((err) => {
      res.status(400).json("erorr");
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
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
            res.json({accessToken: accessToken});
          })
          .catch((err) => res.status(400).json("unable to get user"));
      } else {
        res.status(400).json("wrong credentials");
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
    }).catch((err) => res.status(400).json("unable to register"));
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

app.listen(process.env.PORT || 3000, () => {
  console.log(process.env.PORT);
});
