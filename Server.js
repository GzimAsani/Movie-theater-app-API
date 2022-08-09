import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Working");
});

app.post("/signin", (req, res) => {
  res.json("Working");
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
