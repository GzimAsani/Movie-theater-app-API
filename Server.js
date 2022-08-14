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
      name: "Gentian",
      email: "gentian@gmail.com",
      password: "1234",
      date: new Date(),
    },
    {
      id: "124",
      name: "Test",
      email: "test@gmail.com",
      password: "qwerty",
      date: new Date(),
    },
  ],
};

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  if (
    req.body.email === database.users[0].email &&
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
