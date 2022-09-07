import express  from "express";
import { login, register } from "../controllers/auth.js";
import knex from "knex";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
const db = knex({
    client: "pg",
    connection: {
      host: "127.0.0.1",
      user: "postgres",
      password: "123",
      database: "movieapp_database",
    },
  });

router.post("/register", register(db,bcrypt));
router.post("/login", login(db,bcrypt,jwt));

export default router;