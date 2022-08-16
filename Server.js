import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = {
  users: [
    {
      id: "123",
      username: "Test1",
      name: "Test1",
      email: "test1@gmail.com",
      password: "123456",
      date: new Date(),
    },
    {
      id: "124",
      user: "Test2",
      name: "Test2",
      email: "test2@gmail.com",
      password: "qwerty",
      date: new Date(),
    },
  ],
};

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/login", (req, res) => {
  if (
    req.body.username === database.users[0].username &&
    req.body.password === database.users[0].password
  ) {
    res.json("Working");
  } else {
    res.status(404).json("error login in");
  }
});

app.post("/register", (req, res) => {
  res.json("Working");
});

app.listen(3000);

//  QITO JON PATH QE DUHET ME I KRIJU E TANI ME I LIDH ME FRONT-END
//  BONE NIHER NPM INSTALL PER ME I INSTALU KTO dependencies QKA NA VYN
// /signin --> POST success/fail
// /register --> POST = user
// /profile/:userID --> GET = user
// /dashboard --> GET = admin
