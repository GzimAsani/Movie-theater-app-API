import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import knex from "knex";
import bcrypt, { hash } from "bcrypt";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "123",
    database: "movieapp_database",
  },
});

app.get('/', (req, res)=> { res.send(db.users) })

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
        .then(loginUser => {
          return trx('users')
            .returning('*')
            .insert({
              username: loginUser[0].username,
              email: email,
              joined: new Date()
            })
            .then(user => {
              res.json(user[0]);
            })
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
    .where({
      id: id,
    })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("Not found");
      }
    });
});

app.listen(3000);

//  QITO JON PATH QE DUHET ME I KRIJU E TANI ME I LIDH ME FRONT-END
//  BONE NIHER NPM INSTALL PER ME I INSTALU KTO dependencies QKA NA VYN
// /signin --> POST success/fail
// /register --> POST = user
// /profile/:userID --> GET = user
// /dashboard --> GET = admin
