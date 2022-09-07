import express  from "express";
import { login, register } from "../controllers/auth.js";
import knex from "knex";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
const db = knex({
  client: "pg",
  connection: {
    connectionString: "postgres://njjrdeelxjupud:f3d4cbf4d0ba33a1a24f3ca08d69225d00a133475552816dc2d9bfe8d6d46881@ec2-54-161-255-125.compute-1.amazonaws.com:5432/d7elrjgg32kujo"
  },
});

router.post("/register", register(db,bcrypt));
router.post("/login", login(db,bcrypt,jwt));

export default router;