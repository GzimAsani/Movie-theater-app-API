import express from "express";
import knex from "knex";
import { createMovie, deleteMovie, getMovie, getMovies, updateMovie } from "../controllers/movie.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();
const db = knex({
  client: "pg",
  connection: {
    connectionString: "postgres://njjrdeelxjupud:f3d4cbf4d0ba33a1a24f3ca08d69225d00a133475552816dc2d9bfe8d6d46881@ec2-54-161-255-125.compute-1.amazonaws.com:5432/d7elrjgg32kujo"
  },
});


router.post("/",verifyAdmin, createMovie(db));

router.put("/:id",verifyAdmin, updateMovie(db));

router.delete("/:id",verifyAdmin, deleteMovie(db));

router.get("/:id", getMovie(db));

router.get("/", getMovies(db));

export default router;
